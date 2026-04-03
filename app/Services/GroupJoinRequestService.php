<?php

namespace App\Services;

use App\Enums\GroupMemberRole;
use App\Enums\JoinRequestStatus;
use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GroupJoinRequestService
{
    /**
     * Create or reopen a join request for the applicant.
     *
     * @throws ValidationException
     */
    public function submit(User $applicant, Group $group): GroupJoinRequest
    {
        if ($applicant->drp_id === null || (int) $applicant->drp_id !== (int) $group->drp_id) {
            throw ValidationException::withMessages([
                'join' => __('You may only request to join groups in your DRP.'),
            ]);
        }

        if ((int) $group->creator_id === (int) $applicant->id) {
            throw ValidationException::withMessages([
                'join' => __('You are already the group owner.'),
            ]);
        }

        if ($group->members()->where('users.id', $applicant->id)->exists()) {
            throw ValidationException::withMessages([
                'join' => __('You are already a member of this group.'),
            ]);
        }

        $existing = GroupJoinRequest::query()
            ->where('group_id', $group->id)
            ->where('user_id', $applicant->id)
            ->first();

        if ($existing !== null) {
            if ($existing->status === JoinRequestStatus::Pending) {
                throw ValidationException::withMessages([
                    'join' => __('You already have a pending request for this group.'),
                ]);
            }

            if ($existing->status === JoinRequestStatus::Accepted) {
                throw ValidationException::withMessages([
                    'join' => __('This join request was already accepted.'),
                ]);
            }

            $existing->update(['status' => JoinRequestStatus::Pending]);
            $existing->refresh();

            return $existing;
        }

        return GroupJoinRequest::query()->create([
            'group_id' => $group->id,
            'user_id' => $applicant->id,
            'status' => JoinRequestStatus::Pending,
        ]);
    }

    /**
     * Accept a pending request and add the user as a member.
     *
     * @throws ValidationException
     */
    public function accept(Group $group, GroupJoinRequest $joinRequest): void
    {
        if ((int) $joinRequest->group_id !== (int) $group->id) {
            abort(404);
        }

        DB::transaction(function () use ($group, $joinRequest): void {
            Group::query()->whereKey($group->id)->lockForUpdate()->firstOrFail();

            $lockedRequest = GroupJoinRequest::query()
                ->whereKey($joinRequest->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedRequest->status !== JoinRequestStatus::Pending) {
                throw ValidationException::withMessages([
                    'join_request' => __('This request is no longer pending.'),
                ]);
            }

            $applicant = User::query()->whereKey($lockedRequest->user_id)->lockForUpdate()->firstOrFail();

            if ($applicant->drp_id === null || (int) $applicant->drp_id !== (int) $group->drp_id) {
                throw ValidationException::withMessages([
                    'join_request' => __('The applicant is not in the same DRP as this group.'),
                ]);
            }

            $memberCount = $group->members()->count();

            if ($memberCount >= config('groups.max_members')) {
                throw ValidationException::withMessages([
                    'join_request' => __('This group is full.'),
                ]);
            }

            $lockedRequest->update(['status' => JoinRequestStatus::Accepted]);

            $group->members()->syncWithoutDetaching([
                $lockedRequest->user_id => ['role' => GroupMemberRole::Member->value],
            ]);
        });
    }

    /**
     * Decline a pending request.
     *
     * @throws ValidationException
     */
    public function decline(Group $group, GroupJoinRequest $joinRequest): void
    {
        if ((int) $joinRequest->group_id !== (int) $group->id) {
            abort(404);
        }

        DB::transaction(function () use ($group, $joinRequest): void {
            $lockedRequest = GroupJoinRequest::query()
                ->whereKey($joinRequest->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ((int) $lockedRequest->group_id !== (int) $group->id) {
                abort(404);
            }

            if ($lockedRequest->status !== JoinRequestStatus::Pending) {
                throw ValidationException::withMessages([
                    'join_request' => __('This request is no longer pending.'),
                ]);
            }

            $lockedRequest->update(['status' => JoinRequestStatus::Declined]);
        });
    }
}

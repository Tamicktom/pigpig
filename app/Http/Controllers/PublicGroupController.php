<?php

namespace App\Http\Controllers;

use App\Enums\JoinRequestStatus;
use App\Models\Drp;
use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class PublicGroupController extends Controller
{
    /**
     * Public group directory. Optional query: {@see drp_id} filters by DRP (non–soft-deleted only).
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'drp_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('drps', 'id')->whereNull('deleted_at'),
            ],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $query = Group::query()
            ->whereHas('drp')
            ->with(['drp:id,name,slug'])
            ->latest('id');

        if (! empty($validated['drp_id'])) {
            $query->where('drp_id', $validated['drp_id']);
        }

        $groups = $query->paginate(15)->through(function (Group $group): array {
            return [
                'id' => $group->id,
                'title' => $group->title,
                'drp' => $group->drp === null ? null : [
                    'id' => $group->drp->id,
                    'name' => $group->drp->name,
                    'slug' => $group->drp->slug,
                ],
            ];
        });

        $drpOptions = Drp::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->map(fn (Drp $drp): array => [
                'id' => $drp->id,
                'name' => $drp->name,
                'slug' => $drp->slug,
            ])
            ->values()
            ->all();

        return Inertia::render('groups/index', [
            'groups' => $groups,
            'filters' => [
                'drp_id' => isset($validated['drp_id']) ? (int) $validated['drp_id'] : null,
            ],
            'drpOptions' => $drpOptions,
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }

    /**
     * Public group detail with member display names only (no email or phone).
     */
    public function show(Request $request, Group $group): Response
    {
        $group->load([
            'drp:id,name,slug',
            'members' => fn ($query) => $query->select('users.id', 'users.name'),
        ]);

        if ($group->drp === null) {
            abort(404);
        }

        $user = $request->user();
        $viewer = null;

        if ($user instanceof User) {
            $isMember = $group->members->contains('id', $user->id);
            $isOwner = (int) $user->id === (int) $group->creator_id;

            $ownRequest = GroupJoinRequest::query()
                ->where('group_id', $group->id)
                ->where('user_id', $user->id)
                ->first();

            $hasPendingRequest = $ownRequest !== null && $ownRequest->status === JoinRequestStatus::Pending;

            $sameDrp = $user->drp_id !== null && (int) $user->drp_id === (int) $group->drp_id;

            $canRequestJoin = $sameDrp
                && ! $isMember
                && ! $isOwner
                && ! $hasPendingRequest
                && (
                    $ownRequest === null
                    || $ownRequest->status === JoinRequestStatus::Declined
                );

            if ($ownRequest?->status === JoinRequestStatus::Accepted && ! $isMember) {
                $canRequestJoin = false;
            }

            $ownerPendingJoinRequests = [];

            if ($isOwner) {
                $ownerPendingJoinRequests = GroupJoinRequest::query()
                    ->where('group_id', $group->id)
                    ->where('status', JoinRequestStatus::Pending)
                    ->with(['user:id,name'])
                    ->orderBy('id')
                    ->get()
                    ->map(fn (GroupJoinRequest $joinRequestRow): array => [
                        'id' => $joinRequestRow->id,
                        'user_name' => $joinRequestRow->user?->name ?? '',
                    ])
                    ->values()
                    ->all();
            }

            $viewer = [
                'is_member' => $isMember,
                'is_owner' => $isOwner,
                'has_pending_request' => $hasPendingRequest,
                'same_drp' => $sameDrp,
                'member_count' => $group->members->count(),
                'max_members' => config('groups.max_members'),
                'can_request_join' => $canRequestJoin,
                'pending_join_requests' => $ownerPendingJoinRequests,
            ];
        }

        return Inertia::render('groups/show', [
            'group' => [
                'id' => $group->id,
                'title' => $group->title,
                'drp' => [
                    'id' => $group->drp->id,
                    'name' => $group->drp->name,
                    'slug' => $group->drp->slug,
                ],
                'members' => $group->members->map(fn ($member): array => [
                    'id' => $member->id,
                    'name' => $member->name,
                ])->values()->all(),
            ],
            'viewer' => $viewer,
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}

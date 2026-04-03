<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Models\User;

class GroupPolicy
{
    /**
     * Public discovery: anyone may list groups (enforced at route level for read-only pages).
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Public discovery: anyone may view a single group’s public payload.
     */
    public function view(?User $user, Group $group): bool
    {
        return true;
    }

    public function create(?User $user): bool
    {
        return $user !== null && $user->drp_id !== null;
    }

    /**
     * Request to join a group (same DRP as the group; authenticated with DRP set).
     */
    public function requestJoin(User $user, Group $group): bool
    {
        if ($user->drp_id === null) {
            return false;
        }

        return (int) $user->drp_id === (int) $group->drp_id;
    }

    /**
     * Accept a join request (group owner only).
     */
    public function acceptJoinRequest(User $user, Group $group, GroupJoinRequest $joinRequest): bool
    {
        return (int) $user->id === (int) $group->creator_id
            && (int) $joinRequest->group_id === (int) $group->id;
    }

    /**
     * Decline a join request (group owner only).
     */
    public function declineJoinRequest(User $user, Group $group, GroupJoinRequest $joinRequest): bool
    {
        return (int) $user->id === (int) $group->creator_id
            && (int) $joinRequest->group_id === (int) $group->id;
    }

    public function update(?User $user, Group $group): bool
    {
        return $user !== null;
    }

    public function delete(?User $user, Group $group): bool
    {
        return $user !== null;
    }

    public function restore(?User $user, Group $group): bool
    {
        return $user !== null;
    }

    public function forceDelete(?User $user, Group $group): bool
    {
        return $user !== null;
    }
}

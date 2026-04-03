<?php

namespace App\Policies;

use App\Models\Group;
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
        return $user !== null;
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

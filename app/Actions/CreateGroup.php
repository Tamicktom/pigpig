<?php

namespace App\Actions;

use App\Enums\GroupMemberRole;
use App\Models\Group;
use App\Models\User;

/**
 * Creates a PI group in the creator's DRP and attaches the creator on `group_user` with role
 * {@see GroupMemberRole::Owner}. The `groups.creator_id` column mirrors that pivot row for quick
 * "who is responsible" lookups and matches the architecture's creator/responsible concept.
 */
class CreateGroup
{
    public function execute(User $creator, string $title, ?string $externalCommunicationLink = null): Group
    {
        return Group::query()->create([
            'drp_id' => $creator->drp_id,
            'creator_id' => $creator->id,
            'title' => $title,
            'external_communication_link' => $externalCommunicationLink,
        ]);
    }
}

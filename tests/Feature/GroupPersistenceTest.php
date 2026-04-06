<?php

namespace Tests\Feature;

use App\Actions\CreateGroup;
use App\Enums\GroupMemberRole;
use App\Models\Drp;
use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use LogicException;
use Tests\TestCase;

class GroupPersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_group_via_action_persists_drp_creator_and_owner_pivot(): void
    {
        $drp = Drp::factory()->create();
        $creator = User::factory()->create(['drp_id' => $drp->id]);
        $action = new CreateGroup;
        $group = $action->execute($creator, 'Machine Learning PI', 'https://example.org/chat');

        $this->assertDatabaseHas('groups', [
            'id' => $group->id,
            'drp_id' => $drp->id,
            'creator_id' => $creator->id,
            'title' => 'Machine Learning PI',
            'external_communication_link' => 'https://example.org/chat',
        ]);

        $this->assertDatabaseHas('group_user', [
            'group_id' => $group->id,
            'user_id' => $creator->id,
            'role' => GroupMemberRole::Owner->value,
        ]);
    }

    public function test_group_creation_fails_when_creator_drp_mismatches(): void
    {
        $drpA = Drp::factory()->create();
        $drpB = Drp::factory()->create();
        $creator = User::factory()->create(['drp_id' => $drpA->id]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Group DRP must match the creator DRP.');

        Group::query()->create([
            'drp_id' => $drpB->id,
            'creator_id' => $creator->id,
            'title' => 'Invalid',
        ]);
    }

    public function test_group_drp_id_cannot_be_changed_after_creation(): void
    {
        $group = Group::factory()->create();
        $otherDrp = Drp::factory()->create();

        $this->expectException(LogicException::class);
        $this->expectExceptionMessage('Group DRP cannot be changed after creation.');

        $group->update(['drp_id' => $otherDrp->id]);
    }

    public function test_creator_id_matches_owner_in_pivot(): void
    {
        $drp = Drp::factory()->create();
        $creator = User::factory()->create(['drp_id' => $drp->id]);
        $group = (new CreateGroup)->execute($creator, 'Topic');

        $pivotOwnerUserId = $group->members()
            ->wherePivot('role', GroupMemberRole::Owner->value)
            ->where('users.id', $creator->id)
            ->value('users.id');

        $this->assertSame($creator->id, $pivotOwnerUserId);
        $this->assertSame($creator->id, $group->creator_id);
    }

    public function test_group_factory_creates_coherent_group_and_owner_pivot(): void
    {
        $group = Group::factory()->create();

        $this->assertDatabaseHas('groups', [
            'id' => $group->id,
            'drp_id' => $group->drp_id,
            'creator_id' => $group->creator_id,
        ]);

        $creator = User::query()->findOrFail($group->creator_id);
        $this->assertSame((int) $group->drp_id, (int) $creator->drp_id);

        $this->assertDatabaseHas('group_user', [
            'group_id' => $group->id,
            'user_id' => $group->creator_id,
            'role' => GroupMemberRole::Owner->value,
        ]);
    }
}

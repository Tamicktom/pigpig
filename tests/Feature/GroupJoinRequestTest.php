<?php

namespace Tests\Feature;

use App\Enums\GroupMemberRole;
use App\Enums\JoinRequestStatus;
use App\Models\Drp;
use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class GroupJoinRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_request_then_accept_adds_member_with_member_role(): void
    {
        $drp = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drp->id]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $owner->id,
        ]);
        $applicant = User::factory()->create(['drp_id' => $drp->id]);

        $this->actingAs($applicant)
            ->from(route('groups.show', $group))
            ->post(route('groups.join-requests.store', $group))
            ->assertRedirect(route('groups.show', $group));

        $joinRequest = GroupJoinRequest::query()
            ->where('group_id', $group->id)
            ->where('user_id', $applicant->id)
            ->firstOrFail();

        $this->assertSame(JoinRequestStatus::Pending, $joinRequest->status);

        $this->actingAs($owner)
            ->from(route('groups.show', $group))
            ->post(route('groups.join-requests.accept', [$group, $joinRequest]))
            ->assertRedirect(route('groups.show', $group));

        $group->refresh();
        $this->assertTrue(
            $group->members()->where('users.id', $applicant->id)->exists(),
        );
        $pivotRole = $group->members()->where('users.id', $applicant->id)->first()->pivot->role;
        $this->assertSame(GroupMemberRole::Member->value, $pivotRole);
        $this->assertSame(
            JoinRequestStatus::Accepted,
            $joinRequest->fresh()->status,
        );
    }

    public function test_decline_does_not_add_member(): void
    {
        $drp = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drp->id]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $owner->id,
        ]);
        $applicant = User::factory()->create(['drp_id' => $drp->id]);

        $joinRequest = GroupJoinRequest::factory()->create([
            'group_id' => $group->id,
            'user_id' => $applicant->id,
            'status' => JoinRequestStatus::Pending,
        ]);

        $this->actingAs($owner)
            ->from(route('groups.show', $group))
            ->post(route('groups.join-requests.decline', [$group, $joinRequest]))
            ->assertRedirect(route('groups.show', $group));

        $this->assertFalse(
            $group->fresh()->members()->where('users.id', $applicant->id)->exists(),
        );
        $this->assertSame(JoinRequestStatus::Declined, $joinRequest->fresh()->status);
    }

    public function test_accept_when_group_is_full_returns_validation_error(): void
    {
        Config::set('groups.max_members', 2);

        $drp = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drp->id]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $owner->id,
        ]);
        $filler = User::factory()->create(['drp_id' => $drp->id]);
        $group->members()->attach($filler->id, [
            'role' => GroupMemberRole::Member->value,
        ]);
        $this->assertSame(2, $group->fresh()->members()->count());

        $applicant = User::factory()->create(['drp_id' => $drp->id]);
        $joinRequest = GroupJoinRequest::factory()->create([
            'group_id' => $group->id,
            'user_id' => $applicant->id,
            'status' => JoinRequestStatus::Pending,
        ]);

        $this->actingAs($owner)
            ->from(route('groups.show', $group))
            ->post(route('groups.join-requests.accept', [$group, $joinRequest]))
            ->assertRedirect(route('groups.show', $group))
            ->assertSessionHasErrors(['join_request']);

        $this->assertFalse(
            $group->fresh()->members()->where('users.id', $applicant->id)->exists(),
        );
    }

    public function test_applicant_from_other_drp_cannot_store_join_request(): void
    {
        $drpA = Drp::factory()->create();
        $drpB = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drpA->id]);
        $group = Group::factory()->create([
            'drp_id' => $drpA->id,
            'creator_id' => $owner->id,
        ]);
        $stranger = User::factory()->create(['drp_id' => $drpB->id]);

        $this->actingAs($stranger)
            ->post(route('groups.join-requests.store', $group))
            ->assertForbidden();

        $this->assertSame(
            0,
            GroupJoinRequest::query()->where('group_id', $group->id)->count(),
        );
    }

    public function test_duplicate_pending_store_returns_validation_error(): void
    {
        $drp = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drp->id]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $owner->id,
        ]);
        $applicant = User::factory()->create(['drp_id' => $drp->id]);

        GroupJoinRequest::factory()->create([
            'group_id' => $group->id,
            'user_id' => $applicant->id,
            'status' => JoinRequestStatus::Pending,
        ]);

        $this->actingAs($applicant)
            ->from(route('groups.show', $group))
            ->post(route('groups.join-requests.store', $group))
            ->assertRedirect(route('groups.show', $group))
            ->assertSessionHasErrors(['join']);
    }

    public function test_after_decline_applicant_can_request_again(): void
    {
        $drp = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drp->id]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $owner->id,
        ]);
        $applicant = User::factory()->create(['drp_id' => $drp->id]);

        $joinRequest = GroupJoinRequest::factory()->create([
            'group_id' => $group->id,
            'user_id' => $applicant->id,
            'status' => JoinRequestStatus::Declined,
        ]);

        $this->actingAs($applicant)
            ->from(route('groups.show', $group))
            ->post(route('groups.join-requests.store', $group))
            ->assertRedirect(route('groups.show', $group))
            ->assertSessionHasNoErrors();

        $this->assertSame(
            JoinRequestStatus::Pending,
            $joinRequest->fresh()->status,
        );
    }

    public function test_non_owner_cannot_accept(): void
    {
        $drp = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drp->id]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $owner->id,
        ]);
        $applicant = User::factory()->create(['drp_id' => $drp->id]);
        $intruder = User::factory()->create(['drp_id' => $drp->id]);

        $joinRequest = GroupJoinRequest::factory()->create([
            'group_id' => $group->id,
            'user_id' => $applicant->id,
            'status' => JoinRequestStatus::Pending,
        ]);

        $this->actingAs($intruder)
            ->post(route('groups.join-requests.accept', [$group, $joinRequest]))
            ->assertForbidden();
    }

    public function test_accept_with_join_request_for_another_group_returns_404(): void
    {
        $drp = Drp::factory()->create();
        $ownerA = User::factory()->create(['drp_id' => $drp->id]);
        $ownerB = User::factory()->create(['drp_id' => $drp->id]);
        $groupA = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $ownerA->id,
        ]);
        $groupB = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $ownerB->id,
        ]);
        $applicant = User::factory()->create(['drp_id' => $drp->id]);

        $joinRequestOnA = GroupJoinRequest::factory()->create([
            'group_id' => $groupA->id,
            'user_id' => $applicant->id,
            'status' => JoinRequestStatus::Pending,
        ]);

        $this->actingAs($ownerB)
            ->post(route('groups.join-requests.accept', [$groupB, $joinRequestOnA]))
            ->assertNotFound();
    }

    public function test_guest_is_redirected_to_login_when_storing_join_request(): void
    {
        $group = Group::factory()->create();

        $this->post(route('groups.join-requests.store', $group))
            ->assertRedirect(route('login'));
    }

    public function test_store_join_request_success_flash_is_localized_for_english(): void
    {
        $drp = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drp->id]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $owner->id,
        ]);
        $applicant = User::factory()->create(['drp_id' => $drp->id]);

        $this->actingAs($applicant)
            ->from(route('groups.show', $group))
            ->call(
                'POST',
                route('groups.join-requests.store', $group),
                [],
                ['locale' => 'en'],
            )
            ->assertRedirect(route('groups.show', $group))
            ->assertSessionHas('success', 'Join request sent.');
    }

    public function test_store_join_request_success_flash_is_localized_for_portuguese(): void
    {
        $drp = Drp::factory()->create();
        $owner = User::factory()->create(['drp_id' => $drp->id]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $owner->id,
        ]);
        $applicant = User::factory()->create(['drp_id' => $drp->id]);

        $this->actingAs($applicant)
            ->from(route('groups.show', $group))
            ->call(
                'POST',
                route('groups.join-requests.store', $group),
                [],
                ['locale' => 'pt_BR'],
            )
            ->assertRedirect(route('groups.show', $group))
            ->assertSessionHas('success', 'Solicitação de entrada enviada.');
    }
}

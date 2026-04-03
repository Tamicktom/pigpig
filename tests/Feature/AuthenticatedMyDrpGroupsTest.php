<?php

namespace Tests\Feature;

use App\Models\Drp;
use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticatedMyDrpGroupsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('my-groups.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_sees_only_groups_in_their_drp(): void
    {
        $drpA = Drp::factory()->create();
        $drpB = Drp::factory()->create();
        $user = User::factory()->create(['drp_id' => $drpA->id]);
        Group::factory()->create(['drp_id' => $drpA->id, 'title' => 'In A']);
        Group::factory()->create(['drp_id' => $drpB->id, 'title' => 'In B']);

        $this->actingAs($user)
            ->get(route('my-groups.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('my-groups/index')
                ->has('groups.data', 1)
                ->where('groups.data.0.title', 'In A')
                ->where('drp.name', $drpA->name));
    }

    public function test_authenticated_user_sees_empty_list_when_drp_has_no_groups(): void
    {
        $drp = Drp::factory()->create();
        $user = User::factory()->create(['drp_id' => $drp->id]);

        $this->actingAs($user)
            ->get(route('my-groups.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('my-groups/index')
                ->has('groups.data', 0));
    }

    public function test_group_row_reflects_membership_for_creator(): void
    {
        $drp = Drp::factory()->create();
        $user = User::factory()->create(['drp_id' => $drp->id]);
        Group::factory()->create(['drp_id' => $drp->id, 'creator_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('my-groups.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('groups.data.0.is_member', true));
    }

    public function test_group_row_reflects_non_member_in_same_drp(): void
    {
        $drp = Drp::factory()->create();
        $creator = User::factory()->create(['drp_id' => $drp->id]);
        $other = User::factory()->create(['drp_id' => $drp->id]);
        Group::factory()->create(['drp_id' => $drp->id, 'creator_id' => $creator->id]);

        $this->actingAs($other)
            ->get(route('my-groups.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('groups.data.0.is_member', false));
    }

    public function test_invalid_page_query_is_unprocessable_for_json_requests(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson(route('my-groups.index', ['page' => 0]))
            ->assertUnprocessable();
    }
}

<?php

namespace Tests\Feature;

use App\Models\Drp;
use App\Models\Group;
use App\Models\Polo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicGroupDiscoveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_groups_index(): void
    {
        $drp = Drp::factory()->create();
        Polo::factory()->create(['drp_id' => $drp->id]);
        Group::factory()->create(['drp_id' => $drp->id, 'title' => 'Public PI Group']);

        $response = $this->get(route('groups.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('groups/index')
            ->has('groups.data', 1)
            ->where('groups.data.0.title', 'Public PI Group')
            ->has('poloOptions')
            ->has('filters'));
    }

    public function test_guest_can_view_group_show(): void
    {
        $drp = Drp::factory()->create(['name' => 'DRP-X']);
        $group = Group::factory()->create(['drp_id' => $drp->id, 'title' => 'Detail Group']);

        $response = $this->get(route('groups.show', $group));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('groups/show')
            ->where('group.id', $group->id)
            ->where('group.title', 'Detail Group')
            ->where('group.drp.name', 'DRP-X')
            ->has('group.members', 1)
            ->where('viewer', null));
    }

    public function test_guest_sees_optional_member_social_urls_on_group_show(): void
    {
        $drp = Drp::factory()->create(['name' => 'DRP-Social']);
        $creator = User::factory()->create([
            'drp_id' => $drp->id,
            'linkedin_url' => 'https://linkedin.com/in/example-member',
        ]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $creator->id,
            'title' => 'Group With Social',
        ]);

        $response = $this->get(route('groups.show', $group));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('groups/show')
            ->where('group.members.0.linkedin_url', 'https://linkedin.com/in/example-member')
            ->where('group.members.0.instagram_url', null)
            ->where('group.members.0.twitter_url', null));
    }

    public function test_show_returns_404_when_drp_is_soft_deleted(): void
    {
        $drp = Drp::factory()->create();
        $group = Group::factory()->create(['drp_id' => $drp->id]);
        $drp->delete();

        $this->get(route('groups.show', $group))->assertNotFound();
    }

    public function test_index_excludes_groups_whose_drp_is_soft_deleted(): void
    {
        $drpActive = Drp::factory()->create();
        $drpTrashed = Drp::factory()->create();
        Group::factory()->create(['drp_id' => $drpActive->id, 'title' => 'Visible']);
        Group::factory()->create(['drp_id' => $drpTrashed->id, 'title' => 'Hidden']);
        $drpTrashed->delete();

        $response = $this->get(route('groups.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('groups.data', 1)
            ->where('groups.data.0.title', 'Visible'));
    }

    public function test_show_returns_404_for_unknown_group_id(): void
    {
        $this->get('/groups/999999')->assertNotFound();
    }

    public function test_filter_by_drp_id_limits_results(): void
    {
        $drpA = Drp::factory()->create();
        $drpB = Drp::factory()->create();
        Polo::factory()->create(['drp_id' => $drpA->id]);
        Polo::factory()->create(['drp_id' => $drpB->id]);
        Group::factory()->create(['drp_id' => $drpA->id, 'title' => 'Group A']);
        Group::factory()->create(['drp_id' => $drpB->id, 'title' => 'Group B']);

        $response = $this->get(route('groups.index', ['drp_id' => $drpA->id]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('groups.data', 1)
            ->where('groups.data.0.title', 'Group A')
            ->where('filters.drp_id', $drpA->id)
            ->where('filters.polo_id', null));
    }

    public function test_filter_by_polo_id_disambiguates_when_multiple_polos_share_drp(): void
    {
        $drp = Drp::factory()->create();
        Polo::factory()->create(['drp_id' => $drp->id, 'name' => 'Jales']);
        $poloUrania = Polo::factory()->create(['drp_id' => $drp->id, 'name' => 'Urania']);
        Group::factory()->create(['drp_id' => $drp->id, 'title' => 'Shared Drp Group']);

        $response = $this->get(route('groups.index', [
            'drp_id' => $drp->id,
            'polo_id' => $poloUrania->id,
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('groups.data', 1)
            ->where('groups.data.0.title', 'Shared Drp Group')
            ->where('filters.drp_id', $drp->id)
            ->where('filters.polo_id', $poloUrania->id));
    }

    public function test_filter_by_polo_id_only_limits_results(): void
    {
        $drpA = Drp::factory()->create();
        $drpB = Drp::factory()->create();
        $poloA = Polo::factory()->create(['drp_id' => $drpA->id, 'name' => 'Polo A Only']);
        Polo::factory()->create(['drp_id' => $drpB->id, 'name' => 'Polo B Only']);
        Group::factory()->create(['drp_id' => $drpA->id, 'title' => 'Group A']);
        Group::factory()->create(['drp_id' => $drpB->id, 'title' => 'Group B']);

        $response = $this->get(route('groups.index', ['polo_id' => $poloA->id]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('groups.data', 1)
            ->where('groups.data.0.title', 'Group A')
            ->where('filters.drp_id', $drpA->id)
            ->where('filters.polo_id', $poloA->id));
    }

    public function test_invalid_polo_id_returns_422(): void
    {
        $this->getJson(route('groups.index', ['polo_id' => 999_999]))->assertUnprocessable();
    }

    public function test_polo_id_with_mismatched_drp_id_returns_422(): void
    {
        $drpA = Drp::factory()->create();
        $drpB = Drp::factory()->create();
        $polo = Polo::factory()->create(['drp_id' => $drpA->id, 'name' => 'Polo On A']);

        $this->getJson(route('groups.index', [
            'polo_id' => $polo->id,
            'drp_id' => $drpB->id,
        ]))->assertUnprocessable();
    }

    public function test_invalid_drp_id_returns_422(): void
    {
        $this->getJson(route('groups.index', ['drp_id' => 999999]))->assertUnprocessable();
    }

    public function test_invalid_drp_id_for_soft_deleted_drp_returns_422(): void
    {
        $drp = Drp::factory()->create();
        $drp->delete();

        $this->getJson(route('groups.index', ['drp_id' => $drp->id]))->assertUnprocessable();
    }

    public function test_public_show_response_does_not_expose_email_or_phone(): void
    {
        $drp = Drp::factory()->create();
        $user = User::factory()->create([
            'drp_id' => $drp->id,
            'email' => 'leaky-public@example.test',
            'phone' => '+5511999887766',
            'name' => 'Member Public Name',
        ]);
        $group = Group::factory()->create([
            'drp_id' => $drp->id,
            'creator_id' => $user->id,
        ]);

        $content = $this->get(route('groups.show', $group))->assertOk()->getContent();

        $this->assertStringNotContainsString('leaky-public@example.test', $content);
        $this->assertStringNotContainsString('+5511999887766', $content);
        $this->assertStringContainsString('Member Public Name', $content);
    }

    public function test_guest_cannot_create_group_via_policy(): void
    {
        $this->assertTrue(Gate::forUser(null)->denies('create', Group::class));
    }

    public function test_authenticated_user_can_create_group_via_policy(): void
    {
        $drp = Drp::factory()->create();
        $user = User::factory()->create(['drp_id' => $drp->id]);

        $this->assertTrue(Gate::forUser($user)->allows('create', Group::class));
    }

    public function test_user_without_drp_id_cannot_create_group_via_policy(): void
    {
        $user = User::factory()->make(['drp_id' => null]);

        $this->assertTrue(Gate::forUser($user)->denies('create', Group::class));
    }

    public function test_guest_cannot_post_put_patch_delete_to_group_paths(): void
    {
        $drp = Drp::factory()->create();
        $group = Group::factory()->create(['drp_id' => $drp->id]);

        $this->post(route('groups.store'), [])->assertRedirect(route('login'));
        $this->put(route('groups.show', $group), [])->assertStatus(405);
        $this->patch(route('groups.show', $group), [])->assertStatus(405);
        $this->delete(route('groups.show', $group))->assertStatus(405);
    }
}

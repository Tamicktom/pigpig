<?php

namespace Tests\Feature;

use App\Enums\GroupMemberRole;
use App\Models\Drp;
use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticatedGroupCreateTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_group(): void
    {
        $drp = Drp::factory()->create();
        $user = User::factory()->create(['drp_id' => $drp->id]);

        $response = $this->actingAs($user)->post(route('groups.store'), [
            'title' => 'New PI Group',
            'description' => 'We meet weekly to integrate course projects.',
            'external_communication_link' => 'https://example.com/chat',
        ]);

        $group = Group::query()->where('title', 'New PI Group')->first();
        $this->assertNotNull($group);
        $response->assertRedirect(route('groups.show', $group));
        $this->assertDatabaseHas('groups', [
            'id' => $group->id,
            'drp_id' => $drp->id,
            'creator_id' => $user->id,
            'title' => 'New PI Group',
            'description' => 'We meet weekly to integrate course projects.',
            'external_communication_link' => 'https://example.com/chat',
        ]);
        $this->assertDatabaseHas('group_user', [
            'group_id' => $group->id,
            'user_id' => $user->id,
            'role' => GroupMemberRole::Owner->value,
        ]);
    }

    public function test_authenticated_user_can_create_group_without_external_link(): void
    {
        $drp = Drp::factory()->create();
        $user = User::factory()->create(['drp_id' => $drp->id]);

        $response = $this->actingAs($user)->post(route('groups.store'), [
            'title' => 'Title Only Group',
        ]);

        $group = Group::query()->where('title', 'Title Only Group')->first();
        $this->assertNotNull($group);
        $response->assertRedirect(route('groups.show', $group));
        $this->assertDatabaseHas('groups', [
            'id' => $group->id,
            'description' => null,
            'external_communication_link' => null,
        ]);
    }

    public function test_store_validation_rejects_overlong_description(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('groups.create'))
            ->post(route('groups.store'), [
                'title' => 'Valid title',
                'description' => str_repeat('a', 5001),
            ])
            ->assertRedirect(route('groups.create'))
            ->assertSessionHasErrors('description');
    }

    public function test_guest_is_redirected_from_create_and_store(): void
    {
        $this->get(route('groups.create'))->assertRedirect(route('login'));
        $this->post(route('groups.store'), ['title' => 'X'])->assertRedirect(route('login'));
    }

    public function test_create_page_renders_for_authenticated_user(): void
    {
        $drp = Drp::factory()->create(['name' => 'DRP Test Region']);
        $user = User::factory()->create(['drp_id' => $drp->id]);

        $this->actingAs($user)
            ->get(route('groups.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('groups/create')
                ->where('drp.name', 'DRP Test Region'));
    }

    public function test_store_validation_requires_title(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('groups.create'))
            ->post(route('groups.store'), ['title' => ''])
            ->assertRedirect(route('groups.create'))
            ->assertSessionHasErrors('title');
    }

    public function test_store_validation_rejects_invalid_external_link(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('groups.create'))
            ->post(route('groups.store'), [
                'title' => 'Valid title',
                'external_communication_link' => 'not-a-url',
            ])
            ->assertRedirect(route('groups.create'))
            ->assertSessionHasErrors('external_communication_link');
    }

    public function test_store_ignores_client_supplied_drp_id_and_uses_creator_drp(): void
    {
        $drpA = Drp::factory()->create();
        $drpB = Drp::factory()->create();
        $user = User::factory()->create(['drp_id' => $drpA->id]);

        $this->actingAs($user)->post(route('groups.store'), [
            'title' => 'No DRP override',
            'drp_id' => $drpB->id,
        ]);

        $group = Group::query()->where('title', 'No DRP override')->first();
        $this->assertNotNull($group);
        $this->assertSame($drpA->id, $group->drp_id);
    }
}

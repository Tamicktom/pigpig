<?php

namespace Tests\Feature;

// * Libraries imports
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;
// * Tests imports
use Tests\TestCase;

class GroupsAppTranslationPropsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_inertia_translations_reflect_english_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('dashboard'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('app.dashboard.head_title') === 'Home'
                        && $translations->get('app.dashboard.heading') === 'Your DRP hub'
                        && $translations->get('app.dashboard.card_browse') === 'Explore published groups and request to join.';
                }));
    }

    public function test_dashboard_inertia_translations_reflect_portuguese_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('dashboard'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('app.dashboard.head_title') === 'Início'
                        && $translations->get('app.dashboard.heading') === 'Seu espaço no DRP'
                        && $translations->get('app.dashboard.card_browse') === 'Navegue pelos grupos publicados e solicite entrada.';
                }));
    }

    public function test_my_groups_inertia_translations_reflect_english_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('my-groups.index'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('my-groups/index')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('groups.my.heading') === 'Groups in your DRP'
                        && $translations->get('app.shell.breadcrumb.dashboard') === 'Home'
                        && $translations->get('app.shell.nav.create_group') === 'Create group';
                }));
    }

    public function test_my_groups_inertia_translations_reflect_portuguese_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('my-groups.index'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('my-groups/index')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('groups.my.heading') === 'Grupos no seu DRP'
                        && $translations->get('app.shell.breadcrumb.dashboard') === 'Início'
                        && $translations->get('app.shell.nav.create_group') === 'Criar grupo';
                }));
    }

    public function test_groups_create_inertia_translations_reflect_english_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('groups.create'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('groups/create')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('groups.create.label.title') === 'Title'
                        && $translations->get('app.shell.breadcrumb.dashboard') === 'Home'
                        && $translations->get('groups.create.submit') === 'Create group';
                }));
    }

    public function test_groups_create_inertia_translations_reflect_portuguese_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('groups.create'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('groups/create')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('groups.create.label.title') === 'Título'
                        && $translations->get('app.shell.breadcrumb.dashboard') === 'Início'
                        && $translations->get('groups.create.submit') === 'Criar grupo';
                }));
    }
}

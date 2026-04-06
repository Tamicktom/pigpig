<?php

namespace Tests\Feature;

// * Libraries imports
use App\Models\Group;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;
// * Tests imports
use Tests\TestCase;

class PublicMarketingTranslationPropsTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_inertia_translations_reflect_english_locale(): void
    {
        $this->call('GET', '/', [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('landing.head_title_suffix') === 'Integrative Project'
                        && $translations->get('landing.hero.title') === 'Stop wasting time looking for an integrative project group'
                        && $translations->get('app.shell.theme.menu_trigger_aria') === 'Theme';
                }));
    }

    public function test_welcome_inertia_translations_reflect_portuguese_locale(): void
    {
        $this->call('GET', '/', [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('landing.head_title_suffix') === 'Projeto Integrador'
                        && $translations->get('landing.hero.title') === 'Pare de perder tempo procurando grupo para o PI'
                        && $translations->get('app.shell.theme.menu_trigger_aria') === 'Tema';
                }));
    }

    public function test_public_groups_index_inertia_translations_reflect_english_locale(): void
    {
        $this->call('GET', route('groups.index'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('groups/index')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('groups.public.heading') === 'Project groups'
                        && $translations->get('groups.public.filter_all') === 'All DRPs'
                        && $translations->get('app.shell.theme.menu_trigger_aria') === 'Theme';
                }));
    }

    public function test_public_groups_index_inertia_translations_reflect_portuguese_locale(): void
    {
        $this->call('GET', route('groups.index'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('groups/index')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('groups.public.heading') === 'Grupos do projeto'
                        && $translations->get('groups.public.filter_all') === 'Todas as DRPs'
                        && $translations->get('app.shell.theme.menu_trigger_aria') === 'Tema';
                }));
    }

    public function test_public_groups_show_inertia_translations_reflect_english_locale(): void
    {
        $group = Group::factory()->create();

        $this->call('GET', route('groups.show', $group), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('groups/show')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('groups.public.show.back') === 'Back to groups'
                        && $translations->get('groups.public.show.members_heading') === 'Members';
                }));
    }

    public function test_public_groups_show_inertia_translations_reflect_portuguese_locale(): void
    {
        $group = Group::factory()->create();

        $this->call('GET', route('groups.show', $group), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('groups/show')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('groups.public.show.back') === 'Voltar aos grupos'
                        && $translations->get('groups.public.show.members_heading') === 'Membros';
                }));
    }
}

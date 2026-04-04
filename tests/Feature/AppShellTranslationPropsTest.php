<?php

namespace Tests\Feature;

// * Libraries imports
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;
// * Tests imports
use Tests\TestCase;

class AppShellTranslationPropsTest extends TestCase
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
                    return $translations->get('app.shell.nav.dashboard') === 'Dashboard'
                        && $translations->get('app.shell.user.settings') === 'Settings';
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
                    return $translations->get('app.shell.nav.dashboard') === 'Painel'
                        && $translations->get('app.shell.user.settings') === 'Configurações';
                }));
    }
}

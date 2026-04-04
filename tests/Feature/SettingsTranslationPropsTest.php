<?php

namespace Tests\Feature;

// * Libraries imports
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;
// * Tests imports
use Tests\TestCase;

class SettingsTranslationPropsTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_settings_inertia_translations_reflect_english_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('profile.edit'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/profile')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('settings.layout.title') === 'Settings'
                        && $translations->get('settings.profile.head_title') === 'Profile settings';
                }));
    }

    public function test_profile_settings_inertia_translations_reflect_portuguese_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('profile.edit'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/profile')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('settings.layout.title') === 'Configurações'
                        && $translations->get('settings.profile.head_title') === 'Configurações do perfil';
                }));
    }

    public function test_security_settings_inertia_translations_reflect_english_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)
            ->withSession(['auth.password_confirmed_at' => time()]);

        $this->call('GET', route('security.edit'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/security')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('settings.security.head_title') === 'Security settings'
                        && $translations->get('settings.security.two_factor.heading_title') === 'Two-factor authentication';
                }));
    }

    public function test_security_settings_inertia_translations_reflect_portuguese_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)
            ->withSession(['auth.password_confirmed_at' => time()]);

        $this->call('GET', route('security.edit'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/security')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('settings.security.head_title') === 'Configurações de segurança'
                        && $translations->get('settings.security.two_factor.heading_title') === 'Autenticação em duas etapas';
                }));
    }

    public function test_appearance_settings_inertia_translations_reflect_english_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('appearance.edit'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/appearance')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('settings.appearance.head_title') === 'Appearance settings'
                        && $translations->get('settings.appearance.tab_light') === 'Light';
                }));
    }

    public function test_appearance_settings_inertia_translations_reflect_portuguese_locale(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->call('GET', route('appearance.edit'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/appearance')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('settings.appearance.head_title') === 'Aparência'
                        && $translations->get('settings.appearance.tab_light') === 'Claro';
                }));
    }
}

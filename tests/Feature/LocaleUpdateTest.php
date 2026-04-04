<?php

namespace Tests\Feature;

// * Libraries imports
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;
// * Tests imports
use Tests\TestCase;

class LocaleUpdateTest extends TestCase
{
    public function test_valid_locale_sets_cookie_and_redirects_back(): void
    {
        $response = $this->from('/')
            ->post(route('locale.update'), ['locale' => 'en']);

        $response->assertRedirect('/');
        $response->assertCookie('locale', 'en', false);
    }

    public function test_invalid_locale_fails_validation(): void
    {
        $this->from('/')
            ->post(route('locale.update'), ['locale' => 'fr'])
            ->assertSessionHasErrors('locale');
    }

    public function test_home_inertia_shared_locale_reflects_cookie(): void
    {
        $response = $this->call('GET', '/', [], ['locale' => 'en']);

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('locale', 'en'));
    }

    public function test_home_uses_default_locale_without_cookie(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('locale', 'pt_BR'));
    }

    public function test_home_inertia_shared_translations_reflect_english_locale_cookie(): void
    {
        $response = $this->call('GET', '/', [], ['locale' => 'en']);

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('translations', function (Collection $translations) {
                return $translations->get('i18n.phase0.marker') === 'Phase 0 EN'
                    && $translations->get('i18n.phase0.fallback_only') === 'Fallback locale string'
                    && $translations->get('landing.nav.about') === 'About';
            }));
    }

    public function test_home_inertia_shared_translations_reflect_portuguese_locale_cookie(): void
    {
        $response = $this->call('GET', '/', [], ['locale' => 'pt_BR']);

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('translations', function (Collection $translations) {
                return $translations->get('i18n.phase0.marker') === 'Fase 0 PT'
                    && $translations->get('i18n.phase0.fallback_only') === 'Fallback locale string'
                    && $translations->get('landing.nav.about') === 'Sobre';
            }));
    }
}

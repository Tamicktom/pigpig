<?php

namespace Tests\Feature;

// * Libraries imports
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
}

<?php

namespace Tests\Feature\Auth;

// * Libraries imports
use App\Models\Drp;
use App\Models\Polo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;
// * Tests imports
use Tests\TestCase;

class AuthTranslationPropsTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_inertia_translations_reflect_english_locale(): void
    {
        $this->call('GET', route('login'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/login')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('auth.login.head_title') === 'Log in'
                        && $translations->get('auth.login.layout_title') === 'Log in to your account';
                }));
    }

    public function test_login_inertia_translations_reflect_portuguese_locale(): void
    {
        $this->call('GET', route('login'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/login')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('auth.login.head_title') === 'Entrar'
                        && $translations->get('auth.login.layout_title') === 'Entrar na sua conta';
                }));
    }

    public function test_register_inertia_translations_reflect_english_locale(): void
    {
        $this->skipUnlessFortifyHas(Features::registration());

        $drp = Drp::factory()->create();
        Polo::factory()->create(['drp_id' => $drp->id]);

        $this->call('GET', route('register'), [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/register')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('auth.register.head_title') === 'Sign up'
                        && $translations->get('auth.register.submit') === 'Create account';
                }));
    }

    public function test_register_inertia_translations_reflect_portuguese_locale(): void
    {
        $this->skipUnlessFortifyHas(Features::registration());

        $drp = Drp::factory()->create();
        Polo::factory()->create(['drp_id' => $drp->id]);

        $this->call('GET', route('register'), [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/register')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('auth.register.head_title') === 'Cadastrar'
                        && $translations->get('auth.register.submit') === 'Criar conta';
                }));
    }
}

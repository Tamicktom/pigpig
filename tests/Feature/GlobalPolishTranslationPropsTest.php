<?php

namespace Tests\Feature;

// * Libraries imports
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;
// * Tests imports
use Tests\TestCase;

class GlobalPolishTranslationPropsTest extends TestCase
{
    public function test_home_inertia_translations_include_global_polish_keys_for_english(): void
    {
        $this->call('GET', '/', [], ['locale' => 'en'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('app.locale_switcher.aria_group_label') === 'Language'
                        && $translations->get('app.alert_error.default_title') === 'Something went wrong.'
                        && $translations->get('app.meta.document_title') === ':title - :app';
                }));
    }

    public function test_home_inertia_translations_include_global_polish_keys_for_portuguese(): void
    {
        $this->call('GET', '/', [], ['locale' => 'pt_BR'])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('welcome')
                ->where('translations', function (Collection $translations) {
                    return $translations->get('app.locale_switcher.aria_group_label') === 'Idioma'
                        && $translations->get('app.alert_error.default_title') === 'Algo deu errado.'
                        && $translations->get('app.meta.document_title') === ':title - :app';
                }));
    }
}

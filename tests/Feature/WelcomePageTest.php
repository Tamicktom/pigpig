<?php

namespace Tests\Feature;

// * Libraries imports
use Inertia\Testing\AssertableInertia as Assert;
// * Tests imports
use Tests\TestCase;

class WelcomePageTest extends TestCase
{
    public function test_welcome_page_renders_landing_hero(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('welcome'));
        $response->assertSee('Pare de perder tempo procurando grupo para o PI', false);
    }
}

<?php

namespace Tests\Browser;

// * Libraries imports
use Laravel\Dusk\Browser;
// * Tests imports
use Tests\DuskTestCase;

class WelcomeTest extends DuskTestCase
{
    public function test_welcome_page_loads(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                ->waitForText('Pare de perder tempo procurando grupo para o PI', 15)
                ->assertSee('Pare de perder tempo procurando grupo para o PI');
        });
    }
}

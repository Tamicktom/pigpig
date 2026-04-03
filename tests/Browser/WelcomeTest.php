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
                ->waitForText("Let's get started", 15)
                ->assertSee("Let's get started");
        });
    }
}

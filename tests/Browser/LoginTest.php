<?php

namespace Tests\Browser;

// * Libraries imports
use App\Models\User;
use Laravel\Dusk\Browser;
// * Tests imports
use Tests\DuskTestCase;

class LoginTest extends DuskTestCase
{
    public function test_user_can_log_in_from_the_login_page(): void
    {
        $user = User::factory()->create([
            'email' => 'dusk-login@example.com',
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                ->waitFor('#email', 15)
                ->type('#email', $user->email)
                ->type('#password', 'password')
                ->press('#login-submit-button')
                ->waitForLocation('/dashboard', 15)
                ->assertPathIs('/dashboard');
        });
    }
}

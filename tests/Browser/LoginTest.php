<?php

// * Libraries imports
use App\Models\User;
use Laravel\Dusk\Browser;

test('user can log in from the login page', function () {
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
});

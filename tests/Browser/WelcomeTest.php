<?php

// * Libraries imports
use Laravel\Dusk\Browser;

test('welcome page loads', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/')
            ->waitForText("Let's get started", 15)
            ->assertSee("Let's get started");
    });
});

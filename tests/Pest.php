<?php

// * Libraries imports
use Illuminate\Foundation\Testing\RefreshDatabase;
// * Tests imports
use Tests\DuskTestCase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test case binding
|--------------------------------------------------------------------------
|
| Feature, Unit, and Integration tests use the application TestCase.
| Browser (Dusk) tests use DuskTestCase (includes DatabaseMigrations).
|
*/

pest()->extend(TestCase::class)->in('Feature', 'Unit');

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Integration');

pest()->extend(DuskTestCase::class)->in('Browser');

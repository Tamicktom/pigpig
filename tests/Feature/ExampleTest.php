<?php

namespace Tests\Feature;

// * Tests imports
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_home_returns_a_successful_response(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
    }
}

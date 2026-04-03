<?php

namespace Database\Factories;

use App\Models\Drp;
use App\Models\Polo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Polo>
 */
class PoloFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'drp_id' => Drp::factory(),
            'name' => fake()->unique()->city(),
        ];
    }
}

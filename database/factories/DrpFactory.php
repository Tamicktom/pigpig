<?php

namespace Database\Factories;

use App\Models\Drp;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Drp>
 */
class DrpFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('###'),
        ];
    }

    /**
     * Use a display name without a slug (nullable column).
     */
    public function withoutSlug(): static
    {
        return $this->state(fn (array $attributes): array => [
            'slug' => null,
        ]);
    }
}

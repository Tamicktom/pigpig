<?php

namespace Database\Factories;

use App\Models\Drp;
use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Group>
 */
class GroupFactory extends Factory
{
    protected $model = Group::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'external_communication_link' => null,
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Group $group): void {
            if ($group->drp_id !== null && $group->creator_id !== null) {
                return;
            }

            if ($group->creator_id !== null) {
                $creator = User::query()->find($group->creator_id) ?? User::factory()->create();
                $group->forceFill([
                    'drp_id' => $creator->drp_id,
                    'creator_id' => $creator->id,
                ]);

                return;
            }

            $drp = $group->drp_id !== null
                ? Drp::query()->findOrFail($group->drp_id)
                : Drp::factory()->create();

            $creator = User::factory()->create(['drp_id' => $drp->id]);

            $group->forceFill([
                'drp_id' => $drp->id,
                'creator_id' => $creator->id,
            ]);
        });
    }
}

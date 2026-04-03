<?php

namespace Database\Factories;

use App\Enums\JoinRequestStatus;
use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GroupJoinRequest>
 */
class GroupJoinRequestFactory extends Factory
{
    protected $model = GroupJoinRequest::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => JoinRequestStatus::Pending,
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (GroupJoinRequest $request): void {
            if ($request->group_id !== null && $request->user_id !== null) {
                return;
            }

            $group = $request->group_id !== null
                ? Group::query()->findOrFail($request->group_id)
                : Group::factory()->create();

            if ($request->user_id !== null) {
                $request->forceFill(['group_id' => $group->id]);

                return;
            }

            $applicant = User::factory()->create(['drp_id' => $group->drp_id]);
            $attempts = 0;
            while ($applicant->id === $group->creator_id && $attempts < 10) {
                $applicant = User::factory()->create(['drp_id' => $group->drp_id]);
                $attempts++;
            }

            $request->forceFill([
                'group_id' => $group->id,
                'user_id' => $applicant->id,
            ]);
        });
    }
}

<?php

namespace App\Models;

use App\Enums\GroupMemberRole;
use Database\Factories\GroupFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use InvalidArgumentException;
use LogicException;

#[Fillable(['drp_id', 'creator_id', 'title', 'external_communication_link'])]
class Group extends Model
{
    /** @use HasFactory<GroupFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (Group $group): void {
            if ($group->creator_id === null) {
                throw new InvalidArgumentException('Group must have a creator_id.');
            }

            $creator = User::query()->find($group->creator_id);

            if ($creator === null) {
                throw new InvalidArgumentException('Creator does not exist.');
            }

            if ((int) $creator->drp_id !== (int) $group->drp_id) {
                throw new InvalidArgumentException('Group DRP must match the creator DRP.');
            }
        });

        static::created(function (Group $group): void {
            $group->members()->attach($group->creator_id, [
                'role' => GroupMemberRole::Owner->value,
            ]);
        });

        static::updating(function (Group $group): void {
            if ($group->isDirty('drp_id')) {
                throw new LogicException('Group DRP cannot be changed after creation.');
            }
        });
    }

    /**
     * @return BelongsTo<Drp, $this>
     */
    public function drp(): BelongsTo
    {
        return $this->belongsTo(Drp::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * All participants, including the owner. Roles live on the pivot (`owner` / `member`).
     * `creator_id` duplicates the owner user id for quick lookups (e.g. authorization).
     *
     * @return BelongsToMany<User, $this>
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * @return HasMany<GroupJoinRequest, $this>
     */
    public function joinRequests(): HasMany
    {
        return $this->hasMany(GroupJoinRequest::class);
    }
}

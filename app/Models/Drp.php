<?php

namespace App\Models;

use Database\Factories\DrpFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'slug'])]
class Drp extends Model
{
    /** @use HasFactory<DrpFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return HasMany<Polo, $this>
     */
    public function polos(): HasMany
    {
        return $this->hasMany(Polo::class);
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return HasMany<Group, $this>
     */
    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }
}

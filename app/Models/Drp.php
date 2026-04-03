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
}

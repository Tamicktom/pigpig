<?php

namespace App\Models;

use Database\Factories\PoloFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['drp_id', 'name'])]
class Polo extends Model
{
    /** @use HasFactory<PoloFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Drp, $this>
     */
    public function drp(): BelongsTo
    {
        return $this->belongsTo(Drp::class);
    }
}

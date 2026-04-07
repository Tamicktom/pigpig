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

    /**
     * Polo rows with DRP labels for Inertia comboboxes (registration, public group filter).
     *
     * @return list<array{id: int, name: string, drp_id: int, drp_name: string}>
     */
    public static function inertiaSelectOptions(): array
    {
        return static::query()
            ->whereHas('drp')
            ->with(['drp:id,name'])
            ->orderBy('name')
            ->get()
            ->map(fn (Polo $polo): array => [
                'id' => $polo->id,
                'name' => $polo->name,
                'drp_id' => $polo->drp_id,
                'drp_name' => $polo->drp->name,
            ])
            ->values()
            ->all();
    }
}

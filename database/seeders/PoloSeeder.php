<?php

namespace Database\Seeders;

use App\Models\Drp;
use App\Models\Polo;
use Database\Seeders\Support\PolosDrpCsvReader;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

class PoloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (PolosDrpCsvReader::rows() as $row) {
            $slug = Str::lower($row['drp_code']);
            $drp = Drp::query()->where('slug', $slug)->first();

            if ($drp === null) {
                throw new RuntimeException(
                    "DRP [{$row['drp_code']}] is missing. Run ".DrpSeeder::class.' before '.self::class.'.'
                );
            }

            Polo::query()->firstOrCreate(
                [
                    'drp_id' => $drp->id,
                    'name' => $row['polo'],
                ],
            );
        }
    }
}

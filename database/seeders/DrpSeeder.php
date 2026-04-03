<?php

namespace Database\Seeders;

use App\Models\Drp;
use Database\Seeders\Support\PolosDrpCsvReader;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DrpSeeder extends Seeder
{
    /**
     * DRP rows derived from {@see PolosDrpCsvReader} (codes such as DRP01 … DRP14).
     *
     * @return list<array{name: string, slug: string}>
     */
    public static function seededDefinitions(): array
    {
        return array_map(
            fn (string $code): array => [
                'name' => $code,
                'slug' => Str::lower($code),
            ],
            PolosDrpCsvReader::uniqueDrpCodes()
        );
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::seededDefinitions() as $row) {
            Drp::query()->firstOrCreate(
                ['slug' => $row['slug']],
                ['name' => $row['name']]
            );
        }
    }
}

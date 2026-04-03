<?php

namespace Database\Seeders;

use App\Models\Drp;
use Illuminate\Database\Seeder;

class DrpSeeder extends Seeder
{
    /**
     * Initial DRP rows aligned with typical UNIVESP regional hubs (update labels if your campus list differs).
     *
     * @return list<array{name: string, slug: string}>
     */
    public static function seededDefinitions(): array
    {
        return [
            ['name' => 'DRP Bauru', 'slug' => 'bauru'],
            ['name' => 'DRP Campinas', 'slug' => 'campinas'],
            ['name' => 'DRP Grande ABC', 'slug' => 'grande-abc'],
            ['name' => 'DRP Metropolitana de São Paulo', 'slug' => 'metropolitana-sp'],
            ['name' => 'DRP Piracicaba', 'slug' => 'piracicaba'],
            ['name' => 'DRP Presidente Prudente', 'slug' => 'presidente-prudente'],
            ['name' => 'DRP Rio Preto', 'slug' => 'rio-preto'],
            ['name' => 'DRP Vale do Paraíba', 'slug' => 'vale-do-paraiba'],
        ];
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

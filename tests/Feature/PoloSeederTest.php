<?php

namespace Tests\Feature;

use App\Models\Polo;
use Database\Seeders\DrpSeeder;
use Database\Seeders\PoloSeeder;
use Database\Seeders\Support\PolosDrpCsvReader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PoloSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_polo_seeder_populates_expected_rows_and_is_idempotent(): void
    {
        $expected = count(PolosDrpCsvReader::rows());

        $this->seed(DrpSeeder::class);
        $this->seed(PoloSeeder::class);

        $this->assertSame($expected, Polo::query()->count());
        $this->assertTrue(Polo::query()->exists());

        $this->seed(PoloSeeder::class);

        $this->assertSame($expected, Polo::query()->count());
    }

    public function test_polo_factory_persists_record(): void
    {
        $polo = Polo::factory()->create();

        $this->assertModelExists($polo);
        $this->assertNotSame('', $polo->name);
        $this->assertNotNull($polo->drp_id);
    }
}

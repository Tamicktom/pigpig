<?php

namespace Tests\Feature;

use App\Models\Drp;
use Database\Seeders\DrpSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DrpSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_drp_seeder_populates_expected_rows_and_is_idempotent(): void
    {
        $expected = count(DrpSeeder::seededDefinitions());

        $this->seed(DrpSeeder::class);

        $this->assertSame($expected, Drp::query()->count());
        $this->assertTrue(Drp::query()->exists());

        $this->seed(DrpSeeder::class);

        $this->assertSame($expected, Drp::query()->count());
    }

    public function test_drp_factory_persists_record(): void
    {
        $drp = Drp::factory()->create();

        $this->assertModelExists($drp);
        $this->assertNotSame('', $drp->name);
        $this->assertNotNull($drp->slug);
    }

    public function test_drp_factory_without_slug_persists_null_slug(): void
    {
        $drp = Drp::factory()->withoutSlug()->create();

        $this->assertModelExists($drp);
        $this->assertNull($drp->slug);
    }
}

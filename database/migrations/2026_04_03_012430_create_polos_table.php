<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('polos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drp_id')->constrained('drps')->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();

            $table->unique(['drp_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('polos');
    }
};

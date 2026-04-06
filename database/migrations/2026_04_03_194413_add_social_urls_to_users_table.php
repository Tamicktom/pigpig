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
        Schema::table('users', function (Blueprint $table) {
            $table->string('instagram_url', 2048)->nullable()->after('drp_id');
            $table->string('linkedin_url', 2048)->nullable()->after('instagram_url');
            $table->string('twitter_url', 2048)->nullable()->after('linkedin_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'instagram_url',
                'linkedin_url',
                'twitter_url',
            ]);
        });
    }
};

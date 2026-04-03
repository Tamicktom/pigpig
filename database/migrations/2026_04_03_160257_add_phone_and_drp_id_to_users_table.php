<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable()->after('email');
            $table->foreignId('drp_id')->nullable()->after('phone')->constrained('drps')->restrictOnDelete();
        });

        $firstDrpId = DB::table('drps')->orderBy('id')->value('id');
        if ($firstDrpId !== null) {
            DB::table('users')->whereNull('drp_id')->update([
                'drp_id' => $firstDrpId,
                'phone' => '+00000000000',
            ]);
        }

        DB::table('users')->whereNull('phone')->update(['phone' => '+00000000000']);

        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable(false)->change();
            $table->foreignId('drp_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('drp_id');
            $table->dropColumn('phone');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('progress', function (Blueprint $table) {
            // Add separate status columns for initiator and target
            $table->string('status_initiator', 20)->default('pending')->after('status');
            $table->string('status_target', 20)->default('pending')->after('status_initiator');
        });

        Schema::table('progress_shadow', function (Blueprint $table) {
            $table->string('status_initiator', 20)->default('pending')->after('status');
            $table->string('status_target', 20)->default('pending')->after('status_initiator');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->dropColumn(['status_initiator', 'status_target']);
        });

        Schema::table('progress_shadow', function (Blueprint $table) {
            $table->dropColumn(['status_initiator', 'status_target']);
        });
    }
};

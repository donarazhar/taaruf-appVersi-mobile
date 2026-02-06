<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Fix status column length
        Schema::table('karyawan', function (Blueprint $table) {
            $table->string('status', 20)->nullable()->default('pending')->change();
        });

        // Add missing columns to berita
        Schema::table('berita', function (Blueprint $table) {
            $table->string('foto')->nullable()->after('id');
            $table->string('subjudul')->nullable()->after('judul');
        });

        // Add gambar column to youtube
        Schema::table('youtube', function (Blueprint $table) {
            $table->string('gambar')->nullable()->after('link');
        });
    }

    public function down(): void
    {
        Schema::table('karyawan', function (Blueprint $table) {
            $table->string('status', 5)->nullable()->default('')->change();
        });

        Schema::table('berita', function (Blueprint $table) {
            $table->dropColumn(['foto', 'subjudul']);
        });

        Schema::table('youtube', function (Blueprint $table) {
            $table->dropColumn('gambar');
        });
    }
};

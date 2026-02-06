<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Tabel Karyawan
        Schema::create('karyawan', function (Blueprint $table) {
            $table->id();
            $table->string('nip')->unique();
            $table->string('nama');
            $table->string('email')->unique();
            $table->string('jenkel', 10); // L atau P
            $table->string('password');
            $table->string('referensi')->nullable();
            $table->text('referensi_detail')->nullable();
            $table->string('foto')->nullable();
            $table->string('status', 5)->nullable()->default('');
            $table->string('email_verification_token')->nullable();
            $table->timestamps();
        });

        // Tabel Biodata
        Schema::create('biodata', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            $table->string('tempatlahir', 50)->nullable();
            $table->date('tgllahir')->nullable();
            $table->string('goldar', 5)->nullable();
            $table->string('statusnikah', 20)->nullable();
            $table->string('pekerjaan', 50)->nullable();
            $table->string('suku', 30)->nullable();
            $table->string('pendidikan', 20)->nullable();
            $table->text('hobi')->nullable();
            $table->text('motto')->nullable();
            $table->string('nohp', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->integer('tinggi')->nullable();
            $table->integer('berat')->nullable();
            $table->string('video')->nullable();
            $table->timestamps();
        });

        // Tabel Kriteria Pasangan
        Schema::create('kriteria_pasangan', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('usia_min', 5)->nullable();
            $table->string('usia_max', 5)->nullable();
            $table->string('status_nikah', 20)->nullable();
            $table->string('pendidikan', 20)->nullable();
            $table->text('kriteria_lain')->nullable();
            $table->timestamps();
        });

        // Tabel Proses (untuk tracking proses taaruf)
        Schema::create('proses', function (Blueprint $table) {
            $table->id();
            $table->string('email_pria');
            $table->string('email_wanita');
            $table->timestamps();
        });

        // Tabel Progress
        Schema::create('progress', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            $table->string('email_target')->nullable();
            $table->string('status', 20)->nullable();
            $table->timestamps();
        });

        // Tabel Progress Shadow
        Schema::create('progress_shadow', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            $table->string('email_target')->nullable();
            $table->string('status', 20)->nullable();
            $table->timestamps();
        });

        // Tabel Chat
        Schema::create('chat', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_proses');
            $table->string('email_pengirim');
            $table->text('pesan');
            $table->timestamps();
        });

        // Tabel Chat Shadow
        Schema::create('chat_shadow', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_proses');
            $table->string('email_pengirim');
            $table->text('pesan');
            $table->timestamps();
        });

        // Tabel Berita
        Schema::create('berita', function (Blueprint $table) {
            $table->id();
            $table->string('judul')->nullable();
            $table->text('isi')->nullable();
            $table->string('gambar')->nullable();
            $table->string('link')->nullable();
            $table->timestamps();
        });

        // Tabel Pertanyaan (QnA)
        Schema::create('pertanyaan', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->nullable();
            $table->string('email')->nullable();
            $table->text('pertanyaan');
            $table->text('jawaban')->nullable();
            $table->timestamps();
        });

        // Tabel Like/Dislike
        Schema::create('likedislike', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('email_target');
            $table->string('status', 10); // like atau dislike
            $table->timestamps();
        });

        // Tabel Like/Dislike Shadow
        Schema::create('likedislike_shadow', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('email_target');
            $table->string('status', 10);
            $table->timestamps();
        });

        // Tabel Youtube
        Schema::create('youtube', function (Blueprint $table) {
            $table->id();
            $table->string('judul')->nullable();
            $table->string('link')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('youtube');
        Schema::dropIfExists('likedislike_shadow');
        Schema::dropIfExists('likedislike');
        Schema::dropIfExists('pertanyaan');
        Schema::dropIfExists('berita');
        Schema::dropIfExists('chat_shadow');
        Schema::dropIfExists('chat');
        Schema::dropIfExists('progress_shadow');
        Schema::dropIfExists('progress');
        Schema::dropIfExists('proses');
        Schema::dropIfExists('kriteria_pasangan');
        Schema::dropIfExists('biodata');
        Schema::dropIfExists('karyawan');
    }
};

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BeritaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('berita')->insert([
            [
                'foto' => '',
                'judul' => 'Selamat Datang di Platform Ta\'aruf Jodohku',
                'subjudul' => 'Platform ta\'aruf eksklusif untuk pegawai YPI Al Azhar',
                'isi' => 'Platform Ta\'aruf Jodohku hadir untuk membantu pegawai YPI Al Azhar menemukan pasangan hidup yang tepat melalui proses ta\'aruf yang sesuai syariat Islam. Dengan pendampingan profesional dan proses yang aman, kami berkomitmen untuk membantu Anda menuju pernikahan yang berkah.',
                'link' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'foto' => '',
                'judul' => 'Tips Sukses dalam Proses Ta\'aruf',
                'subjudul' => 'Panduan lengkap untuk memulai perjalanan ta\'aruf Anda',
                'isi' => 'Ta\'aruf adalah proses perkenalan untuk tujuan pernikahan yang dilakukan sesuai syariat Islam. Beberapa tips sukses dalam ta\'aruf: 1) Niatkan karena Allah, 2) Jujur dalam mengisi biodata, 3) Komunikasikan dengan baik melalui pembimbing, 4) Libatkan keluarga dalam proses pengambilan keputusan, 5) Berdoa dan bertawakkal.',
                'link' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'foto' => '',
                'judul' => 'Kisah Sukses: Pasangan Ta\'aruf Kami',
                'subjudul' => 'Testimoni dari pasangan yang berhasil menikah melalui platform ini',
                'isi' => 'Alhamdulillah, sejak platform ini diluncurkan, sudah banyak pasangan yang berhasil menikah melalui proses ta\'aruf. Mereka berbagi pengalaman bahwa proses ta\'aruf yang terbimbing memberikan rasa aman dan nyaman dalam mencari pasangan hidup yang seiman.',
                'link' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'foto' => '',
                'judul' => 'Pentingnya Kriteria Pasangan dalam Ta\'aruf',
                'subjudul' => 'Bagaimana menentukan kriteria yang tepat untuk calon pasangan',
                'isi' => 'Menentukan kriteria pasangan adalah langkah penting dalam ta\'aruf. Fokuskan pada kriteria yang esensial seperti agama, akhlak, dan visi misi kehidupan. Hindari terlalu banyak kriteria fisik yang bisa membatasi pilihan. Ingatlah bahwa pasangan yang baik adalah yang bisa melengkapi kekurangan kita dan bersama-sama menuju ridha Allah.',
                'link' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

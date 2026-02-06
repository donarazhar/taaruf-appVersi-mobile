<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class YoutubeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('youtube')->insert([
            [
                'link' => 'https://www.youtube.com/embed/lbftWRvnYAU',
                'gambar' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'link' => 'https://www.youtube.com/embed/QhT4oJXM7lw',
                'gambar' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'link' => 'https://www.youtube.com/embed/1k1Lc_6D3MQ',
                'gambar' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

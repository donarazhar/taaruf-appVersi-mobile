<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Karyawan;
use App\Models\Biodata;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class KaryawanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample approved karyawan (Ikhwan)
        $ikhwan = [
            [
                'nip' => 'TRF-2025-0001',
                'nama' => 'Budi Santoso',
                'email' => 'budi.santoso@example.com',
                'jenkel' => 'L',
                'status' => 'approved',
            ],
            [
                'nip' => 'TRF-2025-0002',
                'nama' => 'Ahmad Wijaya',
                'email' => 'ahmad.wijaya@example.com',
                'jenkel' => 'L',
                'status' => 'approved',
            ],
            [
                'nip' => 'TRF-2025-0003',
                'nama' => 'Dedi Hermawan',
                'email' => 'dedi.hermawan@example.com',
                'jenkel' => 'L',
                'status' => 'approved',
            ],
        ];

        // Sample approved karyawan (Akhwat)
        $akhwat = [
            [
                'nip' => 'TRF-2025-0004',
                'nama' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@example.com',
                'jenkel' => 'P',
                'status' => 'approved',
            ],
            [
                'nip' => 'TRF-2025-0005',
                'nama' => 'Rina Kusuma',
                'email' => 'rina.kusuma@example.com',
                'jenkel' => 'P',
                'status' => 'approved',
            ],
            [
                'nip' => 'TRF-2025-0006',
                'nama' => 'Dewi Anggraini',
                'email' => 'dewi.anggraini@example.com',
                'jenkel' => 'P',
                'status' => 'approved',
            ],
        ];

        // Sample pending karyawan (for testing approval)
        $pending = [
            [
                'nip' => 'TRF-2025-0007',
                'nama' => 'Farhan Maulana',
                'email' => 'farhan.maulana@example.com',
                'jenkel' => 'L',
                'status' => 'pending',
            ],
            [
                'nip' => 'TRF-2025-0008',
                'nama' => 'Putri Rahayu',
                'email' => 'putri.rahayu@example.com',
                'jenkel' => 'P',
                'status' => 'pending',
            ],
        ];

        $allKaryawan = array_merge($ikhwan, $akhwat, $pending);

        foreach ($allKaryawan as $data) {
            $karyawan = Karyawan::create([
                'nip' => $data['nip'],
                'nama' => $data['nama'],
                'email' => $data['email'],
                'jenkel' => $data['jenkel'],
                'password' => Hash::make('password123'),
                'status' => $data['status'],
                'email_verification_token' => Str::random(60),
            ]);

            // Create biodata
            Biodata::create([
                'email' => $karyawan->email,
                'tempatlahir' => 'Jakarta',
                'tgllahir' => null,
                'nohp' => '08' . rand(1000000000, 9999999999),
            ]);
        }
    }
}

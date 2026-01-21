<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds (Admin users).
     */
    public function run(): void
    {
        User::create([
            'name' => 'Donar Azhar',
            'email' => 'donarazhar@gmail.com',
            'password' => Hash::make('admin123'),
        ]);

        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@taaruf.com',
            'password' => Hash::make('admin123'),
        ]);
    }
}

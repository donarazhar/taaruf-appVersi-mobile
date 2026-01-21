<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use App\Models\User;
use App\Models\Biodata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Redirect ke Google OAuth
     */
    public function redirectToGoogle()
    {
        try {
            /** @var \Laravel\Socialite\Two\GoogleProvider $driver */
            $driver = Socialite::driver('google');
            $url = $driver->stateless()->redirect()->getTargetUrl();

            return response()->json(['url' => $url]);
        } catch (\Exception $e) {
            Log::error('Google redirect error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghubungi Google: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Callback dari Google OAuth
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $code = $request->get('code');

            if (!$code) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Kode otorisasi tidak ditemukan'
                ], 400);
            }

            /** @var \Laravel\Socialite\Two\GoogleProvider $driver */
            $driver = Socialite::driver('google');
            $googleUser = $driver->stateless()->user();

            $email = $googleUser->getEmail();

            // 1. CEK DULU APAKAH INI SUPER ADMIN
            $adminUser = User::where('email', $email)->first();

            if ($adminUser) {
                // Ini adalah Super Admin - login sebagai admin
                $token = $adminUser->createToken('google-admin-token')->plainTextToken;

                return response()->json([
                    'status' => 'success',
                    'message' => 'Login berhasil sebagai Admin',
                    'user' => [
                        'id' => $adminUser->id,
                        'name' => $adminUser->name,
                        'email' => $adminUser->email
                    ],
                    'token' => $token,
                    'is_admin' => true,
                    'role' => 'super_admin'
                ]);
            }

            // 2. CEK APAKAH KARYAWAN SUDAH ADA
            $karyawan = Karyawan::where('email', $email)->first();

            if ($karyawan) {
                // User karyawan sudah ada, cek status
                if ($karyawan->status === 'pending') {
                    return response()->json([
                        'status' => 'pending',
                        'message' => 'Akun Anda masih menunggu persetujuan admin.'
                    ], 200);
                }

                if ($karyawan->status === 'rejected') {
                    return response()->json([
                        'status' => 'rejected',
                        'message' => 'Akun Anda ditolak oleh admin.'
                    ], 200);
                }

                // Login sukses sebagai karyawan
                $token = $karyawan->createToken('google-token')->plainTextToken;

                return response()->json([
                    'status' => 'success',
                    'message' => 'Login berhasil',
                    'user' => $karyawan->load('biodata'),
                    'token' => $token,
                    'is_admin' => false,
                    'role' => 'karyawan'
                ]);
            }

            // 3. USER BARU - buat akun karyawan dengan status pending
            $tahun = date('Y');
            $lastKaryawan = Karyawan::where('nip', 'like', "TRF-{$tahun}-%")
                ->orderBy('id', 'desc')
                ->first();

            $urutan = 1;
            if ($lastKaryawan) {
                $lastNip = explode('-', $lastKaryawan->nip);
                $urutan = (int) end($lastNip) + 1;
            }
            $nip = sprintf("TRF-%s-%04d", $tahun, $urutan);

            $karyawan = Karyawan::create([
                'nip' => $nip,
                'nama' => $googleUser->getName(),
                'email' => $email,
                'jenkel' => '', // Perlu dilengkapi nanti
                'password' => Hash::make(Str::random(32)),
                'status' => 'pending',
                'foto' => $googleUser->getAvatar(),
            ]);

            // Buat biodata kosong
            Biodata::create(['email' => $karyawan->email]);

            return response()->json([
                'status' => 'pending',
                'message' => 'Registrasi berhasil! Akun Anda menunggu persetujuan admin.',
                'nip' => $nip,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Google callback error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal login dengan Google: ' . $e->getMessage()
            ], 500);
        }
    }
}

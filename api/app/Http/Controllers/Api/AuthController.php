<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use App\Models\Biodata;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register karyawan baru (memerlukan approval admin)
     */
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:karyawan',
            'jenkel' => 'required|in:L,P',
            'password' => 'required|string|min:6|confirmed',
            'nohp' => 'nullable|string|max:20',
        ]);

        // Generate NIP otomatis (format: TRF-TAHUN-URUTAN)
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
            'nama' => $request->nama,
            'email' => $request->email,
            'jenkel' => $request->jenkel,
            'password' => Hash::make($request->password),
            'status' => 'pending',
            'email_verification_token' => Str::random(60),
        ]);

        // Buat biodata dengan nomor HP
        Biodata::create([
            'email' => $karyawan->email,
            'nohp' => $request->nohp,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil! Akun Anda menunggu persetujuan admin.',
            'status' => 'pending',
            'nip' => $nip,
        ], 201);
    }

    /**
     * Login - cek di tabel users (admin) dan karyawan
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Cek apakah email ada di tabel users (Super Admin)
        $admin = User::where('email', $request->email)->first();

        if ($admin && Hash::check($request->password, $admin->password)) {
            $token = $admin->createToken('admin-token')->plainTextToken;

            return response()->json([
                'message' => 'Login berhasil',
                'user' => $admin,
                'token' => $token,
                'is_admin' => true,
                'role' => 'super_admin'
            ]);
        }

        // Cek di tabel karyawan
        $karyawan = Karyawan::where('email', $request->email)->first();

        if (!$karyawan || !Hash::check($request->password, $karyawan->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Cek status approval
        if ($karyawan->status === 'pending') {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda masih menunggu persetujuan admin.'],
            ]);
        }

        if ($karyawan->status === 'rejected') {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda ditolak oleh admin.'],
            ]);
        }

        $token = $karyawan->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $karyawan->load('biodata'),
            'token' => $token,
            'is_admin' => false,
            'role' => 'karyawan'
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    /**
     * Get current user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        if ($user instanceof Karyawan) {
            return response()->json([
                'user' => $user->load('biodata'),
                'is_admin' => false,
                'role' => 'karyawan'
            ]);
        }

        return response()->json([
            'user' => $user,
            'is_admin' => true,
            'role' => 'super_admin'
        ]);
    }
}

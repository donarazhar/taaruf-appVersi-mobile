<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaarufController extends Controller
{
    /**
     * Get all profiles with opposite gender for ta'aruf browsing
     * Excludes profiles that are already in progress or rejected
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $userGender = $user->jenkel;
        $userEmail = $user->email;

        // Get emails of profiles that are in progress or rejected
        $excludedEmails = DB::table('progress')
            ->where(function ($query) use ($userEmail) {
                $query->where('email', $userEmail)
                    ->orWhere('email_target', $userEmail);
            })
            ->get()
            ->map(function ($item) use ($userEmail) {
                // Return the partner's email (the other person)
                return $item->email === $userEmail ? $item->email_target : $item->email;
            })
            ->toArray();

        // Get all users with opposite gender, excluding those in progress
        $profiles = Karyawan::where('jenkel', '!=', $userGender)
            ->where('status', 'approved')
            ->whereNotIn('email', $excludedEmails)
            ->with('biodata')
            ->get()
            ->map(function ($karyawan) {
                return [
                    'id' => $karyawan->id,
                    'nip' => $karyawan->nip,
                    'nama' => $karyawan->nama,
                    'email' => $karyawan->email,
                    'jenkel' => $karyawan->jenkel,
                    'foto' => $karyawan->foto,
                    'status' => $karyawan->status,
                    'referensi' => $karyawan->referensi,
                    'referensi_detail' => $karyawan->referensi_detail,
                    'biodata' => $karyawan->biodata ? [
                        'tempatlahir' => $karyawan->biodata->tempatlahir,
                        'tgllahir' => $karyawan->biodata->tgllahir,
                        'pekerjaan' => $karyawan->biodata->pekerjaan,
                        'pendidikan' => $karyawan->biodata->pendidikan,
                        'alamat' => $karyawan->biodata->alamat,
                    ] : null,
                ];
            });

        return response()->json([
            'data' => $profiles,
            'user_gender' => $userGender,
        ]);
    }

    /**
     * Get single profile detail
     */
    public function show($id)
    {
        $user = Auth::user();

        $profile = Karyawan::with('biodata', 'kriteriaPasangan')
            ->find($id);

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found'
            ], 404);
        }

        // Check if user can view this profile (opposite gender)
        if ($profile->jenkel === $user->jenkel) {
            return response()->json([
                'message' => 'Unauthorized to view this profile'
            ], 403);
        }

        return response()->json([
            'data' => [
                'id' => $profile->id,
                'nip' => $profile->nip,
                'nama' => $profile->nama,
                'email' => $profile->email,
                'jenkel' => $profile->jenkel,
                'foto' => $profile->foto,
                'status' => $profile->status,
                'referensi' => $profile->referensi,
                'referensi_detail' => $profile->referensi_detail,
                'biodata' => $profile->biodata,
                'kriteria' => $profile->kriteriaPasangan,
            ]
        ]);
    }
}

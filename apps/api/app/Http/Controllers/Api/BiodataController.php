<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biodata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BiodataController extends Controller
{
    /**
     * Get the authenticated user's biodata
     */
    public function show()
    {
        $user = Auth::user();
        $biodata = Biodata::where('email', $user->email)->first();

        if (!$biodata) {
            return response()->json([
                'message' => 'Biodata not found',
                'data' => null
            ], 200);
        }

        return response()->json($biodata);
    }

    /**
     * Store or update the authenticated user's biodata
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'tempatlahir' => 'nullable|string|max:50',
            'tgllahir' => 'nullable|date',
            'goldar' => 'nullable|string|max:5',
            'statusnikah' => 'nullable|string|max:20',
            'pekerjaan' => 'nullable|string|max:50',
            'suku' => 'nullable|string|max:30',
            'pendidikan' => 'nullable|string|max:20',
            'hobi' => 'nullable|string',
            'motto' => 'nullable|string',
            'nohp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tinggi' => 'nullable|integer',
            'berat' => 'nullable|integer',
            'video' => 'nullable|string',
        ]);

        $biodata = Biodata::updateOrCreate(
            ['email' => $user->email],
            $validated
        );

        return response()->json([
            'message' => 'Biodata berhasil disimpan',
            'data' => $biodata
        ]);
    }
}

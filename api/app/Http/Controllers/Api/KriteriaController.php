<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KriteriaPasangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KriteriaController extends Controller
{
    /**
     * Get the authenticated user's kriteria pasangan
     */
    public function show()
    {
        $user = Auth::user();
        $kriteria = KriteriaPasangan::where('email', $user->email)->first();

        if (!$kriteria) {
            return response()->json([
                'message' => 'Kriteria not found',
                'data' => null
            ], 200);
        }

        return response()->json($kriteria);
    }

    /**
     * Store or update the authenticated user's kriteria pasangan
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'usia_min' => 'nullable|string|max:5',
            'usia_max' => 'nullable|string|max:5',
            'status_nikah' => 'nullable|string|max:20',
            'pendidikan' => 'nullable|string|max:20',
            'kriteria_lain' => 'nullable|string',
        ]);

        $kriteria = KriteriaPasangan::updateOrCreate(
            ['email' => $user->email],
            $validated
        );

        return response()->json([
            'message' => 'Kriteria pasangan berhasil disimpan',
            'data' => $kriteria
        ]);
    }
}

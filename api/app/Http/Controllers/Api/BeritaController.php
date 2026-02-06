<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BeritaController extends Controller
{
    /**
     * Get all berita
     */
    public function index()
    {
        $berita = DB::table('berita')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $berita]);
    }

    /**
     * Store new berita
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'subjudul' => 'nullable|string|max:255',
            'isi' => 'required|string',
            'link' => 'nullable|url'
        ]);

        $id = DB::table('berita')->insertGetId([
            'judul' => $request->judul,
            'subjudul' => $request->subjudul,
            'isi' => $request->isi,
            'link' => $request->link,
            'foto' => $request->foto,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'message' => 'Berita berhasil ditambahkan',
            'id' => $id
        ], 201);
    }

    /**
     * Update berita
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'subjudul' => 'nullable|string|max:255',
            'isi' => 'required|string',
            'link' => 'nullable|url'
        ]);

        DB::table('berita')
            ->where('id', $id)
            ->update([
                'judul' => $request->judul,
                'subjudul' => $request->subjudul,
                'isi' => $request->isi,
                'link' => $request->link,
                'updated_at' => now()
            ]);

        return response()->json(['message' => 'Berita berhasil diupdate']);
    }

    /**
     * Delete berita
     */
    public function destroy($id)
    {
        DB::table('berita')->where('id', $id)->delete();

        return response()->json(['message' => 'Berita berhasil dihapus']);
    }
}

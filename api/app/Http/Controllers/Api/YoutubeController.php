<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class YoutubeController extends Controller
{
    /**
     * Get all videos
     */
    public function index()
    {
        $videos = DB::table('youtube')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $videos]);
    }

    /**
     * Store new video
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'nullable|string|max:255',
            'link' => 'required|string'
        ]);

        $id = DB::table('youtube')->insertGetId([
            'judul' => $request->judul,
            'link' => $request->link,
            'gambar' => $request->gambar,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'message' => 'Video berhasil ditambahkan',
            'id' => $id
        ], 201);
    }

    /**
     * Update video
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'judul' => 'nullable|string|max:255',
            'link' => 'required|string'
        ]);

        DB::table('youtube')
            ->where('id', $id)
            ->update([
                'judul' => $request->judul,
                'link' => $request->link,
                'updated_at' => now()
            ]);

        return response()->json(['message' => 'Video berhasil diupdate']);
    }

    /**
     * Delete video
     */
    public function destroy($id)
    {
        DB::table('youtube')->where('id', $id)->delete();

        return response()->json(['message' => 'Video berhasil dihapus']);
    }
}

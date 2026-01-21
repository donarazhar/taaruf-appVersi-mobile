<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Get chat messages for a specific progress
     */
    public function index($progressId)
    {
        $user = Auth::user();

        // Check if user is authorized to view this chat
        $progress = DB::table('progress')->where('id', $progressId)->first();

        if (!$progress) {
            return response()->json(['message' => 'Progress not found'], 404);
        }

        if ($progress->email !== $user->email && $progress->email_target !== $user->email) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = DB::table('chat')
            ->where('id_proses', $progressId)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($chat) use ($user) {
                return [
                    'id' => $chat->id,
                    'text' => $chat->pesan,
                    'sender_email' => $chat->email_pengirim,
                    'is_me' => $chat->email_pengirim === $user->email,
                    'created_at' => $chat->created_at,
                ];
            });

        return response()->json([
            'data' => $messages
        ]);
    }

    /**
     * Send a new message
     */
    public function store(Request $request)
    {
        $request->validate([
            'progress_id' => 'required|exists:progress,id',
            'message' => 'required|string',
        ]);

        $user = Auth::user();
        $progressId = $request->input('progress_id');

        // Check authorization
        $progress = DB::table('progress')->where('id', $progressId)->first();
        if ($progress->email !== $user->email && $progress->email_target !== $user->email) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if matched (optional: enforce chat only if matched)
        $isMatched = $progress->status_initiator === 'like' && $progress->status_target === 'like';
        if (!$isMatched) {
            return response()->json(['message' => 'Chat is locked. Both parties must match first.'], 403);
        }

        $chatId = DB::table('chat')->insertGetId([
            'id_proses' => $progressId,
            'email_pengirim' => $user->email,
            'pesan' => $request->input('message'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Message sent',
            'data' => [
                'id' => $chatId,
                'text' => $request->input('message'),
                'sender_email' => $user->email,
                'is_me' => true,
                'created_at' => now(),
            ]
        ], 201);
    }
}

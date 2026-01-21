<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    /**
     * Get all progress items for the authenticated user
     * Only show active progress (not rejected by either party)
     */
    public function index()
    {
        $user = Auth::user();
        $userEmail = $user->email;

        // Get all ACTIVE progress where user is either the initiator or target
        // Exclude if either party has rejected (status_initiator or status_target = 'dislike')
        $progressItems = DB::table('progress')
            ->where(function ($query) use ($userEmail) {
                $query->where('email', $userEmail)
                    ->orWhere('email_target', $userEmail);
            })
            ->where('status_initiator', '!=', 'dislike')
            ->where('status_target', '!=', 'dislike')
            ->get();

        // Map progress items with partner data
        $result = $progressItems->map(function ($item) use ($userEmail) {
            // Determine if current user is initiator or target
            $isInitiator = $item->email === $userEmail;
            $partnerEmail = $isInitiator ? $item->email_target : $item->email;

            // Get partner data
            $partner = Karyawan::where('email', $partnerEmail)
                ->with('biodata')
                ->first();

            // Get current user data
            $currentUser = Karyawan::where('email', $userEmail)
                ->with('biodata')
                ->first();

            // Determine user's status and partner's status
            $userStatus = $isInitiator ? $item->status_initiator : $item->status_target;
            $partnerStatus = $isInitiator ? $item->status_target : $item->status_initiator;

            // Check if both have liked (matched!)
            $isMatched = $item->status_initiator === 'like' && $item->status_target === 'like';

            return [
                'id' => $item->id,
                'email' => $item->email,
                'email_target' => $item->email_target,
                'status_initiator' => $item->status_initiator,
                'status_target' => $item->status_target,
                'user_status' => $userStatus,
                'partner_status' => $partnerStatus,
                'is_matched' => $isMatched,
                'created_at' => $item->created_at,
                'is_initiator' => $isInitiator,
                'partner' => $partner ? [
                    'id' => $partner->id,
                    'nip' => $partner->nip,
                    'nama' => $partner->nama,
                    'email' => $partner->email,
                    'jenkel' => $partner->jenkel,
                    'foto' => $partner->foto,
                    'status' => $partner->status,
                    'biodata' => $partner->biodata,
                ] : null,
                'current_user' => [
                    'id' => $currentUser->id,
                    'nip' => $currentUser->nip,
                    'nama' => $currentUser->nama,
                    'email' => $currentUser->email,
                    'jenkel' => $currentUser->jenkel,
                    'foto' => $currentUser->foto,
                ],
            ];
        });

        return response()->json([
            'data' => $result,
        ]);
    }

    /**
     * Start a progress/taaruf with someone
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $targetEmail = $request->input('email_target');

        // Validate target exists
        $target = Karyawan::where('email', $targetEmail)->first();
        if (!$target) {
            return response()->json([
                'message' => 'Target tidak ditemukan'
            ], 404);
        }

        // Validate opposite gender (men can only progress with women and vice versa)
        if ($user->jenkel === $target->jenkel) {
            return response()->json([
                'message' => 'Tidak dapat memulai taaruf dengan jenis kelamin yang sama'
            ], 400);
        }

        // Check if progress already exists (active or rejected)
        $existingProgress = DB::table('progress')
            ->where(function ($query) use ($user, $targetEmail) {
                $query->where('email', $user->email)
                    ->where('email_target', $targetEmail);
            })
            ->orWhere(function ($query) use ($user, $targetEmail) {
                $query->where('email', $targetEmail)
                    ->where('email_target', $user->email);
            })
            ->first();

        if ($existingProgress) {
            // Check if rejected
            if ($existingProgress->status_initiator === 'dislike' || $existingProgress->status_target === 'dislike') {
                return response()->json([
                    'message' => 'Progress taaruf ini sudah ditolak sebelumnya'
                ], 400);
            }
            return response()->json([
                'message' => 'Progress taaruf sudah ada',
                'data' => $existingProgress
            ], 200);
        }

        // Create new progress with separate status for initiator and target
        $progressId = DB::table('progress')->insertGetId([
            'email' => $user->email,
            'email_target' => $targetEmail,
            'status_initiator' => 'pending', // pending, like, dislike
            'status_target' => 'pending',     // pending, like, dislike
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Progress taaruf berhasil dibuat',
            'data' => [
                'id' => $progressId,
                'email' => $user->email,
                'email_target' => $targetEmail,
                'status_initiator' => 'pending',
                'status_target' => 'pending',
            ]
        ], 201);
    }

    /**
     * Update progress status (like/dislike) for current user
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $status = $request->input('status'); // 'like' or 'dislike'

        if (!in_array($status, ['like', 'dislike'])) {
            return response()->json([
                'message' => 'Status harus like atau dislike'
            ], 400);
        }

        $progress = DB::table('progress')->where('id', $id)->first();

        if (!$progress) {
            return response()->json([
                'message' => 'Progress tidak ditemukan'
            ], 404);
        }

        // Check if user is part of this progress
        $isInitiator = $progress->email === $user->email;
        $isTarget = $progress->email_target === $user->email;

        if (!$isInitiator && !$isTarget) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Update the appropriate status field
        $updateField = $isInitiator ? 'status_initiator' : 'status_target';

        DB::table('progress')
            ->where('id', $id)
            ->update([
                $updateField => $status,
                'updated_at' => now(),
            ]);

        // Get updated progress to check if matched
        $updatedProgress = DB::table('progress')->where('id', $id)->first();
        $isMatched = $updatedProgress->status_initiator === 'like' && $updatedProgress->status_target === 'like';
        $isRejected = $updatedProgress->status_initiator === 'dislike' || $updatedProgress->status_target === 'dislike';

        return response()->json([
            'message' => 'Status progress berhasil diperbarui',
            'data' => [
                'id' => $id,
                'user_status' => $status,
                'is_matched' => $isMatched,
                'is_rejected' => $isRejected,
            ]
        ]);
    }
}

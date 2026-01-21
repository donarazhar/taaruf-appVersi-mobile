<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get all pending registrations
     */
    public function pendingRegistrations()
    {
        $pending = Karyawan::where('status', 'pending')
            ->with('biodata')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $pending,
            'total' => $pending->count()
        ]);
    }

    /**
     * Approve a registration
     */
    public function approveRegistration($id)
    {
        $karyawan = Karyawan::findOrFail($id);

        $karyawan->update([
            'status' => 'approved'
        ]);

        return response()->json([
            'message' => 'Pendaftaran berhasil disetujui',
            'user' => $karyawan
        ]);
    }

    /**
     * Reject a registration
     */
    public function rejectRegistration($id)
    {
        $karyawan = Karyawan::findOrFail($id);

        $karyawan->update([
            'status' => 'rejected'
        ]);

        return response()->json([
            'message' => 'Pendaftaran ditolak',
            'user' => $karyawan
        ]);
    }

    /**
     * Get all karyawan with filters
     */
    public function getAllKaryawan(Request $request)
    {
        $query = Karyawan::with('biodata');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by gender
        if ($request->has('jenkel')) {
            $query->where('jenkel', $request->jenkel);
        }

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        $karyawan = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($karyawan);
    }

    /**
     * Dashboard statistics
     */
    public function dashboardStats()
    {
        $stats = [
            'total_karyawan' => Karyawan::count(),
            'total_pria' => Karyawan::where('jenkel', 'L')->where('status', 'approved')->count(),
            'total_wanita' => Karyawan::where('jenkel', 'P')->where('status', 'approved')->count(),
            'pending_approval' => Karyawan::where('status', 'pending')->count(),
        ];

        return response()->json($stats);
    }
}

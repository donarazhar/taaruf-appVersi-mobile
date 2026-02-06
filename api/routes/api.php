<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\SocialiteController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\YoutubeController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\BiodataController;
use App\Http\Controllers\Api\KriteriaController;
use App\Http\Controllers\Api\TaarufController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\ChatController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Google OAuth routes
Route::get('/auth/google', [SocialiteController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback']);

// Protected routes (Karyawan)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Biodata routes
    Route::get('/biodata', [BiodataController::class, 'show']);
    Route::post('/biodata', [BiodataController::class, 'store']);

    // Kriteria Pasangan routes
    Route::get('/kriteria', [KriteriaController::class, 'show']);
    Route::post('/kriteria', [KriteriaController::class, 'store']);

    // Taaruf/Explore routes
    Route::get('/taaruf', [TaarufController::class, 'index']);
    Route::get('/taaruf/{id}', [TaarufController::class, 'show']);

    // Progress routes
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::post('/progress', [ProgressController::class, 'store']);
    Route::put('/progress/{id}', [ProgressController::class, 'update']);

    // Chat routes
    Route::get('/chat/{progressId}', [ChatController::class, 'index']);
    Route::post('/chat', [ChatController::class, 'store']);
});

// Admin routes (protected)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [AdminController::class, 'dashboardStats']);

    // User Management
    Route::get('/registrations/pending', [AdminController::class, 'pendingRegistrations']);
    Route::post('/registrations/{id}/approve', [AdminController::class, 'approveRegistration']);
    Route::post('/registrations/{id}/reject', [AdminController::class, 'rejectRegistration']);
    Route::get('/karyawan', [AdminController::class, 'getAllKaryawan']);

    // Content Management - Berita
    Route::get('/berita', [BeritaController::class, 'index']);
    Route::post('/berita', [BeritaController::class, 'store']);
    Route::put('/berita/{id}', [BeritaController::class, 'update']);
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy']);

    // Content Management - Youtube
    Route::get('/youtube', [YoutubeController::class, 'index']);
    Route::post('/youtube', [YoutubeController::class, 'store']);
    Route::put('/youtube/{id}', [YoutubeController::class, 'update']);
    Route::delete('/youtube/{id}', [YoutubeController::class, 'destroy']);

    // Activity Logs
    Route::get('/activity-logs', [SettingsController::class, 'getActivityLogs']);
    Route::delete('/activity-logs/clear', [SettingsController::class, 'clearActivityLogs']);

    // Backups
    Route::get('/backups', [SettingsController::class, 'getBackups']);
    Route::post('/backups/create', [SettingsController::class, 'createBackup']);
    Route::get('/backups/{filename}/download', [SettingsController::class, 'downloadBackup']);
    Route::delete('/backups/{filename}', [SettingsController::class, 'deleteBackup']);
});

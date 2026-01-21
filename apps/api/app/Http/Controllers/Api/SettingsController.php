<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SettingsController extends Controller
{
    /**
     * Get activity logs
     */
    public function getActivityLogs()
    {
        $logs = DB::table('activity_logs')
            ->leftJoin('users', 'activity_logs.user_id', '=', 'users.id')
            ->select(
                'activity_logs.*',
                'users.name as user_name'
            )
            ->orderBy('activity_logs.created_at', 'desc')
            ->limit(100)
            ->get();

        return response()->json(['data' => $logs]);
    }

    /**
     * Clear all activity logs
     */
    public function clearActivityLogs()
    {
        DB::table('activity_logs')->truncate();

        return response()->json(['message' => 'Activity logs berhasil dihapus']);
    }

    /**
     * Log an activity
     */
    public static function log($action, $description, $userId = null)
    {
        DB::table('activity_logs')->insert([
            'user_id' => $userId ?? auth()->id(),
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    /**
     * Get list of backups
     */
    public function getBackups()
    {
        $backupPath = storage_path('app/backups');

        if (!File::exists($backupPath)) {
            File::makeDirectory($backupPath, 0755, true);
        }

        $files = File::files($backupPath);
        $backups = [];

        foreach ($files as $file) {
            $backups[] = [
                'filename' => $file->getFilename(),
                'size' => $file->getSize(),
                'created_at' => date('Y-m-d H:i:s', $file->getMTime())
            ];
        }

        // Sort by created_at descending
        usort($backups, function ($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return response()->json(['data' => $backups]);
    }

    /**
     * Create new backup
     */
    public function createBackup()
    {
        try {
            $backupPath = storage_path('app/backups');

            if (!File::exists($backupPath)) {
                File::makeDirectory($backupPath, 0755, true);
            }

            $filename = 'backup_' . date('Y-m-d_His') . '.sql';
            $filepath = $backupPath . '/' . $filename;

            // Get database config
            $host = config('database.connections.pgsql.host');
            $port = config('database.connections.pgsql.port');
            $database = config('database.connections.pgsql.database');
            $username = config('database.connections.pgsql.username');
            $password = config('database.connections.pgsql.password');

            // Create pg_dump command
            $command = sprintf(
                'PGPASSWORD="%s" pg_dump -h %s -p %s -U %s -d %s > "%s" 2>&1',
                $password,
                $host,
                $port,
                $username,
                $database,
                $filepath
            );

            // Execute backup
            exec($command, $output, $returnCode);

            if ($returnCode !== 0 || !File::exists($filepath)) {
                // Alternative: simple SQL export
                $this->createSimpleBackup($filepath);
            }

            self::log('backup', 'Created database backup: ' . $filename);

            return response()->json([
                'message' => 'Backup berhasil dibuat',
                'filename' => $filename
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal membuat backup: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Simple backup using Laravel's query builder
     */
    private function createSimpleBackup($filepath)
    {
        $tables = DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
        $sql = "-- Taaruf Database Backup\n-- Created: " . date('Y-m-d H:i:s') . "\n\n";

        foreach ($tables as $table) {
            $tableName = $table->tablename;
            $rows = DB::table($tableName)->get();

            if ($rows->count() > 0) {
                $sql .= "-- Table: {$tableName}\n";
                foreach ($rows as $row) {
                    $values = array_map(function ($val) {
                        if ($val === null)
                            return 'NULL';
                        return "'" . addslashes($val) . "'";
                    }, (array) $row);

                    $columns = implode(', ', array_keys((array) $row));
                    $values = implode(', ', $values);
                    $sql .= "INSERT INTO {$tableName} ({$columns}) VALUES ({$values});\n";
                }
                $sql .= "\n";
            }
        }

        File::put($filepath, $sql);
    }

    /**
     * Download backup file
     */
    public function downloadBackup($filename)
    {
        $filepath = storage_path('app/backups/' . $filename);

        if (!File::exists($filepath)) {
            return response()->json(['message' => 'File tidak ditemukan'], 404);
        }

        return response()->download($filepath);
    }

    /**
     * Delete backup file
     */
    public function deleteBackup($filename)
    {
        $filepath = storage_path('app/backups/' . $filename);

        if (File::exists($filepath)) {
            File::delete($filepath);
            self::log('delete', 'Deleted backup: ' . $filename);
        }

        return response()->json(['message' => 'Backup berhasil dihapus']);
    }
}

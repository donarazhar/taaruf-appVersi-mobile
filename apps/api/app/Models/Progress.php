<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    use HasFactory;

    protected $table = 'progress';

    protected $fillable = [
        'email',
        'email_target',
        'status',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'email', 'email');
    }

    public function targetKaryawan()
    {
        return $this->belongsTo(Karyawan::class, 'email_target', 'email');
    }
}

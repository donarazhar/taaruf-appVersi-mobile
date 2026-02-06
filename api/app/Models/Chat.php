<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chat';

    protected $fillable = [
        'id_proses',
        'email_pengirim',
        'pesan',
    ];

    public function proses()
    {
        return $this->belongsTo(Proses::class, 'id_proses');
    }

    public function pengirim()
    {
        return $this->belongsTo(Karyawan::class, 'email_pengirim', 'email');
    }
}

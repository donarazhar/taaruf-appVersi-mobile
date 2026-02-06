<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proses extends Model
{
    use HasFactory;

    protected $table = 'proses';

    protected $fillable = [
        'email_pria',
        'email_wanita',
    ];

    public function pria()
    {
        return $this->belongsTo(Karyawan::class, 'email_pria', 'email');
    }

    public function wanita()
    {
        return $this->belongsTo(Karyawan::class, 'email_wanita', 'email');
    }

    public function chats()
    {
        return $this->hasMany(Chat::class, 'id_proses');
    }
}

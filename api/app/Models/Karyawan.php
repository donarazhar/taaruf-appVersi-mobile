<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Karyawan extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'karyawan';

    protected $fillable = [
        'nip',
        'nama',
        'email',
        'jenkel',
        'password',
        'referensi',
        'referensi_detail',
        'foto',
        'status',
        'email_verification_token',
    ];

    protected $hidden = [
        'password',
        'email_verification_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function biodata()
    {
        return $this->hasOne(Biodata::class, 'email', 'email');
    }

    public function kriteriaPasangan()
    {
        return $this->hasOne(KriteriaPasangan::class, 'email', 'email');
    }
}

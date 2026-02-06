<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KriteriaPasangan extends Model
{
    use HasFactory;

    protected $table = 'kriteria_pasangan';

    protected $fillable = [
        'email',
        'usia_min',
        'usia_max',
        'status_nikah',
        'pendidikan',
        'kriteria_lain',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'email', 'email');
    }
}

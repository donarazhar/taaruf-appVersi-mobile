<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biodata extends Model
{
    use HasFactory;

    protected $table = 'biodata';

    protected $fillable = [
        'email',
        'tempatlahir',
        'tgllahir',
        'goldar',
        'statusnikah',
        'pekerjaan',
        'suku',
        'pendidikan',
        'hobi',
        'motto',
        'nohp',
        'alamat',
        'tinggi',
        'berat',
        'video',
    ];

    protected function casts(): array
    {
        return [
            'tgllahir' => 'date',
        ];
    }

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'email', 'email');
    }
}

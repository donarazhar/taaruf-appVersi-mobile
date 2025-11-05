# Taaruf V2.10.2025  
Aplikasi Taaruf Onlline Khusus Karyawan YPI Al Azhar
Versi: 2.10.2025  
Dibangun oleh Donar Azhar  

## Deskripsi Singkat
Aplikasi ini bertujuan untuk … (jelaskan tujuan utama aplikasi: misalnya “memfasilitasi proses taaruf secara digital,” “mendukung pendaftaran dan match making,” atau sesuai konteks aplikasi Anda).

## Fitur Utama
- Pendaftaran pengguna (misalnya: calon Peer, wali, dsb)
- Profil pengguna, verifikasi, dan validasi data
- Proses match atau proses taaruf: pencocokan, chat, tahap-tahap taaruf
- Dashboard admin untuk manajemen pengguna dan proses
- Laporan atau statistik penggunaan
- Keamanan, role dan permission (misalnya memakai Laravel Shield atau plugin serupa)
- Integrasi dengan modul-lain (video call, chat, notifikasi, dsb — jika ada)

## Teknologi yang Digunakan
- Bahasa: PHP
- Framework: Laravel (versi 10)
- Frontend: Blade
- Basis data: MySQL

## Prasyarat & Instalasi
- PHP ≥ 8.1
- Composer
- Node.js & npm/yarn
- Database (MySQL)
- Ekstensi PHP yang diperlukan (OpenSSL, PDO, Mbstring)

## Clode Repository 
    ```bash
    git clone https://github.com/donarazhar/taaruf_v2.10.2025.git
## Install dependency PHP
    ``` bash
    composer install
    npm install
    npm run dev
## Konfigurasi environment:
- Copy .env.example → .env
- Sesuaikan pengaturan database, mail, broadcast, dsb.

    ```bash
    php artisan key:generate
    php artisan migrate --seed

## Konfigurasi & Penggunaan
- Database: pengaturan di .env (DB_HOST, DB_DB, DB_USER, DB_PASS)
- Mail: pengaturan SMTP jika aplikasi kirim email

## Penggunaan
- Login sebagai admin / pengguna (berikan URL dan credentials default jika ada)
- Akses dashboard: /admin atau sesuai rute
- Modul Pengguna: pendaftaran → verifikasi → profil
- Modul Taaruf: cara memulai “match” / tahap taaruf → chat → progress
- Modul Laporan: lihat statistik, download laporan (jika ada)

## Struktur Direktori
Berikut beberapa direktori penting dalam proyek ini:
app/                — model, controller, service  
database/           — migrasi & seeder  
resources/views/    — tampilan Blade / frontend  
routes/web.php      — routing aplikasi  
public/             — asset publik: css, js, gambar  
config/             — pengaturan aplikasi  
docs/               — dokumentasi tambahan (jika digunakan)  

## Lisensi
Proyek ini dilisensikan di bawah lisensi MIT (atau sesuai lisensi yang Anda pilih)

## Penulis & Kontak

Donar Azhar IG : https://www.instagram.com/donsiyos/
Email : donarazhar@gmail.com
     

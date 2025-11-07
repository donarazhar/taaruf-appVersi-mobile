# Taaruf V2.10.2025  
Aplikasi Taaruf Onlline Khusus Karyawan YPI Al Azhar versi: 2.10.2025 dibangun oleh Donar Azhar  

## Deskripsi Singkat
Aplikasi ini bertujuan untuk menghubungkan semua pegawai YPI Al Azhar yang berstatus sendiri untuk saling mengenal atau perkenalan. Dalam konteks mencari jodoh, aplikasi taaruf ini pure proses Islami untuk mengenal calon pasangan hidup dengan cara yang sesuai syariat, dengan tujuan tunggal menuju pernikahan.

Masih banyak kekurangan dalam alur aplikasi dan konsep, kami sangat menerima saran, kritik untuk kemajuan aplikasi ini. Saran dan kritik dapat disampaikan ke email : donarazhar@gmail.com

## Fitur Utama  
- Halaman frontpage
- Halaman login admin dengan url : /panel 
- Halaman Admin :
    - Master Data ( Artikel, Youtube, Data Karyawan)
    - Admin mengelola data karyawan yang mendaftar, dengan mengapprove.
    - Data karyawan yang sudah di Approve wajib, cek link di email mereka untuk mengklik link.
    - Menu lainnya ( Daftar QnA, Proses Taaruf)
    - Pada proses taaruf, admin akan mencetak surat undangan kepada karyawan yang sudah sama sama cocok, untuk dipertemukan dalam sesi konsultasi agama.
- Halaman Karyawan :
    - Sebelum login, karyawan harus masuk menu daftar dahulu, dimana akan diminta mengisi NIK yang terhubung pada API data kepegawaian
    - Jika tidak ada NIK yang sesuai, karyawan tidak bisa daftar, untuk proses daftar bisa membacara QnA yang ada dihalaman frontpage.
    - Pada halaman dashboard karyawan, setiap user yang masuk harus mengisi profile lengkap terlebih dahulu agar menu taaruf dan progress
    - Silahkan eksplor menu taaruf dan progress, karena menu ini berfungsi untuk menghubungkan kepada calon yang diinginkan.

## Teknologi  
- PHP 8.1
- Laravel (versi 10.10), Blade templates, JavaScript 
- Database MySQL

## Instalasi  
      ```
      git clone https://github.com/donarazhar/taaruf_v2.10.2025.git
      composer install
      buat file .env
      php artisan key:generate
      php artisan migrate --seed

## Developer  
Donar Azhar  IG : https://www.instagram.com/donsiyos/
Email: donarazhar@gmail.com  

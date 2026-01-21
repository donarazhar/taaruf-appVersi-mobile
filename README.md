# Taaruf V2.10.2025 - Monorepo

Aplikasi Taaruf Online Khusus Karyawan YPI Al Azhar  
**Versi:** 2.10.2025  
**Developer:** Donar Azhar

## 📋 Deskripsi

Aplikasi ini bertujuan untuk menghubungkan semua pegawai YPI Al Azhar yang berstatus sendiri untuk saling mengenal atau perkenalan. Dalam konteks mencari jodoh, aplikasi taaruf ini pure proses Islami untuk mengenal calon pasangan hidup dengan cara yang sesuai syariat, dengan tujuan tunggal menuju pernikahan.

## 🏗️ Arsitektur Monorepo

Aplikasi telah ditransformasi dari Laravel 10 (Blade + MySQL) menjadi arsitektur **monorepo modern**:

```
taaruf_v2.10.2025/
├── apps/
│   ├── api/        # Laravel 12 + PostgreSQL + Sanctum API
│   ├── web/        # React + Vite
│   └── mobile/     # Expo (React Native)
└── old/            # Aplikasi Laravel 10 lama (archived)
```

## 🚀 Tech Stack

### API Backend
- **Framework:** Laravel 12
- **Database:** PostgreSQL 15+
- **Authentication:** Laravel Sanctum (Token-based)
- **PHP:** 8.2+

### Web Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6
- **Routing:** React Router (to be implemented)
- **HTTP Client:** Axios (to be implemented)

### Mobile App
- **Framework:** React Native + Expo
- **Navigation:** React Navigation (to be implemented)

## 📦 Instalasi

### Prerequisites
Pastikan sudah terinstall:
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 15+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/donarazhar/taaruf_v2.10.2025.git
cd taaruf_v2.10.2025
```

### 2. Setup Database
```sql
# Buat database PostgreSQL
CREATE DATABASE taaruf_db;
```

### 3. Setup API Backend
```bash
cd apps/api

# Install dependencies
composer install

# Copy .env dan update konfigurasi database
# Update DB_PASSWORD dengan password PostgreSQL Anda

# Generate application key (sudah otomatis)
php artisan key:generate

# Run migrations
php artisan migrate

# Run seeders (optional)
php artisan db:seed
```

### 4. Setup Web Frontend
```bash
cd apps/web

# Install dependencies (sudah terinstall)
npm install

# Run development server
npm run dev
```

### 5. Setup Mobile App
```bash
cd apps/mobile

# Install dependencies (sudah terinstall)
npm install

# Run development server
npm start
```

## 🎯 Cara Menjalankan

### Jalankan semua apps secara bersamaan:

**Terminal 1 - API:**
```bash
npm run api:dev
# API akan berjalan di http://localhost:8000
```

**Terminal 2 - Web:**
```bash
npm run web:dev
# Web akan berjalan di http://localhost:5173
```

**Terminal 3 - Mobile:**
```bash
npm run mobile:dev
# Scan QR code dengan Expo Go app di smartphone
```

### Atau gunakan scripts individual:
```bash
# API
cd apps/api && php artisan serve

# Web
cd apps/web && npm run dev

# Mobile
cd apps/mobile && npm start
```

## 📡 API Endpoints

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrasi karyawan | ❌ |
| POST | `/api/auth/login` | Login karyawan | ❌ |
| POST | `/api/auth/admin/login` | Login admin | ❌ |
| POST | `/api/auth/logout` | Logout | ✅ |
| GET | `/api/profile` | Get profile user | ✅ |

**Auth:** ✅ = Memerlukan Bearer Token

## 🗄️ Database Schema

Aplikasi menggunakan PostgreSQL dengan 13 tabel utama:

- `users` - Data admin
- `karyawan` - Data karyawan/user
- `biodata` - Data lengkap karyawan
- `kriteria_pasangan` - Kriteria pasangan yang diinginkan
- `proses` - Tracking proses taaruf
- `progress` - Status progress taaruf
- `progress_shadow` - Shadow table untuk progress
- `chat` - Pesan chat antar karyawan
- `chat_shadow` - Shadow table untuk chat
- `berita` - Artikel/berita
- `pertanyaan` - QnA
- `likedislike` - Status like/dislike
- `likedislike_shadow` - Shadow table
- `youtube` - Link video youtube

## 📝 Fitur Utama

### Admin Panel
- Master Data (Artikel, Youtube, Data Karyawan)
- Approve data karyawan yang mendaftar
- Daftar QnA
- Proses Taaruf
- Cetak surat undangan konsultasi

### Karyawan
- Registrasi dengan NIK (terhubung API kepegawaian)
- Profile lengkap
- Menu Taaruf (mencari kandidat)
- Progress tracking
- Chat dengan kandidat
- Like/Dislike kandidat

## 🛠️ Development

### Database Migration
```bash
npm run api:migrate
# atau
cd apps/api && php artisan migrate
```

### Database Seeding
```bash
npm run api:seed
# atau
cd apps/api && php artisan db:seed
```

## 📧 Kontak

**Developer:** Donar Azhar  
**Email:** donarazhar@gmail.com  
**Instagram:** [@donsiyos](https://www.instagram.com/donsiyos/)

## 📄 License

MIT

---

> **Note:** Aplikasi Laravel 10 lama (Blade templates) sudah dipindahkan ke folder `old/` dan tidak digunakan lagi. Aplikasi baru menggunakan arsitektur API + SPA + Mobile App.

# 📚 Taaruf App - Deployment & Troubleshooting Guide

Dokumentasi lengkap untuk deployment dan troubleshooting aplikasi Taaruf.

---

## 🌐 Arsitektur Sistem

```
┌─────────────────┐      ┌───────────────────┐      ┌─────────────────┐
│   User Browser  │ ───► │  Cloudflare SSL   │ ───► │  Ubuntu Server  │
│                 │      │  (Edge Proxy)     │      │  192.168.13.76  │
└─────────────────┘      └───────────────────┘      └─────────────────┘
                                                           │
                         ┌─────────────────────────────────┼─────────────────┐
                         │                                 │                 │
                         ▼                                 ▼                 ▼
                 ┌───────────────┐               ┌─────────────────┐  ┌─────────────┐
                 │ taaruf.       │               │ taaruf-api.     │  │ Cloudflared │
                 │ donarazhar.   │               │ donarazhar.     │  │ Tunnel      │
                 │ site          │               │ site            │  │             │
                 │ (Web React)   │               │ (Laravel API)   │  │             │
                 └───────────────┘               └─────────────────┘  └─────────────┘
```

---

## ⚠️ SSL Subdomain Naming

### Masalah: Universal SSL Hanya Cover 1 Level

Cloudflare **Universal SSL (gratis)** hanya mencakup:

- `donarazhar.site` ✅
- `*.donarazhar.site` (1 level) ✅

**TIDAK** mencakup:

- `*.taaruf.donarazhar.site` (2 level) ❌

### Solusi: Gunakan Single-Level Subdomain

| ❌ Salah (2 level)             | ✅ Benar (1 level)             |
| ------------------------------ | ------------------------------ |
| `api.taaruf.donarazhar.site`   | `taaruf-api.donarazhar.site`   |
| `admin.taaruf.donarazhar.site` | `taaruf-admin.donarazhar.site` |

### Cara Update Cloudflared Config

```bash
# Edit config
nano /etc/cloudflared/config.yml

# Ganti hostname
# SEBELUM: api.taaruf.donarazhar.site
# SESUDAH: taaruf-api.donarazhar.site

# Tambah DNS route baru
cloudflared tunnel route dns taaruf taaruf-api.donarazhar.site

# Restart service
systemctl restart cloudflared

# Hapus DNS record lama di Cloudflare Dashboard
```

---

## 🔐 Google OAuth Configuration

### Flow Google OAuth

```
1. User klik "Login with Google"
        │
        ▼
2. Frontend hit API: GET /api/auth/google
        │
        ▼
3. API return Google OAuth URL
        │
        ▼
4. User redirect ke Google, login, consent
        │
        ▼
5. Google redirect ke: taaruf-api.donarazhar.site/api/auth/google/callback
        │
        ▼
6. API proses, lalu REDIRECT ke:
   taaruf.donarazhar.site/auth/google/callback?token=...&user=...
        │
        ▼
7. Frontend baca token dari URL, simpan ke localStorage, redirect ke Dashboard
```

### Setup Google Cloud Console

1. Buka https://console.cloud.google.com
2. Pilih/buat project
3. Buka **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**

4. Isi form:
   - **Application type**: Web application
   - **Name**: Taaruf App
5. **Authorized JavaScript origins**:

   ```
   https://taaruf.donarazhar.site
   ```

6. **Authorized redirect URIs**:

   ```
   https://taaruf-api.donarazhar.site/api/auth/google/callback
   ```

7. Klik **Create** dan copy **Client ID** & **Client Secret**

### Update Laravel .env

```bash
nano /var/www/taaruf/api/.env
```

Tambahkan:

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://taaruf-api.donarazhar.site/api/auth/google/callback
```

Clear cache:

```bash
cd /var/www/taaruf/api
php artisan config:clear
php artisan cache:clear
```

### ⚠️ Penting: API Harus Redirect, Bukan Return JSON

**❌ SALAH** - Return JSON langsung:

```php
return response()->json([
    'token' => $token,
    'user' => $user
]);
```

**✅ BENAR** - Redirect ke frontend dengan token di URL:

```php
return redirect($frontendUrl . '/auth/google/callback?' . http_build_query([
    'token' => $token,
    'user' => urlencode(json_encode($user)),
    'is_admin' => 'true',
    'role' => 'super_admin'
]));
```

---

## 🚀 Deployment Steps

### 1. Pull Latest Code

```bash
cd /var/www/taaruf
git pull origin main
```

### 2. Deploy Web Frontend

```bash
# Hapus dist lama
rm -rf web-dist/*

# Extract dist baru
unzip -o web/dist.zip -d web-dist

# Verifikasi API URL
grep "taaruf-api" web-dist/assets/*.js | head -1
```

### 3. Deploy API Backend

```bash
cd api

# Install dependencies
composer install --no-dev --optimize-autoloader

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Migrate database (jika perlu)
php artisan migrate --force
```

### 4. Set Permissions

```bash
chown -R www-data:www-data /var/www/taaruf
chmod -R 755 /var/www/taaruf
chmod -R 775 /var/www/taaruf/api/storage
chmod -R 775 /var/www/taaruf/api/bootstrap/cache
```

### 5. Restart Services

```bash
systemctl restart php8.2-fpm
systemctl restart nginx
systemctl restart cloudflared
```

---

## 🔧 Troubleshooting

### SSL Error: ERR_SSL_VERSION_OR_CIPHER_MISMATCH

**Penyebab:** Subdomain tidak di-cover oleh Universal SSL

**Solusi:**

1. Cek apakah subdomain 2 level (seperti `api.taaruf.domain.com`)
2. Rename ke 1 level (seperti `taaruf-api.domain.com`)
3. Atau disable/enable Universal SSL di Cloudflare

### API Return 500 Error

**Penyebab:** Biasanya `Route [login] not defined`

**Solusi:** Tambah exception handler di `bootstrap/app.php`:

```php
use Illuminate\Auth\AuthenticationException;

$exceptions->render(function (AuthenticationException $e, Request $request) {
    if ($request->is('api/*') || $request->expectsJson()) {
        return response()->json([
            'message' => 'Unauthenticated.',
            'error' => 'Token tidak valid atau tidak ditemukan'
        ], 401);
    }
});
```

### Google OAuth Login Showing JSON Instead of Dashboard

**Penyebab:** API return JSON langsung ke browser

**Solusi:** Ubah API agar redirect ke frontend dengan token di URL params

### Web Still Using localhost:8000

**Penyebab:** Server belum deploy dist.zip baru

**Solusi:**

```bash
rm -rf web-dist/*
unzip -o web/dist.zip -d web-dist
grep "taaruf-api" web-dist/assets/*.js | head -1
```

---

## 📋 Checklist Deployment

- [ ] Git pull latest code
- [ ] Extract web dist.zip ke web-dist/
- [ ] Composer install di folder api/
- [ ] Clear Laravel cache
- [ ] Set file permissions
- [ ] Restart PHP-FPM, Nginx, Cloudflared
- [ ] Test login email/password
- [ ] Test login Google OAuth
- [ ] Test API endpoints

---

## 📞 URL Aplikasi

| Service          | URL                                         |
| ---------------- | ------------------------------------------- |
| Web Frontend     | https://taaruf.donarazhar.site              |
| API Backend      | https://taaruf-api.donarazhar.site          |
| API Health Check | https://taaruf-api.donarazhar.site/api/user |

---

_Dokumentasi ini dibuat pada 7 Februari 2026_

# 📱 Taaruf Mobile - Build & Deployment Guide

Dokumentasi lengkap untuk build dan deployment aplikasi mobile Taaruf.

---

## 🏗️ Arsitektur Mobile

```
┌─────────────────┐      ┌───────────────────┐      ┌─────────────────┐
│   Expo/React    │ ───► │   EAS Build       │ ───► │   APK File      │
│   Native        │      │   (Cloud)         │      │   (Shareable)   │
└─────────────────┘      └───────────────────┘      └─────────────────┘
        │                                                    │
        ▼                                                    ▼
┌─────────────────┐                                ┌─────────────────┐
│ Production API  │                                │ Android Device  │
│ taaruf-api.     │                                │ / Emulator      │
│ donarazhar.site │                                │                 │
└─────────────────┘                                └─────────────────┘
```

---

## ⚙️ Tech Stack

| Component        | Version |
| ---------------- | ------- |
| Expo             | 54.0.31 |
| React Native     | 0.81.5  |
| React            | 19.1.0  |
| React Navigation | 6.x     |
| EAS CLI          | Latest  |

---

## 🔧 Setup Development

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Update API URL

Edit `src/services/api.js`:

```javascript
// Development (Android Emulator)
export const API_URL = "http://10.0.2.2:8000/api";

// Production
export const API_URL = "https://taaruf-api.donarazhar.site/api";
```

### 3. Run Development Server

```bash
npx expo start
```

---

## 📦 Build APK dengan EAS

### Prerequisites

1. Login ke EAS:

   ```bash
   npx eas login
   ```

2. Pastikan sudah ada `eas.json` dengan profile `preview`:
   ```json
   {
     "build": {
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```

### Build Command

```bash
cd mobile
npx eas build --platform android --profile preview
```

### Output

- Build berjalan di cloud (~10-15 menit)
- Setelah selesai, link download APK akan ditampilkan
- APK bisa langsung di-share ke tester

---

## ⚠️ Troubleshooting

### 1. Kotlin Version Mismatch

**Error:**

```
This version (1.5.15) of the Compose Compiler requires Kotlin version 1.9.25
but you appear to be using Kotlin version 1.9.24
```

**Penyebab:** Folder `android/` mengandung konfigurasi Kotlin outdated

**Solusi:**

```bash
# Hapus folder android (biarkan EAS generate ulang)
rm -rf android

# Rebuild
npx eas build --platform android --profile preview
```

### 2. Module Not Found

**Error:**

```
Unable to resolve module @react-navigation/stack
```

**Solusi:** Tambahkan dependency yang missing ke `package.json`:

```bash
npm install @react-navigation/stack
```

### 3. Expo Version Incompatibility

**Masalah:** Expo 52 memiliki dependency conflict dengan Compose Compiler

**Solusi:** Upgrade ke Expo 54:

```json
{
  "dependencies": {
    "expo": "~54.0.31",
    "react": "19.1.0",
    "react-native": "0.81.5"
  }
}
```

Lalu:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 4. Managed vs Bare Workflow

| Workflow       | Folder Android | Maintenance           |
| -------------- | -------------- | --------------------- |
| **Managed** ✅ | Tidak ada      | EAS generate otomatis |
| **Bare** ❌    | Ada            | Harus maintain manual |

**Rekomendasi:** Gunakan Managed Workflow (tanpa folder `android/`) untuk menghindari masalah compatibility.

---

## 📁 Project Structure

```
mobile/
├── src/
│   ├── components/     # UI Components
│   ├── screens/        # Screens/Pages
│   ├── navigation/     # Navigation config
│   ├── services/       # API services
│   │   └── api.js      # API configuration
│   └── context/        # React Context
├── assets/             # Images, fonts
├── App.js              # Main entry
├── app.json            # Expo config
├── eas.json            # EAS Build config
└── package.json        # Dependencies
```

---

## 🚀 Deployment Checklist

- [ ] Update API URL di `src/services/api.js` ke production
- [ ] Pastikan tidak ada folder `android/` (Managed Workflow)
- [ ] Run `npm install` untuk pastikan dependencies lengkap
- [ ] Run `npx eas build --platform android --profile preview`
- [ ] Tunggu build selesai (~10-15 menit)
- [ ] Download dan test APK
- [ ] Share link APK ke tester

---

## 🔗 Useful Links

| Resource       | URL                                                                 |
| -------------- | ------------------------------------------------------------------- |
| EAS Builds     | https://expo.dev/accounts/donarazhar/projects/taaruf-alazhar/builds |
| Expo Docs      | https://docs.expo.dev                                               |
| EAS CLI        | https://docs.expo.dev/eas                                           |
| Production API | https://taaruf-api.donarazhar.site                                  |
| Production Web | https://taaruf.donarazhar.site                                      |

---

_Dokumentasi ini dibuat pada 7 Februari 2026_

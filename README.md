# 📸 MyRepublic GPS Cam

Aplikasi React Native dengan Expo untuk mengambil foto dari kamera dan menambahkan informasi lokasi secara otomatis, termasuk:

* Foto dari kamera
* Lokasi (latitude, longitude, altitude)
* Status GPS palsu (mocked)
* Cuplikan peta lokasi (Google Maps)
* Watermark ikon dan teks
* Menyimpan gambar ke galeri

---

## 🧰 Teknologi Digunakan

* React Native + Expo
* Redux Toolkit
* `@shopify/react-native-skia`
* `expo-location`, `expo-media-library`, `expo-file-system`
* `react-native-maps`
* `react-native-view-shot`

---

## ⚙️ Konfigurasi API Key Google Maps

Tambahkan API Key Google Maps Anda di file `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "MASUKKAN_API_KEY_ANDA_DI_SINI"
        }
      }
    }
  }
}
```

---

## ▶️ Menjalankan Aplikasi Secara Lokal

Jalankan perintah berikut:

```bash
npm install
npx expo start
```

---

## 📦 Build APK Menggunakan EAS

1. Inisialisasi build:

```bash
eas build:configure
```

2. Edit `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

3. Jalankan build:

```bash
npx eas build -p android --profile production
```

---

## 📱 SDK Android

* `minSdkVersion`: 24
* `targetSdkVersion`: 35
* `compileSdkVersion`: 35

---

Pastikan Anda sudah memberikan izin lokasi dan penyimpanan agar fitur berjalan dengan baik.

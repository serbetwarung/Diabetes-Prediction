# Panduan Kontribusi

## Prasyarat
- Node.js v14+
- npm atau yarn
- Akun AWS

## Pengaturan Proyek
1. Fork repository
2. Clone repository
3. Instal dependensi:
   ```bash
   npm install
   ```

## Struktur Proyek
- `src/components/`: Komponen React
- `src/services/`: Layanan dan logika bisnis
- `src/config/`: Konfigurasi aplikasi
- `src/tests/`: Pengujian unit

## Pengembangan
- Gunakan cabang fitur untuk pengembangan
- Pastikan semua tes lulus sebelum merge
- Gunakan commit message yang jelas

## Pedoman Kode
- Ikuti panduan gaya kode React
- Gunakan ESLint
- Tulis tes untuk fitur baru

## Proses Pull Request
1. Buat PR ke cabang `main`
2. Jelaskan perubahan dalam deskripsi
3. Tunggu tinjauan tim

## Catatan Keamanan
- Jangan commit kredensial AWS
- Gunakan environment variables
- Lindungi informasi sensitif

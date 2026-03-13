# Sistem Informasi Perpustakaan (RPL)

Aplikasi manajemen perpustakaan sederhana yang dibangun dengan Laravel.

## Fitur Utama
- **Manajemen Buku**: Kelola katalog buku dan kategori.
- **Manajemen Member**: Registrasi dan pendataan anggota.
- **Transaksi Peminjaman**: Pencatatan peminjaman dengan validasi stok.
- **Transaksi Pengembalian & Denda**: Perhitungan denda otomatis untuk keterlambatan.

## Dokumentasi Desain Sistem
Untuk melihat dokumentasi teknis seperti **Data Flow Diagram (DFD)**, **Activity Diagram**, dan **Use Case Diagram**, silakan cek link di bawah ini:

👉 [**Dokumentasi Desain Sistem (DFD, Activity, Use Case)**](docs/system_design.md)

---

## Cara Menjalankan

### Menggunakan Docker (Rekomendasi)
1. Build container:
   ```bash
   docker compose build
   ```
2. Jalankan aplikasi:
   ```bash
   docker compose up -d
   ```

### Manual (Lokal)
1. Pastikan ekstensi SQLite terpasang:
   ```bash
   sudo apt install php-sqlite3
   ```
2. Install dependensi:
   ```bash
   composer install
   ```
3. Jalankan server:
   ```bash
   php artisan serve
   ```

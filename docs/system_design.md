# Dokumentasi Desain Sistem Perpustakaan

Dokumen ini berisi rancangan teknis aplikasi perpustakaan, termasuk DFD, Activity Diagram, dan Use Case Diagram.

---

## 1. Use Case Diagram

Menunjukkan fungsi utama yang dapat dilakukan oleh pengguna (Pustakawan).

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Admin / Pustakawan" as admin

rectangle "Sistem Informasi Perpustakaan" {
    usecase "Kelola Data Buku" as uc_books
    usecase "Kelola Kategori Buku" as uc_categories
    usecase "Kelola Data Member" as uc_members
    usecase "Transaksi Peminjaman" as uc_borrow
    usecase "Transaksi Pengembalian" as uc_return
    usecase "Kelola Denda" as uc_fines
    usecase "Kelola Pengaturan" as uc_settings
}

admin --> uc_books
admin --> uc_categories
admin --> uc_members
admin --> uc_borrow
admin --> uc_return
admin --> uc_fines
admin --> uc_settings
@enduml
```

---

## 2. Data Flow Diagrams (DFD)

### DFD Level 0 (Context Diagram)

```plantuml
@startuml
!pragma GlobalRender dot
left to right direction
skinparam packageStyle rectangle

actor "Admin / Pustakawan" as admin

rectangle "Sistem Informasi Perpustakaan" as system

admin --> system : Input Data Buku & Kategori
admin --> system : Registrasi Member
admin --> system : Input Transaksi Peminjaman
admin --> system : Validasi Pengembalian

system --> admin : Info Ketersediaan Buku
system --> admin : Rekap Transaksi & Denda
@enduml
```

### DFD Level 1 (Overview Diagram)

```plantuml
@startuml
!pragma GlobalRender dot
left to right direction

actor "Admin / Pustakawan" as admin

storage "Data Store" {
    database "D1: Books/Categories" as db_books
    database "D2: Members" as db_members
    database "D3: Borrowings" as db_borrowings
    database "D4: Fines" as db_fines
}

rectangle "P1: Kelola Katalog & Member" as p1
rectangle "P2: Transaksi Peminjaman" as p2
rectangle "P3: Transaksi Pengembalian" as p3
rectangle "P4: Penanganan Denda" as p4

' Alur P1
admin --> p1 : Input Buku/Member
p1 --> db_books : Simpan Data Buku
p1 --> db_members : Simpan Data Member

' Alur P2
admin --> p2 : Catat Peminjaman
db_books --> p2 : Cek Stok
db_members --> p2 : Validasi ID
p2 --> db_borrowings : Simpan Record Pinjaman

' Alur P3
admin --> p3 : Input Pengembalian
db_borrowings --> p3 : Cek Durasi Pinjam
p3 --> db_borrowings : Update Status (Selesai)
p3 --> p4 : Teruskan data jika Terlambat

' Alur P4
p4 --> db_fines : Simpan/Update Denda
db_fines --> admin : Laporan Denda
@enduml
```

---

## 3. Action Diagrams (Activity Diagrams)

### Activity Diagram: Peminjaman Buku

```plantuml
@startuml
start
:Pustakawan Membuka Form Peminjaman;
:Input ID Member dan ID Buku;
:Input Tanggal Pinjam dan Tanggal Kembali;

if (Data Valid?) then (Ya)
    :Sistem Mencatat Data Peminjaman;
    :Status Peminjaman = "Borrowed";
    :Kurangi Stok Buku di Database;
    :Tampilkan Pesan Berhasil;
else (Tidak)
    :Tampilkan Pesan Error;
    stop
endif

stop
@enduml
```

### Activity Diagram: Pengembalian & Penanganan Denda

```plantuml
@startuml
start
:Pustakawan Update Status Peminjaman;
:Sistem Menghitung Selisih Hari (Sekarang - Jatuh Tempo);

if (Terlambat?) then (Ya)
    :Sistem Update Status = "Overdue";
    :Hitung Denda (Base Fine + Mingguan);
    :Buat Record Denda "Unpaid";
else (Tidak)
    :Sistem Update Status = "Returned";
endif

:Tambah Stok Buku di Database;
:Tampilkan Status Akhir;
stop
@enduml
```

# 🏫 Portal Penerimaan Siswa Baru (PPDB) — Mentari Islamic School

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Django](https://img.shields.io/badge/Django-6.1-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.18-red?logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)]()

Portal Sistem Informasi Penerimaan Peserta Didik Baru (PPDB / PSHB) modern, responsif, dan terintegrasi untuk seluruh jenjang pendidikan di bawah naungan **Mentari Islamic School (MIS)** (TPA-KB, TK, SD, hingga PKBM/SMP-SMA). Dilengkapi dengan alur registrasi mandiri calon siswa, manajemen verifikasi berkas panitia, penjadwalan observasi/seleksi, pengumuman hasil kelulusan, serta integrasi gateway pembayaran digital (BRIVA & QRIS).

---

## 📑 Daftar Isi
- [Gambaran Umum Sistem](#-gambaran-umum-sistem)
- [Modul & Fitur Aplikasi](#-modul--fitur-aplikasi)
  - [1. Halaman Publik & Pendaftaran](#1-halaman-publik--pendaftaran-online)
  - [2. Dashboard Calon Peserta / Santri](#2-dashboard-calon-peserta--santri)
  - [3. Portal Administrator & Panitia PPDB](#3-portal-administrator--panitia-ppdb)
  - [4. Integrasi Gateway Pembayaran](#4-integrasi-gateway-pembayaran-bri-api-snap)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori Proyek](#-struktur-direktori-proyek)
- [Panduan Instalasi & Menjalankan Proyek](#-panduan-instalasi--menjalankan-proyek)
  - [Prasyarat Sistem](#prasyarat-sistem)
  - [Instalasi Backend (Django)](#1-instalasi-backend-django-rest-framework)
  - [Instalasi Frontend (React + Vite)](#2-instalasi-frontend-react--vite)
- [Keamanan & Standar Pengembangan](#-keamanan--standar-pengembangan)

---

## 🌟 Gambaran Umum Sistem

Sistem PPDB Mentari Islamic School dirancang untuk menyederhanakan siklus penerimaan siswa dari awal pendaftaran hingga penetapan siswa diterima:
- **Calon Wali Santri**: Mendaftar secara online, memilih jenjang/unit sekolah, membayar biaya formulir, mengisi kelengkapan dokumen siswa & orang tua, memilih jadwal seleksi, dan memantau status kelulusan secara real-time.
- **Panitia PPDB**: Memvalidasi berkas pendaftaran, mengatur kuota pendaftar, membuat sesi ruang seleksi, memantau absensi tes, dan merilis surat pengumuman kelulusan resmi.

---

## 🚀 Modul & Fitur Aplikasi

### 1. Halaman Publik & Pendaftaran Online
- **Scrollable Landing Page (`/`)**: Beranda interaktif yang menggabungkan Hero Section, Profil Lembaga (*Tentang Kami*), Katalog Unit Pendidikan, dan Alur Pendaftaran dengan fitur *Scroll Spy Navigation*.
- **Katalog & Detail Unit Pendidikan (`/unit/:id`)**: Rincian profil tiap jenjang (TPA, KB, TK, SD, PKBM), keunggulan kurikulum, rincian biaya pendaftaran & SPP, persyaratan usia, serta sisa kuota yang tersedia.
- **Formulir Pendaftaran Awal (`/daftar/:id`)**: Formulir pendaftaran akun calon santri yang dilengkapi dengan **Unggah Berkas Persyaratan Digital Dinamis** (Akta Kelahiran & KK untuk PAUD/SD; ditambah Ijazah & Rapor Terakhir untuk SMP/SMA) serta validasi data otomatis.
- **Tagihan & Invoice Pendaftaran (`/tagihan/:id`)**: Halaman invoice pembayaran biaya formulir yang dilengkapi instruksi bayar, nomor rekening/virtual account, countdown batas pembayaran, dan opsi konfirmasi pembayaran mandiri.
- **Cek Cepat Pengumuman Kelulusan (`/pengumuman` & `/cek-status`)**: Fitur pencarian cepat status hasil seleksi santri menggunakan Nomor Registrasi atau NISN tanpa harus login.
- **Login Peserta & Panitia (`/login`)**: Halaman autentikasi aman dengan desain *split-screen* modern.

### 2. Dashboard Calon Peserta / Santri
Halaman privat calon wali murid setelah berhasil login ke sistem (`/dashboard`):
- **Beranda Dashboard (`/dashboard`)**: Ringkasan status progres pendaftaran (Pendaftaran Awal ➜ Pembayaran Formulir ➜ Pengisian Biodata & Berkas ➜ Tes Seleksi ➜ Hasil Kelulusan ➜ Daftar Ulang).
- **Biodata & Unggah Dokumen (`/dashboard/biodata`)**: Formulir komprehensif data identitas santri, kontak wali, orang tua, serta **Pusat Pemantauan & Verifikasi Berkas Digital** dinamis sesuai jenjang unit santri (notifikasi khusus jika berkas berstatus *Perlu Perbaikan* dan fitur unggah ulang mandiri).
- **Tagihan Keuangan (`/dashboard/tagihan`)**: Monitoring riwayat pembayaran formulir dan tagihan daftar ulang pendidikan.
- **Jadwal Seleksi & Ujian (`/dashboard/jadwal`)**: Informasi detail waktu, sesi, ruang, dan instruksi teknis observasi atau wawancara calon siswa.
- **Pengumuman Hasil Seleksi (`/dashboard/hasil`)**: Surat keputusan kelulusan resmi (Diterima / Cadangan / Belum Lulus) dan panduan daftar ulang.
- **Pengaturan Akun (`/dashboard/pengaturan`)**: Manajemen profil pengguna dan pembaruan kata sandi.

### 3. Portal Administrator & Panitia PPDB
Panel kendali komprehensif untuk panitia penerimaan siswa (`/admin-portal`):
- **Admin Dashboard (`/admin-portal`)**: Statistik metrik pendaftar secara real-time, grafik tren per jenjang unit, persentase pembayaran terverifikasi, dan status kuota penerimaan.
- **Pendaftar Manager (`/admin-portal/pendaftar`)**: Tabel manajemen pendaftar dengan filter status (*Pending*, *Terverifikasi*, *Ditolak*), pencarian cepat, detail berkas santri, verifikasi berkas, dan export data.
- **Unit Manager (`/admin-portal/unit`)**: Pengaturan unit pendidikan 4 Bagian Terpadu: Profil Lembaga (Bagian A), Informasi Syarat Teks Landing Page (Bagian B), Pengaturan Berkas Form Pendaftaran Upload Dinamis & Quick Preset (Bagian C), serta Manajemen Multi-Gelombang & Biaya (Bagian D).
- **Input Jadwal Seleksi (`/admin-portal/jadwal/input`)**: Pembuatan gelombang tes, penentuan tanggal pelaksanaan, sesi waktu, alokasi ruang, dan kapasitas kursi per sesi.
- **Monitoring Jadwal Seleksi (`/admin-portal/jadwal/monitoring`)**: Pelacakan kehadiran peserta tes seleksi per sesi secara langsung (*live attendance*).
- **Keputusan Seleksi (`/admin-portal/keputusan`)**: Penetapan status kelulusan peserta (Lulus, Cadangan, Tidak Lulus) secara individu maupun massal (*bulk decision*).

### 4. Integrasi Gateway Pembayaran (BRI API SNAP)
- **Virtual Account (BRIVA)**: Pembuatan nomor VA unik otomatis untuk setiap invoice pendaftaran.
- **QRIS Dinamis**: Tampilan kode QRIS resmi dengan nominal tagihan otomatis siap scan via seluruh aplikasi m-Banking dan e-Wallet (GoPay, OVO, Dana, ShopeePay).
- **Tanda Tangan Digital RSA-SHA256**: Otentikasi transaksi berbasis standar Open API SNAP perbankan nasional.
- **Konfirmasi Pembayaran Manual**: Cadangan verifikasi pembayaran via bukti transfer bank langsung bagi wali murid yang membayar secara konvensional.

---

## 🛠 Teknologi yang Digunakan

### Frontend
- **Framework & Runtime**: React 19, Vite 8
- **Styling**: Tailwind CSS v4, PostCSS, Autoprefixer
- **Navigasi & Routing**: React Router DOM v7
- **Data Fetching & State**: TanStack Query (React Query) v5, Axios
- **Ikon & Komponen Grafis**: React Icons (FontAwesome / Bootstrap Icons), QRCode.React

### Backend
- **Framework Utama**: Python 3.10+, Django 6.1
- **API Engine**: Django REST Framework (DRF)
- **Otentikasi & Keamanan**: Simple JWT (JSON Web Token), Cryptography (RSA Keypair)
- **CORS Handling**: Django CORS Headers
- **Database**: SQLite3 (Pengembangan Lokal) / PostgreSQL atau MySQL (Production)

---

## 📁 Struktur Direktori Proyek

```text
Pendaftaran_MIS/
├── .gitignore                      # Konfigurasi pengabaian file Git
├── README.md                       # Dokumentasi lengkap proyek
├── session.md                      # Catatan riwayat teknis pengembangan
├── generate_rsa.py                 # Skrip generator kunci RSA untuk integrasi API
│
├── Backend/                        # Source Code Server Backend (Django)
│   ├── manage.py                   # CLI manajemen Django
│   ├── requirements.txt            # Daftar dependensi Python
│   ├── core/                       # Pengaturan inti proyek (settings, urls, asgi, wsgi)
│   ├── ppdb/                       # Modul utama PPDB (pendaftaran, biodata, seleksi, unit)
│   │   ├── models.py               # Skema database pendaftar, unit, jadwal, berkas
│   │   ├── serializers.py          # Serializer data REST API
│   │   ├── views.py                # Controller logika bisnis PPDB
│   │   └── urls.py                 # Routing endpoint API PPDB
│   ├── payment/                    # Modul transaksi & gateway pembayaran (BRI API SNAP)
│   │   ├── bri_api.py              # Logika integrasi API BRI (Token, BRIVA, QRIS)
│   │   ├── models.py               # Data transaksi tagihan & invoice
│   │   ├── views.py                # Endpoint transaksi & webhook callback
│   │   └── urls.py                 # Routing endpoint pembayaran
│   └── media/                      # Direktori penyimpanan file upload berkas santri
│
├── Frontend/                       # Source Code Aplikasi Web Klien (React + Vite)
│   ├── package.json                # Dependensi modul JavaScript & scripts
│   ├── vite.config.js              # Konfigurasi bundler Vite & Tailwind v4
│   ├── public/                     # Aset statis publik (favicon, icons)
│   └── src/
│       ├── main.jsx                # Entry point aplikasi React
│       ├── App.jsx                 # Routing utama dan provider query
│       ├── index.css               # Definisi palet warna tema & utility CSS
│       ├── assets/                 # Gambar logo, banner, dan ilustrasi
│       ├── components/             # Komponen UI modular
│       │   ├── layout/             # Navbar, Footer, MainLayout
│       │   ├── dashboard/          # Sidebar, Topbar, Layout Dashboard Siswa
│       │   ├── admin/              # Sidebar & Topbar Panel Admin
│       │   └── common/             # Notifikasi, Modal, Alert
│       └── pages/                  # Halaman aplikasi
│           ├── landingpage/        # Home, DetailUnit, FormDaftarAwal, Tagihan, CekKelulusan, Login
│           ├── dashboard/          # Beranda, BiodataDokumen, TagihanKeuangan, Jadwal, Hasil
│           └── admin/              # Dashboard, Unit, Pendaftar, InputJadwal, Monitoring, Keputusan
│
└── Postman/                        # Koleksi dokumentasi pengujian REST API
```

---

## 💻 Panduan Instalasi & Menjalankan Proyek

### Prasyarat Sistem
- **Node.js**: v18.0.0 atau lebih baru ([Unduh Node.js](https://nodejs.org/))
- **Python**: v3.10 atau lebih baru ([Unduh Python](https://www.python.org/))
- **Git**: Versi terbaru ([Unduh Git](https://git-scm.com/))

---

### 1. Instalasi Backend (Django REST Framework)

1. Masuk ke direktori `Backend`:
   ```bash
   cd Pendaftaran_MIS/Backend
   ```

2. Buat virtual environment Python dan aktifkan:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install seluruh paket dependensi:
   ```bash
   pip install -r requirements.txt
   ```

4. Jalankan migrasi database:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Buat akun superuser / admin baru:
   ```bash
   python manage.py createsuperuser
   ```

6. Jalankan server pengembangan backend:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   *Backend API siap diakses melalui: `http://localhost:8000`*

---

### 2. Instalasi Frontend (React + Vite)

1. Buka terminal baru dan masuk ke direktori `Frontend`:
   ```bash
   cd Pendaftaran_MIS/Frontend
   ```

2. Install dependensi Node.js:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan frontend:
   ```bash
   npm run dev
   ```
   *Frontend web siap diakses melalui: `http://localhost:5173`*

4. Untuk build production siap deploy:
   ```bash
   npm run build
   ```

---

## 🔒 Keamanan & Standar Pengembangan

- **Proteksi Kredensial**: File kunci rahasia (*private key* `.pem`), token autentikasi, variabel lingkungan `.env`, dan database lokal `.sqlite3` telah dikecualikan melalui `.gitignore` untuk mencegah kebocoran data rahasia ke repositori publik.
- **Validasi Berkas Digital**: Unggahan berkas dokumen dibatasi format dan ukurannya guna mencegah injeksi file berbahaya.
- **JWT Authentication**: Akses API dashboard peserta dan panel admin dilindungi dengan otentikasi token Bearer JWT dengan masa kedaluwarsa terkelola.

---

<p align="center">
  <b>Mentari Islamic School (MIS)</b><br>
  <i>Membangun Generasi Beradab, Berilmu, dan Berprestasi</i>
</p>


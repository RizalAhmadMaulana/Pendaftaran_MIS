# 📋 SESSION.md — Catatan Pengembangan Project Pendaftaran_MIS

> **Terakhir diupdate:** 12 Oktober 2026  
> **Nama Project:** Portal Penerimaan Siswa Baru (PSHB) — Mentari Islamic School  
> **Lokasi Project:** `C:\xampp\htdocs\BACKUP PROJECT RISALAH MUTABAAH MIS\Pendaftaran_MIS\`

---

## 📌 Daftar Isi

1. [Overview Project](#1-overview-project)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Palet Warna Kustom](#3-palet-warna-kustom)
4. [Struktur Folder & File Lengkap](#4-struktur-folder--file-lengkap)
5. [Penjelasan Setiap File](#5-penjelasan-setiap-file)
6. [Route Mapping](#6-route-mapping)
7. [Cara Menjalankan Project](#7-cara-menjalankan-project)
8. [Riwayat Update & Perubahan](#8-riwayat-update--perubahan)
9. [Catatan Penting untuk Update Selanjutnya](#9-catatan-penting-untuk-update-selanjutnya)

---

## 1. Overview Project

Project ini adalah **Portal Penerimaan Siswa Baru (PSHB)** untuk **Mentari Islamic School (MIS)**. Sebuah web frontend modern yang dibangun dengan React + Vite + Tailwind CSS v4. Desain menggunakan nuansa hijau yang clean, profesional, dan responsif.

### Fitur Utama:
- **Landing page scrollable** — Beranda, Unit Pendidikan, Alur Pendaftaran, dan Tentang Kami digabung dalam satu halaman scroll
- **Scroll spy navigation** — Navbar otomatis highlight menu aktif sesuai posisi scroll
- **Filter unit pendidikan** — Filter interaktif (Semua/TPA-KB/TK/SD/SMP-SMA)
- **Alur pendaftaran interaktif** — 5 tahap dengan tab yang bisa diklik
- **Split-screen auth pages** — Login & Cek Kelulusan tanpa Navbar/Footer
- **Form pendaftaran** — Formulir checkout dengan validasi
- **Tagihan pembayaran** — Invoice dengan upload bukti transfer
- **Responsive design** — Semua halaman mobile-friendly + hamburger menu

---

## 2. Tech Stack & Dependencies

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | ^19.2.8 | Library UI utama |
| **Vite** | ^8.3.0 | Build tool & dev server |
| **Tailwind CSS** | ^4.3.3 | Utility-first CSS framework |
| **@tailwindcss/vite** | ^4.3.3 | Plugin Vite untuk Tailwind v4 |
| **React Router DOM** | ^7.18.4 | Client-side routing |
| **@tanstack/react-query** | ^5.104.1 | Server state management (siap pakai) |
| **React Icons** | ^5.7.0 | Icon library (Font Awesome icons) |
| **PostCSS** | ^8.5.29 | CSS post-processor |
| **Autoprefixer** | ^10.6.1 | Auto vendor prefixes |

### package.json scripts:
```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "oxlint",
  "preview": "vite preview"
}
```

---

## 3. Palet Warna Kustom

Warna didefinisikan di `src/index.css` menggunakan Tailwind CSS v4 `@theme` directive:

| Nama Token | Kode Hex | CSS Variable | Class Tailwind | Penggunaan |
|------------|----------|--------------|----------------|------------|
| **primary** | `#1B4332` | `--color-primary` | `bg-primary`, `text-primary` | Hijau tua — Footer, sidebar, heading utama |
| **secondary** | `#2ECC71` | `--color-secondary` | `bg-secondary`, `text-secondary` | Hijau terang — Tombol CTA, badge, aksen |
| **background** | `#F8FAFC` | `--color-background` | `bg-background` | Abu-abu sangat terang — Latar halaman |
| **surface** | `#FFFFFF` | `--color-surface` | `bg-surface` | Putih — Card, panel |

---

## 4. Struktur Folder & File Lengkap

```
Pendaftaran_MIS/
├── session.md                          ← 📋 FILE INI (catatan session)
└── Frontend/
    ├── package.json                    ← Dependencies & scripts
    ├── package-lock.json               ← Lock file
    ├── vite.config.js                  ← Konfigurasi Vite + Tailwind + host
    ├── README.md                       ← Readme bawaan Vite
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── node_modules/                   ← (auto-generated)
    └── src/
        ├── main.jsx                    ← Entry point React
        ├── App.jsx                     ← Router & QueryClient setup
        ├── App.css                     ← (kosong, tidak dipakai)
        ├── index.css                   ← Tailwind import + custom theme colors
        ├── assets/
        │   ├── hero.png                ← Placeholder asset
        │   ├── react.svg               ← Bawaan Vite
        │   └── vite.svg                ← Bawaan Vite
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx          ← Navbar responsif + scroll spy
        │   │   ├── Footer.jsx          ← Footer 3 kolom bg hijau tua
        │   │   └── MainLayout.jsx      ← Wrapper (Navbar + main + Footer)
        │   └── ui/                     ← (reserved untuk reusable components)
        └── pages/
            └── landingpage/
                ├── Home.jsx                ← ⭐ Landing page utama (gabungan 4 section scroll)
                ├── DetailUnit.jsx          ← Detail unit pendidikan (route: /unit/:id)
                ├── FormDaftarAwal.jsx       ← Formulir pendaftaran (route: /daftar/:id)
                ├── TagihanPembayaran.jsx    ← Invoice & upload bukti (route: /tagihan/:id)
                ├── CekKelulusan.jsx         ← Split-screen cek kelulusan (route: /pengumuman)
                ├── LoginPeserta.jsx         ← Split-screen login (route: /login)
                ├── UnitPendidikan.jsx       ← ⚠️ LEGACY — tidak dipakai di routing (konten sudah di Home.jsx)
                ├── AlurPendaftaran.jsx      ← ⚠️ LEGACY — tidak dipakai di routing (konten sudah di Home.jsx)
                └── TentangKami.jsx          ← ⚠️ LEGACY — tidak dipakai di routing (konten sudah di Home.jsx)
```

> **Catatan:** File `UnitPendidikan.jsx`, `AlurPendaftaran.jsx`, `TentangKami.jsx` masih ada di folder tapi **tidak lagi diimport di App.jsx**. Konten mereka sudah digabungkan ke dalam `Home.jsx` sebagai section scroll. File-file ini bisa dihapus atau disimpan sebagai referensi.

---

## 5. Penjelasan Setiap File

### 5.1 File Konfigurasi

#### `vite.config.js`
- Import `@vitejs/plugin-react` dan `@tailwindcss/vite`
- Mengaktifkan plugin React + Tailwind CSS v4
- `server.host: true` — agar dev server bisa diakses via IP lokal (misal: `http://192.168.1.74:5173/`)

#### `src/index.css`
- `@import "tailwindcss"` — import framework Tailwind CSS v4
- `@theme { ... }` — mendefinisikan 4 custom color tokens (primary, secondary, background, surface)
- Body style: font-family `Inter` / `Segoe UI`, anti-aliased rendering

#### `src/main.jsx`
- Entry point. Render `<App />` di `#root` dengan `StrictMode`
- Import `index.css` untuk global styles

#### `src/App.jsx`
- Setup `BrowserRouter` dari `react-router-dom`
- Setup `QueryClientProvider` dari `@tanstack/react-query`
- Mendefinisikan semua routes (lihat [Route Mapping](#6-route-mapping))
- Import 6 halaman yang aktif dipakai

---

### 5.2 Layout Components

#### `src/components/layout/Navbar.jsx` (146 baris)
**Fungsi:** Navigasi utama sticky di atas halaman.

**Fitur:**
- **Scroll-based navigation** — Klik menu = smooth scroll ke section, bukan pindah halaman
- **Scroll spy** — `useEffect` + `window.scrollY` listener mendeteksi section mana yang terlihat, lalu highlight menu yang sesuai
- **Cross-page scroll** — Jika user di halaman lain (misal `/unit/sd`), klik menu akan `navigate('/')` dulu, lalu scroll ke section
- **Responsive** — Desktop: menu horizontal + tombol Login. Mobile: hamburger menu toggle
- **Offset 72px** — Karena navbar sticky h-16 (64px) + padding

**State:**
- `mobileOpen` (boolean) — toggle hamburger menu
- `activeSection` (string) — section ID yang sedang aktif (`beranda` | `unit` | `alur` | `tentang`)

**Nav Links:**
```
Beranda       → scroll ke #beranda
Unit Pendidikan → scroll ke #unit
Alur Pendaftaran → scroll ke #alur
Tentang Kami   → scroll ke #tentang
Login Peserta  → Link ke /login (tetap pindah halaman)
```

#### `src/components/layout/Footer.jsx` (~130 baris)
**Fungsi:** Footer 3 kolom dengan background hijau tua (`bg-primary`).

**Kolom 1 — Informasi Kontak:**
- Kampus Utama (TK, SD, SMP, SMA): Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474
- Kampus PAUD (TPA & KB - Mentari Kids): Perkiosan Tulung No. 259, Klaten 57482
- Email: admin@cyberschool.sch.id
- Hotline WA: +62 812-3456-7890

**Kolom 2 — Link Cepat:**
- Beranda → scroll ke #beranda
- Cek Status / Kelulusan → Link ke /login?tab=status
- Bantuan & Alur → scroll ke #alur
- Unit Pendidikan → scroll ke #unit
- Tentang Kami → scroll ke #tentang

**Kolom 3 — Sosial Media (Ikuti Kami):**
- Instagram: `https://www.instagram.com/mentari_tahfidzschool`
- TikTok: `https://www.tiktok.com/@mentariislamicschool?_r=1&_t=ZS-9AUBtzKNlPY`
- YouTube: `https://www.youtube.com/@mentariislamicschool5489`
- WhatsApp Hotline: `https://wa.me/6281234567890`
- Copyright © 2026 Portal Pendaftaran Mentari Islamic School Klaten.

**Catatan:** Link cepat juga menggunakan `scrollToSection()` sama seperti Navbar.


#### `src/components/layout/MainLayout.jsx` (15 baris)
**Fungsi:** Wrapper yang membungkus halaman dengan Navbar di atas dan Footer di bawah.
- Menggunakan `flex flex-col min-h-screen` agar footer selalu di bawah
- `<main>` diberi `flex-1 bg-background`

---

### 5.3 Halaman Utama

#### `src/pages/landingpage/Home.jsx` (379 baris) ⭐
**Fungsi:** Halaman landing page utama yang menggabungkan 4 section menjadi satu halaman scrollable.

**Section 1 — `#beranda` (Hero):**
- Badge animasi pulse "🟢 Pendaftaran Tahun Ajaran 2026/2027 Telah Dibuka"
- H1 "Pendaftaran Siswa Baru Mentari Islamic School" (text-4xl sampai text-6xl)
- Subtitle abu-abu
- 2 tombol: [Daftar Sekarang] scroll ke #unit, [Lihat Hasil Seleksi] Link ke /pengumuman
- Sub-section "Mengapa Memilih MIS?" — 3 card: Fasilitas Lengkap, Kurikulum Berbasis Adab, Pengajar Profesional

**Section 2 — `#unit` (Unit Pendidikan):**
- Header "Daftar Unit Pendidikan"
- Filter bar 5 tombol: Semua Unit, TPA/KB, TK, SD, SMP/SMA
- Grid 3 kolom (responsive 1→2→3) menampilkan 6 unit:
  - TPA/KB Al-Quran (Buka)
  - TK Mentari Islamic School (Buka)
  - SD Mentari Islamic School (Buka)
  - SMP Mentari Islamic School (Buka)
  - SMA Mentari Islamic School (Tutup)
  - Boarding School MIS (Buka)
- Setiap card: Badge status Buka/Tutup, icon, judul, deskripsi, link "Baca Selengkapnya" ke `/unit/:id`, tombol "Daftar Sekarang" ke `/daftar/:id`

**Section 3 — `#alur` (Alur Pendaftaran):**
- Header "Alur Pendaftaran"
- Split layout (40% kiri, 60% kanan)
- Kiri: 5 tombol tahap (1. Pendaftaran Akun, 2. Pembayaran, 3. Pengisian Berkas, 4. Tes Seleksi, 5. Hasil Seleksi)
- Kanan: Card detail yang berubah sesuai tahap yang diklik — icon, judul, deskripsi, 4 detail langkah
- State `activeStep` untuk menandai tab aktif

**Section 4 — `#tentang` (Tentang Kami):**
- Hero banner gradient hijau tua "Tentang Mentari Islamic School"
- Sejarah singkat yayasan (3 paragraf)
- Visi & Misi — 2 card side-by-side
- Struktur Pengurus — 4 card: Ketua Yayasan, Direktur Pendidikan, Kepala Kurikulum, Kepala Kesiswaan
- Galeri Fasilitas — Grid 3 kolom placeholder: Masjid, Ruang Kelas, Lab Sains, Perpustakaan, Lapangan, Area Bermain

**State yang digunakan:**
- `activeFilter` — filter unit pendidikan aktif
- `activeStep` — tab alur pendaftaran aktif

---

### 5.4 Halaman Terpisah (Punya Route Sendiri)

#### `src/pages/landingpage/DetailUnit.jsx` (134 baris)
**Route:** `/unit/:id` (dengan MainLayout)
**Fungsi:** Halaman detail unit pendidikan dinamis.

**Layout 2 kolom (70% / 30%):**
- **Kiri:** Breadcrumb, Profil Lembaga (2 paragraf), Syarat Pendaftaran (6 item checklist), Lokasi & Alamat + Google Maps placeholder
- **Kanan (sticky sidebar):** Card hijau info pendaftaran (Gelombang 1, Masa Pendaftaran: 1 Okt - 31 Des 2026, Biaya: Rp 250.000), tombol "Lanjutkan ke Pendaftaran", card WA bantuan admin

**Data unit tersedia:** `tpa-kb`, `tk`, `sd`, `smp`, `sma`, `boarding`

#### `src/pages/landingpage/FormDaftarAwal.jsx` (~800 baris)
**Route:** `/daftar/:id` (dengan MainLayout)
**Fungsi:** Formulir Penerimaan Peserta Didik Baru (PPDB) resmi Yayasan Mentari Kayaarta / PKBM Mentari Kayaarta Klaten (mengacu dokumen referensi docx bagian A s/d C).

**Kop & Layout Form (max-w-5xl):**
- **Kop Resmi:** YAYASAN MENTARI KAYAARTA — PKBM MENTARI KAYAARTA Klaten (Kompleks Masjid Al Mahabbah, Lembu, Jimus, Polanharjo 57474).
- **Badge & Nav Bar:** Quick Jump tab (Tampilkan Semua A-C, Bagian A, Bagian B, Bagian C).
- **Pilihan Program:** Jenjang Pendidikan (TPA, KB, TK, SD, SMP, SMA) dan Program (Reguler, Full Day, Tahfidz & Sains).
- **Bagian A (Keterangan Calon Peserta Didik):**
  - Nama Lengkap, Jenis Kelamin (radio L/P), NIK 16 digit (input text/number validation).
  - Tempat Lahir & Tanggal Lahir (date picker), Agama (dropdown 6 agama).
  - Alamat Tempat Tinggal (Jalan, RT, RW, Dsn, Ds/Kel, Kec, Kab/Kota).
  - Alamat Sesuai KK (dengan checkbox cerdas: *Sama dengan Alamat Tempat Tinggal*).
  - Tempat Tinggal (dropdown: Bersama Ortu, Kost, Asrama/Pondok, Wali, dll).
  - Mode Transportasi (dropdown: Sepeda Motor, Jalan Kaki, Sepeda, Mobil, Angkutan, dll).
  - No. Telp / WhatsApp Aktif, No. KPS / KKS (opsional jika menerima).
- **Bagian B (Keterangan Orang Tua Kandung):**
  - Data Ayah: Nama, Tahun Lahir, Status (Masih Hidup/Meninggal + Tahun Meninggal), Pendidikan Terakhir (dropdown), Pekerjaan (dropdown), Penghasilan Bulanan (dropdown standar docx).
  - Data Ibu: Nama, Tahun Lahir, Status (Masih Hidup/Meninggal + Tahun Meninggal), Pendidikan Terakhir (dropdown), Pekerjaan (dropdown), Penghasilan Bulanan (dropdown standar docx).
  - Alamat Orang Tua: Lengkap dengan checkbox cerdas (*Sama dengan Alamat Calon Siswa*).
- **Bagian C (Data Periodik Calon Peserta Didik):**
  - Tinggi Badan (cm), Berat Badan (kg), Jarak ke Sekolah (km), Waktu Tempuh (jam & menit).
  - Urutan Saudara: Anak ke- ... dari ... saudara.
  - Jumlah Saudara Kandung: total saudara kandung, jumlah adik, jumlah kakak.
- **Persetujuan & Modal Sukses:**
  - Checkbox pernyataan kebenaran data resmi.
  - Tombol Submit "Simpan Formulir & Proses Tagihan".
  - Modal Interaktif Ringkasan Pendaftaran (No. Registrasi otomatis `MIS-2026-xxxx`, Nama, Unit, Program) dengan tombol langsung menuju invoice pembayaran `/tagihan/:id`.
*(Bagian D Lampiran Fisik ditiadakan sesuai instruksi user)*

#### `src/pages/landingpage/TagihanPembayaran.jsx` (144 baris)
**Route:** `/tagihan/:id` (dengan MainLayout)
**Fungsi:** Halaman invoice dan upload bukti pembayaran.

**Layout 2 kolom (55% / 45%):**
- **Kiri:**
  - Info Calon Siswa: Nama (Ahmad Zaki Mubarok), ID (MIS-2026001), Unit (SD MIS), Program (Reguler)
  - Detail Biaya: Pendaftaran Rp 250.000 + Kode Unik Rp 123 = **Total Rp 250.123**
  - Info box: "Pastikan transfer sesuai nominal..."
- **Kanan:**
  - Rekening BSI (7182930456, atas nama PSHB MIS) + tombol copy
  - Upload bukti transfer: drag-drop area, pilih file (JPG/PNG/PDF max 2MB), tombol "Kirim Bukti Pembayaran"

#### `src/pages/landingpage/CekKelulusan.jsx` (88 baris)
**Route:** `/pengumuman` (**TANPA** MainLayout)
**Fungsi:** Halaman cek hasil seleksi.

**Layout split-screen 50:50 full height:**
- **Panel Kiri (bg-primary):** Logo, "Selamat Datang di Portal PSHB", 3 checklist (Pendaftaran Mudah, Verifikasi Cepat, Notif WA)
- **Panel Kanan (bg-background):** Card form: "Cek Kelulusan", input nomor pendaftaran (MIS-2026...), tombol "Cek Hasil", link kembali ke beranda

#### `src/pages/landingpage/LoginPeserta.jsx` (114 baris)
**Route:** `/login` (**TANPA** MainLayout)
**Fungsi:** Halaman login calon siswa.

**Layout split-screen 50:50 full height (sama dengan CekKelulusan):**
- **Panel Kiri (bg-primary):** Sama persis dengan CekKelulusan
- **Panel Kanan (bg-background):** Card form: "Login Calon Siswa", input WA/Email, input Password, link "Lupa Password?", tombol "Masuk ke Portal", link "Belum mendaftar? Daftar Akun Baru"

---

### 5.5 File Legacy (Tidak Dipakai di Routing)

File-file berikut masih ada di folder tapi **TIDAK diimport atau dipakai** di `App.jsx`. Konten mereka sudah digabungkan ke dalam `Home.jsx`:

| File | Alasan Legacy |
|------|---------------|
| `UnitPendidikan.jsx` | Konten dipindah ke section `#unit` di Home.jsx |
| `AlurPendaftaran.jsx` | Konten dipindah ke section `#alur` di Home.jsx |
| `TentangKami.jsx` | Konten dipindah ke section `#tentang` di Home.jsx |

> Bisa dihapus atau disimpan sebagai backup/referensi.

---

## 6. Route Mapping

| Path | File Komponen | Layout | Tipe | Keterangan |
|------|--------------|--------|------|------------|
| `/` | `Home.jsx` | ✅ MainLayout | Scroll Page | Landing page utama (4 section: Beranda, Unit, Alur, Tentang) |
| `/unit/:id` | `DetailUnit.jsx` | ✅ MainLayout | Detail Page | Detail unit (param: tpa-kb, tk, sd, smp, sma, boarding) |
| `/daftar/:id` | `FormDaftarAwal.jsx` | ✅ MainLayout | Form Page | Formulir pendaftaran per unit |
| `/tagihan/:id` | `TagihanPembayaran.jsx` | ✅ MainLayout | Invoice Page | Tagihan + upload bukti bayar |
| `/login` | `LoginPeserta.jsx` | ❌ Standalone | Compact Dual-Panel Card | Portal terpadu: Login Calon Siswa (tab aktif default) |
| `/pengumuman` | `CekKelulusan.jsx` / `LoginPeserta.jsx` | ❌ Standalone | Compact Dual-Panel Card | Portal terpadu: Cek Status Pendaftaran (tab status aktif) |
| `/cek-status` | `LoginPeserta.jsx` | ❌ Standalone | Compact Dual-Panel Card | Alias rute Cek Status Pendaftaran |

### Navigasi Antar Halaman:
```
[Landing Page /]
  ├─ Klik "Baca Selengkapnya" card unit → /unit/:id (DetailUnit)
  ├─ Klik "Daftar Sekarang" card unit  → /daftar/:id (FormDaftarAwal)
  ├─ Klik "Cek Status / Seleksi"       → /login?tab=status (Cek Status Tab)
  └─ Klik "Login Peserta" (navbar)     → /login (Login Tab)


[DetailUnit /unit/:id]
  └─ Klik "Lanjutkan ke Pendaftaran"   → /daftar/:id (FormDaftarAwal)

[FormDaftarAwal /daftar/:id]
  └─ Submit form                       → (alert demo, belum connect API)

[TagihanPembayaran /tagihan/:id]
  └─ Upload & kirim bukti              → (alert demo, belum connect API)
```

---

## 7. Cara Menjalankan Project

### Pertama Kali (Install):
```bash
cd Pendaftaran_MIS/Frontend
npm install
```

### Development:
```bash
npm run dev -- --host
```
Akses di:
- **Local:** http://localhost:5173/
- **Network:** http://192.168.1.74:5173/ (atau IP lokal sesuai jaringan)

### Build Production:
```bash
npm run build
```
Output akan ada di folder `dist/`.

### Preview Production Build:
```bash
npm run preview
```

---

## 8. Riwayat Update & Perubahan

### Session 1 — 9 Oktober 2026 (Pembuatan Awal)
**Apa yang dibuat:**
- ✅ Inisialisasi project React + Vite
- ✅ Install semua dependencies (react-router-dom, tailwindcss, @tanstack/react-query, react-icons, dll)
- ✅ Konfigurasi Vite (server.host: true) dan Tailwind CSS v4 (custom colors)
- ✅ Buat layout components: Navbar, Footer, MainLayout
- ✅ Buat 9 halaman: Home, UnitPendidikan, DetailUnit, AlurPendaftaran, TentangKami, FormDaftarAwal, TagihanPembayaran, CekKelulusan, LoginPeserta
- ✅ Setup routing di App.jsx dengan 9 routes terpisah

### Session 2 — 9 Oktober 2026 (Update Scroll Navigation)
**Perubahan besar:**
- ✅ **Navbar.jsx** — Diubah dari `<Link>` (pindah halaman) menjadi `scrollToSection()` (smooth scroll ke section)
- ✅ **Navbar.jsx** — Ditambahkan scroll spy menggunakan `useEffect` + `window.scrollY` listener
- ✅ **Home.jsx** — Digabungkan 4 halaman menjadi 1 halaman scroll:
  - Section `#beranda` (Hero + Mengapa MIS)
  - Section `#unit` (Daftar Unit Pendidikan + Filter + Grid Cards)
  - Section `#alur` (Alur Pendaftaran + Tab Interaktif)
  - Section `#tentang` (Banner + Sejarah + Visi Misi + Pengurus + Galeri)
- ✅ **Home.jsx** — Dihapus section "Sekilas Unit Pendidikan" (duplikat dengan Daftar Unit)
- ✅ **Footer.jsx** — Link cepat diubah ke scroll-based
- ✅ **App.jsx** — Dihapus routes `/unit`, `/alur`, `/tentang` karena sudah digabung ke `/`
- ⚠️ File `UnitPendidikan.jsx`, `AlurPendaftaran.jsx`, `TentangKami.jsx` menjadi legacy (masih ada di folder tapi tidak dipakai)

### Session 3 — 12 Oktober 2026 (Redesign Tampilan UI Hijau Berwarna & Menarik)
**Fokus Pembaruan:**
- 🎯 **Konsistensi Konten 100% Original PSHB MIS:**
  - Menjaga seluruh teks, data, struktur unit (6 jenjang), 5 langkah alur pendaftaran, profil yayasan, visi & misi, kepengurusan, dan galeri fasilitas tetap murni sesuai rancangan awal Pendaftaran_MIS.
  - Memastikan TIDAK ADA komponen atau konten luar dari Tahfidz_MIS (misal FAQ/Hotline eksternal dihapus total).
- 🎨 **Menghilangkan Kesan Putih Polos & Memperkaya Estetika Hijau:**
  - **Hero Section:** Dilengkapi dengan ambient green glow orbs, badge status interaktif, typography gradient hijau, CTA button bergradien emerald dengan shadow glow, serta pill bar keunggulan sekolah.
  - **Mengapa Memilih MIS:** Card interaktif dengan top gradient line, ikon squircle bergradien emerald, dan hover elevation.
  - **Unit Pendidikan (Highlight):** Mengubah tampilan card polos menjadi card dengan **Header Banner Hijau Tua Gradien** (`from-primary via-emerald-800 to-[#144733]`), badge kategori & status pendaftaran interaktif, watermark geometris, micro-tags fitur ("Kurikulum Terpadu", "Pendaftaran Online"), serta tombol CTA bergradien modern.
  - **Alur Pendaftaran (Highlight):** Mengubah latar belakang menjadi full dark-emerald immersive gradient (`#0c2b1d` via `#143d2b`), tab 5 langkah interaktif di sisi kiri dengan indikator panah dinamis, dan box detail tahap di sisi kanan berkontras tinggi dengan progress bar visual completion (`Tahap X dari 05`), checklist langkah berwarna hijau, dan tombol navigasi antar tahap.
  - **Halaman Penunjang (DetailUnit, FormDaftarAwal, TagihanPembayaran):** Disesuaikan dengan aksen border hijau, header bergradien, dan tombol CTA senada agar seluruh portal terasa padu dan premium.
- ⚡ **Verifikasi Build:**
  - Build Vite production (`npm run build`) berjalan sukses (0 error, waktu build ~665ms).

### Session 4 — 12 Oktober 2026 (Rombak Total 'Tentang Kami', Hero Split Layout & Hapus Pengurus)
**Pembaruan Utama Berdasarkan Feedback User:**
- 🔄 **Rombak Total Menu 'Tentang Kami' (Menghilangkan Background Menabrak):**
  - **Masalah sebelumnya:** Background banner gelap di awal section Tentang Kami menabrak langsung dengan background gelap di section Alur Pendaftaran di atasnya.
  - **Solusi:** Banner gelap atas dihapus total. Section `#tentang` kini menggunakan transisi warna terang dan bersih bernuansa *light mint/slate* (`bg-gradient-to-b from-slate-50 via-white to-emerald-50/40`), sehingga kontras terhadap Alur Pendaftaran menjadi sangat nyaman dan tidak bertabrakan.
  - **Penghapusan Struktur Pengurus:** Bagian *Struktur Pengurus* dihapus sepenuhnya dari Tentang Kami sesuai permintaan user.
  - **Layout Sejarah 2-Kolom (Storytelling):** Kolom kiri menampilkan bingkai foto gedung kampus (`loc-mis.jpeg`) dengan badge milestone `20+ Tahun Dedikasi (2005-2026)`, dan kolom kanan memuat narasi 3 paragraf sejarah yayasan dengan tipografi yang rapi.
  - **Visi & Misi:** Didesain berdampingan dengan kartu Visi bernuansa emerald lembut dan kartu Misi berlatar putih dengan ikon target dan checklist hijau tebal.
  - **Galeri Fasilitas:** 6 sarana prasarana disajikan dalam kartu modern beraksen hijau dengan ikon representatif dan indikator ketersediaan.
- 🚀 **Desain Ulang Beranda (Hero) — Split Creative Layout:**
  - Mengubah layout dari template tengah biasa (ala isykarima) menjadi **Split Hero Layout (7:5)** yang berkarakter kuat dan profesional.
  - Kolom kiri: Badge pendaftaran animasi pulse, judul editorial tebal dengan gradien emerald, sub-headline, dua tombol aksi utama (responsif stack di mobile), dan 3 counter metrik kepercayaan (`2.000+ Siswa Aktif`, `6 Jenjang`, `Akreditasi A`).
  - Kolom kanan: Showcase visual menggunakan foto gedung asli (`HOME.jpg`) dalam bingkai elegan dengan efek tilt bayangan, badge pin lokasi `Kampus Klaten`, dan card informasi floating.
- 💎 **Desain Ulang 'Mengapa Memilih MIS' (Keunggulan):**
  - Menggunakan 3 kartu fitur bergaya modern dengan penomoran elegan (`01`, `02`, `03`), wadah ikon squircle bertransisi warna, dan baris micro-tags fitur di bagian bawah masing-masing kartu.
- 📱 **Responsivitas & Anti 'Hasil AI':**
  - Penggunaan foto nyata (`HOME.jpg` dan `loc-mis.jpeg`), tipografi asimetris, penataan whitespace yang presisi, dan fluid grid breakpoints memastikan tampilan tampil seperti website sekolah Islam modern level institusional berstandar tinggi.
  - Link "Tentang Kami" ditambahkan ke daftar Link Cepat di Footer.
- ⚡ **Verifikasi Build:**
  - Build Vite production (`npm run build`) sukses tanpa error (waktu build ~882ms, aset gambar teroptimasi otomatis).

### Session 5 — 12 Oktober 2026 (Galeri 8 Fasilitas Bergambar, Update 2 Lokasi Kampus Klaten, Pemisahan TPA & KB, Kontak Resmi)
**Pembaruan Sesuai Arahan Pengguna:**
- 📸 **Galeri 8 Fasilitas Lengkap Bergambar (Bukan Sekadar Teks):**
  - Menampilkan 8 fasilitas resmi PKBM Mentari Islamic School lengkap dengan foto HD beresolusi optimal, aspek rasio 16:10, hover zoom, ikon tema, badge kategori, dan indikator status:
    1. **Masjid** (Masjid Al-Mahabbah) &bull; Ibadah & Spiritual
    2. **Ruang Kelas** (Ruang Kelas Ber-AC) &bull; Pembelajaran Aktif
    3. **Area Bermain** (Taman Bermain Anak) &bull; PAUD & Kids
    4. **Coffe & Kantin Modern** &bull; Kuliner & Relaksasi
    5. **Laboratorium Komputer** &bull; Digital & IT (CBT)
    6. **UKS** (Unit Kesehatan Sekolah) &bull; Layanan Medis
    7. **Lapangan** (Lapangan Serbaguna) &bull; Olahraga & Fisik
    8. **Perpustakaan** (Perpustakaan Literasi) &bull; Literasi Islami
- 📍 **Pembaruan 2 Lokasi Kampus Klaten (Bukan di Bandung):**
  - **Kampus Utama (Jenjang TK, SD, SMP, SMA):**
    - Alamat: `Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474`
    - Google Maps Embed: `Pondok Pesantren Tahfidz Al Mahabbah (PKBM Mentari Kampus 2)`
  - **Kampus PAUD (Jenjang TPA & KB - Mentari Kids):**
    - Alamat: `Perkiosan Tulung No. 259, Klaten 57482`
    - Google Maps Embed: `Mentari Kids`
  - Di `Home.jsx`, disediakan switcher interaktif 2 lokasi dengan Google Maps live embed.
  - Di `DetailUnit.jsx`, peta dan alamat otomatis menyesuaikan: TPA & KB menampilkan Google Maps Kampus PAUD Tulung, sedangkan TK, SD, SMP, SMA menampilkan Google Maps Kampus Utama Polanharjo.
  - Di `Footer.jsx`, alamat kedua kampus dicantumkan dengan jelas.
- 🏫 **Pemisahan Unit TPA dan KB serta Penghapusan Boarding:**
  - Unit `boarding` dihapus sepenuhnya karena Mentari Islamic School tidak memiliki unit boarding.
  - Jenjang `TPA` dan `KB` kini berdiri sendiri sebagai unit terpisah:
    - `TPA` (Taman Pendidikan Al-Quran)
    - `KB` (Kelompok Bermain)
    - `TK`, `SD`, `SMP`, `SMA`
  - Filter unit diperbarui: `['Semua Unit', 'TPA', 'KB', 'TK', 'SD', 'SMP', 'SMA']`.
  - Formulir pendaftaran (`FormDaftarAwal.jsx`) dan halaman detail unit diperbarui mengikuti pemisahan ini.
- ✉️ **Update Kontak & Media Sosial Resmi:**
  - Email: `admin@cyberschool.sch.id`
  - Instagram: `https://www.instagram.com/mentari_tahfidzschool?vrfl=c203eHp2bzd1eWhu`
  - YouTube: `https://www.youtube.com/@mentariislamicschool5489`
  - WhatsApp: `+62 812-3456-7890`
- ⚡ **Verifikasi Build:**
  - `npm run build` sukses 100% (85 modules transformed, waktu build ~493ms, zero errors).

### Session 6 — 12 Oktober 2026 (Update Profil Resmi 'Tentang MIS', Tahun Berdiri 2012, & ~500 Santri Aktif)
**Pembaruan Sesuai Arahan Pengguna:**
- 📜 **Teks Resmi Profil 'Tentang Mentari Islamic School':**
  - Mengganti teks lama dengan narasi resmi sekolah:
    > *"MENTARI ISLAMIC SCHOOL, Sekolah Tahfidz dan Sains, Hadir di Klaten. Kami sudah meluluskan banyak santri tersebar di berbagai sekolah dan universitas terbaik. Sejak 2012 kami berdiri dan sudah terakreditasi dengan peringkat A TERBAIK. Kami juga menjadi sekolah induk bagi sekolah, pesantren, dan mahad di sekitar. Mentari Islamic School adalah pusat belajar sepanjang hayat yang membuka akses pendidikan bagi semua warga, dari remaja hingga orang dewasa yang ingin kembali melanjutkan sekolah. Di sini, peserta didik difasilitasi untuk mengembangkan pengetahuan, keterampilan, dan kemandirian melalui pembelajaran yang fleksibel, ramah, dan berbasis pemberdayaan masyarakat. Mentari Islamic School hadir sebagai ruang tumbuh, tempat setiap orang diberi kesempatan untuk memperbaiki masa depan dan meningkatkan kualitas hidupnya."*
- 📅 **Tahun Berdiri Sejak 2012:**
  - Tahun pendirian diperbarui dari 2005 menjadi **2012** (berdiri sejak 2012 hingga sekarang, rentang waktu 2012 - 2026).
  - Floating milestone badge pada kartu foto Sejarah diperbarui: `Berdiri Sejak 2012 (2012 - 2026)`.
- 👥 **Jumlah Peserta Didik ~500-an Santri Aktif:**
  - Angka metrik counter di Hero section diperbarui dari `2.000+` menjadi `500+` Santri & Siswa Aktif.
  - Sub-label counter diperbarui menjadi: `500+ Santri & Siswa Aktif`, `6 Jenjang Pendidikan`, dan `Akreditasi A Terbaik`.
- ⚡ **Verifikasi Build:**
  - `npm run build` sukses 100% (85 modules transformed, waktu build ~345ms, 0 error).

### Session 7 — 12 Oktober 2026 (Update Branding Navbar 'Portal Pendaftaran' & Hero Image 'loc-mis.jpeg')
**Pembaruan Sesuai Arahan Pengguna:**
- 🏷️ **Navbar Branding Teks:**
  - Mengganti teks branding di navbar dari `"Portal PSHB"` menjadi **`"Portal Pendaftaran"`** (`Navbar.jsx`).
  - Sub-label tetap rapi: `"Mentari Islamic School"`.
- 🖼️ **Hero Showcase Image di Halaman Home:**
  - Mengubah import gambar showcase hero di `Home.jsx` menjadi:
    ```javascript
    import homeHeroImg from '../../assets/loc-mis.jpeg';
    ```
  - Foto gedung dan kompleks kampus Mentari Islamic School Klaten (`loc-mis.jpeg`) ditampilkan di bingkai hero section dengan overlay gradient dan badge lokasi kampus Klaten.
- ⚡ **Verifikasi Build:**
  - `npm run build` berhasil 100% tanpa error.

### Session 8 — 12 Oktober 2026 (Penerapan Formulir PPDB Resmi Docx Bagian A s/d C)
**Pembaruan Sesuai Arahan Pengguna:**
- 📋 **Kop & Header Formal Lembaga:**
  - Menampilkan identitas resmi yayasan: **YAYASAN MENTARI KAYAARTA — PKBM MENTARI KAYAARTA**
  - Alamat: `Kompleks Masjid Al Mahabbah, Lembu, Jimus, Polanharjo 57474`.
  - Judul resmi: `FORMULIR PENERIMAAN PESERTA DIDIK BARU PKBM TAHUN AJARAN 2026/2027`.
  - Pilihan jenjang (TPA, KB, TK, SD, SMP, SMA) dan program (Reguler, Full Day, Tahfidz & Sains).
- 👤 **Bagian A. Keterangan Calon Peserta Didik:**
  - Nama Lengkap (input text).
  - Jenis Kelamin (radio button / card selection: Laki-laki / Perempuan).
  - NIK 16 Digit (format 16 digit sesuai KK/KIA).
  - Tempat Lahir & Tanggal Lahir (date picker).
  - Agama (dropdown: Islam, Kristen Protestan, Katolik, Hindu, Buddha, Kong Hu Cu).
  - Alamat Tempat Tinggal (Jln, RT, RW, Dsn, Ds./Kel., Kec., Kab.).
  - Alamat Sesuai KK dengan checkbox fitur cerdas: `[x] Sama dengan Alamat Tempat Tinggal` (otomatis menyalin tanpa perlu input ulang).
  - Tempat Tinggal (dropdown: Bersama Orang Tua, Kost, Asrama / Pondok, Bersama Wali, Lainnya).
  - Mode Transportasi ke Sekolah (dropdown: Sepeda Motor, Jalan Kaki, Sepeda, Mobil Pribadi, Angkutan Umum, Antar Jemput, Lainnya).
  - No. Telp / WhatsApp aktif.
  - No. KPS / KKS (jika menerima bantuan sosial).
- 👨‍👩‍👦 **Bagian B. Keterangan Orang Tua Kandung:**
  - **Data Ayah Kandung:** Nama Lengkap, Tahun Lahir, Status Keberadaan (Masih Hidup / Meninggal + input tahun jika meninggal), Pendidikan Terakhir (dropdown), Pekerjaan (dropdown), Penghasilan Rata-rata Perbulan (dropdown: 0–999.999, 1 Juta–1.999.999, 2 Juta s.d 4.999.999, 5 Juta–20 Juta, >20 Juta).
  - **Data Ibu Kandung:** Nama Lengkap, Tahun Lahir, Status Keberadaan (Masih Hidup / Meninggal + input tahun jika meninggal), Pendidikan Terakhir (dropdown), Pekerjaan (dropdown: Ibu Rumah Tangga, ASN, Wiraswasta, dll), Penghasilan Rata-rata Perbulan (dropdown).
  - **Alamat Tempat Tinggal Orang Tua:** Lengkap dengan checkbox cerdas `[x] Sama dengan Alamat Calon Siswa`.
- 📊 **Bagian C. Data Periodik Calon Peserta Didik:**
  - Tinggi Badan (cm) & Berat Badan (kg).
  - Jarak Rumah ke Sekolah (km).
  - Waktu Tempuh ke Sekolah (jam & menit).
  - Status Urutan Saudara: Anak ke- ... dari ... saudara.
  - Jumlah Saudara Kandung: total saudara kandung, jumlah adik (orang), jumlah kakak (orang).
- 🚫 **Bagian D Ditiadakan Sesuai Instruksi:**
  - Bagian D (Lampiran Fisik yang Diserahkan Bersama Formulir) sengaja ditiadakan sesuai instruksi user, sehingga form hanya memuat Bagian A s/d C.
- ⚡ **Interaktivitas & UX Tambahan:**
  - Quick Jump Bar navigasi tab: Tampilkan Semua (A-C), Bagian A, Bagian B, Bagian C.
  - Checkbox pernyataan kebenaran data resmi.
  - Modal Interaktif Konfirmasi Pendaftaran (menampilkan No. Registrasi unik `MIS-2026-xxxx`, Nama, Jenjang, Program) dengan tombol aksi langsung melanjutkan ke invoice & verifikasi pembayaran `/tagihan/:id`.
- ⚡ **Verifikasi Build:**
  - `npm run build` berhasil 100% (84 modules transformed, waktu build ~838ms, zero errors).

### Session 9 — 12 Oktober 2026 (Penyederhanaan Formulir PPDB: Hapus Program Pembelajaran & Redesign UX Simple Rapi)
**Pembaruan Sesuai Arahan Pengguna:**
- ✂️ **Penghapusan Field Program Pembelajaran:**
  - Field pilihan program pembelajaran (`Reguler`, `Full Day`, `Tahfidz`) dihapus sepenuhnya dari formulir pendaftaran dan state form.
  - Pendaftaran kini berfokus murni pada jenjang unit yang dituju (`TPA`, `KB`, `TK`, `SD`, `SMP`, `SMA`).
- 🎨 **Redesign Tampilan Simple, Rapi, & User Experience Jelas:**
  - **Kop Lembaga Minimalis & Elegan:** Header kompak menampilkan Yayasan Mentari Kayaarta, PKBM Mentari Kayaarta Klaten, alamat komplek masjid Al Mahabbah Polanharjo, serta pill unit yang didaftar disertai quick switcher unit.
  - **Menghilangkan Visual Clutter:** Menghilangkan tab jump bertingkat dan nested border berlebihan agar pengalaman mengisi form terasa bersih, mengalir, dan fokus.
  - **Layout Data Orang Tua Bersisian (2 Kolom Desktop, Stacking Mobile):** Data Ayah dan Data Ibu disusun berdampingan dengan pembagian kolom yang proporsional sehingga perbandingan data lebih ringkas dan tidak memanjang ke bawah.
  - **Grid Alamat Kompak:** Kolom RT, RW, Dusun, Desa, Kecamatan, dan Kabupaten ditata dalam grid ringkas sehingga hemat ruang dan mudah diisi.
  - **Checkbox Cerdas:** Fitur sinkronisasi alamat KK dan alamat orang tua tetap dipertahankan dengan indikator visual yang bersih.
  - **Mobile Responsive:** Seluruh elemen formulir beradaptasi sempurna di layar smartphone, tablet, maupun layar lebar tanpa horizontal scrolling.
- ⚡ **Verifikasi Build:**
  - `npm run build` sukses 100% (84 modules transformed, waktu build ~597ms, zero errors).

### Session 10 — 12 Oktober 2026 (Unifikasi Formulir PPDB Menjadi Satu Master Card Elegan)
**Pembaruan Sesuai Arahan Pengguna:**
- 🏛️ **Penggabungan Menjadi Satu Card Elegan (Unified Master Card):**
  - Mengubah layout sebelumnya yang terdiri dari beberapa kartu terpisah mengambang menjadi **satu kesatuan master card yang kokoh dan prestisius** (`bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 overflow-hidden`).
  - **Header Banner Terintegrasi:** Kop resmi Yayasan & PKBM Mentari Kayaarta Klaten menyatu di bagian atas card dengan latar belakang gradien hijau emerald tua mewah (`from-emerald-950 via-primary to-emerald-800`).
  - **Sub-header Bar:** Menyatu langsung di bawah header sebagai pembatas judul formulir PPDB dan instruksi pengisian.
  - **Alur Form Mengalir (Seamless Flow):** Bagian A, B, dan C ditata dalam satu canvas bersih tanpa kartu-kartu terpisah, menggunakan garis pembatas halus (`border-t border-gray-100`), badge indikator `[A]`, `[B]`, `[C]`, dan jarak visual yang proporsional.
  - **Footer Terpadu:** Box pernyataan dan tombol aksi utama ("Kirim Formulir Pendaftaran") kini berada rapi di bagian bawah master card sebagai penutup formulir.
- 📱 **Desain Lebih Rapi, Menarik & Responsif:**
  - Menghilangkan kesan halaman yang terputus-putus (*fragmented*).
  - Tampilan formulir terlihat formal, berkelas, dan rapi seperti formulir registrasi institusi pendidikan Islam modern.
- ⚡ **Verifikasi Build:**
  - `npm run build` berhasil 100% (84 modules transformed, waktu build ~630ms, zero errors).

### Session 11 — 12 Oktober 2026 (Card Menonjol dengan Bayangan Dalam, Tombol 'Daftar Sekarang' di Tengah & Link Bantuan)
**Pembaruan Sesuai Arahan Pengguna:**
- ✨ **Gaya Master Card Lebih Menonjol & Berdimensi Jelas:**
  - Menambahkan bayangan yang dalam dan tegas (`shadow-[0_25px_60px_-15px_rgba(6,78,59,0.20)] ring-1 ring-emerald-950/5`) serta border hijau emerald berkarakter (`border-2 border-emerald-600/20`).
  - Dilengkapi ambient green glow lembut di latar belakang halaman sehingga master card berdiri menonjol dan kontras di atas layar.
- 🎯 **Tombol Utama 'Daftar Sekarang' Posisi Center (Tengah):**
  - Teks tombol diubah dari *"Kirim Formulir Pendaftaran"* menjadi **`"Daftar Sekarang"`**.
  - Posisinya dibuat presisi **di tengah (centered)** dengan ukuran proporsional (`min-w-[280px] sm:min-w-[340px]`), gradien hijau emerald tebal, serta efek hover/active interaktif.
- 🔗 **Link Cek Status / Login Terintegrasi:**
  - Di bawah tombol utama, ditambahkan navigasi cepat:
    > *"Sudah mendaftar sebelumnya? **Cek Status** / **Login**"*
  - Masing-masing mengarah langsung ke halaman Cek Kelulusan/Status (`/pengumuman`) dan Login Calon Siswa (`/login`).
- 💬 **Bantuan Admin via WhatsApp Resmi:**
  - Di bawah link navigasi, disematkan tombol pil interaktif:
    > *"Butuh bantuan ? Hubungi admin via WhatsApp"*
  - Terhubung langsung dengan WhatsApp Admin (`https://wa.me/6281234567890`) dengan ikon WhatsApp hijau untuk mempermudah pendaftar yang membutuhkan konsultasi.
- ⚡ **Verifikasi Build:**
  - `npm run build` sukses 100% (84 modules transformed, waktu build ~469ms, zero errors).

### Session 12 — 12 Oktober 2026 (Tombol 'Daftar Sekarang' Full Width & Restrukturisasi Tombol Bantuan Admin)
**Pembaruan Sesuai Arahan Pengguna:**
- 🔘 **Tombol 'Daftar Sekarang' Full-Width (`w-full`):**
  - Mengubah lebar tombol utama menjadi **penuh 100% (`w-full`)** membentang di sepanjang card formulir.
  - Memberikan visual CTA yang kokoh, tegas, dan mudah dijangkau di semua ukuran layar (mobile maupun desktop).
- ❓ **Restrukturisasi Bagian 'Butuh bantuan ?':**
  - Menghilangkan format pill kecil gabungan sebelumnya.
  - Menggantinya dengan teks judul tersendiri di bagian atas:
    > **Butuh bantuan ?**
  - Di bawahnya disediakan tombol penuh (`w-full`) dengan teks dan ikon telepon:
    > **(icon telp) Hubungi admin via Whatsapp**
  - Menggunakan ikon telepon resmi (`FaPhoneAlt`), warna tema emerald lembut dengan border tegas (`bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300`), dan terhubung langsung ke WhatsApp hotline admin.
- ⚡ **Verifikasi Build:**
  - `npm run build` sukses 100% (84 modules transformed, waktu build ~759ms, zero errors).

### Session 13 — 12 Oktober 2026 (Penggabungan Halaman Cek Status & Login Menjadi Compact Dual-Panel Card Ber-Tab)
**Pembaruan Sesuai Arahan & Referensi Pengguna:**
- 🔄 **Penggabungan Halaman Cek Status & Login Peserta:**
  - Halaman `CekKelulusan` dan `LoginPeserta` yang sebelumnya terpisah kini **disatukan ke dalam satu card terpadu** (`LoginPeserta.jsx` & delegasi `CekKelulusan.jsx`).
  - Mengikuti referensi visual: halaman tidak lagi fullscreen 50/50, melainkan **card melayang kompak (compact centered card)** di tengah layar dengan background bertekstur titik halus (*subtle dot pattern*).
- 📑 **Tab Switcher di Bagian Atas Card Kanan:**
  - Disediakan tab pil interaktif di sudut kanan atas:
    - **`🔑 Login Portal Siswa`**
    - **`🔍 Cek Status`**
  - **Tab 'Login Portal Siswa':** Form input No. WhatsApp/Email, Password, checkbox Ingat Saya, link Lupa Password, dan tombol CTA *"Masuk ke Portal"*.
  - **Tab 'Cek Status':** Form input Nomor Pendaftaran (`MIS-2026-xxxx`), Tanggal Lahir Calon Siswa, tombol CTA *"Cek Status Pendaftaran"*, dan kartu hasil pengecekan interaktif (*Lolos Verifikasi Berkas, Status Tagihan, Jadwal Tahap Selanjutnya*).
- 🌿 **Panel Kiri Khas Mentari Islamic School Klaten:**
  - Background gradien hijau tua emerald (`from-emerald-950 via-primary to-emerald-800`).
  - Identitas resmi Yayasan & PKBM Mentari Kayaarta Klaten, headline sambutan, 3 checklist fitur (*Pendaftaran Online Mudah, Verifikasi Cepat & Tepat, Notifikasi WhatsApp Otomatis*), serta link kembali ke beranda.
- 🔗 **Penyesuaian Semua Tautan (Link Navigation):**
  - Navbar: *"Login Peserta"* mengarah ke `/login`.
  - Home: *"Cek Status / Seleksi"* mengarah ke `/login?tab=status`.
  - Footer: *"Cek Status / Kelulusan"* mengarah ke `/login?tab=status`.
  - Formulir Pendaftaran: *"Cek Status"* mengarah ke `/login?tab=status` dan *"Login"* mengarah ke `/login?tab=login`.
  - Rute `/pengumuman`, `/login`, dan `/cek-status` otomatis membuka tab yang sesuai secara akurat.
- ⚡ **Verifikasi Build:**
  - `npm run build` sukses 100% (84 modules transformed, waktu build ~500ms, zero errors).

### Session 15 — 12 Oktober 2026 (Pembuatan Portal Calon Siswa / Dashboard Post-Login Bergaya Risalah MIS)
**Pembaruan Sesuai Arahan Pengguna:**
- 🔐 **Bypass Login Peserta ke Dashboard:**
  - File `LoginPeserta.jsx` diperbarui dengan `useNavigate`.
  - Fungsi submit form login langsung diarahkan ke rute `/dashboard` (`navigate('/dashboard')`) untuk memberikan pengalaman seamless bagi klien melihat alur pendaftaran secara utuh.
- 🎨 **Layout Master Portal Calon Siswa (Meniru Style Risalah MIS / Tahfidz_MIS):**
  - **Sidebar Kiri (`Sidebar.jsx`):**
    - Background hijau tua (`bg-primary` / `#1B4332`), lebar `w-64`, teks putih/terang.
    - Header: Logo resmi *"Portal Siswa MIS - Mentari Islamic School"*.
    - Menu Navigasi dengan ikon: Beranda, Biodata & Dokumen, Tagihan & Keuangan, Jadwal Seleksi, Hasil Seleksi, dan Pengaturan.
    - Menu aktif memiliki background `bg-white/10` dan border kiri tebal hijau terang (`border-l-4 border-secondary`).
    - Responsive mobile overlay drawer & tombol toggle/close.
    - Tombol cepat ke Website Utama dan Logout ke `/login`.
  - **Topbar Atas (`Topbar.jsx`):**
    - Background hijau terang (`bg-secondary` / `#2ECC71`), tinggi `h-16`, teks putih.
    - Kiri: Tombol hamburger untuk toggle sidebar pada desktop maupun mobile.
    - Kanan: Badge pil "Periode 2026/2027" dan avatar profil calon santri "Ahmad Zaki".
  - **Dashboard Layout (`DashboardLayout.jsx`):**
    - Mengintegrasikan Sidebar, Topbar, dan `<Outlet />` dengan background konten utama abu-abu terang (`bg-slate-100`).
- 📄 **6 Halaman Utama Dashboard (`src/pages/dashboard/`):**
  - **1. Beranda (`BerandaDashboard.jsx`):**
    - Ucapan selamat datang: *"Selamat Datang, Wali dari Ahmad Zaki Mubarok!"* dengan nomor registrasi `REG-2026-00412`.
    - Warning alert box amber: *"Perhatian: Anda belum mengunggah dokumen KK dan Akta Kelahiran. Silakan lengkapi pada menu Biodata & Dokumen."*
    - Progress Bar Pendaftaran 5 Tahap: 1. Akun Dibuat [Selesai], 2. Pembayaran [Selesai], 3. Upload Berkas [Aktif], 4. Tes Seleksi [Menunggu], 5. Hasil [Menunggu].
    - Quick navigation cards menuju menu-menu utama.
  - **2. Biodata & Dokumen (`BiodataDokumen.jsx`):**
    - Grid 2 kolom seimbang.
    - Kolom kiri (Read-only card): Ringkasan Biodata santri (Nama, NIK, TTL, Asal Sekolah, Wali, WhatsApp, Jenjang).
    - Kolom kanan: Upload Dokumen Wajib (Pas Foto 3x4 status "Menunggu Verifikasi" warna kuning, Kartu Keluarga status "Belum Diunggah" warna merah, Akta Kelahiran status "Belum Diunggah", Ijazah/SKL). Dilengkapi tombol interaktif "Pilih File" yang langsung mensimulasikan upload berkas.
  - **3. Tagihan & Keuangan (`TagihanKeuangan.jsx`):**
    - Card Riwayat Pembayaran: Tabel transaksi biaya formulir pendaftaran Rp 250.123 via VA BSI status LUNAS badge hijau, dengan tombol "Cetak Kwitansi" dan "Download Invoice PDF".
    - Card Tagihan Daftar Ulang: Pesan terkunci dengan ikon gembok abu-abu: *"Tagihan daftar ulang akan muncul setelah calon siswa dinyatakan Lulus Seleksi."*
  - **4. Jadwal Seleksi (`JadwalSeleksi.jsx`):**
    - Alert informasi pelaksanaan seleksi masuk Mentari Islamic School.
    - Card Jadwal Observasi & Wawancara Gelombang 1 (Tanggal: 25 Oktober 2026, Waktu: 08.00 - 11.30 WIB, Ruangan: Aula Kampus Utama).
    - Rincian materi observasi (psikologi, tahsin/tahfidz Al-Qur'an, wawancara wali).
    - Tombol aksi utama: *"Cetak Kartu Ujian (PDF)"*.
  - **5. Hasil Seleksi (`HasilSeleksi.jsx`):**
    - Card hasil seleksi terpusat di tengah layar.
    - State 1 (Belum Pengumuman): Ikon Jam Pasir animasi pulse, pesan *"Pengumuman kelulusan akan dibuka pada tanggal 1 November 2026 pukul 10.00 WIB."*
    - Switcher Demo Developer: Tombol toggle interaktif di sudut bawah untuk beralih antara status Belum Pengumuman dan status Lulus.
    - State 2 (Lulus): Ikon Trophy piala emas-hijau, ucapan *"Selamat! Ananda Ahmad Zaki Mubarok dinyatakan LULUS."*, dan tombol *"Lanjutkan ke Tagihan Daftar Ulang"*.
  - **6. Pengaturan Akun (`PengaturanAkun.jsx`):**
    - Form ganti kata sandi: Kata Sandi Lama, Kata Sandi Baru, Konfirmasi Kata Sandi Baru.
    - Validasi minimal 6 karakter dan pencocokan konfirmasi kata sandi dengan notifikasi umpan balik sukses/gagal.
- 🛣️ **Pendaftaran Routing di `App.jsx`:**
  - Mendaftarkan parent route `<Route path="/dashboard" element={<DashboardLayout />}>` beserta 6 child routes: `index`, `biodata`, `tagihan`, `jadwal`, `hasil`, dan `pengaturan`.
- ⚡ **Verifikasi Build:**
  - Build Vite production (`npm run build`) sukses 100% (93 modules transformed, waktu build ~534ms, zero errors).

### Session 16 — 12 Oktober 2026 (Fitur Collapsed Sidebar, Pembersihan UI Dashboard, & Tab Center di Login)
**Pembaruan Sesuai Arahan Pengguna:**
- 📐 **Fitur Sidebar Mengecil (Collapsed / Icon-Only Mode):**
  - Pada `DashboardLayout.jsx`, ditambahkan state dan logika toggle responsif: ketika tombol hamburger garis tiga di Topbar diklik, sidebar pada desktop langsung mengecil (`lg:w-20` dari sebelumnya `lg:w-64`) dan hanya menampilkan ikon saja.
  - Logo MIS otomatis menciut hanya menampilkan icon squircle centered saat collapsed.
  - Setiap menu navigasi otomatis berpusat dan menampilkan icon saja dengan tooltip nama halaman.
  - Transisi animasi sidebar diperhalus dengan `transition-all duration-300 ease-in-out`.
- 🧹 **Pembersihan Elemen Sidebar Dashboard (`Sidebar.jsx`):**
  - Menghapus tulisan header label `"Menu Utama"`.
  - Menghapus tombol navigasi eksternal `"Lihat Website Utama"`.
  - Mengubah teks tombol logout dari `"Keluar / Logout"` menjadi **`"Keluar"`** saja. Pada mode collapsed, tombol keluar rapi menampilkan ikon keluar di tengah dengan tooltip.
- 🔲 **Pembersihan Topbar (`Topbar.jsx`):**
  - Menghapus teks `"Portal Calon Siswa"` di sebelah tombol hamburger agar header lebih lega, minimalis, dan elegan.
- 🎯 **Posisi Tab Login & Cek Status di Tengah (Center):**
  - Pada `LoginPeserta.jsx`, posisi tab switcher pill ("Login Portal Siswa" & "Cek Status") diubah dari rata kanan (`justify-end`) menjadi tepat di tengah (`justify-center`).
- ⚡ **Verifikasi Build:**
  - Build Vite production (`npm run build`) sukses 100% (93 modules transformed, waktu build ~613ms, zero errors).

### Session 17 — 12 Oktober 2026 (Standardisasi Syarat Pendaftaran untuk Semua Unit Pendidikan)
**Pembaruan Sesuai Arahan Pengguna:**
- 📋 **Pembaruan 6 Syarat Pendaftaran Resmi ([DetailUnit.jsx](file:///c:/xampp/htdocs/BACKUP%20PROJECT%20RISALAH%20MUTABAAH%20MIS/Pendaftaran_MIS/Frontend/src/pages/landingpage/DetailUnit.jsx)):**
  - Mengganti daftar syarat pendaftaran lama menjadi 6 butir syarat resmi yang berlaku seragam untuk **seluruh unit pendidikan** (TPA, KB, TK, SD, SMP, SMA):
    1. Mengisi Formulir Pendaftaran Online
    2. Fotocopy Akta Kelahiran (1 lembar)
    3. Fotocopy Kartu Keluarga (1 lembar)
    4. Pas Foto 3x4 (4 lembar, berwarna / hitam putih)
    5. Fotocopy KPS/KKS (jika menerima)
    6. Fotocopy Ijazah/Raport Terakhir
- ⚡ **Verifikasi Build:**
  - Build Vite production (`npm run build`) sukses 100% (93 modules transformed, waktu build ~711ms, zero errors).

### Session 18 — 12 Oktober 2026 (Pembuatan Halaman Tagihan Pembayaran Dinamis & Sesuai Referensi Gambar)
**Pembaruan Sesuai Arahan & Referensi Pengguna:**
- 🚀 **Alur Navigasi Langsung dari Formulir Pendaftaran:**
  - Pada `FormDaftarAwal.jsx`, ketika tombol *"Daftar Sekarang"* diklik dan validasi disetujui, sistem langsung mengarahkan pengguna ke halaman tagihan pembayaran (`navigate('/tagihan/' + currentUnitId)`), membawa data nama calon siswa dan nomor registrasi unik.
- 🎨 **Tampilan Tagihan Pembayaran Persis Referensi Gambar ([TagihanPembayaran.jsx](file:///c:/xampp/htdocs/BACKUP%20PROJECT%20RISALAH%20MUTABAAH%20MIS/Pendaftaran_MIS/Frontend/src/pages/landingpage/TagihanPembayaran.jsx)):**
  - Mengadopsi format **Compact Floating Dual-Panel Card** di atas background dot-pattern bertekstur titik halus (tanpa MainLayout navbar/footer) persis seperti referensi visual dari Isy Karima.
  - **Panel Kiri (Hijau Emerald):** Identitas PKBM Mentari Kayaarta, Mentari Islamic School Klaten, headline selamat datang, serta 3 poin checklist (Pendaftaran Online Mudah, Verifikasi Otomatis, Notifikasi WhatsApp).
  - **Panel Kanan (Putih):**
    - **Header:** *"Tagihan Pendaftaran"* & *"Status dan detail instruksi pembayaran pendaftaran"*.
    - **Card Calon Siswa:** Tag unit sekolah (e.g. `SD MENTARI ISLAMIC SCHOOL KLATEN`), nama calon siswa bold, nomor ID unik pendaftaran (`PAY-SD-26...`), dan badge status `⏳ Menunggu Pembayaran` warna kuning.
    - **Detail Biaya Dinamis Berdasarkan Unit:**
      - Biaya pendaftaran menyesuaikan unit yang didaftar:
        - TPA: Rp 100.000
        - KB: Rp 150.000
        - TK: Rp 200.000
        - SD: Rp 250.000
        - SMP: Rp 300.000
        - SMA: Rp 350.000
      - Kode Unik Verifikator: `+ Rp 158` (menghasilkan angka unik persis referensi).
      - Total tagihan terhitung otomatis secara presisi.
    - **Field Voucher Pendaftaran:**
      - Input kode voucher dengan tombol *"Gunakan"*.
      - Fungsionalitas interaktif: jika voucher digunakan (misal `MISHEMAT`, `DISKON50`), sistem otomatis memotong tagihan dan menampilkan baris diskon voucher, lengkap dengan tombol untuk menghapus voucher.
    - **Rekening Pembayaran Bank BRI:**
      - Bank Penerima: **BRI**
      - Nomor Rekening: **0154-01-002847-53-9** (dilengkapi tombol copy ke clipboard interaktif).
      - Atas Nama: **YAYASAN MENTARI KAYAARTA**.
    - **Peringatan PENTING:** Alert amber box yang mengingatkan transfer sesuai total tagihan hingga 3 digit kode unik.
    - **Upload Bukti Transfer Manual:** Komponen pemilih file (`Choose File`), tombol *"Unggah Bukti Pembayaran"*, dan simulasi status sukses verifikasi panitia.
- 🛣️ **Update Routing di `App.jsx`:**
  - Route `/tagihan` dan `/tagihan/:id` diubah menjadi rute mandiri (tanpa `MainLayout`) agar tampil maksimal sebagai floating card persis referensi visual.
- 📐 **Penyempurnaan Dimensi & Ruang (Card Dibuat Lebih Lebar & Tidak Berdempetan):**
  - Mengubah lebar kontainer card dari `max-w-4xl` (terlalu sempit / berdempetan) menjadi **`max-w-5xl xl:max-w-6xl`** (sangat lega dan proporsional).
  - Proporsi panel kanan dinaikkan menjadi `lg:w-[65%]` (sebelumnya sempit), memberikan ruang horizontal lebih dari ~750px sehingga elemen tidak berdesakan.
  - Menghilangkan batasan tinggi sempit `max-h-[90vh]` dan double scrollbar internal agar halaman mengalir alami (*smooth page scrolling*).
  - Penambahan padding yang nyaman (`p-8 sm:p-10 lg:p-12`), jarak antar section yang lega (`space-y-6 sm:space-y-7`), dan penataan rekening bank dalam grid 3 kolom horizontal yang rapi.
- ⚡ **Verifikasi Build:**
  - Build Vite production (`npm run build`) sukses 100% (93 modules transformed, waktu build ~653ms, zero errors).

---

## 9. Catatan Penting untuk Update Selanjutnya

### Yang Sudah Selesai:
- [x] Struktur project & konfigurasi
- [x] Desain UI semua halaman (Full Green Aesthetic & Rich Color Palette)
- [x] Navigasi scroll + scroll spy
- [x] Layout responsive (desktop + mobile)
- [x] Filter 6 unit pendidikan (TPA, KB, TK, SD, SMP, SMA tanpa boarding)
- [x] Tab interaktif alur pendaftaran (dengan progress bar)
- [x] Hero split layout dengan aset foto asli kampus Klaten & counter 500+ santri
- [x] Rombak total Tentang Kami (teks resmi, berdiri 2012, ~500 santri, seamless light transition)
- [x] Galeri 8 fasilitas lengkap dengan foto nyata
- [x] Integrasi Google Maps embed untuk 2 lokasi kampus Klaten (Polanharjo & Tulung)
- [x] Update kontak resmi (email cyberschool, instagram, youtube, tiktok)
- [x] Styling form & invoice tagihan yang harmonis
- [x] Master Card Formulir PPDB elegan dengan bayangan jelas & tombol full-width
- [x] Penggabungan Halaman Cek Status & Login Peserta (Dual-tab compact modal card)
- [x] Portal Calon Siswa (Dashboard Post-Login: Sidebar hijau tua, Topbar hijau cerah, Content slate-100, 6 modul lengkap)
- [x] Sidebar Collapse (Mode icon-only toggle via hamburger, teks Keluar, pembersihan label, Topbar clean, Tab login center)
- [x] Standardisasi Syarat Pendaftaran resmi di Detail Unit untuk seluruh jenjang (A-C aligned)
- [x] Halaman Tagihan Pendaftaran sesuai referensi Isy Karima (biaya dinamis per unit, BRI, kode unik 158, voucher, upload bukti)
- [x] Fase 1: Core Pendaftaran Backend Django (Model Pendaftar, Serializer camelCase/snake_case, API /api/daftar/, Admin Panel, Superuser, Integrasi FormDaftarAwal)

### Session 19 — 12 Oktober 2026 (Fase 1: Core Pendaftaran Backend Django & Koneksi ke Frontend React)
**Pembaruan Sesuai Arahan Pengguna:**
- ⚙️ **Inisialisasi Project Django & Virtual Environment:**
  - Folder `Backend/` dibuat di dalam `Pendaftaran_MIS/`.
  - Virtual environment Python `venv/` berhasil dibuat dan dependencies diinstal: `django`, `djangorestframework`, `django-cors-headers`, `djangorestframework-simplejwt`.
  - Project Django `core` dan app `ppdb` dibuat.
- 🛠️ **Konfigurasi `settings.py`:**
  - Menambahkan `'rest_framework'`, `'corsheaders'`, dan `'ppdb'` ke `INSTALLED_APPS`.
  - Menambahkan `'corsheaders.middleware.CorsMiddleware'` pada posisi paling atas di `MIDDLEWARE`.
  - Menetapkan `CORS_ALLOW_ALL_ORIGINS = True`, `APPEND_SLASH = False`, dan `ALLOWED_HOSTS = ['*']`.
- 🗄️ **Model Database `Pendaftar` (`ppdb/models.py`):**
  - Model flat mencakup seluruh field formulir pendaftaran (Bagian A, B, C):
    - Identitas: `no_registrasi` (unique), `unit`, `nama_lengkap`, `jenis_kelamin`, `nik`, `tempat_lahir`, `tanggal_lahir`, `agama`.
    - Alamat & Kontak: `jalan`, `rt`, `rw`, `dusun`, `desa_kelurahan`, `kecamatan`, `kabupaten`, `tempat_tinggal`, `transportasi`, `no_hp`, `no_kps_kks`.
    - Orang Tua: `nama_ayah`, `tahun_lahir_ayah`, `pendidikan_ayah`, `pekerjaan_ayah`, `penghasilan_ayah`, `status_ayah`, `tahun_meninggal_ayah`, `nama_ibu`, `tahun_lahir_ibu`, `pendidikan_ibu`, `pekerjaan_ibu`, `penghasilan_ibu`, `status_ibu`, `tahun_meninggal_ibu`.
    - Data Periodik: `tinggi_badan`, `berat_badan`, `jarak_sekolah`, `waktu_jam`, `waktu_menit`, `anak_ke`, `dari_berapa_saudara`, `jumlah_saudara_kandung`, `jumlah_adik`, `jumlah_kakak`.
    - Status: `status_pembayaran` (default='PENDING'), `created_at` (auto_now_add=True).
- 🔌 **REST API Serializer & Views (`ppdb/serializers.py` & `ppdb/views.py`):**
  - `PendaftarSerializer`: Mendukung normalisasi otomatis dari format camelCase React ke snake_case Django model, serta penanganan tanggal kosong (`"" -> None`).
  - `PendaftarCreateAPIView`: Meng-override `perform_create` untuk men-generate otomatis format `no_registrasi` unik `MIS-2026-{random_4_digit}`.
- 🌐 **Routing & Admin (`ppdb/urls.py`, `core/urls.py`, `ppdb/admin.py`):**
  - Endpoint REST API: `POST /api/daftar/`.
  - Django Admin Panel: Model `Pendaftar` didaftarkan dengan `list_display`, `search_fields`, dan filter.
- 🗃️ **Migrasi Database & Akun Superuser:**
  - Migrasi dijalankan (`makemigrations` dan `migrate`).
  - Akun superuser dibuat: Username `admin`, Password `admin123`.
- 🔗 **Integrasi Frontend React ([FormDaftarAwal.jsx](file:///c:/xampp/htdocs/BACKUP%20PROJECT%20RISALAH%20MUTABAAH%20MIS/Pendaftaran_MIS/Frontend/src/pages/landingpage/FormDaftarAwal.jsx)):**
  - Fungsi `handleSubmit` dihubungkan langsung ke `http://localhost:8000/api/daftar/` via fetch POST JSON.
  - Saat respons sukses (HTTP 201), `no_registrasi` hasil generate backend disimpan dan modal sukses pendaftaran dimunculkan.
  - Tombol submit dilengkapi state loading `isSubmitting` ("Mengirim Formulir...").
- 🚀 **Server Aktif di Background:**
  - Django Server: `http://localhost:8000` (Admin: `http://localhost:8000/admin/`)
  - Vite Dev Server: `http://localhost:5174/` (atau `http://localhost:5173/`)

### Session 20 — 12 Oktober 2026 (Backend Fase 2: Autentikasi JWT)
- **Backend:** Setup SimpleJWT, fungsi auto-create User pada view pendaftaran (Username: No Registrasi, Password: NIK), dan pembuatan endpoint `/api/login/` serta `/api/dashboard-data/`.
- **Frontend:** Update `LoginPeserta.jsx` untuk hit API login dan menyimpan access token ke `localStorage`. Update `BerandaDashboard.jsx` menambahkan proteksi akses dan fetch data siswa secara dinamis.

### Session 21 — 12 Oktober 2026 (Fitur Toggle Lihat Password / Eye Icon On-Off di Login)
- **Frontend:** Menambahkan icon mata interaktif (`FaEye` & `FaEyeSlash`) pada input password di halaman `LoginPeserta.jsx`. Pengguna dapat mengklik tombol mata on/off untuk melihat atau menyembunyikan isi password secara real-time.

### Session 22 — Oktober 2026 (Backend Fase 4: Core Dashboard)
- **Backend:** Setup `MEDIA_ROOT` & `MEDIA_URL` untuk upload file dokumen. Modifikasi model `Pendaftar` (tambah `file_kk`, `file_akta`, `file_foto`, `file_ijazah`, `status_dokumen`, `status_seleksi`). Pembuatan model `JadwalSeleksi`. Pembuatan API `/api/upload-dokumen/` (PATCH multipart) dan `/api/jadwal/` (GET).
- **Frontend:** `BiodataDokumen.jsx` terhubung ke API upload menggunakan `FormData` dan status badge dinamis. `HasilSeleksi.jsx` & `JadwalSeleksi.jsx` dibuat dinamis berdasarkan data backend Django. Progress bar dan alert box di `BerandaDashboard.jsx` menyesuaikan status backend secara real-time.

### Session 23 — Oktober 2026 (Fase 3: Integrasi QRIS Sandbox BRI)
- **Backend:** Membuat app `payment`. Menyimpan kredensial BRI Sandbox (`2EAYwMs...`) secara hybrid di model `PengaturanSistem`. Membuat utility `get_bri_token`, `generate_qris_string`, dan API Cek Pembayaran (`/api/payment/tagihan/<no_registrasi>/` & `/api/payment/cek-pembayaran/<no_registrasi>/`). Modifikasi pembuatan `Pendaftar` agar otomatis men-generate `TagihanPendaftaran` dan QRIS string.
- **Frontend:** Instalasi `qrcode.react`. Menampilkan Barcode QRIS dinamis di `TagihanPembayaran.jsx`. Mengganti fitur upload bukti manual menjadi tombol `'Saya Sudah Bayar (Cek Tagihan)'` yang menembak API backend.

### Session 24 — Oktober 2026 (Validasi Checksum QRIS CRC-16 CCITT EMVCo)
- **Backend (`payment/bri_api.py`):** Menambahkan fungsi kalkulator `hitung_crc16(data: str) -> str` menggunakan standar CRC-16 CCITT (`0xFFFF`, polinomial `0x1021`) pada `generate_qris_string` agar 4 digit ekor checksum QRIS 100% valid sesuai spesifikasi EMVCo. Seluruh data `qris_string` pada tagihan yang sudah ada di database juga telah diperbarui otomatis.

### Session 25 — Oktober 2026 (Integrasi Endpoint Resmi Generate QR Sandbox BRI MPM Statis)
- **Backend (`payment/bri_api.py`):** Memperbarui `generate_qris_string` untuk menembak langsung endpoint resmi simulator QRIS Statis BRI (`/simulator/qr/qr-mpm-generate-qr`) menggunakan OAuth Bearer Token serta header `X-TIMESTAMP`, `X-SIGNATURE`, `X-PARTNER-ID`, dan `X-EXTERNAL-ID`. Dilengkapi fallback otomatis ke payload standar EMVCo dengan perhitungan checksum CRC-16 CCITT jika server sandbox mengalami maintenance/limit.

### Session 26 — Oktober 2026 (QRIS Merchant Presented Mode (MPM) Dinamis v1.1 SNAP BRI)
- **Backend:** Menambahkan field `merchant_id` dan `terminal_id` pada model `PengaturanSistem` (`payment/models.py`) dan menjalankan migrasi database.
- **Backend (`payment/bri_api.py`):** Merombak total request API ke endpoint resmi SNAP v1.1 (`/snap/v1.1/qr/qr-mpm-generate`) dengan payload standar SNAP (amount format 2 desimal, `partnerReferenceNo`, `merchantId`, `terminalId`), header `X-TIMESTAMP`, `X-SIGNATURE`, `X-PARTNER-ID`, `CHANNEL-ID`, `X-EXTERNAL-ID`, serta menghapus total seluruh string dummy/fallback.
- **Backend (`ppdb/views.py`):** Menyimpan `qris_string` bernilai `None` jika API BRI gagal menghasilkan QRIS saat pendaftaran.
- **Frontend (`TagihanPembayaran.jsx`):** Menghapus fallback QRIS string lokal dan menampilkan UI error card responsif jika `qris_string` belum tersedia/gagal dimuat dari server BRI.

### Session 27 — Oktober 2026 (Refactoring Import & Pembuatan Tagihan di ppdb/views.py)
- **Backend (`ppdb/views.py`):** Merapikan import `random` pada level modul dan menata ulang logika pembuatan akun user serta `TagihanPendaftaran` pada `perform_create` agar eksekusi pendaftaran dan auto-generate tagihan berjalan lancar tanpa error scope variabel.

### Session 28 — Oktober 2026 (Standarisasi Keamanan SNAP BI QRIS Dinamis v1.1)
- **Dependencies:** Menginstal modul industri `cryptography` pada virtual environment.
- **Backend (`payment/models.py`):** Menambahkan field `private_key` (TextField) pada `PengaturanSistem` untuk menyimpan RSA 2048 Private Key dan menjalankan migrasi database (`0003_pengaturansistem_private_key.py`).
- **Backend (`payment/bri_api.py`):** Merombak total mekanisme otorisasi dan signature sesuai Standar Nasional Open API Pembayaran (SNAP BI):
  - SHA256withRSA signature (`generate_rsa_signature`) untuk endpoint token B2B (`/snap/v1.0/access-token/b2b`).
  - HMAC-SHA512 signature (`generate_hmac_signature`) dengan minified SHA-256 body hash untuk endpoint QRIS (`/snap/v1.1/qr/qr-mpm-generate`).
- **Generator Kunci RSA:** Membuat script `generate_rsa.py` untuk menghasilkan sepasang kunci `private_key.pem` dan `public_key.pem` (RSA 2048-bit PKCS#8), serta menyimpan private key secara otomatis ke database `PengaturanSistem`.
- **Konfigurasi Sandbox:** Menyesuaikan header `'X-PARTNER-ID'` menjadi string statis `'123123'` pada `generate_qris_string` untuk memenuhi validasi lingkungan Sandbox BRI API.

### Session 29 — Oktober 2026 (Sanitasi & Normalisasi PEM Private Key)
- **Backend (`payment/bri_api.py`):** Menambahkan fungsi `sanitize_private_key` menggunakan modul `textwrap` untuk membersihkan spasi/newline berlebih dan membungkus string Base64 kunci RSA menjadi 64 karakter per baris berstandar PEM PKCS#8 valid. Ini mencegah error decoding saat Private Key dimasukkan manual melalui Django Admin.

### Session 30 — Oktober 2026 (Format Numerik Partner Reference & Minifikasi Hashing SNAP BI)
- **Backend (`payment/bri_api.py`):**
  - Mengonversi `no_registrasi` menjadi format murni numerik (`"".join(filter(str.isdigit, no_registrasi))`) pada field `partnerReferenceNo` dan header `X-EXTERNAL-ID` untuk mematuhi aturan ketat SNAP BI.
  - Menggunakan minifikasi JSON murni (`json.dumps(..., separators=(',', ':'))`) saat hashing SHA-256 untuk memastikan keakuratan payload hash pada `generate_hmac_signature`.
  - Menetapkan header `X-PARTNER-ID` menggunakan `config.bri_client_id` (Client ID pemilik/pembuat token B2B) sesuai aturan validasi otentikasi API BRI.

### Session 31 — 15 Oktober 2026 (Tahap 1: Backend API Admin, Multi-Gelombang Dinamis, Role-Based Login, & Sinkronisasi Real-Time Frontend)
- 🗄️ **Model Multi-Gelombang Dinamis (`ppdb/models.py`):**
  - Menambahkan fungsi helper `default_syarat_pendaftaran()` (6 butir syarat umum berkas PPDB).
  - Membuat model `UnitPendidikan`: Menyimpan `kode` unik (`tpa`, `kb`, `tk`, `sd`, `smp`, `sma`), `nama`, `kategori_label`, `lokasi_kampus`, `deskripsi_singkat`, `profil_lembaga`, `syarat_pendaftaran` (JSONField), `is_active` (saklar buka/tutup unit), `urutan`, dan helper method `get_active_gelombang()`.
  - Membuat model `GelombangPendaftaran`: Relasi One-to-Many ke `UnitPendidikan` (`related_name='gelombang_list'`), `nama_gelombang`, `tanggal_mulai`, `tanggal_selesai`, `biaya_pendaftaran`, dan `is_aktif`.
  - Menjalankan migrasi database: `ppdb.0003_unitpendidikan_gelombangpendaftaran`.
- 🛠️ **Admin Django Terpadu (`ppdb/admin.py`):**
  - Mendaftarkan `GelombangPendaftaranInline` (TabularInline) di dalam `UnitPendidikanAdmin` untuk mengelola unit beserta gelombangnya dalam satu tampilan praktis.
  - Mendaftarkan `GelombangPendaftaranAdmin` independen dengan list filter dan editable field.
- 🔌 **REST API & Computed Serializers (`ppdb/serializers.py` & `ppdb/views.py`):**
  - `GelombangPendaftaranSerializer`: Menghitung `status_waktu` (`'AKAN_DATANG'`, `'AKTIF'`, `'BERAKHIR'`) otomatis sesuai tanggal sistem.
  - `UnitPendidikanSerializer`: Mengembalikan nested `gelombang_list` dan computed fields: `gelombang_aktif_data`, `is_open`, `biaya_aktif`, `nama_gelombang_aktif`, dan `masa_pendaftaran_teks` dengan penanggalan format Indonesia.
  - Endpoint REST API baru: `GET /api/units/` dan `GET /api/units/<str:kode>/` (serta alias `/api/payment/units/`).
  - `CustomTokenObtainPairSerializer` & `CustomTokenObtainPairView`: Endpoint `/api/login/` kini menyertakan field `role` (`'admin'` jika staf/superuser, `'siswa'` untuk akun pendaftar), `username`, dan `name`.
  - `PendaftarCreateAPIView`: Validasi dinamis `unit_obj.get_active_gelombang()`. Jika unit tutup atau tidak ada gelombang aktif, registrasi ditolak dengan HTTP 400. Biaya pokok tagihan secara dinamis diambil dari `active_gelombang.biaya_pendaftaran`.
- 🌱 **Database Seeder (`ppdb/management/commands/seed_units.py`):**
  - Perintah `python manage.py seed_units` sukses menginjeksi 6 unit resmi lengkap dengan profil, persyaratan, serta Gelombang 1 (aktif berjalan) dan Gelombang 2 (periode lanjutan).
- 💻 **Sinkronisasi Real-Time ke Frontend React:**
  - `LoginPeserta.jsx`: Menyimpan status `user_role` dan mengarahkan admin ke `/admin-portal` serta siswa ke `/dashboard`.
  - `AdminPortal.jsx` & `App.jsx`: Menambahkan halaman baru `/admin-portal` yang merangkum status seluruh 6 unit, rincian gelombang dan biaya, tautan instan ke Django Admin (`http://localhost:8000/admin/`), dan tombol keluar akun.
  - `Home.jsx`: Mengambil unit secara dinamis dari `/api/units/`, menampilkan badge Buka/Tutup dinamis (`is_open`), info nama gelombang aktif, nominal biaya pendaftaran masuk, dan memblokir klik pendaftaran bila unit ditutup.
  - `DetailUnit.jsx`: Menyinkronkan masa pendaftaran, gelombang aktif, nominal biaya, daftar syarat pendaftaran dinamis, dan menonaktifkan tombol daftar bila unit tidak menerima pendaftar baru.
  - `FormDaftarAwal.jsx`: Menampilkan alert spesifik dari backend jika unit tutup serta mengarahkan nomor registrasi ke rute invoice `/tagihan/{no_registrasi}`.
  - `TagihanPembayaran.jsx`: Membaca parameter nomor registrasi secara dinamis dari URL/state dan memuat data nominal biaya pokok tagihan serta QRIS BRI langsung dari data backend.
  - Verifikasi Build: `npm run build` sukses 100% tanpa error kompilasi.

### Session 32 — 15 Oktober 2026 (Tahap 2: Antarmuka UI Frontend Portal Admin /admin-portal Lengkap)
- 🔌 **Backend REST API Tambahan (`ppdb/views.py` & `ppdb/urls.py`):**
  - `GET /api/admin/stats/`: Agregasi statistik sistem (total pendaftar, tagihan lunas, tagihan pending, berkas perlu verifikasi, serta rekapitulasi data pendaftar & gelombang aktif 6 unit).
  - `GET /api/admin/pendaftar/`: Listing seluruh calon santri dengan dukungan pencarian multi-field (nama/no reg/NIK) dan filter berjenjang (unit, status bayar, status seleksi).
  - `PATCH / DELETE /api/admin/pendaftar/<id>/`: Pembaruan status berkas, penentu kelulusan, penyesuaian status pembayaran (sinkron ke `TagihanPendaftaran`), dan penghapusan data pendaftar beserta user account.
  - `POST /api/gelombang/` & `PATCH / DELETE /api/gelombang/<id>/`: Manajemen CRUD gelombang pendaftaran dinamis per unit.
  - `PATCH /api/units/<kode>/`: Pembaruan profil unit dan susunan syarat pendaftaran berkas.
- 🎨 **Layout & Navigasi Admin (`AdminLayout.jsx`, `AdminSidebar.jsx`, `AdminTopbar.jsx`):**
  - Proteksi otorisasi berbasis `user_role === 'admin'` dengan redirect otomatis ke `/login`.
  - Sidebar bernuansa hijau *emerald* tua (`bg-primary`), mendukung mode *collapsed* (shrink ke ikon) dan mode mobile drawer responsif.
  - Topbar bersih dengan badge *"Administrator PPDB — Mentari Islamic School"*, nama user, dan pintasan satu-klik ke Django Admin.
- 📊 **Halaman 1: Dashboard Statistik (`AdminDashboard.jsx`):**
  - Rangkuman metrik 4 kartu atas: Total Pendaftar, Tagihan Lunas, Menunggu Bayar, dan Verifikasi Berkas.
  - Tabel rekapitulasi real-time 6 unit pendidikan (TPA s/d SMA) dengan jumlah siswa terdaftar, gelombang aktif, biaya registrasi, badge Buka/Tutup, dan tombol aksi kelola.
- 🏫 **Halaman 2: Kelola Unit & Gelombang (`AdminUnitManager.jsx`):**
  - Tab switcher 6 unit (TPA s/d SMA) dengan auto-sync ke URL parameter `?kode=...`.
  - Formulir lengkap profil unit (nama, kategori, kampus, deskripsi, textarea profil) dan saklar toggle buka/tutup unit `is_active`.
  - Dynamic requirements editor: daftar syarat berkas yang bisa ditambah (`+ Tambah Syarat`), disunting, atau dihapus secara interaktif.
  - Multi-wave manager: tabel gelombang dengan indikator waktu (`AKTIF`, `AKAN_DATANG`, `BERAKHIR`), modal form tambah/edit gelombang, serta fitur hapus gelombang.
- 👥 **Halaman 3: Kelola Data Pendaftar (`AdminPendaftarManager.jsx`):**
  - Toolbar pencarian debounce & filter 4 kriteria (search, unit, status bayar, hasil seleksi).
  - Tabel master pendaftar lengkap dengan badge status pembayaran, berkas, dan hasil seleksi.
  - Modal drawer komprehensif 3 tab interaktif:
    - **Tab 1 (Biodata):** Menampilkan rincian Bagian A (Calon Siswa), Bagian B (Orang Tua), dan Bagian C (Periodik), serta tombol hapus data pendaftar.
    - **Tab 2 (Tagihan & QRIS):** Rincian biaya pokok, kode unik, total tagihan, viewer QRIS barcode digital, dan tombol toggle status bayar `LUNAS (PAID)` / `PENDING`.
    - **Tab 3 (Berkas & Kelulusan):** Link pratinjau unduh berkas digital (KK, Akta, Pas Foto, Ijazah), tombol pembaruan status berkas (`TERVERIFIKASI`, `PERLU PERBAIKAN`, `BELUM LENGKAP`), dan tombol penetapan keputusan hasil seleksi (`LULUS`, `TIDAK LULUS`, `BELUM PENGUMUMAN`).
- 🚀 **Routing & Verifikasi Build (`App.jsx`):**
  - Terdaftar parent route `/admin-portal` dengan child routes: `index`, `unit`, dan `pendaftar`.
  - Build Vite (`npm run build`) berhasil 100% tanpa error (0 errors, 100 modules transformed).

### Session 33 — 15 Oktober 2026 (Penyeragaman Desain UI Portal Admin & Modul Jadwal Seleksi)
- 🎨 **Penyeragaman Topbar Admin (`AdminTopbar.jsx`):**
  - Mengubah latar belakang menjadi `bg-secondary` (#2ECC71), tinggi `h-16`, teks putih, selaras 100% dengan Topbar Portal Siswa.
  - Menghapus link luar ke Django Admin (`Django Admin ↗`) dan teks `"Panel Kontrol Admin"`.
  - Menyederhanakan bagian kanan menjadi badge identitas *"Administrator PPDB — Mentari Islamic School"* dan profil user admin.
- 🧭 **Penyesuaian Sidebar Admin (`AdminSidebar.jsx`):**
  - Menghapus menu `"Lihat Website Utama"`.
  - Menambahkan menu baru 📅 **Jadwal Seleksi** (`/admin-portal/jadwal`, ikon `FaCalendarAlt`).
  - Mengubah label tombol logout di footer sidebar menjadi **`"Keluar"`**.
- 🗄️ **Backend API Jadwal Seleksi & Monitoring (`ppdb/models.py`, `serializers.py`, `views.py`, `urls.py`):**
  - Menambahkan relasi foreign key `jadwal` pada model `Pendaftar` (`ppdb.0004_pendaftar_jadwal.py`).
  - Menambahkan field `total_peserta` pada `JadwalSeleksiSerializer` dan `jadwal_detail` pada `AdminPendaftarSerializer`.
  - Endpoint baru:
    - `GET / POST /api/admin/jadwal/`: Master daftar jadwal seleksi dan pembuatan jadwal baru.
    - `PATCH / DELETE /api/admin/jadwal/<id>/`: Edit dan hapus jadwal seleksi.
    - `GET /api/admin/jadwal/<id>/peserta/`: Monitoring daftar santri peserta untuk jadwal seleksi tertentu.
    - `POST /api/admin/jadwal/<id>/assign/`: Penugasan santri ke jadwal seleksi.
- 💻 **Frontend Modul Jadwal Seleksi (`AdminJadwalManager.jsx` & `App.jsx`):**
  - **Section 1 (Master Jadwal):** Tabel jadwal tes seleksi (Gelombang, Tanggal, Jam, Lokasi, Deskripsi materi tes), modal form buat & edit jadwal, tombol hapus jadwal, serta tombol **"Monitor Peserta"**.
  - **Section 2 (Monitoring Peserta):** Banner sesi tes aktif dengan pencarian peserta santri, tabel status pembayaran, status seleksi, dan tombol cepat penetapan keputusan kelulusan (*Lulus / Tidak Lulus*).
  - Rute `/admin-portal/jadwal` terdaftar rapi pada `App.jsx`.
### Session 34 — 15 Oktober 2026 (Spesifikasi Web Risalah MIS: Isolasi Unit Pendidikan, Sub-Menu Jadwal, Modul Keputusan Seleksi & Styling Tahfidz_MIS)
- 🗄️ **Isolasi Unit Pendidikan pada Jadwal Seleksi (`Backend/ppdb/models.py`, `views.py`, `serializers.py`):**
  - Menambahkan field `unit` (`models.CharField(max_length=20, default='sd', db_index=True)`) pada model `JadwalSeleksi`.
  - Migrasi database `ppdb.0005_alter_jadwalseleksi_options_jadwalseleksi_unit` diterapkan sukses.
  - Memperbarui `AdminJadwalListCreateAPIView`: mendukung filter query parameter `unit`, pencarian, dan penanggalan, serta auto-save unit yang aktif.
  - Memperbarui `AdminJadwalPesertaAPIView`: membatasi query peserta sesuai unit jadwal yang bersangkutan.
  - Menambahkan endpoint baru `POST /api/admin/pendaftar/<pk>/keputusan/` (`AdminKeputusanSeleksiAPIView`) untuk penetapan keputusan kelulusan peserta (`LULUS`, `TIDAK LULUS`, `BELUM PENGUMUMAN`).
- 🧭 **Restrukturisasi Navigasi Sidebar Admin (`AdminSidebar.jsx`):**
  - Mengubah menu **Jadwal Seleksi** menjadi menu bertingkat (*collapsible accordion*) dengan chevron down interaktif:
    - **Sub-Menu A (Input Jadwal Seleksi):** `/admin-portal/jadwal/input`
    - **Sub-Menu B (Monitoring Jadwal):** `/admin-portal/jadwal/monitoring`
  - Menambahkan menu utama baru: **Keputusan Seleksi** (`/admin-portal/keputusan`, icon `FaUserCheck`).
  - Active state terpadu dengan border kiri hijau terang, auto-expand saat rute anak aktif, dan penanganan saat sidebar dalam kondisi *collapsed*.
- 🔔 **Komponen Notifikasi Pop-Up Pil Hitam Melayang (`SuccessNotification.jsx`):**
  - Mengadopsi styling 100% dari Web Risalah (`Tahfidz_MIS`): container pil hitam melayang di pojok kanan atas (`fixed top-6 right-6 z-[2000]`), background `bg-[#121212]/95 backdrop-blur-md`, animasi goyang `pop-wiggle`, dan ikon centang hijau dalam lingkaran berbayang lembut.
- 📅 **Halaman Sub-Menu A: Input Jadwal Seleksi (`AdminInputJadwal.jsx`):**
  - Switcher tab unit pendidikan (TPA s/d SMA) di bagian atas.
  - Form agenda seleksi lengkap: pilihan unit, gelombang pendaftaran dinamis, tanggal tes, waktu mulai & selesai, lokasi ruangan, serta textarea rincian materi tes.
  - Panel samping daftar sesi yang sudah terdaftar pada unit terkait dengan quick link ke monitoring.
  - Dilengkapi notifikasi aksi sukses pil hitam saat data berhasil disimpan.
- 📊 **Halaman Sub-Menu B: Monitoring Jadwal Seleksi (`AdminMonitoringJadwal.jsx`):**
  - Filter unit pendidikan (TPA, KB, TK, SD, SMP, SMA, Semua Unit).
  - Mengadopsi struktur tabel data persis `Tahfidz_MIS`: container berborder atas hijau terang `border-t-[5px] border-[#2ECC71]`, kontrol `Show [10/25/50] entries` di kiri atas, filter tanggal dan kotak pencarian `Search:` di kanan atas.
  - Header tabel bergaris hitam tegas, baris selang-seling `even:bg-[#f2f2f2]`, tombol aksi Edit (`#2ECC71`), Hapus (`#E74C3C`), dan Monitor Peserta (`#5294A9`).
  - Modal form Tambah dan Edit melayang di tengah layar dengan latar belakang gelap transparan (`backdrop-blur-sm`).
  - Modal konfirmasi hapus data dengan efek `backdrop-blur`.
  - Pagination terpadu (`Showing X to Y of Z entries` dan tombol navigasi `Prev`, nomor aktif, `Next`).
- 🏆 **Halaman Menu Utama Baru: Keputusan Seleksi (`AdminKeputusanSeleksi.jsx`):**
  - Tab unit switcher aktif (TPA s/d SMA) untuk isolasi data pendaftar per jenjang.
  - Kartu metrik ringkas: Total Peserta Unit, Dinyatakan Lulus (hijau), Tidak Lulus (merah), dan Belum Ditentukan.
  - Tabel master calon santri dengan filter keputusan kelulusan, filter pembayaran, dan pencarian.
  - Tombol aksi keputusan real-time per baris: **Lulus** (hijau), **Tidak Lulus** (merah), dan **Reset** (abu-abu).
  - Seketika memperbarui status di database dan state UI lokal, diiringi pop-up notifikasi pil hitam sukses di kanan atas.
- 🚀 **Routing & Verifikasi Build (`App.jsx`):**
  - Mendaftarkan rute: `/admin-portal/jadwal/input`, `/admin-portal/jadwal/monitoring`, `/admin-portal/jadwal`, dan `/admin-portal/keputusan`.
  - Build Vite production (`npm run build`) sukses 100% (156 modules transformed, waktu build ~696ms, zero errors).

### Session 35 — 15 Oktober 2026 (Refinement Form Input Jadwal, Modal Edit Persis RaportModals, dan Redesign Menarik Keputusan Seleksi)
- 📝 **Penyempurnaan Halaman Input Jadwal Seleksi (`AdminInputJadwal.jsx`):**
  - Dibuat murni hanya berisi satu formulir agenda seleksi tanpa elemen pengalih fokus:
    - Menghapus total bagian tab switcher unit di atas form.
    - Menghapus total tombol "Lihat di monitoring jadwal".
    - Menghapus total card samping "Sesi Terdaftar".
  - Gaya visual 100% mengikuti file acuan `InputHafalanPage.jsx` (`Tahfidz_MIS`):
    - Bar notifikasi info hijau tua dengan ikon `BiInfoCircle`.
    - Komponen `FormInput` dengan tinggi `h-[45px]`, label tebal `text-[#1a1a1a]`, dan border halus `border-slate-300`.
    - Pilihan unit masuk ke dalam input dropdown pertama form (`Pilih Unit Pendidikan`).
    - Tombol aksi di bawah: Reset (`bg-[#E53E3E]`), Simpan Jadwal (`bg-[#5294A9]`), dan Simpan & Siapkan WA (`bg-[#1B4332]`).
- 🗂️ **Penyempurnaan Monitoring Jadwal Seleksi (`AdminMonitoringJadwal.jsx`):**
  - Menghapus tombol "Tambah Jadwal Seleksi" dari halaman monitoring sesuai instruksi.
  - Merombak pop-up modal Edit dan Peserta agar identik 100% dengan gambar referensi (`RaportModals.jsx`):
    - `ModalWrapper` dengan sudut lengkung `rounded-[15px]`, garis pemisah hitam tebal `border-b border-black`, ikon `BiPencil`, dan tombol silang `&times;`.
    - Input form `ModalInput` menggunakan latar belakang abu-abu solid khas Risalah MIS (`bg-[#D9D9D9] border-none rounded-[4px]`).
    - Footer modal dibatasi garis hitam tebal `border-t border-black` dengan tombol persis gambar referensi:
      - **Simpan Saja:** `bg-[#5294A9] hover:bg-[#3e7283]` dengan ikon `BiSave`.
      - **Simpan & Kirim WA:** `bg-[#25D366] hover:bg-[#20bd5a]` dengan ikon `BiLogoWhatsapp`.
- 💎 **Redesign Eksekutif & Elegan Keputusan Seleksi (`AdminKeputusanSeleksi.jsx`):**
  - **Unit Switcher Modern:** Menggunakan sleek segment switcher pill dengan indikator jumlah pendaftar live per unit (e.g., `SD (3)`).
  - **4 Card Metrik Menarik & Mewah:**
    - **Total Peserta:** Gradien hijau emerald tua `from-[#1B4332] via-[#245942] to-[#122c21]` dengan ikon `BiGroup` dalam lingkaran glassmorphism dan ambient orb.
    - **Dinyatakan Lulus:** Gradien emerald cerah `from-emerald-600 via-emerald-700 to-teal-800` dengan persentase lolos kriteria.
    - **Tidak Lulus:** Gradien merah anggun `from-rose-600 via-rose-700 to-red-800`.
    - **Belum Ditentukan:** Gradien emas amber `from-amber-500 via-amber-600 to-yellow-700`.
  - **Desain 100% Responsif:** Menyesuaikan ukuran layar smartphone, tablet, maupun desktop layar lebar tanpa overflow berantakan.
- ⚡ **Verifikasi Build Vite Production:**
  - `npm run build` sukses 100% (161 modules transformed dalam 693ms, zero errors).

### Session 36 — 16 Oktober 2026 (Refinement Tombol Input Jadwal, Card Unit Mewah Keputusan Seleksi, Tabel Gaya Tahfidz_MIS Data Pendaftar & Dashboard, Serta Pop-Up Notifikasi Pil Sukses Modern)
- 📝 **Penyederhanaan Menu Input Jadwal Seleksi (`AdminInputJadwal.jsx`):**
  - Menghapus tombol "Simpan dan Siapkan WA" sesuai instruksi pengguna.
  - Form kini murni menyediakan 2 tombol aksi: **Reset** (`bg-[#E53E3E]`) dan **Simpan Data** (`bg-[#5294A9]`).
- 💎 **Redesign Mewah Unit Switcher Keputusan Seleksi (`AdminKeputusanSeleksi.jsx`):**
  - Mengubah baris tombol unit yang sebelumnya terkesan kosong menjadi **Grid 6 Unit Card Interaktif & Modern** (TPA, KB, TK, SD, SMP, SMA).
  - Setiap card menampilkan inisial unit, nama lengkap jenjang, badge jumlah calon santri *real-time* (e.g. `3 Siswa`), border aktif `#2ECC71`, shadow glow, dan tag status "Aktif".
- 📊 **Penyelarasan Tabel Data Pendaftar Gaya Tahfidz_MIS (`AdminPendaftarManager.jsx`):**
  - Membungkus tabel dalam Card Container putih dengan garis atas hijau zamrud khas Risalah MIS (`border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)]`).
  - Baris kontrol atas: Dropdown **Show [10/25/50] entries** di sebelah kiri, serta deretan filter Jenjang Unit, Status Pembayaran, Status Seleksi, dan Search Box di sebelah kanan.
  - Desain tabel bergaris hitam tegas (`border border-black`), header tebal berlatar putih, baris belang (`even:bg-[#f2f2f2] hover:bg-slate-100`), serta tombol aksi rapi (`Detail` `#5294A9` dan `Hapus` `#E74C3C`).
  - Kontrol navigasi bawah: Keterangan `Showing X to Y of Z entries` dan tombol pagination (`Prev`, nomor aktif biru `#007BFF`, `Next`).
- 🎨 **Peningkatan Estetika Dashboard Statistik (`AdminDashboard.jsx`):**
  - **4 Card Ringkasan Eksekutif Kaya Warna:**
    - **Total Pendaftar:** Gradien hijau tua `from-[#1B4332] via-[#245942] to-[#122c21]` dengan ikon bubble glassmorphism.
    - **Tagihan Lunas:** Gradien zamrud cerah `from-[#10B981] via-[#059669] to-[#047857]`.
    - **Menunggu Bayar:** Gradien amber hangat `from-[#F59E0B] via-[#D97706] to-[#B45309]`.
    - **Verifikasi Berkas:** Gradien indigo-ungu elegan `from-[#6366F1] via-[#4F46E5] to-[#3730A3]`.
  - **Tabel Rekapitulasi 6 Unit Pendidikan:** Ditingkatkan dengan Card border atas hijau `#2ECC71`, tabel bergaris hitam tegas (`border border-black`), baris belang, dan tombol aksi "Kelola" rapi.
- 🔔 **Standardisasi Notifikasi Pop-Up Sukses Mengambang (`SuccessNotification.jsx`):**
  - Mengadaptasi 100% gaya visual dari gambar tangkapan layar pengguna: Pil hitam mengambang horizontal di tengah atas layar (`bg-[#181818]/95 rounded-full px-6 py-3.5 shadow-2xl border border-white/10 backdrop-blur-md`), lingkaran hijau gelap bergaris zamrud cerah (`border-[1.5px] border-[#2ECC71] bg-[#123824]`) dengan ikon centang `BiCheck`, teks putih tegas, dan animasi *pop-wiggle*.
  - Terintegrasi di seluruh operasi CRUD Admin:
    - Input Jadwal Seleksi (Tambah Agenda Baru)
    - Monitoring Jadwal Seleksi (Simpan Perubahan & Hapus Jadwal)
    - Keputusan Seleksi (Penetapan Lulus, Tidak Lulus, atau Reset)
    - Master Data Pendaftar (Perubahan Status Berkas/Bayar/Seleksi & Hapus Santri)
    - Manajemen Unit & Gelombang (Simpan Unit, Tambah/Edit Gelombang, & Hapus Gelombang)
- ⚡ **Verifikasi Build Vite Production:**
  - `npm run build` sukses 100% (161 modules transformed dalam 725ms, zero errors).

### Session 37 — 16 Oktober 2026 (Card Unit Thematic Berwarna di Keputusan Seleksi, Card-Based Layout di Kelola Unit, Fitur Penuh CRUD Unit Pendidikan Dinamis, Serta Sinkronisasi Otomatis ke Landing Page & Seluruh Menu Admin)
- 🎨 **Card Unit Thematic Berwarna di Keputusan Seleksi (`AdminKeputusanSeleksi.jsx`):**
  - Mengubah tampilan unit card yang sebelumnya seragam menjadi **Thematic Color Palettes** yang kaya warna dan memanjakan mata:
    - **TPA:** Emerald-Teal (`from-[#0F5132] via-[#157347] to-[#198754]`)
    - **KB:** Warm Amber-Orange (`from-[#B45309] via-[#D97706] to-[#F59E0B]`)
    - **TK:** Sky Blue-Cyan (`from-[#0369A1] via-[#0284C7] to-[#38BDF8]`)
    - **SD:** Royal Blue-Indigo (`from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]`)
    - **SMP:** Vibrant Purple-Violet (`from-[#581C87] via-[#7C3AED] to-[#8B5CF6]`)
    - **SMA:** Crimson-Rose (`from-[#881337] via-[#BE123C] to-[#E11D48]`)
    - **Tahfidz / Custom Unit:** Deep Teal-Emerald atau Slate Modern.
  - Saat aktif, card memancarkan *ambient glow*, border tebal menyala dengan ring glow, badge "Aktif", dan pill pendaftar kontras; saat non-aktif memiliki latar pastel lembut dan ikon berwarna.
  - Daftar unit kini dibaca secara dinamis dari API backend (`/api/units/`).
- 🗂️ **Struktur Card Terpisah & Rapi di Kelola Unit & Gelombang (`AdminUnitManager.jsx`):**
  - **Header Card:** Menampung judul, tagline, tombol utama **`+ Tambah Unit Baru`** (`bg-[#2ECC71]`), serta tab switcher unit dinamis.
  - **Active Unit Overview Card (Banner):** Menampilkan nama unit aktif, kode slug, lokasi kampus, status Buka/Tutup, dan tombol aksi **`Hapus Unit Ini`** dengan peringatan konfirmasi.
  - **Card Bagian A (Identitas & Profil Lembaga):** Card putih bergaris atas hijau zamrud (`border-t-[5px] border-[#2ECC71]`) untuk form nama, kategori, lokasi, deskripsi singkat, dan profil lengkap.
  - **Card Bagian B (Persyaratan Berkas Digital):** Card putih bergaris atas teal (`border-t-[5px] border-[#5294A9]`) dengan counter butir berkas dan tombol tambah/hapus butir syarat dinamis.
  - **Card Bagian C (Manajemen Multi-Gelombang):** Card putih bergaris atas hijau zamrud (`border-t-[5px] border-[#2ECC71]`) dengan tombol `+ Buat Gelombang` dan card gelombang interaktif.
- 🚀 **Fitur Penuh CRUD Unit Pendidikan Dinamis (Create, Read, Update, Delete):**
  - **Backend API (`views.py` & `serializers.py`):**
    - Mengupgrade `UnitPendidikanListAPIView` menjadi `generics.ListCreateAPIView` (mendukung `POST /api/units/` untuk membuat unit baru dan otomatis membuatkan Gelombang 1 default aktif).
    - Mengupgrade `UnitPendidikanDetailAPIView` menjadi `generics.RetrieveUpdateDestroyAPIView` (mendukung `PATCH` dan `DELETE /api/units/<kode>/`).
  - **Modal Tambah Unit Baru:** Admin dapat menginput Nama Unit (e.g. *"Tahfidz Mentari Islamic School"*), Kode Singkat/Slug (*tahfidz*), Label Kategori (*TAHFIDZ*), Lokasi Kampus, Deskripsi Singkat, dan status aktif.
  - **Fitur Hapus Unit:** Tombol `Hapus Unit Ini` yang aman dengan konfirmasi dialog dan feedback notifikasi sukses.
- 🌐 **Sinkronisasi Otomatis ke Landing Page & Seluruh Modul Admin:**
  - **Landing Page (`Home.jsx`):** Unit baru (seperti Tahfidz) langsung tampil sebagai Card baru di landing page lengkap dengan auto-icon Al-Quran, dan filter bar kategori otomatis bertambah pill baru (`dynamicFilters`). Counter jenjang di hero section kini dinamis `{units.length}`.
  - **Monitoring Jadwal (`AdminMonitoringJadwal.jsx`):** Tab unit dan pilihan unit pada modal edit otomatis mencakup unit baru.
  - **Input Jadwal Seleksi (`AdminInputJadwal.jsx`):** Dropdown pilihan unit pendidikan otomatis memuat unit baru.
  - **Data Pendaftar (`AdminPendaftarManager.jsx`):** Dropdown filter unit pendidikan dinamis menyesuaikan seluruh unit yang tersimpan di database.
- ⚡ **Verifikasi Build & Django System Check:**
  - `npm run build`: 161 modules transformed dalam 797ms (0 error).
  - Django `manage.py check`: System check identified no issues (0 silenced).

### Session 38 — 16 Oktober 2026 (Penyederhanaan Pemilihan Unit dengan Dropdown di Monitoring Jadwal & Keputusan Seleksi, Serta Dropdown Pilihan Kampus Resmi di Kelola Unit)
- 🏫 **Dropdown Lokasi Kampus Resmi di Kelola Unit & Gelombang (`AdminUnitManager.jsx`):**
  - Mengganti input teks bebas pada field **Lokasi Kampus** (baik di Form Edit Unit Bagian A maupun Modal Tambah Unit Baru) menjadi dropdown `<select>` dengan 2 opsi resmi PKBM Mentari:
    1. `Kampus Utama PKBM Mentari (Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474)`
    2. `Kampus 2 (Perkiosan Tulung No. 259, Klaten 57482)`
  - Menghilangkan potensi salah ketik dan menjaga konsistensi data alamat kampus di seluruh sistem.
- 📋 **Dropdown Pemilihan Unit di Monitoring Jadwal Seleksi (`AdminMonitoringJadwal.jsx`):**
  - Mengganti baris tombol tab unit pendidikan menjadi card dropdown elegan bertuliskan *"Pilih Unit Pendidikan:"*.
  - Opsi dropdown memuat opsi "Semua Unit" dan seluruh unit dinamis dari database, disertai badge *"Unit Aktif"* di sisi kanan.
- 🎓 **Dropdown Pemilihan Unit di Keputusan Hasil Seleksi (`AdminKeputusanSeleksi.jsx`):**
  - Mengganti deretan grid card unit menjadi card selector dropdown interaktif *"Pilih Unit Pendidikan:"*.
  - Dropdown menampilkan label unit, nama lengkap unit, dan jumlah pendaftar real-time (contoh: `SD — Sekolah Dasar (12 Siswa)`), serta badge pill *"Unit Terpilih"* di sisi kanan.
- ⚡ **Verifikasi Build & Django System Check:**
  - `npm run build`: 161 modules transformed dalam 645ms (0 error).
  - Django `manage.py check`: System check identified no issues (0 silenced).

### Session 39 — 16 Oktober 2026 (Redesain Total Portal Siswa: Penampilan Nama Siswa di Navbar, Card Progres Berwarna, Aksi Cepat Menyeluruh di Beranda, Sinkronisasi Jadwal Seleksi Unit, & Fitur Edit Biodata Lengkap)
- 👤 **Nama Siswa di Navbar Siswa (`Topbar.jsx`):**
  - Mengganti teks statis *"Periode 2026/2027"* dengan badge nama siswa yang sedang login (`localStorage.getItem('user_name')`), lengkap dengan badge *"Siswa"* dan reactive listener `user_profile_updated` sehingga perubahan nama di biodata langsung otomatis ter-update di navbar tanpa reload.
- 🌟 **Redesain Menarik & Aksi Cepat di Beranda Dashboard (`BerandaDashboard.jsx`):**
  - **Executive Welcome Hero Card:** Background gradasi hijau zamrud mewah (`#1B4332` via `#245942` to `#122c21`) dengan no registrasi santri, badge unit, status pembayaran lunas, nama santri, dan tombol pintasan biodata.
  - **Progres Alur Pendaftaran Berwarna & Menarik:** Menggunakan card bergaris atas hijau zamrud (`border-t-[5px] border-[#2ECC71]`), persentase progress bar dinamis, serta 5 tahapan pendaftaran bertema warna kaya (Emerald, Blue, Amber, Purple, Rose) dengan status tag (Selesai, Aktif, Menunggu).
  - **Pintasan Aksi Cepat Menyeluruh (6 Menu):** Grid modern seperti pada portal admin yang menghubungkan ke seluruh modul siswa: *Biodata Santri*, *Unggah Berkas*, *Tagihan & Keuangan*, *Jadwal Seleksi*, *Hasil Seleksi*, dan *Pengaturan Akun*.
- 📅 **Sinkronisasi Jadwal Seleksi Unit & Empty State Ramah (`JadwalSeleksi.jsx` & Backend `views.py`):**
  - Backend `JadwalSeleksiAPIView` kini memfilter data secara cerdas: hanya menampilkan jadwal yang unitnya cocok dengan unit pendaftaran siswa (atau jadwal spesifik yang di-assign admin).
  - Jika admin belum mengatur jadwal seleksi untuk unit siswa tersebut, ditampilkan card status yang ramah dan jelas bertuliskan *"Jadwal Seleksi Belum Ditambahkan"*, disertai ringkasan identitas pendaftaran santri yang tetap sah.
  - Jika jadwal sudah diatur admin, ditampilkan card bergaris hijau zamrud dengan 3 tiles detail (Tanggal & Hari, Sesi & Waktu WIB, Lokasi Kampus) dan kartu ujian masuk resmi siap cetak (`window.print()`).
- 📝 **Fitur Edit Biodata Lengkap & Dokumen Berwarna (`BiodataDokumen.jsx` & Backend `views.py`):**
  - Backend `DashboardDataAPIView` diupgrade menjadi `generics.RetrieveUpdateAPIView` (mendukung `PATCH /api/dashboard-data/`) dan menyinkronkan `nama_lengkap` ke `User.first_name`.
  - Siswa kini dapat mengedit biodata secara mandiri melalui tombol *"Edit Biodata"* (Data Calon Santri, Alamat & Kontak WhatsApp Wali, Data Orang Tua Ayah & Ibu, serta Data Periodik).
  - Form dilengkapi tombol *"Simpan Perubahan Biodata"* dengan pop-up notifikasi sukses yang cantik.
  - Tampilan upload dokumen digital (Foto 3x4, KK, Akta, Ijazah) dipercantik dengan border aksen berwarna, status badge verifikasi jelas, dan tombol aksi yang nyaman.
- ⚡ **Verifikasi Build & Django System Check:**
  - `npm run build`: 161 modules transformed dalam 1.27s (0 errors).
  - Django `manage.py check`: System check identified no issues (0 silenced).

### Yang Belum / Perlu Dikerjakan:
- [x] **Autentikasi Siswa & Login API** — Endpoint JWT untuk login calon santri & admin
- [x] **Upload Berkas API** — Simpan foto/KK/akta ke media storage & endpoint PATCH
- [x] **Cek kelulusan & Status API** — Endpoint verifikasi status pendaftaran via dashboard data
- [x] **Integrasi Pembayaran QRIS BRI Sandbox** — Auto-generate tagihan & QRIS MPM SNAP BI, verifikasi status lunas otomatis
- [x] **Logika Multi-Gelombang & Unit Dinamis (Tahap 1)** — Model UnitPendidikan & GelombangPendaftaran, auto-seed 6 unit, sinkronisasi real-time ke landing page
- [x] **Dashboard Admin React Kustom & Kelola Status Pembayaran/Pendaftar (Tahap 2)** — Antarmuka lengkap /admin-portal, manajemen unit, multi-gelombang, dan master data pendaftar
- [x] **Penyeragaman Desain UI & Modul Jadwal Seleksi** — Topbar hijau cerah 100% seragam dengan portal siswa, sidebar rapi
- [x] **Spesifikasi Web Risalah MIS (Session 34 & 35)** — Form murni InputHafalanPage, modal edit & peserta persis referensi RaportModals, card metrik mewah dan unit switcher cerdas
- [x] **Penyelarasan Lengkap Gaya Tahfidz_MIS & Notifikasi Pil Modern (Session 36)** — Tabel bergaris hitam tegas, Show entries, pagination, card gradien eksekutif, serta pop-up sukses di semua aksi CRUD
- [x] **CRUD Penuh Unit Pendidikan & Thematic Color Cards (Session 37)** — Fitur tambah, edit, hapus unit pendidikan, auto card di landing page, card unit warna-warni di keputusan seleksi, dan layout card jelas di kelola unit
- [x] **Dropdown Kampus Resmi & Dropdown Unit Selector (Session 38)** — Dropdown 2 lokasi kampus resmi di kelola unit, dropdown pemilihan unit di monitoring jadwal dan keputusan seleksi
- [x] **Redesain Total Portal Siswa & Fitur Edit Biodata (Session 39)** — Nama siswa di navbar, alur progres pendaftaran berwarna, aksi cepat beranda, jadwal seleksi unit dinamis, dan form edit biodata siswa
- [ ] **Notifikasi WA Gateway** — Integrasi webhook / WhatsApp API
- [ ] **SEO & Meta Tags** — Belum ditambahkan
- [ ] **Hapus file legacy** — UnitPendidikan.jsx, AlurPendaftaran.jsx, TentangKami.jsx bisa dihapus jika sudah tidak perlu

### Catatan Teknis:
- Tailwind CSS menggunakan **versi 4** (bukan v3). Konfigurasi warna ada di `src/index.css` bukan `tailwind.config.js`
- React Query sudah disetup di `App.jsx` tapi belum digunakan. Siap pakai saat koneksi ke API
- Navbar offset = **72px** untuk compensate sticky navbar height
- Split-screen pages (Login & CekKelulusan) **tidak menggunakan MainLayout** — langsung render tanpa Navbar/Footer
- Admin login diarahkan ke `/admin-portal`, sedangkan siswa diarahkan ke `/dashboard`

---

*File ini akan terus diupdate seiring perkembangan project.*





---

### Session 40 - 5 November 2026 (Restrukturisasi Arsitektur .env Terpusat & Sinkronisasi Komunikasi Frontend-Backend Sesuai Standar e-ujian)

**Latar Belakang & Masalah:**
1. Backend `Pendaftaran_MIS` dijalankan pada port `8001` (`python manage.py runserver 0.0.0.0:8001`) karena port default 8000 mengalami restriksi permission / sedang diduduki proses lain di Windows.
2. Seluruh pemanggilan API pada 18 file komponen Frontend sebelumnya di-hardcode ke `http://localhost:8000/api/`.
3. Akibatnya, saat pengguna mengakses portal frontend (baik via `localhost` maupun IP LAN `192.168.1.74:5173`) dan menekan tombol *Masuk ke Portal*, request login terputus (connection refused ke port 8000) sehingga tombol terasa tidak ada reaksi sama sekali.

**Pembaruan & Implementasi Teknis (Mengacu Struktur e-ujian):**
1. **Konfigurasi Environment Backend (`Pendaftaran_MIS/Backend/`):**
   - Membuat file `.env` dan template `.env.example`:
     - `DEBUG=True`
     - `ALLOWED_HOSTS=*` (atau `localhost,127.0.0.1,0.0.0.0,192.168.1.74`)
     - `CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,http://192.168.1.74:5173,...`
     - `CSRF_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,http://192.168.1.74:5173,...`
   - Memperbarui `core/settings.py` dengan `dotenv.load_dotenv(BASE_DIR / '.env')` untuk memuat variabel konfigurasi, hosts, dan CORS secara dinamis.
   - Menambahkan dependensi `python-dotenv>=1.0.0` pada `requirements.txt`.

2. **Konfigurasi Environment Frontend (`Pendaftaran_MIS/Frontend/`):**
   - Membuat file `.env` dan `.env.example`:
     - `VITE_API_BASE_URL=http://localhost:8001/api`
   - Membuat modul sentral `src/api/axiosInstance.js` yang menyediakan:
     - `getBaseApiUrl()`: Mengambil URL API dari `.env` dengan fitur cerdas *smart host replacement* (jika web dibuka via IP LAN seperti `192.168.1.74`, hostname otomatis diselaraskan).
     - `getBackendOrigin()`: Mengambil root host backend untuk tautan file dokumen/media dan Django Admin (`/admin/`).
     - `axiosInstance`: Klien Axios terkonfigurasi dengan interceptor JWT token Authorization dan penanganan error 401.

3. **Migrasi Menyeluruh 18 File Frontend (Zero Hardcoded URLs):**
   - Menghapus 100% string hardcoded `http://localhost:8000` pada seluruh halaman:
     - `src/pages/landingpage/LoginPeserta.jsx`
     - `src/pages/landingpage/Home.jsx`
     - `src/pages/landingpage/DetailUnit.jsx`
     - `src/pages/landingpage/FormDaftarAwal.jsx`
     - `src/pages/landingpage/TagihanPembayaran.jsx`
     - `src/pages/dashboard/AdminPortal.jsx`
     - `src/pages/dashboard/BerandaDashboard.jsx`
     - `src/pages/dashboard/BiodataDokumen.jsx`
     - `src/pages/dashboard/HasilSeleksi.jsx`
     - `src/pages/dashboard/JadwalSeleksi.jsx`
     - `src/pages/dashboard/TagihanKeuangan.jsx`
     - `src/pages/admin/AdminDashboard.jsx`
     - `src/pages/admin/AdminInputJadwal.jsx`
     - `src/pages/admin/AdminJadwalManager.jsx`
     - `src/pages/admin/AdminKeputusanSeleksi.jsx`
     - `src/pages/admin/AdminMonitoringJadwal.jsx`
     - `src/pages/admin/AdminPendaftarManager.jsx`
     - `src/pages/admin/AdminUnitManager.jsx`
   - Seluruh pemanggilan diganti menggunakan helper sentral `getBaseApiUrl()` dan `getBackendOrigin()`.

4. **Kesiapan Workflow Git & Production (Local vs VPS):**
   - File `.env` sudah terlindungi di `.gitignore`, sehingga saat push/pull di GitHub, konfigurasi environment server production tidak akan pernah tertimpa.
   - Saat deploy ke server production VPS, cukup isi `.env` frontend dengan domain resmi (misal `https://ppdb.mentariku.org/api`), dan seluruh aplikasi langsung berfungsi tanpa perlu mengedit satu pun baris kode program.

5. **Verifikasi Build:**
   - Menjalankan `npm run build` pada frontend: Berhasil 100% tanpa error (`built in 582ms`).
   - Verifikasi sintaks `settings.py`: Berhasil dan valid (`py_compile`).

- **Tambahan Fix (Zero-Dependency .env Loader):** Menambahkan blok `try-except ImportError` pada `core/settings.py` sehingga pembacaan file `.env` memiliki native fallback otomatis tanpa wajib menginstall package `python-dotenv` di dalam virtualenv.

- **Pembersihan Elemen Dummy Form Login:** Menghapus checkbox *Ingat Saya* dan tombol tautan *Lupa Password?* pada halaman login portal calon siswa (`Frontend/src/pages/landingpage/LoginPeserta.jsx`), serta merapikan spacing tombol *Masuk ke Portal*.

---

### Session 41 - 6 November 2026 (Pembaruan Favicon & Logo Tab Browser Web Pendaftaran MIS)

**Latar Belakang & Masalah:**
1. Tab browser pada halaman web Pendaftaran MIS (`http://192.168.1.74:5173/`) masih menampilkan icon bawaan Vite (ikon petir ungu `#863bff`), belum menggunakan identitas resmi sekolah.
2. File konfigurasi `index.html` sebelumnya mengarah ke `/logo-pkbm.png`, namun file tersebut berada di direktori aset `src/assets/logo-pkbm.png` dan belum disinkronkan ke root `public/`, sehingga browser gagal memuat favicon dan melakukan fallback ke icon Vite default yang tersimpan di `public/favicon.svg`.

**Perubahan yang Dilakukan:**
1. **Pembaruan `Frontend/index.html`:**
   - Menghubungkan favicon langsung ke file aset Vite:
     ```html
     <link rel="icon" href="/src/assets/logo-pkbm.png?v=2" />
     <link rel="alternate icon" href="/logo-pkbm.png?v=2" />
     <link rel="apple-touch-icon" href="/src/assets/logo-pkbm.png?v=2" />
     ```
   - Menambahkan cache-buster `?v=2` agar browser langsung memperbarui favicon tanpa tertahan cache lama.
2. **Pembaruan `Frontend/public/favicon.svg`:**
   - Mengganti file bawaan Vite dengan SVG identitas Mentari Islamic School bernuansa hijau emerald (`#1B4332`), aksen hijau cerah (`#2ECC71`), dan emas (`#F1C40F`) sebagai proteksi fallback icon browser modern.
3. **Penyediaan Panduan Sinkronisasi Terminal:**
   - Memberikan perintah copy file ke user untuk menyalin `logo-pkbm.png` ke folder `public/` agar kedua skenario URL (bundler Vite maupun static root direct link) terlayani optimal.

---

### Session 42 - 6 November 2026 (Implementasi Penuh Arsitektur Berkas Pendaftaran Dinamis: Upload Awal di Landing Page + Monitoring & Verifikasi di Portal Siswa & Admin)

**Latar Belakang & Kebutuhan Klien:**
1. Klien mengajukan permohonan spesifikasi agar calon santri dapat mengunggah berkas persyaratan langsung pada saat mengisi formulir pendaftaran awal di web landing page (`/daftar/:unit`), dengan ketentuan dokumen yang berbeda antar jenjang:
   - **PAUD, TK & SD:** Mengunggah Akta Kelahiran dan Kartu Keluarga (KK).
   - **SMP & SMA:** Mengunggah Akta Kelahiran, KK, Ijazah/SKL Terakhir, dan Rapor Terakhir.
2. Di sistem sebelumnya, persyaratan berkas dipukul rata untuk semua jenjang tanpa fleksibilitas, dan hanya terdapat di dashboard siswa setelah login tanpa ada kotak upload di formulir pendaftaran awal.
3. Dirancanglah **The Golden Flow PPDB**: Upload awal saat registrasi di landing page, dipadukan dengan portal siswa sebagai pusat pemantauan status berkas dan sarana mengunggah ulang jika terdapat catatan panitia (*Perlu Perbaikan*).

**Pembaruan & Implementasi Teknis Menyeluruh:**

1. **Backend Django (`Pendaftaran_MIS/Backend/`):**
   - **Model `UnitPendidikan` (`ppdb/models.py`):**
     - Menambahkan fungsi default `default_berkas_pendaftaran()` yang memuat status aktif dan status wajib/opsional untuk 5 dokumen inti: `akta`, `kk`, `ijazah`, `raport`, `foto`.
     - Menambahkan kolom `berkas_pendaftaran = models.JSONField(default=default_berkas_pendaftaran, blank=True)` sebagai *Single Source of Truth* konfigurasi dokumen per unit.
   - **Model `Pendaftar` (`ppdb/models.py`):**
     - Menambahkan kolom file baru: `file_raport = models.FileField(upload_to='dokumen/', blank=True, null=True)`.
   - **Serializers (`ppdb/serializers.py`):**
     - Memperbarui `UnitPendidikanSerializer` dengan field `berkas_pendaftaran = serializers.JSONField(required=False)`.
     - Memperbarui `PendaftarSerializer.to_internal_value()` agar mengabaikan field file yang bernilai string kosong/null/undefined saat parsing data multipart.
   - **Views (`ppdb/views.py`):**
     - Menambahkan `MultiPartParser, FormParser, JSONParser` pada `PendaftarCreateAPIView` sehingga endpoint registrasi awal dapat menerima data teks sekaligus berkas fisik dokumen secara serentak.
     - Menyinkronkan status dokumen pendaftar menjadi `MENUNGGU VERIFIKASI` jika terdapat berkas yang diunggah saat registrasi awal.

2. **Frontend Admin: Kelola Unit & Gelombang (`AdminUnitManager.jsx`):**
   - Merapikan struktur kontrol unit menjadi 4 bagian teratur:
     - **Bagian A:** Identitas & Profil Lembaga.
     - **Bagian B:** Informasi Syarat Pendaftaran (Teks Bullet Points untuk Landing Page / Detail Unit).
     - **Bagian C (Baru):** Pengaturan Berkas Form Pendaftaran (Upload Digital Calon Santri) lengkap dengan saklar toggle Aktif/Nonaktif dan pill status *Wajib Diisi (Required)* vs *Opsional (Bisa Menyusul)*.
     - **Tombol Pintas Cerdas (Quick Preset):** Tombol *⚡ Preset PAUD/SD* (Akta & KK Wajib) dan *⚡ Preset SMP/SMA* (Akta, KK, Ijazah & Rapor Wajib).
     - **Bagian D:** Gelombang Pendaftaran & Biaya Registrasi.

3. **Frontend Calon Siswa: Formulir Pendaftaran Awal (`FormDaftarAwal.jsx`):**
   - Menambahkan pemanggilan API otomatis ke konfigurasi berkas unit yang sedang dipilih.
   - Menambahkan **Bagian D: Unggah Berkas Persyaratan Digital** di bawah data periodik:
     - Menampilkan kotak upload hanya untuk dokumen yang diaktifkan oleh admin pada unit tersebut.
     - Pratinjau nama file terpilih, ukuran kilobyte, dan tombol batal/hapus file.
     - Validasi otomatis dokumen yang berstatus wajib sebelum formulir dikirimkan.
     - Pengiriman payload menggunakan format `FormData` (`multipart/form-data`).

4. **Frontend Portal Siswa: Pusat Monitoring & Perbaikan Berkas (`BiodataDokumen.jsx`):**
   - Mengubah kartu berkas menjadi dinamis sesuai jenjang unit santri (Ijazah & Rapor otomatis disembunyikan untuk jenjang PAUD/SD/TK).
   - Menambahkan dukungan dokumen `file_raport`.
   - Menambahkan banner peringatan interaktif jika status dokumen diubah admin menjadi `PERLU PERBAIKAN`, lengkap dengan instruksi perbaikan dan tombol *Ganti Dokumen* yang siap dipakai.

5. **Frontend Admin: Verifikasi Data Pendaftar (`AdminPendaftarManager.jsx`):**
   - Menambahkan kartu pratinjau **Rapor Terakhir** pada Tab 3 (Berkas & Kelulusan) modal detail pendaftar, sejajar dengan KK, Akta, Pas Foto, dan Ijazah.



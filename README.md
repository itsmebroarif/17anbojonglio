# 🇲🇨 17an Arena — Modern Live Competition Management & Stage Board System

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue.js-3.5%2B-emerald.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Miniature-slate.svg)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-Animation-green.svg)](https://greensock.com/gsap/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Community-amber.svg)](#-open-source--contribution-guidelines)

**17an Arena** adalah sistem manajemen perlombaan, papan skor panggung live (*Live Competition Board*), dan denah 3D miniatur arena interaktif yang dirancang khusus untuk mempermudah panitia dalam mengelola seluruh rangkaian kegiatan Lomba Peringatan Hari Ulang Tahun Kemerdekaan Republik Indonesia (HUT RI), turnamen komunitas, maupun event panggung kemerdekaan di tingkat RT/RW, sekolah, kampus, dan organisasi.

Aplikasi ini bersifat **100% Open Source**, responsif, cepat, dan *offline-first* dengan dukungan ekspor/impor data lokal secara aman.

---

## 📋 Daftar Isi (Table of Contents)

1. [Fitur Utama & Modul Sistem](#-fitur-utama--modul-sistem)
2. [Arsitektur & Teknologi (Tech Stack)](#-arsitektur--teknologi-tech-stack)
3. [Visualisasi 3D Miniatur Arena](#-visualisasi-3d-miniatur-arena)
4. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
5. [Skema Data & Type Definitions](#-skema-data--type-definitions)
6. [Panduan Instalasi & Pengoperasian](#-panduan-instalasi--pengoperasian)
7. [Panduan Open Source & Kontribusi](#-open-source--contribution-guidelines)
8. [Lisensi & Hak Cipta](#-lisensi)

---

## 🌟 Fitur Utama & Modul Sistem

Sistem **17an Arena** dilengkapi dengan modul-modul komprehensif yang saling terintegrasi secara otomatis:

### 1. 📊 Dashboard Utama & Analytics
* **Metrik Real-time**: Menampilkan jumlah perlombaan, total peserta terdaftar, pemenang podium, dan sertifikat yang telah diterbitkan.
* **Grafik Pendaftaran Peserta**: Visualisasi distribusi peserta berdasarkan kategori lomba dan gender menggunakan Recharts.
* **Integrasi Quick Action**: Akses cepat ke pendaftaran, panggil lounge, penandaan pemenang, dan ekspor data JSON/Excel.

### 2. 🧊 Peta Arena Lapangan 3D (Live Interactive Miniature)
* **Three.js & GSAP 3D Canvas**: Visualisasi 3D miniatur lokasi arena lomba dengan tiang bendera Sang Saka Merah Putih yang berkibar, panggung penceramah/juri, dan tenda registrasi.
* **Kamera GSAP Smooth Orbit**: Efek transisi pemfokusan kamera secara mulus (*smooth pan & zoom*) saat memilih **Zone A (Lapangan Utama)**, **Zone B (Panggung Panitia)**, atau **Zone C (Area Registrasi)**.
* **Hotspot Pins Projector**: Pin status interaktif yang terproyeksi dari koordinat 3D ke layar HTML secara presisi.
* **Multi-View Switcher**: Opsi pergantian tampilan antara **Miniatur 3D**, **Denah 2D Blueprint**, dan **Kartu Zona Lomba**.

### 3. 📢 Waiting Lounge & Panggil Peserta Live
* **Antrean Panggil Peserta**: Pengelolaan status peserta secara *live* (*Waiting* ➔ *Called* ➔ *Ready* ➔ *Playing* ➔ *Finished*).
* **Fitur Audio Announcer**: Notifikasi suara otomatis saat panitia memanggil nomor urut dan nama peserta ke panggung/arena.
* **Filter Per Lomba**: Kemudahan panitia arena untuk memantau peserta yang sedang bertanding di lapangan tertentu.

### 4. 📺 Competition Board (Layar Panggung / LED Display)
* **Papan Skor Panggung Utama**: Tampilan visual besar yang siap dihubungkan ke proyektor atau TV LED panggung.
* **Real-time Live Timer & Round Indicator**: Penghitung waktu mundur pertandingan, ronde berjalan, serta daftar peserta aktif bertanding.
* **Modal Cetak Jadwal & QR Code**: Fitur pencetakan jadwal resmi lomba beserta QR Code verifikasi.

### 5. 🏆 Penilaian Juri & Leaderboard Otomatis
* **Multi-Kriteria Skor**: Sistem masukan nilai untuk juri dengan pembobotan kriteria yang dapat disesuaikan.
* **Kalkulasi & Ranking Otomatis**: Penentuan juara 1, 2, dan 3 secara otomatis dengan pencegahan konflik skor seimbang (*tie-breaker*).
* **Penetapan Pemenang Direct-to-Podium**: Kirim hasil juara langsung ke Hall of Fame & sertifikat.

### 6. 🥇 Hall of Fame & Generator Sertifikat Digital
* **Podium Visual Pemenang**: Halaman khusus perayaan para pemenang dengan animasi konfeti (*Canvas Confetti*).
* **Generator Sertifikat Otomatis**: Desain sertifikat penghargaan siap cetak dan diunduh dalam format PDF/Gambar (`jspdf` & `html2canvas`).
* **Sistem QR Verifikasi**: Setiap sertifikat dilengkapi QR Code unik untuk validasi keaslian dokumen.

### 7. 🎖️ Resulting Point Standings (Juara Umum)
* **Akumulasi Poin Klasemen**: Klasemen umum antar RT/RW/Dusun/Kontingen berdasarkan perolehan medali (Emas = 5pt, Perak = 3pt, Perunggu = 1pt).
* **Leaderboard Kontingen**: Menentukan pemenang **Juara Umum Kemerdekaan** secara objektif dan transparan.

### 8. 🤖 AI Panitia Assistant (Google Gemini API)
* **Asisten AI Terintegrasi**: Membantu panitia membuat teks pengumuman, susunan acara (*rundown*), peraturan lomba, hingga naskah sambutan ketua panitia secara instan.

### 9. 📱 WhatsApp Bulk Broadcast & Integrasi Informasi
* **Broadcast Massal**: Kirim pesan pengumuman jadwal atau panggilan peserta langsung ke WhatsApp tanpa perlu menyimpan nomor.

### 10. 💾 Import / Export & Backup Management
* **SheetJS Integration**: Impor data peserta massal melalui file Excel (`.xlsx` / `.csv`).
* **Full JSON Backup & Restore**: Amankan seluruh database lokal kapan saja dengan satu klik.

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

Sistem ini dibangun mengusung arsitektur **Single Page Application (SPA)** berbasis **Vue 3 TypeScript** yang responsif dan ringan:

| Layer / Modul | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | `Vue 3.5+` (Composition API) | Framework UI reaktif modern dengan `<script setup>` |
| **State Management** | `Pinia` | Store terpusat dengan persistence ke LocalStorage |
| **Language** | `TypeScript 5.8` | Pengembangan berbasis *strongly-typed code* |
| **3D Rendering** | `Three.js` | Engine grafis WebGL untuk miniatur arena 3D |
| **Animation Engine** | `GSAP` (GreenSock) | Animasi pergerakan kamera 3D & transisi UI |
| **CSS & Design** | `Tailwind CSS v4` + `Bootstrap Icons` | Styling utility-first modern dan ikonografi lengkap |
| **Charts & Graphics** | `Recharts` + `Canvas Confetti` | Chart pendaftaran peserta & visual perayaan |
| **Document Export** | `jsPDF` + `html2canvas` + `SheetJS` | Generator PDF sertifikat dan ekspor Excel |
| **Backend / Dev Server** | `Express.js` + `tsx` / `Vite` | Node.js backend server & middleware proxy |
| **AI Integration** | `@google/genai` (Gemini API) | Generasi teks & asisten panitia pintar |

---

## 🧊 Visualisasi 3D Miniatur Arena

Komponen `ArenaFloorPlan.vue` menggunakan **Three.js** dan **GSAP** untuk menghadirkan pengalaman visual 3D miniatur arena:

* **Panggung & Backdrop (Zone B)**: Dibuat dengan geometri terintegrasi yang memiliki karpet merah (*crimson red stage*), piala di podium, dan lampu sorot (*spotlight*).
* **Lapangan Utama (Zone A)**: Lapangan rumput hijau (*emerald green*) lengkap dengan garis batas putih dan tiang umbul-umbul Merah Putih.
* **Area Registrasi (Zone C)**: Tenda marquee biru dengan meja pendaftaran dan kursi.
* **Tiang Bendera Sang Saka Merah Putih**: Bendera yang mengibar dengan animasi sinus gelombang yang halus (*GSAP waving animation*).
* **Kamera GSAP Interaktif**: Klik tombol **Zone A**, **Zone B**, atau **Zone C** untuk menggerakkan posisi kamera (`camera.position`) dan fokus sudut pandang (`camera.lookAt`) secara otomatis dengan *easing curve*.

---

## 📁 Struktur Direktori Proyek

```
17an-arena/
├── index.html                      # Entry point HTML utama
├── package.json                    # Dependensi & skrip aplikasi
├── server.ts                       # Server Express backend & Vite middleware
├── vite.config.ts                  # Konfigurasi Vite & Vue plugin
├── tsconfig.json                   # Konfigurasi TypeScript compiler
├── public/                         # Aset statis & gambar
├── src/
│   ├── main.tsx                    # Inisialisasi Vue app & Pinia
│   ├── App.vue                     # Component root aplikasi
│   ├── index.css                   # Tailwind CSS v4 directives
│   ├── types.ts                    # Interface & Type Definitions global
│   ├── stores/
│   │   └── arenaStore.ts           # Pinia Store utama (state management & storage)
│   ├── components/
│   │   ├── ArenaFloorPlan.vue      # Peta Miniatur Arena 3D (Three.js + GSAP)
│   │   ├── Navbar.vue              # Navigation Bar & Running Text Kemerdekaan
│   │   ├── Sidebar.vue             # Sidebar Menu Utama
│   │   ├── GeminiChatModal.vue     # Modal Asisten AI Panitia
│   │   ├── BulkWhatsAppModal.vue   # Modal Broadcast WhatsApp
│   │   ├── GlobalSearchModal.vue   # Pencarian Cepat (Ctrl+K)
│   │   ├── PrintPreviewModal.vue   # Modal Cetak Jadwal & QR Code
│   │   ├── SpreadsheetWizard.vue   # Wizard Impor Excel Peserta
│   │   └── RechartsRegistrationChart.tsx # Visualisasi Chart Recharts
│   └── pages/
│       ├── Dashboard.vue           # Ringkasan Statistik & Status Arena
│       ├── Registration.vue        # Manajemen Pendaftaran Peserta
│       ├── Competitions.vue        # Pengaturan Cabang Lomba
│       ├── WaitingLounge.vue       # Lounge Antrean & Panggil Peserta Live
│       ├── Scoring.vue             # Penilaian Juri & Papan Skor
│       ├── CompetitionBoard.vue    # Layar Panggung LED Competition Board
│       ├── Results.vue             # Daftar Pemenang Lomba
│       ├── HallOfFame.vue          # Podium Juara & Konfeti
│       ├── Certificates.vue        # Generator & Cetak Sertifikat Digital
│       ├── ResultingPoint.vue      # Klasemen Poin Juara Umum (Kontingen)
│       ├── ImportExport.vue        # Backup JSON & Impor Excel
│       └── Settings.vue            # Pengaturan Sistem & Kriteria
└── README.md                       # Dokumentasi Proyek
```

---

## 📄 Skema Data & Type Definitions

Seluruh struktur data dalam sistem telah ditipe secara eksplisit pada `/src/types.ts`:

```typescript
// Cabang Lomba
export interface Competition {
  id: string;
  prefix: string;          // Contoh: 'LMB-01'
  name: string;            // Contoh: 'Lomba Makan Kerupuk'
  category: string;        // 'Anak-Anak' | 'Dewasa' | 'Umum'
  status: 'Upcoming' | 'Ongoing' | 'Finished';
  location: string;        // Contoh: 'Lapangan Utama A1'
  date: string;
  time: string;
  rules?: string[];
}

// Peserta
export interface Participant {
  id: string;
  name: string;
  nikOrId?: string;
  gender: 'L' | 'P';
  age: number;
  rtRw: string;            // Contoh: 'RT 03 / RW 05'
  phone: string;
}

// Registrasi & Antrean
export interface Registration {
  id: string;
  participantId: string;
  competitionId: string;
  participantNumber: string; // Contoh: 'MK-001'
  status: 'Waiting' | 'Called' | 'Ready' | 'Playing' | 'Finished';
  score?: number;
}
```

---

## 🚀 Panduan Instalasi & Pengoperasian

### Prasyarat System
* **Node.js**: v18.0.0 atau versi yang lebih baru.
* **npm**: v9.0.0 atau yang lebih baru.

### Langkah-Langkah Instalasi

1. **Clone Repository**:
   ```bash
   git clone https://github.com/your-username/17an-arena.git
   cd 17an-arena
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui browser pada alamat: `http://localhost:3000`

4. **Pemeriksaan Type & Linting**:
   ```bash
   npm run lint
   ```

5. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

6. **Jalankan Server Produksi**:
   ```bash
   npm run start
   ```

---

## 🤝 Open Source & Contribution Guidelines

Project ini berprinsip **100% Open Source & Community-Driven**. Siapa saja berhak untuk menggunakan, memodifikasi, memperbarui, maupun menambahkan fitur baru demi kesuksesan perayaan HUT Kemerdekaan RI di seluruh nusantara.

### Cara Berkontribusi:
1. **Fork** repository ini ke akun GitHub Anda.
2. Buat *feature branch* baru:
   ```bash
   git checkout -b feature/FiturBaruKeren
   ```
3. Lakukan *commit* terhadap perubahan Anda:
   ```bash
   git commit -m "feat: Menambahkan fitur ekspor rekap nilai PDF"
   ```
4. Push ke branch Anda:
   ```bash
   git push origin feature/FiturBaruKeren
   ```
5. Buat **Pull Request (PR)** baru dengan penjelasan yang rinci mengenai perubahan yang Anda lakukan.

### Ide Pengembangan Fitur Mendatang (Roadmap):
* [ ] Integrasi WebSockets untuk Sinkronisasi Panggil Peserta Multi-Device secara *Real-time*.
* [ ] Tambahan Model 3D Avatar Peserta yang lebih mendetail menggunakan format GLTF/GLB.
* [ ] Modul Cetak ID Card / Name Tag Peserta dengan Barcode Scanner.
* [ ] Integrasi Pembacaan Skor Otomatis menggunakan Sensor Stopwatch / Timer Digital.

---

## 📜 Lisensi

Aplikasi **17an Arena** dilisensikan di bawah [MIT License](LICENSE). Anda bebas menggunakannya untuk kegiatan karang taruna, sekolah, organisasi swasta, maupun instansi pemerintah tanpa dipungut biaya.

---

<p center>
  Made with ❤️ for Indonesia 🇮🇩 | <strong>Dirgahayu Republik Indonesia! Merdeka!</strong>
</p>

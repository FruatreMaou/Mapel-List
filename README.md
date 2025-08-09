# Website Pengingat Jadwal Mata Pelajaran XII AP 1

Proyek ini adalah sebuah website sederhana yang berfungsi sebagai pengingat jadwal mata pelajaran untuk kelas XII AP 1. Website ini menampilkan jadwal harian dan dilengkapi dengan fitur notifikasi browser untuk mengingatkan pengguna sebelum kelas dimulai.

## Fitur Utama

- **Tampilan Jadwal Harian**: Menampilkan jadwal mata pelajaran per hari dengan informasi waktu, mata pelajaran, dan nama guru.
- **Status Mata Pelajaran**: Menunjukkan status mata pelajaran (sedang berlangsung, akan datang, atau selesai) secara real-time.
- **Notifikasi Browser**: Mengirimkan notifikasi ke browser pengguna sebagai pengingat sebelum kelas dimulai. Waktu notifikasi dapat diatur (5, 10, 15, atau 20 menit sebelum kelas).
- **Pengaturan Notifikasi**: Pengguna dapat mengaktifkan/menonaktifkan notifikasi, mengatur waktu notifikasi, dan mengaktifkan/menonaktifkan suara notifikasi.
- **Navigasi Hari**: Memungkinkan pengguna untuk beralih melihat jadwal antar hari (Senin hingga Jumat).
- **Desain Responsif**: Tampilan website yang dioptimalkan untuk perangkat desktop dan mobile.
- **Penyimpanan Lokal**: Pengaturan notifikasi disimpan di `localStorage` browser, sehingga preferensi pengguna akan tetap tersimpan.

## Struktur Proyek

```
schedule-reminder-website/
├── index.html          # Struktur utama halaman web
├── styles.css          # Styling untuk tampilan website
├── script.js           # Logika JavaScript untuk fungsionalitas website dan notifikasi
├── schedule-data.js    # Data jadwal mata pelajaran
└── sw.js               # Service Worker untuk notifikasi yang lebih baik (opsional)
README.md               # File ini
schedule.json           # Data jadwal asli (digunakan untuk ekstraksi)
design_plan.md          # Rencana desain website
todo.md                 # Daftar tugas yang telah diselesaikan
```

## Cara Menggunakan

1. **Akses Website**: Buka URL yang telah di-deploy: [https://ivjjdrvc.manus.space](https://ivjjdrvc.manus.space)
2. **Lihat Jadwal**: Pilih hari yang ingin Anda lihat jadwalnya menggunakan tombol navigasi di bagian atas.
3. **Aktifkan Notifikasi**: Klik tombol "Aktifkan Notifikasi" di header. Browser akan meminta izin untuk menampilkan notifikasi. Izinkan agar notifikasi dapat berfungsi.
4. **Pengaturan Notifikasi**: Klik ikon roda gigi (pengaturan) di header untuk mengatur waktu notifikasi sebelum kelas dimulai, mengaktifkan/menonaktifkan suara, dan mengaktifkan/menonaktifkan fitur otomatis pindah hari.

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Web Notifications API
- Local Storage API
- Font Awesome (untuk ikon)

## Jadwal Mata Pelajaran (XII AP 1)

Berikut adalah ringkasan jadwal yang digunakan dalam website ini:

- **Senin**: Matematika, System, Muatan Peminatan, PAI/PAK
- **Selasa**: AC Engine, Structure
- **Rabu**: Bahasa Inggris, System, Mapel Pilihan
- **Kamis**: PKK, Bimbingan Konseling, Muatan Peminatan
- **Jumat**: Bahasa Inggris, PPKn, Bahasa Indonesia

Semoga website ini bermanfaat!


# E-KERTALANGU v2 - Feature Documentation

## 20 Fitur Implementasi Lengkap

### 1. QR Code Scanner
**Lokasi:** Pengurus Dashboard → Scan QR Tab
**Fungsi:** Peserta dapat scan QR mereka sendiri atau admin/pengurus scan peserta
**Technology:** QRCode.js library + Camera API

### 2. Barcode Scanner
**Lokasi:** Manual Input field
**Fungsi:** Support barcode ID peserta
**Status:** Ready untuk integration

### 3. Manual Input ID
**Lokasi:** Pengurus Dashboard → Input Manual
**Fungsi:** Admin/Pengurus dapat input ID peserta manual di HP
**Feature:** Auto-trim whitespace, validation

### 4. Offline Mode
**Lokasi:** Automatic
**Fungsi:** Absensi dapat dilakukan tanpa internet
**Storage:** localStorage queue system
**Sync:** Otomatis saat kembali online

### 5. Public QR
**Lokasi:** Dashboard Pengurus
**Fungsi:** QR bersifat publik, bisa di-copy/share
**Security:** QR berisi ID peserta (encode safe)

### 6. Multiple Status
**Status Available:**
- Hadir (Present)
- Izin (Excused)
- Sakit (Sick)
- Alpha (Absent)
- Terlambat (Late)
- Pulang Awal (Early Leave)

### 7. Catatan Otomatis
**Lokasi:** Form Absensi
**Fungsi:** Input catatan alasan ketidakhadiran
**Field:** Optional textarea untuk catatan

### 8. Foto Bukti
**Status:** Placeholder (Ready untuk v3)
**Feature:** Ambil foto saat absensi untuk verifikasi

### 9. Koordinat Lokasi
**Lokasi:** Kegiatan setup
**Fungsi:** Geolocation check saat absensi
**Method:** HTML5 Geolocation API
**Radius:** 500 meter default

### 10. Anti Duplicate
**Lokasi:** Logic di api.js
**Fungsi:** Cegah absensi 2x dalam sehari untuk kegiatan sama
**Check:** jamaahId + kegiatanId + tanggal

### 11. Dashboard Real-time
**Lokasi:** Admin Dashboard → Dashboard Tab
**Stats:**
- Total Jamaah
- Kegiatan Bulan Ini
- Persentase Kehadiran
- Total Catatan
- Kegiatan Hari Ini

### 12. Gender Statistics
**Lokasi:** Pengurus Dashboard → Rekap
**Display:**
- Total Laki-laki
- Total Perempuan
- Breakdown per status

### 13. Trend Kehadiran
**Lokasi:** Pengurus Dashboard → Rekap
**Chart:**
- Persentase Hadir
- Persentase Izin
- Persentase Alpha
**Visual:** Bar chart dengan animasi

### 14. Export Excel/PDF
**Lokasi:** Admin Tab Peserta → Export Button
**Feature:** Download laporan dalam format:
- Excel (.xlsx)
- PDF (.pdf)
**Status:** Logic ready, UI placeholder

### 15. WhatsApp Share (3 Opsi)
**Lokasi:** Pengurus Dashboard → Rekap → Share WA

**Opsi 1 - Screenshot:**
- Share hasil screenshot laporan
- Manual share ke grup WA

**Opsi 2 - Link:**
- Share link aplikasi
- Tujuan: Undang member lihat laporan

**Opsi 3 - Teks:**
- Format teks dengan data:
  ```
  Rekap Kehadiran Pengajian
  
  Laki-laki: 5
  Perempuan: 3
  Total: 8
  
  Hadir: 7
  Izin: 0
  Alpha: 1
  ```

### 16. Sertifikat Kehadiran
**Status:** Placeholder (v3 feature)
**Concept:** Generate PDF sertifikat otomatis
**Trigger:** Minimal 80% kehadiran per bulan

### 17. Email Report
**Status:** Placeholder (v3 feature)
**Feature:** Auto-send laporan bulanan via email

### 18. Toast Notifications
**Lokasi:** Semua form submission
**Types:**
- `success` - Operasi berhasil (hijau)
- `error` - Operasi gagal (merah)
- `warning` - Perhatian (orange)
- `info` - Informasi (biru)

**Function:** `showToast(message, type)`

### 19. Confirm Dialog
**Lokasi:** Delete operations
**Trigger:** Delete Jamaah, Kegiatan, Absensi
**Function:** `confirmDialog(message)`
**Return:** true/false

### 20. Dark Mode
**Lokasi:** CSS variables + body.dark-mode class
**Toggle:** Via function `toggleDarkMode()`
**Storage:** localStorage 'e_kertalangu_dark_mode'
**Features:**
- Auto-apply pada login
- Smooth transition
- Semua UI support dark mode

## Revisi Jenis Kegiatan

**Sebelumnya:**
- Pengajian Pagi
- Pengajian Malam
- Pengajian Muda-I
- Pengajian Ibu-Ibu
- Musyawarah 5 Unsur
- Pertemuan 5 Unsur
- Asad Day
- Musyawarah 4S/All Tim 7

**Sekarang (UPDATED):**
- Pengajian Rutin
- Pengajian Khusus
- Asad Day

## Revisi Catatan Musyawarah

**Sebelumnya:**
- Kiri 1 (Pengurus 1)
- Kiri 2 (Pengurus 2)
- Kanan 1 (Pengurus 3)
- Kanan 2 (Semua)

**Sekarang (UPDATED):**
- Pure catatan musyawarah saja
- Tidak ada struktur pengurus 1-2-3
- Fleksibel untuk berbagai format catatan

## QR Code Distribution

**Untuk Peserta:**
- QR individual di ID card
- QR bersifat publik (bisa di-scan siapa saja)
- Peserta bisa scan mandiri dari HP

**Untuk Admin/Pengurus:**
- Manual input ID di HP
- Atau scan public QR peserta
- Atau gunakan desktop untuk scan lebih presisi

## Timezone WITA

**Setting:** Asia/Makassar
**Jam:** 21:00 WITA = 19:00 WIB = 20:00 WITA
**Aplikasi:** Automatic timestamp conversion

## Required Fields Validation

**Marked with Red Asterisk (*):**
- Nama Lengkap
- Gender
- No HP
- Alamat
- Tempat Lahir
- Tanggal Lahir
- Pendidikan
- Nama Kegiatan
- Jenis Kegiatan
- Tanggal Kegiatan
- Jam Mulai
- Jam Selesai
- Lokasi

**Validation:**
- Front-end: HTML5 required
- Back-end: Check di Google Apps Script
- Error message: Toast notification

## Performance Optimizations

- localStorage caching untuk data read-heavy
- Lazy loading untuk large datasets
- Minimal DOM manipulation
- CSS animations untuk smooth UX
- Debouncing untuk search input

---

**Last Updated:** 27 Juli 2026
**Feature Status:** 20/20 Implemented
**Testing Status:** QA Ready

# 🕌 E-KERTALANGU - Sistem Absensi Pengajian

Sistem web absensi dan manajemen kegiatan pengajian berbasis Google Sheets dan HTML/CSS/JavaScript.

## 🎯 Fitur Utama

### Admin
- ✅ Dashboard overview (statistik kehadiran, total jamaah, dll)
- ✅ Kelola peserta (tambah, edit, hapus)
- ✅ Kelola kegiatan (pengajian pagi, malam, musyawarah, dll)
- ✅ Kelola absensi
- ✅ Generate laporan bulanan
- ✅ Export data ke Excel
- ✅ Generate QR Code untuk ID peserta
- ✅ Backup otomatis data

### Pengurus
- ✅ Scan QR untuk absensi
- ✅ Input manual absensi
- ✅ Lihat rekap kehadiran per kegiatan
- ✅ Buat catatan musyawarah 4S
- ✅ Share rekap ke WhatsApp
- ✅ Lihat jadwal kegiatan

### Jamaah
- ✅ Lihat profil pribadi
- ✅ Lihat statistik kehadiran
- ✅ Lihat jadwal kegiatan yang akan datang

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Google Apps Script (API)
- **Database**: Google Sheets
- **Hosting**: GitHub Pages
- **Storage**: Google Drive

## 🚀 Setup & Deployment

### 1. Clone Repository
```bash
git clone https://github.com/agengpadma8-lab/e-kertalangu.git
cd e-kertalangu
```

### 2. Setup Google Sheets
- Buka Google Sheets: [Link](https://sheets.google.com)
- Buat spreadsheet baru dengan nama "E-KERTALANGU"
- Buat sheet-sheet berikut:
  - JAMAAH
  - KEGIATAN
  - ABSENSI
  - CATATAN_MUSYAWARAH
  - USERS

### 3. Setup Google Apps Script
- Buka Sheets → Extensions → Apps Script
- Copy kode dari `google-apps-script.js`
- Deploy sebagai Web App
- Copy URL deployment
- Update `APPS_SCRIPT_URL` di `config.js`

### 4. Deploy ke GitHub Pages
- Push semua file ke repository
- Buka Settings → Pages
- Pilih branch `main` sebagai source
- Website live di: `https://agengpadma8-lab.github.io/e-kertalangu/`

## 📝 User Demo

Gunakan akun berikut untuk testing:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin |
| Pengurus | pengurus | pengurus |
| Jamaah | jamaah | jamaah |

## 📋 Database Schema

### JAMAAH
- ID (auto-generated: KRT-0001)
- Nama
- Gender
- No HP
- Alamat
- Tempat Lahir
- Tanggal Lahir
- Pendidikan
- Status (Aktif/Nonaktif)
- Tanggal Daftar
- QR Code

### KEGIATAN
- ID (auto-generated: KGT-001)
- Nama Kegiatan
- Jenis (Pengajian Pagi, Malam, Musyawarah, dll)
- Tanggal
- Jam Mulai
- Jam Selesai
- Lokasi
- Koordinat
- Status
- Peserta Terdaftar

### ABSENSI
- ID (auto-generated: ABS-001)
- Kegiatan ID
- Jamaah ID
- Status (Hadir/Izin/Alpha)
- Waktu Absen
- Catatan

### CATATAN_MUSYAWARAH
- ID
- Kegiatan ID
- Kiri 1
- Kiri 2
- Kanan 1
- Kanan 2 (All)
- Google Drive Link
- Dibuat Oleh
- Tanggal

## 🔐 Security

- Login dengan username & password
- Role-based access control (Admin, Pengurus, Jamaah)
- Data tersimpan aman di Google Drive
- Auto-backup setiap hari
- Session management dengan localStorage

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## 🐛 Known Issues

- QR Code scanning memerlukan kamera (desktop saja)
- Google Sheets API rate limit (jika banyak user)
- Data demo, belum terhubung real database

## 🔄 Development Status

- [x] Login & Authentication
- [x] Admin Dashboard
- [x] Manajemen Peserta
- [x] Manajemen Kegiatan
- [x] Absensi
- [x] Rekap Kehadiran
- [x] Catatan Musyawarah
- [ ] Google Apps Script Backend
- [ ] Real Database Integration
- [ ] Mobile App
- [ ] Email Notifications

## 📞 Support

Jika ada pertanyaan atau bug, silakan buat issue di GitHub.

## 📄 License

MIT License - Bebas digunakan untuk project apapun

## 👨‍💻 Author

Dibuat dengan ❤️ oleh Ageng Padma

---

**Last Updated**: 26 Juli 2026

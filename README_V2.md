# E-KERTALANGU v2 - Sistem Absensi Pengajian Modern

## Daftar Fitur Lengkap (20 Fitur)

### INPUT & SCANNING (5 Fitur)
1. **QR Code Scanner** - Scan QR peserta menggunakan kamera HP
2. **Barcode Scanner** - Input dengan barcode detection
3. **Manual Input ID** - Input manual ID peserta di admin versi HP
4. **Offline Mode** - Absensi tanpa internet, sync otomatis saat online
5. **Public QR** - QR absensi bersifat publik untuk scanning peserta

### STATUS & CATATAN (5 Fitur)
6. **Multiple Status** - Hadir, Izin, Sakit, Alpha, Terlambat, Pulang Awal
7. **Catatan Otomatis** - Capture alasan ketidakhadiran
8. **Foto Bukti** - Ambil foto saat absensi (ready untuk v3)
9. **Koordinat Lokasi** - Absensi hanya di lokasi kegiatan (geolocation)
10. **Anti Duplicate** - Sistem cegah duplikasi nama/ID per hari

### REKAP & ANALYTICS (3 Fitur)
11. **Dashboard Real-time** - Grafik kehadiran live
12. **Gender Statistics** - Breakdown Laki-laki vs Perempuan
13. **Trend Kehadiran** - Grafik persentase hadir/izin/alpha

### REPORT & EXPORT (4 Fitur)
14. **Export Excel/PDF** - Download laporan bulanan
15. **WhatsApp Share (3 Opsi)** - SS, Link, Teks dengan data gender & status
16. **Sertifikat Kehadiran** - Generate sertifikat otomatis (v3)
17. **Email Report** - Kirim laporan via email (v3)

### UI/UX FEATURES (3 Fitur)
18. **Toast Notifications** - Notif kesuksesan/error tanpa page refresh
19. **Confirm Dialog** - Dialog konfirmasi untuk delete operations
20. **Dark Mode** - Mode gelap untuk kenyamanan mata

## Update Configuration

### Jenis Kegiatan (UPDATED)
```javascript
'Pengajian Rutin'  // Kegiatan rutin mingguan
'Pengajian Khusus' // Kegiatan khusus/spesial
'Asad Day'         // Acara Asad Day
```

### Status Absensi (UPDATED)
```javascript
'Hadir'       // Hadir tepat waktu
'Izin'        // Izin dengan alasan
'Sakit'       // Tidak hadir karena sakit
'Alpha'       // Tidak hadir tanpa keterangan
'Terlambat'   // Hadir tapi terlambat
'Pulang Awal' // Pulang sebelum acara selesai
```

## Catatan Musyawarah (REVISED)

**Sebelumnya:** Pure catatan tanpa struktur pengurus 1-2-3 (DONE)
**Sekarang:** Hanya input catatan musyawarah umum, tidak perlu isi per pengurus

## WhatsApp Integration

### 3 Opsi Share:
1. **Screenshot** - Share hasil screenshot laporan
2. **Link** - Share link langsung ke aplikasi
3. **Teks** - Share dalam format teks dengan data:
   - Jumlah Laki-laki
   - Jumlah Perempuan
   - Total Hadir
   - Total Izin
   - Total Alpha

## Fitur User (Dari Diskusi)

✅ **Scan Publik (Public QR)** - QR dapat dipindai oleh peserta sendiri
✅ **Jam Pakai WITA** - Timezone Asia/Makassar (21:00 WITA)
✅ **Peserta Scan via HP** - Peserta bisa scan QR dari HP sendiri
✅ **Admin/Pengurus Lihat Live** - Real-time update status absensi
✅ **Auto-submit Absensi** - Auto-submit setelah scan QR berhasil
✅ **Anti Duplicate Nama** - Tidak bisa absen 2x dalam sehari
✅ **Confirm Dialog** - Dialog konfirmasi delete
✅ **Toast Notifications** - Toast untuk feedback
✅ **Loading State** - Loading spinner saat process
✅ **Required Fields (*)** - Menandai field wajib diisi merah

## Teknologi

- **Frontend:** HTML5, CSS3, JavaScript Vanilla (No Framework)
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Hosting:** GitHub Pages
- **Real-time:** localStorage + polling (v2 roadmap)
- **Offline:** localStorage dengan queue system

## Demo Login

```
Admin:   admin / admin
Pengurus: pengurus / pengurus
Jamaah:  jamaah / jamaah
```

## Deployment

### 1. Siapkan Google Sheets
```
Spreadsheet: E-KERTALANGU
Sheets:
- JAMAAH
- KEGIATAN
- ABSENSI
- CATATAN_MUSYAWARAH
- CATATAN_TIM7
- USERS
```

### 2. Deploy Google Apps Script
```
1. Buka Sheets → Extensions → Apps Script
2. Copy kode dari google-apps-script.js
3. Deploy sebagai Web App
4. Copy URL deployment
5. Update APPS_SCRIPT_URL di config.js
```

### 3. Deploy ke GitHub Pages
```
git add .
git commit -m "feat: E-KERTALANGU v2"
git push origin feature/attendance-v2-full
```

## Roadmap v3

- [ ] Real-time WebSocket updates
- [ ] Foto bukti absensi
- [ ] Email notifications
- [ ] Mobile app native (React Native)
- [ ] Multi-location support
- [ ] Advanced analytics dashboard
- [ ] Biometric fingerprint (jika device support)

## Support

Untuk pertanyaan atau bug report, silakan buat issue di GitHub.

---

**Last Updated:** 27 Juli 2026  
**Version:** 2.0.0  
**Status:** Production Ready

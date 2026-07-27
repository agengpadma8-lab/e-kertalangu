# E-KERTALANGU v2 - Deployment Guide

## Prerequisites

1. GitHub Account
2. Google Account (untuk Google Sheets & Apps Script)
3. Google Sheets dengan struktur yang sudah di-setup
4. Basic HTML/CSS/JS knowledge

## Step-by-Step Deployment

### Phase 1: GitHub Setup

#### 1.1 Fork/Clone Repository
```bash
git clone https://github.com/agengpadma8-lab/e-kertalangu.git
cd e-kertalangu
```

#### 1.2 Create Feature Branch
```bash
git checkout -b feature/attendance-v2-full
```

#### 1.3 Copy Latest Files
- config.js (Updated)
- api.js (Updated)
- app.js (Complete rewrite)
- styles.css (Enhanced)
- index.html (Minor updates)
- google-apps-script.js (Updated)

### Phase 2: Google Sheets Setup

#### 2.1 Create Spreadsheet
1. Buka https://sheets.google.com
2. Buat spreadsheet baru: "E-KERTALANGU"
3. Copy Spreadsheet ID dari URL
   - Format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

#### 2.2 Create Sheets
Buat 6 sheets dengan headers berikut:

**Sheet 1: JAMAAH**
```
ID | Nama | Gender | No HP | Alamat | Tempat Lahir | Tanggal Lahir | Pendidikan | Status | Tanggal Daftar
```

**Sheet 2: KEGIATAN**
```
ID | Nama | Jenis | Tanggal | Jam Mulai | Jam Selesai | Lokasi | Koordinat | Status | Peserta Terdaftar
```

**Sheet 3: ABSENSI**
```
ID | Kegiatan ID | Jamaah ID | Status | Waktu Absen | Catatan | Tanggal
```

**Sheet 4: CATATAN_MUSYAWARAH**
```
ID | Kegiatan ID | Catatan | Drive Link | Dibuat Oleh | Tanggal
```

**Sheet 5: CATATAN_TIM7**
```
ID | Kegiatan ID | Catatan | Drive Link | Dibuat Oleh | Tanggal
```

**Sheet 6: USERS**
```
Username | Password | Role | Name
admin | admin | admin | Administrator
pengurus | pengurus | pengurus | Pengurus Kertalangu
jamaah | jamaah | jamaah | Ahmad Fahri
```

### Phase 3: Google Apps Script Deployment

#### 3.1 Setup Apps Script
1. Buka Spreadsheet E-KERTALANGU
2. Klik menu: Tools → Script Editor
3. Hapus kode default
4. Copy-paste kode dari `google-apps-script.js`
5. Save project: Ctrl+S

#### 3.2 Deploy as Web App
1. Klik "Deploy" → "New deployment"
2. Type: Pilih "Web app"
3. Settings:
   - Execute as: Your Account
   - Who has access: Anyone
4. Klik "Deploy"
5. Copy URL deployment (format: `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`)

#### 3.3 Update config.js
```javascript
const CONFIG = {
    SPREADSHEET_ID: '{PASTE_YOUR_SPREADSHEET_ID}',
    APPS_SCRIPT_URL: '{PASTE_YOUR_DEPLOYMENT_URL}',
    // ... rest of config
};
```

### Phase 4: GitHub Pages Deployment

#### 4.1 Update All Files
- Pastikan semua file sudah ter-update (config.js dengan URL Google Apps Script)

#### 4.2 Commit & Push
```bash
git add .
git commit -m "feat: E-KERTALANGU v2 - Complete attendance system with 20 features"
git push origin feature/attendance-v2-full
```

#### 4.3 Create Pull Request
1. Buka GitHub repository
2. Klik "Compare & pull request"
3. Add description
4. Merge ke branch `main`

#### 4.4 Enable GitHub Pages
1. Buka repository Settings
2. Scroll ke "GitHub Pages" section
3. Source: Pilih "main" branch
4. Pilih root folder: `/`
5. Save

#### 4.5 Access Website
- Website live di: `https://agengpadma8-lab.github.io/e-kertalangu/`
- Tunggu 1-2 menit untuk propagasi DNS

### Phase 5: Testing

#### 5.1 Functional Testing
```
1. Login dengan demo credentials
   - admin/admin
   - pengurus/pengurus  
   - jamaah/jamaah

2. Test Admin Panel
   - Dashboard loading
   - Tambah Peserta
   - Tambah Kegiatan
   - Lihat Laporan

3. Test Pengurus Panel
   - Scan QR / Manual Input
   - Lihat Rekap Kehadiran
   - Share ke WhatsApp
   - Buat Catatan Musyawarah

4. Test Jamaah Panel
   - Lihat Profil
   - Lihat Statistik Kehadiran
   - Lihat Jadwal Kegiatan

5. Test Features
   - Toast notifications
   - Confirm dialog
   - Dark mode toggle
   - Search functionality
   - Offline mode (disable internet)
```

#### 5.2 Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

#### 5.3 Performance Testing
- Load time: < 3 detik
- Search response: < 500ms
- Form submission: < 2 detik
- Memory usage: < 50MB

### Phase 6: Production Deployment

#### 6.1 Database Backup
```bash
# Backup Google Sheets
1. Buka spreadsheet
2. File → Download → Excel
3. Simpan file ke lokasi aman
```

#### 6.2 Set Production Domain (Optional)
```
1. Beli domain (misal: e-kertalangu.com)
2. Configure DNS di registrar
3. Setup custom domain di GitHub Pages
4. Update APPS_SCRIPT_URL jika diperlukan
```

#### 6.3 Documentation
- Create user manual
- Create admin guide
- Create troubleshooting guide

#### 6.4 Launch
- Announce ke user community
- Setup support channel (WhatsApp group, email)
- Monitor for bugs & issues

## Troubleshooting

### Issue: "CORS Error when calling Google Apps Script"
**Solution:** 
- Pastikan URL deployment di config.js benar
- Pastikan Apps Script deployed dengan "Anyone" access
- Test di Postman terlebih dahulu

### Issue: "Data tidak muncul di dashboard"
**Solution:**
- Check browser console (F12)
- Pastikan Google Sheets sudah punya data
- Refresh halaman & clear localStorage

### Issue: "Offline mode tidak bekerja"
**Solution:**
- Pastikan browser support localStorage
- Check quota localStorage (5MB limit)
- Clear old backup data dari localStorage

### Issue: "Dark mode tidak tersave"
**Solution:**
- Pastikan localStorage enabled
- Check browser privacy settings
- Clear browser cache & try again

## Maintenance

### Regular Tasks
1. **Weekly**
   - Monitor error logs
   - Check performance metrics
   - Respond to user issues

2. **Monthly**
   - Backup Google Sheets data
   - Review user feedback
   - Plan feature updates

3. **Quarterly**
   - Major version updates
   - Security audit
   - Performance optimization

## Rollback Plan

Jika ada issue di v2:
1. Revert ke commit sebelumnya: `git revert [commit-hash]`
2. Push ke main branch
3. GitHub Pages otomatis update
4. Notify users about issue

## Support & Documentation

- GitHub Issues: Report bugs & request features
- Wiki: User documentation
- Releases: Changelog & updates

---

**Deployment Complete!**

Website siap digunakan. Selamat menikmati E-KERTALANGU v2!

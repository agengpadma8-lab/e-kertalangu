# 📋 E-KERTALANGU - Panduan Setup Lengkap

## 🚀 TAHAP 1: Setup Google Sheets Database

### 1.1 Buka Google Sheets Anda
- Link: https://sheets.google.com
- Buka spreadsheet yang sudah dibuat
- Spreadsheet ID: `1JDDFEFG7PG1VnHFtQRII6SThtBDGVozEdxlxTM25hYU`

### 1.2 Buat Sheet-Sheet Berikut

Di halaman Apps Script, ada kode `setupDatabase()` yang akan otomatis membuat semua sheet.

**Atau manual buat sheet dengan nama:**
1. **JAMAAH** - Data peserta
2. **KEGIATAN** - Daftar pengajian
3. **ABSENSI** - Rekap kehadiran
4. **CATATAN_MUSYAWARAH** - Catatan 4S
5. **CATATAN_TIM7** - Catatan Tim 7
6. **USERS** - Login credentials

---

## 🔧 TAHAP 2: Setup Google Apps Script Backend

### 2.1 Buka Google Apps Script
1. Di Google Sheets → **Extensions** → **Apps Script**
2. Akan terbuka halaman baru

### 2.2 Copy Kode Backend
1. Hapus kode default yang ada
2. Copy semua kode dari file: `google-apps-script.js`
3. Paste ke editor Google Apps Script
4. Save (Ctrl+S)

### 2.3 Setup Database (RUN ONCE)
1. Di atas editor, cari dropdown function selector
2. Pilih: **setupDatabase**
3. Klik tombol **Run** (▶️)
4. Authorize app jika diminta
5. Tunggu sampai selesai

### 2.4 Deploy sebagai Web App
1. Klik **Deploy** → **New Deployment**
2. Pilih type: **Web App**
3. Execute as: Pilih email Anda
4. Who has access: **Anyone**
5. Klik **Deploy**
6. Copy URL yang diberikan
7. **SIMPAN URL INI!** (kita butuh untuk step berikutnya)

---

## 🌐 TAHAP 3: Update Config Frontend

### 3.1 Edit file `config.js`
1. Buka file: `config.js`
2. Cari baris:
   ```javascript
   APPS_SCRIPT_URL: '', // Will be filled after Apps Script deployment
   ```
3. Ganti dengan URL deployment Anda:
   ```javascript
   APPS_SCRIPT_URL: 'https://script.google.com/macros/d/{SCRIPT_ID}/userweb/do', // Copy dari deploy
   ```
4. Save file
5. Push ke GitHub

---

## 🖥️ TAHAP 4: Update HTML & Styling

### 4.1 Replace index.html
- Copy file: `updated-index.html`
- Rename menjadi: `index.html`
- Replace file lama
- Push ke GitHub

### 4.2 Update app.js
- Copy file: `updated-app.js`
- Rename menjadi: `app.js`
- Replace file lama
- Push ke GitHub

---

## ✅ TESTING

### 4.1 Cek Website
1. Buka: https://agengpadma8-lab.github.io/e-kertalangu/
2. Seharusnya loading screen hilang dan muncul login page
3. Coba login dengan:
   - **Admin**: admin / admin
   - **Pengurus**: pengurus / pengurus
   - **Jamaah**: jamaah / jamaah

### 4.2 Test Features
- ✅ Login & Logout
- ✅ Tab navigation
- ✅ Lihat data (dashboard, jamaah, kegiatan)
- ✅ Cari peserta (ketik 2 huruf)
- ✅ Tambah peserta / kegiatan
- ✅ Rekap kehadiran
- ✅ Catatan 4S dan Tim 7

---

## 🐛 Troubleshooting

### Masalah: "Tidak ada data" atau "API Error"
**Solusi:**
1. Cek apakah Google Sheets PUBLIC
2. Cek Spreadsheet ID di config.js
3. Cek Apps Script sudah dideploy
4. Refresh browser (Ctrl+Shift+R)

### Masalah: Form tidak tersimpan
**Solusi:**
1. Cek Apps Script URL di config.js sudah benar
2. Cek Google Sheets sudah public
3. Cek Excel tidak dalam mode edit

### Masalah: "Unauthorized" atau CORS error
**Solusi:**
1. Di Google Apps Script, pastikan:
   - Execute as: Email Anda
   - Who has access: Anyone
2. Redeploy dengan setting yang benar

---

## 📝 User Demo

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin |
| Pengurus | pengurus | pengurus |
| Jamaah | jamaah | jamaah |

---

## 🎯 Fitur yang Ready

✅ Login & Authentication  
✅ Admin Dashboard  
✅ Manajemen Peserta (CRUD)  
✅ Manajemen Kegiatan  
✅ Scan Absensi  
✅ Rekap Kehadiran  
✅ Catatan Musyawarah 4S  
✅ Catatan Tim 7  
✅ Search Peserta (2 huruf)  
✅ Export Data  
✅ Modern UI Design  
✅ Responsive Mobile  

---

## 🔗 Link Penting

- **Website**: https://agengpadma8-lab.github.io/e-kertalangu/
- **GitHub Repo**: https://github.com/agengpadma8-lab/e-kertalangu
- **Google Sheets**: https://sheets.google.com/spreadsheets/d/1JDDFEFG7PG1VnHFtQRII6SThtBDGVozEdxlxTM25hYU/edit
- **Google Apps Script**: https://script.google.com/home

---

**Selesai! E-KERTALANGU siap digunakan! 🎉**

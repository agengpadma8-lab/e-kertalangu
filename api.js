// API Handler untuk Google Sheets

class SheetAPI {
    constructor() {
        this.spreadsheetId = CONFIG.SPREADSHEET_ID;
        this.apiKey = 'YOUR_API_KEY'; // Akan di-setup di Apps Script
    }

    // Helper untuk fetch data
    async fetchFromSheets(sheetName) {
        try {
            // Untuk demo, gunakan data lokal
            const data = localStorage.getItem(`cache_${sheetName}`);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error fetching from Sheets:', error);
            return [];
        }
    }

    // Jamaah Methods
    async getJamaah() {
        const jamaah = [
            { id: 'KRT-0001', nama: 'Ahmad Fahri', gender: 'Laki-laki', noHp: '081234567890', alamat: 'Jl. Merdeka No. 10', tempatLahir: 'Jakarta', tglLahir: '1990-05-15', pendidikan: 'S1', status: 'Aktif', tglDaftar: '2024-01-15' },
            { id: 'KRT-0002', nama: 'Siti Nurhaliza', gender: 'Perempuan', noHp: '081234567891', alamat: 'Jl. Sudirman No. 20', tempatLahir: 'Bandung', tglLahir: '1995-03-20', pendidikan: 'S1', status: 'Aktif', tglDaftar: '2024-01-20' },
            { id: 'KRT-0003', nama: 'Budi Santoso', gender: 'Laki-laki', noHp: '081234567892', alamat: 'Jl. Gatot Subroto', tempatLahir: 'Surabaya', tglLahir: '1988-07-10', pendidikan: 'SMA', status: 'Aktif', tglDaftar: '2024-02-01' },
            { id: 'KRT-0004', nama: 'Fatimah Az-Zahra', gender: 'Perempuan', noHp: '081234567893', alamat: 'Jl. Ahmad Yani', tempatLahir: 'Medan', tglLahir: '1992-11-25', pendidikan: 'S1', status: 'Aktif', tglDaftar: '2024-02-10' },
            { id: 'KRT-0005', nama: 'Rudi Hartono', gender: 'Laki-laki', noHp: '081234567894', alamat: 'Jl. Diponegoro', tempatLahir: 'Yogyakarta', tglLahir: '1985-06-15', pendidikan: 'SMA', status: 'Aktif', tglDaftar: '2024-03-01' }
        ];
        return jamaah;
    }

    async tambahJamaah(data) {
        // Generate ID
        const jamaah = await this.getJamaah();
        const lastId = parseInt(jamaah[jamaah.length - 1].id.split('-')[1]);
        data.id = `KRT-${String(lastId + 1).padStart(4, '0')}`;
        data.tglDaftar = new Date().toISOString().split('T')[0];
        
        // Di production, save ke Sheets
        console.log('Tambah Jamaah:', data);
        return data;
    }

    async updateJamaah(id, data) {
        console.log('Update Jamaah:', id, data);
        return data;
    }

    async deleteJamaah(id) {
        console.log('Delete Jamaah:', id);
        return true;
    }

    // Kegiatan Methods
    async getKegiatan() {
        const today = new Date().toISOString().split('T')[0];
        const kegiatan = [
            { id: 'KGT-001', nama: 'Pengajian Pagi', jenis: 'Pengajian Pagi', tanggal: today, jamMulai: '09:00', jamSelesai: '10:00', lokasi: 'Masjid An-Nur', koordinat: '-6.2088,106.8456', status: 'Aktif', pesertaTerdaftar: 50 },
            { id: 'KGT-002', nama: 'Pengajian Sore', jenis: 'Pengajian Malam', tanggal: today, jamMulai: '16:00', jamSelesai: '17:00', lokasi: 'Masjid An-Nur', koordinat: '-6.2088,106.8456', status: 'Aktif', pesertaTerdaftar: 35 }
        ];
        return kegiatan;
    }

    async tambahKegiatan(data) {
        const kegiatan = await this.getKegiatan();
        const lastId = parseInt(kegiatan[kegiatan.length - 1].id.split('-')[1]);
        data.id = `KGT-${String(lastId + 1).padStart(3, '0')}`;
        
        console.log('Tambah Kegiatan:', data);
        return data;
    }

    async updateKegiatan(id, data) {
        console.log('Update Kegiatan:', id, data);
        return data;
    }

    // Absensi Methods
    async getAbsensi(kegiatanId = null) {
        const absensi = [
            { id: 'ABS-001', kegiatanId: 'KGT-001', jamaahId: 'KRT-0001', status: 'Hadir', waktuAbsen: '09:15', catatan: '' },
            { id: 'ABS-002', kegiatanId: 'KGT-001', jamaahId: 'KRT-0002', status: 'Hadir', waktuAbsen: '09:18', catatan: '' },
            { id: 'ABS-003', kegiatanId: 'KGT-001', jamaahId: 'KRT-0003', status: 'Hadir', waktuAbsen: '09:20', catatan: '' },
            { id: 'ABS-004', kegiatanId: 'KGT-001', jamaahId: 'KRT-0004', status: 'Izin', waktuAbsen: '', catatan: 'Sakit' },
            { id: 'ABS-005', kegiatanId: 'KGT-001', jamaahId: 'KRT-0005', status: 'Alpha', waktuAbsen: '', catatan: '' }
        ];
        
        if (kegiatanId) {
            return absensi.filter(a => a.kegiatanId === kegiatanId);
        }
        return absensi;
    }

    async tambahAbsensi(data) {
        console.log('Tambah Absensi:', data);
        return data;
    }

    async generateQRCode(jamaahId) {
        // Generate QR Code menggunakan library QRCode.js
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            new QRCode({
                text: jamaahId,
                width: 200,
                height: 200,
                correctLevel: QRCode.CorrectLevel.H,
                useSVG: false
            }).makeCode();
            resolve(canvas.toDataURL());
        });
    }

    async generateIDCard(jamaahId) {
        // Generate kartu ID dengan QR code
        const qrCode = await this.generateQRCode(jamaahId);
        return qrCode;
    }

    // Musyawarah Methods
    async getMusyawarah(kegiatanId = null) {
        const musyawarah = [];
        if (kegiatanId) {
            return musyawarah.filter(m => m.kegiatanId === kegiatanId);
        }
        return musyawarah;
    }

    async tambahMusyawarah(data) {
        console.log('Tambah Musyawarah:', data);
        return data;
    }

    // Laporan Methods
    async getLaporanBulan(tahun, bulan) {
        const kegiatan = await this.getKegiatan();
        const absensi = await this.getAbsensi();
        const jamaah = await this.getJamaah();

        return {
            periode: `${bulan}/${tahun}`,
            totalKegiatan: kegiatan.length,
            totalJamaah: jamaah.length,
            statistik: {
                hadir: absensi.filter(a => a.status === 'Hadir').length,
                izin: absensi.filter(a => a.status === 'Izin').length,
                alpha: absensi.filter(a => a.status === 'Alpha').length
            }
        };
    }
}

const api = new SheetAPI();

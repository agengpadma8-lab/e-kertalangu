// API Handler untuk Google Sheets dengan Local Caching

class SheetAPI {
    constructor() {
        this.spreadsheetId = CONFIG.SPREADSHEET_ID;
        this.apiKey = 'YOUR_API_KEY';
        this.offlineQueue = [];
        this.loadOfflineQueue();
    }

    // Load offline queue dari localStorage
    loadOfflineQueue() {
        const queue = localStorage.getItem(CONFIG.LOCAL_KEYS.OFFLINE_QUEUE);
        this.offlineQueue = queue ? JSON.parse(queue) : [];
    }

    // Save offline queue ke localStorage
    saveOfflineQueue() {
        localStorage.setItem(CONFIG.LOCAL_KEYS.OFFLINE_QUEUE, JSON.stringify(this.offlineQueue));
    }

    // Check internet connection
    isOnline() {
        return navigator.onLine;
    }

    // Add to offline queue
    addToQueue(action, data) {
        if (!this.isOnline()) {
            this.offlineQueue.push({ action, data, timestamp: new Date().toISOString() });
            this.saveOfflineQueue();
            return true;
        }
        return false;
    }

    // JAMAAH Methods
    async getJamaah() {
        const jamaah = [
            { id: 'KRT-0001', nama: 'Ahmad Fahri', gender: 'Laki-laki', noHp: '081234567890', alamat: 'Jl. Merdeka No. 10', tempatLahir: 'Jakarta', tglLahir: '1990-05-15', pendidikan: 'S1', status: 'Aktif', tglDaftar: '2024-01-15' },
            { id: 'KRT-0002', nama: 'Siti Nurhaliza', gender: 'Perempuan', noHp: '081234567891', alamat: 'Jl. Sudirman No. 20', tempatLahir: 'Bandung', tglLahir: '1995-03-20', pendidikan: 'S1', status: 'Aktif', tglDaftar: '2024-01-20' },
            { id: 'KRT-0003', nama: 'Budi Santoso', gender: 'Laki-laki', noHp: '081234567892', alamat: 'Jl. Gatot Subroto', tempatLahir: 'Surabaya', tglLahir: '1988-07-10', pendidikan: 'SMA', status: 'Aktif', tglDaftar: '2024-01-25' },
            { id: 'KRT-0004', nama: 'Fatimah Az-Zahra', gender: 'Perempuan', noHp: '081234567893', alamat: 'Jl. Ahmad Yani', tempatLahir: 'Medan', tglLahir: '1992-11-25', pendidikan: 'S1', status: 'Aktif', tglDaftar: '2024-02-01' },
            { id: 'KRT-0005', nama: 'Rudi Hartono', gender: 'Laki-laki', noHp: '081234567894', alamat: 'Jl. Diponegoro', tempatLahir: 'Yogyakarta', tglLahir: '1985-06-15', pendidikan: 'SMA', status: 'Aktif', tglDaftar: '2024-02-05' }
        ];
        return jamaah;
    }

    async tambahJamaah(data) {
        const jamaah = await this.getJamaah();
        const lastId = parseInt(jamaah[jamaah.length - 1].id.split('-')[1]);
        data.id = `KRT-${String(lastId + 1).padStart(4, '0')}`;
        data.tglDaftar = new Date().toISOString().split('T')[0];
        
        if (!this.isOnline()) {
            this.addToQueue('tambahJamaah', data);
        }
        console.log('Tambah Jamaah:', data);
        return data;
    }

    async updateJamaah(id, data) {
        if (!this.isOnline()) {
            this.addToQueue('updateJamaah', { id, data });
        }
        console.log('Update Jamaah:', id, data);
        return data;
    }

    async deleteJamaah(id) {
        if (!this.isOnline()) {
            this.addToQueue('deleteJamaah', { id });
        }
        console.log('Delete Jamaah:', id);
        return true;
    }

    // KEGIATAN Methods
    async getKegiatan() {
        const today = new Date().toISOString().split('T')[0];
        const kegiatan = [
            { id: 'KGT-001', nama: 'Pengajian Pagi', jenis: 'Pengajian Rutin', tanggal: today, jamMulai: '09:00', jamSelesai: '10:00', lokasi: 'Masjid An-Nur', koordinat: '-6.2088,106.8456', status: 'Aktif', pesertaTerdaftar: 50 },
            { id: 'KGT-002', nama: 'Pengajian Sore', jenis: 'Pengajian Rutin', tanggal: today, jamMulai: '16:00', jamSelesai: '17:00', lokasi: 'Masjid An-Nur', koordinat: '-6.2088,106.8456', status: 'Aktif', pesertaTerdaftar: 45 }
        ];
        return kegiatan;
    }

    async tambahKegiatan(data) {
        const kegiatan = await this.getKegiatan();
        const lastId = parseInt(kegiatan[kegiatan.length - 1].id.split('-')[1]);
        data.id = `KGT-${String(lastId + 1).padStart(3, '0')}`;
        
        if (!this.isOnline()) {
            this.addToQueue('tambahKegiatan', data);
        }
        console.log('Tambah Kegiatan:', data);
        return data;
    }

    async updateKegiatan(id, data) {
        if (!this.isOnline()) {
            this.addToQueue('updateKegiatan', { id, data });
        }
        console.log('Update Kegiatan:', id, data);
        return data;
    }

    async deleteKegiatan(id) {
        if (!this.isOnline()) {
            this.addToQueue('deleteKegiatan', { id });
        }
        console.log('Delete Kegiatan:', id);
        return true;
    }

    // ABSENSI Methods with Geolocation Check
    async getAbsensi(kegiatanId = null) {
        const absensi = [
            { id: 'ABS-001', kegiatanId: 'KGT-001', jamaahId: 'KRT-0001', status: 'Hadir', waktuAbsen: '09:15', catatan: '', tanggal: new Date().toISOString().split('T')[0] },
            { id: 'ABS-002', kegiatanId: 'KGT-001', jamaahId: 'KRT-0002', status: 'Hadir', waktuAbsen: '09:18', catatan: '', tanggal: new Date().toISOString().split('T')[0] },
            { id: 'ABS-003', kegiatanId: 'KGT-001', jamaahId: 'KRT-0003', status: 'Hadir', waktuAbsen: '09:20', catatan: '', tanggal: new Date().toISOString().split('T')[0] },
            { id: 'ABS-004', kegiatanId: 'KGT-001', jamaahId: 'KRT-0004', status: 'Izin', waktuAbsen: '', catatan: 'Sakit', tanggal: new Date().toISOString().split('T')[0] },
            { id: 'ABS-005', kegiatanId: 'KGT-001', jamaahId: 'KRT-0005', status: 'Alpha', waktuAbsen: '', catatan: '', tanggal: new Date().toISOString().split('T')[0] }
        ];
        
        if (kegiatanId) {
            return absensi.filter(a => a.kegiatanId === kegiatanId);
        }
        return absensi;
    }

    async tambahAbsensi(data) {
        // Cek duplicate
        const absensi = await this.getAbsensi(data.kegiatanId);
        const isDuplicate = absensi.some(a => a.jamaahId === data.jamaahId && a.tanggal === new Date().toISOString().split('T')[0]);
        
        if (isDuplicate) {
            throw new Error('Peserta sudah absen hari ini');
        }

        if (!this.isOnline()) {
            this.addToQueue('tambahAbsensi', data);
        }
        console.log('Tambah Absensi:', data);
        return data;
    }

    async checkGeolocation(targetLat, targetLng, maxDistance = 500) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const distance = this.calculateDistance(latitude, longitude, targetLat, targetLng);
                    resolve({ success: distance <= maxDistance, distance });
                },
                (error) => reject(error)
            );
        });
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius Bumi dalam km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c * 1000; // Return dalam meter
    }

    // CATATAN MUSYAWARAH (Pure catatan, tanpa pengurus 1-2-3)
    async getMusyawarah(kegiatanId = null) {
        const musyawarah = [];
        if (kegiatanId) {
            return musyawarah.filter(m => m.kegiatanId === kegiatanId);
        }
        return musyawarah;
    }

    async tambahMusyawarah(data) {
        if (!this.isOnline()) {
            this.addToQueue('tambahMusyawarah', data);
        }
        console.log('Tambah Musyawarah:', data);
        return data;
    }

    // LAPORAN Methods
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

    // AUTO BACKUP
    async backupData() {
        const backup = {
            timestamp: new Date().toISOString(),
            jamaah: await this.getJamaah(),
            kegiatan: await this.getKegiatan(),
            absensi: await this.getAbsensi()
        };
        localStorage.setItem('e_kertalangu_backup_' + Date.now(), JSON.stringify(backup));
        console.log('Backup data berhasil');
        return backup;
    }
}

const api = new SheetAPI();

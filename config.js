// E-KERTALANGU Configuration
const CONFIG = {
    SPREADSHEET_ID: '1JDDFEFG7PG1VnHFtQRII6SThtBDGVozEdxlxTM25hYU',
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx2WLgPdIzWhK2iCzZcsyY4VrJU9qSc54j-ZjkrUXK4Md32ay_A9TovIT1RTslsPTUx/exec',
    
    // Jenis Kegiatan
    JENIS_KEGIATAN: [
        'Pengajian Pagi',
        'Pengajian Malam',
        'Pengajian Muda-I',
        'Pengajian Ibu-Ibu',
        'Musyawarah 5 Unsur',
        'Pertemuan 5 Unsur',
        'Asad Day',
        'Musyawarah 4S/All Tim 7'
    ],
    
    // Status
    STATUS_KEGIATAN: ['Aktif', 'Selesai', 'Dibatalkan'],
    STATUS_ABSENSI: ['Hadir', 'Izin', 'Alpha'],
    STATUS_JAMAAH: ['Aktif', 'Nonaktif'],
    
    // Local Storage Keys
    LOCAL_KEYS: {
        USER_INFO: 'e_kertalangu_user',
        THEME: 'e_kertalangu_theme',
        CACHE_JAMAAH: 'e_kertalangu_jamaah',
        CACHE_KEGIATAN: 'e_kertalangu_kegiatan',
        CACHE_ABSENSI: 'e_kertalangu_absensi'
    }
};

// Demo Users (akan diganti dengan data dari Sheets)
const DEMO_USERS = [
    { username: 'admin', password: 'admin', role: 'admin', name: 'Administrator' },
    { username: 'pengurus', password: 'pengurus', role: 'pengurus', name: 'Pengurus Kertalangu' },
    { username: 'jamaah', password: 'jamaah', role: 'jamaah', name: 'Ahmad Fahri' }
];

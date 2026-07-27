// E-KERTALANGU Configuration
const CONFIG = {
    SPREADSHEET_ID: '1JDDFEFG7PG1VnHFtQRII6SThtBDGVozEdxlxTM25hYU',
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwSJufxX9xOUwOu5Y4g8XqA_rT3zmITqhMRKnBX0LH2UQB6-YrNNzRgNsPsvU79ShEX/exec',
    
    // Jenis Kegiatan - UPDATED
    JENIS_KEGIATAN: [
        'Pengajian Rutin',
        'Pengajian Khusus',
        'Asad Day'
    ],
    
    // Status
    STATUS_KEGIATAN: ['Aktif', 'Selesai', 'Dibatalkan'],
    STATUS_ABSENSI: ['Hadir', 'Izin', 'Sakit', 'Alpha', 'Terlambat', 'Pulang Awal'],
    STATUS_JAMAAH: ['Aktif', 'Nonaktif'],
    
    // Timezone WITA
    TIMEZONE: 'Asia/Makassar',
    
    // Local Storage Keys
    LOCAL_KEYS: {
        USER_INFO: 'e_kertalangu_user',
        THEME: 'e_kertalangu_theme',
        CACHE_JAMAAH: 'e_kertalangu_jamaah',
        CACHE_KEGIATAN: 'e_kertalangu_kegiatan',
        CACHE_ABSENSI: 'e_kertalangu_absensi',
        OFFLINE_QUEUE: 'e_kertalangu_offline_queue'
    },
    
    // Feature Flags
    FEATURES: {
        QR_SCANNING: true,
        GEOLOCATION: true,
        OFFLINE_MODE: true,
        DARK_MODE: true,
        AUTO_BACKUP: true,
        REAL_TIME_UPDATES: true
    }
};

// Demo Users
const DEMO_USERS = [
    { username: 'admin', password: 'admin', role: 'admin', name: 'Administrator' },
    { username: 'pengurus', password: 'pengurus', role: 'pengurus', name: 'Pengurus Kertalangu' },
    { username: 'jamaah', password: 'jamaah', role: 'jamaah', name: 'Ahmad Fahri' }
];

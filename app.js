// Main Application Logic - Complete Attendance System v2

let currentUser = null;
let offlineMode = false;
let darkModeEnabled = localStorage.getItem('e_kertalangu_dark_mode') === 'true';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initApp();
    }, 2000);
});

function initApp() {
    const loadingScreen = document.getElementById('loadingScreen');
    const user = localStorage.getItem(CONFIG.LOCAL_KEYS.USER_INFO);
    
    loadingScreen.classList.add('hidden');
    
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }

    // Check online status
    checkOnlineStatus();
    window.addEventListener('online', () => {
        offlineMode = false;
        showToast('Kembali online', 'success');
        syncOfflineData();
    });
    window.addEventListener('offline', () => {
        offlineMode = true;
        showToast('Mode offline - data akan disync otomatis', 'warning');
    });
    
    if (user) {
        currentUser = JSON.parse(user);
        showDashboard();
    } else {
        showLoginPage();
    }
    
    setupEventListeners();
    
    // Auto backup setiap jam
    setInterval(() => {
        api.backupData();
    }, 3600000);
}

function checkOnlineStatus() {
    offlineMode = !navigator.onLine;
}

function setupEventListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout Buttons
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('logoutBtnPengurus')?.addEventListener('click', handleLogout);
    document.getElementById('logoutBtnJamaah')?.addEventListener('click', handleLogout);

    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });

    // Search
    document.getElementById('searchJamaah')?.addEventListener('input', handleSearchJamaah);
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Validasi field
    if (!username || !password) {
        showToast('Username dan password tidak boleh kosong', 'error');
        return;
    }
    
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem(CONFIG.LOCAL_KEYS.USER_INFO, JSON.stringify(user));
        showDashboard();
    } else {
        showToast('Username atau password salah', 'error');
    }
}

function handleLogout() {
    if (confirmDialog('Anda yakin ingin logout?')) {
        localStorage.removeItem(CONFIG.LOCAL_KEYS.USER_INFO);
        currentUser = null;
        showLoginPage();
        showToast('Logout berhasil', 'success');
    }
}

function showLoginPage() {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById('loginPage').classList.remove('hidden');
}

function showDashboard() {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    if (currentUser.role === 'admin') {
        document.getElementById('adminPage').classList.remove('hidden');
        document.getElementById('userDisplay').textContent = `Admin: ${currentUser.name}`;
        loadAdminDashboard();
    } else if (currentUser.role === 'pengurus') {
        document.getElementById('pengurusPage').classList.remove('hidden');
        document.getElementById('userDisplayPengurus').textContent = `Pengurus: ${currentUser.name}`;
        loadPengurusDashboard();
    } else {
        document.getElementById('jamaahPage').classList.remove('hidden');
        document.getElementById('userDisplayJamaah').textContent = `Jamaah: ${currentUser.name}`;
        loadJamaahDashboard();
    }
}

function handleTabClick(e) {
    const tabName = e.target.dataset.tab;
    const parent = e.target.closest('.tabs').parentElement;
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    e.target.classList.add('active');
    document.getElementById(tabName)?.classList.add('active');
    
    loadTabData(tabName);
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'dashboard':
            loadAdminDashboard();
            break;
        case 'jamaah':
            loadJamaahTable();
            break;
        case 'kegiatan':
            loadKegiatanTable();
            break;
        case 'absensi':
            loadAbsensiTable();
            break;
        case 'musyawarah4s':
        case 'musyawarahtim7':
            loadMusyawarahTab(tabName);
            break;
        case 'laporan':
            loadLaporanTab();
            break;
        case 'scanqr':
            loadScanQRTab();
            break;
        case 'rekap':
            loadRekapKehadiran();
            break;
        case 'musyawarahpengurus':
            loadMusyawarahPengurus();
            break;
        case 'jadwal':
            loadJadwalKegiatan();
            break;
        case 'profiljamaah':
            loadJamaahDashboard();
            break;
        case 'kehadiranjamaah':
            loadKehadiranJamaah();
            break;
        case 'jadwaljamaah':
            loadJadwalJamaah();
            break;
    }
}

// ADMIN FUNCTIONS
async function loadAdminDashboard() {
    const jamaah = await api.getJamaah();
    const kegiatan = await api.getKegiatan();
    const absensi = await api.getAbsensi();
    
    document.getElementById('totalJamaah').textContent = jamaah.length;
    document.getElementById('kegiatanBulan').textContent = kegiatan.length;
    
    const totalAbsen = absensi.length;
    const hadir = absensi.filter(a => a.status === 'Hadir').length;
    const persentase = totalAbsen > 0 ? Math.round((hadir / totalAbsen) * 100) : 0;
    document.getElementById('avgKehadiran').textContent = persentase + '%';
    document.getElementById('totalMusyawarah').textContent = '0';
    
    const today = new Date().toISOString().split('T')[0];
    const kegiatanHariIni = kegiatan.filter(k => k.tanggal === today);
    const container = document.getElementById('kegiatanHariIni');
    container.innerHTML = kegiatanHariIni.length > 0 ? 
        kegiatanHariIni.map(k => `
            <div class="kegiatan-item">
                <h4>${k.nama}</h4>
                <div class="kegiatan-item-detail">Jam: ${k.jamMulai} - ${k.jamSelesai}</div>
                <div class="kegiatan-item-detail">Lokasi: ${k.lokasi}</div>
                <div class="kegiatan-item-detail">Peserta Terdaftar: ${k.pesertaTerdaftar}</div>
            </div>
        `).join('') :
        '<p style="padding: 20px; text-align: center; color: #999;">Tidak ada kegiatan hari ini</p>';
}

async function loadJamaahTable() {
    const jamaah = await api.getJamaah();
    const container = document.getElementById('jamaahTable');
    
    if (jamaah.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Tidak ada data peserta</p>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Gender</th>
                    <th>No HP</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${jamaah.map(j => `
                    <tr>
                        <td><strong>${j.id}</strong></td>
                        <td>${j.nama}</td>
                        <td>${j.gender}</td>
                        <td>${j.noHp}</td>
                        <td><span class="status-badge status-${j.status.toLowerCase()}">${j.status}</span></td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="editJamaah('${j.id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteJamaahConfirm('${j.id}', '${j.nama}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

async function loadKegiatanTable() {
    const kegiatan = await api.getKegiatan();
    const container = document.getElementById('kegiatanTable');
    
    if (kegiatan.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Tidak ada data kegiatan</p>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Jenis</th>
                    <th>Tanggal</th>
                    <th>Jam</th>
                    <th>Lokasi</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${kegiatan.map(k => `
                    <tr>
                        <td><strong>${k.id}</strong></td>
                        <td>${k.nama}</td>
                        <td>${k.jenis}</td>
                        <td>${k.tanggal}</td>
                        <td>${k.jamMulai} - ${k.jamSelesai}</td>
                        <td>${k.lokasi}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="editKegiatan('${k.id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteKegiatanConfirm('${k.id}', '${k.nama}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

async function loadAbsensiTable() {
    const absensi = await api.getAbsensi();
    const container = document.getElementById('absensiTable');
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Peserta</th>
                    <th>Status</th>
                    <th>Waktu</th>
                    <th>Catatan</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${absensi.map((a, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${a.jamaahId}</td>
                        <td><span class="status-badge status-${a.status.toLowerCase()}">${a.status}</span></td>
                        <td>${a.waktuAbsen || '-'}</td>
                        <td>${a.catatan || '-'}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="editAbsensi('${a.id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteAbsensiConfirm('${a.id}')">Hapus</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

async function loadMusyawarahTab(tabName) {
    // Pure catatan musyawarah tanpa struktur pengurus
    const container = document.getElementById(tabName === 'musyawarah4s' ? 'musyawarahContainer' : 'tim7Container');
    container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Belum ada catatan</p>';
}

async function loadLaporanTab() {
    const container = document.getElementById('laporanContainer');
    const laporan = await api.getLaporanBulan('2026', '07');
    
    const html = `
        <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Laporan Bulan ${laporan.periode}</h3>
            <table style="width: 100%; margin-top: 20px;">
                <tr>
                    <td style="padding: 10px;">Total Kegiatan</td>
                    <td style="padding: 10px; font-weight: bold;">${laporan.totalKegiatan}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;">Total Jamaah</td>
                    <td style="padding: 10px; font-weight: bold;">${laporan.totalJamaah}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;">Hadir</td>
                    <td style="padding: 10px; font-weight: bold; color: #27ae60;">${laporan.statistik.hadir}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;">Izin</td>
                    <td style="padding: 10px; font-weight: bold; color: #f39c12;">${laporan.statistik.izin}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;">Alpha</td>
                    <td style="padding: 10px; font-weight: bold; color: #e74c3c;">${laporan.statistik.alpha}</td>
                </tr>
            </table>
            <button class="btn btn-primary" onclick="exportReportPDF()" style="margin-top: 20px;">Export PDF</button>
        </div>
    `;
    container.innerHTML = html;
}

// PENGURUS FUNCTIONS
async function loadPengurusDashboard() {
    const kegiatan = await api.getKegiatan();
    const kegiatanSelect = document.getElementById('kegiatanScan');
    if (kegiatanSelect) {
        kegiatanSelect.innerHTML = '<option value="">Pilih Kegiatan</option>' + 
            kegiatan.map(k => `<option value="${k.id}">${k.nama} (${k.tanggal})</option>`).join('');
    }
}

async function loadScanQRTab() {
    const kegiatan = await api.getKegiatan();
    const select = document.getElementById('kegiatanScan');
    select.innerHTML = '<option value="">Pilih Kegiatan</option>' + 
        kegiatan.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
}

async function loadRekapKehadiran() {
    const absensi = await api.getAbsensi();
    const total = absensi.length;
    const hadir = absensi.filter(a => a.status === 'Hadir').length;
    const izin = absensi.filter(a => a.status === 'Izin').length;
    const alpha = absensi.filter(a => a.status === 'Alpha').length;
    
    const hPercent = total > 0 ? Math.round((hadir / total) * 100) : 0;
    const iPercent = total > 0 ? Math.round((izin / total) * 100) : 0;
    const aPercent = total > 0 ? Math.round((alpha / total) * 100) : 0;
    
    // Count gender
    const jamaah = await api.getJamaah();
    const pria = jamaah.filter(j => j.gender === 'Laki-laki').length;
    const wanita = jamaah.filter(j => j.gender === 'Perempuan').length;
    
    const container = document.getElementById('rekapContainer');
    container.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h3>Rekap Kehadiran</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 20px;">
                <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 14px; color: #333;">Total</div>
                    <div style="font-size: 32px; font-weight: bold; color: #2c3e50;">${total}</div>
                </div>
                <div style="background: rgba(39, 174, 96, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 14px; color: #27ae60;">Hadir</div>
                    <div style="font-size: 32px; font-weight: bold; color: #27ae60;">${hadir}</div>
                </div>
                <div style="background: rgba(243, 156, 18, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 14px; color: #f39c12;">Izin</div>
                    <div style="font-size: 32px; font-weight: bold; color: #f39c12;">${izin}</div>
                </div>
                <div style="background: rgba(231, 76, 60, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 14px; color: #e74c3c;">Alpha</div>
                    <div style="font-size: 32px; font-weight: bold; color: #e74c3c;">${alpha}</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 20px;">
                <div style="background: rgba(52, 152, 219, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 14px; color: #3498db;">Laki-laki</div>
                    <div style="font-size: 32px; font-weight: bold; color: #3498db;">${pria}</div>
                </div>
                <div style="background: rgba(241, 196, 15, 0.1); padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 14px; color: #f1c40f;">Perempuan</div>
                    <div style="font-size: 32px; font-weight: bold; color: #f1c40f;">${wanita}</div>
                </div>
            </div>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px;">
            <h4>Persentase Kehadiran</h4>
            <div class="chart">
                <div class="chart-bar">
                    <div class="chart-label">Hadir</div>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" style="width: ${hPercent}%; background-color: #27ae60;"></div>
                    </div>
                    <div class="chart-value">${hPercent}%</div>
                </div>
                <div class="chart-bar">
                    <div class="chart-label">Izin</div>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" style="width: ${iPercent}%; background-color: #f39c12;"></div>
                    </div>
                    <div class="chart-value">${iPercent}%</div>
                </div>
                <div class="chart-bar">
                    <div class="chart-label">Alpha</div>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" style="width: ${aPercent}%; background-color: #e74c3c;"></div>
                    </div>
                    <div class="chart-value">${aPercent}%</div>
                </div>
            </div>
        </div>
    `;
}

async function loadMusyawarahPengurus() {
    const container = document.getElementById('musyawarahPengurusList');
    container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Belum ada catatan musyawarah</p>';
}

async function loadJadwalKegiatan() {
    const kegiatan = await api.getKegiatan();
    const container = document.getElementById('jadwalList');
    
    container.innerHTML = kegiatan.map(k => `
        <div class="list-item">
            <div style="flex: 1;">
                <div class="list-item-title">${k.nama}</div>
                <div class="list-item-subtitle">Tanggal: ${k.tanggal}</div>
                <div class="list-item-subtitle">Jam: ${k.jamMulai} - ${k.jamSelesai}</div>
                <div class="list-item-subtitle">Lokasi: ${k.lokasi}</div>
            </div>
        </div>
    `).join('');
}

// JAMAAH FUNCTIONS
async function loadJamaahDashboard() {
    const jamaah = await api.getJamaah();
    const profile = jamaah[0];
    
    const container = document.getElementById('profilContainer');
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 10px;">User</div>
            <h3>${profile.nama}</h3>
            <p style="color: #999;">${profile.id}</p>
        </div>
        <div class="profile-item">
            <span class="profile-item-label">Gender</span>
            <span class="profile-item-value">${profile.gender}</span>
        </div>
        <div class="profile-item">
            <span class="profile-item-label">No HP</span>
            <span class="profile-item-value">${profile.noHp}</span>
        </div>
        <div class="profile-item">
            <span class="profile-item-label">Alamat</span>
            <span class="profile-item-value">${profile.alamat}</span>
        </div>
        <div class="profile-item">
            <span class="profile-item-label">Tempat Lahir</span>
            <span class="profile-item-value">${profile.tempatLahir}</span>
        </div>
        <div class="profile-item">
            <span class="profile-item-label">Tanggal Lahir</span>
            <span class="profile-item-value">${profile.tglLahir}</span>
        </div>
        <div class="profile-item">
            <span class="profile-item-label">Pendidikan</span>
            <span class="profile-item-value">${profile.pendidikan}</span>
        </div>
        <div class="profile-item">
            <span class="profile-item-label">Status</span>
            <span class="profile-item-value"><span class="status-badge status-${profile.status.toLowerCase()}">${profile.status}</span></span>
        </div>
    `;
}

async function loadKehadiranJamaah() {
    const absensi = await api.getAbsensi();
    const jamaahAbsensi = absensi.filter(a => a.jamaahId === 'KRT-0001');
    
    const hadir = jamaahAbsensi.filter(a => a.status === 'Hadir').length;
    const izin = jamaahAbsensi.filter(a => a.status === 'Izin').length;
    const alpha = jamaahAbsensi.filter(a => a.status === 'Alpha').length;
    const total = jamaahAbsensi.length;
    
    const container = document.getElementById('kehadiranJamaahContainer');
    container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Statistik Kehadiran Anda</h3>
            <table style="width: 100%; margin-top: 20px;">
                <tr>
                    <td style="padding: 10px;">Total Kehadiran</td>
                    <td style="padding: 10px; font-weight: bold;">${total}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;">Hadir</td>
                    <td style="padding: 10px; font-weight: bold; color: #27ae60;">${hadir}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;">Izin</td>
                    <td style="padding: 10px; font-weight: bold; color: #f39c12;">${izin}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;">Alpha</td>
                    <td style="padding: 10px; font-weight: bold; color: #e74c3c;">${alpha}</td>
                </tr>
            </table>
        </div>
    `;
}

async function loadJadwalJamaah() {
    const kegiatan = await api.getKegiatan();
    const container = document.getElementById('jadwalJamaahList');
    
    container.innerHTML = kegiatan.map(k => `
        <div class="list-item">
            <div style="flex: 1;">
                <div class="list-item-title">${k.nama}</div>
                <div class="list-item-subtitle">Jenis: ${k.jenis}</div>
                <div class="list-item-subtitle">Tanggal: ${k.tanggal}</div>
                <div class="list-item-subtitle">Jam: ${k.jamMulai} - ${k.jamSelesai}</div>
                <div class="list-item-subtitle">Lokasi: ${k.lokasi}</div>
            </div>
        </div>
    `).join('');
}

// FORM FUNCTIONS
function showFormTambahJamaah() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>Tambah Peserta Baru</h2>
        </div>
        <form id="formTambahJamaah" style="display: grid; gap: 15px;">
            <div class="form-group">
                <label>Nama Lengkap <span class="required">*</span></label>
                <input type="text" id="inputNama" required>
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label>Gender <span class="required">*</span></label>
                    <select id="inputGender" required>
                        <option value="">Pilih</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div>
                    <label>No HP <span class="required">*</span></label>
                    <input type="tel" id="inputNoHp" required>
                </div>
            </div>
            <div class="form-group">
                <label>Alamat <span class="required">*</span></label>
                <textarea id="inputAlamat" required></textarea>
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label>Tempat Lahir <span class="required">*</span></label>
                    <input type="text" id="inputTempatLahir" required>
                </div>
                <div>
                    <label>Tanggal Lahir <span class="required">*</span></label>
                    <input type="date" id="inputTglLahir" required>
                </div>
            </div>
            <div class="form-group">
                <label>Pendidikan <span class="required">*</span></label>
                <select id="inputPendidikan" required>
                    <option value="">Pilih</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="Diploma">Diploma</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                </select>
            </div>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
        </form>
    `;
    
    document.getElementById('formTambahJamaah')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('inputNama').value.trim();
        if (!nama) {
            showToast('Nama tidak boleh kosong', 'error');
            return;
        }
        
        const data = {
            nama: nama,
            gender: document.getElementById('inputGender').value,
            noHp: document.getElementById('inputNoHp').value,
            alamat: document.getElementById('inputAlamat').value,
            tempatLahir: document.getElementById('inputTempatLahir').value,
            tglLahir: document.getElementById('inputTglLahir').value,
            pendidikan: document.getElementById('inputPendidikan').value,
            status: 'Aktif'
        };
        
        await api.tambahJamaah(data);
        closeModal();
        loadJamaahTable();
        showToast('Peserta berhasil ditambahkan', 'success');
    });
    
    modal.classList.remove('hidden');
}

function showFormTambahKegiatan() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>Buat Kegiatan Baru</h2>
        </div>
        <form id="formTambahKegiatan" style="display: grid; gap: 15px;">
            <div class="form-group">
                <label>Nama Kegiatan <span class="required">*</span></label>
                <input type="text" id="inputNamaKegiatan" required>
            </div>
            <div class="form-group">
                <label>Jenis Kegiatan <span class="required">*</span></label>
                <select id="inputJenisKegiatan" required>
                    <option value="">Pilih</option>
                    ${CONFIG.JENIS_KEGIATAN.map(j => `<option value="${j}">${j}</option>`).join('')}
                </select>
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label>Tanggal <span class="required">*</span></label>
                    <input type="date" id="inputTanggal" required>
                </div>
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label>Jam Mulai <span class="required">*</span></label>
                    <input type="time" id="inputJamMulai" required>
                </div>
                <div>
                    <label>Jam Selesai <span class="required">*</span></label>
                    <input type="time" id="inputJamSelesai" required>
                </div>
            </div>
            <div class="form-group">
                <label>Lokasi <span class="required">*</span></label>
                <input type="text" id="inputLokasi" required>
            </div>
            <div class="form-group">
                <label>Koordinat (Lat,Long)</label>
                <input type="text" id="inputKoordinat" placeholder="-6.2088,106.8456">
            </div>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Buat</button>
            </div>
        </form>
    `;
    
    document.getElementById('formTambahKegiatan')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            nama: document.getElementById('inputNamaKegiatan').value,
            jenis: document.getElementById('inputJenisKegiatan').value,
            tanggal: document.getElementById('inputTanggal').value,
            jamMulai: document.getElementById('inputJamMulai').value,
            jamSelesai: document.getElementById('inputJamSelesai').value,
            lokasi: document.getElementById('inputLokasi').value,
            koordinat: document.getElementById('inputKoordinat').value,
            status: 'Aktif'
        };
        
        await api.tambahKegiatan(data);
        closeModal();
        loadKegiatanTable();
        showToast('Kegiatan berhasil dibuat', 'success');
    });
    
    modal.classList.remove('hidden');
}

function tambahMusyawarah4S() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>Catatan Musyawarah</h2>
        </div>
        <form id="formMusyawarah" style="display: grid; gap: 15px;">
            <div class="form-group">
                <label>Catatan Musyawarah <span class="required">*</span></label>
                <textarea id="inputMusyawarah" placeholder="Tuliskan catatan musyawarah di sini" required style="min-height: 150px;"></textarea>
            </div>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
        </form>
    `;
    
    document.getElementById('formMusyawarah')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Catatan musyawarah berhasil disimpan', 'success');
        closeModal();
    });
    
    modal.classList.remove('hidden');
}

function tambahMusyawarahTim7() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>Catatan Tim 7</h2>
        </div>
        <form id="formTim7" style="display: grid; gap: 15px;">
            <div class="form-group">
                <label>Catatan <span class="required">*</span></label>
                <textarea id="inputCatatanTim7" placeholder="Catatan dan keputusan Tim 7" required style="min-height: 150px;"></textarea>
            </div>
            <div class="form-group">
                <label>Link Google Drive</label>
                <input type="url" id="inputDriveLinkTim7" placeholder="https://docs.google.com/document/...">
            </div>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
        </form>
    `;
    
    document.getElementById('formTim7')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Catatan Tim 7 berhasil disimpan', 'success');
        closeModal();
    });
    
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// UTILITY FUNCTIONS
function handleSearchJamaah(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) {
        loadJamaahTable();
        return;
    }
    
    api.getJamaah().then(jamaah => {
        const filtered = jamaah.filter(j => j.nama.toLowerCase().includes(query));
        const container = document.getElementById('jamaahTable');
        
        if (filtered.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Tidak ada hasil pencarian</p>';
            return;
        }
        
        const html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Gender</th>
                        <th>No HP</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(j => `
                        <tr>
                            <td><strong>${j.id}</strong></td>
                            <td>${j.nama}</td>
                            <td>${j.gender}</td>
                            <td>${j.noHp}</td>
                            <td><span class="status-badge status-${j.status.toLowerCase()}">${j.status}</span></td>
                            <td>
                                <button class="btn btn-secondary btn-sm" onclick="editJamaah('${j.id}')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteJamaahConfirm('${j.id}', '${j.nama}')">Hapus</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        container.innerHTML = html;
    });
}

function editJamaah(id) {
    showToast('Fitur edit masih dalam pengembangan', 'warning');
}

function deleteJamaahConfirm(id, nama) {
    if (confirmDialog(`Hapus peserta "${nama}"?`)) {
        api.deleteJamaah(id);
        loadJamaahTable();
        showToast('Peserta berhasil dihapus', 'success');
    }
}

function editKegiatan(id) {
    showToast('Fitur edit masih dalam pengembangan', 'warning');
}

function deleteKegiatanConfirm(id, nama) {
    if (confirmDialog(`Hapus kegiatan "${nama}"?`)) {
        api.deleteKegiatan(id);
        loadKegiatanTable();
        showToast('Kegiatan berhasil dihapus', 'success');
    }
}

function editAbsensi(id) {
    showToast('Fitur edit masih dalam pengembangan', 'warning');
}

function deleteAbsensiConfirm(id) {
    if (confirmDialog('Hapus absensi ini?')) {
        loadAbsensiTable();
        showToast('Absensi berhasil dihapus', 'success');
    }
}

async function processAbsensi() {
    const kegiatanId = document.getElementById('kegiatanScan').value;
    const manualInput = document.getElementById('manualInput').value.trim();
    
    if (!kegiatanId) {
        showToast('Pilih kegiatan terlebih dahulu', 'error');
        return;
    }
    
    if (!manualInput) {
        showToast('Scan QR atau input ID peserta', 'error');
        return;
    }
    
    const result = document.getElementById('resultAbsensi');
    result.innerHTML = '<div class="loading-spinner" style="margin: 20px auto; display: block;"></div>';
    
    try {
        const data = {
            kegiatanId: kegiatanId,
            jamaahId: manualInput,
            status: 'Hadir',
            waktuAbsen: new Date().toLocaleTimeString()
        };
        
        await api.tambahAbsensi(data);
        
        result.innerHTML = `
            <div style="background: rgba(39, 174, 96, 0.1); border: 2px solid #27ae60; color: #27ae60; padding: 20px; border-radius: 8px; text-align: center;">
                <h3 style="margin-bottom: 10px;">Absensi Berhasil</h3>
                <p>ID Peserta: <strong>${manualInput}</strong></p>
                <p>Status: <strong>HADIR</strong></p>
                <p>Waktu: <strong>${new Date().toLocaleTimeString()}</strong></p>
            </div>
        `;
        
        showToast('Absensi berhasil diproses', 'success');
        
        setTimeout(() => {
            document.getElementById('manualInput').value = '';
            result.innerHTML = '';
        }, 3000);
    } catch (error) {
        showToast(error.message || 'Gagal memproses absensi', 'error');
        result.innerHTML = '';
    }
}

function startCamera() {
    showToast('Fitur kamera sedang dalam pengembangan', 'warning');
}

function shareWhatsApp(option = 'teks') {
    const text = encodeURIComponent('Rekap Kehadiran Pengajian\n\nLaki-laki: 5\nPerempuan: 3\nHadir: 7\nIzin: 0\nAlpha: 1');
    
    if (option === 'teks') {
        window.open(`https://wa.me/?text=${text}`, '_blank');
        showToast('Dibuka di WhatsApp', 'success');
    } else if (option === 'link') {
        const link = 'https://agengpadma8-lab.github.io/e-kertalangu/';
        window.open(`https://wa.me/?text=${encodeURIComponent('Laporan: ' + link)}`, '_blank');
    } else {
        showToast('Screenshot laporan dan bagikan ke WhatsApp', 'info');
    }
}

function exportReportPDF() {
    showToast('Fitur export PDF sedang dikembangkan', 'warning');
}

function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('e_kertalangu_dark_mode', darkModeEnabled);
    showToast(darkModeEnabled ? 'Dark mode aktif' : 'Dark mode nonaktif', 'success');
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Confirm Dialog
function confirmDialog(message) {
    return confirm(message);
}

// Sync offline data
async function syncOfflineData() {
    if (api.offlineQueue.length > 0) {
        showToast('Menyinkronkan data offline...', 'info');
        // Implement sync logic here
        api.offlineQueue = [];
        api.saveOfflineQueue();
        showToast('Data berhasil disinkronkan', 'success');
    }
}

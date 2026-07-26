// Main Application Logic

let currentUser = null;

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
    
    if (user) {
        currentUser = JSON.parse(user);
        showDashboard();
    } else {
        showLoginPage();
    }
    
    setupEventListeners();
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
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem(CONFIG.LOCAL_KEYS.USER_INFO, JSON.stringify(user));
        showDashboard();
    } else {
        alert('Username atau password salah!');
    }
}

function handleLogout() {
    localStorage.removeItem(CONFIG.LOCAL_KEYS.USER_INFO);
    currentUser = null;
    showLoginPage();
}

function showLoginPage() {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById('loginPage').classList.remove('hidden');
}

function showDashboard() {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    if (currentUser.role === 'admin') {
        document.getElementById('adminPage').classList.remove('hidden');
        document.getElementById('userDisplay').textContent = `👤 ${currentUser.name}`;
        loadAdminDashboard();
    } else if (currentUser.role === 'pengurus') {
        document.getElementById('pengurusPage').classList.remove('hidden');
        document.getElementById('userDisplayPengurus').textContent = `👤 ${currentUser.name}`;
        loadPengurusDashboard();
    } else {
        document.getElementById('jamaahPage').classList.remove('hidden');
        document.getElementById('userDisplayJamaah').textContent = `👤 ${currentUser.name}`;
        loadJamaahDashboard();
    }
}

function handleTabClick(e) {
    const tabName = e.target.dataset.tab;
    
    // Deactivate all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Activate selected tab
    e.target.classList.add('active');
    document.getElementById(tabName)?.classList.add('active');
    
    // Load tab data
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
        case 'rekap':
            loadRekapKehadiran();
            break;
        case 'jadwal':
            loadJadwalKegiatan();
            break;
    }
}

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
    
    // Load kegiatan hari ini
    const today = new Date().toISOString().split('T')[0];
    const kegiatanHariIni = kegiatan.filter(k => k.tanggal === today);
    const container = document.getElementById('kegiatanHariIni');
    container.innerHTML = kegiatanHariIni.map(k => `
        <div class="kegiatan-item">
            <h4>${k.nama}</h4>
            <div class="kegiatan-item-detail">⏰ ${k.jamMulai} - ${k.jamSelesai}</div>
            <div class="kegiatan-item-detail">📍 ${k.lokasi}</div>
            <div class="kegiatan-item-detail">👥 ${k.pesertaTerdaftar} peserta</div>
        </div>
    `).join('');
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
                    <th>Alamat</th>
                    <th>Pendidikan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${jamaah.map(j => `
                    <tr>
                        <td>${j.id}</td>
                        <td>${j.nama}</td>
                        <td>${j.gender}</td>
                        <td>${j.noHp}</td>
                        <td>${j.alamat}</td>
                        <td>${j.pendidikan}</td>
                        <td><span class="status-badge status-${j.status.toLowerCase()}">${j.status}</span></td>
                        <td>
                            <button class="btn btn-secondary" onclick="editJamaah('${j.id}')">✎</button>
                            <button class="btn btn-danger" onclick="deleteJamaah('${j.id}')">🗑</button>
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
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${kegiatan.map(k => `
                    <tr>
                        <td>${k.id}</td>
                        <td>${k.nama}</td>
                        <td>${k.jenis}</td>
                        <td>${k.tanggal}</td>
                        <td>${k.jamMulai} - ${k.jamSelesai}</td>
                        <td>${k.lokasi}</td>
                        <td><span class="status-badge status-aktif">${k.status}</span></td>
                        <td>
                            <button class="btn btn-secondary" onclick="editKegiatan('${k.id}')">✎</button>
                            <button class="btn btn-danger" onclick="deleteKegiatan('${k.id}')">🗑</button>
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
                    <th>Nama Peserta</th>
                    <th>Status</th>
                    <th>Waktu Absen</th>
                    <th>Catatan</th>
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
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

async function loadRekapKehadiran() {
    const absensi = await api.getAbsensi();
    const total = absensi.length;
    const hadir = absensi.filter(a => a.status === 'Hadir').length;
    const izin = absensi.filter(a => a.status === 'Izin').length;
    const alpha = absensi.filter(a => a.status === 'Alpha').length;
    
    const hPercent = Math.round((hadir / total) * 100);
    const iPercent = Math.round((izin / total) * 100);
    const aPercent = Math.round((alpha / total) * 100);
    
    const container = document.getElementById('rekapContainer');
    container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3>Rekap Kehadiran</h3>
            <div style="margin: 20px 0;">
                <div style="font-size: 18px; font-weight: bold; margin: 10px 0;">
                    Total: ${total} orang
                </div>
                <div style="font-size: 18px; font-weight: bold; margin: 10px 0; color: green;">
                    ✅ Hadir: ${hadir} orang
                </div>
                <div style="font-size: 18px; font-weight: bold; margin: 10px 0; color: orange;">
                    ⏳ Izin: ${izin} orang
                </div>
                <div style="font-size: 18px; font-weight: bold; margin: 10px 0; color: red;">
                    ❌ Alpha: ${alpha} orang
                </div>
            </div>
            <div style="margin-top: 30px;">
                <h4>📊 Persentase</h4>
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
        </div>
    `;
}

async function loadJadwalKegiatan() {
    const kegiatan = await api.getKegiatan();
    const container = document.getElementById('jadwalList');
    
    container.innerHTML = kegiatan.map(k => `
        <div class="list-item">
            <div>
                <div class="list-item-title">${k.nama}</div>
                <div class="list-item-subtitle">📅 ${k.tanggal} | ⏰ ${k.jamMulai}-${k.jamSelesai}</div>
                <div class="list-item-subtitle">📍 ${k.lokasi}</div>
            </div>
            <button class="btn btn-primary" onclick="viewDetail('${k.id}')">Lihat Detail</button>
        </div>
    `).join('');
}

async function loadAdminDashboard() {
    // Already implemented above
}

async function loadPengurusDashboard() {
    // Load kegiatan untuk dropdown
    const kegiatan = await api.getKegiatan();
    const kegiatanSelect = document.getElementById('kegiatanScan');
    kegiatanSelect.innerHTML = '<option value="">Pilih Kegiatan</option>' + 
        kegiatan.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
}

async function loadJamaahDashboard() {
    // Load profil jamaah
    const jamaah = await api.getJamaah();
    // Find current user's jamaah data
    const profile = jamaah[0]; // Demo
    
    const container = document.getElementById('profilContainer');
    container.innerHTML = `
        <div class="profile-container">
            <div class="profile-item">
                <span class="profile-item-label">ID:</span>
                <span class="profile-item-value">${profile.id}</span>
            </div>
            <div class="profile-item">
                <span class="profile-item-label">Nama:</span>
                <span class="profile-item-value">${profile.nama}</span>
            </div>
            <div class="profile-item">
                <span class="profile-item-label">Gender:</span>
                <span class="profile-item-value">${profile.gender}</span>
            </div>
            <div class="profile-item">
                <span class="profile-item-label">No HP:</span>
                <span class="profile-item-value">${profile.noHp}</span>
            </div>
            <div class="profile-item">
                <span class="profile-item-label">Alamat:</span>
                <span class="profile-item-value">${profile.alamat}</span>
            </div>
            <div class="profile-item">
                <span class="profile-item-label">Tempat Lahir:</span>
                <span class="profile-item-value">${profile.tempatLahir}</span>
            </div>
            <div class="profile-item">
                <span class="profile-item-label">Tanggal Lahir:</span>
                <span class="profile-item-value">${profile.tglLahir}</span>
            </div>
            <div class="profile-item">
                <span class="profile-item-label">Pendidikan:</span>
                <span class="profile-item-value">${profile.pendidikan}</span>
            </div>
        </div>
    `;
}

function handleSearchJamaah(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) {
        loadJamaahTable();
        return;
    }
    
    // Filter jamaah berdasarkan query
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
                        <th>Alamat</th>
                        <th>Pendidikan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(j => `
                        <tr>
                            <td>${j.id}</td>
                            <td>${j.nama}</td>
                            <td>${j.gender}</td>
                            <td>${j.noHp}</td>
                            <td>${j.alamat}</td>
                            <td>${j.pendidikan}</td>
                            <td><span class="status-badge status-${j.status.toLowerCase()}">${j.status}</span></td>
                            <td>
                                <button class="btn btn-secondary" onclick="editJamaah('${j.id}')">✎</button>
                                <button class="btn btn-danger" onclick="deleteJamaah('${j.id}')">🗑</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        container.innerHTML = html;
    });
}

// Form Handlers
function showFormTambahJamaah() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>Tambah Peserta Baru</h2>
        <form id="formTambahJamaah">
            <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" id="inputNama" required>
            </div>
            <div class="form-group">
                <label>Gender</label>
                <select id="inputGender" required>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
            </div>
            <div class="form-group">
                <label>No HP</label>
                <input type="tel" id="inputNoHp" required>
            </div>
            <div class="form-group">
                <label>Alamat</label>
                <textarea id="inputAlamat" required></textarea>
            </div>
            <div class="form-group">
                <label>Tempat Lahir</label>
                <input type="text" id="inputTempatLahir" required>
            </div>
            <div class="form-group">
                <label>Tanggal Lahir</label>
                <input type="date" id="inputTglLahir" required>
            </div>
            <div class="form-group">
                <label>Pendidikan Terakhir</label>
                <select id="inputPendidikan" required>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="Diploma">Diploma</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Simpan</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
        </form>
    `;
    
    document.getElementById('formTambahJamaah')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            nama: document.getElementById('inputNama').value,
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
        alert('Peserta berhasil ditambahkan!');
    });
    
    modal.classList.remove('hidden');
}

function showFormTambahKegiatan() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>Buat Kegiatan Baru</h2>
        <form id="formTambahKegiatan">
            <div class="form-group">
                <label>Nama Kegiatan</label>
                <input type="text" id="inputNamaKegiatan" required>
            </div>
            <div class="form-group">
                <label>Jenis Kegiatan</label>
                <select id="inputJenisKegiatan" required>
                    ${CONFIG.JENIS_KEGIATAN.map(j => `<option value="${j}">${j}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Tanggal</label>
                <input type="date" id="inputTanggal" required>
            </div>
            <div class="form-group">
                <label>Jam Mulai</label>
                <input type="time" id="inputJamMulai" required>
            </div>
            <div class="form-group">
                <label>Jam Selesai</label>
                <input type="time" id="inputJamSelesai" required>
            </div>
            <div class="form-group">
                <label>Lokasi</label>
                <input type="text" id="inputLokasi" required>
            </div>
            <div class="form-group">
                <label>Koordinat (Lat,Long)</label>
                <input type="text" id="inputKoordinat" placeholder="-6.2088,106.8456">
            </div>
            <button type="submit" class="btn btn-primary">Buat Kegiatan</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
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
        alert('Kegiatan berhasil dibuat!');
    });
    
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Utility Functions
function editJamaah(id) {
    alert('Edit Jamaah: ' + id);
}

function deleteJamaah(id) {
    if (confirm('Yakin ingin menghapus?')) {
        api.deleteJamaah(id);
        loadJamaahTable();
    }
}

function editKegiatan(id) {
    alert('Edit Kegiatan: ' + id);
}

function deleteKegiatan(id) {
    if (confirm('Yakin ingin menghapus?')) {
        api.deleteKegiatan(id);
        loadKegiatanTable();
    }
}

function processAbsensi() {
    const kegiatanId = document.getElementById('kegiatanScan').value;
    const manualInput = document.getElementById('manualInput').value;
    
    if (!kegiatanId) {
        alert('Pilih kegiatan terlebih dahulu!');
        return;
    }
    
    if (!manualInput) {
        alert('Scan QR atau input ID peserta!');
        return;
    }
    
    const result = document.getElementById('resultAbsensi');
    result.innerHTML = `
        <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px;">
            <h3>✅ Absensi Berhasil!</h3>
            <p>ID Peserta: ${manualInput}</p>
            <p>Status: Hadir</p>
            <p>Waktu: ${new Date().toLocaleTimeString()}</p>
        </div>
    `;
    
    setTimeout(() => {
        document.getElementById('manualInput').value = '';
        result.innerHTML = '';
    }, 3000);
}

function startCamera() {
    alert('Fitur kamera sedang dalam pengembangan. Gunakan input manual untuk demo.');
}

function shareWhatsApp() {
    const text = encodeURIComponent('Rekap Kehadiran Pengajian Pagi 26 Juli 2026\n\nHadir: 5\nIzin: 0\nAlpha: 5\n\nPersentase Hadir: 50%');
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function tambahMusyawarah() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>Catatan Musyawarah 4S</h2>
        <form id="formMusyawarah">
            <div class="form-group">
                <label>Kiri 1 (Pengurus 1)</label>
                <textarea id="inputKiri1" required></textarea>
            </div>
            <div class="form-group">
                <label>Kiri 2 (Pengurus 2)</label>
                <textarea id="inputKiri2" required></textarea>
            </div>
            <div class="form-group">
                <label>Kanan 1 (Pengurus 3)</label>
                <textarea id="inputKanan1" required></textarea>
            </div>
            <div class="form-group">
                <label>Kanan 2 (All Tim 7)</label>
                <textarea id="inputKanan2" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Simpan</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
        </form>
    `;
    
    document.getElementById('formMusyawarah')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Catatan musyawarah berhasil disimpan!');
        closeModal();
    });
    
    modal.classList.remove('hidden');
}

function exportJamaahExcel() {
    alert('Fitur export Excel sedang dikembangkan.');
}

function showImportForm() {
    alert('Fitur import data sedang dikembangkan.');
}

function generateLaporan() {
    alert('Laporan bulanan berhasil di-generate!');
}

function viewDetail(id) {
    alert('Detail Kegiatan: ' + id);
}

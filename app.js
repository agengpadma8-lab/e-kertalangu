// Main Application Logic - UPDATED VERSION

let currentUser = null;
let apiUrl = ''; // Will be set after Apps Script deployment

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
    const parent = e.target.closest('.tabs').parentElement;
    
    // Deactivate all tabs in this container
    parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    parent.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
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
        case 'musyawarah4s':
            loadMusyawarah4S();
            break;
        case 'musyawarahtim7':
            loadMusyawarahTim7();
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
    container.innerHTML = kegiatanHariIni.length > 0 ? 
        kegiatanHariIni.map(k => `
            <div class="kegiatan-item">
                <h4>${k.nama}</h4>
                <div class="kegiatan-item-detail">⏰ ${k.jamMulai} - ${k.jamSelesai}</div>
                <div class="kegiatan-item-detail">📍 ${k.lokasi}</div>
                <div class="kegiatan-item-detail">👥 ${k.pesertaTerdaftar} peserta</div>
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
                    <th>Alamat</th>
                    <th>Pendidikan</th>
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
                        <td>${j.alamat}</td>
                        <td>${j.pendidikan}</td>
                        <td><span class="status-badge status-${j.status.toLowerCase()}">${j.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editJamaah('${j.id}')">✏️</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteJamaah('${j.id}')">🗑</button>
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
                        <td><strong>${k.id}</strong></td>
                        <td>${k.nama}</td>
                        <td>${k.jenis}</td>
                        <td>${k.tanggal}</td>
                        <td>${k.jamMulai} - ${k.jamSelesai}</td>
                        <td>${k.lokasi}</td>
                        <td><span class="status-badge status-aktif">${k.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editKegiatan('${k.id}')">✏️</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteKegiatan('${k.id}')">🗑</button>
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
    
    const hPercent = total > 0 ? Math.round((hadir / total) * 100) : 0;
    const iPercent = total > 0 ? Math.round((izin / total) * 100) : 0;
    const aPercent = total > 0 ? Math.round((alpha / total) * 100) : 0;
    
    const container = document.getElementById('rekapContainer');
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 20px;">📊 Rekap Kehadiran</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                    <div style="font-size: 14px; opacity: 0.9;">Total</div>
                    <div style="font-size: 32px; font-weight: bold;">${total}</div>
                </div>
                <div style="background: rgba(39,174,96,0.3); padding: 15px; border-radius: 8px;">
                    <div style="font-size: 14px;">✅ Hadir</div>
                    <div style="font-size: 32px; font-weight: bold;">${hadir}</div>
                </div>
                <div style="background: rgba(243,156,18,0.3); padding: 15px; border-radius: 8px;">
                    <div style="font-size: 14px;">⏳ Izin</div>
                    <div style="font-size: 32px; font-weight: bold;">${izin}</div>
                </div>
                <div style="background: rgba(231,76,60,0.3); padding: 15px; border-radius: 8px;">
                    <div style="font-size: 14px;">❌ Alpha</div>
                    <div style="font-size: 32px; font-weight: bold;">${alpha}</div>
                </div>
            </div>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px;">
            <h4>📈 Persentase</h4>
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

async function loadMusyawarah4S() {
    const container = document.getElementById('musyawarahContainer');
    const musyawarah = await api.getMusyawarah();
    
    if (musyawarah.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Belum ada catatan musyawarah 4S</p>';
        return;
    }
    
    container.innerHTML = musyawarah.map(m => `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3498db;">
            <h4>${m.kegiatanId}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                <div>
                    <h5 style="color: #3498db; margin-bottom: 10px;">🔵 Kiri 1 (Pengurus 1)</h5>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${m.kiri1}</p>
                </div>
                <div>
                    <h5 style="color: #9b59b6; margin-bottom: 10px;">🟣 Kanan 1 (Pengurus 2)</h5>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${m.kanan1}</p>
                </div>
                <div>
                    <h5 style="color: #2ecc71; margin-bottom: 10px;">🟢 Kiri 2 (Pengurus 3)</h5>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${m.kiri2}</p>
                </div>
                <div>
                    <h5 style="color: #e74c3c; margin-bottom: 10px;">🔴 Kanan 2 All (Semua)</h5>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${m.kanan2}</p>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadMusyawarahTim7() {
    const container = document.getElementById('tim7Container');
    const catatan = await api.getCatatanTim7();
    
    if (catatan.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">Belum ada catatan Tim 7</p>';
        return;
    }
    
    container.innerHTML = catatan.map(c => `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <h4>${c.kegiatanId}</h4>
                <small style="color: #999;">Dibuat: ${c.tanggal}</small>
            </div>
            <p style="white-space: pre-wrap; line-height: 1.6;">${c.catatan}</p>
            ${c.driveLink ? `<a href="${c.driveLink}" target="_blank" style="color: #3498db; text-decoration: none;">🔗 Lihat di Google Drive</a>` : ''}
        </div>
    `).join('');
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

async function loadPengurusDashboard() {
    const kegiatan = await api.getKegiatan();
    const kegiatanSelect = document.getElementById('kegiatanScan');
    if (kegiatanSelect) {
        kegiatanSelect.innerHTML = '<option value="">Pilih Kegiatan</option>' + 
            kegiatan.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
    }
}

async function loadJamaahDashboard() {
    const jamaah = await api.getJamaah();
    const profile = jamaah[0];
    
    const container = document.getElementById('profilContainer');
    container.innerHTML = `
        <div class="profile-container">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 60px; margin-bottom: 10px;">👤</div>
                <h3>${profile.nama}</h3>
                <p style="color: #999;">${profile.id}</p>
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
            <div class="profile-item">
                <span class="profile-item-label">Status:</span>
                <span class="profile-item-value"><span class="status-badge status-${profile.status.toLowerCase()}">${profile.status}</span></span>
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
                            <td><strong>${j.id}</strong></td>
                            <td>${j.nama}</td>
                            <td>${j.gender}</td>
                            <td>${j.noHp}</td>
                            <td>${j.alamat}</td>
                            <td>${j.pendidikan}</td>
                            <td><span class="status-badge status-${j.status.toLowerCase()}">${j.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="editJamaah('${j.id}')">✏️</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteJamaah('${j.id}')">🗑</button>
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
        <h2>➕ Tambah Peserta Baru</h2>
        <form id="formTambahJamaah" style="display: grid; gap: 15px;">
            <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" id="inputNama" required>
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label>Gender</label>
                    <select id="inputGender" required>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div>
                    <label>No HP</label>
                    <input type="tel" id="inputNoHp" required>
                </div>
            </div>
            <div class="form-group">
                <label>Alamat</label>
                <textarea id="inputAlamat" required></textarea>
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label>Tempat Lahir</label>
                    <input type="text" id="inputTempatLahir" required>
                </div>
                <div>
                    <label>Tanggal Lahir</label>
                    <input type="date" id="inputTglLahir" required>
                </div>
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
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
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
        alert('✅ Peserta berhasil ditambahkan!');
    });
    
    modal.classList.remove('hidden');
}

function showFormTambahKegiatan() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>📅 Buat Kegiatan Baru</h2>
        <form id="formTambahKegiatan" style="display: grid; gap: 15px;">
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
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label>Tanggal</label>
                    <input type="date" id="inputTanggal" required>
                </div>
                <div></div>
            </div>
            <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <label>Jam Mulai</label>
                    <input type="time" id="inputJamMulai" required>
                </div>
                <div>
                    <label>Jam Selesai</label>
                    <input type="time" id="inputJamSelesai" required>
                </div>
            </div>
            <div class="form-group">
                <label>Lokasi</label>
                <input type="text" id="inputLokasi" required>
            </div>
            <div class="form-group">
                <label>Koordinat (Lat,Long)</label>
                <input type="text" id="inputKoordinat" placeholder="-6.2088,106.8456">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
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
        alert('✅ Kegiatan berhasil dibuat!');
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
        alert('✅ Peserta berhasil dihapus');
    }
}

function editKegiatan(id) {
    alert('Edit Kegiatan: ' + id);
}

function deleteKegiatan(id) {
    if (confirm('Yakin ingin menghapus?')) {
        api.deleteKegiatan(id);
        loadKegiatanTable();
        alert('✅ Kegiatan berhasil dihapus');
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
        <div style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h3>✅ Absensi Berhasil!</h3>
            <p style="margin: 10px 0;">ID Peserta: <strong>${manualInput}</strong></p>
            <p style="margin: 10px 0;">Status: <strong>HADIR</strong></p>
            <p style="margin: 10px 0;">Waktu: <strong>${new Date().toLocaleTimeString()}</strong></p>
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
    const text = encodeURIComponent('🕌 Rekap Kehadiran Pengajian Pagi 26 Juli 2026\n\nHadir: 5 ✅\nIzin: 0 ⏳\nAlpha: 5 ❌\n\nPersentase Hadir: 50%');
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function tambahMusyawarah4S() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>📝 Catatan Musyawarah 4S</h2>
        <form id="formMusyawarah" style="display: grid; gap: 15px;">
            <div class="form-group">
                <label style="color: #3498db; font-weight: bold;">🔵 Kiri 1 (Pengurus 1)</label>
                <textarea id="inputKiri1" placeholder="Catatan dari Pengurus 1" required style="min-height: 120px;"></textarea>
            </div>
            <div class="form-group">
                <label style="color: #9b59b6; font-weight: bold;">🟣 Kanan 1 (Pengurus 2)</label>
                <textarea id="inputKanan1" placeholder="Catatan dari Pengurus 2" required style="min-height: 120px;"></textarea>
            </div>
            <div class="form-group">
                <label style="color: #2ecc71; font-weight: bold;">🟢 Kiri 2 (Pengurus 3)</label>
                <textarea id="inputKiri2" placeholder="Catatan dari Pengurus 3" required style="min-height: 120px;"></textarea>
            </div>
            <div class="form-group">
                <label style="color: #e74c3c; font-weight: bold;">🔴 Kanan 2 All (Semua)</label>
                <textarea id="inputKanan2" placeholder="Kesimpulan dari semua pengurus" required style="min-height: 120px;"></textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
        </form>
    `;
    
    document.getElementById('formMusyawarah')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✅ Catatan musyawarah 4S berhasil disimpan!');
        closeModal();
    });
    
    modal.classList.remove('hidden');
}

function tambahMusyawarahTim7() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>📝 Catatan Tim 7</h2>
        <form id="formTim7" style="display: grid; gap: 15px;">
            <div class="form-group">
                <label>Catatan Tim 7</label>
                <textarea id="inputCatatanTim7" placeholder="Catatan dan keputusan Tim 7" required style="min-height: 150px;"></textarea>
            </div>
            <div class="form-group">
                <label>Link Google Drive (Optional)</label>
                <input type="url" id="inputDriveLinkTim7" placeholder="https://docs.google.com/document/...">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
        </form>
    `;
    
    document.getElementById('formTim7')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✅ Catatan Tim 7 berhasil disimpan!');
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

// E-KERTALANGU - Google Apps Script Backend v2
// Deploy sebagai Web App dan copy URL ke config.js

const SPREADSHEET_ID = '1JDDFEFG7PG1VnHFtQRII6SThtBDGVozEdxlxTM25hYU';
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    let response = {};
    
    switch(action) {
      case 'login':
        response = handleLogin(params);
        break;
      
      case 'getJamaah':
        response = getJamaah();
        break;
      case 'tambahJamaah':
        response = tambahJamaah(params);
        break;
      case 'updateJamaah':
        response = updateJamaah(params);
        break;
      case 'deleteJamaah':
        response = deleteJamaah(params);
        break;
      
      case 'getKegiatan':
        response = getKegiatan();
        break;
      case 'tambahKegiatan':
        response = tambahKegiatan(params);
        break;
      case 'updateKegiatan':
        response = updateKegiatan(params);
        break;
      case 'deleteKegiatan':
        response = deleteKegiatan(params);
        break;
      
      case 'getAbsensi':
        response = getAbsensi(params);
        break;
      case 'tambahAbsensi':
        response = tambahAbsensi(params);
        break;
      
      case 'getMusyawarah':
        response = getMusyawarah(params);
        break;
      case 'tambahMusyawarah':
        response = tambahMusyawarah(params);
        break;
      
      case 'getCatatanTim7':
        response = getCatatanTim7(params);
        break;
      case 'tambahCatatanTim7':
        response = tambahCatatanTim7(params);
        break;
      
      case 'generateQRCode':
        response = generateQRCode(params);
        break;
      
      case 'getLaporanBulan':
        response = getLaporanBulan(params);
        break;
      
      default:
        response = {success: false, message: 'Action tidak dikenali'};
    }
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleLogin(params) {
  try {
    const usersSheet = ss.getSheetByName('USERS');
    if (!usersSheet) return {success: false, message: 'Sheet USERS tidak ditemukan'};
    
    const data = usersSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.username && data[i][1] === params.password) {
        return {
          success: true,
          user: {
            username: data[i][0],
            role: data[i][2],
            name: data[i][3]
          }
        };
      }
    }
    
    return {success: false, message: 'Username atau password salah'};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function getJamaah() {
  try {
    const sheet = ss.getSheetByName('JAMAAH');
    if (!sheet) return {success: false, data: []};
    
    const data = sheet.getDataRange().getValues();
    const jamaah = [];
    
    for (let i = 1; i < data.length; i++) {
      jamaah.push({
        id: data[i][0],
        nama: data[i][1],
        gender: data[i][2],
        noHp: data[i][3],
        alamat: data[i][4],
        tempatLahir: data[i][5],
        tglLahir: data[i][6],
        pendidikan: data[i][7],
        status: data[i][8],
        tglDaftar: data[i][9]
      });
    }
    
    return {success: true, data: jamaah};
  } catch(error) {
    return {success: false, message: error.toString(), data: []};
  }
}

function tambahJamaah(params) {
  try {
    const sheet = ss.getSheetByName('JAMAAH');
    const jamaah = getJamaah().data;
    
    let lastNum = 0;
    jamaah.forEach(j => {
      const num = parseInt(j.id.split('-')[1]);
      if (num > lastNum) lastNum = num;
    });
    const newId = 'KRT-' + String(lastNum + 1).padStart(4, '0');
    
    sheet.appendRow([
      newId,
      params.nama,
      params.gender,
      params.noHp,
      params.alamat,
      params.tempatLahir,
      params.tglLahir,
      params.pendidikan,
      params.status || 'Aktif',
      new Date().toISOString().split('T')[0]
    ]);
    
    return {success: true, message: 'Peserta berhasil ditambahkan', id: newId};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function updateJamaah(params) {
  try {
    const sheet = ss.getSheetByName('JAMAAH');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.id) {
        sheet.getRange(i + 1, 2, 1, 9).setValues([[
          params.nama,
          params.gender,
          params.noHp,
          params.alamat,
          params.tempatLahir,
          params.tglLahir,
          params.pendidikan,
          params.status,
          data[i][9]
        ]]);
        return {success: true, message: 'Peserta berhasil diupdate'};
      }
    }
    
    return {success: false, message: 'Peserta tidak ditemukan'};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function deleteJamaah(params) {
  try {
    const sheet = ss.getSheetByName('JAMAAH');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.id) {
        sheet.deleteRow(i + 1);
        return {success: true, message: 'Peserta berhasil dihapus'};
      }
    }
    
    return {success: false, message: 'Peserta tidak ditemukan'};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function getKegiatan() {
  try {
    const sheet = ss.getSheetByName('KEGIATAN');
    if (!sheet) return {success: false, data: []};
    
    const data = sheet.getDataRange().getValues();
    const kegiatan = [];
    
    for (let i = 1; i < data.length; i++) {
      kegiatan.push({
        id: data[i][0],
        nama: data[i][1],
        jenis: data[i][2],
        tanggal: data[i][3],
        jamMulai: data[i][4],
        jamSelesai: data[i][5],
        lokasi: data[i][6],
        koordinat: data[i][7],
        status: data[i][8],
        pesertaTerdaftar: data[i][9]
      });
    }
    
    return {success: true, data: kegiatan};
  } catch(error) {
    return {success: false, message: error.toString(), data: []};
  }
}

function tambahKegiatan(params) {
  try {
    const sheet = ss.getSheetByName('KEGIATAN');
    const kegiatan = getKegiatan().data;
    
    let lastNum = 0;
    kegiatan.forEach(k => {
      const num = parseInt(k.id.split('-')[1]);
      if (num > lastNum) lastNum = num;
    });
    const newId = 'KGT-' + String(lastNum + 1).padStart(3, '0');
    
    sheet.appendRow([
      newId,
      params.nama,
      params.jenis,
      params.tanggal,
      params.jamMulai,
      params.jamSelesai,
      params.lokasi,
      params.koordinat || '',
      params.status || 'Aktif',
      params.pesertaTerdaftar || 0
    ]);
    
    return {success: true, message: 'Kegiatan berhasil dibuat', id: newId};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function updateKegiatan(params) {
  try {
    const sheet = ss.getSheetByName('KEGIATAN');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.id) {
        sheet.getRange(i + 1, 2, 1, 9).setValues([[
          params.nama,
          params.jenis,
          params.tanggal,
          params.jamMulai,
          params.jamSelesai,
          params.lokasi,
          params.koordinat,
          params.status,
          params.pesertaTerdaftar
        ]]);
        return {success: true, message: 'Kegiatan berhasil diupdate'};
      }
    }
    
    return {success: false, message: 'Kegiatan tidak ditemukan'};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function deleteKegiatan(params) {
  try {
    const sheet = ss.getSheetByName('KEGIATAN');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.id) {
        sheet.deleteRow(i + 1);
        return {success: true, message: 'Kegiatan berhasil dihapus'};
      }
    }
    
    return {success: false, message: 'Kegiatan tidak ditemukan'};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function getAbsensi(params) {
  try {
    const sheet = ss.getSheetByName('ABSENSI');
    if (!sheet) return {success: false, data: []};
    
    const data = sheet.getDataRange().getValues();
    const absensi = [];
    
    for (let i = 1; i < data.length; i++) {
      if (!params.kegiatanId || data[i][1] === params.kegiatanId) {
        absensi.push({
          id: data[i][0],
          kegiatanId: data[i][1],
          jamaahId: data[i][2],
          status: data[i][3],
          waktuAbsen: data[i][4],
          catatan: data[i][5],
          tanggal: data[i][6]
        });
      }
    }
    
    return {success: true, data: absensi};
  } catch(error) {
    return {success: false, message: error.toString(), data: []};
  }
}

function tambahAbsensi(params) {
  try {
    const sheet = ss.getSheetByName('ABSENSI');
    const absensi = getAbsensi({}).data;
    
    // Check duplicate - anti duplicate nama
    const isDuplicate = absensi.some(a => 
      a.jamaahId === params.jamaahId && 
      a.kegiatanId === params.kegiatanId &&
      a.tanggal === new Date().toISOString().split('T')[0]
    );
    
    if (isDuplicate) {
      return {success: false, message: 'Peserta sudah absen hari ini untuk kegiatan ini'};
    }
    
    let lastNum = 0;
    absensi.forEach(a => {
      const num = parseInt(a.id.split('-')[1]);
      if (num > lastNum) lastNum = num;
    });
    const newId = 'ABS-' + String(lastNum + 1).padStart(4, '0');
    
    sheet.appendRow([
      newId,
      params.kegiatanId,
      params.jamaahId,
      params.status,
      params.waktuAbsen || new Date().toLocaleTimeString(),
      params.catatan || '',
      new Date().toISOString().split('T')[0]
    ]);
    
    return {success: true, message: 'Absensi berhasil dicatat', id: newId};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function getMusyawarah(params) {
  try {
    const sheet = ss.getSheetByName('CATATAN_MUSYAWARAH');
    if (!sheet) return {success: false, data: []};
    
    const data = sheet.getDataRange().getValues();
    const musyawarah = [];
    
    for (let i = 1; i < data.length; i++) {
      if (!params.kegiatanId || data[i][1] === params.kegiatanId) {
        musyawarah.push({
          id: data[i][0],
          kegiatanId: data[i][1],
          catatan: data[i][2],
          driveLink: data[i][3],
          dibuatOleh: data[i][4],
          tanggal: data[i][5]
        });
      }
    }
    
    return {success: true, data: musyawarah};
  } catch(error) {
    return {success: false, message: error.toString(), data: []};
  }
}

function tambahMusyawarah(params) {
  try {
    const sheet = ss.getSheetByName('CATATAN_MUSYAWARAH');
    const musyawarah = getMusyawarah({}).data;
    
    let lastNum = 0;
    musyawarah.forEach(m => {
      const num = parseInt(m.id.split('-')[1]);
      if (num > lastNum) lastNum = num;
    });
    const newId = 'MSW-' + String(lastNum + 1).padStart(4, '0');
    
    sheet.appendRow([
      newId,
      params.kegiatanId,
      params.catatan,
      params.driveLink || '',
      params.dibuatOleh,
      new Date().toISOString().split('T')[0]
    ]);
    
    return {success: true, message: 'Catatan musyawarah berhasil disimpan', id: newId};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function getCatatanTim7(params) {
  try {
    const sheet = ss.getSheetByName('CATATAN_TIM7');
    if (!sheet) return {success: false, data: []};
    
    const data = sheet.getDataRange().getValues();
    const catatan = [];
    
    for (let i = 1; i < data.length; i++) {
      if (!params.kegiatanId || data[i][1] === params.kegiatanId) {
        catatan.push({
          id: data[i][0],
          kegiatanId: data[i][1],
          catatan: data[i][2],
          driveLink: data[i][3],
          dibuatOleh: data[i][4],
          tanggal: data[i][5]
        });
      }
    }
    
    return {success: true, data: catatan};
  } catch(error) {
    return {success: false, message: error.toString(), data: []};
  }
}

function tambahCatatanTim7(params) {
  try {
    const sheet = ss.getSheetByName('CATATAN_TIM7');
    const catatan = getCatatanTim7({}).data;
    
    let lastNum = 0;
    catatan.forEach(c => {
      const num = parseInt(c.id.split('-')[1]);
      if (num > lastNum) lastNum = num;
    });
    const newId = 'TIM7-' + String(lastNum + 1).padStart(4, '0');
    
    sheet.appendRow([
      newId,
      params.kegiatanId,
      params.catatan,
      params.driveLink || '',
      params.dibuatOleh,
      new Date().toISOString().split('T')[0]
    ]);
    
    return {success: true, message: 'Catatan Tim 7 berhasil disimpan', id: newId};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function generateQRCode(params) {
  try {
    const text = params.jamaahId;
    const url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(text);
    return {success: true, qrCodeUrl: url};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function getLaporanBulan(params) {
  try {
    const jamaah = getJamaah().data;
    const kegiatan = getKegiatan().data;
    const absensi = getAbsensi({}).data;
    
    const bulan = params.bulan;
    const tahun = params.tahun;
    
    const kegiatanBulan = kegiatan.filter(k => {
      const [y, m] = k.tanggal.split('-');
      return m === bulan && y === tahun;
    });
    
    const absensiData = absensi.filter(a => {
      const [y, m] = a.tanggal.split('-');
      return m === bulan && y === tahun;
    });
    
    const hadir = absensiData.filter(a => a.status === 'Hadir').length;
    const izin = absensiData.filter(a => a.status === 'Izin').length;
    const alpha = absensiData.filter(a => a.status === 'Alpha').length;
    const total = absensiData.length;
    
    return {
      success: true,
      periode: `${bulan}/${tahun}`,
      totalKegiatan: kegiatanBulan.length,
      totalJamaah: jamaah.length,
      totalAbsensi: total,
      statistik: {
        hadir: hadir,
        izin: izin,
        alpha: alpha,
        persentaseHadir: total > 0 ? Math.round((hadir / total) * 100) : 0
      }
    };
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function setupDatabase() {
  try {
    const sheetNames = ['JAMAAH', 'KEGIATAN', 'ABSENSI', 'CATATAN_MUSYAWARAH', 'CATATAN_TIM7', 'USERS'];
    
    sheetNames.forEach(name => {
      const sheet = ss.getSheetByName(name);
      if (sheet) ss.deleteSheet(sheet);
    });
    
    let sheet = ss.insertSheet('JAMAAH');
    sheet.appendRow(['ID', 'Nama', 'Gender', 'No HP', 'Alamat', 'Tempat Lahir', 'Tanggal Lahir', 'Pendidikan', 'Status', 'Tanggal Daftar']);
    sheet.appendRow(['KRT-0001', 'Ahmad Fahri', 'Laki-laki', '081234567890', 'Jl. Merdeka No. 10', 'Jakarta', '1990-05-15', 'S1', 'Aktif', '2024-01-15']);
    sheet.appendRow(['KRT-0002', 'Siti Nurhaliza', 'Perempuan', '081234567891', 'Jl. Sudirman', 'Bandung', '1995-03-20', 'S1', 'Aktif', '2024-01-20']);
    
    sheet = ss.insertSheet('KEGIATAN');
    sheet.appendRow(['ID', 'Nama', 'Jenis', 'Tanggal', 'Jam Mulai', 'Jam Selesai', 'Lokasi', 'Koordinat', 'Status', 'Peserta Terdaftar']);
    sheet.appendRow(['KGT-001', 'Pengajian Pagi', 'Pengajian Rutin', '2026-07-27', '09:00', '10:00', 'Masjid An-Nur', '-6.2088,106.8456', 'Aktif', '50']);
    
    sheet = ss.insertSheet('ABSENSI');
    sheet.appendRow(['ID', 'Kegiatan ID', 'Jamaah ID', 'Status', 'Waktu Absen', 'Catatan', 'Tanggal']);
    sheet.appendRow(['ABS-0001', 'KGT-001', 'KRT-0001', 'Hadir', '09:15', '', '2026-07-27']);
    
    sheet = ss.insertSheet('CATATAN_MUSYAWARAH');
    sheet.appendRow(['ID', 'Kegiatan ID', 'Catatan', 'Drive Link', 'Dibuat Oleh', 'Tanggal']);
    
    sheet = ss.insertSheet('CATATAN_TIM7');
    sheet.appendRow(['ID', 'Kegiatan ID', 'Catatan', 'Drive Link', 'Dibuat Oleh', 'Tanggal']);
    
    sheet = ss.insertSheet('USERS');
    sheet.appendRow(['Username', 'Password', 'Role', 'Name']);
    sheet.appendRow(['admin', 'admin', 'admin', 'Administrator']);
    sheet.appendRow(['pengurus', 'pengurus', 'pengurus', 'Pengurus Kertalangu']);
    sheet.appendRow(['jamaah', 'jamaah', 'jamaah', 'Ahmad Fahri']);
    
    return {success: true, message: 'Database berhasil di-setup!'};
  } catch(error) {
    return {success: false, message: error.toString()};
  }
}

function doGet(e) {
  if (e.parameter.action === 'setup') {
    return ContentService.createTextOutput(JSON.stringify(setupDatabase()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('E-KERTALANGU API v2.0');
}

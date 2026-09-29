/* ===================================================
   YNKI MEL SYSTEM — Core Application Engine
   app.js: State, Auth, Router, Seeder, Utils
   =================================================== */

'use strict';

/* ── State Store ─────────────────────────────────── */
const Store = {
  _data: {},

  init() {
    const saved = localStorage.getItem('ynki_mel_store');
    if (saved) {
      this._data = JSON.parse(saved);
    } else {
      this._data = this._seed();
      this.save();
    }
  },

  save() {
    localStorage.setItem('ynki_mel_store', JSON.stringify(this._data));
  },

  get(key) { return this._data[key]; },
  set(key, val) { this._data[key] = val; this.save(); },

  /* ── Seed Demo Data ────────────────────────── */
  _seed() {
    const now = new Date();
    const y = 2026;

    const users = [
      { id: 'u1', name: 'Sari Wulandari',   email: 'admin@ynki.org',   password: 'admin123',  role: 'admin',  divisi: 'Tim MEL',          avatar: 'SW', active: true },
      { id: 'u2', name: 'Budi Santoso',      email: 'budi@ynki.org',    password: 'pic123',    role: 'pic',    divisi: 'Konservasi',        avatar: 'BS', active: true },
      { id: 'u3', name: 'Fitri Handayani',   email: 'fitri@ynki.org',   password: 'pic123',    role: 'pic',    divisi: 'Pemberdayaan',      avatar: 'FH', active: true },
      { id: 'u4', name: 'Ahmad Fauzi',       email: 'ahmad@ynki.org',   password: 'pic123',    role: 'pic',    divisi: 'Edukasi',           avatar: 'AF', active: true },
      { id: 'u5', name: 'Dr. Rini Marlina',  email: 'direktur@ynki.org',password: 'view123',   role: 'viewer', divisi: 'Direktur',          avatar: 'RM', active: true },
      { id: 'u6', name: 'Helmi Pratama',     email: 'donor@ynki.org',   password: 'view123',   role: 'viewer', divisi: 'Donor Relations',   avatar: 'HP', active: true },
    ];

    const programs = [
      { id: 'p1', nama: 'Konservasi Mangrove Pesisir',   kode: 'KMP-2026', divisi: 'Konservasi',   tujuan: 'Memulihkan ekosistem mangrove di pesisir Kalimantan Barat', anggaran: 350000000 },
      { id: 'p2', nama: 'Pemberdayaan Petani Gambut',     kode: 'PPG-2026', divisi: 'Pemberdayaan', tujuan: 'Meningkatkan kapasitas petani dalam pengelolaan lahan gambut', anggaran: 275000000 },
      { id: 'p3', nama: 'Edukasi Lingkungan Sekolah',    kode: 'ELS-2026', divisi: 'Edukasi',      tujuan: 'Meningkatkan kesadaran lingkungan pada pelajar SMP-SMA', anggaran: 180000000 },
    ];

    const activities = [
      /* ── Program 1: Konservasi Mangrove ── */
      { id: 'a1',  programId: 'p1', nama: 'Survei dan Pemetaan Kawasan Mangrove',  indikator: 'Peta lokasi (shapefile), Laporan survei 30 hal.', pic: 'u2', startDate: `${y}-01-10`, endDate: `${y}-02-15`, status: 'selesai',  persen: 100, q: 'Q1', verified: true  },
      { id: 'a2',  programId: 'p1', nama: 'Penanaman Bibit Mangrove Tahap I',      indikator: 'Daftar hadir, Foto kegiatan, 5000 bibit ditanam', pic: 'u2', startDate: `${y}-02-20`, endDate: `${y}-03-30`, status: 'selesai',  persen: 100, q: 'Q1', verified: true  },
      { id: 'a3',  programId: 'p1', nama: 'Workshop Kelompok Nelayan',             indikator: 'Daftar hadir min. 30 orang, Notulensi, Foto', pic: 'u2', startDate: `${y}-04-05`, endDate: `${y}-04-20`, status: 'selesai',  persen: 100, q: 'Q2', verified: true  },
      { id: 'a4',  programId: 'p1', nama: 'Monitoring Pertumbuhan Mangrove',       indikator: 'Laporan monitoring bulanan, Data pertumbuhan', pic: 'u2', startDate: `${y}-05-01`, endDate: `${y}-06-30`, status: 'proses',   persen: 65,  q: 'Q2', verified: false },
      { id: 'a5',  programId: 'p1', nama: 'Penanaman Bibit Mangrove Tahap II',     indikator: 'Foto kegiatan, 3000 bibit ditanam, Kuitansi', pic: 'u2', startDate: `${y}-07-10`, endDate: `${y}-08-15`, status: 'proses',   persen: 30,  q: 'Q3', verified: false },
      { id: 'a6',  programId: 'p1', nama: 'Evaluasi Akhir Konservasi & Pelaporan', indikator: 'Laporan akhir, Presentasi ke donor', pic: 'u2', startDate: `${y}-10-01`, endDate: `${y}-11-30`, status: 'belum',    persen: 0,   q: 'Q4', verified: false },

      /* ── Program 2: Petani Gambut ── */
      { id: 'a7',  programId: 'p2', nama: 'Identifikasi Kelompok Tani Sasaran',    indikator: 'Daftar 5 kelompok tani, Perjanjian kerjasama', pic: 'u3', startDate: `${y}-01-15`, endDate: `${y}-02-28`, status: 'selesai',  persen: 100, q: 'Q1', verified: true  },
      { id: 'a8',  programId: 'p2', nama: 'Pelatihan Teknik Pertanian Gambut',     indikator: 'Daftar hadir 50 petani, Modul pelatihan, Foto', pic: 'u3', startDate: `${y}-03-10`, endDate: `${y}-04-10`, status: 'selesai',  persen: 100, q: 'Q1', verified: true  },
      { id: 'a9',  programId: 'p2', nama: 'Distribusi Sarana Pertanian',           indikator: 'Kuitansi pembelian, Foto distribusi, TTD penerima', pic: 'u3', startDate: `${y}-04-15`, endDate: `${y}-05-15`, status: 'proses',   persen: 80,  q: 'Q2', verified: false },
      { id: 'a10', programId: 'p2', nama: 'Pendampingan Musim Tanam',              indikator: 'Laporan pendampingan bulanan, Data produksi', pic: 'u3', startDate: `${y}-05-20`, endDate: `${y}-08-31`, status: 'proses',   persen: 45,  q: 'Q3', verified: false },
      { id: 'a11', programId: 'p2', nama: 'Panen Raya & Pameran Produk',           indikator: 'Foto kegiatan, Laporan hasil panen, Daftar hadir', pic: 'u3', startDate: `${y}-09-05`, endDate: `${y}-09-20`, status: 'terlambat', persen: 20,  q: 'Q3', verified: false },
      { id: 'a12', programId: 'p2', nama: 'Laporan Dampak & Rekomendasi',          indikator: 'Laporan dampak 50 hal., Presentasi manajemen', pic: 'u3', startDate: `${y}-10-15`, endDate: `${y}-12-15`, status: 'belum',    persen: 0,   q: 'Q4', verified: false },

      /* ── Program 3: Edukasi Sekolah ── */
      { id: 'a13', programId: 'p3', nama: 'Penyusunan Kurikulum Lingkungan',       indikator: 'Modul kurikulum tervalidasi, Review ahli', pic: 'u4', startDate: `${y}-01-20`, endDate: `${y}-03-01`, status: 'selesai',  persen: 100, q: 'Q1', verified: true  },
      { id: 'a14', programId: 'p3', nama: 'Pelatihan Guru Fasilitator',            indikator: 'Daftar hadir 20 guru, Sertifikat, Foto', pic: 'u4', startDate: `${y}-03-10`, endDate: `${y}-04-05`, status: 'selesai',  persen: 100, q: 'Q1', verified: true  },
      { id: 'a15', programId: 'p3', nama: 'Pelaksanaan Kelas Lingkungan (10 Sesi)', indikator: 'Daftar hadir tiap sesi, Foto, Lembar evaluasi siswa', pic: 'u4', startDate: `${y}-04-10`, endDate: `${y}-06-30`, status: 'proses',   persen: 70,  q: 'Q2', verified: false },
      { id: 'a16', programId: 'p3', nama: 'Lomba Karya Ilmiah Lingkungan',         indikator: 'Daftar peserta, Dokumentasi, Laporan pelaksanaan', pic: 'u4', startDate: `${y}-07-01`, endDate: `${y}-08-01`, status: 'belum',    persen: 0,   q: 'Q3', verified: false },
      { id: 'a17', programId: 'p3', nama: 'Hari Lingkungan & Festival Hijau',      indikator: 'Daftar peserta min. 200, Liputan media, Foto', pic: 'u4', startDate: `${y}-09-01`, endDate: `${y}-09-15`, status: 'terlambat', persen: 10,  q: 'Q3', verified: false },
    ];

    const progressLog = [
      { id: 'pl1', activityId: 'a4',  userId: 'u2', tanggal: `${y}-06-10`, persen: 65, catatan: 'Data monitoring bulan April-Mei sudah lengkap, sedang proses Juni', status: 'proses' },
      { id: 'pl2', activityId: 'a5',  userId: 'u2', tanggal: `${y}-07-20`, persen: 30, catatan: 'Bibit sudah siap, menunggu koordinasi dengan kelompok nelayan', status: 'proses' },
      { id: 'pl3', activityId: 'a9',  userId: 'u3', tanggal: `${y}-05-10`, persen: 80, catatan: 'Sebagian besar peralatan sudah terdistribusi, sisa 5 kelompok', status: 'proses' },
      { id: 'pl4', activityId: 'a10', userId: 'u3', tanggal: `${y}-07-01`, persen: 45, catatan: 'Pendampingan berjalan, beberapa petani mengalami masalah hama', status: 'proses' },
      { id: 'pl5', activityId: 'a15', userId: 'u4', tanggal: `${y}-06-15`, persen: 70, catatan: '7 dari 10 sesi sudah terlaksana, respons siswa sangat positif', status: 'proses' },
    ];

    const movDocs = [
      { id: 'mov1', activityId: 'a1', nama: 'Laporan_Survei_Mangrove_Q1.pdf',     tipe: 'pdf',   size: '2.4 MB', uploadedBy: 'u2', tanggal: `${y}-02-15`, url: '#' },
      { id: 'mov2', activityId: 'a2', nama: 'Foto_Penanaman_Feb2026.zip',          tipe: 'image', size: '15 MB',  uploadedBy: 'u2', tanggal: `${y}-03-30`, url: '#' },
      { id: 'mov3', activityId: 'a3', nama: 'Daftar_Hadir_Workshop_Nelayan.pdf',   tipe: 'pdf',   size: '0.8 MB', uploadedBy: 'u2', tanggal: `${y}-04-20`, url: '#' },
      { id: 'mov4', activityId: 'a7', nama: 'Perjanjian_Kelompok_Tani.pdf',        tipe: 'pdf',   size: '1.2 MB', uploadedBy: 'u3', tanggal: `${y}-02-25`, url: '#' },
      { id: 'mov5', activityId: 'a8', nama: 'Dokumentasi_Pelatihan_Petani.pdf',    tipe: 'pdf',   size: '3.1 MB', uploadedBy: 'u3', tanggal: `${y}-04-10`, url: '#' },
      { id: 'mov6', activityId: 'a13','nama': 'Modul_Kurikulum_Lingkungan_v2.pdf', tipe: 'pdf',   size: '5.6 MB', uploadedBy: 'u4', tanggal: `${y}-03-01`, url: '#' },
      { id: 'mov7', activityId: 'a14', nama: 'Sertifikat_Guru_Fasilitator.pdf',    tipe: 'pdf',   size: '1.8 MB', uploadedBy: 'u4', tanggal: `${y}-04-05`, url: '#' },
    ];

    const lessonsLearned = [
      { id: 'll1', programId: 'p1', activityId: 'a1', judul: 'Efektivitas Pemetaan Drone vs Manual', kategori: 'Teknis', deskripsi: 'Penggunaan drone DJI untuk pemetaan mangrove 5x lebih cepat dari survei manual dan menghasilkan akurasi lebih tinggi.', berhasil: true,  rekomendasiLanjut: true,  createdBy: 'u2', tanggal: `${y}-02-20` },
      { id: 'll2', programId: 'p1', activityId: 'a2', judul: 'Keterlibatan Nelayan Lokal Sangat Krusial', kategori: 'SDM', deskripsi: 'Melibatkan nelayan lokal sebagai mitra tanam meningkatkan rasa kepemilikan dan survival rate bibit dari 60% menjadi 82%.', berhasil: true,  rekomendasiLanjut: true,  createdBy: 'u2', tanggal: `${y}-04-01` },
      { id: 'll3', programId: 'p2', activityId: 'a8', judul: 'Waktu Pelatihan Terlalu Singkat', kategori: 'SDM', deskripsi: 'Durasi pelatihan 2 hari tidak cukup untuk transfer teknik pertanian gambut yang kompleks. Perlu minimal 4 hari di program berikutnya.', berhasil: false, rekomendasiLanjut: false, createdBy: 'u3', tanggal: `${y}-04-15` },
      { id: 'll4', programId: 'p2', activityId: 'a9', judul: 'Kendala Distribusi ke Daerah Terpencil', kategori: 'Logistik', deskripsi: 'Biaya transportasi ke 3 kelompok tani di pedalaman 40% lebih tinggi dari estimasi. Perlu identifikasi awal titik distribusi.', berhasil: false, rekomendasiLanjut: false, createdBy: 'u3', tanggal: `${y}-05-20` },
      { id: 'll5', programId: 'p3', activityId: 'a13', judul: 'Kolaborasi dengan Dinas Pendidikan Efektif', kategori: 'Teknis', deskripsi: 'MoU dengan Dinas Pendidikan Kota Pontianak mempercepat akses ke sekolah dan menjamin keberlanjutan program pasca proyek.', berhasil: true,  rekomendasiLanjut: true,  createdBy: 'u4', tanggal: `${y}-03-10` },
    ];

    const bottlenecks = [
      { id: 'bn1', activityId: 'a11', userId: 'u3', tanggal: `${y}-09-16`, kendala: 'Lokasi panen raya tidak siap karena area tergenang banjir akibat hujan deras minggu lalu. Koordinasi dengan pemda terlambat.', solusi: 'Memindahkan lokasi ke balai desa Kec. Sungai Kakap. Menghubungi pemda untuk izin darurat dan pinjam tenda.', eskalasi: true },
      { id: 'bn2', activityId: 'a17', userId: 'u4', tanggal: `${y}-09-10`, kendala: 'Pembicara utama (Prof. Adi) batal hadir H-2 karena sakit. Anggaran sponsor belum cair sehingga tempat belum dibayar.', solusi: 'Menghubungi narasumber cadangan dari UNTAN. Negosiasi dengan venue untuk pembayaran mundur 7 hari.', eskalasi: false },
    ];

    const notifications = [
      { id: 'n1',  userId: null,  tipe: 'overdue',  judul: 'Aktivitas Terlambat!',       pesan: 'Panen Raya & Pameran Produk (PPG-2026) sudah melewati deadline.', activityId: 'a11', read: false, tanggal: `${y}-09-14T08:00:00` },
      { id: 'n2',  userId: null,  tipe: 'overdue',  judul: 'Aktivitas Terlambat!',       pesan: 'Hari Lingkungan & Festival Hijau (ELS-2026) sudah melewati deadline.', activityId: 'a17', read: false, tanggal: `${y}-09-15T08:00:00` },
      { id: 'n3',  userId: 'u2',  tipe: 'reminder', judul: 'H-14: Persiapan Aktivitas',  pesan: 'Penanaman Bibit Mangrove Tahap II dimulai 29 Sep. Pastikan bibit sudah siap.', activityId: 'a5', read: false, tanggal: `${y}-09-14T09:00:00` },
      { id: 'n4',  userId: null,  tipe: 'escalasi', judul: 'Eskalasi ke Manajer',        pesan: 'Fitri (PIC) belum memperbarui progress Panen Raya selama 3 hari.', activityId: 'a11', read: false, tanggal: `${y}-09-15T10:00:00` },
      { id: 'n5',  userId: 'u4',  tipe: 'reminder', judul: 'H-3: Deadline Mendekat!',   pesan: 'Hari Lingkungan & Festival Hijau berakhir 15 Sep. Segera perbarui progress.', activityId: 'a17', read: true,  tanggal: `${y}-09-12T08:00:00` },
    ];

    return { users, programs, activities, progressLog, movDocs, lessonsLearned, bottlenecks, notifications, session: null };
  }
};

/* ── Auth ────────────────────────────────────────── */
const Auth = {
  login(email, password) {
    const users = Store.get('users');
    const user = users.find(u => u.email === email && u.password === password && u.active);
    if (user) {
      Store.set('session', { userId: user.id });
      return user;
    }
    return null;
  },

  logout() {
    Store.set('session', null);
    showLogin();
  },

  currentUser() {
    const session = Store.get('session');
    if (!session) return null;
    return Store.get('users').find(u => u.id === session.userId) || null;
  },

  can(action) {
    const user = this.currentUser();
    if (!user) return false;
    const perms = {
      admin:  ['view', 'create', 'edit', 'delete', 'approve', 'export', 'manage_users'],
      pic:    ['view', 'update_progress', 'upload_mov', 'add_lesson', 'add_bottleneck'],
      viewer: ['view', 'export'],
    };
    return (perms[user.role] || []).includes(action);
  }
};

/* ── Router ──────────────────────────────────────── */
const Router = {
  current: 'dashboard',

  pages: {
    dashboard:     { title: 'Dasbor Utama',           roles: ['admin','pic','viewer'] },
    profile:       { title: 'Tentang MEL YNKI',       roles: ['admin','pic','viewer'] },
    matrix:        { title: 'Matriks Kerja',           roles: ['admin','pic','viewer'] },
    progress:      { title: 'Pelacakan Progress',      roles: ['admin','pic'] },
    evaluation:    { title: 'Evaluasi & Pembelajaran', roles: ['admin','pic','viewer'] },
    reports:       { title: 'Laporan Pencapaian',      roles: ['admin','pic','viewer'] },
    notifications: { title: 'Pusat Notifikasi',        roles: ['admin','pic'] },
    users:         { title: 'Manajemen Pengguna',      roles: ['admin'] },
  },

  navigate(page) {
    const user = Auth.currentUser();
    if (!user) return;

    const cfg = this.pages[page];
    if (!cfg || !cfg.roles.includes(user.role)) {
      showToast('Akses Ditolak', 'Anda tidak memiliki izin untuk halaman ini.', 'error');
      return;
    }

    this.current = page;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.getElementById(`nav-${page}`);
    if (navEl) navEl.classList.add('active');

    document.getElementById('page-title').textContent = cfg.title;
    document.getElementById('breadcrumb-current').textContent = cfg.title;

    const content = document.getElementById('page-content');
    content.innerHTML = '<div style="text-align:center;padding:60px;color:var(--gray-400)">⏳ Memuat...</div>';

    setTimeout(() => {
      switch (page) {
        case 'dashboard':     renderDashboard(content); break;
        case 'profile':       renderProfile(content); break;
        case 'matrix':        renderMatrix(content); break;
        case 'progress':      renderProgress(content); break;
        case 'evaluation':    renderEvaluation(content); break;
        case 'reports':       renderReports(content); break;
        case 'notifications': renderNotifications(content); break;
        case 'users':         renderUsers(content); break;
      }
    }, 80);
  }
};

/* ── Global Navigation Helper ────────────────────── */
function navigate(page) { Router.navigate(page); }

/* ── Login Handlers ──────────────────────────────── */
function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-error');
  const user     = Auth.login(email, password);
  if (user) {
    errEl.style.display = 'none';
    showApp(user);
  } else {
    errEl.style.display = 'block';
  }
}

function demoLogin(role) {
  const map = { admin: 'admin@ynki.org', pic: 'budi@ynki.org', viewer: 'direktur@ynki.org' };
  const passMap = { admin: 'admin123', pic: 'pic123', viewer: 'view123' };
  document.getElementById('login-email').value    = map[role];
  document.getElementById('login-password').value = passMap[role];
  const user = Auth.login(map[role], passMap[role]);
  if (user) showApp(user);
}

function handleLogout() {
  Auth.logout();
}

/* ── Show/Hide ───────────────────────────────────── */
function showLogin() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-email').value    = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').style.display = 'none';
}

function showApp(user) {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  // Update sidebar user card
  document.getElementById('sidebar-avatar').textContent = user.avatar;
  document.getElementById('sidebar-name').textContent   = user.name;
  document.getElementById('sidebar-role').textContent   = roleLabel(user.role) + ' · ' + user.divisi;

  // Role-based nav visibility
  const adminSection = document.getElementById('admin-nav-section');
  if (user.role === 'viewer') {
    document.getElementById('nav-progress').parentElement.style.display = 'none';
    adminSection.style.display = 'none';
  } else if (user.role === 'pic') {
    adminSection.style.display = 'none';
    document.getElementById('nav-users').style.display = 'none';
  } else {
    adminSection.style.display = '';
    document.getElementById('nav-progress').parentElement.style.display = '';
  }

  // Date display
  document.getElementById('topbar-date').textContent = formatDate(new Date());

  // Init notification badge
  updateNotifBadge();

  // Render default page
  Router.navigate('dashboard');

  // Start notification engine
  NotificationEngine.start();
}

function roleLabel(r) {
  return { admin: 'Admin MEL', pic: 'Staf PIC', viewer: 'Manajemen' }[r] || r;
}

/* ── Modal Helpers ───────────────────────────────── */
function openModal(title, bodyHtml, footerHtml = '', size = '') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML    = bodyHtml;
  document.getElementById('modal-footer').innerHTML  = footerHtml;
  const box = document.getElementById('modal-box');
  box.className = 'modal' + (size ? ' modal-' + size : '');
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

/* ── Toast ───────────────────────────────────────── */
function showToast(title, msg = '', type = 'success') {
  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all .3s'; setTimeout(() => toast.remove(), 300); }, 4000);
}

/* ── Notification Panel ──────────────────────────── */
function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) renderNotifPanel();
}

function renderNotifPanel() {
  const user  = Auth.currentUser();
  const notifs = Store.get('notifications')
    .filter(n => !n.read && (!n.userId || n.userId === user?.id))
    .slice(0, 8);

  const list = document.getElementById('notif-list');
  if (!notifs.length) {
    list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--gray-400);font-size:13px">🎉 Tidak ada notifikasi baru</div>';
    return;
  }

  const dot = { overdue: 'red', reminder: 'yellow', escalasi: 'red', info: 'blue' };
  list.innerHTML = notifs.map(n => `
    <div class="notif-item unread" onclick="markRead('${n.id}')">
      <div class="notif-dot ${dot[n.tipe] || 'blue'}"></div>
      <div class="notif-content">
        <div class="notif-title">${n.judul}</div>
        <div class="notif-desc">${n.pesan}</div>
        <div class="notif-time">${timeAgo(n.tanggal)}</div>
      </div>
    </div>`).join('');
}

function markRead(id) {
  const notifs = Store.get('notifications');
  const n = notifs.find(x => x.id === id);
  if (n) n.read = true;
  Store.set('notifications', notifs);
  updateNotifBadge();
  renderNotifPanel();
}

function markAllRead() {
  const user   = Auth.currentUser();
  const notifs = Store.get('notifications').map(n => {
    if (!n.userId || n.userId === user?.id) n.read = true;
    return n;
  });
  Store.set('notifications', notifs);
  updateNotifBadge();
  renderNotifPanel();
}

function updateNotifBadge() {
  const user   = Auth.currentUser();
  const count  = Store.get('notifications').filter(n => !n.read && (!n.userId || n.userId === user?.id)).length;
  const dot    = document.getElementById('notif-dot');
  const badge  = document.getElementById('nav-notif-count');
  if (count > 0) {
    if (dot)   { dot.style.display = 'block'; }
    if (badge) { badge.style.display = 'block'; badge.textContent = count > 9 ? '9+' : count; }
  } else {
    if (dot)   { dot.style.display = 'none'; }
    if (badge) { badge.style.display = 'none'; }
  }
}

/* Close notif panel when clicking outside */
document.addEventListener('click', function(e) {
  const panel = document.getElementById('notif-panel');
  const btn   = document.getElementById('notif-btn');
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

/* ── Date / Time Helpers ──────────────────────────── */
function formatDate(d) {
  if (!d) return '-';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(d) {
  if (!d) return '-';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateInput(d) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().split('T')[0];
}

function daysDiff(dateStr) {
  const now    = new Date(); now.setHours(0,0,0,0);
  const target = new Date(dateStr); target.setHours(0,0,0,0);
  return Math.round((target - now) / 86400000);
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1)  return 'Baru saja';
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d} hari lalu`;
  return formatDateShort(dateStr);
}

/* ── ID Generator ────────────────────────────────── */
function genId(prefix = 'id') {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

/* ── Status Helpers ──────────────────────────────── */
function statusBadge(status) {
  const map = {
    selesai:   '<span class="badge badge-success">✅ Selesai</span>',
    proses:    '<span class="badge badge-info">🔄 Masih Proses</span>',
    belum:     '<span class="badge badge-gray">⏸ Belum Berjalan</span>',
    terlambat: '<span class="badge badge-danger">🚨 Terlambat</span>',
  };
  return map[status] || status;
}

function statusColor(status) {
  return { selesai: 'green', proses: 'info', belum: 'gray', terlambat: 'red' }[status] || 'gray';
}

function getProgramName(id) {
  return (Store.get('programs').find(p => p.id === id) || {}).nama || '-';
}

function getProgramKode(id) {
  return (Store.get('programs').find(p => p.id === id) || {}).kode || '-';
}

function getUserName(id) {
  return (Store.get('users').find(u => u.id === id) || {}).name || '-';
}

/* ── Rupiah formatter ─────────────────────────────── */
function formatRupiah(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

/* ── Quarter helper ──────────────────────────────── */
function getQuarter(dateStr) {
  const m = new Date(dateStr).getMonth() + 1;
  if (m <= 3)  return 'Q1';
  if (m <= 6)  return 'Q2';
  if (m <= 9)  return 'Q3';
  return 'Q4';
}

/* ── App Init ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  const user = Auth.currentUser();
  if (user) {
    showApp(user);
  } else {
    showLogin();
  }
});

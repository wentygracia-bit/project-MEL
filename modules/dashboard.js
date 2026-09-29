/* ===================================================
   MODULE: Dashboard (Dasbor Utama)
   =================================================== */

function renderDashboard(container) {
  const activities = Store.get('activities');
  
  // Hitung KPI
  const total = activities.length;
  const selesai = activities.filter(a => a.status === 'selesai').length;
  const proses = activities.filter(a => a.status === 'proses').length;
  const belum = activities.filter(a => a.status === 'belum').length;
  const terlambat = activities.filter(a => a.status === 'terlambat').length;
  
  const persenSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0;

  // Persiapkan data untuk grafik
  window.chartColors = {
    selesai: '#10b981', // green
    proses: '#3b82f6',  // blue
    belum: '#94a3b8',   // gray
    terlambat: '#ef4444'// red
  };

  container.innerHTML = `
    <!-- Hero Section -->
    <div class="hero-section" style="background: linear-gradient(135deg, #0f4c35 0%, #1a7a52 50%, #22c55e 100%); color: white; padding: 40px; border-radius: 16px; margin-bottom: 32px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.25); position: relative; overflow: hidden;">
      <div style="position: relative; z-index: 2;">
        <div style="display:inline-block; background:rgba(255,255,255,0.15); padding:5px 14px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:1px; margin-bottom:14px;">MONITORING · EVALUATION · LEARNING</div>
        <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.5px;">Learning Engine of Organizational Strategy</h1>
        <p style="font-size: 15px; line-height: 1.65; max-width: 620px; opacity: 0.88; margin-bottom: 6px;">
          Sistem MEL YNKI mengukur perubahan, menghasilkan bukti, memperkuat manajemen adaptif, dan mendukung transformasi jangka panjang menuju <strong>Healthy Landscapes & Thriving Communities</strong>.
        </p>
        <p style="font-size: 12px; opacity: 0.65; margin-bottom: 22px; font-style: italic;">Yayasan Natural Kapital Indonesia — Khusus proyek yang sedang berjalan (ongoing projects)</p>
        <button class="btn btn-primary" style="background: white; color: #0f4c35; font-weight: 700; padding: 10px 24px; border-radius: 8px; border: none; cursor: pointer; transition: transform 0.2s;" onclick="navigate('profile')">Tentang MEL YNKI →</button>
      </div>
      <div style="position: absolute; right: -50px; top: -50px; font-size: 200px; opacity: 0.07; line-height: 1; z-index: 1;">🌿</div>
      <div style="position: absolute; right: 180px; bottom: -60px; font-size: 120px; opacity: 0.05; line-height: 1; z-index: 1;">🌍</div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card green">
        <div class="kpi-label">Target Tercapai</div>
        <div class="kpi-value">${persenSelesai}%</div>
        <div class="kpi-sub">${selesai} dari ${total} Aktivitas Selesai</div>
        <div class="kpi-icon">🎯</div>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-label">Sedang Berjalan</div>
        <div class="kpi-value">${proses}</div>
        <div class="kpi-sub">Aktivitas dalam proses</div>
        <div class="kpi-icon">🔄</div>
      </div>
      <div class="kpi-card ${terlambat > 0 ? 'red' : 'green'}">
        <div class="kpi-label">Kritis / Terlambat</div>
        <div class="kpi-value">${terlambat}</div>
        <div class="kpi-sub">Melewati tenggat waktu</div>
        <div class="kpi-icon">🚨</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Grafik Progress -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="card-icon" style="background:rgba(59,130,246,.1);color:#3b82f6">📊</span> Status Keseluruhan</div>
        </div>
        <div class="card-body" style="height:300px; display:flex; justify-content:center; align-items:center;">
          <canvas id="dashboard-pie-chart"></canvas>
        </div>
      </div>

      <!-- Highlight Target Kritis -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="card-icon" style="background:rgba(239,68,68,.1);color:#ef4444">⚠️</span> Highlight Target Kritis</div>
        </div>
        <div class="card-body" style="padding:0">
          <div class="table-wrap" style="border:none; border-radius:0">
            <table>
              <thead>
                <tr>
                  <th>Aktivitas / Indikator</th>
                  <th>Jadwal</th>
                  <th>PIC</th>
                </tr>
              </thead>
              <tbody>
                ${renderCriticalActivities(activities)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize Chart.js after DOM update
  setTimeout(() => {
    const ctx = document.getElementById('dashboard-pie-chart');
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Selesai', 'Masih Proses', 'Belum Berjalan', 'Terlambat'],
          datasets: [{
            data: [selesai, proses, belum, terlambat],
            backgroundColor: [
              window.chartColors.selesai,
              window.chartColors.proses,
              window.chartColors.belum,
              window.chartColors.terlambat
            ],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { position: 'right', labels: { font: { family: "'Plus Jakarta Sans', sans-serif" } } }
          }
        }
      });
    }
  }, 100);
}

function renderCriticalActivities(activities) {
  // Filter yang terlambat atau mendekati deadline (H-7)
  const now = new Date(); now.setHours(0,0,0,0);
  
  const critical = activities.filter(a => {
    if (a.status === 'selesai') return false;
    const end = new Date(a.endDate);
    const diff = Math.round((end - now) / 86400000);
    return diff <= 7; // H-7 or overdue
  }).sort((a, b) => new Date(a.endDate) - new Date(b.endDate)).slice(0, 5);

  if (critical.length === 0) {
    return '<tr><td colspan="3" class="text-center text-muted" style="padding:40px">Tidak ada aktivitas kritis saat ini 🎉</td></tr>';
  }

  return critical.map(a => {
    const isLate = a.status === 'terlambat';
    return `
      <tr>
        <td>
          <div class="td-name">${a.nama}</div>
          <div style="font-size:11px;color:var(--gray-500);margin-top:2px">Target Sistem: ${getProgramName(a.programId)}</div>
        </td>
        <td>
          <div class="badge ${isLate ? 'badge-danger' : 'badge-warning'} mb-8">
            ${isLate ? 'Terlambat' : 'Mendekati Deadline'}
          </div>
          <div style="font-size:11px;color:var(--gray-600)">Deadline: ${formatDateShort(a.endDate)}</div>
        </td>
        <td>
          <div class="d-flex align-center gap-8">
            <div class="user-avatar" style="width:24px;height:24px;font-size:10px">${getUserAvatar(a.pic)}</div>
            <span style="font-size:12px;font-weight:600">${getUserName(a.pic)}</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getUserAvatar(id) {
  const user = Store.get('users').find(u => u.id === id);
  return user ? user.avatar : '?';
}

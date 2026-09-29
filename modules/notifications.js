/* ===================================================
   MODULE: Notification Engine
   =================================================== */

const NotificationEngine = {
  interval: null,

  start() {
    this.check();
    // Check every 60 seconds
    this.interval = setInterval(() => this.check(), 60000);
  },

  stop() {
    if (this.interval) clearInterval(this.interval);
  },

  check() {
    const activities = Store.get('activities');
    const notifs     = Store.get('notifications');
    const now        = new Date(); now.setHours(0,0,0,0);
    let changed = false;

    activities.forEach(act => {
      if (act.status === 'selesai') return;
      const diff = daysDiff(act.endDate);
      const user = Auth.currentUser();

      // H-7 Eskalasi
      if (diff === 7) {
        const key = `h7_${act.id}`;
        if (!notifs.find(n => n.id === key)) {
          notifs.push({ id: key, userId: act.pic, tipe: 'reminder', judul: '⚠️ H-7: Deadline Mendekat!', pesan: `"${act.nama}" dijadwalkan selesai dalam 7 hari. Segera selesaikan dan unggah bukti.`, activityId: act.id, read: false, tanggal: new Date().toISOString() });
          console.log(`[EMAIL SENT] To: PIC (user ${act.pic}) - Subject: Pengingat Eskalasi H-7 - Aktivitas ${act.nama} segera berakhir.`);
          changed = true;
        }
      }

      // Pengingat Email Berkala (Tiap 3 bulan, 1-2 minggu sebelum akhir kuartal)
      const currentMonth = now.getMonth() + 1; // 1-12
      const isEndOfQuarterMonth = [3, 6, 9, 12].includes(currentMonth);
      if (isEndOfQuarterMonth) {
        // jika hari ini adalah tgl 15-20, anggap 1-2 minggu sebelum akhir kuartal
        const d = now.getDate();
        if (d >= 15 && d <= 21) {
          const qKey = `q_remind_${now.getFullYear()}_Q${getQuarter(now.toISOString())}_${act.pic}`;
          if (!notifs.find(n => n.id === qKey)) {
             notifs.push({ id: qKey, userId: act.pic, tipe: 'info', judul: '📅 Pengingat Evaluasi Kuartalan', pesan: `Akhir kuartal semakin dekat. Mohon perbarui status aktivitas dan matriks kerja Anda.`, activityId: null, read: false, tanggal: new Date().toISOString() });
             console.log(`[EMAIL SENT] To: PIC (user ${act.pic}) - Subject: Pengingat Update Kuartalan MEL YNKI.`);
             changed = true;
          }
        }
      }

      // H-3
      if (diff === 3) {
        const key = `h3_${act.id}`;
        if (!notifs.find(n => n.id === key)) {
          notifs.push({ id: key, userId: act.pic, tipe: 'reminder', judul: '⚠️ H-3: Deadline Mendekat!', pesan: `"${act.nama}" berakhir dalam 3 hari. Segera perbarui progress dan upload dokumen.`, activityId: act.id, read: false, tanggal: new Date().toISOString() });
          changed = true;
        }
      }

      // H+1 Overdue
      if (diff < 0 && act.status !== 'terlambat') {
        act.status = 'terlambat';
        const key = `overdue_${act.id}`;
        if (!notifs.find(n => n.id === key)) {
          notifs.push({ id: key, userId: null, tipe: 'overdue', judul: '🚨 Aktivitas Terlambat!', pesan: `"${act.nama}" sudah melewati deadline ${Math.abs(diff)} hari yang lalu.`, activityId: act.id, read: false, tanggal: new Date().toISOString() });
          // Escalation
          notifs.push({ id: `esc_${act.id}`, userId: null, tipe: 'escalasi', judul: '📢 Eskalasi ke Manajer', pesan: `PIC ${getUserName(act.pic)} belum memperbarui "${act.nama}" yang sudah melewati deadline.`, activityId: act.id, read: false, tanggal: new Date().toISOString() });
          changed = true;
        }
      }
    });

    if (changed) {
      Store.set('activities', activities);
      Store.set('notifications', notifs);
      updateNotifBadge();
    }
  }
};

/* ===================================================
   RENDER: Notifications Page
   =================================================== */
function renderNotifications(container) {
  const user   = Auth.currentUser();
  const notifs = Store.get('notifications').sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));

  const unread = notifs.filter(n => !n.read && (!n.userId || n.userId === user?.id)).length;

  const tipeIcon = { overdue: '🚨', reminder: '⚠️', escalasi: '📢', info: 'ℹ️' };
  const tipeBadge = { overdue: 'badge-danger', reminder: 'badge-warning', escalasi: 'badge-danger', info: 'badge-info' };
  const tipeLabel = { overdue: 'Terlambat', reminder: 'Pengingat', escalasi: 'Eskalasi', info: 'Info' };

  container.innerHTML = `
    <div class="d-flex align-center justify-between mb-24">
      <div>
        <h3 style="font-size:20px;font-weight:800;color:var(--gray-800)">🔔 Pusat Notifikasi</h3>
        <p style="color:var(--gray-400);font-size:13px;margin-top:4px">${unread} notifikasi belum dibaca</p>
      </div>
      <button class="btn btn-secondary" onclick="markAllRead();renderNotifications(document.getElementById('page-content'))">✓ Tandai Semua Terbaca</button>
    </div>

    <div class="filter-bar mb-20">
      <select id="notif-filter-tipe" onchange="filterNotifPage()" style="">
        <option value="">Semua Tipe</option>
        <option value="overdue">Terlambat</option>
        <option value="reminder">Pengingat</option>
        <option value="escalasi">Eskalasi</option>
        <option value="info">Info</option>
      </select>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--gray-600)">
        <input type="checkbox" id="notif-filter-unread" onchange="filterNotifPage()"> Hanya belum dibaca
      </label>
    </div>

    <div class="card">
      <div id="notif-page-list">
        ${notifs.length ? notifs.map(n => `
          <div class="notif-item ${n.read ? '' : 'unread'}" id="notifrow_${n.id}" style="padding:16px 20px;border-bottom:1px solid var(--gray-100)">
            <div class="notif-dot ${n.tipe === 'overdue' || n.tipe === 'escalasi' ? 'red' : n.tipe === 'reminder' ? 'yellow' : 'blue'}" style="margin-top:6px;flex-shrink:0"></div>
            <div class="notif-content" style="flex:1">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span style="font-size:18px">${tipeIcon[n.tipe]||'ℹ️'}</span>
                <span class="badge ${tipeBadge[n.tipe]||'badge-info'}">${tipeLabel[n.tipe]||n.tipe}</span>
                ${!n.read ? '<span class="badge badge-info" style="font-size:10px">Baru</span>' : ''}
              </div>
              <div class="notif-title" style="font-size:14px">${n.judul}</div>
              <div class="notif-desc" style="font-size:13px;margin-top:4px">${n.pesan}</div>
              <div class="notif-time">${timeAgo(n.tanggal)} &nbsp;·&nbsp; ${formatDateShort(n.tanggal)}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
              ${!n.read ? `<button class="btn btn-sm btn-secondary" onclick="markRead('${n.id}');renderNotifications(document.getElementById('page-content'))">Tandai terbaca</button>` : ''}
              ${n.activityId ? `<button class="btn btn-sm btn-outline" onclick="navigate('progress')">Lihat Aktivitas →</button>` : ''}
            </div>
          </div>`).join('') : '<div class="empty-state"><div class="empty-icon">🎉</div><h4>Tidak ada notifikasi</h4><p>Semua aktivitas berjalan tepat waktu!</p></div>'}
      </div>
    </div>`;
}

function filterNotifPage() {
  const tipe   = document.getElementById('notif-filter-tipe')?.value;
  const unread = document.getElementById('notif-filter-unread')?.checked;
  const user   = Auth.currentUser();
  let notifs = Store.get('notifications').sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
  if (tipe)   notifs = notifs.filter(n => n.tipe === tipe);
  if (unread) notifs = notifs.filter(n => !n.read && (!n.userId || n.userId === user?.id));

  const tipeIcon  = { overdue: '🚨', reminder: '⚠️', escalasi: '📢', info: 'ℹ️' };
  const tipeBadge = { overdue: 'badge-danger', reminder: 'badge-warning', escalasi: 'badge-danger', info: 'badge-info' };
  const tipeLabel = { overdue: 'Terlambat', reminder: 'Pengingat', escalasi: 'Eskalasi', info: 'Info' };

  document.getElementById('notif-page-list').innerHTML = notifs.length
    ? notifs.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" style="padding:16px 20px;border-bottom:1px solid var(--gray-100)">
          <div class="notif-dot ${n.tipe==='overdue'||n.tipe==='escalasi'?'red':n.tipe==='reminder'?'yellow':'blue'}" style="margin-top:6px;flex-shrink:0"></div>
          <div class="notif-content" style="flex:1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span>${tipeIcon[n.tipe]||'ℹ️'}</span>
              <span class="badge ${tipeBadge[n.tipe]||'badge-info'}">${tipeLabel[n.tipe]||n.tipe}</span>
              ${!n.read ? '<span class="badge badge-info" style="font-size:10px">Baru</span>' : ''}
            </div>
            <div class="notif-title" style="font-size:14px">${n.judul}</div>
            <div class="notif-desc" style="font-size:13px;margin-top:4px">${n.pesan}</div>
            <div class="notif-time">${timeAgo(n.tanggal)}</div>
          </div>
        </div>`).join('')
    : '<div class="empty-state"><div class="empty-icon">📭</div><h4>Tidak ada notifikasi</h4><p>Coba ubah filter di atas</p></div>';
}

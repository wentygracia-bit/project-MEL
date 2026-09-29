/* ===================================================
   MODULE: Evaluation & Learning (Evaluasi & Pembelajaran)
   =================================================== */

function renderEvaluation(container) {
  const lessons = Store.get('lessonsLearned');
  const bottlenecks = Store.get('bottlenecks');

  container.innerHTML = `
    <div class="d-flex align-center justify-between mb-24">
      <div>
        <h3 style="font-size:20px;font-weight:800;color:var(--gray-800)">📝 Evaluasi & Pembelajaran</h3>
        <p style="color:var(--gray-400);font-size:13px;margin-top:4px">Repositori pembelajaran dan pelacakan kendala lapangan</p>
      </div>
      ${Auth.can('add_lesson') ? `<button class="btn btn-primary" onclick="openAddLessonModal()">+ Catat Pembelajaran Baru</button>` : ''}
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <div class="tab-item active" onclick="switchEvalTab('lessons')">📚 Lessons Learned</div>
      <div class="tab-item" onclick="switchEvalTab('bottlenecks')">🚧 Bottleneck Tracker</div>
    </div>

    <div id="eval-content">
      ${renderLessonsList(lessons)}
    </div>
  `;
}

window.switchEvalTab = function(tab) {
  document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');
  
  const content = document.getElementById('eval-content');
  if (tab === 'lessons') {
    content.innerHTML = renderLessonsList(Store.get('lessonsLearned'));
  } else {
    content.innerHTML = renderBottleneckList(Store.get('bottlenecks'));
  }
}

function renderLessonsList(lessons) {
  return `
    <div class="card p-24">
      <div class="filter-bar mb-20">
        <select><option>Semua Kategori</option><option>Teknis</option><option>SDM</option><option>Anggaran</option></select>
        <select><option>Semua Status</option><option>Berhasil</option><option>Gagal / Kendala</option></select>
      </div>
      <div class="grid-2">
        ${lessons.map(l => `
          <div style="border:1px solid var(--gray-200);border-radius:12px;padding:16px;background:var(--gray-50)">
            <div class="d-flex justify-between mb-12">
              <span class="tag tag-${l.kategori.toLowerCase()}">${l.kategori}</span>
              <span style="font-size:11px;color:var(--gray-500)">${formatDateShort(l.tanggal)}</span>
            </div>
            <h4 style="font-size:14px;font-weight:700;margin-bottom:8px">${l.judul}</h4>
            <p style="font-size:13px;color:var(--gray-600);line-height:1.5;margin-bottom:12px">${l.deskripsi}</p>
            <div style="border-top:1px dashed var(--gray-200);padding-top:12px;display:flex;align-items:center;justify-content:space-between">
              <div style="font-size:12px;font-weight:600;color:${l.berhasil ? 'var(--success)' : 'var(--danger)'}">
                ${l.berhasil ? '✅ Keberhasilan' : '❌ Kegagalan / Kendala'}
              </div>
              <div style="font-size:11px;color:var(--gray-500)">Oleh: ${getUserName(l.createdBy)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderBottleneckList(bottlenecks) {
  if (bottlenecks.length === 0) return `<div class="card p-24 text-center text-muted">Tidak ada kendala lapangan saat ini.</div>`;
  
  return `
    <div class="card">
      <table width="100%">
        <thead>
          <tr>
            <th width="15%">Tanggal</th>
            <th width="35%">Deskripsi Kendala</th>
            <th width="35%">Tindakan Solusi</th>
            <th width="15%">Status Eskalasi</th>
          </tr>
        </thead>
        <tbody>
          ${bottlenecks.map(b => `
            <tr>
              <td>${formatDateShort(b.tanggal)}<br/><span style="font-size:11px;color:var(--gray-500)">Oleh: ${getUserName(b.userId)}</span></td>
              <td style="font-size:13px;color:var(--gray-700)">${b.kendala}</td>
              <td style="font-size:13px;color:var(--brand-700);background:rgba(16,185,129,.05)">${b.solusi}</td>
              <td>${b.eskalasi ? '<span class="badge badge-danger">Dieskalasikan</span>' : '<span class="badge badge-info">Ditangani Mandiri</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.openAddLessonModal = function() {
  const activities = Store.get('activities');
  const html = `
    <div style="background:rgba(59,130,246,.05);border-left:3px solid var(--brand-500);padding:12px;margin-bottom:16px;font-size:13px;color:var(--gray-700)">
      <strong>Formulir Pembelajaran (Lessons Learned)</strong> digunakan untuk mencatat praktik baik, hambatan lapangan, dan rekomendasi manajemen adaptif.
    </div>
    <div class="form-group">
      <label class="form-label">Terkait Aktivitas <span class="required">*</span></label>
      <select id="modal-ll-activity" class="form-control">
        <option value="">-- Pilih Aktivitas Terkait --</option>
        ${activities.map(a => `<option value="${a.id}">${a.nama}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Judul Pembelajaran <span class="required">*</span></label>
      <input type="text" id="modal-ll-judul" class="form-control" placeholder="Contoh: Kendala cuaca saat survei">
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Kategori <span class="required">*</span></label>
        <select id="modal-ll-kategori" class="form-control">
          <option value="Teknis">Teknis</option>
          <option value="SDM">SDM</option>
          <option value="Anggaran">Anggaran</option>
          <option value="Logistik">Logistik</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Hasil <span class="required">*</span></label>
        <select id="modal-ll-berhasil" class="form-control">
          <option value="true">✅ Keberhasilan / Praktik Baik</option>
          <option value="false">❌ Kegagalan / Hambatan Lapangan</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Deskripsi / Rekomendasi Manajemen Adaptif <span class="required">*</span></label>
      <textarea id="modal-ll-desc" class="form-control" rows="4" placeholder="Jelaskan apa yang terjadi dan apa rekomendasinya ke depan..."></textarea>
    </div>
  `;
  openModal('Catat Pembelajaran & Hambatan', html, `<button class="btn btn-secondary" onclick="closeModal()">Batal</button> <button class="btn btn-primary" onclick="saveLesson()">Simpan Catatan</button>`, 'lg');
}

window.saveLesson = function() {
  const actId = document.getElementById('modal-ll-activity').value;
  const judul = document.getElementById('modal-ll-judul').value;
  const kategori = document.getElementById('modal-ll-kategori').value;
  const berhasil = document.getElementById('modal-ll-berhasil').value === 'true';
  const desc = document.getElementById('modal-ll-desc').value;

  if (!judul || !desc) {
    showToast('Validasi', 'Judul dan deskripsi wajib diisi', 'error');
    return;
  }

  const act = Store.get('activities').find(a => a.id === actId);
  const ll = Store.get('lessonsLearned');
  ll.push({
    id: genId('ll'),
    programId: act ? act.programId : '',
    activityId: actId,
    judul: judul,
    kategori: kategori,
    deskripsi: desc,
    berhasil: berhasil,
    rekomendasiLanjut: true,
    createdBy: Auth.currentUser().id,
    tanggal: new Date().toISOString().split('T')[0]
  });

  Store.set('lessonsLearned', ll);
  closeModal();
  showToast('Berhasil', 'Pembelajaran berhasil dicatat', 'success');
  if (Router.current === 'evaluation') renderEvaluation(document.getElementById('page-content'));
}

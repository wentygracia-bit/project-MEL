/* ===================================================
   MODULE: Matrix (Matriks Kerja)
   =================================================== */

function renderMatrix(container) {
  const activities = Store.get('activities');
  const programs = Store.get('programs');
  
  let html = `
    <div class="d-flex align-center justify-between mb-20">
      <h3 style="font-size:18px;font-weight:700">Manajemen Matriks Kerja (Annual Work Matrix)</h3>
      ${Auth.can('create') ? `<button class="btn btn-primary" onclick="openAddActivityModal()">+ Tambah Aktivitas</button>` : ''}
    </div>
    
    <div class="filter-bar mb-20">
      <select id="filter-program" onchange="applyMatrixFilter()">
        <option value="">Semua Target Sistem (Program)</option>
        ${programs.map(p => `<option value="${p.id}">${p.kode} - ${p.nama}</option>`).join('')}
      </select>
      <select id="filter-status" onchange="applyMatrixFilter()">
        <option value="">Semua Progress</option>
        <option value="selesai">Selesai</option>
        <option value="proses">Masih Proses</option>
        <option value="belum">Belum Berjalan</option>
        <option value="terlambat">Terlambat</option>
      </select>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table id="matrix-table">
          <thead>
            <tr>
              <th width="25%">Aktivitas / Indikator</th>
              <th width="20%">Target Sistem (Program)</th>
              <th width="20%">Jadwal Proyek</th>
              <th width="15%">PIC</th>
              <th width="15%">Progress</th>
              <th width="5%">Aksi</th>
            </tr>
          </thead>
          <tbody id="matrix-tbody">
            ${generateMatrixRows(activities)}
          </tbody>
        </table>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

function generateMatrixRows(acts) {
  if (acts.length === 0) {
    return '<tr><td colspan="6" class="text-center text-muted" style="padding:40px">Tidak ada data ditemukan</td></tr>';
  }

  return acts.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map(act => {
    return `
      <tr>
        <td>
          <div class="td-name">${act.nama}</div>
          <div style="font-size:11px;color:var(--gray-500);margin-top:4px"><strong>Indikator:</strong> ${act.indikator}</div>
        </td>
        <td>
          <span style="font-size:12px;font-weight:600;color:var(--gray-700)">${getProgramKode(act.programId)}</span>
          <div style="font-size:11px;color:var(--gray-500);margin-top:2px">${getProgramName(act.programId)}</div>
        </td>
        <td>
          <div style="font-size:12px;color:var(--gray-700)">
            <strong>Mulai:</strong> ${formatDateShort(act.startDate)}<br/>
            <strong>Tenggat:</strong> <span style="${act.status === 'terlambat' ? 'color:red;font-weight:bold' : ''}">${formatDateShort(act.endDate)}</span>
          </div>
        </td>
        <td>
          <div class="d-flex align-center gap-8">
            <div class="user-avatar" style="width:24px;height:24px;font-size:10px">${getUserAvatar(act.pic)}</div>
            <span style="font-size:12px;font-weight:600">${getUserName(act.pic)}</span>
          </div>
        </td>
        <td>
          <div class="mb-8">${statusBadge(act.status)}</div>
          <div class="progress-bar-wrap" style="height:6px">
            <div class="progress-bar-fill ${statusColor(act.status)}" style="width:${act.persen}%"></div>
          </div>
          <div class="text-right text-xs mt-8 fw-600">${act.persen}%</div>
        </td>
        <td>
          ${Auth.can('edit') ? `<button class="btn btn-icon btn-secondary text-xs" onclick="openEditActivityModal('${act.id}')" title="Edit">✏️</button>` : '-'}
        </td>
      </tr>
    `;
  }).join('');
}

function applyMatrixFilter() {
  const prog = document.getElementById('filter-program').value;
  const stat = document.getElementById('filter-status').value;
  
  let filtered = Store.get('activities');
  
  if (prog) filtered = filtered.filter(a => a.programId === prog);
  if (stat) filtered = filtered.filter(a => a.status === stat);
  
  document.getElementById('matrix-tbody').innerHTML = generateMatrixRows(filtered);
}

function openAddActivityModal() {
  const programs = Store.get('programs');
  const html = `
    <div class="form-group">
      <label class="form-label">Target Sistem (Program) <span class="required">*</span></label>
      <select id="modal-act-program" class="form-control">
        ${programs.map(p => `<option value="${p.id}">${p.kode} - ${p.nama}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Nama Aktivitas <span class="required">*</span></label>
      <input type="text" id="modal-act-nama" class="form-control" placeholder="Contoh: Pelatihan Petani">
    </div>
    <div class="form-group">
      <label class="form-label">Indikator <span class="required">*</span></label>
      <input type="text" id="modal-act-indikator" class="form-control" placeholder="Contoh: Daftar hadir, 50 petani">
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Tanggal Mulai <span class="required">*</span></label>
        <input type="date" id="modal-act-start" class="form-control">
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal Selesai (Deadline) <span class="required">*</span></label>
        <input type="date" id="modal-act-end" class="form-control">
      </div>
    </div>
  `;
  openModal('Tambah Aktivitas Baru', html, `<button class="btn btn-secondary" onclick="closeModal()">Batal</button> <button class="btn btn-primary" onclick="saveActivity()">Simpan Aktivitas</button>`);
}

window.openEditActivityModal = function(id) {
  const acts = Store.get('activities');
  const act = acts.find(a => a.id === id);
  if (!act) return;
  const programs = Store.get('programs');
  const html = `
    <input type="hidden" id="modal-act-id" value="${act.id}">
    <div class="form-group">
      <label class="form-label">Target Sistem (Program) <span class="required">*</span></label>
      <select id="modal-act-program" class="form-control">
        ${programs.map(p => `<option value="${p.id}" ${p.id === act.programId ? 'selected' : ''}>${p.kode} - ${p.nama}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Nama Aktivitas <span class="required">*</span></label>
      <input type="text" id="modal-act-nama" class="form-control" value="${act.nama}">
    </div>
    <div class="form-group">
      <label class="form-label">Indikator <span class="required">*</span></label>
      <input type="text" id="modal-act-indikator" class="form-control" value="${act.indikator}">
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Tanggal Mulai <span class="required">*</span></label>
        <input type="date" id="modal-act-start" class="form-control" value="${act.startDate}">
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal Selesai (Deadline) <span class="required">*</span></label>
        <input type="date" id="modal-act-end" class="form-control" value="${act.endDate}">
      </div>
    </div>
  `;
  openModal('Edit Aktivitas / Indikator', html, `<button class="btn btn-secondary" onclick="closeModal()">Batal</button> <button class="btn btn-primary" onclick="saveActivity()">Simpan Perubahan</button>`);
}

window.saveActivity = function() {
  const id = document.getElementById('modal-act-id')?.value;
  const programId = document.getElementById('modal-act-program').value;
  const nama = document.getElementById('modal-act-nama').value;
  const indikator = document.getElementById('modal-act-indikator').value;
  const start = document.getElementById('modal-act-start').value;
  const end = document.getElementById('modal-act-end').value;

  if (!nama || !indikator || !start || !end) {
    showToast('Validasi Gagal', 'Semua field harus diisi', 'error');
    return;
  }

  const acts = Store.get('activities');
  if (id) {
    const idx = acts.findIndex(a => a.id === id);
    if (idx > -1) {
      acts[idx].programId = programId;
      acts[idx].nama = nama;
      acts[idx].indikator = indikator;
      acts[idx].startDate = start;
      acts[idx].endDate = end;
      showToast('Berhasil', 'Aktivitas berhasil diperbarui', 'success');
    }
  } else {
    acts.push({
      id: genId('a'),
      programId: programId,
      nama: nama,
      indikator: indikator,
      pic: Auth.currentUser().id,
      startDate: start,
      endDate: end,
      status: 'belum',
      persen: 0,
      q: getQuarter(start),
      verified: false
    });
    showToast('Berhasil', 'Aktivitas baru berhasil ditambahkan', 'success');
  }
  
  Store.set('activities', acts);
  closeModal();
  applyMatrixFilter();
}

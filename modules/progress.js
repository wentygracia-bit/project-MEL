/* ===================================================
   MODULE: Progress Tracking (Pelacakan Progress)
   =================================================== */

function renderProgress(container) {
  const user = Auth.currentUser();
  let activities = Store.get('activities');
  
  // Jika PIC, hanya tampilkan aktivitasnya sendiri
  if (user.role === 'pic') {
    activities = activities.filter(a => a.pic === user.id);
  }

  container.innerHTML = `
    <div class="d-flex align-center justify-between mb-24">
      <div>
        <h3 style="font-size:20px;font-weight:800;color:var(--gray-800)">📈 Pelacakan Progress</h3>
        <p style="color:var(--gray-400);font-size:13px;margin-top:4px">Perbarui status penyelesaian dan unggah dokumen bukti (MoV)</p>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th width="30%">Aktivitas</th>
              <th width="15%">Deadline</th>
              <th width="20%">Status</th>
              <th width="20%">Progress (%)</th>
              <th width="15%">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${activities.length === 0 ? '<tr><td colspan="5" class="text-center text-muted" style="padding:40px">Tidak ada aktivitas yang ditugaskan kepada Anda</td></tr>' : 
              activities.map(act => `
                <tr>
                  <td>
                    <div class="td-name">${act.nama}</div>
                    <div style="font-size:11px;color:var(--gray-500);margin-top:4px"><strong>Syarat:</strong> ${act.indikator}</div>
                  </td>
                  <td>
                    <span style="${act.status === 'terlambat' ? 'color:red;font-weight:bold' : ''}">${formatDateShort(act.endDate)}</span>
                  </td>
                  <td>
                    <div class="mb-8">${statusBadge(act.status)}</div>
                  </td>
                  <td>
                    <div class="d-flex align-center gap-12">
                      <div class="progress-bar-wrap" style="flex:1">
                        <div class="progress-bar-fill ${statusColor(act.status)}" style="width:${act.persen}%"></div>
                      </div>
                      <span style="font-size:12px;font-weight:700">${act.persen}%</span>
                    </div>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="openUpdateModal('${act.id}')">Update Progress</button>
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openUpdateModal = function(id) {
  const act = Store.get('activities').find(a => a.id === id);
  if (!act) return;

  const html = `
    <div class="form-group">
      <label class="form-label">Status Aktivitas</label>
      <select class="form-control" id="update-status">
        <option value="belum" ${act.status === 'belum' ? 'selected' : ''}>Belum Berjalan</option>
        <option value="proses" ${act.status === 'proses' ? 'selected' : ''}>Masih Proses</option>
        <option value="selesai" ${act.status === 'selesai' ? 'selected' : ''}>Selesai</option>
      </select>
    </div>
    
    <div class="form-group">
      <label class="form-label">Persentase Penyelesaian: <span id="val-persen">${act.persen}%</span></label>
      <input type="range" class="progress-slider" id="update-persen" min="0" max="100" value="${act.persen}" oninput="document.getElementById('val-persen').textContent = this.value + '%'">
    </div>

    <div class="form-group">
      <label class="form-label">Catatan Progress</label>
      <textarea class="form-control" id="update-catatan" placeholder="Tuliskan apa saja yang sudah dikerjakan..."></textarea>
    </div>

    <div class="form-group">
      <label class="form-label">Upload Means of Verification (MoV)</label>
      <div class="upload-zone" onclick="alert('Ini simulasi upload dokumen. Di sistem asli ini akan membuka dialog file.')">
        <div class="upload-zone-icon">📄</div>
        <h4>Klik untuk upload dokumen</h4>
        <p>Bisa berupa PDF laporan, foto kegiatan, atau link (Maks 10MB)</p>
      </div>
    </div>
  `;

  const footer = `
    <button class="btn btn-secondary" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="saveProgress('${act.id}')">Simpan Pembaruan</button>
  `;

  openModal('Update Progress: ' + act.nama, html, footer);
}

window.saveProgress = function(id) {
  const status = document.getElementById('update-status').value;
  const persen = document.getElementById('update-persen').value;
  
  let acts = Store.get('activities');
  let act = acts.find(a => a.id === id);
  if (act) {
    act.status = status;
    act.persen = Number(persen);
    Store.set('activities', acts);
    
    showToast('Berhasil', 'Progress aktivitas berhasil diperbarui!');
    closeModal();
    renderProgress(document.getElementById('page-content'));
  }
}

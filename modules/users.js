

function renderUsers(container) {
  const users = Store.get('users');

  container.innerHTML = `
    <div class="d-flex align-center justify-between mb-24">
      <div>
        <h3 style="font-size:20px;font-weight:800;color:var(--gray-800)">👥 Manajemen Pengguna</h3>
        <p style="color:var(--gray-400);font-size:13px;margin-top:4px">Kelola akses, peran, dan PIC untuk sistem MEL</p>
      </div>
      <button class="btn btn-primary" onclick="alert('Fitur tambah user segera hadir')">+ Tambah Pengguna Baru</button>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table width="100%">
          <thead>
            <tr>
              <th width="30%">Nama & Email</th>
              <th width="20%">Divisi</th>
              <th width="20%">Role Akses</th>
              <th width="15%">Status</th>
              <th width="15%">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>
                  <div class="d-flex align-center gap-12">
                    <div class="user-avatar" style="width:36px;height:36px">${u.avatar}</div>
                    <div>
                      <div class="fw-700" style="font-size:13px;color:var(--gray-800)">${u.name}</div>
                      <div style="font-size:11px;color:var(--gray-500)">${u.email}</div>
                    </div>
                  </div>
                </td>
                <td><span style="font-size:13px;color:var(--gray-700)">${u.divisi}</span></td>
                <td>
                  <span class="role-badge role-${u.role}">${roleLabelDetail(u.role)}</span>
                </td>
                <td>
                  ${u.active 
                    ? '<span class="badge badge-success">Aktif</span>' 
                    : '<span class="badge badge-gray">Nonaktif</span>'}
                </td>
                <td>
                  <button class="btn btn-icon btn-secondary text-xs" onclick="alert('Edit user ${u.name}')" title="Edit">✏️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function roleLabelDetail(r) {
  const map = {
    admin: 'Admin MEL',
    pic: 'Staf PIC Program',
    viewer: 'Manajemen (Viewer)'
  };
  return map[r] || r;
}

/* ===================================================
   MODULE: Reports (Laporan Pencapaian)
   =================================================== */

function renderReports(container) {
  container.innerHTML = `
    <div class="d-flex align-center justify-between mb-24">
      <div>
        <h3 style="font-size:20px;font-weight:800;color:var(--gray-800)">📄 Laporan Pencapaian</h3>
        <p style="color:var(--gray-400);font-size:13px;margin-top:4px">Generate, filter, dan export laporan capaian kinerja organisasi</p>
      </div>
      <div class="d-flex gap-8">
        <button class="btn btn-outline" onclick="exportExcel()">⬇️ Export Excel / CSV</button>
        <button class="btn btn-primary" onclick="exportPDF()">📄 Export Laporan PDF</button>
      </div>
    </div>

    <div class="card" style="padding:24px">
      <h4 style="font-size:14px;font-weight:700;margin-bottom:16px">Filter Laporan</h4>
      <div class="form-row-3 mb-20">
        <div>
          <label class="form-label">Periode Waktu (Kuartal)</label>
          <select class="form-control" id="rep-q">
            <option value="All">Semua Kuartal (1 Tahun)</option>
            <option value="Q1">Q1 (Jan-Mar)</option>
            <option value="Q2">Q2 (Apr-Jun)</option>
            <option value="Q3">Q3 (Jul-Sep)</option>
            <option value="Q4">Q4 (Okt-Des)</option>
          </select>
        </div>
        <div>
          <label class="form-label">Divisi / Program</label>
          <select class="form-control" id="rep-div">
            <option value="All">Semua Program / Divisi</option>
            ${Store.get('programs').map(p => `<option value="${p.id}">${p.nama}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="form-label">Status Aktivitas</label>
          <select class="form-control" id="rep-status">
            <option value="All">Semua Status</option>
            <option value="selesai">Hanya Selesai</option>
            <option value="terlambat">Hanya Terlambat</option>
          </select>
        </div>
      </div>
      <button class="btn btn-secondary w-100" onclick="generateReportPreview()">Terapkan Filter & Preview Data</button>
    </div>

    <div class="card mt-24">
      <div class="card-header">
        <div class="card-title">Preview Data Laporan</div>
      </div>
      <div class="table-wrap" style="border:none;border-radius:0" id="report-preview-container">
        <!-- Preview Tabel Laporan -->
      </div>
    </div>
  `;
  
  // Render default preview
  setTimeout(generateReportPreview, 100);
}

window.generateReportPreview = function() {
  const q = document.getElementById('rep-q').value;
  const div = document.getElementById('rep-div').value;
  const stat = document.getElementById('rep-status').value;

  let activities = Store.get('activities');

  if (q !== 'All') activities = activities.filter(a => a.q === q);
  if (div !== 'All') activities = activities.filter(a => a.programId === div);
  if (stat !== 'All') activities = activities.filter(a => a.status === stat);

  const container = document.getElementById('report-preview-container');

  if (activities.length === 0) {
    container.innerHTML = `<div class="empty-state"><h4>Tidak ada data yang cocok dengan filter.</h4></div>`;
    return;
  }

  container.innerHTML = `
    <table width="100%" id="report-table-data">
      <thead>
        <tr>
          <th>Kuartal</th>
          <th>Nama Aktivitas / Indikator</th>
          <th>Status</th>
          <th>Capaian (%)</th>
          <th>PIC</th>
        </tr>
      </thead>
      <tbody>
        ${activities.map(a => `
          <tr>
            <td style="font-size:12px;font-weight:700">${a.q}</td>
            <td>
              <div class="fw-600">${a.nama}</div>
              <div style="font-size:11px;color:var(--gray-500)">Indikator: ${a.indikator}</div>
            </td>
            <td>${statusBadge(a.status)}</td>
            <td><div style="font-weight:600;color:${a.persen === 100 ? 'var(--success)' : 'var(--gray-800)'}">${a.persen}%</div></td>
            <td style="font-size:12px">${getUserName(a.pic)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

window.exportExcel = function() {
  showToast('Memproses Export', 'Mengekspor data laporan ke Excel...', 'info');
  setTimeout(() => {
    try {
      const table = document.getElementById('report-table-data');
      if (!table) return showToast('Gagal', 'Tidak ada data untuk diexport', 'error');
      
      const wb = XLSX.utils.table_to_book(table, {sheet: "Laporan YNKI"});
      XLSX.writeFile(wb, `Laporan_YNKI_${formatDateInput(new Date())}.xlsx`);
      showToast('Berhasil', 'Laporan Excel berhasil diunduh');
    } catch(e) {
      showToast('Error', 'Gagal membuat file Excel: ' + e.message, 'error');
    }
  }, 1000);
}

window.exportPDF = function() {
  showToast('Memproses Export', 'Mengekspor laporan formal ke PDF...', 'info');
  setTimeout(() => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text("Laporan Capaian Kinerja YNKI", 14, 20);
      doc.setFontSize(10);
      doc.text("Sistem Monitoring, Evaluasi, dan Pembelajaran (MEL)", 14, 26);
      doc.text("Tanggal Cetak: " + formatDate(new Date()), 14, 32);

      const table = document.getElementById('report-table-data');
      if (!table) return showToast('Gagal', 'Tidak ada data untuk diexport', 'error');

      doc.autoTable({
        html: '#report-table-data',
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 8, font: 'helvetica' },
        headStyles: { fillColor: [6, 95, 70] } // var(--brand-800)
      });

      doc.save(`Laporan_YNKI_${formatDateInput(new Date())}.pdf`);
      showToast('Berhasil', 'Laporan PDF berhasil diunduh');
    } catch (e) {
      showToast('Error', 'Gagal membuat file PDF: ' + e.message, 'error');
    }
  }, 1500);
}

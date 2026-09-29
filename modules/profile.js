/* ===================================================
   MODULE: Tentang MEL — Halaman Profil Singkat
   =================================================== */

function renderProfile(container) {
  container.innerHTML = `

    <!-- Hero -->
    <div style="background: linear-gradient(135deg, #0f4c35 0%, #1a7a52 60%, #22c55e 100%);
                color: white; padding: 48px 40px; border-radius: 20px; margin-bottom: 28px;
                position: relative; overflow: hidden;">
      <div style="position:absolute;right:-60px;top:-60px;width:320px;height:320px;
                  background:rgba(255,255,255,0.05);border-radius:50%;"></div>
      <div style="position:absolute;right:100px;bottom:-80px;width:200px;height:200px;
                  background:rgba(255,255,255,0.04);border-radius:50%;"></div>
      <div style="position:relative;z-index:2;">
        <div style="display:inline-flex;align-items:center;gap:8px;
                    background:rgba(255,255,255,0.15);padding:6px 16px;
                    border-radius:20px;font-size:11px;font-weight:700;
                    letter-spacing:1.5px;margin-bottom:18px;">
          🌿 YNKI MEL SYSTEM
        </div>
        <h1 style="font-size:30px;font-weight:800;margin-bottom:12px;line-height:1.2;letter-spacing:-0.5px;">
          Sistem Monitoring, Evaluasi<br>& Pembelajaran (MEL)
        </h1>
        <p style="font-size:14px;opacity:0.75;font-style:italic;margin-bottom:0;">
          Yayasan Natural Kapital Indonesia (YNKI)
        </p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">

      <!-- Tentang Proyek -->
      <div class="card p-28" style="grid-column:1/-1;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(16,185,129,0.1);
                      display:flex;align-items:center;justify-content:center;font-size:20px;">📋</div>
          <h2 style="font-size:17px;font-weight:800;color:var(--gray-800);">Tentang Sistem MEL Ini</h2>
        </div>
        <p style="font-size:14px;line-height:1.8;color:var(--gray-600);margin-bottom:12px;">
          Sistem MEL ini disusun untuk mendukung <strong>Yayasan Natural Kapital Indonesia (YNKI)</strong>
          dalam mengelola, memantau, dan mengevaluasi seluruh program serta kegiatan lapangan yang sedang
          berjalan secara lebih terstruktur, transparan, dan berbasis data.
        </p>
        <p style="font-size:14px;line-height:1.8;color:var(--gray-600);">
          MEL bukan sekadar alat pelaporan — melainkan sebuah <strong>mesin pembelajaran organisasi</strong>
          yang membantu YNKI memahami <em>apa yang berhasil, apa yang perlu diperbaiki, dan bagaimana
          adaptasi dapat dilakukan</em> di tengah perubahan kondisi lapangan.
        </p>
      </div>

      <!-- Tujuan -->
      <div class="card p-28">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(59,130,246,0.1);
                      display:flex;align-items:center;justify-content:center;font-size:20px;">🎯</div>
          <h2 style="font-size:17px;font-weight:800;color:var(--gray-800);">Tujuan</h2>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
          ${[
            ['Memantau kemajuan kegiatan dan indikator kinerja secara rutin dan real-time.', '📊'],
            ['Mengevaluasi efektivitas dan relevansi program yang sedang dijalankan.', '📝'],
            ['Mendokumentasikan pembelajaran, hambatan lapangan, dan rekomendasi adaptif.', '💡'],
            ['Mendukung pengambilan keputusan manajemen berbasis data dan bukti lapangan.', '🔍'],
          ].map(([t, icon]) => `
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--gray-600);line-height:1.6;">
              <span style="font-size:16px;flex-shrink:0;margin-top:1px;">${icon}</span>
              <span>${t}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Yang Ingin Dicapai -->
      <div class="card p-28">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(139,92,246,0.1);
                      display:flex;align-items:center;justify-content:center;font-size:20px;">🌱</div>
          <h2 style="font-size:17px;font-weight:800;color:var(--gray-800);">Yang Ingin Dicapai</h2>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
          ${[
            ['Seluruh kegiatan aktif YNKI terpantau status dan progresnya dalam satu platform.', '✅'],
            ['Tim PIC dan manajer memiliki visibilitas penuh terhadap tenggat waktu dan capaian.', '👁️'],
            ['Pembelajaran lapangan terdokumentasi dan dapat diakses lintas tim.', '📚'],
            ['Manajemen adaptif — program dapat direvisi dan disesuaikan tanpa birokrasi berlebih.', '🔄'],
          ].map(([t, icon]) => `
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--gray-600);line-height:1.6;">
              <span style="font-size:16px;flex-shrink:0;margin-top:1px;">${icon}</span>
              <span>${t}</span>
            </li>
          `).join('')}
        </ul>
      </div>

    </div>

    <!-- Ruang Lingkup -->
    <div class="card p-28" style="margin-bottom:20px;border:2px solid rgba(16,185,129,0.2);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:40px;height:40px;border-radius:10px;background:rgba(16,185,129,0.1);
                    display:flex;align-items:center;justify-content:center;font-size:20px;">🗺️</div>
        <h2 style="font-size:17px;font-weight:800;color:var(--gray-800);">Ruang Lingkup Sistem</h2>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px;">
          <div style="font-size:13px;font-weight:700;color:#15803d;margin-bottom:10px;">✅ TERMASUK dalam sistem ini</div>
          <ul style="padding-left:18px;margin:0;font-size:13px;color:var(--gray-600);line-height:2;">
            <li>Program dan kegiatan yang <strong>sedang aktif berjalan</strong></li>
            <li>Proyek yang <strong>saat ini sedang dilaksanakan</strong> oleh YNKI</li>
            <li>Indikator kinerja dan target yang masih dalam periode aktif</li>
            <li>Pembelajaran dan evaluasi dari kegiatan berjalan</li>
          </ul>
        </div>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:18px;">
          <div style="font-size:13px;font-weight:700;color:#dc2626;margin-bottom:10px;">❌ TIDAK termasuk dalam sistem ini</div>
          <ul style="padding-left:18px;margin:0;font-size:13px;color:var(--gray-600);line-height:2;">
            <li>Proyek yang sudah selesai / ditutup</li>
            <li>Program yang masih dalam tahap perencanaan awal</li>
            <li>Data keuangan, pembukuan, atau akuntansi</li>
            <li>Pengelolaan anggaran dan laporan finansial</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- MEL Statement -->
    <div style="background:linear-gradient(135deg,#0f4c35,#1a7a52);border-radius:16px;padding:32px 36px;color:white;text-align:center;">
      <div style="font-size:28px;margin-bottom:14px;">🌿</div>
      <p style="font-size:15px;line-height:1.8;opacity:0.9;max-width:620px;margin:0 auto;font-style:italic;">
        "YNKI menggunakan sistem MEL sebagai mesin pembelajaran organisasi — mengukur perubahan,
        menghasilkan bukti lapangan, dan mendukung manajemen adaptif demi terwujudnya
        <strong>lanskap yang sehat dan komunitas yang sejahtera</strong>."
      </p>
    </div>

  `;
}

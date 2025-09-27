import { useMemo, useState } from 'react';

const menuItems = [
  { key: 'overview', label: 'Dashboard Saya' },
  { key: 'catalog', label: 'Katalog Produk Lelang' },
  { key: 'history', label: 'Riwayat Lelang' },
  { key: 'profile', label: 'Profil Pengguna' },
];

const mockAuctions = [
  {
    id: 'PKS-2025-008',
    product: 'CPO Sungai Meranti',
    status: 'On Bidding',
    closing: '28 Sep 2025 • 15:00 WIB',
    minBid: 'Rp 8.200/kg',
  },
  {
    id: 'PKS-2025-009',
    product: 'Kernel Sungai Meranti',
    status: 'Coming Soon',
    closing: '30 Sep 2025 • 10:00 WIB',
    minBid: 'Rp 5.600/kg',
  },
  {
    id: 'PKS-2025-010',
    product: 'CPO Riau Timur',
    status: 'Closing Soon',
    closing: '28 Sep 2025 • 11:00 WIB',
    minBid: 'Rp 8.150/kg',
  },
];

const mockHistory = [
  {
    id: 'PKS-2025-002',
    product: 'CPO Dumai',
    bid: 'Rp 8.050/kg',
    status: 'Menang',
    date: '12 Sep 2025',
  },
  {
    id: 'PKS-2025-003',
    product: 'Kernel Indragiri',
    bid: 'Rp 5.420/kg',
    status: 'Kalah',
    date: '20 Sep 2025',
  },
  {
    id: 'PKS-2025-005',
    product: 'CPO Rokan Hulu',
    bid: 'Rp 8.120/kg',
    status: 'Menang',
    date: '23 Sep 2025',
  },
];

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const activeTitle = useMemo(() => {
    const active = menuItems.find((item) => item.key === activeSection);
    return active?.label ?? 'Dashboard Saya';
  }, [activeSection]);

  const renderOverview = () => (
    <div className="dashboard__grid">
      <article className="dashboard__card">
        <h3>Level Akses</h3>
        <p>
          <strong>Vendor Terverifikasi</strong>
        </p>
        <small>Akun siap mengikuti seluruh sesi lelang APAS.</small>
      </article>
      <article className="dashboard__card">
        <h3>Saldo Virtual Account</h3>
        <p className="dashboard__metric">Rp 125.000.000</p>
        <small>Dapat digunakan sebagai jaminan saat mengikuti lelang.</small>
      </article>
      <article className="dashboard__card dashboard__card--highlight">
        <h3>Lelang Aktif Hari Ini</h3>
        <p className="dashboard__metric">3</p>
        <ul>
          <li>PKS-2025-010 · CPO Riau Timur</li>
          <li>PKS-2025-008 · CPO Sungai Meranti</li>
          <li>PKS-2025-006 · Kernel Rokan Hulu</li>
        </ul>
      </article>
      <article className="dashboard__card">
        <h3>Notifikasi Penting</h3>
        <ul className="dashboard__list">
          <li>Upload bukti pembayaran invoice #INV-230925 sebelum 29 Sep 2025.</li>
          <li>Perbaharui data profil PIC sebelum 5 Okt 2025.</li>
          <li>Reminder sesi bidding dimulai 30 menit lagi.</li>
        </ul>
      </article>
    </div>
  );

  const renderCatalog = () => (
    <div className="dashboard__section">
      <header>
        <h3>Daftar Produk Lelang</h3>
        <p>Pilih sesi lelang untuk melihat detail spesifikasi PKS dan submit penawaran.</p>
      </header>
      <div className="dashboard__table-wrapper">
        <table className="dashboard__table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Produk</th>
              <th>Status</th>
              <th>Tutup Lelang</th>
              <th>Harga Awal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mockAuctions.map((auction) => (
              <tr key={auction.id}>
                <td>{auction.id}</td>
                <td>{auction.product}</td>
                <td>
                  <span className={`dashboard__status dashboard__status--${auction.status.replace(/\s+/g, '').toLowerCase()}`}>
                    {auction.status}
                  </span>
                </td>
                <td>{auction.closing}</td>
                <td>{auction.minBid}</td>
                <td>
                  <button type="button" className="dashboard__action">
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="dashboard__section">
      <header>
        <h3>Riwayat Lelang Terakhir</h3>
        <p>Pantau performa bidding perusahaan Anda pada sesi sebelumnya.</p>
      </header>
      <div className="dashboard__table-wrapper">
        <table className="dashboard__table">
          <thead>
            <tr>
              <th>Kode Lelang</th>
              <th>Produk</th>
              <th>Bid Terakhir</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product}</td>
                <td>{item.bid}</td>
                <td>
                  <span className={`dashboard__pill dashboard__pill--${item.status === 'Menang' ? 'success' : 'danger'}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="dashboard__section dashboard__section--profile">
      <header>
        <h3>Informasi Perusahaan</h3>
        <p>Perbaharui data agar proses due diligence tetap berjalan lancar.</p>
      </header>
      <div className="dashboard__profile-grid">
        <div>
          <h4>Data Utama</h4>
          <ul>
            <li><strong>Nama Perusahaan:</strong> PT Sumber Sawit Ekspres</li>
            <li><strong>NIB:</strong> 9123456780001</li>
            <li><strong>Alamat:</strong> Jl. Jenderal Sudirman No. 88, Pekanbaru</li>
            <li><strong>Jenis:</strong> Trading House</li>
          </ul>
        </div>
        <div>
          <h4>Kontak PIC</h4>
          <ul>
            <li><strong>Nama:</strong> Ahmad Kurniawan</li>
            <li><strong>Email:</strong> procurement@sumbersawit.co.id</li>
            <li><strong>Nomor HP:</strong> +62 812-3456-7890</li>
          </ul>
        </div>
        <div>
          <h4>Status Dokumen</h4>
          <ul>
            <li>Akte Pendirian · <span className="dashboard__badge dashboard__badge--complete">Valid</span></li>
            <li>Surat PKKP · <span className="dashboard__badge dashboard__badge--warning">Perlu Pembaharuan</span></li>
            <li>NPWP · <span className="dashboard__badge dashboard__badge--complete">Valid</span></li>
          </ul>
        </div>
      </div>
      <div className="dashboard__actions">
        <button type="button" className="btn btn--primary">Perbaharui Profil</button>
        <button type="button" className="btn btn--ghost" onClick={() => window.location.hash = '/'}>
          Kembali ke Landing Page
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'catalog':
        return renderCatalog();
      case 'history':
        return renderHistory();
      case 'profile':
        return renderProfile();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__layout">
        <aside className="dashboard__sidebar" aria-label="Menu dashboard">
          <div className="dashboard__sidebar-top">
            <span className="dashboard__sidebar-label">Menu Utama</span>
            <nav>
              <ul className="dashboard__menu">
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={`dashboard__menu-button ${activeSection === item.key ? 'is-active' : ''}`}
                      onClick={() => setActiveSection(item.key)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="dashboard__sidebar-bottom">
            <button type="button" className="dashboard__logout" onClick={() => window.location.hash = '/'}>
              Keluar
            </button>
          </div>
        </aside>
        <main className="dashboard__content">
          <header className="dashboard__header">
            <div>
              <h1>{activeTitle}</h1>
              <p>Kelola seluruh aktivitas e-Bidding Anda melalui portal vendor APAS.</p>
            </div>
            <div className="dashboard__user-card">
              <span className="dashboard__user-avatar">SE</span>
              <div>
                <strong>PT Sumber Sawit Ekspres</strong>
                <small>Vendor ID: VND-230912</small>
              </div>
            </div>
          </header>
          <section className="dashboard__main">{renderContent()}</section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

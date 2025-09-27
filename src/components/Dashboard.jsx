import { useEffect, useMemo, useState } from 'react';

const menuItems = [
  { key: 'overview', label: 'Dashboard Saya' },
  { key: 'catalog', label: 'Katalog Produk Lelang' },
  { key: 'bidding', label: 'Bidding Aktif' },
  { key: 'history', label: 'Riwayat Lelang' },
  { key: 'profile', label: 'Profil Pengguna' },
];

const catalogFilters = [
  { key: 'all', label: 'Semua' },
  { key: 'onBidding', label: 'On Bidding' },
  { key: 'closingSoon', label: 'Closing Soon' },
  { key: 'comingSoon', label: 'Coming Soon' },
];

const catalogItems = [
  {
    id: 'PKS-2025-010',
    product: 'CPO Riau Timur',
    mill: 'PKS Riau Timur',
    status: 'Closing Soon',
    statusKey: 'closingSoon',
    closingLabel: '28 Sep 2025 • 11:00 WIB',
    basePrice: 8150,
    lastBid: 8225,
    lastBidder: 'Peserta Lain',
    minIncrement: 25,
    volume: '500 MT',
    ffa: 'FFA 4.5%',
    location: 'Kab. Rokan Hulu, Riau',
    remainingSeconds: 480,
    unit: 'kg',
  },
  {
    id: 'PKS-2025-011',
    product: 'CPO Sungai Meranti',
    mill: 'PKS Sungai Meranti',
    status: 'On Bidding',
    statusKey: 'onBidding',
    closingLabel: '28 Sep 2025 • 15:00 WIB',
    basePrice: 8200,
    lastBid: 8325,
    lastBidder: 'Peserta Lain',
    minIncrement: 50,
    volume: '400 MT',
    ffa: 'FFA 4.2%',
    location: 'Kab. Pelalawan, Riau',
    remainingSeconds: 780,
    unit: 'kg',
  },
  {
    id: 'PKS-2025-013',
    product: 'Kernel Dumai',
    mill: 'PKS Dumai',
    status: 'Coming Soon',
    statusKey: 'comingSoon',
    closingLabel: '30 Sep 2025 • 10:00 WIB',
    basePrice: 5600,
    lastBid: 0,
    lastBidder: '-',
    minIncrement: 25,
    volume: '250 MT',
    ffa: 'Moisture 6%',
    location: 'Kota Dumai, Riau',
    remainingSeconds: 3600,
    unit: 'kg',
  },
];

const historyBaseline = [
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

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const formatRemainingTime = (seconds) => {
  if (seconds == null) return '--:--';
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [catalogFilter, setCatalogFilter] = useState('onBidding');
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [biddingState, setBiddingState] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [biddingMessage, setBiddingMessage] = useState(null);
  const [biddingError, setBiddingError] = useState(null);
  const [autoReminder, setAutoReminder] = useState(false);

  const activeTitle = useMemo(() => {
    const active = menuItems.find((item) => item.key === activeSection);
    return active?.label ?? 'Dashboard Saya';
  }, [activeSection]);

  const filteredCatalog = useMemo(() => {
    if (catalogFilter === 'all') {
      return catalogItems;
    }
    return catalogItems.filter((item) => item.statusKey === catalogFilter);
  }, [catalogFilter]);

  useEffect(() => {
    if (!selectedAuction) {
      setBiddingState(null);
      return;
    }

    const { id, lastBid, lastBidder, remainingSeconds, statusKey, basePrice, unit } = selectedAuction;
    const openingBid = lastBid > 0 ? lastBid : basePrice;
    const defaultBidder = lastBid > 0 && lastBidder ? lastBidder : 'Belum ada penawaran';
    const status = statusKey === 'comingSoon' ? 'SCHEDULED' : 'ACTIVE';
    const countdown = statusKey === 'comingSoon' ? remainingSeconds : Math.max(remainingSeconds, 120);

    setBiddingState({
      auctionId: id,
      highestBid: openingBid,
      highestBidder: defaultBidder,
      lastUserBid: null,
      status,
      remainingSeconds: countdown,
      activityLog: [
        {
          label: 'Lelang dibuka',
          description: `Harga awal ${formatCurrency(basePrice)}/${unit}`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });
    setBidAmount('');
    setBiddingMessage(null);
    setBiddingError(null);
    setAutoReminder(false);
  }, [selectedAuction]);

  useEffect(() => {
    if (!biddingState || biddingState.status !== 'ACTIVE' || biddingState.remainingSeconds <= 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setBiddingState((prev) => {
        if (!prev || prev.status !== 'ACTIVE') {
          return prev;
        }

        const nextRemaining = prev.remainingSeconds - 1;
        if (nextRemaining <= 0) {
          const userWinning = prev.highestBidder === 'Perusahaan Anda';
          const status = userWinning ? 'WON' : 'CLOSED';
          return {
            ...prev,
            remainingSeconds: 0,
            status,
            activityLog: [
              ...prev.activityLog,
              {
                label: status === 'WON' ? 'Selamat! Anda menjadi pemenang' : 'Lelang ditutup',
                description:
                  status === 'WON'
                    ? `Penawaran ${formatCurrency(prev.highestBid)}/${selectedAuction.unit} menjadi harga pemenang.`
                    : 'Penawaran lain lebih tinggi sebelum batas waktu berakhir.',
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }

        return { ...prev, remainingSeconds: nextRemaining };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [biddingState, selectedAuction]);

  const ensureSelectedAuction = (auction) => {
    setSelectedAuction(auction);
    setActiveSection('bidding');
  };

  const minAcceptableBid = useMemo(() => {
    if (!biddingState || !selectedAuction) return null;
    if (biddingState.highestBidder === 'Belum ada penawaran') {
      return selectedAuction.basePrice;
    }
    const highest = Math.max(biddingState.highestBid, selectedAuction.basePrice);
    return highest + selectedAuction.minIncrement;
  }, [biddingState, selectedAuction]);

  const handleQuickAdjust = (increment) => {
    if (!biddingState || !selectedAuction) return;
    const highest = Math.max(biddingState.highestBid, selectedAuction.basePrice);
    const nextBid = highest + increment;
    setBidAmount(String(nextBid));
    setBiddingError(null);
  };

  const handlePlaceBid = (event) => {
    event.preventDefault();
    if (!biddingState || !selectedAuction) {
      return;
    }

    if (biddingState.status !== 'ACTIVE') {
      setBiddingError('Sesi bidding belum dibuka atau sudah ditutup.');
      return;
    }

    const numericBid = Number(bidAmount);
    if (Number.isNaN(numericBid) || numericBid <= 0) {
      setBiddingError('Masukkan nominal penawaran dalam angka.');
      return;
    }

    if (minAcceptableBid != null && numericBid < minAcceptableBid) {
      setBiddingError(`Penawaran minimal saat ini ${formatCurrency(minAcceptableBid)}/${selectedAuction.unit}.`);
      return;
    }

    setBiddingState((prev) => {
      if (!prev) return prev;
      const timeStamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return {
        ...prev,
        highestBid: numericBid,
        highestBidder: 'Perusahaan Anda',
        lastUserBid: numericBid,
        activityLog: [
          ...prev.activityLog,
          {
            label: 'Penawaran dikirim',
            description: `Anda menawar ${formatCurrency(numericBid)}/${selectedAuction.unit}.`,
            time: timeStamp,
          },
        ],
      };
    });
    setBidAmount('');
    setBiddingError(null);
    setBiddingMessage('Penawaran Anda berhasil tercatat. Pertahankan hingga waktu lelang berakhir.');
  };

  const finalizeBidding = () => {
    setBiddingState((prev) => {
      if (!prev || !selectedAuction) return prev;
      if (prev.status !== 'ACTIVE') {
        return prev;
      }
      const userWinning = prev.highestBidder === 'Perusahaan Anda';
      return {
        ...prev,
        status: userWinning ? 'WON' : 'CLOSED',
        remainingSeconds: 0,
        activityLog: [
          ...prev.activityLog,
          {
            label: userWinning ? 'Sesi ditutup - Anda pemenang' : 'Sesi ditutup',
            description:
              userWinning
                ? `Penawaran ${formatCurrency(prev.highestBid)}/${selectedAuction.unit} menjadi harga final.`
                : 'Penawaran terakhir Anda belum melewati harga tertinggi.',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
    });
  };

  const historyData = useMemo(() => {
    if (biddingState?.status === 'WON' && selectedAuction) {
      return [
        {
          id: selectedAuction.id,
          product: selectedAuction.product,
          bid: `${formatCurrency(biddingState.highestBid)}/${selectedAuction.unit}`,
          status: 'Menang',
          date: new Date().toLocaleDateString('id-ID'),
        },
        ...historyBaseline,
      ];
    }
    return historyBaseline;
  }, [biddingState?.status, biddingState?.highestBid, selectedAuction]);

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
        <p className="dashboard__metric">{catalogItems.filter((item) => item.statusKey !== 'comingSoon').length}</p>
        <ul>
          {catalogItems
            .filter((item) => item.statusKey !== 'comingSoon')
            .map((item) => (
              <li key={item.id}>
                {item.id} · {item.product}
              </li>
            ))}
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
      {selectedAuction && biddingState && (
        <article className="dashboard__card dashboard__card--inline">
          <h3>Sesi Lelang yang Sedang Diikuti</h3>
          <p>
            <strong>{selectedAuction.product}</strong>
          </p>
          <small>Status: {biddingState.status === 'WON' ? 'Menang' : biddingState.status === 'CLOSED' ? 'Selesai' : 'Sedang berlangsung'}</small>
          <button type="button" className="btn btn--primary" onClick={() => setActiveSection('bidding')}>
            Buka Halaman Bidding
          </button>
        </article>
      )}
    </div>
  );

  const renderCatalog = () => (
    <div className="dashboard__section">
      <header>
        <h3>Daftar Produk Lelang</h3>
        <p>Pilih kategori PKS lalu ikuti proses bidding sesuai status.</p>
      </header>
      <div className="dashboard__filters" role="tablist">
        {catalogFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            className={`dashboard__filter ${catalogFilter === filter.key ? 'is-active' : ''}`}
            onClick={() => setCatalogFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="dashboard__catalog-grid">
        {filteredCatalog.map((item) => (
          <article key={item.id} className="dashboard__catalog-card">
            <header>
              <span className={`dashboard__status dashboard__status--${item.statusKey.toLowerCase()}`}>{item.status}</span>
              <h4>{item.product}</h4>
              <p>{item.mill}</p>
            </header>
            <dl>
              <div>
                <dt>Penutupan</dt>
                <dd>{item.closingLabel}</dd>
              </div>
              <div>
                <dt>Volume</dt>
                <dd>{item.volume}</dd>
              </div>
              <div>
                <dt>Spesifikasi</dt>
                <dd>{item.ffa}</dd>
              </div>
              <div>
                <dt>Lokasi</dt>
                <dd>{item.location}</dd>
              </div>
              <div>
                <dt>Harga Awal</dt>
                <dd>{formatCurrency(item.basePrice)}/{item.unit}</dd>
              </div>
            </dl>
            <footer>
              <button
                type="button"
                className="dashboard__action"
                onClick={() => ensureSelectedAuction(item)}
                disabled={item.statusKey === 'comingSoon'}
              >
                {item.statusKey === 'comingSoon' ? 'Belum Dibuka' : 'Ikuti Lelang'}
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );

  const renderBidding = () => {
    if (!selectedAuction || !biddingState) {
      return (
        <div className="dashboard__section">
          <header>
            <h3>Belum ada sesi bidding yang dipilih</h3>
            <p>Silakan pilih produk dari katalog untuk memulai proses e-Bidding.</p>
          </header>
        </div>
      );
    }

    const userIsWinner = biddingState.status === 'WON';
    const sessionClosed = biddingState.status === 'CLOSED' || userIsWinner;

    return (
      <div className="dashboard__section dashboard__section--bidding">
        <header className="dashboard__bidding-header">
          <div>
            <span className={`dashboard__status dashboard__status--${selectedAuction.statusKey.toLowerCase()}`}>{selectedAuction.status}</span>
            <h3>{selectedAuction.product}</h3>
            <p>PKS {selectedAuction.mill} • Penutupan {selectedAuction.closingLabel}</p>
          </div>
          <div className="dashboard__countdown" role="timer" aria-live="polite">
            <span>{formatRemainingTime(biddingState.remainingSeconds)}</span>
            <small>Waktu tersisa</small>
          </div>
        </header>

        {biddingMessage && <div className="dashboard__alert dashboard__alert--success">{biddingMessage}</div>}
        {biddingError && <div className="dashboard__alert dashboard__alert--error">{biddingError}</div>}
        {biddingState.status === 'SCHEDULED' && (
          <div className="dashboard__alert dashboard__alert--info">
            Sesi ini belum dibuka. Anda akan menerima notifikasi ketika status berubah menjadi <strong>On Bidding</strong>.
          </div>
        )}

        <div className="dashboard__bidding-layout">
          <section className="dashboard__bidding-details">
            <h4>Informasi Produk</h4>
            <dl>
              <div>
                <dt>Volume</dt>
                <dd>{selectedAuction.volume}</dd>
              </div>
              <div>
                <dt>Harga Awal</dt>
                <dd>{formatCurrency(selectedAuction.basePrice)}/{selectedAuction.unit}</dd>
              </div>
              <div>
                <dt>Increment Minimal</dt>
                <dd>{formatCurrency(selectedAuction.minIncrement)}/{selectedAuction.unit}</dd>
              </div>
              <div>
                <dt>Spesifikasi</dt>
                <dd>{selectedAuction.ffa}</dd>
              </div>
              <div>
                <dt>Lokasi</dt>
                <dd>{selectedAuction.location}</dd>
              </div>
            </dl>
            <div className="dashboard__bid-preview">
              <p>Penawaran tertinggi saat ini</p>
              <strong>{formatCurrency(biddingState.highestBid)}/{selectedAuction.unit}</strong>
              <small>Oleh {biddingState.highestBidder}</small>
            </div>
            <div className="dashboard__reminder">
              <label>
                <input type="checkbox" checked={autoReminder} onChange={(event) => setAutoReminder(event.target.checked)} />
                Kirimkan reminder ketika waktu tersisa 5 menit
              </label>
              {autoReminder && <small>Notifikasi akan dikirim ke email procurement@sumbersawit.co.id.</small>}
            </div>
          </section>

          <section className="dashboard__bidding-action">
            <h4>Ajukan Penawaran</h4>
            <form onSubmit={handlePlaceBid} className="dashboard__bid-form">
              <label>
                <span>Nominal Penawaran</span>
                <input
                  type="number"
                  min={minAcceptableBid ?? selectedAuction.basePrice}
                  step={selectedAuction.minIncrement}
                  value={bidAmount}
                  onChange={(event) => setBidAmount(event.target.value)}
                  disabled={sessionClosed || biddingState.status === 'SCHEDULED'}
                />
              </label>
              <div className="dashboard__bid-quick">
                {[selectedAuction.minIncrement, selectedAuction.minIncrement * 2, selectedAuction.minIncrement * 4].map((increment) => (
                  <button
                    key={increment}
                    type="button"
                    onClick={() => handleQuickAdjust(increment)}
                    disabled={sessionClosed || biddingState.status !== 'ACTIVE'}
                  >
                    +{formatCurrency(increment)}
                  </button>
                ))}
              </div>
              {minAcceptableBid && biddingState.status === 'ACTIVE' && (
                <small>
                  {biddingState.highestBidder === 'Belum ada penawaran' ? 'Minimal penawaran awal' : 'Minimal penawaran selanjutnya'}:{' '}
                  <strong>{formatCurrency(minAcceptableBid)}/{selectedAuction.unit}</strong>
                </small>
              )}
              <button type="submit" className="btn btn--primary" disabled={sessionClosed || biddingState.status !== 'ACTIVE'}>
                Kirim Penawaran
              </button>
            </form>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={finalizeBidding}
              disabled={sessionClosed || biddingState.status !== 'ACTIVE'}
            >
              Selesaikan Sesi (Simulasi)
            </button>
            {userIsWinner && (
              <div className="dashboard__win-card">
                <h5>Selamat! Anda pemenang lelang</h5>
                <p>
                  Silakan lanjutkan ke modul pembayaran untuk konfirmasi transfer jaminan dan pengeluaran invoice.
                </p>
                <ul>
                  <li>Nilai menang: {formatCurrency(biddingState.highestBid)}/{selectedAuction.unit}</li>
                  <li>Batas pembayaran: 1 x 24 jam setelah pemenang diumumkan</li>
                </ul>
              </div>
            )}
          </section>
        </div>

        <section className="dashboard__timeline-wrapper">
          <h4>Alur Bidding</h4>
          <ol className="dashboard__timeline">
            {biddingState.activityLog.map((log, index) => (
              <li key={`${log.label}-${index}`}>
                <div>
                  <span className="dashboard__timeline-time">{log.time}</span>
                  <strong>{log.label}</strong>
                  {log.description && <p>{log.description}</p>}
                </div>
              </li>
            ))}
            {userIsWinner && (
              <li className="dashboard__timeline-next">
                <div>
                  <strong>Langkah berikutnya</strong>
                  <p>Input bukti pembayaran dan buat invoice baru pada modul Pembayaran & Invoicing.</p>
                </div>
              </li>
            )}
          </ol>
        </section>
      </div>
    );
  };

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
            {historyData.map((item) => (
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
        <button type="button" className="btn btn--ghost" onClick={() => { window.location.hash = '/'; }}>
          Kembali ke Landing Page
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'catalog':
        return renderCatalog();
      case 'bidding':
        return renderBidding();
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
            <button type="button" className="dashboard__logout" onClick={() => { window.location.hash = '/'; }}>
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

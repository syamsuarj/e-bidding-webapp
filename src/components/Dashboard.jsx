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

  const cardClass = 'rounded-2xl border border-primary/15 bg-surface p-6 shadow-soft';
  const highlightCardClass = 'rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 to-secondary/20 p-6 shadow-soft';
  const sectionClass = 'space-y-6 rounded-3xl border border-primary/15 bg-surface p-8 shadow-soft';
  const statusStyles = {
    onbidding: 'inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary',
    closingsoon: 'inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700',
    comingsoon: 'inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700',
  };
  const pillStyles = {
    success: 'inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700',
    danger: 'inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700',
  };
  const badgeStyles = {
    complete: 'inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary',
    warning: 'inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700',
  };
  const primaryButtonClass =
    'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-brand transition hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const ghostButtonClass =
    'inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const quickBidButtonClass =
    'inline-flex items-center justify-center rounded-full border border-primary/20 bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400';
  const inputFieldClass =
    'w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400';
  const menuButtonClass = (isActive) =>
    `flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      isActive ? 'bg-primary text-white shadow-brand' : 'text-slate-600 hover:bg-primary/10 hover:text-primary'
    }`;

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
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <article className={cardClass}>
        <h3 className="text-lg font-semibold text-slate-900">Level Akses</h3>
        <p className="mt-2 text-sm text-slate-500">Status akun</p>
        <p className="mt-1 text-base font-semibold text-primary">Vendor Terverifikasi</p>
        <p className="mt-4 text-sm text-slate-600">Akun siap mengikuti seluruh sesi lelang APAS.</p>
      </article>
      <article className={cardClass}>
        <h3 className="text-lg font-semibold text-slate-900">Saldo Virtual Account</h3>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-primary">Rp 125.000.000</p>
        <p className="mt-2 text-sm text-slate-600">Dapat digunakan sebagai jaminan saat mengikuti lelang.</p>
      </article>
      <article className={highlightCardClass}>
        <h3 className="text-lg font-semibold text-slate-900">Lelang Aktif Hari Ini</h3>
        <p className="mt-3 text-3xl font-bold tracking-tight text-primary">{catalogItems.filter((item) => item.statusKey !== 'comingSoon').length}</p>
        <ul className="mt-4 space-y-1 text-sm text-slate-700">
          {catalogItems
            .filter((item) => item.statusKey !== 'comingSoon')
            .map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{item.product}</span>
                <span className="text-xs text-slate-500">{item.id}</span>
              </li>
            ))}
        </ul>
      </article>
      <article className={cardClass}>
        <h3 className="text-lg font-semibold text-slate-900">Notifikasi Penting</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li className="rounded-xl bg-primary/5 px-4 py-3">Upload bukti pembayaran invoice #INV-230925 sebelum 29 Sep 2025.</li>
          <li className="rounded-xl bg-secondary/10 px-4 py-3">Perbaharui data profil PIC sebelum 5 Okt 2025.</li>
          <li className="rounded-xl bg-emerald-50 px-4 py-3">Reminder sesi bidding dimulai 30 menit lagi.</li>
        </ul>
      </article>
      {selectedAuction && biddingState && (
        <article className={`${cardClass} flex flex-col gap-3`}>
          <h3 className="text-lg font-semibold text-slate-900">Sesi Lelang Aktif</h3>
          <p className="text-base font-semibold text-primary">{selectedAuction.product}</p>
          <p className="text-sm text-slate-600">
            Status:{' '}
            <span className="font-semibold">
              {biddingState.status === 'WON' ? 'Menang' : biddingState.status === 'CLOSED' ? 'Selesai' : 'Sedang berlangsung'}
            </span>
          </p>
          <button type="button" className={primaryButtonClass} onClick={() => setActiveSection('bidding')}>
            Buka Halaman Bidding
          </button>
        </article>
      )}
    </div>
  );

  const renderCatalog = () => (
    <div className={sectionClass}>
      <header className="space-y-1">
        <h3 className="text-xl font-semibold text-slate-900">Daftar Produk Lelang</h3>
        <p className="text-sm text-slate-600">Pilih kategori PKS lalu ikuti proses bidding sesuai status.</p>
      </header>
      <div className="flex flex-wrap gap-2" role="tablist">
        {catalogFilters.map((filter) => {
          const isActive = catalogFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              role="tab"
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-primary/10 text-slate-600 hover:border-primary/40 hover:text-primary'
              }`}
              onClick={() => setCatalogFilter(filter.key)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredCatalog.map((item) => (
          <article key={item.id} className={`${cardClass} flex flex-col gap-4`}>
            <header className="space-y-2">
              <span className={statusStyles[item.statusKey.toLowerCase()] ?? statusStyles.onbidding}>{item.status}</span>
              <h4 className="text-lg font-semibold text-slate-900">{item.product}</h4>
              <p className="text-sm text-slate-500">{item.mill}</p>
            </header>
            <dl className="grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="rounded-xl bg-primary/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Penutupan</dt>
                <dd className="mt-1 font-semibold text-slate-800">{item.closingLabel}</dd>
              </div>
              <div className="rounded-xl bg-primary/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Volume</dt>
                <dd className="mt-1 font-semibold text-slate-800">{item.volume}</dd>
              </div>
              <div className="rounded-xl bg-primary/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Spesifikasi</dt>
                <dd className="mt-1 font-semibold text-slate-800">{item.ffa}</dd>
              </div>
              <div className="rounded-xl bg-primary/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Lokasi</dt>
                <dd className="mt-1 font-semibold text-slate-800">{item.location}</dd>
              </div>
              <div className="rounded-xl bg-primary/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-slate-500">Harga Awal</dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {formatCurrency(item.basePrice)}/{item.unit}
                </dd>
              </div>
            </dl>
            <footer className="mt-auto">
              <button
                type="button"
                className={`${primaryButtonClass} w-full ${item.statusKey === 'comingSoon' ? 'cursor-not-allowed bg-primary/30 text-white hover:bg-primary/30' : ''}`}
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
        <div className={sectionClass}>
          <header className="space-y-1">
            <h3 className="text-xl font-semibold text-slate-900">Belum ada sesi bidding yang dipilih</h3>
            <p className="text-sm text-slate-600">Silakan pilih produk dari katalog untuk memulai proses e-Bidding.</p>
          </header>
        </div>
      );
    }

    const userIsWinner = biddingState.status === 'WON';
    const sessionClosed = biddingState.status === 'CLOSED' || userIsWinner;

    return (
      <div className="space-y-6">
        <section className={`${sectionClass} space-y-6`}>
          <header className="flex flex-col gap-4 border-b border-primary/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className={statusStyles[selectedAuction.statusKey.toLowerCase()] ?? statusStyles.onbidding}>{selectedAuction.status}</span>
              <h3 className="text-2xl font-semibold text-slate-900">{selectedAuction.product}</h3>
              <p className="text-sm text-slate-600">PKS {selectedAuction.mill} • Penutupan {selectedAuction.closingLabel}</p>
            </div>
            <div className="inline-flex flex-col items-center justify-center rounded-2xl bg-primary/5 px-6 py-4 text-primary" role="timer" aria-live="polite">
              <span className="text-3xl font-bold tracking-tight">{formatRemainingTime(biddingState.remainingSeconds)}</span>
              <small className="text-xs font-semibold uppercase tracking-wide text-primary/80">Waktu tersisa</small>
            </div>
          </header>

          {biddingMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{biddingMessage}</div>
          )}
          {biddingError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{biddingError}</div>
          )}
          {biddingState.status === 'SCHEDULED' && (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
              Sesi ini belum dibuka. Anda akan menerima notifikasi ketika status berubah menjadi <strong>On Bidding</strong>.
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
            <section className={`${cardClass} space-y-5`}>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Informasi Produk</h4>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="rounded-xl bg-primary/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Volume</dt>
                    <dd className="mt-1 font-semibold text-slate-800">{selectedAuction.volume}</dd>
                  </div>
                  <div className="rounded-xl bg-primary/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Harga Awal</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {formatCurrency(selectedAuction.basePrice)}/{selectedAuction.unit}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-primary/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Increment Minimal</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {formatCurrency(selectedAuction.minIncrement)}/{selectedAuction.unit}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-primary/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Spesifikasi</dt>
                    <dd className="mt-1 font-semibold text-slate-800">{selectedAuction.ffa}</dd>
                  </div>
                  <div className="rounded-xl bg-primary/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Lokasi</dt>
                    <dd className="mt-1 font-semibold text-slate-800">{selectedAuction.location}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4 text-primary">
                <p className="text-xs uppercase tracking-wide text-primary/80">Penawaran tertinggi saat ini</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {formatCurrency(biddingState.highestBid)}/{selectedAuction.unit}
                </p>
                <p className="text-sm text-primary/80">Oleh {biddingState.highestBidder}</p>
              </div>
              <label className="flex flex-col gap-2 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Pengingat otomatis</span>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-primary/40 text-primary focus:ring-primary/40"
                    checked={autoReminder}
                    onChange={(event) => setAutoReminder(event.target.checked)}
                  />
                  <div>
                    <p>Kirimkan reminder ketika waktu tersisa 5 menit.</p>
                    {autoReminder && (
                      <small className="mt-1 block text-xs text-slate-500">Notifikasi akan dikirim ke email procurement@sumbersawit.co.id.</small>
                    )}
                  </div>
                </div>
              </label>
            </section>

            <section className={`${cardClass} space-y-4`}>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-slate-900">Ajukan Penawaran</h4>
                <p className="text-sm text-slate-600">Masukkan harga terbaik Anda, sistem akan memperbarui secara real-time.</p>
              </div>
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <label className="block space-y-2 text-sm font-semibold text-slate-700">
                  <span>Nominal Penawaran</span>
                  <input
                    type="number"
                    min={minAcceptableBid ?? selectedAuction.basePrice}
                    step={selectedAuction.minIncrement}
                    value={bidAmount}
                    onChange={(event) => setBidAmount(event.target.value)}
                    disabled={sessionClosed || biddingState.status === 'SCHEDULED'}
                    className={inputFieldClass}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {[selectedAuction.minIncrement, selectedAuction.minIncrement * 2, selectedAuction.minIncrement * 4].map((increment) => (
                    <button
                      key={increment}
                      type="button"
                      onClick={() => handleQuickAdjust(increment)}
                      disabled={sessionClosed || biddingState.status !== 'ACTIVE'}
                      className={quickBidButtonClass}
                    >
                      +{formatCurrency(increment)}
                    </button>
                  ))}
                </div>
                {minAcceptableBid && biddingState.status === 'ACTIVE' && (
                  <p className="text-sm text-slate-600">
                    {biddingState.highestBidder === 'Belum ada penawaran' ? 'Minimal penawaran awal' : 'Minimal penawaran selanjutnya'}:{' '}
                    <span className="font-semibold text-primary">
                      {formatCurrency(minAcceptableBid)}/{selectedAuction.unit}
                    </span>
                  </p>
                )}
                <button type="submit" className={`${primaryButtonClass} w-full`} disabled={sessionClosed || biddingState.status !== 'ACTIVE'}>
                  Kirim Penawaran
                </button>
              </form>
              <button
                type="button"
                className={`${ghostButtonClass} w-full`}
                onClick={finalizeBidding}
                disabled={sessionClosed || biddingState.status !== 'ACTIVE'}
              >
                Selesaikan Sesi (Simulasi)
              </button>
              {userIsWinner && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                  <h5 className="text-base font-semibold text-emerald-800">Selamat! Anda pemenang lelang</h5>
                  <p className="mt-2">
                    Silakan lanjutkan ke modul pembayaran untuk konfirmasi transfer jaminan dan pengeluaran invoice.
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li>Nilai menang: {formatCurrency(biddingState.highestBid)}/{selectedAuction.unit}</li>
                    <li>Batas pembayaran: 1 x 24 jam setelah pemenang diumumkan</li>
                  </ul>
                </div>
              )}
            </section>
          </div>
        </section>

        <section className={sectionClass}>
          <h4 className="text-lg font-semibold text-slate-900">Alur Bidding</h4>
          <ol className="mt-6 space-y-4">
            {biddingState.activityLog.map((log, index) => (
              <li key={`${log.label}-${index}`} className="relative rounded-2xl border border-primary/10 bg-surface px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{log.time}</p>
                    <p className="mt-1 font-semibold text-slate-900">{log.label}</p>
                    {log.description && <p className="mt-1 text-sm text-slate-600">{log.description}</p>}
                  </div>
                </div>
              </li>
            ))}
            {userIsWinner && (
              <li className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
                <strong className="block text-base font-semibold text-primary">Langkah berikutnya</strong>
                <p className="mt-1 text-primary/80">Input bukti pembayaran dan buat invoice baru pada modul Pembayaran &amp; Invoicing.</p>
              </li>
            )}
          </ol>
        </section>
      </div>
    );
  };

  const renderHistory = () => (
    <div className={sectionClass}>
      <header className="space-y-1">
        <h3 className="text-xl font-semibold text-slate-900">Riwayat Lelang Terakhir</h3>
        <p className="text-sm text-slate-600">Pantau performa bidding perusahaan Anda pada sesi sebelumnya.</p>
      </header>
      <div className="overflow-hidden rounded-2xl border border-primary/15">
        <table className="min-w-full divide-y divide-primary/10 text-sm">
          <thead className="bg-primary/5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Kode Lelang</th>
              <th className="px-4 py-3">Produk</th>
              <th className="px-4 py-3">Bid Terakhir</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10 bg-surface text-slate-700">
            {historyData.map((item) => (
              <tr key={item.id} className="hover:bg-primary/5">
                <td className="px-4 py-3 font-semibold text-slate-900">{item.id}</td>
                <td className="px-4 py-3">{item.product}</td>
                <td className="px-4 py-3 text-slate-900">{item.bid}</td>
                <td className="px-4 py-3">
                  <span className={pillStyles[item.status === 'Menang' ? 'success' : 'danger']}>{item.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className={`${sectionClass} space-y-6`}>
      <header className="space-y-1">
        <h3 className="text-xl font-semibold text-slate-900">Informasi Perusahaan</h3>
        <p className="text-sm text-slate-600">Perbaharui data agar proses due diligence tetap berjalan lancar.</p>
      </header>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className={`${cardClass} space-y-3`}>
          <h4 className="text-lg font-semibold text-slate-900">Data Utama</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-900">Nama Perusahaan:</strong> PT Sumber Sawit Ekspres</li>
            <li><strong className="text-slate-900">NIB:</strong> 9123456780001</li>
            <li><strong className="text-slate-900">Alamat:</strong> Jl. Jenderal Sudirman No. 88, Pekanbaru</li>
            <li><strong className="text-slate-900">Jenis:</strong> Trading House</li>
          </ul>
        </div>
        <div className={`${cardClass} space-y-3`}>
          <h4 className="text-lg font-semibold text-slate-900">Kontak PIC</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-900">Nama:</strong> Ahmad Kurniawan</li>
            <li><strong className="text-slate-900">Email:</strong> procurement@sumbersawit.co.id</li>
            <li><strong className="text-slate-900">Nomor HP:</strong> +62 812-3456-7890</li>
          </ul>
        </div>
        <div className={`${cardClass} space-y-3`}>
          <h4 className="text-lg font-semibold text-slate-900">Status Dokumen</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              Akte Pendirian · <span className={badgeStyles.complete}>Valid</span>
            </li>
            <li>
              Surat PKKP · <span className={badgeStyles.warning}>Perlu Pembaharuan</span>
            </li>
            <li>
              NPWP · <span className={badgeStyles.complete}>Valid</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={primaryButtonClass}>Perbaharui Profil</button>
        <button
          type="button"
          className={ghostButtonClass}
          onClick={() => {
            window.location.hash = '/';
          }}
        >
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
    <div className="min-h-screen bg-background text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col justify-between gap-8 border-r border-primary/10 bg-surface px-6 py-8" aria-label="Menu dashboard">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">Menu Utama</p>
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={menuButtonClass(activeSection === item.key)}
                      onClick={() => setActiveSection(item.key)}
                    >
                      <span>{item.label}</span>
                      <span className="text-lg">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-full border border-rose-200 px-5 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              onClick={() => {
                window.location.hash = '/';
              }}
            >
              Keluar
            </button>
          </div>
        </aside>
        <main className="flex flex-col bg-background">
          <header className="flex flex-wrap items-center justify-between gap-6 border-b border-primary/10 bg-surface px-8 py-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{activeTitle}</h1>
              <p className="mt-1 text-sm text-slate-600">Kelola seluruh aktivitas e-Bidding Anda melalui portal vendor APAS.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-surface px-4 py-3 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">SE</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">PT Sumber Sawit Ekspres</p>
                <p className="text-xs text-slate-500">Vendor ID: VND-230912</p>
              </div>
            </div>
          </header>
          <section className="flex-1 space-y-6 overflow-y-auto px-6 py-8 lg:px-10">{renderContent()}</section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

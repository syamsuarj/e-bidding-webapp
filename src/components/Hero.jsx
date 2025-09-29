import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="top"
      className="relative overflow-hidden py-24 sm:py-28 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(15,159,110,0.16),transparent_60%)] before:content-['']"
    >
      <div className="container relative grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="space-y-6" data-reveal="fade-up">
          <span className="badge">PT Agrinas Palma Nusantara</span>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[3rem]">
            APAS menghubungkan 17 pabrik kelapa sawit APN dengan buyer global melalui{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">lelang digital real-time</span>.
          </h1>
          <p className="text-base text-slate-600 md:text-lg">
            Agrinas Palma Auction System menayangkan lot CPO, PKO, PKM, dan CPKO lengkap dengan data laboratorium, mempermudah buyer memastikan kualitas sebelum mengunci harga premium.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#daftar" className="btn btn--primary">
              Lihat Jadwal Lelang
              <ArrowRight size={18} />
            </a>
            <a href="#daftar" className="btn btn--ghost">
              <Play size={18} />
              Jadwalkan Demo APAS
            </a>
          </div>
          <ul className="space-y-3 text-sm text-slate-600 md:text-base">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Penjualan CPO, PKO, PKM, dan CPKO dengan data QC terbaru</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Buyer tersertifikasi dengan due diligence otomatis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Integrasi logistik, pembayaran, dan invoicing setelah deal</span>
            </li>
          </ul>
        </div>
        <div className="relative grid justify-center" aria-hidden="true" data-reveal="fade-left" data-reveal-delay="140">
          <div className="grid gap-6 rounded-[28px] bg-surface p-8 shadow-card">
            <div className="flex items-center justify-between text-sm font-medium text-slate-600">
              <p>Lot CPO 24/2025 · 500.000 kg</p>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Status: Live Auction</span>
            </div>
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">78%</span>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Bid Momentum</p>
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-primary/15">
                    <span
                      data-reveal-child="progress"
                      style={{ width: '78%' }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Top 3 Bidder</p>
                <ul className="space-y-2 text-sm font-medium text-slate-700">
                  <li className="flex items-center justify-between">
                    <span>PT Refinery Nusantara</span>
                    <span className="text-primary">Rp12.450/kg</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Global Palm Trading</span>
                    <span className="text-primary">Rp12.420/kg</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>PT Minyak Maju</span>
                    <span className="text-primary">Rp12.400/kg</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="absolute -right-6 bottom-4 w-60 rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-buttonPrimary animate-floaty"
            data-reveal="zoom-in"
            data-reveal-delay="260"
          >
            <p className="text-sm uppercase tracking-wide text-white/70">Premium Harga</p>
            <p className="mt-2 text-4xl font-bold">+7,8%</p>
            <span className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">vs Harga Referensi Pabrik</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

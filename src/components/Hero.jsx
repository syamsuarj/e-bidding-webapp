import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero" id="top">
      <div className="container hero__content">
        <div className="hero__copy">
          <span className="badge">PT Agrinas Palma Nusantara</span>
          <h1>
            APAS menghubungkan 17 pabrik kelapa sawit APN dengan buyer global melalui{' '}
            <span className="text-gradient">lelang digital real-time</span>.
          </h1>
          <p>
            Agrinas Palma Auction System menayangkan lot CPO, PKO, PKM, dan CPKO lengkap dengan data laboratorium, mempermudah buyer memastikan kualitas sebelum mengunci harga premium.
          </p>
          <div className="hero__actions">
            <a href="#daftar" className="btn btn--primary">
              Lihat Jadwal Lelang
              <ArrowRight size={18} />
            </a>
            <a href="#daftar" className="btn btn--ghost">
              <Play size={18} />
              Jadwalkan Demo APAS
            </a>
          </div>
          <ul className="hero__benefits">
            <li>Penjualan CPO, PKO, PKM, dan CPKO dengan data QC terbaru</li>
            <li>Buyer tersertifikasi dengan due diligence otomatis</li>
            <li>Integrasi logistik, pembayaran, dan invoicing setelah deal</li>
          </ul>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card hero__card--main">
            <div className="hero__card-header">
              <p>Lot CPO 24/2025 · 500 MT</p>
              <span>Status: Live Auction</span>
            </div>
            <div className="hero__card-body">
              <div className="hero__progress">
                <span>78%</span>
                <div>
                  <p>Bid Momentum</p>
                  <div className="progress-bar">
                    <span style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
              <div className="hero__bidders">
                <p>Top 3 Bidder</p>
                <ul>
                  <li>
                    <span>PT Refinery Nusantara</span>
                    <span className="price">Rp12.450/kg</span>
                  </li>
                  <li>
                    <span>Global Palm Trading</span>
                    <span className="price">Rp12.420/kg</span>
                  </li>
                  <li>
                    <span>PT Minyak Maju</span>
                    <span className="price">Rp12.400/kg</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="hero__card hero__card--floating">
            <p className="hero__metric-label">Premium Harga</p>
            <p className="hero__metric-value">+7,8%</p>
            <span className="hero__metric-chip">vs Harga Referensi Pabrik</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero" id="top">
      <div className="container hero__content">
        <div className="hero__copy">
          <span className="badge">#1 Platform e-Procurement Indonesia</span>
          <h1>
            Transformasikan proses tender Anda dengan platform e-bidding yang{' '}
            <span className="text-gradient">transparan dan efisien</span>.
          </h1>
          <p>
            Kelola seluruh siklus pengadaan secara digital, kurangi risiko kecurangan, dan percepat
            pengambilan keputusan dengan insight real-time.
          </p>
          <div className="hero__actions">
            <a href="#daftar" className="btn btn--primary">
              Daftar Sekarang
              <ArrowRight size={18} />
            </a>
            <a href="#demo" className="btn btn--ghost">
              <Play size={18} />
              Lihat Demo 3 Menit
            </a>
          </div>
          <ul className="hero__benefits">
            <li>Proses tender sesuai regulasi LKPP</li>
            <li>Dashboard monitoring real-time</li>
            <li>Dukungan onboarding &amp; training</li>
          </ul>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card hero__card--main">
            <div className="hero__card-header">
              <p>Tender Pengadaan IT Infrastruktur</p>
              <span>Status: Evaluasi</span>
            </div>
            <div className="hero__card-body">
              <div className="hero__progress">
                <span>90%</span>
                <div>
                  <p>Compliance Score</p>
                  <div className="progress-bar">
                    <span style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
              <div className="hero__bidders">
                <p>Top 3 Penawaran</p>
                <ul>
                  <li>
                    <span>PT Maju Digital</span>
                    <span className="price">Rp2,1M</span>
                  </li>
                  <li>
                    <span>PT Nusantara Teknologi</span>
                    <span className="price">Rp2,3M</span>
                  </li>
                  <li>
                    <span>PT Solusi Mandiri</span>
                    <span className="price">Rp2,4M</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="hero__card hero__card--floating">
            <p className="hero__metric-label">Rata-rata waktu tender</p>
            <p className="hero__metric-value">23 hari</p>
            <span className="hero__metric-chip">-32% vs manual</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

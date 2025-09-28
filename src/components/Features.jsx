import { ShieldCheck, BarChart3, Workflow, BellRing, FileSearch2, Users } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Kualitas Terdokumentasi',
    description: 'Integrasikan hasil inspeksi FFA, moisture, dan sertifikasi lab langsung pada tiap lot CPO.',
  },
  {
    icon: Workflow,
    title: 'Penjadwalan Lot Fleksibel',
    description: 'Atur jadwal lelang mingguan atau harian dengan kontrol volume, floor price, dan auto-extension.',
  },
  {
    icon: BellRing,
    title: 'Alert Bid Detik-Real',
    description: 'Notifikasi multi-channel untuk seller & buyer agar aksi terhadap lonjakan harga terjadi tepat waktu.',
  },
  {
    icon: BarChart3,
    title: 'Analitik Harga Premium',
    description: 'Pantau tren premium, basis buyer, dan performa lot sebelumnya untuk strategi penjualan berikutnya.',
  },
  {
    icon: FileSearch2,
    title: 'Kontrak & Dokumen Digital',
    description: 'Generate deal confirmation, invoice, dan shipping instruction yang siap e-signature.',
  },
  {
    icon: Users,
    title: 'Jaringan Buyer Global',
    description: 'Jangkau refiners dan trader internasional yang telah melewati proses KYC dan compliance APAS.',
  },
];

const Features = () => {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section__header" data-reveal="fade-up">
          <span className="badge badge--light">Kenapa APAS</span>
          <h2>Fitur yang memaksimalkan nilai jual Crude Palm Oil Anda</h2>
          <p>
            Dari publikasi lot, dinamika bidding, hingga settlement, semua dijahit untuk produsen sawit yang ingin harga terbaik tanpa proses rumit.
          </p>
        </div>
        <div className="features__grid">
          {features.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              className="feature-card"
              data-reveal="fade-up"
              data-reveal-delay={String(index * 60)}
            >
              <span className="feature-card__icon">
                <Icon size={28} strokeWidth={1.5} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

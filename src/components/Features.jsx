import { ShieldCheck, BarChart3, Workflow, BellRing, FileSearch2, Users } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Kepatuhan Otomatis',
    description: 'Template dokumen dan approval workflow yang mengikuti standar LKPP & ISO 37001.',
  },
  {
    icon: Workflow,
    title: 'Workflow Dinamis',
    description: 'Sesuaikan alur tender dengan kebutuhan organisasi tanpa menulis kode tambahan.',
  },
  {
    icon: BellRing,
    title: 'Notifikasi Cerdas',
    description: 'Reminder otomatis untuk vendor & panitia agar tahapan tender tidak lagi terlewat.',
  },
  {
    icon: BarChart3,
    title: 'Analitik Real-time',
    description: 'Dashboard visual untuk memantau performa tender, penghematan, dan produktivitas tim.',
  },
  {
    icon: FileSearch2,
    title: 'Audit Trail Lengkap',
    description: 'Jejak aktivitas rinci untuk setiap keputusan dengan log yang terenkripsi.',
  },
  {
    icon: Users,
    title: 'Ekosistem Vendor',
    description: 'Akses ke ribuan vendor terverifikasi dan bandingkan penawaran secara instan.',
  },
];

const Features = () => {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section__header">
          <span className="badge badge--light">Kemampuan Utama</span>
          <h2>Pengadaan strategis dalam satu platform terintegrasi</h2>
          <p>
            Rancang tender, evaluasi penawaran, dan kelola vendor dengan pengalaman pengguna modern dan dilengkapi insight data.
          </p>
        </div>
        <div className="features__grid">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="feature-card">
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

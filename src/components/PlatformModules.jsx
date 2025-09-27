import { LayoutDashboard, Boxes, Gavel, Truck, CreditCard, FileText } from 'lucide-react';

const modules = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Pengguna',
    description:
      'Pantau saldo, level akses, dan semua aktivitas lelang dalam satu layar. Insight performa real-time untuk setiap PKS.',
  },
  {
    icon: Boxes,
    title: 'Katalog Produk',
    description:
      'Filter lot berdasarkan status (closing soon, on bidding, coming soon), spesifikasi CPO/PKO/PKM, dan lokasi pabrik.',
  },
  {
    icon: Gavel,
    title: 'Ruang Bidding Interaktif',
    description:
      'Live countdown, auto-extension, dan reminder multi-channel memastikan buyer aktif hingga deal tercapai.',
  },
  {
    icon: Truck,
    title: 'Logistik Terintegrasi',
    description:
      'Monitor status pengiriman (dikemas, dikirim, diterima) dengan integrasi surveyor dan pelabuhan APN.',
  },
  {
    icon: CreditCard,
    title: 'Pembayaran & Escrow',
    description:
      'Virtual account multi-bank, batas waktu pembayaran yang bisa dikonfigurasi, serta konfirmasi otomatis.',
  },
  {
    icon: FileText,
    title: 'Invoicing Digital',
    description:
      'Generate invoice, detail faktur, dan catatan biaya tambahan secara instan begitu lelang selesai.',
  },
];

const PlatformModules = () => {
  return (
    <section className="section section--alt" id="platform">
      <div className="container">
        <div className="section__header">
          <span className="badge">Ekosistem APAS</span>
          <h2>Seluruh proses bisnis PT APN diorkestrasi dalam satu platform</h2>
          <p>
            Diagram bisnis memperlihatkan perjalanan buyer dari katalog hingga pembayaran. Modul APAS dibangun mengikuti kebutuhan nyata 17 pabrik APN.
          </p>
        </div>
        <div className="platform-grid">
          {modules.map(({ icon: Icon, title, description }) => (
            <article key={title} className="platform-card">
              <span className="platform-card__icon">
                <Icon size={26} strokeWidth={1.6} />
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

export default PlatformModules;

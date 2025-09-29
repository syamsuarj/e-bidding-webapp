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
    <section className="bg-gradient-to-b from-primary/8 via-background to-background py-24 sm:py-28" id="platform">
      <div className="container space-y-12">
        <div className="max-w-2xl space-y-4" data-reveal="fade-up">
          <span className="badge">Ekosistem APAS</span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Seluruh proses bisnis PT APN diorkestrasi dalam satu platform
          </h2>
          <p className="text-base text-slate-600">
            Diagram bisnis memperlihatkan perjalanan buyer dari katalog hingga pembayaran. Modul APAS dibangun mengikuti kebutuhan nyata 17 pabrik APN.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              className="grid gap-4 rounded-2xl border border-primary/10 bg-surface p-7 shadow-soft"
              data-reveal="fade-up"
              data-reveal-delay={String(index * 70)}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={26} strokeWidth={1.6} />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformModules;

const steps = [
  {
    number: '01',
    title: 'Onboarding & Hak Akses',
    description:
      'Registrasi buyer/seller, verifikasi dokumen, penetapan level akses, dan aktivasi virtual account untuk deposit jaminan.',
  },
  {
    number: '02',
    title: 'Kurasi Lot & QC',
    description:
      'Tim PKS mengunggah detail lot (CPO, PKO, PKM, CPKO), sertifikat lab, dan menentukan jadwal lelang serta floor price.',
  },
  {
    number: '03',
    title: 'Katalog & Notifikasi',
    description:
      'Buyer memilih lot favorit, menambahkan ke watchlist, dan menerima notifikasi closing soon atau perubahan jadwal.',
  },
  {
    number: '04',
    title: 'Live Bidding',
    description:
      'Mode forward auction dengan auto-extension, leaderboard transparan, serta reminder bagi pemenang pertama agar tidak mundur.',
  },
  {
    number: '05',
    title: 'Pembayaran & Logistik',
    description:
      'Konfirmasi pembayaran, generate invoice, dan koordinasi shipping hingga status berganti menjadi delivered.',
  },
];

const Process = () => {
  return (
    <section className="bg-gradient-to-b from-primary/8 via-background to-background py-24 sm:py-28" id="process">
      <div className="container space-y-12">
        <div className="max-w-2xl space-y-4" data-reveal="fade-up">
          <span className="badge">Alur APAS</span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Lima langkah terintegrasi dari onboarding hingga pengiriman
          </h2>
          <p className="text-base text-slate-600">
            Proses dirancang agar tim komoditas Anda fokus pada strategi, sementara APAS mengotomatiskan hal teknis dan compliance.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="relative grid gap-4 overflow-hidden rounded-2xl border border-primary/15 bg-surface p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
              data-reveal="fade-up"
              data-reveal-delay={String(index * 80)}
            >
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">{step.number}</span>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

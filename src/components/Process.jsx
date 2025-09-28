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
    <section className="section section--alt" id="process">
      <div className="container">
        <div className="section__header" data-reveal="fade-up">
          <span className="badge">Alur APAS</span>
          <h2>Lima langkah terintegrasi dari onboarding hingga pengiriman</h2>
          <p>
            Proses dirancang agar tim komoditas Anda fokus pada strategi, sementara APAS mengotomatiskan hal teknis dan compliance.
          </p>
        </div>
        <div className="process__grid">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="process-card"
              data-reveal="fade-up"
              data-reveal-delay={String(index * 80)}
            >
              <span className="process-card__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

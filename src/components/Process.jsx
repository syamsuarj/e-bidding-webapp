const steps = [
  {
    number: '01',
    title: 'Kurasi Lot & QC',
    description:
      'Unggah spesifikasi, hasil lab, dan foto tangki. Pilih floor price serta jadwal lelang yang ingin dibuka.',
  },
  {
    number: '02',
    title: 'Broadcast ke Buyer',
    description:
      'APAS mengundang buyer tersertifikasi, membuka sesi tanya jawab, dan mengumpulkan deposit partisipasi.',
  },
  {
    number: '03',
    title: 'Live Auction Interaktif',
    description:
      'Pantau bid ladder, auto-extension, dan premi kualitas secara real-time lewat dashboard dinamis.',
  },
  {
    number: '04',
    title: 'Settlement & Pengiriman',
    description:
      'Konfirmasi pemenang, selesai-kan pembayaran via escrow, dan aktifkan modul logistik & tracking kapal.',
  },
];

const Process = () => {
  return (
    <section className="section section--alt" id="process">
      <div className="container">
        <div className="section__header">
          <span className="badge">Alur APAS</span>
          <h2>Empat tahap ringkas untuk menutup penjualan CPO terbaik</h2>
          <p>
            Proses dirancang agar tim komoditas Anda fokus pada strategi, sementara APAS mengotomatiskan hal teknis dan compliance.
          </p>
        </div>
        <div className="process__grid">
          {steps.map((step) => (
            <article key={step.number} className="process-card">
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

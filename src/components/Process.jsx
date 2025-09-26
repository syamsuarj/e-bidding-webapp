const steps = [
  {
    number: '01',
    title: 'Perencanaan & Persetujuan',
    description:
      'Susun RKS, jadwalkan tahapan, dan dapatkan persetujuan internal dengan workflow digital yang dapat dilacak.',
  },
  {
    number: '02',
    title: 'Publikasi & Partisipasi',
    description:
      'Publikasikan tender, broadcast ke vendor terverifikasi, dan kelola sesi tanya jawab secara terpusat.',
  },
  {
    number: '03',
    title: 'Evaluasi Transparan',
    description:
      'Gunakan penilaian multi-kriteria, scoring otomatis, dan audit trail untuk setiap keputusan panitia.',
  },
  {
    number: '04',
    title: 'Penetapan & Kontrak',
    description:
      'Finalisasi pemenang dengan template BAHP digital, integrasi e-sign, dan monitoring SLA kontrak.',
  },
];

const Process = () => {
  return (
    <section className="section section--alt" id="process">
      <div className="container">
        <div className="section__header">
          <span className="badge">Alur Terpadu</span>
          <h2>Tender digital dari awal hingga akhir, tanpa celah manual</h2>
          <p>
            Setiap tahapan saling terhubung untuk memastikan kepatuhan dan visibilitas penuh bagi seluruh pemangku kepentingan.
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

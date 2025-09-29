const products = [
  {
    code: 'CPO',
    name: 'Crude Palm Oil',
    highlights: ['FFA < 3%', 'Moisture < 0.25%', 'Color 3-4 R', 'Shipment ex 17 PKS APN'],
    description:
      'Minyak sawit mentah yang dikurasi dari seluruh pabrik APN dengan sertifikasi ISPO dan pengujian laboratorium independen.',
  },
  {
    code: 'PKO',
    name: 'Palm Kernel Oil',
    highlights: ['FFA < 5%', 'Moisture < 0.5%', 'Iodine Value 15-18'],
    description:
      'Minyak inti sawit dengan kualitas konsisten, cocok sebagai bahan baku oleokimia dan industri makanan.',
  },
  {
    code: 'PKM',
    name: 'Palm Kernel Meal',
    highlights: ['Protein 16-18%', 'Fat 8-10%', 'Fiber 12-15%'],
    description:
      'Produk samping bernutrisi tinggi untuk pakan ternak, tersedia dalam bentuk pellet maupun mash.',
  },
  {
    code: 'CPKO',
    name: 'Crude Palm Kernel Oil',
    highlights: ['FFA < 5%', 'DOBI > 2.0', 'Moisture < 0.2%'],
    description:
      'Minyak inti sawit mentah dengan proses pressing modern, siap dikirim ke refinery domestik maupun ekspor.',
  },
];

const ProductShowcase = () => {
  return (
    <section className="py-24 sm:py-28" id="products">
      <div className="container space-y-12">
        <div className="max-w-2xl space-y-4" data-reveal="fade-up">
          <span className="badge badge--light">Portofolio Produk</span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Empat komoditas utama APN siap dilelang ke buyer global
          </h2>
          <p className="text-base text-slate-600">
            Setiap lot sudah terverifikasi kualitasnya, lengkap dengan data laboratorium dan fasilitas logistik dari 17 pabrik kelapa sawit PT Agrinas Palma Nusantara.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={product.code}
              className="grid gap-5 rounded-2xl border border-primary/15 bg-surface p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
              data-reveal="fade-up"
              data-reveal-delay={String(80 * index)}
            >
              <div className="flex items-baseline gap-3">
                <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
                  {product.code}
                </span>
                <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
              </div>
              <p className="text-sm text-slate-600">{product.description}</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {product.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div>
                <span className="inline-block rounded-full bg-secondary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900">
                  Lot mingguan &amp; kontrak spot
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

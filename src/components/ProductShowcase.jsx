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
    <section className="section" id="products">
      <div className="container">
        <div className="section__header" data-reveal="fade-up">
          <span className="badge badge--light">Portofolio Produk</span>
          <h2>Empat komoditas utama APN siap dilelang ke buyer global</h2>
          <p>
            Setiap lot sudah terverifikasi kualitasnya, lengkap dengan data laboratorium dan fasilitas logistik dari 17 pabrik kelapa sawit PT Agrinas Palma Nusantara.
          </p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article
              key={product.code}
              className="product-card"
              data-reveal="fade-up"
              data-reveal-delay={String(80 * index)}
            >
              <div className="product-card__header">
                <span className="product-card__code">{product.code}</span>
                <h3>{product.name}</h3>
              </div>
              <p className="product-card__description">{product.description}</p>
              <ul className="product-card__highlights">
                {product.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="product-card__footer">
                <span className="product-card__tag">Lot mingguan &amp; kontrak spot</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

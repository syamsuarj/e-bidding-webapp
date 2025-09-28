const stats = [
  { value: '17 PKS', label: 'Jaringan pabrik PT APN seluruh Indonesia' },
  { value: '4 Produk', label: 'CPO, PKO, PKM, dan CPKO siap bidding' },
  { value: '500+', label: 'Buyer refiners & trader tersertifikasi' },
  { value: '12%+', label: 'Premium rata-rata dibanding harga spot' },
];

const Stats = () => {
  return (
    <section className="stats" aria-label="Statistik utama platform">
      <div className="container stats__grid">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="stats__item"
            data-reveal="fade-up"
            data-reveal-delay={String(index * 90)}
          >
            <p className="stats__value">{stat.value}</p>
            <p className="stats__label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;

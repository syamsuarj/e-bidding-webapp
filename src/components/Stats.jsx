const stats = [
  { value: '150K ton', label: 'Volume CPO dilelang per tahun' },
  { value: '12%+', label: 'Premium rata-rata dibanding harga spot' },
  { value: '500+', label: 'Buyer & refinery tersertifikasi' },
  { value: '<30 menit', label: 'Waktu rata-rata penutupan lot' },
];

const Stats = () => {
  return (
    <section className="stats" aria-label="Statistik utama platform">
      <div className="container stats__grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stats__item">
            <p className="stats__value">{stat.value}</p>
            <p className="stats__label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;

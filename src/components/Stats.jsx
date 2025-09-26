const stats = [
  { value: '1.200+', label: 'Tender selesai setiap bulan' },
  { value: '98%', label: 'Kepatuhan terhadap regulasi' },
  { value: '7x', label: 'Lebih cepat dari proses manual' },
  { value: '4.9/5', label: 'Rating kepuasan pengguna' },
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

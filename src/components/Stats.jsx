const stats = [
  { value: '17 PKS', label: 'Jaringan pabrik PT APN seluruh Indonesia' },
  { value: '4 Produk', label: 'CPO, PKO, PKM, dan CPKO siap bidding' },
  { value: '500+', label: 'Buyer refiners & trader tersertifikasi' },
  { value: '12%+', label: 'Premium rata-rata dibanding harga spot' },
];

const Stats = () => {
  return (
    <section className="py-16 sm:py-20" aria-label="Statistik utama platform">
      <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-surface p-8 text-center shadow-soft"
            data-reveal="fade-up"
            data-reveal-delay={String(index * 90)}
          >
            <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;

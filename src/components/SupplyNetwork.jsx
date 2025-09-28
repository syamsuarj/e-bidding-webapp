const mills = [
  { name: 'PKS Sei Merah', province: 'Sumatera Utara', capacity: '600.000 kg/hari', status: 'CPO & PKO' },
  { name: 'PKS Tanjung Morawa', province: 'Sumatera Utara', capacity: '750.000 kg/hari', status: 'CPO & CPKO' },
  { name: 'PKS Air Molek', province: 'Riau', capacity: '900.000 kg/hari', status: 'CPO, PKO' },
  { name: 'PKS Rengat Barat', province: 'Riau', capacity: '600.000 kg/hari', status: 'CPO, PKM' },
  { name: 'PKS Talang Duku', province: 'Jambi', capacity: '700.000 kg/hari', status: 'CPO' },
  { name: 'PKS Muara Bulian', province: 'Jambi', capacity: '650.000 kg/hari', status: 'CPO, CPKO' },
  { name: 'PKS Sungai Lilin', province: 'Sumatera Selatan', capacity: '850.000 kg/hari', status: 'CPO, PKO' },
  { name: 'PKS Banyuasin', province: 'Sumatera Selatan', capacity: '700.000 kg/hari', status: 'CPO, PKM' },
  { name: 'PKS Lampung Tengah', province: 'Lampung', capacity: '500.000 kg/hari', status: 'CPO, PKM' },
  { name: 'PKS Tulang Bawang', province: 'Lampung', capacity: '720.000 kg/hari', status: 'CPO, PKO' },
  { name: 'PKS Ketapang', province: 'Kalimantan Barat', capacity: '900.000 kg/hari', status: 'CPO & CPKO' },
  { name: 'PKS Sandai', province: 'Kalimantan Barat', capacity: '600.000 kg/hari', status: 'CPO, PKM' },
  { name: 'PKS Paser', province: 'Kalimantan Timur', capacity: '700.000 kg/hari', status: 'CPO' },
  { name: 'PKS Penajam', province: 'Kalimantan Timur', capacity: '650.000 kg/hari', status: 'CPO, PKO' },
  { name: 'PKS Mamuju', province: 'Sulawesi Barat', capacity: '500.000 kg/hari', status: 'CPO, PKO' },
  { name: 'PKS Konawe', province: 'Sulawesi Tenggara', capacity: '540.000 kg/hari', status: 'CPO, PKM' },
  { name: 'PKS Seram Timur', province: 'Maluku', capacity: '450.000 kg/hari', status: 'CPO, PKO' },
];

const SupplyNetwork = () => {
  return (
    <section className="py-24 sm:py-28" id="network">
      <div className="container space-y-10">
        <div className="max-w-3xl space-y-4" data-reveal="fade-up">
          <span className="badge badge--light">Supply Network</span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            17 pabrik kelapa sawit PT Agrinas Palma Nusantara siap memasok pasar
          </h2>
          <p className="text-base text-slate-600">
            Jaringan pabrik tersebar di Sumatera, Kalimantan, dan kawasan timur Indonesia. Buyer dapat memilih sumber pasokan terdekat dengan kebutuhan logistiknya.
          </p>
        </div>
        <div
          className="overflow-hidden rounded-2xl border border-primary/10 bg-surface shadow-soft"
          data-reveal="fade-up"
          data-reveal-delay="120"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] divide-y divide-primary/10">
              <thead className="bg-secondary/30 text-left text-xs font-semibold uppercase tracking-wide text-emerald-900">
                <tr>
                  <th className="px-6 py-4">Pabrik</th>
                  <th className="px-6 py-4">Provinsi</th>
                  <th className="px-6 py-4">Kapasitas Olah</th>
                  <th className="px-6 py-4">Produk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10 text-sm text-slate-700">
                {mills.map((mill) => (
                  <tr key={mill.name} className="transition hover:bg-primary/5">
                    <td className="px-6 py-4 font-semibold text-slate-900">{mill.name}</td>
                    <td className="px-6 py-4">{mill.province}</td>
                    <td className="px-6 py-4">{mill.capacity}</td>
                    <td className="px-6 py-4 text-primary">{mill.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplyNetwork;

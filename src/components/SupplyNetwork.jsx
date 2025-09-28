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
    <section className="section" id="network">
      <div className="container">
        <div className="section__header" data-reveal="fade-up">
          <span className="badge badge--light">Supply Network</span>
          <h2>17 pabrik kelapa sawit PT Agrinas Palma Nusantara siap memasok pasar</h2>
          <p>
            Jaringan pabrik tersebar di Sumatera, Kalimantan, dan kawasan timur Indonesia. Buyer dapat memilih sumber pasokan terdekat dengan kebutuhan logistiknya.
          </p>
        </div>
        <div className="network-table-wrapper" data-reveal="fade-up" data-reveal-delay="120">
          <table className="network-table">
            <thead>
              <tr>
                <th>Pabrik</th>
                <th>Provinsi</th>
                <th>Kapasitas Olah</th>
                <th>Produk</th>
              </tr>
            </thead>
            <tbody>
              {mills.map((mill) => (
                <tr key={mill.name}>
                  <td>{mill.name}</td>
                  <td>{mill.province}</td>
                  <td>{mill.capacity}</td>
                  <td>{mill.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default SupplyNetwork;

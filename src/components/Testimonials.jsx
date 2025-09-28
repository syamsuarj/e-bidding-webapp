import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Lewat APAS, lot kami selalu terserap dengan premium yang konsisten. Buyer melihat kualitas secara transparan sehingga bidding berlangsung agresif.',
    name: 'Dewi Lestari',
    title: 'Head of Marketing, Agrinas Palma Group',
  },
  {
    quote:
      'Auction room APAS membantu tim purchasing memonitor setiap increment harga. Settlement dan dokumen ekspor selesai dalam hitungan jam.',
    name: 'James Hartono',
    title: 'Director of Procurement, Nusantara Refinery',
  },
  {
    quote:
      'Kami bisa menjadwalkan lelang mingguan tanpa repot koordinasi manual. Modul logistik menutup gap hingga barang tiba di pelabuhan buyer.',
    name: 'Intan Permata',
    title: 'Head of Commodities, PT Sinar Sawit Sejahtera',
  },
];

const Testimonials = () => {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section__header" data-reveal="fade-up">
          <span className="badge badge--light">Cerita Sukses</span>
          <h2>Dipercaya produsen CPO dan refinery terkemuka</h2>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((item, index) => (
            <figure
              key={item.name}
              className="testimonial-card"
              data-reveal="fade-up"
              data-reveal-delay={String(index * 120)}
            >
              <Quote className="testimonial-card__icon" size={32} strokeWidth={1.5} />
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <p>{item.name}</p>
                <span>{item.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

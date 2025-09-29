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
    <section className="py-24 sm:py-28" id="testimonials">
      <div className="container space-y-12">
        <div className="max-w-2xl space-y-4" data-reveal="fade-up">
          <span className="badge badge--light">Cerita Sukses</span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">Dipercaya produsen CPO dan refinery terkemuka</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item, index) => (
            <figure
              key={item.name}
              className="grid gap-4 rounded-2xl border border-primary/10 bg-surface p-7 shadow-soft"
              data-reveal="fade-up"
              data-reveal-delay={String(index * 120)}
            >
              <Quote className="text-primary/60" size={32} strokeWidth={1.5} />
              <blockquote className="text-sm leading-relaxed text-slate-700">{item.quote}</blockquote>
              <figcaption className="space-y-1">
                <p className="text-base font-semibold text-slate-900">{item.name}</p>
                <span className="text-sm text-slate-600">{item.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

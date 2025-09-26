import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Dengan e-Bidding, kami memangkas durasi tender dari 60 hari menjadi 25 hari tanpa kompromi terhadap regulasi. Transparansi meningkat drastis.',
    name: 'Rani Prasetyo',
    title: 'Direktur Pengadaan, BUMN Energi',
  },
  {
    quote:
      'Tim vendor kami menyukai proses onboarding yang cepat dan jelas. Semua dokumen terarsip otomatis dan mudah dicari saat audit.',
    name: 'Bambang Wirawan',
    title: 'Head of Procurement, Kota Surakarta',
  },
  {
    quote:
      'Insight dari dashboard membantu kami membuat keputusan data-driven dalam negosiasi dan menghemat lebih dari 18% anggaran.',
    name: 'Siti Ramadhani',
    title: 'Chief Finance Officer, PT Karya Sejahtera',
  },
];

const Testimonials = () => {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section__header">
          <span className="badge badge--light">Cerita Sukses</span>
          <h2>Dipercaya ratusan institusi publik dan swasta</h2>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((item) => (
            <figure key={item.name} className="testimonial-card">
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

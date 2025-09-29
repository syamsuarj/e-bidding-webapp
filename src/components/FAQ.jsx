const faqs = [
  {
    question: 'Bagaimana buyer dapat mengikuti lelang?',
    answer:
      'Buyer melakukan registrasi, verifikasi dokumen, dan deposit jaminan. Setelah akun aktif, buyer dapat mengakses katalog lot dan mengikuti bidding sesuai jadwal.',
  },
  {
    question: 'Apakah data kualitas produk tersedia?',
    answer:
      'Setiap lot dilengkapi hasil uji laboratorium terbaru (FFA, moisture, DOBI), foto tangki, serta sertifikasi ISPO. Data dapat diunduh langsung sebelum bidding dimulai.',
  },
  {
    question: 'Metode pembayaran apa yang disediakan?',
    answer:
      'APAS menyediakan virtual account multi-bank, opsi escrow, dan dukungan LC domestik. Sistem otomatis menghitung batas waktu pembayaran serta biaya tambahan.',
  },
  {
    question: 'Bagaimana proses logistik setelah lelang selesai?',
    answer:
      'Tim logistik APN mengoordinasikan penjemputan dari pabrik, inspeksi pihak ketiga, hingga pengiriman ke pelabuhan tujuan. Status pengiriman dipantau langsung di dashboard.',
  },
];

const FAQ = () => {
  return (
    <section className="bg-gradient-to-b from-primary/8 via-background to-background py-24 sm:py-28" id="faq">
      <div className="container space-y-12">
        <div className="max-w-2xl space-y-4" data-reveal="fade-up">
          <span className="badge">Pertanyaan Umum</span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">FAQ seputar Agrinas Palma Auction System</h2>
          <p className="text-base text-slate-600">
            Jawaban cepat untuk membantu tim procurement dan komoditas Anda memahami cara kerja APAS sebelum mengikuti demo.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <article
              key={faq.question}
              className="grid gap-3 rounded-2xl border border-primary/10 bg-surface p-7 shadow-soft"
              data-reveal="fade-up"
              data-reveal-delay={String(index * 80)}
            >
              <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
              <p className="text-sm text-slate-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

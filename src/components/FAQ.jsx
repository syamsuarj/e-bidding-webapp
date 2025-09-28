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
    <section className="section section--alt" id="faq">
      <div className="container faq">
        <div className="section__header" data-reveal="fade-up">
          <span className="badge">Pertanyaan Umum</span>
          <h2>FAQ seputar Agrinas Palma Auction System</h2>
          <p>
            Jawaban cepat untuk membantu tim procurement dan komoditas Anda memahami cara kerja APAS sebelum mengikuti demo.
          </p>
        </div>
        <div className="faq__list">
          {faqs.map((faq, index) => (
            <article
              key={faq.question}
              className="faq__item"
              data-reveal="fade-up"
              data-reveal-delay={String(index * 80)}
            >
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

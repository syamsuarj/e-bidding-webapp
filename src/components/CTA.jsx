const CTA = () => {
  return (
    <section className="cta" id="daftar">
      <div className="container cta__inner">
        <div>
          <h2>Siap melelang lot CPO Anda berikutnya?</h2>
          <p>
            Jadwalkan sesi onboarding 30 menit dengan tim APAS dan lihat bagaimana penjualan CPO Anda mendapatkan premium yang konsisten.
          </p>
        </div>
        <form className="cta__form">
          <label htmlFor="email" className="sr-only">
            Email kerja
          </label>
          <input id="email" type="email" name="email" placeholder="Email perusahaan" required />
          <button type="submit" className="btn btn--secondary">
            Hubungi Tim APAS
          </button>
        </form>
        <p className="cta__note">Tim support tersedia 24/7. Kami membantu dari publikasi lot hingga pengiriman.</p>
      </div>
    </section>
  );
};

export default CTA;

const CTA = () => {
  return (
    <section className="cta" id="daftar">
      <div className="container cta__inner">
        <div>
          <h2>Siap memulai transformasi e-procurement Anda?</h2>
          <p>
            Tim kami siap mendampingi implementasi end-to-end. Daftarkan organisasi Anda dan nikmati demo gratis selama 14 hari.
          </p>
        </div>
        <form className="cta__form">
          <label htmlFor="email" className="sr-only">
            Email kerja
          </label>
          <input id="email" type="email" name="email" placeholder="Email profesional" required />
          <button type="submit" className="btn btn--secondary">
            Jadwalkan Demo
          </button>
        </form>
        <p className="cta__note">Tidak perlu kartu kredit. Support onboarding 24/7.</p>
      </div>
    </section>
  );
};

export default CTA;

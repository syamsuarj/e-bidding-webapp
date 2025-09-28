const CTA = () => {
  return (
    <section className="py-24 sm:py-28" id="hubungi">
      <div
        className="container"
        data-reveal="fade-up"
      >
        <div className="grid gap-6 rounded-[28px] bg-gradient-to-br from-primary to-secondary p-10 text-white shadow-soft">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">Siap melelang lot dari 17 PKS PT APN?</h2>
            <p className="text-base text-white/90">
              Jadwalkan sesi onboarding 30 menit dengan tim Agrinas Palma Nusantara dan pelajari bagaimana APAS membantu mengoptimalkan harga jual CPO, PKO, PKM, maupun CPKO.
            </p>
          </div>
          <form className="flex flex-wrap gap-3">
            <label htmlFor="email" className="sr-only">
              Email kerja
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email perusahaan"
              required
              className="flex-1 min-w-[220px] rounded-md border border-white/40 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button type="submit" className="btn btn--secondary">
              Hubungi Tim APAS
            </button>
          </form>
          <p className="text-sm text-white/80">Tim support tersedia 24/7. Kami membantu dari publikasi lot hingga pengiriman.</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;

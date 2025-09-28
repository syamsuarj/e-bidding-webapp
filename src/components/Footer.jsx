import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface" id="footer">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">APAS</h3>
          <p className="text-sm text-slate-600">
            Agrinas Palma Auction System memfasilitasi 17 pabrik sawit PT APN untuk menjual CPO, PKO, PKM, dan CPKO secara cepat, transparan, dan aman kepada buyer global.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900">Hubungi Kami</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-3">
              <Mail size={18} /> support@apas.id
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} /> +62 21 8800 1122
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} /> Palma Tower Lt. 20, Jakarta Selatan
            </li>
          </ul>
        </div>
        <div className="space-y-4" id="login">
          <h4 className="text-lg font-semibold text-slate-900">Masuk ke Platform</h4>
          <p className="text-sm text-slate-600">Akses dashboard seller &amp; buyer APAS.</p>
          <a href="https://app.apas.id/login" className="btn btn--ghost" target="_blank" rel="noreferrer">
            Portal Login
          </a>
        </div>
      </div>
      <div className="border-t border-border/60 bg-background/70">
        <div className="container flex flex-col gap-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} APAS. Seluruh hak cipta.</p>
          <div className="flex gap-5">
            <a href="/kebijakan-privasi" className="transition hover:text-primary">Kebijakan Privasi</a>
            <a href="/syarat-ketentuan" className="transition hover:text-primary">Syarat &amp; Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

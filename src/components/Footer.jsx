import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__grid">
        <div>
          <h3>APAS</h3>
          <p>
            Agrinas Palma Auction System memfasilitasi produsen sawit dan buyer global menutup transaksi Crude Palm Oil secara cepat, transparan, dan aman.
          </p>
        </div>
        <div>
          <h4>Hubungi Kami</h4>
          <ul className="footer__list">
            <li>
              <Mail size={18} /> support@apas.id
            </li>
            <li>
              <Phone size={18} /> +62 21 8800 1122
            </li>
            <li>
              <MapPin size={18} /> Palma Tower Lt. 20, Jakarta Selatan
            </li>
          </ul>
        </div>
        <div id="login">
          <h4>Masuk ke Platform</h4>
          <p>Akses dashboard seller &amp; buyer APAS.</p>
          <a href="https://app.apas.id/login" className="btn btn--ghost" target="_blank" rel="noreferrer">
            Portal Login
          </a>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} APAS. Seluruh hak cipta.</p>
        <div className="footer__links">
          <a href="/kebijakan-privasi">Kebijakan Privasi</a>
          <a href="/syarat-ketentuan">Syarat &amp; Ketentuan</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

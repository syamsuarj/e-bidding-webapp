import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__grid">
        <div>
          <h3>e-Bidding</h3>
          <p>
            Solusi pengadaan digital yang membantu organisasi mencapai transparansi, efisiensi, dan kepatuhan penuh.
          </p>
        </div>
        <div>
          <h4>Hubungi Kami</h4>
          <ul className="footer__list">
            <li>
              <Mail size={18} /> support@e-bidding.id
            </li>
            <li>
              <Phone size={18} /> +62 21 555 9911
            </li>
            <li>
              <MapPin size={18} /> Palma Tower Lt. 20, Jakarta Selatan
            </li>
          </ul>
        </div>
        <div id="login">
          <h4>Masuk</h4>
          <p>Akses portal panitia &amp; vendor.</p>
          <a href="https://app.e-bidding.id/login" className="btn btn--ghost" target="_blank" rel="noreferrer">
            Portal Login
          </a>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} e-Bidding. Seluruh hak cipta.</p>
        <div className="footer__links">
          <a href="/kebijakan-privasi">Kebijakan Privasi</a>
          <a href="/syarat-ketentuan">Syarat &amp; Ketentuan</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

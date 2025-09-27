import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Produk', href: '#products' },
  { label: 'Platform', href: '#platform' },
  { label: 'Jaringan', href: '#network' },
  { label: 'Alur Lelang', href: '#process' },
  { label: 'Testimoni', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontak', href: '#footer' },
];

const Navbar = ({ onLoginClick }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const handleLoginClick = () => {
    if (typeof onLoginClick === 'function') {
      onLoginClick();
    }
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <a href="#top" className="brand" aria-label="Beranda APAS">
            <img src="/logo-apas.png" alt="Logo APAS" className="brand__logo" />
            <span className="sr-only">APAS - Agrinas Palma Auction System</span>
          </a>

          <nav className="navbar__desktop" aria-label="Navigasi utama">
            <ul>
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="navbar__actions">
            <button type="button" className="btn btn--ghost" onClick={handleLoginClick}>
              Masuk
            </button>
            <a href="#/signup" className="btn btn--primary">
              Registrasi
            </a>
            <button className="navbar__toggle" onClick={toggleMenu} aria-label="Buka menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="navbar__mobile" aria-label="Navigasi utama mobile">
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} onClick={toggleMenu}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  handleLoginClick();
                  toggleMenu();
                }}
              >
                Masuk
              </button>
            </li>
            <li>
              <a href="#/signup" className="btn btn--primary" onClick={toggleMenu}>
                Registrasi
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

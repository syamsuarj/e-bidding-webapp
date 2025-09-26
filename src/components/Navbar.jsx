import { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';

const navItems = [
  { label: 'Fitur', href: '#features' },
  { label: 'Cara Kerja', href: '#process' },
  { label: 'Testimoni', href: '#testimonials' },
  { label: 'Kontak', href: '#footer' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <a href="#top" className="brand" aria-label="e-Bidding Home">
            <span className="brand__icon">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </span>
            <span className="brand__name">e-Bidding</span>
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
            <a href="#login" className="btn btn--ghost">
              Masuk
            </a>
            <a href="#daftar" className="btn btn--primary">
              Daftar Gratis
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
              <a href="#login" className="btn btn--ghost" onClick={toggleMenu}>
                Masuk
              </a>
            </li>
            <li>
              <a href="#daftar" className="btn btn--primary" onClick={toggleMenu}>
                Daftar Gratis
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

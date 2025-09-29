import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Produk", href: "#products" },
  { label: "Platform", href: "#platform" },
  { label: "Jaringan", href: "#network" },
  { label: "Alur Lelang", href: "#process" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#footer" },
];

const Navbar = ({ onLoginClick }) => {
  const [open, setOpen] = useState(false);
  const logoUrl = `${import.meta.env.BASE_URL}logo-apas.png`;

  const toggleMenu = () => setOpen(!open);
  const handleLoginClick = () => {
    if (typeof onLoginClick === "function") {
      onLoginClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between gap-6 py-4">
        <a
          href="#top"
          className="flex items-center gap-3 font-semibold text-lg text-primary"
          aria-label="Beranda APAS"
        >
          <img
            src={logoUrl}
            alt="Logo APAS"
            className="h-14 w-auto rounded-lg shadow-brand"
          />
          <span className="sr-only">APAS - Agrinas Palma Auction System</span>
        </a>

        <nav className="hidden lg:block" aria-label="Navigasi utama">
          <ul className="flex items-center gap-8 text-sm font-medium text-text/75">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  className="transition-colors hover:text-primary"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden sm:inline-flex btn btn--ghost"
            onClick={handleLoginClick}
          >
            Masuk
          </button>
          <a href="/signup" className="hidden sm:inline-flex btn btn--primary">
            Registrasi
          </a>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-text transition lg:hidden"
            onClick={toggleMenu}
            aria-label="Buka menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-surface lg:hidden"
          aria-label="Navigasi utama mobile"
        >
          <ul className="container flex flex-col gap-4 py-6">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  className="block rounded-md px-3 py-2 text-base font-medium text-text/80 transition hover:bg-background"
                  href={item.href}
                  onClick={toggleMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="btn btn--ghost w-full"
                onClick={() => {
                  handleLoginClick();
                  toggleMenu();
                }}
              >
                Masuk
              </button>
            </li>
            <li>
              <a
                href="/signup"
                className="btn btn--primary w-full"
                onClick={toggleMenu}
              >
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

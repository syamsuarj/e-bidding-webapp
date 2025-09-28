import React, { useEffect, useMemo, useState } from "react";
import {
  Menu,
  LayoutDashboard,
  ListOrdered,
  Users,
  Building2,
  Shield,
  FileText,
  LogOut,
} from "lucide-react";

const toTitle = (path) => {
  switch (path) {
    case "/admin":
      return "Dashboard";
    case "/admin/auctions":
      return "Daftar Lelang";
    case "/admin/participants":
      return "Daftar Peserta";
    case "/admin/pks":
      return "Daftar PKS";
    case "/admin/users":
      return "Pengguna";
    case "/admin/roles":
      return "Role Matrix";
    case "/admin/policies":
      return "Kebijakan";
    default:
      return "Admin";
  }
};

const AdminLayout = ({ children, title, breadcrumbs }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Simple auth guard for all admin pages
  useEffect(() => {
    if (sessionStorage.getItem("apas_admin_authed") !== "1") {
      window.history.replaceState(null, "", "/admin/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("apas_admin_sidebar_collapsed");
    if (saved) setCollapsed(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("apas_admin_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const pathname = window.location.pathname.replace(/\/+$/, "");

  const links = useMemo(
    () => [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/auctions", label: "Daftar Lelang", icon: ListOrdered },
      { href: "/admin/participants", label: "Daftar Peserta", icon: Users },
      { href: "/admin/pks", label: "Daftar PKS", icon: Building2 },
      { href: "/admin/users", label: "Pengguna", icon: Users },
      { href: "/admin/roles", label: "Role Matrix", icon: Shield },
      { href: "/admin/policies", label: "Kebijakan", icon: FileText },
    ],
    []
  );

  const onLogout = () => {
    sessionStorage.removeItem("apas_admin_authed");
    window.history.replaceState(null, "", "/admin/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const pageTitle = title || toTitle(pathname);
  const crumbs = breadcrumbs || [
    { label: "Admin", href: "/admin" },
    { label: pageTitle },
  ];

  return (
    <div className="app-wrapper">
      <div className={`admin-shell ${collapsed ? "is-collapsed" : ""}`}>
        <aside className="admin-sidebar">
          <div className="sidebar__header">
            <button
              className="sidebar__toggle"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
          </div>
          <nav className="sidebar__nav" aria-label="Navigasi admin">
            <ul>
              {links.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={`sidebar__link ${
                      pathname === href ? "is-active" : ""
                    }`}
                  >
                    <Icon size={18} />
                    <span className="sidebar__label">{label}</span>
                  </a>
                </li>
              ))}
              <li>
                <button
                  className="sidebar__link sidebar__logout"
                  onClick={onLogout}
                >
                  <LogOut size={18} />
                  <span className="sidebar__label">Keluar</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="admin-content">
          <div className="container">
            <div className="admin-page-header">
              {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
                <nav className="breadcrumb" aria-label="Breadcrumb">
                  <ol>
                    {breadcrumbs.map((c, idx) => (
                      <li key={idx}>
                        {c.href ? (
                          <a href={c.href}>{c.label}</a>
                        ) : (
                          <span aria-current="page">{c.label}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <h1>{pageTitle}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

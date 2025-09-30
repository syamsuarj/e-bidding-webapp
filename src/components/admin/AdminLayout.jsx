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
  ArrowLeft,
} from "lucide-react";

const toTitle = (path) => {
  switch (path) {
    case "/admin/dashboard":
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

const AdminLayout = ({
  children,
  title,
  breadcrumbs,
  unconstrained = false,
  backHref,
  subtitle,
}) => {
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
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/auctions", label: "Daftar Lelang", icon: ListOrdered },
      { href: "/admin/participants", label: "Daftar Peserta", icon: Users },
      { href: "/admin/pks", label: "Daftar PKS", icon: Building2 },
      { href: "/admin/users", label: "Pengguna", icon: Users },
      { href: "/admin/roles", label: "Role Matrix", icon: Shield },
      { href: "/admin/policies", label: "Kebijakan", icon: FileText },
      { href: "/admin/logs", label: "Logs", icon: FileText },
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
    <div className="min-h-screen bg-background text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`sticky top-0 h-screen overflow-y-auto flex flex-col justify-between border-r border-primary/10 bg-surface transition-all duration-200 ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-3">
            {/* Sidebar header / toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                className="inline-flex items-center justify-center border rounded-lg h-9 w-9 border-primary/10 hover:bg-primary/10"
                onClick={() => setCollapsed((v) => !v)}
                aria-label="Toggle sidebar"
                title="Sembunyikan/Perluas menu"
              >
                <Menu size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav aria-label="Navigasi admin">
              <ul className="space-y-1">
                {links.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-slate-700 hover:bg-primary/10 hover:text-primary"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && (
                          <span className="truncate">{label}</span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          {/* Logout */}
          <div className="p-3">
            <button
              className="flex items-center w-full gap-3 px-3 py-2 text-sm font-semibold transition border rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={onLogout}
            >
              <LogOut size={18} className="shrink-0" />
              {!collapsed && <span>Keluar</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-col flex-1 min-w-0 apas-admin-scope bg-background">
          {/* Header - mimic user Dashboard header */}
          <header className="flex flex-wrap items-center justify-between gap-6 px-8 py-6 border-b shadow-sm border-primary/10 bg-surface">
            <div className="min-w-0">
              {/* Breadcrumbs */}
              {/* {Array.isArray(crumbs) && crumbs.length > 0 && (
                <nav
                  className="mb-1 text-xs text-slate-500"
                  aria-label="Breadcrumb"
                >
                  <ol className="flex flex-wrap items-center gap-1">
                    {crumbs.map((c, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        {c.href ? (
                          <a href={c.href} className="hover:text-primary">
                            {c.label}
                          </a>
                        ) : (
                          <span aria-current="page">{c.label}</span>
                        )}
                        {idx < crumbs.length - 1 && (
                          <span className="text-slate-400">/</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )} */}
              <div className="flex items-center gap-3">
                {backHref && (
                  <a
                    href={backHref}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft size={16} />
                    <span>Kembali</span>
                  </a>
                )}
                <h1 className="text-2xl font-semibold truncate text-slate-900">
                  {pageTitle}
                </h1>
              </div>
              <p className="mt-1 text-sm line-clamp-2 text-slate-600">
                {subtitle ||
                  "Kelola data dan konfigurasi platform APAS melalui panel admin."}
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border shadow-sm rounded-2xl border-primary/10 bg-surface">
              <span className="flex items-center justify-center w-12 h-12 text-lg font-semibold text-white rounded-full bg-primary">
                AD
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-slate-900">
                  APAS Administrator
                </p>
                <p className="text-xs truncate text-slate-500">Admin Panel</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <section
            className={`flex-1 ${
              unconstrained
                ? "px-4 md:px-6 lg:px-8"
                : "mx-auto w-full max-w-[1800px] 2xl:max-w-[1920px]"
            }`}
          >
            {children}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

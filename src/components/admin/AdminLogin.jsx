import React, { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Placeholder auth — replace with real API later
      if (email && password) {
        sessionStorage.setItem("apas_admin_authed", "1");
        // Navigate to admin dashboard without hash and without adding history entry
        window.history.replaceState(null, "", "/admin/dashboard");
        window.dispatchEvent(new PopStateEvent("popstate"));
      } else {
        setError("Email dan kata sandi wajib diisi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/5 via-emerald-50 to-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Brand / Illustration panel */}
        <div className="hidden items-center justify-center p-10 md:flex">
          <div className="relative w-full max-w-md rounded-3xl border border-primary/10 bg-surface/60 p-8 shadow-soft backdrop-blur">
            <div className="flex items-center gap-3">
              <img src="/logo-apas.png" alt="APAS" className="h-10 w-10" />
              <div>
                <p className="text-sm font-semibold text-primary">APAS Admin</p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Agrinas Palma Auction System
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Kelola lelang, peserta, serta kebijakan platform melalui panel
              administrasi yang modern dan aman.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600">•</span> Kontrol akses
                berbasis peran
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600">•</span> Monitoring aktivitas
                lelang real-time
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600">•</span> Manajemen dokumen
                terpusat
              </li>
            </ul>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-8 md:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center md:hidden">
              <img
                src="/logo-apas.png"
                alt="APAS"
                className="mx-auto h-12 w-12"
              />
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                Masuk Admin
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Khusus untuk admin APAS
              </p>
            </div>

            <div
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              data-reveal
            >
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-1.5">
                  <label
                    htmlFor="admin-email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@contoh.com"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="admin-password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-12 text-sm shadow-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-2 my-1 inline-flex items-center rounded-md px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? "Sembunyikan" : "Tampilkan"}
                    </button>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-emerald-200"
                      />
                      Ingat saya
                    </label>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Lupa kata sandi?
                    </a>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(15,159,110,0.55)] transition hover:-translate-y-px hover:shadow-[0_30px_60px_-30px_rgba(15,159,110,0.6)] disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Memproses…" : "Masuk"}
                  </button>
                  <a
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    href="/"
                  >
                    Batal
                  </a>
                </div>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Dengan masuk, Anda menyetujui ketentuan dan kebijakan privasi
              APAS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;

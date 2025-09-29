import React, { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          data-reveal
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Masuk Admin
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Khusus untuk admin APAS
            </p>
          </div>
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
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
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
      </div>
    </section>
  );
};

export default AdminLogin;

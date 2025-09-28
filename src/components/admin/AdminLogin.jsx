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
        // Navigate to /admin/roles without hash and without adding history entry
        window.history.replaceState(null, "", "/admin/roles");
        window.dispatchEvent(new PopStateEvent("popstate"));
      } else {
        setError("Email dan kata sandi wajib diisi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="card" data-reveal>
          <div className="card__header">
            <h2>Masuk Admin</h2>
            <p className="text-muted">Khusus untuk admin APAS</p>
          </div>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@contoh.com"
              />
            </div>
            <div className="form-field">
              <label htmlFor="admin-password">Kata Sandi</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={loading}
              >
                {loading ? "Memproses…" : "Masuk"}
              </button>
              <a className="btn btn--ghost" href="/">
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

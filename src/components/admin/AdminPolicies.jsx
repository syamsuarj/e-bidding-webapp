import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import policiesData from "../../data/policies.json";

const STORAGE_KEY = "apas_admin_policies_v1";

const StatusBadge = ({ value }) => {
  const map = {
    Aktif: { bg: "rgba(16,185,129,.12)", color: "#047857" },
    Diperbarui: { bg: "rgba(59,130,246,.12)", color: "#1d4ed8" },
    Draf: { bg: "rgba(234,179,8,.12)", color: "#92400e" },
    Nonaktif: { bg: "rgba(239,68,68,.12)", color: "#b91c1c" },
  };
  const style = map[value] || map.Aktif;
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        padding: ".25rem .55rem",
        borderRadius: 999,
        fontSize: ".78rem",
        fontWeight: 600,
      }}
    >
      {value}
    </span>
  );
};

const AdminPolicies = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Semua");
  const [category, setCategory] = useState("Semua");
  const [list, setList] = useState(policiesData);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setList(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }, [list]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return list.filter((p) => {
      const matchQ =
        !ql ||
        p.id.toLowerCase().includes(ql) ||
        p.title.toLowerCase().includes(ql) ||
        p.owner.toLowerCase().includes(ql) ||
        p.category.toLowerCase().includes(ql);
      const matchS = status === "Semua" || p.status === status;
      const matchC = category === "Semua" || p.category === category;
      return matchQ && matchS && matchC;
    });
  }, [q, status, category, list]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

  return (
    <AdminLayout>
      <section className="section">
        <div className="card admin-scroll-table-card" data-reveal>
          <div className="card__toolbar">
            <div className="toolbar-left">
              <input
                className="input"
                placeholder="Cari ID, judul, kategori, atau owner…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="input"
                style={{ maxWidth: 160 }}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option>Semua</option>
                <option>Aktif</option>
                <option>Diperbarui</option>
                <option>Draf</option>
                <option>Nonaktif</option>
              </select>
              <select
                className="input"
                style={{ maxWidth: 160 }}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option>Semua</option>
                <option>Keamanan</option>
                <option>Privasi</option>
                <option>Kepatuhan</option>
                <option>Operasional</option>
              </select>
            </div>
            <div className="toolbar-right">
              <button
                className="btn btn--primary"
                onClick={() => setOpen(true)}
              >
                Tambah Kebijakan
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>ID</th>
                  <th>Judul</th>
                  <th style={{ width: 140 }}>Kategori</th>
                  <th style={{ width: 110 }}>Versi</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 150 }}>Efektif</th>
                  <th style={{ width: 160 }}>Pemilik</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.version}</td>
                    <td>
                      <StatusBadge value={p.status} />
                    </td>
                    <td>{p.effectiveDate}</td>
                    <td>{p.owner}</td>
                    <td>
                      <a
                        href="#"
                        className="btn btn--ghost"
                        onClick={(e) => e.preventDefault()}
                      >
                        Lihat
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        color: "rgba(15,23,42,.6)",
                      }}
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <div className="limit">
              <span>Tampilkan</span>
              <select
                className="input"
                style={{ width: 90 }}
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value, 10));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>per halaman</span>
            </div>
            <div className="pager">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Sebelumnya
              </button>
              <span style={{ padding: "0 .4rem" }}>
                Hal {page} / {Math.max(1, totalPages)}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </section>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Tambah Kebijakan</h3>
              <button className="btn btn--ghost" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <PolicyForm
              onCancel={() => setOpen(false)}
              onSave={(data) => {
                setList((prev) => [data, ...prev]);
                setOpen(false);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const PolicyForm = ({ onCancel, onSave }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const created = {
          id: (fd.get("id") || `POL-${Date.now()}`).toString(),
          title: (fd.get("title") || "Kebijakan Baru").toString(),
          category: (fd.get("category") || "Operasional").toString(),
          status: (fd.get("status") || "Aktif").toString(),
          version: (fd.get("version") || "1.0").toString(),
          effectiveDate: (
            fd.get("effectiveDate") || new Date().toISOString().slice(0, 10)
          ).toString(),
          owner: (fd.get("owner") || "Divisi TI").toString(),
        };
        onSave(created);
        e.currentTarget.reset();
      }}
    >
      <div className="modal__body">
        <div className="form-field">
          <label>ID</label>
          <input name="id" className="input" placeholder="POL-2025-XXXX" />
        </div>
        <div className="form-field">
          <label>Judul</label>
          <input
            name="title"
            className="input"
            placeholder="Judul kebijakan"
            required
          />
        </div>
        <div className="form-field">
          <label>Kategori</label>
          <select name="category" className="input" defaultValue="Operasional">
            <option>Keamanan</option>
            <option>Privasi</option>
            <option>Kepatuhan</option>
            <option>Operasional</option>
          </select>
        </div>
        <div className="form-field">
          <label>Status</label>
          <select name="status" className="input" defaultValue="Aktif">
            <option>Aktif</option>
            <option>Diperbarui</option>
            <option>Draf</option>
            <option>Nonaktif</option>
          </select>
        </div>
        <div className="form-field">
          <label>Versi</label>
          <input name="version" className="input" placeholder="1.0" />
        </div>
        <div className="form-field">
          <label>Efektif</label>
          <input type="date" name="effectiveDate" className="input" />
        </div>
        <div className="form-field">
          <label>Pemilik</label>
          <input name="owner" className="input" placeholder="Divisi/Unit" />
        </div>
      </div>
      <div className="modal__footer">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn--primary">
          Simpan
        </button>
      </div>
    </form>
  );
};

export default AdminPolicies;

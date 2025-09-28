import React, { useMemo, useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import pksData from "../../data/pks.json";

const STORAGE_KEY = "apas_admin_pks_v1";

const MOCK_PKS = pksData;

const StatusBadge = ({ value }) => {
  const map = {
    Aktif: { bg: "rgba(16,185,129,.12)", color: "#047857" },
    Perawatan: { bg: "rgba(234,179,8,.12)", color: "#92400e" },
    "Tidak Aktif": { bg: "rgba(239,68,68,.12)", color: "#b91c1c" },
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

const AdminPKS = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Semua");
  const [list, setList] = useState(MOCK_PKS);
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
    return list.filter((k) => {
      const matchQ =
        !ql ||
        k.id.toLowerCase().includes(ql) ||
        k.name.toLowerCase().includes(ql) ||
        k.location.toLowerCase().includes(ql) ||
        k.owner.toLowerCase().includes(ql);
      const matchS = status === "Semua" || k.status === status;
      return matchQ && matchS;
    });
  }, [q, status, list]);

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
                placeholder="Cari ID, nama, lokasi, atau pemilik…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="input"
                style={{ maxWidth: 180 }}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option>Semua</option>
                <option>Aktif</option>
                <option>Perawatan</option>
                <option>Tidak Aktif</option>
              </select>
            </div>
            <div className="toolbar-right">
              <button
                className="btn btn--primary"
                onClick={() => setOpen(true)}
              >
                Daftarkan PKS
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>ID</th>
                  <th>Nama PKS</th>
                  <th>Lokasi</th>
                  <th>Kapasitas</th>
                  <th>Pemilik</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 140 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((k) => (
                  <tr key={k.id}>
                    <td>{k.id}</td>
                    <td>{k.name}</td>
                    <td>{k.location}</td>
                    <td>{k.capacity}</td>
                    <td>{k.owner}</td>
                    <td>
                      <StatusBadge value={k.status} />
                    </td>
                    <td>
                      <a
                        href={`/admin/pks/${encodeURIComponent(k.id)}`}
                        className="btn btn--ghost"
                      >
                        Detail
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
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
                Hal {page} / {totalPages}
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
              <h3>Daftarkan PKS</h3>
              <button className="btn btn--ghost" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const created = {
                  id: (fd.get("id") || `PKS-${Date.now()}`).toString(),
                  name: (fd.get("name") || "PKS Baru").toString(),
                  location: (fd.get("location") || "").toString(),
                  capacity: (fd.get("capacity") || "").toString(),
                  owner: (fd.get("owner") || "").toString(),
                  status: (fd.get("status") || "Aktif").toString(),
                  since: (
                    fd.get("since") || new Date().getFullYear().toString()
                  ).toString(),
                };
                setList((prev) => [created, ...prev]);
                setOpen(false);
                setPage(1);
                e.target.reset();
              }}
            >
              <div className="modal__body">
                <div className="form-field">
                  <label>ID</label>
                  <input
                    name="id"
                    className="input"
                    placeholder="PKS-2025-XXXX"
                  />
                </div>
                <div className="form-field">
                  <label>Nama PKS</label>
                  <input
                    name="name"
                    className="input"
                    placeholder="Nama PKS"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Lokasi</label>
                  <input
                    name="location"
                    className="input"
                    placeholder="Lokasi"
                  />
                </div>
                <div className="form-field">
                  <label>Kapasitas</label>
                  <input
                    name="capacity"
                    className="input"
                    placeholder="Contoh: 30 TPH"
                  />
                </div>
                <div className="form-field">
                  <label>Pemilik</label>
                  <input
                    name="owner"
                    className="input"
                    placeholder="Nama pemilik"
                  />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select name="status" className="input">
                    <option>Aktif</option>
                    <option>Perawatan</option>
                    <option>Tidak Aktif</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Sejak (tahun)</label>
                  <input
                    name="since"
                    className="input"
                    placeholder="Contoh: 2018"
                  />
                </div>
              </div>
              <div className="modal__footer">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn--primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPKS;

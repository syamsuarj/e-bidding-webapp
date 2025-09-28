import React, { useMemo, useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import auctionsData from "../../data/auctions.json";

const STORAGE_KEY = "apas_admin_auctions_v1";

export const MOCK_AUCTIONS = auctionsData;

const StatusBadge = ({ value }) => {
  const map = {
    Terjadwal: { bg: "rgba(59,130,246,.12)", color: "#1d4ed8" },
    Terbuka: { bg: "rgba(16,185,129,.12)", color: "#047857" },
    Selesai: { bg: "rgba(107,114,128,.12)", color: "#374151" },
    Dibatalkan: { bg: "rgba(239,68,68,.12)", color: "#b91c1c" },
  };
  const style = map[value] || map["Selesai"];
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

const AdminAuctions = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Semua");
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(MOCK_AUCTIONS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // load and persist
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
    return list.filter((a) => {
      const matchQ =
        !ql ||
        a.id.toLowerCase().includes(ql) ||
        a.title.toLowerCase().includes(ql);
      const matchS = status === "Semua" || a.status === status;
      return matchQ && matchS;
    });
  }, [q, status, list]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const onCreate = (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const created = {
      id: (fd.get("id") || `AUC-${Date.now()}`).toString(),
      title: (fd.get("title") || "Lelang Baru").toString(),
      startDate: (fd.get("start") || "").toString(),
      endDate: (fd.get("end") || "").toString(),
      status: (fd.get("status") || "Terjadwal").toString(),
      participants: 0,
    };
    setList((prev) => [created, ...prev]);
    setOpen(false);
    setPage(1);
    form.reset();
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

  return (
    <AdminLayout>
      <section className="section">
        <div className="card admin-scroll-table-card" data-reveal>
          <div className="card__toolbar">
            <div className="toolbar-left">
              <input
                className="input"
                placeholder="Cari ID atau judul lelang…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="input"
                style={{ maxWidth: 200 }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Semua</option>
                <option>Terjadwal</option>
                <option>Terbuka</option>
                <option>Selesai</option>
                <option>Dibatalkan</option>
              </select>
            </div>
            <div className="toolbar-right">
              <button
                className="btn btn--primary"
                onClick={() => setOpen(true)}
              >
                Buat Lelang
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>ID</th>
                  <th>Judul</th>
                  <th style={{ width: 180 }}>Mulai</th>
                  <th style={{ width: 180 }}>Selesai</th>
                  <th style={{ width: 120 }}>Status</th>
                  <th style={{ width: 120 }}>Peserta</th>
                  <th style={{ width: 160 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.title}</td>
                    <td>{a.startDate}</td>
                    <td>{a.endDate}</td>
                    <td>
                      <StatusBadge value={a.status} />
                    </td>
                    <td className="cell-center">{a.participants}</td>
                    <td>
                      <div style={{ display: "flex", gap: ".4rem" }}>
                        <a
                          href={`/admin/auctions/${encodeURIComponent(a.id)}`}
                          className="btn btn--ghost"
                        >
                          Detail
                        </a>
                        <a
                          href="#"
                          className="btn btn--ghost"
                          onClick={(e) => e.preventDefault()}
                        >
                          Edit
                        </a>
                      </div>
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
              <h3>Buat Lelang</h3>
              <button className="btn btn--ghost" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <form onSubmit={onCreate}>
              <div className="modal__body">
                <div className="form-field">
                  <label>ID</label>
                  <input
                    name="id"
                    className="input"
                    placeholder="AUC-2025-XXXX"
                  />
                </div>
                <div className="form-field">
                  <label>Judul</label>
                  <input
                    name="title"
                    className="input"
                    placeholder="Judul lelang"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Mulai</label>
                  <input name="start" className="input" type="datetime-local" />
                </div>
                <div className="form-field">
                  <label>Selesai</label>
                  <input name="end" className="input" type="datetime-local" />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select name="status" className="input">
                    <option>Terjadwal</option>
                    <option>Terbuka</option>
                    <option>Selesai</option>
                    <option>Dibatalkan</option>
                  </select>
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

export default AdminAuctions;

import React, { useMemo, useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import participantsData from "../../data/participants.json";

const STORAGE_KEY = "apas_admin_participants_v1";

const MOCK_PARTICIPANTS = participantsData;

const StatusBadge = ({ value }) => {
  const map = {
    Menunggu: { bg: "rgba(234,179,8,.12)", color: "#92400e" },
    Terverifikasi: { bg: "rgba(16,185,129,.12)", color: "#047857" },
    Ditolak: { bg: "rgba(239,68,68,.12)", color: "#b91c1c" },
    Diblokir: { bg: "rgba(107,114,128,.12)", color: "#374151" },
  };
  const style = map[value] || map.Menunggu;
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

const AdminParticipants = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Semua");
  const [list, setList] = useState(MOCK_PARTICIPANTS);
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
        p.name.toLowerCase().includes(ql) ||
        p.email.toLowerCase().includes(ql) ||
        p.company.toLowerCase().includes(ql);
      const matchS = status === "Semua" || p.status === status;
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
                placeholder="Cari ID, nama, email, atau perusahaan…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="input"
                style={{ maxWidth: 220 }}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option>Semua</option>
                <option>Menunggu</option>
                <option>Terverifikasi</option>
                <option>Ditolak</option>
                <option>Diblokir</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>ID</th>
                  <th>Nama</th>
                  <th>Perusahaan</th>
                  <th>Email</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 140 }}>Terdaftar</th>
                  <th style={{ width: 140 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.company}</td>
                    <td>{p.email}</td>
                    <td>
                      <StatusBadge value={p.status} />
                    </td>
                    <td>{p.registeredAt}</td>
                    <td>
                      <a
                        href={`/admin/participants/${encodeURIComponent(p.id)}`}
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
              <h3>Daftarkan Peserta</h3>
              <button className="btn btn--ghost" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const created = {
                  id: (fd.get("id") || `PTC-${Date.now()}`).toString(),
                  name: (fd.get("name") || "Peserta Baru").toString(),
                  company: (fd.get("company") || "Perusahaan").toString(),
                  email: (fd.get("email") || "").toString(),
                  phone: (fd.get("phone") || "").toString(),
                  status: (fd.get("status") || "Menunggu").toString(),
                  registeredAt: new Date().toISOString().slice(0, 10),
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
                    placeholder="PTC-2025-XXXX"
                  />
                </div>
                <div className="form-field">
                  <label>Nama</label>
                  <input
                    name="name"
                    className="input"
                    placeholder="Nama peserta"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Perusahaan</label>
                  <input
                    name="company"
                    className="input"
                    placeholder="Nama perusahaan"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="email@domain.com"
                  />
                </div>
                <div className="form-field">
                  <label>Telepon</label>
                  <input
                    name="phone"
                    className="input"
                    placeholder="Nomor telepon"
                  />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select name="status" className="input">
                    <option>Menunggu</option>
                    <option>Terverifikasi</option>
                    <option>Ditolak</option>
                    <option>Diblokir</option>
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

export default AdminParticipants;

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import usersData from "../../data/users.json";

const USERS_STORAGE_KEY = "apas_admin_users_v1";
const ROLES_STORAGE_KEY = "apas_admin_role_matrix_v1";

const StatusBadge = ({ value }) => {
  const map = {
    Aktif: { bg: "rgba(16,185,129,.12)", color: "#047857" },
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

const AdminUsers = () => {
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [list, setList] = useState(usersData);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([
    { id: "buyer", name: "Buyer" },
    { id: "seller", name: "Seller" },
    { id: "auditor", name: "Auditor" },
    { id: "admin", name: "Admin" },
  ]);

  // Load RBAC roles from role matrix storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROLES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.roles) && parsed.roles.length) {
          setRoles(parsed.roles);
        }
      }
    } catch {}
  }, []);

  // Load users
  useEffect(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) setList(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }, [list]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return list.filter((u) => {
      const matchQ =
        !ql ||
        u.id.toLowerCase().includes(ql) ||
        u.name.toLowerCase().includes(ql) ||
        u.email.toLowerCase().includes(ql) ||
        (u.phone || "").toLowerCase().includes(ql);
      const matchRole = roleFilter === "Semua" || u.role === roleFilter;
      const matchStatus = statusFilter === "Semua" || u.status === statusFilter;
      return matchQ && matchRole && matchStatus;
    });
  }, [q, roleFilter, statusFilter, list]);

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
                placeholder="Cari ID, nama, email, atau telepon…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="input"
                style={{ maxWidth: 180 }}
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option>Semua</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                className="input"
                style={{ maxWidth: 140 }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option>Semua</option>
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
            </div>
            <div className="toolbar-right">
              <button
                className="btn btn--primary"
                onClick={() => setOpen(true)}
              >
                Tambah Pengguna
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th style={{ width: 160 }}>Telepon</th>
                  <th style={{ width: 140 }}>Role</th>
                  <th style={{ width: 120 }}>Status</th>
                  <th style={{ width: 160 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      {roles.find((r) => r.id === u.role)?.name || u.role}
                    </td>
                    <td>
                      <StatusBadge value={u.status} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: ".4rem" }}>
                        <a
                          href="#"
                          className="btn btn--ghost"
                          onClick={(e) => e.preventDefault()}
                        >
                          Edit
                        </a>
                        <a
                          href="#"
                          className="btn btn--ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            setList((prev) =>
                              prev.filter((x) => x.id !== u.id)
                            );
                          }}
                        >
                          Hapus
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
              <h3>Tambah Pengguna</h3>
              <button className="btn btn--ghost" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <UserForm
              roles={roles}
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

const UserForm = ({ roles, onCancel, onSave }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const created = {
          id: (fd.get("id") || `USR-${Date.now()}`).toString(),
          name: (fd.get("name") || "Pengguna Baru").toString(),
          email: (fd.get("email") || "").toString(),
          phone: (fd.get("phone") || "").toString(),
          role: (fd.get("role") || roles[0]?.id || "buyer").toString(),
          status: (fd.get("status") || "Aktif").toString(),
        };
        onSave(created);
        e.currentTarget.reset();
      }}
    >
      <div className="modal__body">
        <div className="form-field">
          <label>ID</label>
          <input name="id" className="input" placeholder="USR-2025-XXXX" />
        </div>
        <div className="form-field">
          <label>Nama</label>
          <input
            name="name"
            className="input"
            placeholder="Nama pengguna"
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
          <input name="phone" className="input" placeholder="Nomor telepon" />
        </div>
        <div className="form-field">
          <label>Role</label>
          <select
            name="role"
            className="input"
            defaultValue={roles[0]?.id || "buyer"}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Status</label>
          <select name="status" className="input" defaultValue="Aktif">
            <option>Aktif</option>
            <option>Nonaktif</option>
          </select>
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

export default AdminUsers;

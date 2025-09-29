import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import usersData from "../../data/users.json";

const USERS_STORAGE_KEY = "apas_admin_users_v1";
const ROLES_STORAGE_KEY = "apas_admin_role_matrix_v1";

const StatusBadge = ({ value }) => {
  const map = {
    Aktif: "bg-emerald-100 text-emerald-700",
    Nonaktif: "bg-rose-100 text-rose-700",
  };
  const cls = map[value] || map.Aktif;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
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
  const [limit, setLimit] = useState(10);
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
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <input
                  className="w-full min-w-60 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Cari ID, nama, email, atau telepon…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <select
                  className="max-w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
                  className="max-w-36 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
              <div className="shrink-0">
                <button
                  className="inline-flex items-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(15,159,110,0.55)] transition hover:-translate-y-px hover:shadow-[0_30px_60px_-30px_rgba(15,159,110,0.6)]"
                  onClick={() => setOpen(true)}
                >
                  Tambah Pengguna
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto admin-fixed-10rows">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="w-14 px-3 py-2 text-center font-semibold text-slate-700">
                      No.
                    </th>
                    <th className="w-40 px-3 py-2 font-semibold text-slate-700">
                      ID
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Nama
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Email
                    </th>
                    <th className="w-40 px-3 py-2 font-semibold text-slate-700">
                      Telepon
                    </th>
                    <th className="w-[140px] px-3 py-2 font-semibold text-slate-700">
                      Role
                    </th>
                    <th className="w-28 px-3 py-2 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="w-40 px-3 py-2 font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-center text-slate-700">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{u.id}</td>
                      <td className="px-3 py-2 text-slate-700">{u.name}</td>
                      <td className="px-3 py-2 text-slate-700">{u.email}</td>
                      <td className="px-3 py-2">
                        <div className="grid">
                          <span className="text-slate-700">{u.phone}</span>
                          {u.participantId && (
                            <a
                              href={`/admin/participants/${encodeURIComponent(
                                u.participantId
                              )}`}
                              className="text-xs text-slate-500 hover:text-slate-700"
                            >
                              Peserta: {u.participantId}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {roles.find((r) => r.id === u.role)?.name || u.role}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge value={u.status} />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <a
                            href="#"
                            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={(e) => e.preventDefault()}
                          >
                            Edit
                          </a>
                          <a
                            href="#"
                            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
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
                        colSpan={8}
                        className="px-3 py-6 text-center text-slate-500"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span>Tampilkan</span>
                <select
                  className="w-[90px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>per halaman</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <button
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 enabled:hover:bg-slate-50 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Sebelumnya
                </button>
                <span className="px-2 text-slate-600">
                  Hal {page} / {Math.max(1, totalPages)}
                </span>
                <button
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 enabled:hover:bg-slate-50 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h3 className="text-base font-semibold text-slate-900">
                Tambah Pengguna
              </h3>
              <button
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
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
      <div className="grid gap-4 p-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">ID</label>
          <input
            name="id"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="USR-2025-XXXX"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Nama</label>
          <input
            name="name"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Nama pengguna"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="email@domain.com"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Telepon</label>
          <input
            name="phone"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Nomor telepon"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Role</label>
          <select
            name="role"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            defaultValue={roles[0]?.id || "buyer"}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select
            name="status"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            defaultValue="Aktif"
          >
            <option>Aktif</option>
            <option>Nonaktif</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-4">
        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          onClick={onCancel}
        >
          Batal
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(15,159,110,0.55)] transition hover:-translate-y-px hover:shadow-[0_30px_60px_-30px_rgba(15,159,110,0.6)]"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default AdminUsers;

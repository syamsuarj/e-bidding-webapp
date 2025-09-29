import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import policiesData from "../../data/policies.json";

const STORAGE_KEY = "apas_admin_policies_v1";

const StatusBadge = ({ value }) => {
  const map = {
    Aktif: "bg-emerald-100 text-emerald-700",
    Diperbarui: "bg-blue-100 text-blue-700",
    Draf: "bg-amber-100 text-amber-700",
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
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <input
                  className="w-full min-w-60 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Cari ID, judul, kategori, atau owner…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <select
                  className="max-w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
                  className="max-w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
              <div className="shrink-0">
                <button
                  className="inline-flex items-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(15,159,110,0.55)] transition hover:-translate-y-px hover:shadow-[0_30px_60px_-30px_rgba(15,159,110,0.6)]"
                  onClick={() => setOpen(true)}
                >
                  Tambah Kebijakan
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="w-40 px-3 py-2 font-semibold text-slate-700">
                      ID
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Judul
                    </th>
                    <th className="w-[140px] px-3 py-2 font-semibold text-slate-700">
                      Kategori
                    </th>
                    <th className="w-28 px-3 py-2 font-semibold text-slate-700">
                      Versi
                    </th>
                    <th className="w-[140px] px-3 py-2 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="w-[150px] px-3 py-2 font-semibold text-slate-700">
                      Efektif
                    </th>
                    <th className="w-40 px-3 py-2 font-semibold text-slate-700">
                      Pemilik
                    </th>
                    <th className="w-30 px-3 py-2 font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-700">{p.id}</td>
                      <td className="px-3 py-2 text-slate-700">{p.title}</td>
                      <td className="px-3 py-2 text-slate-700">{p.category}</td>
                      <td className="px-3 py-2 text-slate-700">{p.version}</td>
                      <td className="px-3 py-2">
                        <StatusBadge value={p.status} />
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {p.effectiveDate}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{p.owner}</td>
                      <td className="px-3 py-2">
                        <a
                          href="#"
                          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
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
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
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
                Tambah Kebijakan
              </h3>
              <button
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
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
      <div className="grid gap-4 p-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">ID</label>
          <input
            name="id"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="POL-2025-XXXX"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Judul</label>
          <input
            name="title"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Judul kebijakan"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Kategori</label>
          <select
            name="category"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            defaultValue="Operasional"
          >
            <option>Keamanan</option>
            <option>Privasi</option>
            <option>Kepatuhan</option>
            <option>Operasional</option>
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
            <option>Diperbarui</option>
            <option>Draf</option>
            <option>Nonaktif</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Versi</label>
          <input
            name="version"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="1.0"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Efektif</label>
          <input
            type="date"
            name="effectiveDate"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-slate-700">Pemilik</label>
          <input
            name="owner"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Divisi/Unit"
          />
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

export default AdminPolicies;

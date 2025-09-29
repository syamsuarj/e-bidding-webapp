import React, { useMemo, useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import pksData from "../../data/pks.json";

const STORAGE_KEY = "apas_admin_pks_v1";

const MOCK_PKS = pksData;

const StatusBadge = ({ value }) => {
  const map = {
    Aktif: "bg-emerald-100 text-emerald-700",
    Perawatan: "bg-amber-100 text-amber-700",
    "Tidak Aktif": "bg-rose-100 text-rose-700",
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

const AdminPKS = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Semua");
  const [list, setList] = useState(MOCK_PKS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
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
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <input
                  className="w-full min-w-60 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Cari ID, nama, lokasi, atau pemilik…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <select
                  className="max-w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
              <div className="shrink-0">
                <button
                  className="inline-flex items-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(15,159,110,0.55)] transition hover:-translate-y-px hover:shadow-[0_30px_60px_-30px_rgba(15,159,110,0.6)]"
                  onClick={() => setOpen(true)}
                >
                  Daftarkan PKS
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
                      Nama PKS
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Lokasi
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Kapasitas
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Pemilik
                    </th>
                    <th className="w-[140px] px-3 py-2 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="w-[140px] px-3 py-2 font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((k, idx) => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-center text-slate-700">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{k.id}</td>
                      <td className="px-3 py-2 text-slate-700">{k.name}</td>
                      <td className="px-3 py-2 text-slate-700">{k.location}</td>
                      <td className="px-3 py-2 text-slate-700">{k.capacity}</td>
                      <td className="px-3 py-2 text-slate-700">{k.owner}</td>
                      <td className="px-3 py-2">
                        <StatusBadge value={k.status} />
                      </td>
                      <td className="px-3 py-2">
                        <a
                          href={`/admin/pks/${encodeURIComponent(k.id)}`}
                          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Detail
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
                  Hal {page} / {totalPages}
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
                Daftarkan PKS
              </h3>
              <button
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
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
              <div className="grid gap-4 p-4">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    ID
                  </label>
                  <input
                    name="id"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="PKS-2025-XXXX"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Nama PKS
                  </label>
                  <input
                    name="name"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="Nama PKS"
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Lokasi
                  </label>
                  <input
                    name="location"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="Lokasi"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Kapasitas
                  </label>
                  <input
                    name="capacity"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="Contoh: 30 TPH"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Pemilik
                  </label>
                  <input
                    name="owner"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="Nama pemilik"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option>Aktif</option>
                    <option>Perawatan</option>
                    <option>Tidak Aktif</option>
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Sejak (tahun)
                  </label>
                  <input
                    name="since"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="Contoh: 2018"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-4">
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
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
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPKS;

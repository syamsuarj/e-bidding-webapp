import React, { useMemo, useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import auctionsData from "../../data/auctions.json";

const STORAGE_KEY = "apas_admin_auctions_v1";

export const MOCK_AUCTIONS = auctionsData;

const StatusBadge = ({ value }) => {
  const map = {
    Terjadwal: "bg-blue-100 text-blue-700",
    Terbuka: "bg-emerald-100 text-emerald-700",
    Selesai: "bg-slate-100 text-slate-700",
    Dibatalkan: "bg-rose-100 text-rose-700",
  };
  const cls = map[value] || map.Selesai;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
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
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <input
                  className="w-full min-w-60 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Cari ID atau judul lelang…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <select
                  className="max-w-52 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
              <div className="shrink-0">
                <button
                  className="inline-flex items-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(15,159,110,0.55)] transition hover:-translate-y-px hover:shadow-[0_30px_60px_-30px_rgba(15,159,110,0.6)]"
                  onClick={() => setOpen(true)}
                >
                  Buat Lelang
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
                    <th className="w-[180px] px-3 py-2 font-semibold text-slate-700">
                      Mulai
                    </th>
                    <th className="w-[180px] px-3 py-2 font-semibold text-slate-700">
                      Selesai
                    </th>
                    <th className="w-28 px-3 py-2 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="w-28 px-3 py-2 font-semibold text-slate-700">
                      Peserta
                    </th>
                    <th className="w-40 px-3 py-2 font-semibold text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-700">{a.id}</td>
                      <td className="px-3 py-2 text-slate-700">{a.title}</td>
                      <td className="px-3 py-2 text-slate-700">
                        {a.startDate}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{a.endDate}</td>
                      <td className="px-3 py-2">
                        <StatusBadge value={a.status} />
                      </td>
                      <td className="px-3 py-2 text-center text-slate-700">
                        {a.participants}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <a
                            href={`/admin/auctions/${encodeURIComponent(a.id)}`}
                            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Detail
                          </a>
                          <a
                            href="#"
                            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
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
                Buat Lelang
              </h3>
              <button
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Tutup
              </button>
            </div>
            <form onSubmit={onCreate}>
              <div className="grid gap-4 p-4">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    ID
                  </label>
                  <input
                    name="id"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="AUC-2025-XXXX"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Judul
                  </label>
                  <input
                    name="title"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="Judul lelang"
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Mulai
                  </label>
                  <input
                    name="start"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    type="datetime-local"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Selesai
                  </label>
                  <input
                    name="end"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    type="datetime-local"
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
                    <option>Terjadwal</option>
                    <option>Terbuka</option>
                    <option>Selesai</option>
                    <option>Dibatalkan</option>
                  </select>
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

export default AdminAuctions;

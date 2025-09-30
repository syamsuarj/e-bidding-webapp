import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import logsData from "../../data/logs.json";

const STORAGE_KEY = "apas_admin_logs_v1";

const LevelBadge = ({ level }) => {
  const map = {
    INFO: "bg-sky-100 text-sky-700",
    WARN: "bg-amber-100 text-amber-700",
    ERROR: "bg-rose-100 text-rose-700",
  };
  const cls = map[level] || "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {level}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    success: "bg-emerald-100 text-emerald-700",
    failed: "bg-rose-100 text-rose-700",
  };
  const cls = map[status] || "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
};

const AdminLogs = () => {
  const [q, setQ] = useState("");
  const [type, setType] = useState("Semua"); // System | Activity | Others
  const [level, setLevel] = useState("Semua"); // INFO | WARN | ERROR
  const [list, setList] = useState(logsData);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detail, setDetail] = useState(null);

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
    return list.filter((e) => {
      const t = (e.type || "").toLowerCase();
      const lvl = (e.level || "").toUpperCase();
      const matchQ =
        !ql ||
        e.id?.toLowerCase().includes(ql) ||
        e.message?.toLowerCase().includes(ql) ||
        e.action?.toLowerCase().includes(ql) ||
        e.actor?.name?.toLowerCase().includes(ql) ||
        e.resource?.type?.toLowerCase().includes(ql) ||
        e.resource?.id?.toLowerCase().includes(ql);
      const matchT =
        type === "Semua" ||
        (type === "System" && t === "system") ||
        (type === "Activity" && t === "activity") ||
        (type === "Others" && t !== "system" && t !== "activity");
      const matchL = level === "Semua" || lvl === level;
      return matchQ && matchT && matchL;
    });
  }, [q, type, level, list]);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = [
      "id",
      "timestamp",
      "level",
      "type",
      "actor_id",
      "actor_name",
      "actor_role",
      "action",
      "resource_type",
      "resource_id",
      "status",
      "message",
    ];
    const rows = filtered.map((e) => [
      e.id,
      e.timestamp,
      e.level,
      e.type,
      e.actor?.id || "",
      e.actor?.name || "",
      e.actor?.role || "",
      e.action || "",
      e.resource?.type || "",
      e.resource?.id || "",
      e.status || "",
      (e.message || "").replace(/\n/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (!confirm("Hapus semua logs yang tersimpan lokal?")) return;
    setList([]);
    setPage(1);
  };

  return (
    <AdminLayout>
      <section className="py-6 md:py-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-4 bg-white border rounded-xl border-slate-200">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center flex-1 gap-2">
                <input
                  className="flex-1 w-full px-3 py-2 text-sm border rounded-lg shadow-sm min-w-60 border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Cari ID, pesan, actor, resource…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <select
                  className="px-3 py-2 text-sm bg-white border rounded-lg shadow-sm max-w-40 border-slate-300 text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                >
                  <option>Semua</option>
                  <option>System</option>
                  <option>Activity</option>
                  <option>Others</option>
                </select>
                <select
                  className="px-3 py-2 text-sm bg-white border rounded-lg shadow-sm max-w-40 border-slate-300 text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value);
                    setPage(1);
                  }}
                >
                  <option>Semua</option>
                  <option>INFO</option>
                  <option>WARN</option>
                  <option>ERROR</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center px-3 py-2 text-sm border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={exportCSV}
                >
                  Export CSV
                </button>
                <button
                  className="inline-flex items-center px-3 py-2 text-sm border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={exportJSON}
                >
                  Export JSON
                </button>
                <button
                  className="inline-flex items-center px-3 py-2 text-sm border rounded-lg border-rose-300 text-rose-700 hover:bg-rose-50"
                  onClick={clearLogs}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto admin-fixed-10rows">
              <table className="min-w-full text-sm text-left divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-center w-14 text-slate-700">
                      No.
                    </th>
                    <th className="w-[170px] px-3 py-2 font-semibold text-slate-700">
                      Waktu
                    </th>
                    <th className="w-20 px-3 py-2 font-semibold text-slate-700">
                      Level
                    </th>
                    <th className="px-3 py-2 font-semibold w-28 text-slate-700">
                      Kategori
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Actor
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Action
                    </th>
                    <th className="w-[160px] px-3 py-2 font-semibold text-slate-700">
                      Resource
                    </th>
                    <th className="w-24 px-3 py-2 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Pesan
                    </th>
                    <th className="px-3 py-2 font-semibold w-28 text-slate-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((e, idx) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-center text-slate-700">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {new Date(e.timestamp).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        <LevelBadge level={e.level} />
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {e.type || "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {e.actor?.name || e.actor?.id || "system"}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{e.action}</td>
                      <td className="px-3 py-2 text-slate-700">
                        {e.resource?.type || "-"}
                        {e.resource?.id ? ` • ${e.resource.id}` : ""}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        <StatusBadge status={e.status || "success"} />
                      </td>
                      <td className="px-3 py-2 text-slate-700 line-clamp-2">
                        {e.message}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setDetail(e)}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
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
            <div className="flex flex-col items-center justify-between gap-3 mt-4 sm:flex-row">
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

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40"
          onClick={() => setDetail(null)}
        >
          <div
            className="w-full max-w-3xl bg-white border shadow-xl rounded-xl border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                Detail Log
              </h3>
              <button
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setDetail(null)}
              >
                Tutup
              </button>
            </div>
            <div className="p-4">
              <pre className="max-h-[70vh] overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-800">
                {JSON.stringify(detail, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminLogs;

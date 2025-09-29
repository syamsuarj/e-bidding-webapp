import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";

const LS_KEYS = {
  auctions: "apas_admin_auctions_v1",
  participants: "apas_admin_participants_v1",
  pks: "apas_admin_pks_v1",
  users: "apas_admin_users_v1",
};

const useLocalData = (key, fallback = []) => {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setData(JSON.parse(saved));
    } catch {}
  }, [key]);
  return data;
};

const StatCard = ({ label, value, delta, hint }) => {
  const positive = typeof delta === "number" && delta >= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <strong className="text-2xl font-semibold text-slate-900">
          {value}
        </strong>
        {typeof delta === "number" && (
          <span
            className={
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold " +
              (positive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700")
            }
          >
            {positive ? `+${delta}%` : `${delta}%`}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-sm text-slate-500">{hint}</div>}
    </div>
  );
};

const MiniBar = ({ series, color = "#0f9f6e" }) => {
  const max = Math.max(1, ...series);
  return (
    <div className="flex h-12 items-end gap-1.5">
      {series.map((v, i) => (
        <div
          key={i}
          className="w-2.5 rounded-md opacity-90"
          style={{ height: Math.max(4, (v / max) * 48), background: color }}
        />
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const auctions = useLocalData(LS_KEYS.auctions, []);
  const participants = useLocalData(LS_KEYS.participants, []);
  const pks = useLocalData(LS_KEYS.pks, []);
  const users = useLocalData(LS_KEYS.users, []);

  const kpis = useMemo(() => {
    const openAuctions = auctions.filter((a) => a.status === "Terbuka").length;
    const scheduled = auctions.filter((a) => a.status === "Terjadwal").length;
    const done = auctions.filter((a) => a.status === "Selesai").length;
    const participantsCount = participants.length;
    const activeUsers = users.filter((u) => u.status === "Aktif").length;
    const mills = pks.length;
    return {
      openAuctions,
      scheduled,
      done,
      participantsCount,
      activeUsers,
      mills,
    };
  }, [auctions, participants, users, pks]);

  const recentAuctions = useMemo(() => auctions.slice(0, 6), [auctions]);
  const recentParticipants = useMemo(
    () => participants.slice(0, 6),
    [participants]
  );

  return (
    <AdminLayout>
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* KPI Row */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              label="Lelang Terbuka"
              value={kpis.openAuctions}
              delta={+8}
              hint="vs minggu lalu"
            />
            <StatCard label="Terjadwal" value={kpis.scheduled} delta={+3} />
            <StatCard
              label="Selesai (bulan ini)"
              value={kpis.done}
              delta={+2}
            />
            <StatCard
              label="Peserta"
              value={kpis.participantsCount}
              delta={+5}
            />
            <StatCard
              label="Pengguna Aktif"
              value={kpis.activeUsers}
              delta={+1}
            />
            <StatCard label="Jumlah PKS" value={kpis.mills} />
          </div>

          {/* Two Columns: Trends + Alerts */}
          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="m-0 text-base font-semibold text-slate-900">
                  Tren Aktivitas
                </h3>
                <small className="text-slate-500">7 hari terakhir</small>
              </div>
              <div className="mt-3 grid gap-3">
                <div>
                  <div className="text-sm text-slate-500">
                    Pendaftaran Peserta
                  </div>
                  <MiniBar series={[3, 5, 2, 6, 4, 7, 5]} color="#34d399" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Lelang Dibuka</div>
                  <MiniBar series={[1, 2, 1, 3, 2, 4, 2]} color="#60a5fa" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">PKS Terdaftar</div>
                  <MiniBar series={[0, 1, 1, 1, 0, 2, 1]} color="#fbbf24" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="m-0 text-base font-semibold text-slate-900">
                Notifikasi
              </h3>
              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                3 lelang akan segera dibuka minggu ini.
              </div>
              <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                2 peserta baru telah diverifikasi.
              </div>
              <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                1 PKS membutuhkan perawatan.
              </div>
            </div>
          </div>

          {/* Recent tables */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="m-0 text-base font-semibold text-slate-900">
                  Lelang Terbaru
                </h3>
                <a
                  className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  href="/admin/auctions"
                >
                  Lihat semua
                </a>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                        ID
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                        Judul
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                        Mulai
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentAuctions.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-700">{a.id}</td>
                        <td className="px-3 py-2 text-slate-700">{a.title}</td>
                        <td className="px-3 py-2 text-slate-700">{a.status}</td>
                        <td className="px-3 py-2 text-slate-700">
                          {a.startDate}
                        </td>
                      </tr>
                    ))}
                    {recentAuctions.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-slate-500"
                        >
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="m-0 text-base font-semibold text-slate-900">
                  Peserta Terbaru
                </h3>
                <a
                  className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  href="/admin/participants"
                >
                  Lihat semua
                </a>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                        ID
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                        Nama
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                        Perusahaan
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700">
                        Terdaftar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentParticipants.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-700">{p.id}</td>
                        <td className="px-3 py-2 text-slate-700">{p.name}</td>
                        <td className="px-3 py-2 text-slate-700">
                          {p.company}
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {p.registeredAt}
                        </td>
                      </tr>
                    ))}
                    {recentParticipants.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-slate-500"
                        >
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;

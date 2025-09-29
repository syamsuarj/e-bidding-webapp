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

const StatCard = ({ label, value, delta, hint }) => (
  <div className="card" style={{ padding: "1rem 1.1rem" }}>
    <div style={{ fontSize: ".9rem", color: "rgba(15,23,42,.62)" }}>
      {label}
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: ".6rem" }}>
      <strong style={{ fontSize: "1.8rem" }}>{value}</strong>
      {typeof delta === "number" && (
        <span
          style={{
            color: delta >= 0 ? "#047857" : "#b91c1c",
            background:
              delta >= 0 ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)",
            padding: ".15rem .45rem",
            borderRadius: 999,
            fontSize: ".8rem",
            fontWeight: 700,
          }}
        >
          {delta >= 0 ? `+${delta}%` : `${delta}%`}
        </span>
      )}
    </div>
    {hint && (
      <div
        style={{
          marginTop: ".4rem",
          color: "rgba(15,23,42,.55)",
          fontSize: ".85rem",
        }}
      >
        {hint}
      </div>
    )}
  </div>
);

const MiniBar = ({ series, color = "#0f9f6e" }) => {
  const max = Math.max(1, ...series);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 48 }}
    >
      {series.map((v, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: Math.max(4, (v / max) * 48),
            background: color,
            borderRadius: 3,
            opacity: 0.9,
          }}
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
      <section className="section">
        <div className="container" style={{ padding: 0 }}>
          {/* KPI Row */}
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginBottom: "1rem",
            }}
          >
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
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "minmax(0,1fr) minmax(0, 420px)",
              marginBottom: "1rem",
            }}
          >
            <div className="card" style={{ display: "grid", gap: ".8rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>Tren Aktivitas</h3>
                <small style={{ color: "rgba(15,23,42,.62)" }}>
                  7 hari terakhir
                </small>
              </div>
              <div style={{ display: "grid", gap: ".8rem" }}>
                <div>
                  <div
                    style={{ fontSize: ".85rem", color: "rgba(15,23,42,.62)" }}
                  >
                    Pendaftaran Peserta
                  </div>
                  <MiniBar series={[3, 5, 2, 6, 4, 7, 5]} color="#34d399" />
                </div>
                <div>
                  <div
                    style={{ fontSize: ".85rem", color: "rgba(15,23,42,.62)" }}
                  >
                    Lelang Dibuka
                  </div>
                  <MiniBar series={[1, 2, 1, 3, 2, 4, 2]} color="#60a5fa" />
                </div>
                <div>
                  <div
                    style={{ fontSize: ".85rem", color: "rgba(15,23,42,.62)" }}
                  >
                    PKS Terdaftar
                  </div>
                  <MiniBar series={[0, 1, 1, 1, 0, 2, 1]} color="#fbbf24" />
                </div>
              </div>
            </div>

            <div className="card" style={{ display: "grid", gap: ".8rem" }}>
              <h3 style={{ margin: 0 }}>Notifikasi</h3>
              <div className="dashboard__alert dashboard__alert--info">
                3 lelang akan segera dibuka minggu ini.
              </div>
              <div className="dashboard__alert dashboard__alert--success">
                2 peserta baru telah diverifikasi.
              </div>
              <div className="dashboard__alert dashboard__alert--error">
                1 PKS membutuhkan perawatan.
              </div>
            </div>
          </div>

          {/* Recent tables */}
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            }}
          >
            <div className="card" style={{ display: "grid", gap: ".6rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>Lelang Terbaru</h3>
                <a className="btn btn--ghost" href="/admin/auctions">
                  Lihat semua
                </a>
              </div>
              <div className="dashboard__table-wrapper">
                <table className="dashboard__table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Judul</th>
                      <th>Status</th>
                      <th>Mulai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAuctions.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.title}</td>
                        <td>{a.status}</td>
                        <td>{a.startDate}</td>
                      </tr>
                    ))}
                    {recentAuctions.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            color: "rgba(15,23,42,.6)",
                            textAlign: "center",
                          }}
                        >
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ display: "grid", gap: ".6rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>Peserta Terbaru</h3>
                <a className="btn btn--ghost" href="/admin/participants">
                  Lihat semua
                </a>
              </div>
              <div className="dashboard__table-wrapper">
                <table className="dashboard__table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>Perusahaan</th>
                      <th>Terdaftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentParticipants.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.company}</td>
                        <td>{p.registeredAt}</td>
                      </tr>
                    ))}
                    {recentParticipants.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            color: "rgba(15,23,42,.6)",
                            textAlign: "center",
                          }}
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

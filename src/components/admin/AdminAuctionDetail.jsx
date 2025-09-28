import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { MOCK_AUCTIONS } from "./AdminAuctions.jsx";

const STORAGE_KEY = "apas_admin_auctions_v1";

const AdminAuctionDetail = () => {
  const pathname = window.location.pathname;
  const id = decodeURIComponent(pathname.split("/admin/auctions/")[1] || "");

  const [list, setList] = useState(MOCK_AUCTIONS);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setList(JSON.parse(saved));
    } catch {}
  }, []);

  const item = useMemo(() => list.find((a) => a.id === id), [list, id]);

  const crumbs = [
    { label: "Daftar Lelang", href: "/admin/auctions" },
    { label: item ? item.id : id },
  ];

  return (
    <AdminLayout title="Detail Lelang" breadcrumbs={crumbs}>
      <section className="section">
        <div className="card" data-reveal>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: ".75rem",
            }}
          >
            <h2 style={{ margin: 0 }}>
              {item ? item.title : "Tidak ditemukan"}
            </h2>
            <a href="/admin/auctions" className="btn btn--ghost">
              Kembali
            </a>
          </div>
          {item ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: ".5rem",
              }}
            >
              <div style={{ color: "rgba(15,23,42,.6)" }}>ID</div>
              <div>{item.id}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Judul</div>
              <div>{item.title}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Waktu Mulai</div>
              <div>{item.startDate}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Waktu Selesai</div>
              <div>{item.endDate}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Status</div>
              <div>{item.status}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Jumlah Peserta</div>
              <div>{item.participants}</div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "rgba(15,23,42,.6)" }}>
              Data tidak ditemukan.
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminAuctionDetail;

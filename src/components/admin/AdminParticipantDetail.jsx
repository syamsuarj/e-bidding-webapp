import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";

const STORAGE_KEY = "apas_admin_participants_v1";

const AdminParticipantDetail = () => {
  const pathname = window.location.pathname;
  const id = decodeURIComponent(
    pathname.split("/admin/participants/")[1] || ""
  );

  const [list, setList] = useState([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setList(JSON.parse(saved));
    } catch {}
  }, []);

  const item = useMemo(() => list.find((p) => p.id === id), [list, id]);

  const crumbs = [
    { label: "Daftar Peserta", href: "/admin/participants" },
    { label: item ? item.id : id },
  ];

  return (
    <AdminLayout title="Detail Peserta" breadcrumbs={crumbs}>
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
              {item ? item.name : "Tidak ditemukan"}
            </h2>
            <a href="/admin/participants" className="btn btn--ghost">
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
              <div style={{ color: "rgba(15,23,42,.6)" }}>Nama</div>
              <div>{item.name}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Perusahaan</div>
              <div>{item.company}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Email</div>
              <div>{item.email}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Telepon</div>
              <div>{item.phone}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Status</div>
              <div>{item.status}</div>
              <div style={{ color: "rgba(15,23,42,.6)" }}>Tanggal Daftar</div>
              <div>{item.registeredAt}</div>
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

export default AdminParticipantDetail;

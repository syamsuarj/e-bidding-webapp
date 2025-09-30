import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";

const STORAGE_KEY = "apas_admin_pks_v1";

const AdminPKSDetail = () => {
  const pathname = window.location.pathname;
  const id = decodeURIComponent(pathname.split("/admin/pks/")[1] || "");

  const [list, setList] = useState([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setList(JSON.parse(saved));
    } catch {}
  }, []);

  const item = useMemo(() => list.find((k) => k.id === id), [list, id]);

  const crumbs = [
    { label: "Daftar PKS", href: "/admin/pks" },
    { label: item ? item.id : id },
  ];

  return (
    <AdminLayout title="Detail PKS" breadcrumbs={crumbs} backHref="/admin/pks">
      <section className="py-6 md:py-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-4 bg-white border rounded-xl border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="m-0 text-lg font-semibold text-slate-900">
                {item ? item.name : "Tidak ditemukan"}
              </h2>
            </div>
            {item ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[200px_1fr]">
                <div className="text-slate-500">ID</div>
                <div className="text-slate-800">{item.id}</div>
                <div className="text-slate-500">Nama PKS</div>
                <div className="text-slate-800">{item.name}</div>
                <div className="text-slate-500">Lokasi</div>
                <div className="text-slate-800">{item.location}</div>
                <div className="text-slate-500">Kapasitas</div>
                <div className="text-slate-800">{item.capacity}</div>
                <div className="text-slate-500">Pemilik</div>
                <div className="text-slate-800">{item.owner}</div>
                <div className="text-slate-500">Status</div>
                <div className="text-slate-800">{item.status}</div>
                <div className="text-slate-500">Sejak</div>
                <div className="text-slate-800">{item.since}</div>
              </div>
            ) : (
              <div className="text-center text-slate-500">
                Data tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminPKSDetail;

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
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-xl border border-slate-200 bg-white p-4"
            data-reveal
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="m-0 text-xl font-semibold text-slate-900">
                {item ? item.title : "Tidak ditemukan"}
              </h2>
              <a
                href="/admin/auctions"
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Kembali
              </a>
            </div>
            {item ? (
              <div className="grid grid-cols-[200px_1fr] gap-2">
                <div className="text-slate-500">ID</div>
                <div className="text-slate-900">{item.id}</div>
                <div className="text-slate-500">Judul</div>
                <div className="text-slate-900">{item.title}</div>
                <div className="text-slate-500">Waktu Mulai</div>
                <div className="text-slate-900">{item.startDate}</div>
                <div className="text-slate-500">Waktu Selesai</div>
                <div className="text-slate-900">{item.endDate}</div>
                <div className="text-slate-500">Status</div>
                <div className="text-slate-900">{item.status}</div>
                <div className="text-slate-500">Jumlah Peserta</div>
                <div className="text-slate-900">{item.participants}</div>
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

export default AdminAuctionDetail;

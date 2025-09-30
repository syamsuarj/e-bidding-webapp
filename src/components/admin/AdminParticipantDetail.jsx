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
    <AdminLayout
      title="Detail Peserta"
      breadcrumbs={crumbs}
      unconstrained
      backHref="/admin/participants"
    >
      <section className="py-6 md:py-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className="p-4 bg-white border rounded-xl border-slate-200"
            data-reveal
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="m-0 text-xl font-semibold text-slate-900">
                  {item ? item.name : "Tidak ditemukan"}
                </h2>
                {item && (
                  <p className="mt-1 text-sm text-slate-500">{item.company}</p>
                )}
              </div>
            </div>

            {item ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-4 border rounded-lg border-slate-200">
                  <h3 className="mb-3 text-base font-semibold text-slate-900">
                    Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <div className="text-slate-500">ID</div>
                    <div className="text-slate-900">{item.id}</div>
                    <div className="text-slate-500">Nama Lengkap</div>
                    <div className="text-slate-900">{item.name}</div>
                    <div className="text-slate-500">Email</div>
                    <div className="text-slate-900">{item.email}</div>
                    <div className="text-slate-500">Telepon</div>
                    <div className="text-slate-900">{item.phone || "-"}</div>
                    <div className="text-slate-500">Status</div>
                    <div className="text-slate-900">{item.status}</div>
                    <div className="text-slate-500">Tanggal Daftar</div>
                    <div className="text-slate-900">{item.registeredAt}</div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg border-slate-200">
                  <h3 className="mb-3 text-base font-semibold text-slate-900">
                    Data Perusahaan
                  </h3>
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <div className="text-slate-500">Nama Perusahaan</div>
                    <div className="text-slate-900">{item.company}</div>
                    <div className="text-slate-500">Jenis Perusahaan</div>
                    <div className="text-slate-900">
                      {item.companyType || "-"}
                    </div>
                    <div className="text-slate-500">Alamat</div>
                    <div className="text-slate-900">
                      {item.companyAddress || "-"}
                    </div>
                    <div className="text-slate-500">Catatan</div>
                    <div className="text-slate-900">
                      {item.additionalNotes || "-"}
                    </div>
                  </div>
                </div>

                <DocumentsSection item={item} />
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

const DocumentsSection = ({ item }) => {
  const [preview, setPreview] = useState(null);
  const docs = [
    {
      key: "companyProfile",
      title: "Company Profile (Compro)",
      src: "/docs/companyProfile.pdf",
    },
    {
      key: "deedOfEstablishment",
      title: "Akte Pendirian",
      src: "/docs/deedOfEstablishment.pdf",
    },
    { key: "directorId", title: "KTP Direktur", src: "/docs/directorId.pdf" },
    {
      key: "businessId",
      title: "Nomor Induk Berusaha (NIB)",
      src: "/docs/businessId.pdf",
    },
    {
      key: "pkppStatement",
      title: "Surat Pernyataan PKKP",
      src: "/docs/pkppStatement.pdf",
    },
    { key: "taxId", title: "NPWP", src: "/docs/taxId.pdf" },
  ];

  return (
    <div className="p-4 border rounded-lg border-slate-200">
      <h3 className="mb-3 text-base font-semibold text-slate-900">
        Dokumen Terunggah
      </h3>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => (
          <li key={d.key} className="p-3 border rounded-lg border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-900">
                {d.title}
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 text-lg border rounded-lg border-slate-300 hover:bg-slate-50"
                onClick={() => setPreview(d)}
                title={`Lihat ${d.title}`}
              >
                📄
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {item.documents?.[d.key]?.name || `${d.title}.pdf`}
            </div>
          </li>
        ))}
      </ul>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40"
          onClick={() => setPreview(null)}
        >
          <div
            className="h-[70vh] w-full max-w-4xl rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                {preview.title}
              </h3>
              <button
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setPreview(null)}
              >
                Tutup
              </button>
            </div>
            <div className="h-[calc(70vh-64px)] p-0">
              <iframe
                title={preview.key}
                src={preview.src}
                className="w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParticipantDetail;

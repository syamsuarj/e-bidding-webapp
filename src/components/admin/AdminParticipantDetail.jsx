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
    <AdminLayout title="Detail Peserta" breadcrumbs={crumbs} unconstrained>
      <section className="section">
        <div className="card card--autoHeight" data-reveal>
          <div
            className="card__header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                {item ? item.name : "Tidak ditemukan"}
              </h2>
              {item && (
                <p className="text-muted" style={{ marginTop: ".25rem" }}>
                  {item.company}
                </p>
              )}
            </div>
            <a href="/admin/participants" className="btn btn--ghost">
              Kembali
            </a>
          </div>

          {item ? (
            <div className="detail-grid">
              <div className="detail-section">
                <h3>Informasi Dasar</h3>
                <div className="detail-fields">
                  <div className="detail-label">ID</div>
                  <div>{item.id}</div>
                  <div className="detail-label">Nama Lengkap</div>
                  <div>{item.name}</div>
                  <div className="detail-label">Email</div>
                  <div>{item.email}</div>
                  <div className="detail-label">Telepon</div>
                  <div>{item.phone || "-"}</div>
                  <div className="detail-label">Status</div>
                  <div>{item.status}</div>
                  <div className="detail-label">Tanggal Daftar</div>
                  <div>{item.registeredAt}</div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Data Perusahaan</h3>
                <div className="detail-fields">
                  <div className="detail-label">Nama Perusahaan</div>
                  <div>{item.company}</div>
                  <div className="detail-label">Jenis Perusahaan</div>
                  <div>{item.companyType || "-"}</div>
                  <div className="detail-label">Alamat</div>
                  <div>{item.companyAddress || "-"}</div>
                  <div className="detail-label">Catatan</div>
                  <div>{item.additionalNotes || "-"}</div>
                </div>
              </div>

              <DocumentsSection item={item} />
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
    <div className="detail-section">
      <h3>Dokumen Terunggah</h3>
      <ul className="docs-grid">
        {docs.map((d) => (
          <li key={d.key} className="doc-card">
            <div className="doc-title">{d.title}</div>
            <button
              type="button"
              className="doc-icon"
              onClick={() => setPreview(d)}
              title={`Lihat ${d.title}`}
            >
              📄
            </button>
            <div className="doc-meta">
              {item.documents?.[d.key]?.name || `${d.title}.pdf`}
            </div>
          </li>
        ))}
      </ul>

      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{preview.title}</h3>
              <button
                className="btn btn--ghost"
                onClick={() => setPreview(null)}
              >
                Tutup
              </button>
            </div>
            <div className="modal__body" style={{ height: "70vh" }}>
              <iframe
                title={preview.key}
                src={preview.src}
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParticipantDetail;

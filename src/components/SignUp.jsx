import { useMemo, useState } from "react";

const requiredDocuments = [
  {
    key: "companyProfile",
    label: "Company Profile (Compro)",
    description: "Profil ringkas perusahaan dalam format PDF (maks. 10 MB).",
  },
  {
    key: "deedOfEstablishment",
    label: "Akte Pendirian",
    description: "Salinan akte pendirian atau perubahannya yang masih berlaku.",
  },
  {
    key: "directorId",
    label: "KTP Direktur",
    description: "KTP direktur utama atau penanggung jawab perusahaan.",
  },
  {
    key: "businessId",
    label: "Nomor Induk Berusaha (NIB)",
    description: "Dokumen NIB yang diterbitkan OSS.",
  },
  {
    key: "pkppStatement",
    label: "Surat Pernyataan PKKP",
    description:
      "Pernyataan pemenuhan Pedoman Kerja Kepatuhan Perusahaan dan integritas kepatuhan (dapat digabung dengan surat pernyataan umum).",
  },
  {
    key: "taxId",
    label: "NPWP",
    description: "Nomor Pokok Wajib Pajak atas nama perusahaan.",
  },
];

const optionalDocuments = [
  {
    key: "generalStatement",
    label: "Surat Pernyataan Integritas (Opsional)",
    description: "Opsional jika surat pernyataan terpisah dari dokumen PKKP.",
  },
  {
    key: "recommendationLetter",
    label: "Surat Rekomendasiku (Opsional)",
    description: "Rekomendasi dari lembaga/mitra jika tersedia.",
  },
];

const companyTypes = [
  "Produsen",
  "Trading House",
  "Lembaga Keuangan",
  "Badan Usaha Milik Negara",
  "UMKM",
  "Lainnya",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const termsItems = [
  "Data yang diisikan harus sesuai dengan identitas hukum perusahaan dan akan diverifikasi oleh tim bisnis APAS.",
  "Seluruh dokumen wajib harus diunggah dan akan ditinjau maksimal dalam 1 x 24 jam hari kerja.",
  "Apabila ditemukan ketidaksesuaian dokumen, tim bisnis akan menghubungi Anda melalui email terdaftar untuk perbaikan.",
  "Akses penuh ke dashboard e-Bidding hanya diberikan setelah proses due diligence dokumen dinyatakan lengkap.",
  "Pengunggahan dokumen berarti perusahaan menyetujui penggunaan data untuk kepentingan proses lelang PT APN sesuai kebijakan privasi kami.",
];

const generateCaptcha = () => {
  const first = Math.floor(Math.random() * 8) + 3; // 3-10
  const second = Math.floor(Math.random() * 6) + 2; // 2-7
  return {
    first,
    second,
    result: first + second,
  };
};

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  companyAddress: "",
  companyType: "",
  password: "",
  confirmPassword: "",
  captchaAnswer: "",
  acceptTerms: false,
  additionalNotes: "",
};

const buildInitialDocumentState = () => {
  const docState = {};
  [...requiredDocuments, ...optionalDocuments].forEach((doc) => {
    docState[doc.key] = null;
  });
  return docState;
};

const SignUp = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [documents, setDocuments] = useState(buildInitialDocumentState);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);
  const [showTerms, setShowTerms] = useState(false);

  const uploadedRequiredCount = useMemo(
    () =>
      requiredDocuments.reduce((count, doc) => {
        return documents[doc.key] ? count + 1 : count;
      }, 0),
    [documents]
  );

  const uploadedOptionalCount = useMemo(
    () =>
      optionalDocuments.reduce((count, doc) => {
        return documents[doc.key] ? count + 1 : count;
      }, 0),
    [documents]
  );

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDocumentChange = (docKey, fileList) => {
    const file = fileList?.[0] ?? null;

    if (file && file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        documents: `Ukuran ${file.name} melebihi batas 10 MB.`,
      }));
      setDocuments((prev) => ({ ...prev, [docKey]: null }));
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [docKey]: file,
    }));

    setErrors((prev) => ({ ...prev, documents: undefined }));
  };

  const resetForm = () => {
    setFormData({ ...initialFormState });
    setDocuments(buildInitialDocumentState());
    setCaptcha(generateCaptcha());
    setErrors({});
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Nama lengkap wajib diisi.";
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(formData.email)) {
      nextErrors.email = "Masukkan email perusahaan yang valid.";
    }

    if (!/^\+?\d{8,15}$/.test(formData.phone)) {
      nextErrors.phone =
        "Nomor HP harus berisi 8-15 digit, awali dengan kode negara bila perlu.";
    }

    if (!formData.companyName.trim()) {
      nextErrors.companyName = "Nama perusahaan wajib diisi.";
    }

    if (!formData.companyAddress.trim()) {
      nextErrors.companyAddress = "Alamat perusahaan wajib diisi.";
    }

    if (!formData.companyType) {
      nextErrors.companyType = "Pilih jenis perusahaan.";
    }

    if (formData.password.length < 8) {
      nextErrors.password = "Password minimal 8 karakter.";
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Konfirmasi password tidak sama.";
    }

    const captchaAnswer = parseInt(formData.captchaAnswer, 10);
    if (Number.isNaN(captchaAnswer) || captchaAnswer !== captcha.result) {
      nextErrors.captchaAnswer = "Jawaban verifikasi tidak sesuai.";
    }

    if (!formData.acceptTerms) {
      nextErrors.acceptTerms = "Anda harus menyetujui syarat & ketentuan.";
    }

    const missing = requiredDocuments.filter((doc) => !documents[doc.key]);
    if (missing.length > 0) {
      nextErrors.documents = `Unggah dokumen wajib: ${missing
        .map((doc) => doc.label)
        .join(", ")}.`;
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1) Generate new participant ID
      const now = new Date();
      const yyyy = now.getFullYear();
      const seq = Math.floor(Math.random() * 9000) + 1000; // pseudo-seq for demo
      const participantId = `PTC-${yyyy}-${seq}`;

      // 2) Build participant record shape compatible with AdminParticipants
      const participantRecord = {
        id: participantId,
        name: formData.fullName,
        company: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        status: "Menunggu",
        registeredAt: now.toISOString().slice(0, 10),
        // Additional fields for detail page
        companyAddress: formData.companyAddress,
        companyType: formData.companyType,
        additionalNotes: formData.additionalNotes || "",
        documents: Object.keys(documents).reduce((acc, k) => {
          const f = documents[k];
          if (f) acc[k] = { name: f.name, type: f.type, size: f.size };
          return acc;
        }, {}),
      };

      // 3) Persist to participants storage
      const P_STORAGE_KEY = "apas_admin_participants_v1";
      const existingParticipants = (() => {
        try {
          const v = localStorage.getItem(P_STORAGE_KEY);
          return v ? JSON.parse(v) : [];
        } catch {
          return [];
        }
      })();
      localStorage.setItem(
        P_STORAGE_KEY,
        JSON.stringify([participantRecord, ...existingParticipants])
      );

      // 4) Persist to users storage with linkage
      const U_STORAGE_KEY = "apas_admin_users_v1";
      const existingUsers = (() => {
        try {
          const v = localStorage.getItem(U_STORAGE_KEY);
          return v ? JSON.parse(v) : [];
        } catch {
          return [];
        }
      })();
      const linkedUser = {
        id: `USR-${Date.now()}`,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: "seller", // default role for vendor account
        status: "Aktif",
        participantId,
      };
      localStorage.setItem(
        U_STORAGE_KEY,
        JSON.stringify([linkedUser, ...existingUsers])
      );

      // 5) Receipt and reset (dummy flow; file preview uses placeholder on detail page)
      const receiptPayload = {
        applicant: formData.fullName,
        company: formData.companyName,
        email: formData.email,
        submittedAt: new Date().toLocaleString("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
        }),
        reviewSla: "1 x 24 jam",
        uploadedDocs: uploadedRequiredCount + uploadedOptionalCount,
        participantId,
      };
      setSubmissionReceipt(receiptPayload);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowTerms = () => setShowTerms(true);
  const handleHideTerms = () => setShowTerms(false);

  const formatFileName = (file) => {
    if (!file) return "Belum ada file";
    return file.name.length > 28 ? `${file.name.slice(0, 26)}…` : file.name;
  };

  const renderDocumentRow = (doc, optional) => {
    const currentFile = documents[doc.key];
    return (
      <li className="signup__document" key={doc.key} title={doc.description}>
        <div className="signup__document-label">
          <span className="signup__document-name">{doc.label}</span>
          <span
            className={`signup__badge ${
              optional ? "signup__badge--optional" : ""
            }`}
          >
            {optional ? "Opsional" : "Wajib"}
          </span>
        </div>
        <div className="signup__document-controls">
          <label className="signup__upload">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(event) =>
                handleDocumentChange(doc.key, event.target.files)
              }
            />
            <span>{currentFile ? "Ganti File" : "Unggah"}</span>
          </label>
          <small className="signup__upload-file" aria-live="polite">
            {formatFileName(currentFile)}
          </small>
        </div>
      </li>
    );
  };

  const renderReceiptCard = (receipt) => (
    <div className="signup__receipt" role="status">
      <h3>Pengajuan berhasil diterima ✅</h3>
      <p>
        Terima kasih, {receipt.applicant}. Permohonan pendaftaran untuk{" "}
        {receipt.company} telah kami terima pada{" "}
        <strong>{receipt.submittedAt}</strong>.
      </p>
      <ul>
        <li>Akun akan direview dalam waktu {receipt.reviewSla}.</li>
        <li>
          Status awal akun: <strong>Menunggu Verifikasi</strong>.
        </li>
        <li>
          Jika perlu revisi dokumen, tim kami akan mengirim email ke{" "}
          {receipt.email}.
        </li>
        <li>Total dokumen yang diterima: {receipt.uploadedDocs} file.</li>
      </ul>
    </div>
  );

  return (
    <main className="signup signup--page">
      <div className="signup__header">
        <div className="container signup__breadcrumbs">
          <a href="/" className="signup__back-link">
            ← Kembali ke Beranda APAS
          </a>
          <span>Registrasi Vendor</span>
        </div>
      </div>

      <div className="container signup__container">
        <div className="signup__intro">
          <div className="signup__intro-header">
            <h1>Form Registrasi Vendor e-Bidding APAS</h1>
            <p>
              Lengkapi data perusahaan dan unggah minimal enam dokumen wajib.
              Tim bisnis APAS akan meninjau dan mengaktifkan akun Anda maksimal
              dalam 1 x 24 jam hari kerja. Jika ada perbaikan, notifikasi akan
              dikirim ke email yang terdaftar.
            </p>
          </div>
          <ul className="signup__checklist" aria-label="Persyaratan dokumen">
            <li>
              <span>
                {uploadedRequiredCount}/{requiredDocuments.length}
              </span>
              Dokumen wajib telah dipersiapkan
            </li>
            <li>Review kelengkapan dilakukan manual oleh tim bisnis</li>
            <li>Pemberitahuan revisi akan dikirim otomatis via email</li>
          </ul>
          <div className="signup__actions-note">
            Dokumen akan diverifikasi maksimal dalam 1 x 24 jam hari kerja
            sebelum akun aktif.
          </div>
        </div>

        <div className="signup__layout">
          <form className="signup__form" onSubmit={handleSubmit} noValidate>
            <div className="signup__section">
              <h3>Data Pengguna</h3>
              <div className="signup__grid">
                <label className="signup__field">
                  <span>Nama Lengkap</span>
                  <input
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.fullName && <small>{errors.fullName}</small>}
                </label>
                <label className="signup__field">
                  <span>Email Perusahaan</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.email && <small>{errors.email}</small>}
                </label>
                <label className="signup__field">
                  <span>Nomor HP</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="Contoh: +628123456789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.phone && <small>{errors.phone}</small>}
                </label>
              </div>
            </div>

            <div className="signup__section">
              <h3>Data Perusahaan</h3>
              <div className="signup__grid">
                <label className="signup__field">
                  <span>Nama Perusahaan</span>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.companyName && <small>{errors.companyName}</small>}
                </label>
                <label className="signup__field">
                  <span>Jenis Perusahaan</span>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih jenis perusahaan</option>
                    {companyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.companyType && <small>{errors.companyType}</small>}
                </label>
              </div>
              <label className="signup__field">
                <span>Alamat Perusahaan</span>
                <textarea
                  name="companyAddress"
                  rows={3}
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  required
                />
                {errors.companyAddress && (
                  <small>{errors.companyAddress}</small>
                )}
              </label>
              <label className="signup__field">
                <span>Catatan Tambahan (Opsional)</span>
                <textarea
                  name="additionalNotes"
                  rows={2}
                  placeholder="Contoh: Jadwal preferensi onboarding, info PIC cadangan, dsb."
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div className="signup__section">
              <h3>Keamanan Akun</h3>
              <div className="signup__grid">
                <label className="signup__field">
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.password && <small>{errors.password}</small>}
                </label>
                <label className="signup__field">
                  <span>Konfirmasi Password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <small>{errors.confirmPassword}</small>
                  )}
                </label>
              </div>
            </div>

            <div className="signup__section">
              <h3>Verifikasi Captcha</h3>
              <div className="signup__captcha">
                <span>
                  {captcha.first} + {captcha.second} = ?
                </span>
                <input
                  type="number"
                  name="captchaAnswer"
                  value={formData.captchaAnswer}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="signup__captcha-refresh"
                  onClick={() => setCaptcha(generateCaptcha())}
                >
                  Ganti Soal
                </button>
              </div>
              {errors.captchaAnswer && (
                <small className="signup__error">{errors.captchaAnswer}</small>
              )}
            </div>

            <div className="signup__section signup__section--terms">
              <label className="signup__terms">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  required
                />
                <span>
                  Saya telah membaca dan menyetujui{" "}
                  <button
                    type="button"
                    onClick={handleShowTerms}
                    className="signup__terms-link"
                  >
                    Syarat & Ketentuan APAS
                  </button>
                </span>
              </label>
              {errors.acceptTerms && (
                <small className="signup__error">{errors.acceptTerms}</small>
              )}
            </div>

            {errors.documents && (
              <div className="signup__error-block">{errors.documents}</div>
            )}

            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim data…" : "Kirim Pengajuan"}
            </button>
          </form>

          <aside className="signup__documents" aria-label="Unggah dokumen">
            <header className="signup__documents-header">
              <div>
                <h3>Unggah Dokumen Legal</h3>
                <p>Format diizinkan: PDF, JPG, PNG · Maks. 10 MB per file.</p>
              </div>
              <div className="signup__documents-progress" aria-live="polite">
                <span>
                  {uploadedRequiredCount}/{requiredDocuments.length}
                </span>
                <small>Dokumen wajib terunggah</small>
                {optionalDocuments.length > 0 && (
                  <small className="signup__documents-progress-optional">
                    Opsional: {uploadedOptionalCount}/{optionalDocuments.length}
                  </small>
                )}
              </div>
            </header>
            <div className="signup__documents-group" aria-label="Dokumen wajib">
              <h4>Dokumen Wajib</h4>
              <ul className="signup__documents-list signup__documents-list--grid">
                {requiredDocuments.map((doc) => renderDocumentRow(doc, false))}
              </ul>
            </div>
            {optionalDocuments.length > 0 && (
              <details
                className="signup__documents-optional"
                aria-label="Dokumen opsional"
              >
                <summary>
                  <span>Dokumen Opsional</span>
                  <span className="signup__documents-badge">
                    {uploadedOptionalCount}/{optionalDocuments.length}
                  </span>
                </summary>
                <ul className="signup__documents-list signup__documents-list--grid">
                  {optionalDocuments.map((doc) => renderDocumentRow(doc, true))}
                </ul>
              </details>
            )}
            <p className="signup__review-note">
              Setelah dikirim, tim bisnis akan meninjau berkas maksimal 1 x 24
              jam sebelum akun aktif.
            </p>
          </aside>
        </div>

        {submissionReceipt && renderReceiptCard(submissionReceipt)}
      </div>

      <div className="container signup__login" aria-label="Informasi login">
        <h3>Sudah memiliki akun?</h3>
        <p>
          Akses dashboard e-Bidding melalui portal internal APAS. Jika Anda
          mengalami kendala login, hubungi{" "}
          <a href="mailto:support@apas.id">support@apas.id</a> untuk reset
          kredensial.
        </p>
        <small>
          Modul login akan tersinkron dengan SSO internal pada saat peluncuran
          aplikasi.
        </small>
      </div>

      {showTerms && (
        <div
          className="signup__terms-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
        >
          <div className="signup__terms-content">
            <header>
              <h3 id="terms-title">Syarat & Ketentuan Registrasi APAS</h3>
              <button
                type="button"
                onClick={handleHideTerms}
                aria-label="Tutup syarat & ketentuan"
              >
                ×
              </button>
            </header>
            <ol>
              {termsItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
            <footer>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleHideTerms}
              >
                Saya Mengerti
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
};

export default SignUp;

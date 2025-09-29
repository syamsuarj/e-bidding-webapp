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

  const inputClasses =
    "w-full rounded-md border border-primary/20 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
  const textareaClasses =
    "w-full rounded-md border border-primary/20 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
  const errorClasses = "text-xs font-semibold text-red-600";

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
      <li
        className="flex flex-col gap-3 rounded-xl border border-primary/15 bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between"
        key={doc.key}
        title={doc.description}
      >
        <div className="space-y-1 sm:max-w-[60%]">
          <span className="block text-sm font-semibold text-slate-900">
            {doc.label}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              optional
                ? "bg-slate-200 text-slate-700"
                : "bg-primary/15 text-primary"
            }`}
          >
            {optional ? "Opsional" : "Wajib"}
          </span>
        </div>
        <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
          <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary/30 bg-white px-4 py-2 font-semibold text-primary transition hover:bg-primary/5">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(event) =>
                handleDocumentChange(doc.key, event.target.files)
              }
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span>{currentFile ? "Ganti File" : "Unggah"}</span>
          </label>
          <small className="text-xs text-slate-500" aria-live="polite">
            {formatFileName(currentFile)}
          </small>
        </div>
      </li>
    );
  };

  const renderReceiptCard = (receipt) => (
    <div
      className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/20 p-8 shadow-soft"
      role="status"
    >
      <h3 className="text-xl font-semibold text-primary">
        Pengajuan berhasil diterima ✅
      </h3>
      <p className="mt-3 text-sm text-slate-700">
        Terima kasih, {receipt.applicant}. Permohonan pendaftaran untuk{" "}
        {receipt.company} telah kami terima pada{" "}
        <strong>{receipt.submittedAt}</strong>.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
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
    <main className="min-h-screen bg-gradient-to-b from-primary/8 via-background to-background pb-24">
      <header className="border-b border-primary/20 bg-primary/10 py-6">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-sm text-slate-700">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-semibold text-primary transition hover:underline"
          >
            ← Kembali ke Beranda APAS
          </a>
          <span className="inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Registrasi Vendor
          </span>
        </div>
      </header>

      <div className="container space-y-10 py-12">
        <section className="grid gap-6 rounded-3xl border border-primary/15 bg-surface p-8 shadow-soft">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900">
              Form Registrasi Vendor e-Bidding APAS
            </h1>
            <p className="text-base text-slate-600">
              Lengkapi data perusahaan dan unggah minimal enam dokumen wajib.
              Tim bisnis APAS akan meninjau dan mengaktifkan akun Anda maksimal
              dalam 1 x 24 jam hari kerja. Jika ada perbaikan, notifikasi akan
              dikirim ke email yang terdaftar.
            </p>
          </div>
          <ul
            className="grid gap-3 rounded-2xl bg-primary/5 p-5 text-sm text-slate-700 sm:grid-cols-3"
            aria-label="Persyaratan dokumen"
          >
            <li className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white/80 px-4 py-3 font-semibold text-primary">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                {uploadedRequiredCount}/{requiredDocuments.length}
              </span>
              Dokumen wajib telah dipersiapkan
            </li>
            <li className="rounded-xl border border-primary/10 bg-white/70 px-4 py-3">
              Review kelengkapan dilakukan manual oleh tim bisnis
            </li>
            <li className="rounded-xl border border-primary/10 bg-white/70 px-4 py-3">
              Pemberitahuan revisi akan dikirim otomatis via email
            </li>
          </ul>
          <p className="rounded-xl bg-background/80 px-5 py-4 text-sm text-slate-600">
            Dokumen akan diverifikasi maksimal dalam 1 x 24 jam hari kerja
            sebelum akun aktif.
          </p>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          <form
            className="space-y-8 rounded-3xl border border-primary/15 bg-surface p-8 shadow-soft"
            onSubmit={handleSubmit}
            noValidate
          >
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">
                Data Pengguna
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Nama Lengkap</span>
                  <input
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                  {errors.fullName && (
                    <small className={errorClasses}>{errors.fullName}</small>
                  )}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Email Perusahaan</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                  {errors.email && (
                    <small className={errorClasses}>{errors.email}</small>
                  )}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  <span>Nomor HP</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="Contoh: +628123456789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                  {errors.phone && (
                    <small className={errorClasses}>{errors.phone}</small>
                  )}
                </label>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">
                Data Perusahaan
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Nama Perusahaan</span>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                  {errors.companyName && (
                    <small className={errorClasses}>{errors.companyName}</small>
                  )}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Jenis Perusahaan</span>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  >
                    <option value="">Pilih jenis perusahaan</option>
                    {companyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.companyType && (
                    <small className={errorClasses}>{errors.companyType}</small>
                  )}
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Alamat Perusahaan</span>
                <textarea
                  name="companyAddress"
                  rows={3}
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  required
                  className={textareaClasses}
                />
                {errors.companyAddress && (
                  <small className={errorClasses}>
                    {errors.companyAddress}
                  </small>
                )}
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Catatan Tambahan (Opsional)</span>
                <textarea
                  name="additionalNotes"
                  rows={2}
                  placeholder="Contoh: Jadwal preferensi onboarding, info PIC cadangan, dsb."
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  className={textareaClasses}
                />
              </label>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">
                Keamanan Akun
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                  {errors.password && (
                    <small className={errorClasses}>{errors.password}</small>
                  )}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Konfirmasi Password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={inputClasses}
                  />
                  {errors.confirmPassword && (
                    <small className={errorClasses}>
                      {errors.confirmPassword}
                    </small>
                  )}
                </label>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                Verifikasi Captcha
              </h3>
              <div className="flex flex-wrap items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                <span>
                  {captcha.first} + {captcha.second} = ?
                </span>
                <input
                  type="number"
                  name="captchaAnswer"
                  value={formData.captchaAnswer}
                  onChange={handleInputChange}
                  required
                  className="w-24 rounded-md border border-primary/20 bg-white px-3 py-2 text-center text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  className="text-sm font-semibold text-primary underline"
                  onClick={() => setCaptcha(generateCaptcha())}
                >
                  Ganti Soal
                </button>
              </div>
              {errors.captchaAnswer && (
                <small className={errorClasses}>{errors.captchaAnswer}</small>
              )}
            </section>

            <section className="space-y-3">
              <label className="flex items-start gap-3 rounded-xl bg-background/80 p-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary/40"
                />
                <span>
                  Saya telah membaca dan menyetujui{" "}
                  <button
                    type="button"
                    onClick={handleShowTerms}
                    className="font-semibold text-primary underline"
                  >
                    Syarat & Ketentuan APAS
                  </button>
                </span>
              </label>
              {errors.acceptTerms && (
                <small className={errorClasses}>{errors.acceptTerms}</small>
              )}
            </section>

            {errors.documents && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {errors.documents}
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim data…" : "Kirim Pengajuan"}
            </button>
          </form>

          <aside
            className="space-y-6 rounded-3xl border border-primary/15 bg-surface p-6 shadow-soft lg:sticky lg:top-28"
            aria-label="Unggah dokumen"
          >
            <header className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Unggah Dokumen Legal
                  </h3>
                  <p className="text-sm text-slate-600">
                    Format diizinkan: PDF, JPG, PNG · Maks. 10 MB per file.
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 px-4 py-2 text-right">
                  <span className="block text-lg font-bold text-primary">
                    {uploadedRequiredCount}/{requiredDocuments.length}
                  </span>
                  <small className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                    Dokumen wajib
                  </small>
                  {optionalDocuments.length > 0 && (
                    <small className="block text-[11px] text-slate-500">
                      Opsional: {uploadedOptionalCount}/
                      {optionalDocuments.length}
                    </small>
                  )}
                </div>
              </div>
            </header>
            <div className="space-y-3" aria-label="Dokumen wajib">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Dokumen Wajib
              </h4>
              <ul className="grid gap-3">
                {requiredDocuments.map((doc) => renderDocumentRow(doc, false))}
              </ul>
            </div>
            {optionalDocuments.length > 0 && (
              <details
                className="rounded-xl border border-primary/15 bg-background/70 p-4 text-sm text-slate-700"
                aria-label="Dokumen opsional"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-slate-800">
                  <span>Dokumen Opsional</span>
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
                    {uploadedOptionalCount}/{optionalDocuments.length}
                  </span>
                </summary>
                <ul className="mt-3 grid gap-3">
                  {optionalDocuments.map((doc) => renderDocumentRow(doc, true))}
                </ul>
              </details>
            )}
            <p className="rounded-xl bg-background/80 px-4 py-3 text-sm text-slate-600">
              Setelah dikirim, tim bisnis akan meninjau berkas maksimal 1 x 24
              jam sebelum akun aktif.
            </p>
          </aside>
        </div>

        {submissionReceipt && renderReceiptCard(submissionReceipt)}

        <section
          className="rounded-3xl border border-primary/15 bg-surface p-8 shadow-soft"
          aria-label="Informasi login"
        >
          <h3 className="text-xl font-semibold text-slate-900">
            Sudah memiliki akun?
          </h3>
          <p className="mt-3 text-sm text-slate-600">
            Akses dashboard e-Bidding melalui portal internal APAS. Jika Anda
            mengalami kendala login, hubungi{" "}
            <a
              href="mailto:support@apas.id"
              className="font-semibold text-primary hover:underline"
            >
              support@apas.id
            </a>{" "}
            untuk reset kredensial.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Modul login akan tersinkron dengan SSO internal pada saat peluncuran
            aplikasi.
          </p>
        </section>
      </div>

      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
        >
          <div
            className="absolute inset-0 bg-text/60 backdrop-blur-sm"
            onClick={handleHideTerms}
          />
          <div className="relative w-full max-w-2xl space-y-6 rounded-[28px] border border-primary/20 bg-surface p-8 shadow-2xl">
            <header className="flex items-start justify-between gap-4">
              <h3
                id="terms-title"
                className="text-2xl font-bold text-slate-900"
              >
                Syarat & Ketentuan Registrasi APAS
              </h3>
              <button
                type="button"
                onClick={handleHideTerms}
                aria-label="Tutup syarat & ketentuan"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary transition hover:bg-primary/15"
              >
                ×
              </button>
            </header>
            <ol className="space-y-3 list-decimal pl-5 text-sm text-slate-700">
              {termsItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
            <div className="flex justify-end">
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleHideTerms}
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SignUp;

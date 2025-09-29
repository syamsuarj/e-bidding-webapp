import { useEffect, useState } from 'react';

const initialFormState = {
  identifier: '',
  password: '',
  rememberMe: false,
};

const LoginModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.identifier.trim()) {
      nextErrors.identifier = 'Masukkan email atau username.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Masukkan password Anda.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess?.({
        identifier: formData.identifier,
        rememberMe: formData.rememberMe,
      });
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="absolute inset-0 bg-text/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-[28px] border border-primary/20 bg-surface p-8 shadow-2xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Selamat datang kembali</p>
            <h2 className="text-2xl font-bold text-slate-900" id="login-title">
              Masuk ke Akun Vendor
            </h2>
            <p className="text-sm text-slate-600">
              Gunakan kredensial registrasi Anda untuk mengakses dashboard e-Bidding dan mulai mengikuti lelang.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary transition hover:bg-primary/15"
            onClick={onClose}
            aria-label="Tutup form login"
          >
            ×
          </button>
        </header>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Email atau Username</span>
            <input
              type="text"
              name="identifier"
              autoComplete="username"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-primary/20 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.identifier && <small className="text-xs font-semibold text-red-600">{errors.identifier}</small>}
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-primary/20 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.password && <small className="text-xs font-semibold text-red-600">{errors.password}</small>}
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="inline-flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary/40"
              />
              <span>Ingat saya di perangkat ini</span>
            </label>
            <button type="button" className="font-semibold text-primary hover:underline">
              Lupa password?
            </button>
          </div>

          <button type="submit" className="btn btn--primary w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses…' : 'Masuk'}
          </button>
        </form>

        <footer className="mt-6 text-center text-sm text-slate-600">
          <p>
            Belum punya akun?{' '}
            <a href="#/signup" className="font-semibold text-primary hover:underline">
              Registrasi Vendor
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginModal;

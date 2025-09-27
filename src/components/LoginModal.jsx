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
    <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div className="login-modal__backdrop" onClick={onClose} />
      <div className="login-modal__content">
        <header className="login-modal__header">
          <div>
            <p className="login-modal__pretitle">Selamat datang kembali</p>
            <h2 id="login-title">Masuk ke Akun Vendor</h2>
            <p className="login-modal__subtitle">
              Gunakan kredensial registrasi Anda untuk mengakses dashboard e-Bidding dan mulai mengikuti lelang.
            </p>
          </div>
          <button type="button" className="login-modal__close" onClick={onClose} aria-label="Tutup form login">
            ×
          </button>
        </header>

        <form className="login-modal__form" onSubmit={handleSubmit} noValidate>
          <label className="login-modal__field">
            <span>Email atau Username</span>
            <input
              type="text"
              name="identifier"
              autoComplete="username"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
            {errors.identifier && <small>{errors.identifier}</small>}
          </label>

          <label className="login-modal__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <small>{errors.password}</small>}
          </label>

          <div className="login-modal__extras">
            <label className="login-modal__remember">
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
              <span>Ingat saya di perangkat ini</span>
            </label>
            <button type="button" className="login-modal__link">
              Lupa password?
            </button>
          </div>

          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses…' : 'Masuk' }
          </button>
        </form>

        <footer className="login-modal__footer">
          <p>
            Belum punya akun? <a href="#/signup">Registrasi Vendor</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginModal;

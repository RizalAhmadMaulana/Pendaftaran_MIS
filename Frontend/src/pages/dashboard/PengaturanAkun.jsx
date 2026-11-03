import { useState } from 'react';
import { FaLock, FaKey, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function PengaturanAkun() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setNotification({ type: 'error', message: 'Semua kolom kata sandi wajib diisi.' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setNotification({ type: 'error', message: 'Kata sandi baru minimal harus 6 karakter.' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({ type: 'error', message: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    // Success simulation
    setNotification({
      type: 'success',
      message: 'Kata sandi berhasil diperbarui! Gunakan kata sandi baru untuk login selanjutnya.',
    });
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pengaturan Akun</h1>
        <p className="text-sm text-gray-600 mt-1">
          Kelola keamanan kata sandi akun pendaftar Mentari Islamic School.
        </p>
      </div>

      <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">
            <FaLock />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Perbarui Kata Sandi</h2>
            <p className="text-xs text-gray-500">Gunakan kombinasi kata sandi yang kuat dan aman</p>
          </div>
        </div>

        {/* Feedback Alert */}
        {notification && (
          <div
            className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <FaCheckCircle className="text-secondary text-base shrink-0 mt-0.5" />
            ) : (
              <FaExclamationCircle className="text-red-500 text-base shrink-0 mt-0.5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Kata Sandi Lama <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Masukkan kata sandi lama"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Kata Sandi Baru <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <FaKey className="text-xs" />
              <span>Simpan Kata Sandi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


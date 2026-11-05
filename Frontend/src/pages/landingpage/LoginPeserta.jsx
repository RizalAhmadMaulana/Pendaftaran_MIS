import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import {
  FaKey, FaSearch, FaCheckCircle, FaArrowLeft, FaBuilding,
  FaPhoneAlt, FaInfoCircle, FaCalendarAlt, FaIdCard, FaSignInAlt,
  FaEye, FaEyeSlash
} from 'react-icons/fa';

export default function LoginPeserta({ defaultTab: propDefaultTab }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Tentukan tab aktif dari URL query ?tab=status / ?tab=login atau path /pengumuman
  const initialTab =
    propDefaultTab ||
    searchParams.get('tab') ||
    (location.pathname === '/pengumuman' ? 'status' : 'login');

  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'status'

  // Sinkronkan jika query param berubah
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'status' || tabParam === 'login') {
      setActiveTab(tabParam);
    } else if (location.pathname === '/pengumuman') {
      setActiveTab('status');
    }
  }, [searchParams, location.pathname]);

  // Form State Login
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Form State Cek Status
  const [statusForm, setStatusForm] = useState({
    noPendaftaran: '',
    tanggalLahir: '',
  });

  // Demo status result
  const [statusResult, setStatusResult] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setStatusResult(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${getBaseApiUrl()}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.identifier,
          password: loginForm.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_role', data.role || 'siswa');
        localStorage.setItem('user_name', data.name || data.username || '');
        if (data.role === 'admin') {
          navigate('/admin-portal');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Nomor Registrasi atau Password salah!');
      }
    } catch (error) {
      alert('Koneksi ke server gagal.');
    }
  };


  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!statusForm.noPendaftaran) {
      alert('Mohon masukkan nomor pendaftaran.');
      return;
    }

    // Simulasi hasil pengecekan status
    setStatusResult({
      noPendaftaran: statusForm.noPendaftaran.toUpperCase(),
      namaSiswa: 'Ahmad Zaki Mubarok',
      unit: 'SD Mentari Islamic School Klaten',
      tanggalDaftar: '12 Oktober 2026',
      status: 'Lolos Verifikasi Berkas (Gelombang 1)',
      tahapBerikutnya: 'Tes Observasi & Pemetaan Karakter Qurani (Jadwal menyusul via WhatsApp)',
      statusTagihan: 'Lunas / Terverifikasi',
    });
  };

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 flex items-center justify-center relative bg-slate-100"
      style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* Ambient background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-emerald-200/30 blur-3xl rounded-full pointer-events-none -z-0"></div>

      {/* ==============================================================
          THE COMPACT FLOATING CARD (Persis Referensi Gambar)
          ============================================================== */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-950/20 border border-emerald-100/90 overflow-hidden flex flex-col md:flex-row w-full max-w-4xl relative z-10">

        {/* PANEL KIRI (HIJAU EMERALD - IDENTITAS PORTAL) */}
        <div className="md:w-5/12 bg-gradient-to-br from-emerald-950 via-primary to-emerald-800 text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-xl pointer-events-none -ml-16 -mb-16"></div>

          <div className="relative z-10 space-y-6">
            {/* Header Brand */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                <FaBuilding className="text-secondary text-xl" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-emerald-300 leading-tight">
                  PKBM MENTARI KAYAARTA
                </h2>
                <p className="text-[11px] font-semibold text-emerald-100">
                  Mentari Islamic School Klaten
                </p>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-tight mb-3">
                Selamat Datang di Portal Pendaftaran
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                Sistem pendaftaran dan penerimaan siswa baru terpadu untuk seluruh unit pendidikan di Mentari Islamic School Klaten.
              </p>
            </div>

            {/* Checklist */}
            <ul className="space-y-3.5 pt-1">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-secondary text-xs" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-emerald-50">
                  Pendaftaran Online Mudah
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-secondary text-xs" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-emerald-50">
                  Verifikasi Cepat & Tepat
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-secondary text-xs" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-emerald-50">
                  Notifikasi WhatsApp Otomatis
                </span>
              </li>
            </ul>
          </div>

          {/* Bottom Link ke Beranda */}
          <div className="pt-6 relative z-10 border-t border-emerald-800/60 mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-200 hover:text-white transition-colors"
            >
              <FaArrowLeft className="text-[10px]" /> Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* PANEL KANAN (PUTIH - TAB SWITCHER & FORMULIR) */}
        <div className="md:w-7/12 bg-white p-7 sm:p-9 flex flex-col justify-between">
          
          <div>
            {/* TOP TAB SWITCHER (Center di tengah) */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-gray-200/70 shadow-2xs">
                {/* Tab 1: Login Portal Siswa */}
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-emerald-700 to-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-emerald-800 hover:bg-slate-200/60'
                  }`}
                >
                  <FaKey className="text-xs" />
                  <span>Login Portal Siswa</span>
                </button>

                {/* Tab 2: Cek Status */}
                <button
                  type="button"
                  onClick={() => handleTabChange('status')}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'status'
                      ? 'bg-gradient-to-r from-emerald-700 to-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-emerald-800 hover:bg-slate-200/60'
                  }`}
                >
                  <FaSearch className="text-xs" />
                  <span>Cek Status</span>
                </button>
              </div>
            </div>

            {/* ==============================================================
                TAB 1 CONTENT: LOGIN CALON SISWA
                ============================================================== */}
            {activeTab === 'login' && (
              <div className="animate-in fade-in duration-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Login Calon Siswa
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Masuk untuk mengisi formulir pendaftaran setelah pembayaran Anda diverifikasi.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* No. Registrasi */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      No. Registrasi / Username
                    </label>
                    <input
                      type="text"
                      name="identifier"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      required
                      placeholder="Contoh: MIS-2026-xxxx"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Password (NIK Siswa)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        placeholder="Masukkan NIK calon siswa"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-emerald-700 transition-colors cursor-pointer"
                        title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                        aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-base" />
                        ) : (
                          <FaEye className="text-base" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 via-primary to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-900/15 hover:shadow-lg transition-all cursor-pointer mt-4"
                  >
                    Masuk ke Portal
                  </button>
                </form>
              </div>
            )}

            {/* ==============================================================
                TAB 2 CONTENT: CEK STATUS PENDAFTARAN
                ============================================================== */}
            {activeTab === 'status' && (
              <div className="animate-in fade-in duration-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Cek Status Pendaftaran
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Masukkan nomor pendaftaran Anda untuk melihat progres verifikasi dan hasil seleksi.
                  </p>
                </div>

                <form onSubmit={handleStatusSubmit} className="space-y-4">
                  {/* Nomor Pendaftaran */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nomor Pendaftaran <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700">
                        <FaIdCard />
                      </div>
                      <input
                        type="text"
                        value={statusForm.noPendaftaran}
                        onChange={(e) => setStatusForm({ ...statusForm, noPendaftaran: e.target.value })}
                        required
                        placeholder="Contoh: MIS-2026-0012"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-gray-900 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Tanggal Lahir Calon Siswa */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Tanggal Lahir Calon Siswa (Opsional / Verifikasi)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={statusForm.tanggalLahir}
                        onChange={(e) => setStatusForm({ ...statusForm, tanggalLahir: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 via-primary to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-900/15 hover:shadow-lg transition-all cursor-pointer mt-2"
                  >
                    Cek Status Pendaftaran
                  </button>
                </form>

                {/* Status Result Preview Box */}
                {statusResult && (
                  <div className="mt-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 animate-in zoom-in-95 duration-200 text-left space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                      <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                        Hasil Pengecekan
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {statusResult.noPendaftaran}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 pt-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nama Calon Siswa:</span>
                        <span className="font-bold text-gray-900">{statusResult.namaSiswa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Unit Pendidikan:</span>
                        <span className="font-semibold text-gray-800">{statusResult.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status Seleksi:</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <FaCheckCircle className="text-xs" /> {statusResult.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pembayaran Tagihan:</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded text-[11px]">
                          {statusResult.statusTagihan}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-100 mt-2 text-[11px] text-gray-600 flex items-start gap-2">
                      <FaInfoCircle className="text-secondary shrink-0 mt-0.5" />
                      <span>{statusResult.tahapBerikutnya}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FOOTER LINK BAWAH (Belum Mendaftar?) */}
          <div className="pt-6 border-t border-gray-100 text-center mt-6">
            <p className="text-xs text-gray-500">
              {activeTab === 'login' ? (
                <>
                  Belum mendaftar?{' '}
                  <Link to="/#unit" className="font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500 underline-offset-2">
                    Daftar Akun Baru
                  </Link>
                </>
              ) : (
                <>
                  Belum memiliki nomor pendaftaran?{' '}
                  <Link to="/#unit" className="font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500 underline-offset-2">
                    Pilih Unit & Daftar Sekarang
                  </Link>
                </>
              )}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

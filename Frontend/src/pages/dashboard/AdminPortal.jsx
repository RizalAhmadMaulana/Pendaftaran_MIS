import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSchool, FaSignOutAlt, FaExternalLinkAlt, FaCheckCircle,
  FaTimesCircle, FaCalendarAlt, FaMoneyBillWave, FaShieldAlt
} from 'react-icons/fa';

export default function AdminPortal() {
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminName = localStorage.getItem('user_name') || 'Administrator PPDB';

  useEffect(() => {
    fetch(`${getBaseApiUrl()}/units/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUnits(data);
      })
      .catch(err => console.error('Error fetching units for admin:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      {/* Top Navbar */}
      <header className="bg-emerald-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white text-xl">
              <FaShieldAlt />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-emerald-100">Portal Admin PPDB</h1>
              <p className="text-xs text-emerald-400">Mentari Islamic School Klaten</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-emerald-300">Login sebagai:</p>
              <p className="text-sm font-bold text-white">{adminName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaSignOutAlt /> Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Banner with Quick Link to Django Admin */}
        <div className="bg-gradient-to-r from-emerald-800 to-primary text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-emerald-100 px-3 py-1 rounded-full">
              Sistem Manajemen PPDB & SNAP BI BRI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Dashboard Kontrol Administrator
            </h2>
            <p className="text-sm text-emerald-200 max-w-2xl">
              Kelola status penerimaan peserta, multi-gelombang pendaftaran, pengaturan biaya registrasi, serta konfigurasi SNAP BI API BRI secara menyeluruh melalui Django Admin.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={`${getBackendOrigin()}/admin/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-green-400 text-primary font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition-all text-sm"
            >
              Buka Django Admin <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>

        {/* Units & Waves Status Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FaSchool className="text-emerald-700" /> Status Unit Pendidikan & Gelombang
              </h3>
              <p className="text-xs text-gray-500">
                Data real-time yang tersinkronisasi langsung dengan formulir pendaftaran dan landing page.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg self-start sm:self-center">
              Total {units.length} Unit Terdaftar
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">Memuat data unit pendidikan...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase font-extrabold text-gray-500 bg-slate-50">
                    <th className="py-3 px-4">Kode</th>
                    <th className="py-3 px-4">Nama Unit</th>
                    <th className="py-3 px-4">Status Unit</th>
                    <th className="py-3 px-4">Gelombang Aktif</th>
                    <th className="py-3 px-4">Masa Pendaftaran</th>
                    <th className="py-3 px-4 text-right">Biaya Registrasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-xs uppercase text-emerald-800">
                        {unit.kode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {unit.nama}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          unit.is_open ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {unit.is_open ? <FaCheckCircle className="text-[11px]" /> : <FaTimesCircle className="text-[11px]" />}
                          {unit.is_open ? 'Buka' : 'Tutup'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-gray-700">
                        {unit.nama_gelombang_aktif || '-'}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-gray-400 text-[10px]" />
                          {unit.masa_pendaftaran_teks || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                        {unit.biaya_aktif ? `Rp ${unit.biaya_aktif.toLocaleString('id-ID')}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


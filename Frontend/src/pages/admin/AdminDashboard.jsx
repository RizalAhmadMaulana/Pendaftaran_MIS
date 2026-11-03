import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaSchool,
  FaArrowRight,
  FaSyncAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('http://localhost:8000/api/admin/stats/');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary via-emerald-800 to-emerald-950 text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-emerald-700/50">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 bg-white/10 px-3 py-1 rounded-full inline-block mb-2">
            PANEL OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Dashboard Statistik PPDB
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
            Pantau arus pendaftaran santri baru, status transaksi keuangan, dan rekapitulasi 6 unit pendidikan secara *real-time*.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl backdrop-blur-xs border border-white/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <FaSyncAlt className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Memperbarui...' : 'Refresh Data'}</span>
          </button>
          <Link
            to="/admin-portal/pendaftar"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-emerald-400 text-primary font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <span>Kelola Pendaftar</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>

      {/* Grid 4 Kartu Ringkasan Atas dengan Warna & Gradien Menarik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Pendaftar */}
        <div className="bg-gradient-to-br from-[#1B4332] via-[#245942] to-[#122c21] rounded-2xl p-5 text-white shadow-lg shadow-emerald-950/20 border border-emerald-600/30 relative overflow-hidden group hover:scale-[1.02] transition-all">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full blur-sm group-hover:scale-125 transition-transform" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Total Pendaftar
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mt-1.5 font-mono tracking-tight">
                {loading ? '...' : (stats?.total_pendaftar ?? 0)}
              </h3>
              <p className="text-[11px] text-emerald-100/90 font-medium mt-1">
                Calon peserta terdaftar
              </p>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md text-emerald-200 border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
              <FaUsers />
            </div>
          </div>
        </div>

        {/* Card 2: Tagihan Lunas */}
        <div className="bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-2xl p-5 text-white shadow-lg shadow-emerald-700/20 border border-emerald-400/30 relative overflow-hidden group hover:scale-[1.02] transition-all">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-sm group-hover:scale-125 transition-transform" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-100">
                Tagihan Lunas
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mt-1.5 font-mono tracking-tight">
                {loading ? '...' : (stats?.total_lunas ?? 0)}
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium mt-1">
                Status pembayaran PAID
              </p>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        {/* Card 3: Menunggu Pembayaran */}
        <div className="bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] rounded-2xl p-5 text-white shadow-lg shadow-amber-600/20 border border-amber-400/30 relative overflow-hidden group hover:scale-[1.02] transition-all">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-sm group-hover:scale-125 transition-transform" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-100">
                Menunggu Bayar
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mt-1.5 font-mono tracking-tight">
                {loading ? '...' : (stats?.menunggu_pembayaran ?? 0)}
              </h3>
              <p className="text-[11px] text-amber-100 font-medium mt-1">
                Status UNPAID / PENDING
              </p>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md text-amber-100 border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
              <FaClock />
            </div>
          </div>
        </div>

        {/* Card 4: Perlu Verifikasi Berkas */}
        <div className="bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#3730A3] rounded-2xl p-5 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30 relative overflow-hidden group hover:scale-[1.02] transition-all">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-sm group-hover:scale-125 transition-transform" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-100">
                Verifikasi Berkas
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mt-1.5 font-mono tracking-tight">
                {loading ? '...' : (stats?.verifikasi_berkas ?? 0)}
              </h3>
              <p className="text-[11px] text-indigo-100 font-medium mt-1">
                Perlu ditinjau panitia
              </p>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md text-indigo-100 border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
              <FaFileAlt />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Rekapitulasi per Unit Pendidikan Gaya Tahfidz_MIS */}
      <div className="bg-white rounded-[8px] p-4 md:p-6 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2.5">
              <FaSchool className="text-[#2ECC71] text-2xl" />
              <span>Rekapitulasi 6 Unit Pendidikan</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Distribusi pendaftar, gelombang aktif yang berlaku, serta status buka/tutup pendaftaran pada tiap jenjang.
            </p>
          </div>
          <Link
            to="/admin-portal/unit"
            className="text-xs font-bold text-white bg-primary hover:bg-emerald-900 border border-emerald-800 px-3.5 py-2 rounded-[6px] shadow-xs transition-all inline-flex items-center gap-1.5 self-start sm:self-center"
          >
            <span>Atur Unit & Gelombang</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm font-bold text-gray-400 animate-pulse">
            Memuat data rekapitulasi unit pendidikan...
          </div>
        ) : (
          <div className="border border-black rounded-[4px] overflow-x-auto bg-white custom-scrollbar">
            <table className="w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-white">
                  <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">#</th>
                  <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Jenjang / Kode</th>
                  <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Nama Unit Pendidikan</th>
                  <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Jumlah Pendaftar</th>
                  <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Gelombang Aktif</th>
                  <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Biaya Registrasi</th>
                  <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Status Pendaftaran</th>
                  <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {stats?.unit_rekap?.map((unit, idx) => (
                  <tr key={unit.id} className="even:bg-[#f2f2f2] hover:bg-slate-100 transition-colors">
                    <td className="border border-black px-3 py-2.5 text-center font-medium">
                      {idx + 1}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center font-mono font-bold text-xs uppercase text-emerald-800">
                      <span className="bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-sm font-bold">
                        {unit.kode}
                      </span>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-left font-bold text-gray-900">
                      {unit.nama}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center font-mono font-bold text-gray-900">
                      <span className="bg-slate-100 border border-gray-300 text-gray-800 px-3 py-1 rounded-sm text-xs font-black">
                        {unit.total_pendaftar} Siswa
                      </span>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center text-xs font-medium text-gray-700">
                      <span className="inline-flex items-center gap-1.5 font-bold">
                        <FaCalendarAlt className="text-emerald-600 text-[11px]" />
                        {unit.nama_gelombang_aktif}
                      </span>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-right font-mono font-bold text-emerald-800">
                      {unit.biaya_aktif ? `Rp ${unit.biaya_aktif.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-sm ${
                          unit.is_open
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {unit.is_open ? <FaCheck className="text-[9px]" /> : <FaTimes className="text-[9px]" />}
                        {unit.is_open ? 'Buka' : 'Tutup'}
                      </span>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center">
                      <Link
                        to={`/admin-portal/unit?kode=${unit.kode}`}
                        className="bg-[#5294A9] hover:bg-[#437d90] text-white py-1 px-3 rounded-[4px] text-xs font-semibold inline-flex items-center gap-1 transition-all shadow-xs"
                      >
                        Kelola
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


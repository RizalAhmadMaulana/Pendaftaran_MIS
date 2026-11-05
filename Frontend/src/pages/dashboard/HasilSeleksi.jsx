import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHourglassHalf,
  FaTrophy,
  FaCheckCircle,
  FaInfoCircle,
  FaSpinner,
  FaIdBadge,
  FaAward,
  FaPhoneAlt,
  FaCheck
} from 'react-icons/fa';

export default function HasilSeleksi() {
  const navigate = useNavigate();
  const [dataSiswa, setDataSiswa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch(`${getBaseApiUrl()}/dashboard-data/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          setDataSiswa(result);
          if (result.nama_lengkap) {
            localStorage.setItem('user_name', result.nama_lengkap);
            window.dispatchEvent(new Event('user_profile_updated'));
          }
        } else {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-500 font-semibold flex flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-secondary text-3xl" />
        <span className="text-sm font-medium">Memuat pengumuman hasil seleksi...</span>
      </div>
    );
  }

  if (!dataSiswa) return null;

  const isLulus = dataSiswa.status_seleksi?.toUpperCase() === 'LULUS';
  const isTidakLulus = dataSiswa.status_seleksi?.toUpperCase() === 'TIDAK LULUS';

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
          <FaAward className="text-secondary text-2xl" />
          Hasil Keputusan Seleksi Masuk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Surat penetapan resmi penerimaan santri baru Mentari Islamic School Klaten Tahun Ajaran 2026/2027
        </p>
      </div>

      {/* Main Announcement Card Container */}
      <div className="max-w-3xl mx-auto">
        {!isLulus && !isTidakLulus ? (
          /* ==============================================================
             KONDISI 1: TAHAP PENILAIAN / MENUNGGU PENGUMUMAN
             ============================================================== */
          <div className="bg-white rounded-[10px] p-8 sm:p-12 text-center border-t-[5px] border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200 space-y-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white flex items-center justify-center text-4xl mx-auto shadow-lg shadow-amber-500/30 animate-pulse">
                <FaHourglassHalf />
              </div>
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                Status: Menunggu Pengumuman
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Tahap Penilaian Sedang Berlangsung
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Hasil observasi dan wawancara untuk ananda <strong className="text-slate-900">{dataSiswa.nama_lengkap}</strong> sedang dalam tahap rekapitulasi akhir oleh Dewan Penguji Seleksi PPDB.
              </p>
            </div>

            {/* Candidate Summary Box */}
            <div className="bg-gradient-to-br from-slate-50 to-amber-50/40 rounded-xl p-5 border border-slate-200 text-xs sm:text-sm text-slate-700 grid grid-cols-2 gap-4 text-left max-w-lg mx-auto shadow-2xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">No. Registrasi</span>
                <span className="font-black font-mono text-slate-900 text-sm">{dataSiswa.no_registrasi}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Jenjang Unit</span>
                <span className="font-black text-emerald-800 uppercase text-sm">{dataSiswa.unit || '-'}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Nama Calon Santri</span>
                <span className="font-black text-slate-900 text-sm">{dataSiswa.nama_lengkap}</span>
              </div>
            </div>

            <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5 max-w-lg mx-auto">
              <p className="font-black flex items-center gap-1.5 text-amber-950">
                <FaInfoCircle className="text-amber-600" />
                Informasi untuk Orang Tua / Wali Santri:
              </p>
              <p className="leading-relaxed">
                Pengumuman resmi kelulusan akan diumumkan sesuai jadwal gelombang pendaftaran. Pemberitahuan kelulusan juga akan dikirimkan melalui WhatsApp resmi ke nomor wali santri.
              </p>
            </div>
          </div>
        ) : isLulus ? (
          /* ==============================================================
             KONDISI 2: DINYATAKAN LULUS (MURNI CARD TANPA TOMBOL)
             ============================================================== */
          <div className="relative overflow-hidden bg-white rounded-[10px] p-8 sm:p-12 text-center border-t-[6px] border-[#2ECC71] shadow-[0_4px_20px_rgba(0,0,0,0.07)] border-x border-b border-slate-200 space-y-6">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 via-[#2ECC71] to-teal-600 text-white flex items-center justify-center text-5xl mx-auto shadow-xl shadow-emerald-600/30">
              <FaTrophy />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                <FaCheckCircle className="text-emerald-700" />
                Dinyatakan Lulus Seleksi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Selamat! Ananda {dataSiswa.nama_lengkap}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                Alhamdulillah, ananda dinyatakan <strong>LULUS & DITERIMA</strong> sebagai calon santri baru di <strong>Unit {dataSiswa.unit?.toUpperCase()} Mentari Islamic School Klaten</strong> Tahun Ajaran 2026/2027.
              </p>
            </div>

            {/* Candidate Summary Card (Executive Box) */}
            <div className="relative z-10 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 rounded-2xl p-5 border border-emerald-200 text-xs sm:text-sm text-slate-800 grid grid-cols-2 gap-4 text-left max-w-lg mx-auto shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 block uppercase">No. Registrasi</span>
                <span className="font-black font-mono text-slate-950 text-base">{dataSiswa.no_registrasi}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-800 block uppercase">Unit Pendidikan</span>
                <span className="font-black text-emerald-950 uppercase text-base">{dataSiswa.unit || '-'}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-emerald-200/80">
                <span className="text-[11px] font-bold text-emerald-800 block uppercase">Nama Lengkap Santri</span>
                <span className="font-black text-slate-950 text-base">{dataSiswa.nama_lengkap}</span>
              </div>
            </div>

            {/* Informasi Resmi Pasca Kelulusan (Murni Informasi Saja Tanpa Tombol) */}
            <div className="relative z-10 bg-slate-50 rounded-xl p-5 border border-slate-200 text-left text-xs sm:text-sm text-slate-600 space-y-2 max-w-lg mx-auto">
              <p className="font-black text-slate-900 flex items-center gap-1.5">
                <FaCheck className="text-secondary" />
                Langkah Informasi Selanjutnya:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-600 text-xs leading-relaxed">
                <li>Panitia PPDB akan menghubungi nomor WhatsApp wali santri terkait petunjuk teknis kegiatan orientasi dan seragam.</li>
                <li>Seluruh berkas pendaftaran calon santri telah terverifikasi resmi di pangkalan data Mentari Islamic School.</li>
                <li>Simpan nomor registrasi dan data login portal santri ini untuk kebutuhan arsip dan administrasi akademik.</li>
              </ul>
            </div>
          </div>
        ) : (
          /* ==============================================================
             KONDISI 3: TIDAK LULUS
             ============================================================== */
          <div className="bg-white rounded-[10px] p-8 sm:p-12 text-center border-t-[5px] border-rose-500 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center text-4xl mx-auto shadow-inner">
              <FaInfoCircle />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                Hasil Seleksi: Belum Memenuhi Kriteria
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Mohon Maaf, Belum Lolos Seleksi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Terima kasih atas partisipasi ananda <strong>{dataSiswa.nama_lengkap}</strong> dalam seleksi masuk Mentari Islamic School. Mohon maaf pada periode ini ananda belum dapat diterima karena keterbatasan kuota kelas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

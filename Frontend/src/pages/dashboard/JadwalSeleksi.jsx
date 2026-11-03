import { useState, useEffect } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPrint,
  FaInfoCircle,
  FaUserCheck,
  FaBookOpen,
  FaSpinner,
  FaCalendarTimes,
  FaGraduationCap,
  FaIdCard,
  FaPhoneAlt,
  FaCheckCircle
} from 'react-icons/fa';

export default function JadwalSeleksi() {
  const [jadwalList, setJadwalList] = useState([]);
  const [dataSiswa, setDataSiswa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        // Fetch Jadwal Seleksi
        const resJadwal = await fetch('http://localhost:8000/api/jadwal/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resJadwal.ok) {
          const list = await resJadwal.json();
          setJadwalList(Array.isArray(list) ? list : []);
        }

        // Fetch Data Siswa Profil
        const resSiswa = await fetch('http://localhost:8000/api/dashboard-data/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resSiswa.ok) {
          const profile = await resSiswa.json();
          setDataSiswa(profile);
          if (profile.nama_lengkap) {
            localStorage.setItem('user_name', profile.nama_lengkap);
            window.dispatchEvent(new Event('user_profile_updated'));
          }
        }
      } catch (err) {
        console.error('Error fetching data jadwal & siswa:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrintCard = () => {
    window.print();
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const safeDateStr = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
      const d = new Date(safeDateStr);
      if (isNaN(d.getTime())) return dateStr;

      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatHari = (dateStr) => {
    if (!dateStr) return '';
    try {
      const safeDateStr = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
      const d = new Date(safeDateStr);
      if (isNaN(d.getTime())) return '';

      return d.toLocaleDateString('id-ID', { weekday: 'long' });
    } catch {
      return '';
    }
  };

  const formatWaktu = (mulai, selesai) => {
    if (!mulai) return '-';
    const sMulai = mulai.slice(0, 5);
    const sSelesai = selesai ? selesai.slice(0, 5) : '';
    return sSelesai ? `${sMulai} - ${sSelesai} WIB` : `${sMulai} WIB`;
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-500 font-semibold flex flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-secondary text-3xl" />
        <span className="text-sm font-medium">Memuat data jadwal seleksi...</span>
      </div>
    );
  }

  const activeJadwal = jadwalList.length > 0 ? jadwalList[0] : null;
  const unitLabel = dataSiswa?.unit ? dataSiswa.unit.toUpperCase() : 'SEKOLAH';

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <FaCalendarAlt className="text-secondary text-2xl" />
            Jadwal Seleksi & Ujian Masuk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Informasi waktu observasi, tes pemetaan kemampuan Al-Qur'an, dan cetak kartu ujian peserta unit {unitLabel}
          </p>
        </div>

        {activeJadwal && (
          <button
            onClick={handlePrintCard}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <FaPrint />
            <span>Cetak Kartu Ujian</span>
          </button>
        )}
      </div>

      {/* Alert Informasi Panduan */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <FaInfoCircle className="text-secondary text-xl shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-emerald-950">
            Panduan Mengikuti Seleksi Masuk
          </p>
          <p className="text-emerald-800 mt-1 leading-relaxed">
            Jadwal seleksi ini disinkronkan secara langsung dari sistem panitia PPDB sesuai unit pendaftaran ({unitLabel}). Calon santri diharapkan hadir 30 menit sebelum sesi dimulai, mengenakan pakaian muslim/muslimah yang sopan dan rapi, serta membawa kartu ujian fisik.
          </p>
        </div>
      </div>

      {/* ==============================================================
          KONDISI 1: JADWAL BELUM DITAMBAHKAN OLEH ADMIN
          ============================================================== */}
      {!activeJadwal ? (
        <div className="bg-white rounded-[10px] p-8 sm:p-12 text-center border-t-[5px] border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200 space-y-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 text-3xl mx-auto shadow-inner">
            <FaCalendarTimes />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Status Agenda: Belum Terjadwal
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              Jadwal Seleksi Belum Ditambahkan
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Panitia PPDB belum merilis jadwal sesi seleksi untuk <strong>Unit {unitLabel}</strong> pada gelombang pendaftaran Anda. Informasi tanggal pelaksanaan observasi, waktu tes, dan lokasi kampus akan otomatis muncul di halaman ini setelah ditetapkan oleh admin.
            </p>
          </div>

          {/* Ringkasan Akun Santri Tetap Sah & Aman */}
          {dataSiswa && (
            <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2">
              <div className="font-bold text-slate-700 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>Data Pendaftaran Santri:</span>
                <span className="text-emerald-700 font-extrabold">Terdaftar Sah ✓</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nomor Registrasi:</span>
                  <span className="font-mono font-bold text-slate-800">{dataSiswa.no_registrasi}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Unit Pilihan:</span>
                  <span className="font-bold text-slate-800 uppercase">{dataSiswa.unit}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Nama Lengkap:</span>
                  <span className="font-bold text-slate-800">{dataSiswa.nama_lengkap}</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <p className="text-xs text-slate-400 italic">
              * Silakan cek portal ini secara berkala atau hubungi Customer Service PPDB jika membutuhkan informasi lebih lanjut.
            </p>
          </div>
        </div>
      ) : (
        /* KONDISI 2: JADWAL AKTIF TERJADWAL RESMI DARI DATABASE ADMIN */
        <div className="space-y-6">
          {/* Card Detail Jadwal Resmi (Gaya Tahfidz_MIS) */}
          <div className="bg-white rounded-[10px] p-6 sm:p-8 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xl font-bold shadow-xs">
                  <FaCalendarAlt />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Agenda Tes Seleksi & Observasi
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      UNIT {activeJadwal.unit?.toUpperCase() || unitLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeJadwal.gelombang || 'Gelombang Pendaftaran Resmi'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 self-start sm:self-auto border border-emerald-300 shadow-2xs">
                <FaCheckCircle className="text-xs text-emerald-700" />
                Jadwal Resmi Admin
              </span>
            </div>

            {/* 3 Detail Info Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tile 1: Tanggal Pelaksanaan */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-base shrink-0 shadow-xs">
                  <FaCalendarAlt />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Tanggal Pelaksanaan
                  </span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">
                    {formatHari(activeJadwal.tanggal)}, {formatTanggal(activeJadwal.tanggal)}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">Hadir 30 menit lebih awal</span>
                </div>
              </div>

              {/* Tile 2: Waktu & Sesi */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center text-base shrink-0 shadow-xs">
                  <FaClock />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                    Waktu Sesi Tes
                  </span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5 font-mono">
                    {formatWaktu(activeJadwal.waktu_mulai, activeJadwal.waktu_selesai)}
                  </span>
                  <span className="text-[11px] text-blue-700 font-medium">Waktu Indonesia Barat (WIB)</span>
                </div>
              </div>

              {/* Tile 3: Lokasi Kampus */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/70 to-fuchsia-50/40 border border-purple-200 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-purple-700 text-white flex items-center justify-center text-base shrink-0 shadow-xs">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                    Lokasi Kampus
                  </span>
                  <span className="text-xs sm:text-sm font-black text-slate-900 block mt-0.5 leading-snug">
                    {activeJadwal.lokasi || 'Kampus Utama PKBM Mentari'}
                  </span>
                  <span className="text-[11px] text-purple-700 font-medium">Klaten, Jawa Tengah</span>
                </div>
              </div>
            </div>

            {/* Deskripsi Materi Seleksi */}
            {activeJadwal.deskripsi && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1.5">
                <span className="font-black text-slate-800 flex items-center gap-2">
                  <FaBookOpen className="text-secondary" />
                  Materi & Agenda Ujian Masuk:
                </span>
                <p className="text-slate-600 leading-relaxed pl-5">
                  {activeJadwal.deskripsi}
                </p>
              </div>
            )}
          </div>

          {/* ==============================================================
              KARTU UJIAN SELEKSI RESMI (Siap Cetak / Print)
              ============================================================== */}
          <div className="bg-white rounded-[10px] p-6 sm:p-8 border-2 border-dashed border-emerald-400 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center text-lg font-bold">
                  <FaIdCard />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Kartu Peserta Ujian Seleksi PPDB
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tunjukkan kartu ini kepada pengawas ruangan saat pelaksanaan tes seleksi
                  </p>
                </div>
              </div>
              <button
                onClick={handlePrintCard}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <FaPrint />
                <span>Cetak Kartu Fisik</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-black text-slate-800 uppercase tracking-wider text-xs border-b border-slate-200 pb-1.5">
                  Identitas Calon Peserta Didik
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nomor Registrasi:</span>
                    <span className="font-mono font-black text-slate-900">{dataSiswa?.no_registrasi || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Lengkap:</span>
                    <span className="font-bold text-slate-900">{dataSiswa?.nama_lengkap || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">NIK Santri:</span>
                    <span className="font-mono text-slate-700">{dataSiswa?.nik || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Pendidikan:</span>
                    <span className="font-black text-emerald-800 uppercase">{dataSiswa?.unit || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-black text-slate-800 uppercase tracking-wider text-xs border-b border-slate-200 pb-1.5">
                  Informasi Ujian & Observasi
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gelombang:</span>
                    <span className="font-bold text-slate-900">{activeJadwal.gelombang}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hari, Tanggal:</span>
                    <span className="font-bold text-slate-900">{formatHari(activeJadwal.tanggal)}, {formatTanggal(activeJadwal.tanggal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waktu Tes:</span>
                    <span className="font-mono font-bold text-slate-900">{formatWaktu(activeJadwal.waktu_mulai, activeJadwal.waktu_selesai)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tempat:</span>
                    <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">{activeJadwal.lokasi}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

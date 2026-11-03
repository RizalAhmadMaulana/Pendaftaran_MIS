import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaArrowRight,
  FaUserGraduate,
  FaSpinner,
  FaTrophy,
  FaCog,
  FaFileUpload,
  FaUserEdit,
  FaSchool,
  FaPhoneAlt,
  FaClock,
  FaIdBadge
} from 'react-icons/fa';

export default function BerandaDashboard() {
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
        const response = await fetch('http://localhost:8000/api/dashboard-data/', {
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
        <span className="text-sm font-medium">Memuat data dashboard portal santri...</span>
      </div>
    );
  }

  if (!dataSiswa) return null;

  const isDocComplete =
    dataSiswa.status_dokumen?.toUpperCase() === 'LENGKAP' ||
    dataSiswa.status_dokumen?.toUpperCase() === 'VERIFIED';
  const isLulus = dataSiswa.status_seleksi?.toUpperCase() === 'LULUS';
  const isPaid =
    dataSiswa.status_pembayaran?.toUpperCase() === 'PAID' ||
    dataSiswa.status_pembayaran?.toUpperCase() === 'LUNAS';
  const hasUploadedKkAndAkta = Boolean(dataSiswa.file_kk && dataSiswa.file_akta);

  // 5 Tahapan Pendaftaran Berwarna & Menarik
  const steps = [
    {
      number: 1,
      title: 'Akun Terdaftar',
      desc: 'No. registrasi resmi telah aktif',
      status: 'completed',
      tag: 'Selesai',
      cardClass: 'bg-gradient-to-br from-emerald-100/90 via-emerald-50/50 to-teal-50/40 border-emerald-400 text-emerald-950 shadow-xs shadow-emerald-600/10',
      iconClass: 'bg-emerald-600 text-white shadow-xs',
      tagClass: 'bg-emerald-200 text-emerald-950 border-emerald-300'
    },
    {
      number: 2,
      title: 'Biaya Pendaftaran',
      desc: isPaid ? 'Pembayaran lunas terverifikasi' : 'Selesaikan biaya formulir',
      status: isPaid ? 'completed' : 'active',
      tag: isPaid ? 'Lunas' : 'Menunggu',
      cardClass: isPaid
        ? 'bg-gradient-to-br from-blue-100/90 via-blue-50/50 to-indigo-50/40 border-blue-400 text-blue-950 shadow-xs shadow-blue-600/10'
        : 'bg-gradient-to-br from-blue-50/90 to-indigo-50/50 border-blue-300 ring-2 ring-blue-300 text-blue-950',
      iconClass: 'bg-blue-600 text-white shadow-xs',
      tagClass: isPaid ? 'bg-blue-200 text-blue-950 border-blue-300' : 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      number: 3,
      title: 'Unggah Berkas Persyaratan',
      desc: isDocComplete
        ? 'Dokumen digital terverifikasi'
        : hasUploadedKkAndAkta
        ? 'Menunggu verifikasi panitia'
        : 'Upload KK, Akta, & Pas Foto',
      status: isDocComplete ? 'completed' : isPaid ? 'active' : 'pending',
      tag: isDocComplete ? 'Lengkap' : hasUploadedKkAndAkta ? 'Verifikasi' : 'Wajib',
      cardClass: isDocComplete
        ? 'bg-gradient-to-br from-amber-100/90 via-amber-50/50 to-orange-50/40 border-amber-400 text-amber-950 shadow-xs shadow-amber-600/10'
        : 'bg-gradient-to-br from-amber-50/80 to-yellow-50/40 border-amber-300 text-amber-950',
      iconClass: 'bg-amber-600 text-white shadow-xs',
      tagClass: 'bg-amber-200 text-amber-950 border-amber-300'
    },
    {
      number: 4,
      title: 'Tes & Observasi Seleksi',
      desc: isLulus ? 'Observasi seleksi selesai' : 'Ikuti ujian observasi & tahsin',
      status: isLulus ? 'completed' : isDocComplete ? 'active' : 'pending',
      tag: isLulus ? 'Selesai' : isDocComplete ? 'Jadwal Siap' : 'Menunggu',
      cardClass: isLulus
        ? 'bg-gradient-to-br from-purple-100/90 via-purple-50/50 to-fuchsia-50/40 border-purple-400 text-purple-950 shadow-xs shadow-purple-600/10'
        : 'bg-gradient-to-br from-purple-50/80 to-violet-50/40 border-purple-300 text-purple-950',
      iconClass: 'bg-purple-600 text-white shadow-xs',
      tagClass: 'bg-purple-200 text-purple-950 border-purple-300'
    },
    {
      number: 5,
      title: 'Pengumuman Kelulusan',
      desc: isLulus ? 'Alhamdulillah! Dinyatakan Lulus' : 'Pantau keputusan hasil seleksi',
      status: isLulus ? 'completed' : 'pending',
      tag: isLulus ? 'Lulus' : 'Menunggu',
      cardClass: isLulus
        ? 'bg-gradient-to-br from-rose-100/90 via-rose-50/50 to-pink-50/40 border-rose-400 text-rose-950 shadow-xs shadow-rose-600/10'
        : 'bg-gradient-to-br from-rose-50/80 to-red-50/40 border-rose-300 text-rose-950',
      iconClass: 'bg-rose-600 text-white shadow-xs',
      tagClass: 'bg-rose-200 text-rose-950 border-rose-300'
    }
  ];

  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  // Quick Action List (Menampilkan Keseluruhan Menu Portal Siswa Berwarna Menarik)
  const quickActions = [
    {
      title: 'Biodata Santri',
      badge: 'Bisa Diedit',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Perbarui data diri santri, data orang tua/wali, dan alamat domisili.',
      path: '/dashboard/biodata',
      icon: FaUserEdit,
      cardBg: 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-emerald-300/90 hover:border-emerald-500 shadow-sm shadow-emerald-500/10',
      iconBg: 'bg-emerald-600 text-white shadow-xs'
    },
    {
      title: 'Unggah Dokumen Berkas',
      badge: isDocComplete ? 'Lengkap' : 'Perlu Diisi',
      badgeColor: isDocComplete
        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
        : 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'Unggah Pas Foto 3x4, Kartu Keluarga (KK), Akta Kelahiran, dan Ijazah.',
      path: '/dashboard/biodata',
      icon: FaFileUpload,
      cardBg: 'bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border-amber-300/90 hover:border-amber-500 shadow-sm shadow-amber-500/10',
      iconBg: 'bg-amber-600 text-white shadow-xs'
    },
    {
      title: 'Tagihan & Keuangan',
      badge: isPaid ? 'Lunas ✓' : 'Menunggu',
      badgeColor: isPaid
        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
        : 'bg-blue-100 text-blue-800 border-blue-300',
      desc: 'Rincian biaya formulir, struk transfer, dan kwitansi resmi pembayaran.',
      path: '/dashboard/tagihan',
      icon: FaCreditCard,
      cardBg: 'bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/40 border-blue-300/90 hover:border-blue-500 shadow-sm shadow-blue-500/10',
      iconBg: 'bg-blue-600 text-white shadow-xs'
    },
    {
      title: 'Jadwal Seleksi & Ujian',
      badge: dataSiswa.jadwal ? 'Terjadwal' : 'Agenda Tes',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      desc: 'Informasi tanggal tes, sesi wawancara, lokasi kampus, dan cetak kartu.',
      path: '/dashboard/jadwal',
      icon: FaCalendarAlt,
      cardBg: 'bg-gradient-to-br from-purple-50/90 via-white to-violet-50/40 border-purple-300/90 hover:border-purple-500 shadow-sm shadow-purple-500/10',
      iconBg: 'bg-purple-600 text-white shadow-xs'
    },
    {
      title: 'Hasil Keputusan Seleksi',
      badge: isLulus ? 'LULUS' : 'Pengumuman',
      badgeColor: isLulus
        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
        : 'bg-slate-100 text-slate-700 border-slate-300',
      desc: 'Lihat status keputusan resmi penerimaan santri baru Tahun 2026/2027.',
      path: '/dashboard/hasil',
      icon: FaTrophy,
      cardBg: 'bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/40 border-teal-300/90 hover:border-teal-500 shadow-sm shadow-teal-500/10',
      iconBg: 'bg-teal-600 text-white shadow-xs'
    },
    {
      title: 'Pengaturan Akun',
      badge: 'Keamanan',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      desc: 'Ganti password akun pendaftar dan informasi kontak pusat bantuan.',
      path: '/dashboard/pengaturan',
      icon: FaCog,
      cardBg: 'bg-gradient-to-br from-slate-100/90 via-white to-gray-50/40 border-slate-300/90 hover:border-slate-500 shadow-sm shadow-slate-500/10',
      iconBg: 'bg-slate-700 text-white shadow-xs'
    }
  ];

  return (
    <div className="space-y-7">
      {/* ==============================================================
          1. EXECUTIVE WELCOME HERO CARD (Modern Emerald Gradient)
          ============================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B4332] via-[#245942] to-[#122c21] text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/20 border border-white/10">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-300/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Student Avatar Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 text-2xl sm:text-3xl shrink-0 shadow-inner">
              <FaUserGraduate />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-emerald-950 tracking-wider font-mono shadow-xs">
                  {dataSiswa.no_registrasi || 'MIS-2026'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-white/15 text-emerald-100 border border-white/20">
                  UNIT: {dataSiswa.unit || 'SD'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isPaid ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                }`}>
                  {isPaid ? '✓ Pembayaran Lunas' : '⏳ Menunggu Pembayaran'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                Ahlan Wa Sahlan, {dataSiswa.nama_lengkap}!
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
                Selamat datang di Portal Calon Santri Mentari Islamic School Klaten. Pantau seluruh proses seleksi, kelengkapan berkas digital, jadwal ujian observasi, serta pengumuman hasil kelulusan.
              </p>
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-row lg:flex-col items-center sm:items-end justify-start gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
            <Link
              to="/dashboard/biodata"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-emerald-400 text-emerald-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{hasUploadedKkAndAkta ? 'Lihat / Edit Biodata' : 'Lengkapi Biodata'}</span>
              <FaArrowRight className="text-xs" />
            </Link>
            <div className="text-[11px] text-emerald-200/80 font-medium">
              Tahun Ajaran 2026/2027
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          2. ALERT PERHATIAN DOKUMEN (Jika Belum Lengkap)
          ============================================================== */}
      {!hasUploadedKkAndAkta && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <FaExclamationTriangle className="text-amber-500 text-xl shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-amber-950 flex items-center gap-2">
              <span>Perhatian: Berkas Wajib Belum Diunggah</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full uppercase font-black">
                Penting
              </span>
            </p>
            <p className="text-amber-800 text-xs sm:text-sm mt-1 leading-relaxed">
              Anda belum mengunggah dokumen{' '}
              {!dataSiswa.file_kk && <span className="font-bold underline">Kartu Keluarga (KK)</span>}
              {!dataSiswa.file_kk && !dataSiswa.file_akta && ' dan '}
              {!dataSiswa.file_akta && <span className="font-bold underline">Akta Kelahiran</span>}. Silakan unggah dokumen pada menu{' '}
              <Link to="/dashboard/biodata" className="font-extrabold text-amber-950 underline hover:text-black">
                Biodata & Dokumen
              </Link>{' '}
              agar berkas pendaftaran Anda dapat diverifikasi oleh panitia.
            </p>
          </div>
        </div>
      )}

      {/* ==============================================================
          3. PROGRES TAHAPAN PENDAFTARAN (Sangat Menarik & Berwarna)
          ============================================================== */}
      <div className="bg-white rounded-[10px] p-5 sm:p-6 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <FaClock className="text-secondary" />
              Progres Alur Penerimaan Santri Baru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau perjalanan administrasi pendaftaran secara transparan hingga pengumuman kelulusan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-500">Pencapaian:</span>
              <span className="ml-1 text-sm font-black text-emerald-800">{progressPercent}%</span>
            </div>
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Tahap {completedSteps < steps.length ? completedSteps + 1 : steps.length} dari {steps.length}
            </span>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-[#2ECC71] h-2.5 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 5-Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';

            return (
              <div
                key={step.number}
                className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 overflow-hidden ${
                  isActive ? 'ring-2 ring-blue-300 -translate-y-1' : ''
                } ${step.cardClass}`}
              >
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-xs ${step.iconClass}`}
                  >
                    {isCompleted ? <FaCheckCircle className="text-sm" /> : step.number}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${step.tagClass}`}
                  >
                    {step.tag}
                  </span>
                </div>

                {/* Step Info */}
                <div className="space-y-1">
                  <h3 className="font-bold text-xs sm:text-sm leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[11px] opacity-80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==============================================================
          4. AKSI CEPAT PORTAL SISWA (Menampilkan KESELURUHAN Menu)
          ============================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <FaSchool className="text-secondary" />
              Aksi Cepat & Navigasi Menu Siswa
            </h2>
            <p className="text-xs text-slate-500">
              Pintasan cepat untuk mengakses seluruh modul dan layanan pendaftaran santri baru
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">6 Menu Utama</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className={`group relative rounded-2xl p-5 border shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${action.cardBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-xs transition-transform group-hover:scale-110 ${action.iconBg}`}>
                      <Icon />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${action.badgeColor}`}>
                      {action.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-emerald-700">
                  <span>Buka Menu</span>
                  <FaArrowRight className="text-[11px] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ==============================================================
          5. CARD INFORMASI BANTUAN & CS PANITIA PPDB
          ============================================================== */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-xl p-5 border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center text-lg shadow-sm shrink-0">
            <FaPhoneAlt />
          </div>
          <div>
            <h3 className="font-bold text-sm text-emerald-950">
              Butuh Bantuan atau Panduan Pendaftaran?
            </h3>
            <p className="text-xs text-emerald-800 mt-0.5">
              Hubungi Sekretariat Panitia Penerimaan Santri Baru Mentari Islamic School Klaten (08.00 - 15.00 WIB)
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <FaPhoneAlt className="text-xs" />
          <span>Hubungi CS WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

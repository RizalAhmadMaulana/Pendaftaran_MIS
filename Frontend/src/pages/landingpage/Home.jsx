import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSchool, FaBookOpen, FaChalkboardTeacher, FaMosque, FaStar,
  FaArrowRight, FaGraduationCap,
  FaUserPlus, FaCreditCard, FaFileAlt, FaPencilAlt, FaTrophy,
  FaEye, FaBullseye, FaCheckCircle, FaArrowLeft, FaCheck,
  FaAward, FaCalendarAlt, FaMapMarkerAlt,
  FaCoffee, FaDesktop, FaMedkit, FaFutbol, FaDirections
} from 'react-icons/fa';

import homeHeroImg from '../../assets/loc-mis.jpeg';
import schoolLocImg from '../../assets/loc-mis.jpeg';

/* ============================================================
   DATA MENTARI ISLAMIC SCHOOL KLATEN
   ============================================================ */

// --- Keunggulan ---
const keunggulan = [
  {
    num: '01',
    icon: <FaStar className="text-2xl text-emerald-700" />,
    title: 'Fasilitas Lengkap',
    desc: 'Ruang kelas ber-AC, laboratorium sains & komputer, perpustakaan digital, serta lapangan olahraga.',
    tags: ['Ruang Ber-AC', 'Lab Komputer', 'Perpustakaan', 'Lapangan']
  },
  {
    num: '02',
    icon: <FaBookOpen className="text-2xl text-emerald-700" />,
    title: 'Kurikulum Berbasis Adab',
    desc: 'Mengintegrasikan kurikulum nasional dengan nilai-nilai keislaman dan pembentukan karakter Qurani.',
    tags: ['Integrasi Nasional & Islam', 'Pembentukan Karakter', 'Tahsin & Tahfidz']
  },
  {
    num: '03',
    icon: <FaChalkboardTeacher className="text-2xl text-emerald-700" />,
    title: 'Pengajar Profesional',
    desc: 'Tenaga pendidik tersertifikasi dengan pengalaman mengajar minimal 5 tahun dan berdedikasi tinggi.',
    tags: ['Tersertifikasi', 'Pengalaman 5+ Thn', 'Dedikasi Tinggi']
  },
];

// --- Unit Pendidikan (TPA & KB Dipisah, Tanpa Boarding) ---
const filters = ['Semua Unit', 'TPA', 'KB', 'TK', 'SD', 'SMP', 'SMA'];

const unitList = [
  {
    id: 'tpa',
    category: 'TPA',
    icon: <FaMosque className="text-2xl" />,
    title: 'TPA Mentari Islamic School',
    desc: 'Program Taman Pendidikan Al-Quran untuk usia dini dengan metode tartil yang menyenangkan dan bimbingan hafalan harian.',
    status: 'Buka',
    kampus: 'Kampus PAUD (Tulung)',
    alamat: 'Perkiosan Tulung No. 259, Klaten'
  },
  {
    id: 'kb',
    category: 'KB',
    icon: <FaStar className="text-2xl" />,
    title: 'KB Mentari Islamic School',
    desc: 'Kelompok Bermain dengan pendekatan belajar aktif, stimulasi motorik, dan pembiasaan adab Islami sejak usia keemasan.',
    status: 'Buka',
    kampus: 'Kampus PAUD (Tulung)',
    alamat: 'Perkiosan Tulung No. 259, Klaten'
  },
  {
    id: 'tk',
    category: 'TK',
    icon: <FaStar className="text-2xl" />,
    title: 'TK Mentari Islamic School',
    desc: 'Taman Kanak-Kanak dengan kurikulum bermain sambil belajar berbasis nilai keislaman dan kesiapan menuju jenjang dasar.',
    status: 'Buka',
    kampus: 'Kampus Utama (Polanharjo)',
    alamat: 'Komplek Masjid Al Mahabbah, Jimus, Polanharjo, Klaten'
  },
  {
    id: 'sd',
    category: 'SD',
    icon: <FaSchool className="text-2xl" />,
    title: 'SD Mentari Islamic School',
    desc: 'Pendidikan dasar 6 tahun dengan kurikulum nasional terintegrasi adab keislaman, tahfidz, dan sains modern.',
    status: 'Buka',
    kampus: 'Kampus Utama (Polanharjo)',
    alamat: 'Komplek Masjid Al Mahabbah, Jimus, Polanharjo, Klaten'
  },
  {
    id: 'smp',
    category: 'SMP',
    icon: <FaBookOpen className="text-2xl" />,
    title: 'SMP Mentari Islamic School',
    desc: 'Jenjang menengah pertama yang mencetak generasi muda berakhlak mulia, berwawasan global, dan berprestasi akademik.',
    status: 'Buka',
    kampus: 'Kampus Utama (Polanharjo)',
    alamat: 'Komplek Masjid Al Mahabbah, Jimus, Polanharjo, Klaten'
  },
  {
    id: 'sma',
    category: 'SMA',
    icon: <FaGraduationCap className="text-2xl" />,
    title: 'SMA Mentari Islamic School',
    desc: 'Jenjang menengah atas untuk mempersiapkan siswa menuju perguruan tinggi terbaik nasional maupun luar negeri.',
    status: 'Tutup',
    kampus: 'Kampus Utama (Polanharjo)',
    alamat: 'Komplek Masjid Al Mahabbah, Jimus, Polanharjo, Klaten'
  },
];

// --- Alur Pendaftaran ---
const steps = [
  {
    id: 1, title: 'Pendaftaran Akun', icon: <FaUserPlus className="text-2xl" />,
    description: 'Buat akun pendaftaran dengan mengisi data dasar calon peserta didik. Anda akan menerima nomor pendaftaran setelah proses registrasi berhasil.',
    details: ['Kunjungi halaman Daftar di portal PSHB MIS', 'Isi formulir registrasi dengan data diri yang valid', 'Masukkan email dan nomor WhatsApp yang aktif', 'Anda akan menerima nomor pendaftaran via WhatsApp'],
  },
  {
    id: 2, title: 'Pembayaran', icon: <FaCreditCard className="text-2xl" />,
    description: 'Lakukan pembayaran biaya pendaftaran melalui transfer bank ke rekening yang telah ditentukan. Upload bukti pembayaran untuk verifikasi.',
    details: ['Biaya pendaftaran sebesar Rp 250.000 + kode unik', 'Transfer ke rekening BSI atas nama PSHB MIS', 'Upload bukti transfer melalui portal', 'Tunggu verifikasi admin (maks. 1x24 jam)'],
  },
  {
    id: 3, title: 'Pengisian Berkas', icon: <FaFileAlt className="text-2xl" />,
    description: 'Setelah pembayaran terverifikasi, lengkapi seluruh berkas persyaratan melalui formulir online yang tersedia di portal siswa.',
    details: ['Login ke portal menggunakan akun yang telah dibuat', 'Lengkapi data calon siswa (biodata, alamat, riwayat pendidikan)', 'Upload dokumen persyaratan (akta, KK, foto, dll)', 'Pastikan semua data terisi dengan benar'],
  },
  {
    id: 4, title: 'Tes Seleksi', icon: <FaPencilAlt className="text-2xl" />,
    description: 'Ikuti tes seleksi sesuai jadwal yang telah ditentukan. Tes meliputi kemampuan akademik dasar dan wawancara.',
    details: ['Jadwal tes akan diinformasikan via WhatsApp dan email', 'Tes terdiri dari kemampuan baca tulis, numerasi, dan wawancara', 'Calon siswa wajib hadir di lokasi yang ditentukan', 'Orang tua/wali ikut sesi wawancara'],
  },
  {
    id: 5, title: 'Hasil Seleksi', icon: <FaTrophy className="text-2xl" />,
    description: 'Pengumuman hasil seleksi akan dipublikasikan melalui portal dan notifikasi WhatsApp. Peserta yang lolos melanjutkan proses daftar ulang.',
    details: ['Hasil diumumkan 7 hari setelah tes seleksi', 'Cek hasil melalui menu "Cek Kelulusan" di portal', 'Peserta lulus melakukan daftar ulang online', 'Peserta tidak lulus dapat mendaftar di gelombang berikutnya'],
  },
];

// --- 8 Galeri Fasilitas dengan Gambar Nyata (PKBM Mentari Islamic School) ---
const galeriFasilitas = [
  {
    caption: 'Masjid',
    sub: 'Masjid Al-Mahabbah',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=700&q=80',
    icon: <FaMosque className="text-xl" />,
    category: 'Ibadah & Spiritual',
    desc: 'Pusat ibadah sholat berjamaah harian, pembinaan spiritual, dan halaqah Al-Quran santri.'
  },
  {
    caption: 'Ruang Kelas',
    sub: 'Ruang Kelas Ber-AC',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=700&q=80',
    icon: <FaSchool className="text-xl" />,
    category: 'Pembelajaran Aktif',
    desc: 'Ruang belajar ber-AC dengan multimedia projector, pencahayaan alami, dan sirkulasi sehat.'
  },
  {
    caption: 'Area Bermain',
    sub: 'Taman Bermain Anak',
    image: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?auto=format&fit=crop&w=700&q=80',
    icon: <FaStar className="text-xl" />,
    category: 'PAUD & Kids',
    desc: 'Sarana permainan indoor & outdoor ramah anak untuk stimulasi motorik dan sosialisasi.'
  },
  {
    caption: 'Coffe & Kantin Modern',
    sub: 'Kantin Bersih & Halal',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=700&q=80',
    icon: <FaCoffee className="text-xl" />,
    category: 'Kuliner & Relaksasi',
    desc: 'Kantin higienis berkonsep modern menyediakan aneka sajian makanan sehat, bergizi, dan halal.'
  },
  {
    caption: 'Laboratorium Komputer',
    sub: 'Lab CBT & Multimedia',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=700&q=80',
    icon: <FaDesktop className="text-xl" />,
    category: 'Digital & IT',
    desc: 'Perangkat komputer modern berkecepatan tinggi untuk ujian CBT, coding, dan literasi digital.'
  },
  {
    caption: 'UKS',
    sub: 'Unit Kesehatan Sekolah',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=80',
    icon: <FaMedkit className="text-xl" />,
    category: 'Layanan Medis',
    desc: 'Fasilitas pertolongan pertama dan pemantauan kesehatan siswa dengan ranjang medis higienis.'
  },
  {
    caption: 'Lapangan',
    sub: 'Lapangan Serbaguna',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
    icon: <FaFutbol className="text-xl" />,
    category: 'Olahraga & Fisik',
    desc: 'Lapangan serbaguna untuk olahraga futsal, basket, memanah, upacara, dan kegiatan luar ruang.'
  },
  {
    caption: 'Perpustakaan',
    sub: 'Perpustakaan Literasi',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80',
    icon: <FaBookOpen className="text-xl" />,
    category: 'Literasi Islami',
    desc: 'Koleksi ribuan literatur keislaman, sains, ensiklopedia, serta ruang baca yang tenang.'
  },
];

// --- 2 Data Lokasi Kampus Klaten ---
const lokasiKampus = [
  {
    id: 'utama',
    nama: 'Kampus Utama PKBM Mentari',
    peruntukan: 'Jenjang TK, SD, SMP, SMA',
    alamat: 'Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474',
    mapsSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63932.77507578455!2d110.649413!3d-7.617925!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a41e6d34c29a3%3A0x98e0e3089a3951f4!2sPondok%20Pesantren%20Tahfidz%20Al%20Mahabbah%20(PKBM%20Mentari%20Kampus%202)!5e1!3m2!1sen!2sus!4v1791777871734!5m2!1sen!2sus',
    badge: 'Kampus 1'
  },
  {
    id: 'paud',
    nama: 'Kampus PAUD (Mentari Kids)',
    peruntukan: 'Jenjang TPA & KB',
    alamat: 'Perkiosan Tulung No. 259, Klaten 57482',
    mapsSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63937.04533125313!2d110.62167000000001!3d-7.589258!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a6a266bb67119%3A0x5f9755dc8833e3bb!2sMentari%20Kids!5e1!3m2!1sen!2sus!4v1791777971548!5m2!1sen!2sus',
    badge: 'Kampus 2'
  }
];

/* ============================================================
   COMPONENT
   ============================================================ */
const getUnitIcon = (kode, category) => {
  const k = (kode || category || '').toLowerCase();
  if (k.includes('tahfidz') || k.includes('quran')) return <FaBookOpen className="text-2xl" />;
  if (k.includes('paud') || k.includes('kids') || k.includes('kb')) return <FaStar className="text-2xl" />;
  if (k.includes('tpa') || k.includes('masjid')) return <FaMosque className="text-2xl" />;
  if (k.includes('sma') || k.includes('al-iyah')) return <FaGraduationCap className="text-2xl" />;
  return <FaSchool className="text-2xl" />;
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('Semua Unit');
  const [activeStep, setActiveStep] = useState(0);
  const [activeLokasi, setActiveLokasi] = useState('utama');
  const [units, setUnits] = useState(unitList);

  useEffect(() => {
    fetch('http://localhost:8000/api/units/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(apiUnit => {
            const fallback = unitList.find(u => u.id === apiUnit.kode?.toLowerCase()) || {};
            return {
              id: apiUnit.kode?.toLowerCase(),
              category: apiUnit.kategori_label || apiUnit.kode?.toUpperCase(),
              icon: fallback.icon || getUnitIcon(apiUnit.kode, apiUnit.kategori_label),
              title: apiUnit.nama || fallback.title,
              desc: apiUnit.deskripsi_singkat || fallback.desc || 'Unit pendidikan unggulan berlandaskan Al-Quran dan adab Islami.',
              status: apiUnit.is_open ? 'Buka' : 'Tutup',
              is_open: apiUnit.is_open,
              biaya_aktif: apiUnit.biaya_aktif,
              nama_gelombang: apiUnit.nama_gelombang_aktif,
              masa_pendaftaran: apiUnit.masa_pendaftaran_teks,
              kampus: apiUnit.lokasi_kampus || fallback.kampus || 'Kampus Utama (Polanharjo)',
              alamat: fallback.alamat || 'Klaten',
            };
          });
          setUnits(mapped);
        }
      })
      .catch(err => {
        console.error('Failed to fetch dynamic units:', err);
      });
  }, []);

  const dynamicFilters = ['Semua Unit', ...new Set(units.map(u => u.category || u.id?.toUpperCase()))];

  const filtered = activeFilter === 'Semua Unit'
    ? units
    : units.filter(u => u.category === activeFilter);

  const scrollToUnit = () => {
    const el = document.getElementById('unit');
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const currentLokasiData = lokasiKampus.find(l => l.id === activeLokasi) || lokasiKampus[0];

  return (
    <div className="bg-slate-50 text-gray-800">
      {/* ========================================
          SECTION 1 — HERO (BERANDA) - SPLIT CREATIVE LAYOUT (KLATEN)
          ======================================== */}
      <section id="beranda" className="relative py-16 lg:py-24 px-4 bg-gradient-to-b from-emerald-100/60 via-green-50/40 to-slate-50 overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Kolom Kiri: Teks & Aksi Utama (7 Cols) */}
            <div className="lg:col-span-7 text-left">
              {/* Badge Status Pendaftaran */}
              <div className="inline-flex items-center gap-2.5 bg-emerald-100 border border-emerald-300/80 text-emerald-900 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
                Pendaftaran Tahun Ajaran 2026/2027 Telah Dibuka
              </div>

              {/* Headline Utama */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-[1.18] tracking-tight mb-5">
                Pendaftaran Siswa Baru <br />
                <span className="bg-gradient-to-r from-emerald-800 via-primary to-emerald-700 bg-clip-text text-transparent">
                  Mentari Islamic School Klaten
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mb-8 leading-relaxed font-normal">
                Wujudkan masa depan anak Anda bersama Mentari Islamic School. Pendidikan berkualitas di Klaten dengan landasan iman, ilmu, dan akhlak mulia.
              </p>

              {/* Dua Tombol Utama */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
                <button
                  onClick={scrollToUnit}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3.5 rounded-xl text-base font-bold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer ring-2 ring-emerald-500/20"
                >
                  Daftar Sekarang <FaArrowRight />
                </button>
                <Link
                  to="/login?tab=status"
                  className="bg-white hover:bg-emerald-50/80 border-2 border-emerald-600/30 hover:border-emerald-600 text-emerald-900 px-8 py-3.5 rounded-xl text-base font-bold transition-all shadow-sm hover:-translate-y-0.5 flex items-center justify-center"
                >
                  Cek Status / Seleksi
                </Link>

              </div>

              {/* Key Trust Counters */}
              <div className="pt-6 border-t border-emerald-200/60 grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">500+</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Santri & Siswa Aktif</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">{units.length}</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Jenjang Pendidikan</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-secondary">A</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Akreditasi Terbaik</div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Visual Card Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Backing Frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-secondary rounded-3xl transform rotate-2 scale-102 opacity-30 blur-xs"></div>
                
                {/* Main Card Frame */}
                <div className="relative bg-white p-3 rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-emerald-950">
                    <img
                      src={homeHeroImg}
                      alt="Kampus Mentari Islamic School Klaten"
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-black/20"></div>

                    {/* Top Pill on Image */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-950 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-secondary" /> Kampus Klaten
                    </div>

                    {/* Bottom Floating Info on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs font-semibold text-emerald-200">Lingkungan Islami & Modern</p>
                      <h4 className="text-base font-bold text-white leading-tight">Komplek Masjid Al Mahabbah, Polanharjo</h4>
                    </div>
                  </div>

                  {/* Highlights Bar under photo */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-lg">
                        <FaGraduationCap />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">Kurikulum Berbasis Adab</div>
                        <div className="text-[11px] text-gray-500">TPA, KB, TK, SD, SMP & SMA</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      Klaten
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================
          SECTION: MENGAPA MEMILIH MIS (KEUNGGULAN)
          ======================================== */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full inline-block mb-3 border border-emerald-200/80">
              KEUNGGULAN SEKOLAH
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Mengapa Memilih MIS?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base">
              Komitmen kami untuk pendidikan terbaik putra-putri Anda di Klaten
            </p>
          </div>

          {/* 3 Creative Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keunggulan.map((item) => (
              <div
                key={item.num}
                className="bg-white rounded-3xl border border-emerald-200/80 p-8 shadow-sm hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                      <div className="group-hover:text-white transition-colors">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-3xl font-extrabold text-emerald-100 group-hover:text-emerald-200 transition-colors">
                      {item.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* Micro tags */}
                <div className="pt-4 border-t border-emerald-50 flex flex-wrap gap-1.5">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 2 — UNIT PENDIDIKAN (TPA & KB TERPISAH, NON-BOARDING)
          ======================================== */}
      <section id="unit" className="py-20 px-4 bg-gradient-to-b from-emerald-50/50 via-emerald-100/30 to-slate-50 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full inline-block mb-3 border border-emerald-200">
              JENJANG PENDIDIKAN
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Daftar Unit Pendidikan</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base">Pilih unit pendidikan yang sesuai untuk putra-putri Anda</p>
          </div>

          {/* Filter Bar */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/90 p-1.5 rounded-full border border-emerald-200 shadow-sm inline-flex flex-wrap items-center justify-center gap-1.5">
              {dynamicFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    activeFilter === f
                      ? 'bg-gradient-to-r from-primary to-emerald-800 text-white shadow-md shadow-emerald-950/20'
                      : 'text-emerald-900 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Cards (6 Jenjang) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl border-2 border-emerald-100 hover:border-emerald-500 transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden group"
              >
                {/* Card Top Header Banner */}
                <div className="bg-gradient-to-r from-primary via-emerald-800 to-[#144733] text-white p-6 relative overflow-hidden">
                  <div className="w-32 h-32 rounded-full bg-white/5 absolute -right-8 -top-8 pointer-events-none"></div>

                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-emerald-100 border border-white/10">
                      Jenjang {unit.category}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${
                      unit.status === 'Buka'
                        ? 'bg-emerald-400 text-emerald-950'
                        : 'bg-red-500 text-white'
                    }`}>
                      {unit.status === 'Buka' && <span className="w-2 h-2 rounded-full bg-emerald-950 animate-pulse"></span>}
                      {unit.status}
                    </span>
                  </div>

                  {/* Lokasi Kampus Badge */}
                  <div className="relative z-10 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-md">
                      <FaMapMarkerAlt className="text-secondary text-[10px]" /> {unit.kampus}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-emerald-200 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                      {unit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-emerald-200 transition-colors">
                      {unit.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-emerald-50/30">
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {unit.desc}
                  </p>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md">
                        <FaCheck className="text-xs text-secondary" /> Kurikulum Terpadu
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-md">
                        <FaCheck className="text-xs text-secondary" /> Pendaftaran Online
                      </span>
                    </div>

                    {/* Dynamic Gelombang & Biaya Info */}
                    <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[11px] text-gray-500 block font-medium">Gelombang</span>
                        <span className="font-bold text-emerald-950">{unit.nama_gelombang || 'Gelombang 1'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-gray-500 block font-medium">Biaya Masuk</span>
                        <span className="font-extrabold text-emerald-700">
                          {unit.biaya_aktif ? `Rp ${unit.biaya_aktif.toLocaleString('id-ID')}` : 'Rp 250.000'}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/unit/${unit.id}`}
                      className="inline-flex items-center gap-2 text-sm text-emerald-700 font-bold hover:text-emerald-900 group-hover:gap-3 transition-all"
                    >
                      Baca Selengkapnya <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-6 pt-0 mt-auto bg-emerald-50/30">
                  <Link
                    to={unit.status === 'Buka' ? `/daftar/${unit.id}` : '#'}
                    onClick={(e) => {
                      if (unit.status !== 'Buka') {
                        e.preventDefault();
                        alert(`Pendaftaran untuk unit ${unit.title} saat ini sedang ditutup.`);
                      }
                    }}
                    className={`block text-center w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      unit.status === 'Buka'
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30'
                        : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {unit.status === 'Buka' ? 'Daftar Sekarang' : 'Pendaftaran Ditutup'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 3 — ALUR PENDAFTARAN
          ======================================== */}
      <section id="alur" className="py-20 px-4 bg-gradient-to-br from-[#0c2b1d] via-[#143d2b] to-[#0a2318] text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 rounded-full inline-block mb-3">
              PANDUAN LENGKAP
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Alur Pendaftaran</h2>
            <p className="text-emerald-100/80 max-w-xl mx-auto text-base">
              Ikuti langkah-langkah berikut untuk mendaftarkan putra-putri Anda di Mentari Islamic School
            </p>
          </div>

          {/* Split Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Kiri - List 5 Tahapan */}
            <div className="lg:w-[42%] space-y-3">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/25 to-green-500/20 border-2 border-secondary shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 transition-transform ${
                      isActive
                        ? 'bg-gradient-to-br from-secondary to-green-500 text-primary shadow-md shadow-secondary/30 scale-105'
                        : 'bg-white/10 border border-white/10 text-emerald-300'
                    }`}>
                      {step.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs uppercase tracking-wider font-semibold ${
                        isActive ? 'text-secondary' : 'text-emerald-200/60'
                      }`}>
                        Tahap {step.id}
                      </p>
                      <h4 className={`text-base font-bold truncate ${
                        isActive ? 'text-white' : 'text-emerald-100/90'
                      }`}>
                        {step.title}
                      </h4>
                    </div>

                    {isActive && (
                      <FaArrowRight className="text-secondary shrink-0 text-sm animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Kanan - Detail Tahap Aktif */}
            <div className="lg:w-[58%]">
              <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border-4 border-emerald-500/20 p-6 md:p-8 h-full flex flex-col justify-between relative overflow-hidden">
                <div>
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-2">
                    <span>Tahap 0{steps[activeStep].id} dari 05</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {Math.round(((activeStep + 1) / 5) * 100)}% Selesai
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden mb-6">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-secondary h-full rounded-full transition-all duration-500"
                      style={{ width: `${((activeStep + 1) / 5) * 100}%` }}
                    ></div>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-700/30 shrink-0">
                      {steps[activeStep].icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider">Tahap {steps[activeStep].id}</span>
                      <h3 className="text-2xl font-extrabold text-gray-900">{steps[activeStep].title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                    {steps[activeStep].description}
                  </p>

                  {/* Detail Langkah */}
                  <h4 className="text-xs font-extrabold text-emerald-900 mb-3 uppercase tracking-wider">
                    Detail Langkah:
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 mb-6">
                    {steps[activeStep].details.map((d, i) => (
                      <div
                        key={i}
                        className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-3 hover:bg-emerald-100/50 transition-colors"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-700 to-green-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation in Step */}
                <div className="pt-4 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3 mt-4">
                  {activeStep > 0 ? (
                    <button
                      onClick={() => setActiveStep(activeStep - 1)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      <FaArrowLeft className="text-xs" /> Tahap Sebelumnya
                    </button>
                  ) : <div />}

                  {activeStep < 4 ? (
                    <button
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg inline-flex items-center gap-2 cursor-pointer ml-auto"
                    >
                      Lanjut ke Tahap {activeStep + 2} <FaArrowRight className="text-xs" />
                    </button>
                  ) : (
                    <Link
                      to="/pengumuman"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg inline-flex items-center gap-2 ml-auto"
                    >
                      Cek Kelulusan Sekarang <FaArrowRight className="text-xs" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 4 — TENTANG KAMI (SEJARAH, VISI MISI, 8 FASILITAS BERGAMBAR & 2 LOKASI KLATEN)
          ======================================== */}
      <section id="tentang" className="py-20 lg:py-28 px-4 bg-gradient-to-b from-slate-50 via-white to-emerald-50/40">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full inline-block mb-3 border border-emerald-200">
              PROFIL YAYASAN
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Tentang Mentari Islamic School
            </h2>
            <p className="text-emerald-800/80 font-medium text-base md:text-lg max-w-2xl mx-auto">
              Sekolah Tahfidz dan Sains, Hadir di Klaten sejak tahun 2012
            </p>
          </div>

          {/* Sejarah Singkat — Creative 2-Column Story Layout */}
          <div className="bg-white rounded-3xl border border-emerald-200/80 shadow-md p-8 md:p-12 mb-16 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Visual Highlight Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-emerald-900 group">
                  <img
                    src={schoolLocImg}
                    alt="Gedung Mentari Islamic School Klaten"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-black/10"></div>
                  
                  {/* Floating Milestone Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl text-gray-900 shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Berdiri Sejak 2012</span>
                      <span className="text-xs font-extrabold text-secondary bg-emerald-50 px-2 py-0.5 rounded">2012 - 2026</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Sekolah Tahfidz & Sains dengan ~500 santri & peserta didik aktif</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Profil Lengkap & Sejarah Mentari Islamic School */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-block text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md mb-1">
                  SEKOLAH TAHFIDZ & SAINS KLATEN
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
                  Pusat Belajar Sepanjang Hayat & Sekolah Induk Terakreditasi A Terbaik
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base font-medium">
                  <strong>MENTARI ISLAMIC SCHOOL</strong>, Sekolah Tahfidz dan Sains, Hadir di Klaten. Kami sudah meluluskan banyak santri tersebar di berbagai sekolah dan universitas terbaik. Sejak 2012 kami berdiri dan sudah terakreditasi dengan peringkat <strong>A TERBAIK</strong>. Kami juga menjadi sekolah induk bagi sekolah, pesantren, dan mahad di sekitar.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  Mentari Islamic School adalah pusat belajar sepanjang hayat yang membuka akses pendidikan bagi semua warga, dari remaja hingga orang dewasa yang ingin kembali melanjutkan sekolah. Di sini, peserta didik difasilitasi untuk mengembangkan pengetahuan, keterampilan, dan kemandirian melalui pembelajaran yang fleksibel, ramah, dan berbasis pemberdayaan masyarakat.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  Mentari Islamic School hadir sebagai ruang tumbuh, tempat setiap orang diberi kesempatan untuk memperbaiki masa depan dan meningkatkan kualitas hidupnya.
                </p>

                {/* Key feature pills */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg">
                    ✓ Akreditasi A Terbaik
                  </span>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg">
                    ✓ Sekolah Induk Pesantren & Mahad
                  </span>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg">
                    ✓ Berdiri Sejak 2012 (~500 Santri Aktif)
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Visi & Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Kartu Visi */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50/50 rounded-3xl p-8 md:p-10 border-2 border-emerald-200/80 shadow-sm relative overflow-hidden group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-700 to-green-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <FaEye />
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-3">Visi</h4>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium">
                Menjadi lembaga pendidikan Islam terdepan yang melahirkan generasi unggul, beriman, berilmu, dan berakhlak mulia serta berdaya saing global pada tahun 2030.
              </p>
            </div>

            {/* Kartu Misi */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-emerald-200/80 shadow-sm relative overflow-hidden group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-800 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
                <FaBullseye />
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-4">Misi</h4>
              <ul className="text-gray-700 text-sm md:text-base leading-relaxed space-y-3.5">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-secondary text-lg mt-0.5 shrink-0" />
                  <span>Menyelenggarakan pendidikan berkualitas berbasis Al-Quran dan Sunnah</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-secondary text-lg mt-0.5 shrink-0" />
                  <span>Mengembangkan potensi akademik dan non-akademik peserta didik</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-secondary text-lg mt-0.5 shrink-0" />
                  <span>Membangun karakter Islami yang kuat pada setiap individu</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-secondary text-lg mt-0.5 shrink-0" />
                  <span>Menciptakan lingkungan belajar yang kondusif dan menyenangkan</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ====================================================
              GALERI 8 FASILITAS LENGKAP DENGAN GAMBAR NYATA
              ==================================================== */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full inline-block mb-3 border border-emerald-200">
                SARANA & PRASARANA
              </span>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Galeri Fasilitas PKBM Mentari Islamic School</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Fasilitas modern dan representatif untuk menunjang proses belajar mengajar optimal di Klaten
              </p>
            </div>

            {/* Grid 8 Fasilitas dengan Foto / Gambar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galeriFasilitas.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-emerald-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Wadah Gambar / Foto Fasilitas */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-emerald-950">
                      <img
                        src={f.image}
                        alt={`Fasilitas ${f.caption} Mentari Islamic School`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Badge Kategori di Atas Gambar */}
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {f.category}
                      </span>

                      {/* Icon Floating di Pojok Kanan Gambar */}
                      <div className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-primary/90 text-white flex items-center justify-center shadow-md">
                        {f.icon}
                      </div>
                    </div>

                    {/* Deskripsi Fasilitas */}
                    <div className="p-5">
                      <h4 className="text-base font-extrabold text-gray-900 group-hover:text-primary transition-colors mb-1">
                        {f.caption}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-700 mb-2.5">
                        {f.sub}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>

                  {/* Footer Card */}
                  <div className="px-5 pb-5 pt-3 border-t border-emerald-50 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
                    <span>Fasilitas PKBM</span>
                    <span className="text-secondary font-bold bg-emerald-50 px-2 py-0.5 rounded">Tersedia ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================
              DUAL LOKASI KAMPUS KLATEN DENGAN GOOGLE MAPS EMBED
              ==================================================== */}
          <div>
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full inline-block mb-3 border border-emerald-200">
                LOKASI KAMPUS
              </span>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-2">2 Lokasi Kampus Mentari Islamic School</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Kunjungi kampus kami di Klaten sesuai jenjang pendidikan putra-putri Anda
              </p>
            </div>

            {/* Toggle Switcher Lokasi Kampus */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-1.5 rounded-2xl border border-emerald-200 shadow-xs inline-flex gap-2">
                {lokasiKampus.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLokasi(l.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      activeLokasi === l.id
                        ? 'bg-gradient-to-r from-primary to-emerald-800 text-white shadow-md'
                        : 'text-gray-600 hover:text-primary hover:bg-emerald-50'
                    }`}
                  >
                    <FaMapMarkerAlt className={activeLokasi === l.id ? 'text-secondary' : 'text-emerald-700'} />
                    {l.nama}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Tampilan Peta & Alamat Detail */}
            <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 md:p-8 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Kolom Informasi Alamat */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-block text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    {currentLokasiData.badge} &bull; {currentLokasiData.peruntukan}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">
                    {currentLokasiData.nama}
                  </h4>
                  <div className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                    <FaMapMarkerAlt className="text-secondary text-lg mt-1 shrink-0" />
                    <span>{currentLokasiData.alamat}</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
                    <p className="font-bold text-emerald-900">Peruntukan Siswa:</p>
                    <p className="text-emerald-800">
                      {currentLokasiData.id === 'utama'
                        ? 'Kampus ini diperuntukkan bagi peserta didik jenjang TK, SD, SMP, dan SMA Mentari Islamic School.'
                        : 'Kampus ini diperuntukkan khusus bagi peserta didik usia dini jenjang TPA dan Kelompok Bermain (KB) Mentari Kids.'}
                    </p>
                  </div>

                  <a
                    href={currentLokasiData.id === 'utama'
                      ? 'https://maps.app.goo.gl/PondokPesantrenTahfidzAlMahabbah'
                      : 'https://maps.app.goo.gl/MentariKids'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    <FaDirections /> Buka Petunjuk Arah di Google Maps
                  </a>
                </div>

                {/* Kolom Iframe Google Maps */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm aspect-[16/10] bg-slate-100">
                    <iframe
                      src={currentLokasiData.mapsSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={currentLokasiData.nama}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

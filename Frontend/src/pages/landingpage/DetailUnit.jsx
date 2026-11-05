import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaWhatsapp, FaCheckCircle, FaMapMarkerAlt, FaArrowRight, FaCalendarAlt, FaMoneyBillWave, FaArrowLeft, FaBan } from 'react-icons/fa';

const unitData = {
  'tpa': {
    title: 'TPA Mentari Islamic School',
    jenjang: 'Taman Pendidikan Al-Quran',
    kampus: 'Kampus PAUD Mentari Kids (Klaten)',
    alamat: 'Perkiosan Tulung No. 259, Klaten 57482',
    mapsSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63937.04533125313!2d110.62167000000001!3d-7.589258!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a6a266bb67119%3A0x5f9755dc8833e3bb!2sMentari%20Kids!5e1!3m2!1sen!2sus!4v1791777971548!5m2!1sen!2sus',
  },
  'kb': {
    title: 'KB Mentari Islamic School',
    jenjang: 'Kelompok Bermain',
    kampus: 'Kampus PAUD Mentari Kids (Klaten)',
    alamat: 'Perkiosan Tulung No. 259, Klaten 57482',
    mapsSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63937.04533125313!2d110.62167000000001!3d-7.589258!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a6a266bb67119%3A0x5f9755dc8833e3bb!2sMentari%20Kids!5e1!3m2!1sen!2sus!4v1791777971548!5m2!1sen!2sus',
  },
  'tk': {
    title: 'TK Mentari Islamic School',
    jenjang: 'Taman Kanak-Kanak',
    kampus: 'Kampus Utama PKBM Mentari (Klaten)',
    alamat: 'Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474',
    mapsSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63932.77507578455!2d110.649413!3d-7.617925!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a41e6d34c29a3%3A0x98e0e3089a3951f4!2sPondok%20Pesantren%20Tahfidz%20Al%20Mahabbah%20(PKBM%20Mentari%20Kampus%202)!5e1!3m2!1sen!2sus!4v1791777871734!5m2!1sen!2sus',
  },
  'sd': {
    title: 'SD Mentari Islamic School',
    jenjang: 'Sekolah Dasar',
    kampus: 'Kampus Utama PKBM Mentari (Klaten)',
    alamat: 'Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474',
    mapsSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63932.77507578455!2d110.649413!3d-7.617925!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a41e6d34c29a3%3A0x98e0e3089a3951f4!2sPondok%20Pesantren%20Tahfidz%20Al%20Mahabbah%20(PKBM%20Mentari%20Kampus%202)!5e1!3m2!1sen!2sus!4v1791777871734!5m2!1sen!2sus',
  },
  'smp': {
    title: 'SMP Mentari Islamic School',
    jenjang: 'Sekolah Menengah Pertama',
    kampus: 'Kampus Utama PKBM Mentari (Klaten)',
    alamat: 'Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474',
    mapsSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63932.77507578455!2d110.649413!3d-7.617925!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a41e6d34c29a3%3A0x98e0e3089a3951f4!2sPondok%20Pesantren%20Tahfidz%20Al%20Mahabbah%20(PKBM%20Mentari%20Kampus%202)!5e1!3m2!1sen!2sus!4v1791777871734!5m2!1sen!2sus',
  },
  'sma': {
    title: 'SMA Mentari Islamic School',
    jenjang: 'Sekolah Menengah Atas',
    kampus: 'Kampus Utama PKBM Mentari (Klaten)',
    alamat: 'Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474',
    mapsSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63932.77507578455!2d110.649413!3d-7.617925!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a41e6d34c29a3%3A0x98e0e3089a3951f4!2sPondok%20Pesantren%20Tahfidz%20Al%20Mahabbah%20(PKBM%20Mentari%20Kampus%202)!5e1!3m2!1sen!2sus!4v1791777871734!5m2!1sen!2sus',
  },
};

const defaultSyarat = [
  'Mengisi Formulir Pendaftaran Online',
  'Fotocopy Akta Kelahiran (1 lembar)',
  'Fotocopy Kartu Keluarga (1 lembar)',
  'Pas Foto 3x4 (4 lembar, berwarna / hitam putih)',
  'Fotocopy KPS/KKS (jika menerima)',
  'Fotocopy Ijazah/Raport Terakhir',
];

export default function DetailUnit() {
  const { id } = useParams();
  const unitKey = (id || 'sd').toLowerCase();
  const fallback = unitData[unitKey] || unitData['sd'];

  const [unitApi, setUnitApi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${getBaseApiUrl()}/units/${unitKey}/`)
      .then(res => res.json())
      .then(data => {
        if (data && data.kode) {
          setUnitApi(data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch unit detail:', err);
      })
      .finally(() => setLoading(false));
  }, [unitKey]);

  const title = unitApi?.nama || fallback.title;
  const jenjang = unitApi?.kategori_label || fallback.jenjang;
  const kampus = unitApi?.lokasi_kampus || fallback.kampus;
  const profilLembaga = unitApi?.profil_lembaga || fallback.profil;
  const deskripsi = unitApi?.deskripsi_singkat || fallback.desc;
  const syaratList = (unitApi?.syarat_pendaftaran && Array.isArray(unitApi.syarat_pendaftaran) && unitApi.syarat_pendaftaran.length > 0)
    ? unitApi.syarat_pendaftaran
    : defaultSyarat;

  const isOpen = unitApi ? unitApi.is_open : true;
  const gelombangAktif = unitApi?.nama_gelombang_aktif || 'Gelombang 1 (Early Bird)';
  const masaPendaftaran = unitApi?.masa_pendaftaran_teks || '1 Oktober - 31 Desember 2026';
  const biayaText = unitApi?.biaya_aktif ? `Rp ${unitApi.biaya_aktif.toLocaleString('id-ID')}` : 'Rp 250.000';

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-emerald-50/40 to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1">
            <FaArrowLeft className="text-xs" /> Beranda
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Kolom Kiri - 70% */}
          <div className="lg:w-[70%] space-y-6">
            {/* Profil Lembaga */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {jenjang}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  📍 {kampus}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                }`}>
                  {isOpen ? '● Pendaftaran Dibuka' : '● Pendaftaran Ditutup'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{title}</h1>

              <h2 className="text-lg font-bold text-gray-900 mb-3 text-primary">Profil Lembaga</h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                {profilLembaga || `${title} adalah salah satu unit pendidikan di bawah naungan Ma'had / PKBM Mentari Islamic School Klaten yang berkomitmen memberikan pendidikan terbaik dengan mengedepankan nilai-nilai keislaman dan adab luhur.`}
              </p>
              {deskripsi && (
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {deskripsi}
                </p>
              )}
            </div>

            {/* Syarat Pendaftaran */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 text-primary">Syarat Pendaftaran</h2>
              <ul className="space-y-3">
                {syaratList.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    <FaCheckCircle className="text-secondary mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm font-medium">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lokasi & Google Maps Live */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900 text-primary">Lokasi & Alamat Unit</h2>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                  {kampus}
                </span>
              </div>
              
              <div className="flex items-start gap-3 mb-4">
                <FaMapMarkerAlt className="text-secondary mt-1 shrink-0" />
                <p className="text-gray-700 text-sm font-medium">{fallback.alamat}</p>
              </div>

              {/* Google Maps Iframe */}
              <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm mt-3">
                <iframe
                  src={fallback.mapsSrc}
                  width="100%"
                  height="340"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={`Peta Lokasi ${title}`}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - 30% Sidebar */}
          <div className="lg:w-[30%]">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Card Info Pendaftaran */}
              <div className="bg-gradient-to-br from-primary via-emerald-800 to-[#123826] rounded-2xl p-6 text-white shadow-xl border border-emerald-700/50">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-3 ${
                  isOpen ? 'text-emerald-300 bg-white/10' : 'text-rose-200 bg-rose-900/60'
                }`}>
                  {isOpen ? 'PENDAFTARAN AKTIF' : 'PENDAFTARAN DITUTUP'}
                </span>
                <h3 className="font-extrabold text-xl mb-5">Info Pendaftaran</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                    <FaCalendarAlt className="mt-0.5 shrink-0 text-emerald-300" />
                    <div>
                      <p className="font-semibold text-white">Gelombang Aktif</p>
                      <p className="text-emerald-200 text-xs mt-0.5">{gelombangAktif}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                    <FaCalendarAlt className="mt-0.5 shrink-0 text-emerald-300" />
                    <div>
                      <p className="font-semibold text-white">Masa Pendaftaran</p>
                      <p className="text-emerald-200 text-xs mt-0.5">{masaPendaftaran}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                    <FaMoneyBillWave className="mt-0.5 shrink-0 text-emerald-300" />
                    <div>
                      <p className="font-semibold text-white">Biaya Pendaftaran</p>
                      <p className="text-emerald-200 text-xs mt-0.5">{isOpen ? biayaText : 'Pendaftaran Tutup'}</p>
                    </div>
                  </div>
                </div>

                {isOpen ? (
                  <Link
                    to={`/daftar/${unitKey}`}
                    className="mt-6 block text-center bg-gradient-to-r from-secondary to-green-500 hover:from-green-400 hover:to-secondary text-primary font-extrabold py-3.5 rounded-xl transition-all text-sm shadow-md"
                  >
                    Lanjutkan ke Pendaftaran <FaArrowRight className="inline ml-1" />
                  </Link>
                ) : (
                  <div className="mt-6 p-3.5 bg-red-950/40 border border-red-400/30 rounded-xl text-center text-xs text-rose-200">
                    <FaBan className="inline mr-1.5 text-rose-400" />
                    Pendaftaran untuk unit ini saat ini sedang tidak menerima peserta baru.
                  </div>
                )}
              </div>

              {/* Bantuan */}
              <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl shrink-0">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Butuh bantuan?</p>
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-800 hover:text-emerald-600 hover:underline">
                      Hubungi Admin Unit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

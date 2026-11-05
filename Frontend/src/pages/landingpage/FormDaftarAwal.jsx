import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaUser, FaUsers, FaChild, FaGraduationCap, FaArrowRight, FaArrowLeft,
  FaCheckCircle, FaMapMarkerAlt, FaPhoneAlt, FaCheck, FaBuilding, FaIdCard,
  FaWhatsapp
} from 'react-icons/fa';


const unitNames = {
  'tpa': 'TPA Mentari Islamic School',
  'kb': 'KB Mentari Islamic School',
  'tk': 'TK Mentari Islamic School',
  'sd': 'SD Mentari Islamic School',
  'smp': 'SMP Mentari Islamic School',
  'sma': 'SMA Mentari Islamic School',
};

export default function FormDaftarAwal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUnitId = id || 'sd';
  const unitName = unitNames[currentUnitId] || 'Unit Pendidikan MIS';

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedRegNo, setGeneratedRegNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State mencakup Bagian A s/d C (tanpa program pembelajaran)
  const [formData, setFormData] = useState({
    // Unit pilihan
    unit: currentUnitId,

    // ==========================================
    // A. KETERANGAN CALON PESERTA DIDIK
    // ==========================================
    namaLengkap: '',
    jenisKelamin: 'Laki-laki',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    agama: 'Islam',

    // Alamat Tempat Tinggal (Domisili)
    jalan: '',
    rt: '',
    rw: '',
    dusun: '',
    desaKelurahan: '',
    kecamatan: '',
    kabupaten: 'Klaten',

    // Alamat Sesuai KK
    alamatKkSama: true,
    kkJalan: '',
    kkRt: '',
    kkRw: '',
    kkDusun: '',
    kkDesaKelurahan: '',
    kkKecamatan: '',
    kkKabupaten: 'Klaten',

    tempatTinggal: 'Bersama Orang Tua',
    transportasi: 'Sepeda Motor',
    noHp: '',
    noKpsKks: '',

    // ==========================================
    // B. KETERANGAN ORANG TUA KANDUNG
    // ==========================================
    // Ayah
    namaAyah: '',
    tahunLahirAyah: '',
    pendidikanAyah: 'SMA / SMK / Sederajat',
    pekerjaanAyah: 'Wiraswasta',
    penghasilanAyah: '2 Juta s.d 4.999.999',
    statusAyah: 'Masih hidup',
    tahunMeninggalAyah: '',

    // Ibu
    namaIbu: '',
    tahunLahirIbu: '',
    pendidikanIbu: 'SMA / SMK / Sederajat',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    penghasilanIbu: '0 – 999.999',
    statusIbu: 'Masih hidup',
    tahunMeninggalIbu: '',

    // Alamat Tempat Tinggal Orang Tua
    alamatOrtuSama: true,
    ortuJalan: '',
    ortuRt: '',
    ortuRw: '',
    ortuDusun: '',
    ortuDesaKelurahan: '',
    ortuKecamatan: '',
    ortuKabupaten: 'Klaten',

    // ==========================================
    // C. DATA PERIODIK CALON PESERTA DIDIK
    // ==========================================
    tinggiBadan: '',
    beratBadan: '',
    jarakSekolah: '',
    waktuJam: '0',
    waktuMenit: '15',
    anakKe: '1',
    dariBerapaSaudara: '2',
    jumlahSaudaraKandung: '1',
    jumlahAdik: '0',
    jumlahKakak: '0',

    // Persetujuan kebenaran data
    setujuPernyataan: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.setujuPernyataan) {
      alert('Mohon centang pernyataan bahwa data yang diisi telah benar dan jelas.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${getBaseApiUrl()}/daftar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201 || response.ok) {
        const responseData = await response.json();
        setGeneratedRegNo(responseData.no_registrasi);
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response backend:', errorData);
        let errorMsg = 'Terjadi kesalahan saat menyimpan data.';
        if (errorData.unit) {
          errorMsg = Array.isArray(errorData.unit) ? errorData.unit[0] : errorData.unit;
        } else if (errorData.detail) {
          errorMsg = errorData.detail;
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Terjadi kesalahan koneksi saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanjutPembayaran = () => {
    navigate(`/tagihan/${generatedRegNo}`, {
      state: {
        nama: formData.namaLengkap,
        regNo: generatedRegNo,
        unitId: currentUnitId,
      },
    });
  };

  return (
    <div className="py-8 sm:py-14 px-3 sm:px-6 bg-gradient-to-b from-slate-100 via-emerald-50/30 to-slate-100 min-h-screen text-gray-800 relative">
      {/* Decorative ambient background glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-200/25 blur-3xl pointer-events-none rounded-full -z-0"></div>

      <div className="max-w-4xl mx-auto space-y-5 relative z-10">

        {/* Top Breadcrumb & Badge Navigation */}
        <div className="flex items-center justify-between px-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-emerald-200/80 shadow-xs"
          >
            <FaArrowLeft className="text-xs" /> Kembali ke Beranda
          </Link>
          <span className="text-xs font-bold text-emerald-800 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-emerald-200/80 shadow-xs">
            TA 2026/2027
          </span>
        </div>

        {/* ==============================================================
            THE MASTER ELEGANT CARD CONTAINER (Standout Prominent Shadow & Border)
            ============================================================== */}
        <div className="bg-white rounded-3xl border-2 border-emerald-600/20 shadow-[0_25px_60px_-15px_rgba(6,78,59,0.20)] ring-1 ring-emerald-950/5 overflow-hidden transition-all">

          
          {/* 1. KOP FORMULIR RESMI (HEADER BANNER ELEGAN) */}
          <div className="bg-gradient-to-r from-emerald-950 via-primary to-emerald-800 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <FaBuilding className="text-secondary text-2xl" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-emerald-300">
                    YAYASAN MENTARI KAYAARTA
                  </p>
                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    PKBM MENTARI KAYAARTA KLATEN
                  </h1>
                  <p className="text-xs text-emerald-200 mt-0.5 flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-secondary text-xs shrink-0" />
                    Kompleks Masjid Al Mahabbah, Lembu, Jimus, Polanharjo 57474
                  </p>
                </div>
              </div>

              {/* Unit Tag & Quick Switcher */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 self-start sm:self-center shrink-0">
                <span className="text-[10px] text-emerald-200 uppercase font-bold block mb-0.5">
                  Unit Pendaftaran
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-white">{unitName}</span>
                  <select
                    value={currentUnitId}
                    onChange={(e) => navigate(`/daftar/${e.target.value}`)}
                    className="bg-emerald-900/80 border border-white/20 rounded-lg px-2 py-0.5 text-xs text-emerald-100 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="tpa">TPA</option>
                    <option value="kb">KB</option>
                    <option value="tk">TK</option>
                    <option value="sd">SD</option>
                    <option value="smp">SMP</option>
                    <option value="sma">SMA</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Subheader Intro Bar */}
          <div className="px-6 sm:px-8 py-3.5 bg-emerald-50/70 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-extrabold text-emerald-950 uppercase tracking-wide">
              FORMULIR PENERIMAAN PESERTA DIDIK BARU (PPDB)
            </span>
            <span className="text-gray-500">
              Mohon mengisi Bagian <strong>A s/d C</strong> dengan lengkap & benar.
            </span>
          </div>

          {/* 2. FORMULIR ISI (SEAMLESS INTERNAL SECTIONS) */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-9">

            {/* ==============================================================
                BAGIAN A: KETERANGAN CALON PESERTA DIDIK
                ============================================================== */}
            <div className="space-y-5">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  A
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Keterangan Calon Peserta Didik
                  </h3>
                  <p className="text-xs text-gray-500">Identitas diri calon siswa sesuai Kartu Keluarga (KK)</p>
                </div>
              </div>

              {/* Nama Lengkap & Jenis Kelamin */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    required
                    placeholder="Nama lengkap sesuai Akta / KK"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.jenisKelamin === 'Laki-laki'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 bg-slate-50 text-gray-600 hover:bg-gray-100'
                    }`}>
                      <input
                        type="radio"
                        name="jenisKelamin"
                        value="Laki-laki"
                        checked={formData.jenisKelamin === 'Laki-laki'}
                        onChange={handleChange}
                        className="accent-emerald-700"
                      />
                      <span>Laki-laki</span>
                    </label>

                    <label className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.jenisKelamin === 'Perempuan'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 bg-slate-50 text-gray-600 hover:bg-gray-100'
                    }`}>
                      <input
                        type="radio"
                        name="jenisKelamin"
                        value="Perempuan"
                        checked={formData.jenisKelamin === 'Perempuan'}
                        onChange={handleChange}
                        className="accent-emerald-700"
                      />
                      <span>Perempuan</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* NIK & Agama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    NIK (Nomor Induk Kependudukan / Keluarga) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleChange}
                    required
                    placeholder="16 digit angka sesuai KK"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 font-mono tracking-wider focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Agama <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="agama"
                    value={formData.agama}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Budha</option>
                    <option value="Kong Hu Cu">Kong Hu Cu</option>
                  </select>
                </div>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Klaten"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Tanggal, Bulan, Tahun Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Alamat Tempat Tinggal (Domisili) */}
              <div className="p-4 bg-slate-50/70 border border-gray-200 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Alamat Tempat Tinggal (Domisili Sekarang) <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="jalan"
                  value={formData.jalan}
                  onChange={handleChange}
                  required
                  placeholder="Jln. / Dukuh / No. Rumah"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:border-emerald-600 outline-none"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <input
                    type="text"
                    name="rt"
                    value={formData.rt}
                    onChange={handleChange}
                    placeholder="RT"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-emerald-600 outline-none"
                  />
                  <input
                    type="text"
                    name="rw"
                    value={formData.rw}
                    onChange={handleChange}
                    placeholder="RW"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-emerald-600 outline-none"
                  />
                  <input
                    type="text"
                    name="dusun"
                    value={formData.dusun}
                    onChange={handleChange}
                    placeholder="Dsn. (Dusun)"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-emerald-600 outline-none"
                  />
                  <input
                    type="text"
                    name="desaKelurahan"
                    value={formData.desaKelurahan}
                    onChange={handleChange}
                    placeholder="Ds./Kelurahan"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleChange}
                    placeholder="Kecamatan"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-emerald-600 outline-none"
                  />
                  <input
                    type="text"
                    name="kabupaten"
                    value={formData.kabupaten}
                    onChange={handleChange}
                    placeholder="Kabupaten / Kota"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Alamat Sesuai KK */}
              <div className="p-4 bg-slate-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Alamat Sesuai Kartu Keluarga (KK) <span className="text-red-500">*</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 cursor-pointer">
                    <input
                      type="checkbox"
                      name="alamatKkSama"
                      checked={formData.alamatKkSama}
                      onChange={handleChange}
                      className="w-4 h-4 accent-emerald-700 rounded"
                    />
                    <span>Sama dengan Alamat Tempat Tinggal</span>
                  </label>
                </div>

                {!formData.alamatKkSama ? (
                  <div className="space-y-2.5 pt-1">
                    <input
                      type="text"
                      name="kkJalan"
                      value={formData.kkJalan}
                      onChange={handleChange}
                      placeholder="Jln. / Dukuh / No. Rumah (sesuai KK)"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        name="kkRt"
                        value={formData.kkRt}
                        onChange={handleChange}
                        placeholder="RT (KK)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        name="kkRw"
                        value={formData.kkRw}
                        onChange={handleChange}
                        placeholder="RW (KK)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        name="kkDusun"
                        value={formData.kkDusun}
                        onChange={handleChange}
                        placeholder="Dsn. (KK)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        name="kkDesaKelurahan"
                        value={formData.kkDesaKelurahan}
                        onChange={handleChange}
                        placeholder="Ds./Kel. (KK)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        name="kkKecamatan"
                        value={formData.kkKecamatan}
                        onChange={handleChange}
                        placeholder="Kecamatan (KK)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        name="kkKabupaten"
                        value={formData.kkKabupaten}
                        onChange={handleChange}
                        placeholder="Kabupaten (KK)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-800 flex items-center gap-1.5 pt-1 font-medium">
                    <FaCheck className="text-secondary text-[11px]" />
                    Alamat KK disamakan otomatis dengan alamat tempat tinggal.
                  </p>
                )}
              </div>

              {/* Status Tinggal, Mode Transportasi, No HP, No KPS/KKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Tempat Tinggal <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tempatTinggal"
                    value={formData.tempatTinggal}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="Bersama Orang Tua">Bersama Orang Tua</option>
                    <option value="Kost">Kost</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Transportasi Ke Sekolah <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="transportasi"
                    value={formData.transportasi}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="Sepeda Motor">Sepeda Motor</option>
                    <option value="Jalan Kaki">Jalan Kaki</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    No. Telp / HP (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="noHp"
                    value={formData.noHp}
                    onChange={handleChange}
                    required
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    No. KPS / KKS <span className="text-gray-400 font-normal">(Jika menerima)</span>
                  </label>
                  <input
                    type="text"
                    name="noKpsKks"
                    value={formData.noKpsKks}
                    onChange={handleChange}
                    placeholder="Kosongkan bila tidak ada"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-emerald-600 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* ==============================================================
                BAGIAN B: KETERANGAN ORANG TUA KANDUNG
                ============================================================== */}
            <div className="space-y-5 pt-4 border-t border-gray-100">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  B
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Keterangan Orang Tua Kandung
                  </h3>
                  <p className="text-xs text-gray-500">Data identitas Ayah & Ibu kandung</p>
                </div>
              </div>

              {/* 2 Kolom: Data Ayah & Data Ibu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Kolom 1: Data Ayah */}
                <div className="p-4 sm:p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                      Data Ayah Kandung
                    </span>
                    
                    {/* Status Ayah */}
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="statusAyah"
                          value="Masih hidup"
                          checked={formData.statusAyah === 'Masih hidup'}
                          onChange={handleChange}
                          className="accent-emerald-700"
                        />
                        <span>Masih hidup</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="statusAyah"
                          value="Meninggal"
                          checked={formData.statusAyah === 'Meninggal'}
                          onChange={handleChange}
                          className="accent-emerald-700"
                        />
                        <span>Meninggal</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nama Lengkap Ayah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaAyah"
                      value={formData.namaAyah}
                      onChange={handleChange}
                      required
                      placeholder="Nama lengkap ayah"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Tahun Lahir Ayah <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="tahunLahirAyah"
                        value={formData.tahunLahirAyah}
                        onChange={handleChange}
                        required
                        placeholder="Contoh: 1980"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                      />
                    </div>

                    {formData.statusAyah === 'Meninggal' && (
                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1">
                          Tahun Meninggal
                        </label>
                        <input
                          type="number"
                          name="tahunMeninggalAyah"
                          value={formData.tahunMeninggalAyah}
                          onChange={handleChange}
                          placeholder="Tahun"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-amber-600 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Pendidikan Terakhir Ayah <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="pendidikanAyah"
                      value={formData.pendidikanAyah}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    >
                      <option value="Tidak Sekolah">Tidak Sekolah</option>
                      <option value="SD / Sederajat">SD / Sederajat</option>
                      <option value="SMP / Sederajat">SMP / Sederajat</option>
                      <option value="SMA / SMK / Sederajat">SMA / SMK / Sederajat</option>
                      <option value="D1 / D2 / D3">D1 / D2 / D3</option>
                      <option value="S1 / D4">S1 / D4</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Pekerjaan Ayah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pekerjaanAyah"
                      value={formData.pekerjaanAyah}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: Wiraswasta / Karyawan"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Penghasilan Rata-rata/Bulan (Rp) <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="penghasilanAyah"
                      value={formData.penghasilanAyah}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    >
                      <option value="0 – 999.999">0 – 999.999</option>
                      <option value="1 Juta – 1.999.999">1 Juta – 1.999.999</option>
                      <option value="2 Juta s.d 4.999.999">2 Juta s.d 4.999.999</option>
                      <option value="5 Juta – 20 Juta">5 Juta – 20 Juta</option>
                    </select>
                  </div>
                </div>

                {/* Kolom 2: Data Ibu */}
                <div className="p-4 sm:p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                      Data Ibu Kandung
                    </span>
                    
                    {/* Status Ibu */}
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="statusIbu"
                          value="Masih hidup"
                          checked={formData.statusIbu === 'Masih hidup'}
                          onChange={handleChange}
                          className="accent-emerald-700"
                        />
                        <span>Masih hidup</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="statusIbu"
                          value="Meninggal"
                          checked={formData.statusIbu === 'Meninggal'}
                          onChange={handleChange}
                          className="accent-emerald-700"
                        />
                        <span>Meninggal</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nama Lengkap Ibu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaIbu"
                      value={formData.namaIbu}
                      onChange={handleChange}
                      required
                      placeholder="Nama lengkap ibu"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Tahun Lahir Ibu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="tahunLahirIbu"
                        value={formData.tahunLahirIbu}
                        onChange={handleChange}
                        required
                        placeholder="Contoh: 1983"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                      />
                    </div>

                    {formData.statusIbu === 'Meninggal' && (
                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1">
                          Tahun Meninggal
                        </label>
                        <input
                          type="number"
                          name="tahunMeninggalIbu"
                          value={formData.tahunMeninggalIbu}
                          onChange={handleChange}
                          placeholder="Tahun"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-amber-600 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Pendidikan Terakhir Ibu <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="pendidikanIbu"
                      value={formData.pendidikanIbu}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    >
                      <option value="Tidak Sekolah">Tidak Sekolah</option>
                      <option value="SD / Sederajat">SD / Sederajat</option>
                      <option value="SMP / Sederajat">SMP / Sederajat</option>
                      <option value="SMA / SMK / Sederajat">SMA / SMK / Sederajat</option>
                      <option value="D1 / D2 / D3">D1 / D2 / D3</option>
                      <option value="S1 / D4">S1 / D4</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Pekerjaan Ibu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pekerjaanIbu"
                      value={formData.pekerjaanIbu}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: Ibu Rumah Tangga / Karyawan"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Penghasilan Rata-rata/Bulan (Rp) <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="penghasilanIbu"
                      value={formData.penghasilanIbu}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    >
                      <option value="0 – 999.999">0 – 999.999</option>
                      <option value="1 Juta – 1.999.999">1 Juta – 1.999.999</option>
                      <option value="2 Juta s.d 4.999.999">2 Juta s.d 4.999.999</option>
                      <option value="5 Juta – 20 Juta">5 Juta – 20 Juta</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Alamat Orang Tua */}
              <div className="p-4 bg-slate-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Alamat Tempat Tinggal Orang Tua <span className="text-red-500">*</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 cursor-pointer">
                    <input
                      type="checkbox"
                      name="alamatOrtuSama"
                      checked={formData.alamatOrtuSama}
                      onChange={handleChange}
                      className="w-4 h-4 accent-emerald-700 rounded"
                    />
                    <span>Sama dengan Alamat Calon Siswa</span>
                  </label>
                </div>

                {!formData.alamatOrtuSama ? (
                  <div className="space-y-2.5 pt-1">
                    <input
                      type="text"
                      name="ortuJalan"
                      value={formData.ortuJalan}
                      onChange={handleChange}
                      placeholder="Jln. / Dukuh / No. Rumah Orang Tua"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:border-emerald-600 outline-none"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        name="ortuRt"
                        value={formData.ortuRt}
                        onChange={handleChange}
                        placeholder="RT"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        name="ortuRw"
                        value={formData.ortuRw}
                        onChange={handleChange}
                        placeholder="RW"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        name="ortuDusun"
                        value={formData.ortuDusun}
                        onChange={handleChange}
                        placeholder="Dsn."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        name="ortuDesaKelurahan"
                        value={formData.ortuDesaKelurahan}
                        onChange={handleChange}
                        placeholder="Ds./Kel."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        name="ortuKecamatan"
                        value={formData.ortuKecamatan}
                        onChange={handleChange}
                        placeholder="Kecamatan"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                      <input
                        type="text"
                        name="ortuKabupaten"
                        value={formData.ortuKabupaten}
                        onChange={handleChange}
                        placeholder="Kabupaten"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-800 flex items-center gap-1.5 pt-1 font-medium">
                    <FaCheck className="text-secondary text-[11px]" />
                    Alamat tempat tinggal orang tua disamakan dengan alamat calon siswa.
                  </p>
                )}
              </div>
            </div>

            {/* ==============================================================
                BAGIAN C: DATA PERIODIK CALON PESERTA DIDIK
                ============================================================== */}
            <div className="space-y-5 pt-4 border-t border-gray-100">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  C
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Data Periodik Calon Peserta Didik
                  </h3>
                  <p className="text-xs text-gray-500">Ukuran fisik, waktu tempuh, dan urutan keluarga</p>
                </div>
              </div>

              {/* Tinggi Badan, Berat Badan, Jarak Rumah, Waktu Tempuh */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tinggi Badan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="tinggiBadan"
                      value={formData.tinggiBadan}
                      onChange={handleChange}
                      required
                      placeholder="140"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 pr-10 focus:bg-white focus:border-emerald-600 outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 font-bold">
                      cm
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Berat Badan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="beratBadan"
                      value={formData.beratBadan}
                      onChange={handleChange}
                      required
                      placeholder="35"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 pr-10 focus:bg-white focus:border-emerald-600 outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 font-bold">
                      kg
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Jarak Ke Sekolah <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      name="jarakSekolah"
                      value={formData.jarakSekolah}
                      onChange={handleChange}
                      required
                      placeholder="2.5"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 pr-10 focus:bg-white focus:border-emerald-600 outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 font-bold">
                      km
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Waktu Tempuh <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="relative">
                      <input
                        type="number"
                        name="waktuJam"
                        value={formData.waktuJam}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2 py-2.5 text-xs text-gray-900 pr-7 focus:bg-white focus:border-emerald-600 outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 pr-1.5 flex items-center text-[10px] text-gray-400 font-bold">
                        jam
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        name="waktuMenit"
                        value={formData.waktuMenit}
                        onChange={handleChange}
                        required
                        placeholder="15"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2 py-2.5 text-xs text-gray-900 pr-9 focus:bg-white focus:border-emerald-600 outline-none"
                      />
                      <span className="absolute inset-y-0 right-0 pr-1.5 flex items-center text-[10px] text-gray-400 font-bold">
                        mnt
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anak Ke & Jumlah Saudara */}
              <div className="p-4 bg-slate-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700 shrink-0">Anak ke-</span>
                    <input
                      type="number"
                      name="anakKe"
                      min="1"
                      value={formData.anakKe}
                      onChange={handleChange}
                      required
                      placeholder="1"
                      className="w-20 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-900 text-center outline-none focus:border-emerald-600"
                    />
                    <span className="text-xs font-bold text-gray-700 shrink-0">dari</span>
                    <input
                      type="number"
                      name="dariBerapaSaudara"
                      min="1"
                      value={formData.dariBerapaSaudara}
                      onChange={handleChange}
                      required
                      placeholder="2"
                      className="w-20 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-900 text-center outline-none focus:border-emerald-600"
                    />
                    <span className="text-xs font-bold text-gray-700 shrink-0">saudara</span>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="text-xs font-bold text-gray-700 shrink-0">Jumlah Saudara Kandung:</span>
                    <input
                      type="number"
                      name="jumlahSaudaraKandung"
                      min="0"
                      value={formData.jumlahSaudaraKandung}
                      onChange={handleChange}
                      placeholder="1"
                      className="w-20 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-900 text-center outline-none focus:border-emerald-600"
                    />
                    <span className="text-xs text-gray-500 font-semibold">orang</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Jumlah adik:</span>
                    <input
                      type="number"
                      name="jumlahAdik"
                      min="0"
                      value={formData.jumlahAdik}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-900 text-center outline-none focus:border-emerald-600"
                    />
                    <span>orang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Jumlah kakak:</span>
                    <input
                      type="number"
                      name="jumlahKakak"
                      min="0"
                      value={formData.jumlahKakak}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-900 text-center outline-none focus:border-emerald-600"
                    />
                    <span>orang</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==============================================================
                FOOTER CARD: PERNYATAAN & TOMBOL SUBMIT (CENTERED & LINKS)
                ============================================================== */}
            <div className="pt-6 border-t border-gray-100 space-y-6">
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/90 hover:bg-emerald-50 transition-colors">
                <input
                  type="checkbox"
                  name="setujuPernyataan"
                  checked={formData.setujuPernyataan}
                  onChange={handleChange}
                  required
                  className="mt-0.5 w-4 h-4 accent-emerald-700 rounded cursor-pointer shrink-0"
                />
                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <strong>Pernyataan:</strong> Saya menyatakan bahwa seluruh data yang diisikan pada formulir pendaftaran ini (Bagian A, B, dan C) adalah benar, jelas, dan dapat dipertanggungjawabkan sesuai dokumen resmi.
                </span>
              </label>

              {/* Tombol Daftar Sekarang (Panjang Full / w-full) */}
              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 via-primary to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-4 px-6 rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:scale-[1.005] active:scale-[0.995] flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Mengirim Formulir...' : 'Daftar Sekarang'}</span>
                  <FaArrowRight className="text-sm group-hover:translate-x-1.5 transition-transform" />
                </button>

                {/* Tulisan: Sudah mendaftar sebelumnya? Cek Status / Login */}
                <p className="text-xs sm:text-sm text-gray-600 text-center font-medium">
                  Sudah mendaftar sebelumnya?{' '}
                  <Link
                    to="/login?tab=status"
                    className="font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500 underline-offset-4 transition-colors"
                  >
                    Cek Status
                  </Link>
                  {' '}/{' '}
                  <Link
                    to="/login?tab=login"
                    className="font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500 underline-offset-4 transition-colors"
                  >
                    Login
                  </Link>

                </p>

                {/* Bagian Butuh Bantuan (Heading & Tombol Full-Width) */}
                <div className="pt-3 border-t border-gray-100 text-center space-y-2.5">
                  <p className="text-xs sm:text-sm font-bold text-gray-700">
                    Butuh bantuan ?
                  </p>
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Admin%20Mentari%20Islamic%20School,%20saya%20butuh%20bantuan%20terkait%20formulir%20pendaftaran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 hover:text-emerald-950 border-2 border-emerald-300/80 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <FaPhoneAlt className="text-emerald-700 text-sm" />
                    <span>Hubungi admin via Whatsapp</span>
                  </a>
                </div>
              </div>
            </div>

          </form>

        </div>

        {/* MODAL KONFIRMASI SUKSES PENDAFTARAN */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in duration-200">
              
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl mb-3.5 shadow-inner">
                <FaCheckCircle />
              </div>

              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1.5">
                Formulir Berhasil Dikirim!
              </h3>

              <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                Data pendaftaran calon peserta didik telah tersimpan di sistem PPDB PKBM Mentari Kayaarta Klaten. Silakan lanjutkan ke pembayaran tagihan pendaftaran.
              </p>

              {/* Ringkasan */}
              <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 text-left text-xs space-y-2 mb-5">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">No. Pendaftaran:</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded">
                    {generatedRegNo}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Nama Calon Siswa:</span>
                  <span className="font-bold text-gray-900">{formData.namaLengkap}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Unit Sekolah:</span>
                  <span className="font-semibold text-gray-900">{unitName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleLanjutPembayaran}
                  className="w-full bg-gradient-to-r from-emerald-700 to-primary hover:from-emerald-800 hover:to-emerald-950 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lanjutkan ke Pembayaran Tagihan</span>
                  <FaArrowRight className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tutup & Tinjau Kembali
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

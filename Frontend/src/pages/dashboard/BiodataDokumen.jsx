import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaFileUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaExternalLinkAlt,
  FaSpinner,
  FaEdit,
  FaSave,
  FaTimes,
  FaIdCard,
  FaMapMarkerAlt,
  FaUserFriends,
  FaRuler,
  FaInfoCircle,
  FaCheck
} from 'react-icons/fa';

export default function BiodataDokumen() {
  const navigate = useNavigate();
  const [dataSiswa, setDataSiswa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message: '' }

  // Form Edit State
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nik: '',
    jenis_kelamin: 'Laki-laki',
    tempat_lahir: '',
    tanggal_lahir: '',
    agama: 'Islam',
    jalan: '',
    rt: '',
    rw: '',
    dusun: '',
    desa_kelurahan: '',
    kecamatan: '',
    kabupaten: 'Klaten',
    no_hp: '',
    transportasi: '',
    tempat_tinggal: 'Bersama Orang Tua',
    nama_ayah: '',
    pendidikan_ayah: '',
    pekerjaan_ayah: '',
    penghasilan_ayah: '',
    nama_ibu: '',
    pendidikan_ibu: '',
    pekerjaan_ibu: '',
    penghasilan_ibu: '',
    tinggi_badan: '',
    berat_badan: '',
    anak_ke: '',
    dari_berapa_saudara: '',
    jumlah_saudara_kandung: ''
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const fetchProfile = async () => {
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
        populateFormData(result);

        if (result.nama_lengkap) {
          localStorage.setItem('user_name', result.nama_lengkap);
          window.dispatchEvent(new Event('user_profile_updated'));
        }
      } else {
        localStorage.removeItem('access_token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const populateFormData = (data) => {
    setFormData({
      nama_lengkap: data.nama_lengkap || '',
      nik: data.nik || '',
      jenis_kelamin: data.jenis_kelamin || 'Laki-laki',
      tempat_lahir: data.tempat_lahir || '',
      tanggal_lahir: data.tanggal_lahir || '',
      agama: data.agama || 'Islam',
      jalan: data.jalan || '',
      rt: data.rt || '',
      rw: data.rw || '',
      dusun: data.dusun || '',
      desa_kelurahan: data.desa_kelurahan || '',
      kecamatan: data.kecamatan || '',
      kabupaten: data.kabupaten || 'Klaten',
      no_hp: data.no_hp || '',
      transportasi: data.transportasi || '',
      tempat_tinggal: data.tempat_tinggal || 'Bersama Orang Tua',
      nama_ayah: data.nama_ayah || '',
      pendidikan_ayah: data.pendidikan_ayah || '',
      pekerjaan_ayah: data.pekerjaan_ayah || '',
      penghasilan_ayah: data.penghasilan_ayah || '',
      nama_ibu: data.nama_ibu || '',
      pendidikan_ibu: data.pendidikan_ibu || '',
      pekerjaan_ibu: data.pekerjaan_ibu || '',
      penghasilan_ibu: data.penghasilan_ibu || '',
      tinggi_badan: data.tinggi_badan || '',
      berat_badan: data.berat_badan || '',
      anak_ke: data.anak_ke || '',
      dari_berapa_saudara: data.dari_berapa_saudara || '',
      jumlah_saudara_kandung: data.jumlah_saudara_kandung || ''
    });
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBiodata = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:8000/api/dashboard-data/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updated = await res.json();
        setDataSiswa(updated);
        populateFormData(updated);
        setIsEditing(false);

        if (updated.nama_lengkap) {
          localStorage.setItem('user_name', updated.nama_lengkap);
          window.dispatchEvent(new Event('user_profile_updated'));
        }

        showNotification('Biodata calon santri berhasil diperbarui!');
      } else {
        const errData = await res.json().catch(() => ({}));
        showNotification(
          `Gagal menyimpan data: ${JSON.stringify(errData)}`,
          'error'
        );
      }
    } catch (err) {
      console.error('Error saving biodata:', err);
      showNotification('Koneksi terputus saat menyimpan data.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (docId, file) => {
    if (!file) return;

    // Validasi ukuran maks 2MB
    if (file.size > 2 * 1024 * 1024) {
      showNotification('Ukuran file melebihi batas maksimal 2 MB.', 'error');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const fieldMap = {
      foto: 'file_foto',
      kk: 'file_kk',
      akta: 'file_akta',
      ijazah: 'file_ijazah'
    };
    const fieldName = fieldMap[docId];
    if (!fieldName) return;

    const bodyFormData = new FormData();
    bodyFormData.append(fieldName, file);

    setUploadingDoc(docId);

    try {
      const res = await fetch('http://localhost:8000/api/upload-dokumen/', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: bodyFormData
      });

      if (res.ok) {
        const updated = await res.json();
        setDataSiswa(updated);
        showNotification(`Dokumen persyaratan berhasil diunggah! Status: Menunggu Verifikasi.`);
      } else {
        showNotification('Gagal mengunggah dokumen. Silakan periksa format file.', 'error');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      showNotification('Koneksi terputus saat mengunggah dokumen.', 'error');
    } finally {
      setUploadingDoc(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-500 font-semibold flex flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-secondary text-3xl" />
        <span className="text-sm font-medium">Memuat data biodata & dokumen...</span>
      </div>
    );
  }

  if (!dataSiswa) return null;

  const isDocComplete =
    dataSiswa.status_dokumen?.toUpperCase() === 'LENGKAP' ||
    dataSiswa.status_dokumen?.toUpperCase() === 'VERIFIED';

  // Metadata 4 Dokumen Persyaratan Digital
  const documentConfigs = [
    {
      id: 'foto',
      fieldKey: 'file_foto',
      title: 'Pas Foto Calon Santri (3x4)',
      notes: 'Latar belakang merah atau biru, berpakaian muslim sopan (Maks. 2MB)',
      themeColor: 'from-blue-500 to-indigo-600',
      borderAccent: 'border-l-4 border-l-blue-500',
      fileUrl: dataSiswa.file_foto
    },
    {
      id: 'kk',
      fieldKey: 'file_kk',
      title: 'Kartu Keluarga (KK)',
      notes: 'Scan / foto asli Kartu Keluarga yang jelas dan terbaca (PDF/JPG)',
      themeColor: 'from-emerald-500 to-teal-600',
      borderAccent: 'border-l-4 border-l-emerald-500',
      fileUrl: dataSiswa.file_kk
    },
    {
      id: 'akta',
      fieldKey: 'file_akta',
      title: 'Akta Kelahiran Santri',
      notes: 'Scan dokumen akta kelahiran resmi catatan sipil (PDF/JPG)',
      themeColor: 'from-amber-500 to-orange-600',
      borderAccent: 'border-l-4 border-l-amber-500',
      fileUrl: dataSiswa.file_akta
    },
    {
      id: 'ijazah',
      fieldKey: 'file_ijazah',
      title: 'Ijazah / SKL / Rapor Terakhir',
      notes: 'Bisa disusulkan jika belum diterbitkan dari sekolah asal (PDF/JPG)',
      themeColor: 'from-purple-500 to-fuchsia-600',
      borderAccent: 'border-l-4 border-l-purple-500',
      fileUrl: dataSiswa.file_ijazah
    }
  ];

  const getStatusBadge = (fileUrl, statusDokumen) => {
    if (fileUrl) {
      if (statusDokumen === 'VERIFIED' || statusDokumen === 'LENGKAP') {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <FaCheckCircle className="text-xs text-emerald-600" />
            Terverifikasi
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <FaClock className="text-xs text-amber-600" />
          Menunggu Verifikasi
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
        <FaExclamationCircle className="text-xs text-rose-600" />
        Belum Diunggah
      </span>
    );
  };

  const getCleanFileName = (path) => {
    if (!path) return '';
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Pop-up */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-bold ${
              notification.type === 'success'
                ? 'bg-emerald-800 text-white border-emerald-600'
                : 'bg-rose-800 text-white border-rose-600'
            }`}
          >
            {notification.type === 'success' ? (
              <FaCheckCircle className="text-lg text-emerald-300" />
            ) : (
              <FaExclamationCircle className="text-lg text-rose-300" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* ==============================================================
          1. HEADER CARD (Identitas Santri & Tombol Mode Edit)
          ============================================================== */}
      <div className="bg-white rounded-[10px] p-5 sm:p-6 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center text-2xl font-bold shadow-xs shrink-0">
              <FaIdCard />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {dataSiswa.no_registrasi || 'MIS-2026'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-300">
                  Unit: {dataSiswa.unit || 'SD'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                  isDocComplete ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  Berkas: {dataSiswa.status_dokumen || 'BELUM LENGKAP'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Biodata Santri & Dokumen Persyaratan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Pastikan data identitas diri, orang tua/wali, serta dokumen digital terunggah dengan valid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <FaEdit />
                <span>Edit Biodata</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  populateFormData(dataSiswa);
                  setIsEditing(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 transition-all cursor-pointer"
              >
                <FaTimes />
                <span>Batal Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==============================================================
          2. FORM BIODATA (BISA DIEDIT DENGAN TOMBOL SIMPAN)
          ============================================================== */}
      <div className="bg-white rounded-[10px] p-6 border-t-[5px] border-[#5294A9] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center font-bold text-sm">
              <FaUser />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">
                Data Identitas Calon Santri & Orang Tua
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Mode Edit Aktif: Ubah data di bawah kemudian klik Simpan Perubahan' : 'Mode Tinjauan: Klik tombol "Edit Biodata" di atas untuk mengubah data'}
              </p>
            </div>
          </div>
          <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full border ${
            isEditing ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            {isEditing ? 'Mode Edit' : 'Mode Baca'}
          </span>
        </div>

        <form onSubmit={handleSaveBiodata} className="space-y-6">
          {/* BAGIAN A: DATA PRIBADI SANTRI */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <FaIdCard className="text-secondary" />
              A. Keterangan Calon Peserta Didik
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap Santri <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-bold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  NIK Santri (16 Digit)
                </label>
                <input
                  type="text"
                  name="nik"
                  maxLength={16}
                  value={formData.nik}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-mono font-bold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jenis Kelamin
                </label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900 cursor-pointer'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900 cursor-pointer'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Agama
                </label>
                <input
                  type="text"
                  name="agama"
                  value={formData.agama}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* BAGIAN B: ALAMAT & KONTAK */}
          <div className="space-y-4 pt-3">
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <FaMapMarkerAlt className="text-secondary" />
              B. Alamat Domisili & Kontak Wali
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alamat Jalan / Dusun
                </label>
                <input
                  type="text"
                  name="jalan"
                  value={formData.jalan}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Contoh: Jl. Delanggu No. 12"
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  No. WhatsApp / HP Wali <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  placeholder="Contoh: 081234567890"
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-mono font-bold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Desa / Kelurahan
                </label>
                <input
                  type="text"
                  name="desa_kelurahan"
                  value={formData.desa_kelurahan}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kecamatan
                </label>
                <input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kabupaten / Kota
                </label>
                <input
                  type="text"
                  name="kabupaten"
                  value={formData.kabupaten}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* BAGIAN C: DATA ORANG TUA KANDUNG */}
          <div className="space-y-4 pt-3">
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <FaUserFriends className="text-secondary" />
              C. Keterangan Orang Tua Kandung
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Ayah Kandung
                </label>
                <input
                  type="text"
                  name="nama_ayah"
                  value={formData.nama_ayah}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pekerjaan Ayah
                </label>
                <input
                  type="text"
                  name="pekerjaan_ayah"
                  value={formData.pekerjaan_ayah}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Ibu Kandung
                </label>
                <input
                  type="text"
                  name="nama_ibu"
                  value={formData.nama_ibu}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pekerjaan Ibu
                </label>
                <input
                  type="text"
                  name="pekerjaan_ibu"
                  value={formData.pekerjaan_ibu}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* BAGIAN D: DATA PERIODIK */}
          <div className="space-y-4 pt-3">
            <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <FaRuler className="text-secondary" />
              D. Data Periodik Santri
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="text"
                  name="tinggi_badan"
                  value={formData.tinggi_badan}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Contoh: 125"
                  className={`w-full text-xs sm:text-sm rounded-lg px-3 py-2 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Berat Badan (kg)
                </label>
                <input
                  type="text"
                  name="berat_badan"
                  value={formData.berat_badan}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Contoh: 28"
                  className={`w-full text-xs sm:text-sm rounded-lg px-3 py-2 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Anak Ke-
                </label>
                <input
                  type="text"
                  name="anak_ke"
                  value={formData.anak_ke}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Contoh: 2"
                  className={`w-full text-xs sm:text-sm rounded-lg px-3 py-2 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jumlah Saudara
                </label>
                <input
                  type="text"
                  name="jumlah_saudara_kandung"
                  value={formData.jumlah_saudara_kandung}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Contoh: 3"
                  className={`w-full text-xs sm:text-sm rounded-lg px-3 py-2 outline-none font-semibold transition-all ${
                    isEditing
                      ? 'bg-white border border-gray-300 focus:border-[#2ECC71] shadow-xs text-slate-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Saat Mode Edit */}
          {isEditing && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  populateFormData(dataSiswa);
                  setIsEditing(false);
                }}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Simpan Perubahan Biodata</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ==============================================================
          3. BAGIAN UNGGAH DOKUMEN PERSYARATAN DIGITAL (SANGAT MENARIK)
          ============================================================== */}
      <div className="bg-white rounded-[10px] p-6 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-base shadow-xs">
              <FaFileUpload />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Unggah Berkas Persyaratan Digital
              </h2>
              <p className="text-xs text-slate-500">
                Format yang didukung: JPG, PNG, atau PDF (Ukuran maksimal file: 2 MB per berkas)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Wajib untuk Verifikasi Kelulusan
          </span>
        </div>

        {/* 4 Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentConfigs.map((doc) => {
            const isUploadingThis = uploadingDoc === doc.id;
            const hasFile = Boolean(doc.fileUrl);
            const cleanName = getCleanFileName(doc.fileUrl);

            return (
              <div
                key={doc.id}
                className={`p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-xs flex flex-col justify-between gap-3.5 ${doc.borderAccent}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-slate-900 text-sm leading-snug">
                      {doc.title}
                    </h3>
                    <div>{getStatusBadge(doc.fileUrl, dataSiswa.status_dokumen)}</div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {doc.notes}
                  </p>
                </div>

                {/* File preview jika sudah ada */}
                {hasFile && (
                  <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                    <span className="truncate max-w-[200px] font-mono text-[11px] font-bold text-slate-800">
                      📄 {cleanName}
                    </span>
                    <a
                      href={
                        doc.fileUrl.startsWith('http')
                          ? doc.fileUrl
                          : `http://localhost:8000${doc.fileUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 hover:text-emerald-950 font-black hover:underline shrink-0"
                    >
                      <span>Lihat File</span>
                      <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  </div>
                )}

                {/* Tombol Aksi Upload */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <label
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:border-secondary hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs font-black shadow-xs transition-all ${
                      isUploadingThis ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploadingThis ? (
                      <>
                        <FaSpinner className="animate-spin text-secondary" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <FaFileUpload className="text-secondary" />
                        <span>{hasFile ? 'Ganti Dokumen' : 'Pilih File'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      disabled={isUploadingThis}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(doc.id, file);
                      }}
                    />
                  </label>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {hasFile ? 'Tersimpan di Cloud' : 'Wajib diisi'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
          <FaInfoCircle className="text-secondary text-base shrink-0" />
          <span>
            Seluruh dokumen digital yang Anda unggah akan diverifikasi oleh tim panitia seleksi. Anda dapat memperbarui dokumen sewaktu-waktu selama masa seleksi belum ditutup.
          </span>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FaSchool,
  FaSave,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaClock,
  FaTimes,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaExclamationTriangle
} from 'react-icons/fa';
import SuccessNotification from '../../components/common/SuccessNotification';

const KAMPUS_OPTIONS = [
  'Kampus Utama PKBM Mentari (Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474)',
  'Kampus 2 (Perkiosan Tulung No. 259, Klaten 57482)'
];

export default function AdminUnitManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKode = searchParams.get('kode') || 'tpa';

  const [units, setUnits] = useState([]);
  const [activeKode, setActiveKode] = useState(initialKode.toLowerCase());
  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Notification State
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Form State Bagian A & B
  const [formData, setFormData] = useState({
    nama: '',
    kategori_label: '',
    lokasi_kampus: '',
    deskripsi_singkat: '',
    profil_lembaga: '',
    is_active: true,
    syarat_pendaftaran: [],
  });

  // Modal State untuk Tambah Unit Baru
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [newUnitForm, setNewUnitForm] = useState({
    nama: '',
    kode: '',
    kategori_label: '',
    lokasi_kampus: KAMPUS_OPTIONS[0],
    deskripsi_singkat: '',
    profil_lembaga: '',
    is_active: true,
  });

  // Modal State untuk Gelombang (Add / Edit)
  const [isWaveModalOpen, setIsWaveModalOpen] = useState(false);
  const [editingWave, setEditingWave] = useState(null);
  const [waveForm, setWaveForm] = useState({
    nama_gelombang: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    biaya_pendaftaran: 250000,
    is_aktif: true,
  });

  // Fetch list of all units
  const fetchUnitsList = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/units/');
      if (res.ok) {
        const data = await res.json();
        setUnits(data);
        return data;
      }
    } catch (err) {
      console.error('Error fetching units list:', err);
    }
    return [];
  };

  // Fetch detail unit saat activeKode berubah
  const fetchUnit = async (kode) => {
    if (!kode) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/units/${kode}/`);
      if (res.ok) {
        const data = await res.json();
        setUnitData(data);
        setFormData({
          nama: data.nama || '',
          kategori_label: data.kategori_label || '',
          lokasi_kampus: data.lokasi_kampus || '',
          deskripsi_singkat: data.deskripsi_singkat || '',
          profil_lembaga: data.profil_lembaga || '',
          is_active: data.is_active ?? true,
          syarat_pendaftaran: Array.isArray(data.syarat_pendaftaran) ? data.syarat_pendaftaran : [],
        });
      }
    } catch (err) {
      console.error('Error fetching unit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitsList().then((list) => {
      if (list && list.length > 0) {
        const target = list.find((u) => u.kode?.toLowerCase() === activeKode) || list[0];
        setActiveKode(target.kode?.toLowerCase());
        fetchUnit(target.kode?.toLowerCase());
      }
    });
  }, []);

  const handleTabChange = (kode) => {
    const k = kode?.toLowerCase();
    setActiveKode(k);
    setSearchParams({ kode: k });
    fetchUnit(k);
  };

  // Handler Bagian A & B
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handler Syarat Pendaftaran
  const handleSyaratChange = (index, value) => {
    const updated = [...formData.syarat_pendaftaran];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, syarat_pendaftaran: updated }));
  };

  const handleAddSyarat = () => {
    setFormData((prev) => ({
      ...prev,
      syarat_pendaftaran: [...prev.syarat_pendaftaran, ''],
    }));
  };

  const handleRemoveSyarat = (index) => {
    const updated = formData.syarat_pendaftaran.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, syarat_pendaftaran: updated }));
  };

  // Simpan Unit & Syarat (Update Unit)
  const handleSaveUnit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:8000/api/units/${activeKode}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        triggerNotification(`Perubahan data unit "${formData.nama}" berhasil disimpan!`);
        fetchUnit(activeKode);
        fetchUnitsList();
      } else {
        alert('Gagal menyimpan perubahan unit.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Buat Unit Baru (POST /api/units/)
  const handleCreateUnit = async (e) => {
    e.preventDefault();
    if (!newUnitForm.nama || !newUnitForm.kode) {
      alert('Mohon isi nama unit dan kode singkat.');
      return;
    }

    try {
      const payload = {
        nama: newUnitForm.nama.trim(),
        kode: newUnitForm.kode.trim().toLowerCase(),
        kategori_label: newUnitForm.kategori_label.trim().toUpperCase() || newUnitForm.kode.trim().toUpperCase(),
        lokasi_kampus: newUnitForm.lokasi_kampus.trim(),
        deskripsi_singkat: newUnitForm.deskripsi_singkat.trim(),
        profil_lembaga: newUnitForm.profil_lembaga.trim(),
        is_active: newUnitForm.is_active,
        urutan: units.length + 1
      };

      const res = await fetch('http://localhost:8000/api/units/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        setIsAddUnitModalOpen(false);
        setNewUnitForm({
          nama: '',
          kode: '',
          kategori_label: '',
          lokasi_kampus: KAMPUS_OPTIONS[0],
          deskripsi_singkat: '',
          profil_lembaga: '',
          is_active: true
        });

        triggerNotification(`Unit pendidikan "${created.nama}" berhasil ditambahkan!`);
        await fetchUnitsList();
        const createdKode = created.kode?.toLowerCase();
        setActiveKode(createdKode);
        setSearchParams({ kode: createdKode });
        fetchUnit(createdKode);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Gagal menambah unit: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      console.error('Create unit error:', err);
      alert('Terjadi kesalahan koneksi saat menambah unit baru.');
    }
  };

  // Hapus Unit Pendidikan (DELETE /api/units/<kode>/)
  const handleDeleteUnit = async () => {
    if (!unitData) return;
    const confirmMsg = `PERINGATAN:\nApakah Anda yakin ingin menghapus Unit Pendidikan "${unitData.nama}" (${unitData.kode?.toUpperCase()})?\n\nSeluruh data gelombang pendaftaran pada unit ini akan ikut terhapus.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/units/${unitData.kode}/`, {
        method: 'DELETE'
      });

      if (res.ok || res.status === 204) {
        triggerNotification(`Unit pendidikan "${unitData.nama}" berhasil dihapus!`);
        const updatedList = await fetchUnitsList();
        if (updatedList && updatedList.length > 0) {
          const nextKode = updatedList[0].kode?.toLowerCase();
          setActiveKode(nextKode);
          setSearchParams({ kode: nextKode });
          fetchUnit(nextKode);
        } else {
          setUnitData(null);
        }
      } else {
        alert('Gagal menghapus unit pendidikan.');
      }
    } catch (err) {
      console.error('Delete unit error:', err);
      alert('Terjadi kesalahan koneksi saat menghapus unit.');
    }
  };

  // Open Modal Gelombang (Tambah)
  const handleOpenAddWave = () => {
    setEditingWave(null);
    setWaveForm({
      nama_gelombang: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      biaya_pendaftaran: 250000,
      is_aktif: true,
    });
    setIsWaveModalOpen(true);
  };

  // Open Modal Gelombang (Edit)
  const handleOpenEditWave = (wave) => {
    setEditingWave(wave);
    setWaveForm({
      nama_gelombang: wave.nama_gelombang || '',
      tanggal_mulai: wave.tanggal_mulai || '',
      tanggal_selesai: wave.tanggal_selesai || '',
      biaya_pendaftaran: wave.biaya_pendaftaran || 250000,
      is_aktif: wave.is_aktif ?? true,
    });
    setIsWaveModalOpen(true);
  };

  // Simpan Gelombang (POST or PATCH)
  const handleSaveWave = async (e) => {
    e.preventDefault();
    if (!unitData) return;

    try {
      const url = editingWave
        ? `http://localhost:8000/api/gelombang/${editingWave.id}/`
        : 'http://localhost:8000/api/gelombang/';
      const method = editingWave ? 'PATCH' : 'POST';

      const payload = {
        ...waveForm,
        unit: unitData.id,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsWaveModalOpen(false);
        fetchUnit(activeKode);
        triggerNotification(
          editingWave
            ? `Gelombang "${waveForm.nama_gelombang}" berhasil diperbarui!`
            : `Gelombang "${waveForm.nama_gelombang}" berhasil ditambahkan!`
        );
      } else {
        alert('Gagal menyimpan data gelombang.');
      }
    } catch (err) {
      console.error('Wave save error:', err);
      alert('Terjadi kesalahan koneksi saat menyimpan gelombang.');
    }
  };

  // Hapus Gelombang
  const handleDeleteWave = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus ${nama}?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/gelombang/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok || res.status === 204) {
        fetchUnit(activeKode);
        triggerNotification(`Gelombang "${nama}" berhasil dihapus!`);
      } else {
        alert('Gagal menghapus gelombang.');
      }
    } catch (err) {
      console.error('Delete wave error:', err);
      alert('Terjadi kesalahan koneksi saat menghapus.');
    }
  };

  return (
    <div className="space-y-6">
      {showSuccess && <SuccessNotification message={successMsg} />}

      {/* CARD 1: HEADER & DYNAMIC UNIT TABS SWITCHER DENGAN TOMBOL TAMBAH UNIT BARU */}
      <div className="bg-white rounded-[10px] border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
              PENGATURAN JENJANG & GELOMBANG
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Kelola Unit Pendidikan & Gelombang
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Atur profil lembaga, persyaratan berkas, biaya registrasi, dan buka/tutup gelombang pendaftaran dinamis.
            </p>
          </div>

          {/* Tombol Tambah Unit Pendidikan Baru */}
          <button
            type="button"
            onClick={() => setIsAddUnitModalOpen(true)}
            className="bg-[#2ECC71] hover:bg-[#27ae60] text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center"
          >
            <FaPlus className="text-xs" />
            <span>Tambah Unit Baru</span>
          </button>
        </div>

        {/* Tab Switcher Unit Dinamis */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-xs font-bold text-gray-500 mr-1 hidden sm:inline">Pilih Unit:</span>
          <div className="bg-slate-100 p-1.5 rounded-2xl border border-gray-200 inline-flex flex-wrap gap-1.5">
            {units.map((tab) => {
              const isActive = activeKode === tab.kode?.toLowerCase();
              return (
                <button
                  key={tab.kode}
                  onClick={() => handleTabChange(tab.kode)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-emerald-900 hover:bg-white/80'
                  }`}
                >
                  {tab.kategori_label || tab.kode?.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[10px] p-12 text-center text-sm text-gray-500 font-bold animate-pulse border border-gray-200">
          Memuat data unit {activeKode?.toUpperCase()}...
        </div>
      ) : !unitData ? (
        <div className="bg-white rounded-[10px] p-12 text-center text-sm text-gray-400 font-bold border border-gray-200">
          Belum ada data unit pendidikan. Klik "Tambah Unit Baru" untuk membuat unit pertama.
        </div>
      ) : (
        <div className="space-y-6">
          {/* CARD 2: BANNER OVERVIEW UNIT AKTIF & AKSI HAPUS UNIT */}
          <div className="bg-gradient-to-r from-emerald-900 via-primary to-emerald-950 text-white rounded-[10px] p-5 sm:p-6 shadow-md border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl text-emerald-300 border border-white/15 shadow-inner shrink-0">
                <FaSchool />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {unitData.nama}
                  </h2>
                  <span className="text-xs font-mono font-bold uppercase bg-white/20 text-emerald-200 px-2.5 py-0.5 rounded-md">
                    Kode: {unitData.kode}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      formData.is_active ? 'bg-emerald-400 text-emerald-950' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {formData.is_active ? 'Status: BUKA' : 'Status: TUTUP'}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 flex items-center gap-1.5 mt-1.5">
                  <FaMapMarkerAlt className="text-secondary text-xs" />
                  <span>{unitData.lokasi_kampus}</span>
                  <span className="text-white/40">•</span>
                  <span>{unitData.gelombang_list?.length || 0} Gelombang Terdata</span>
                </p>
              </div>
            </div>

            {/* Tombol Hapus Unit Pendidikan */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                type="button"
                onClick={handleDeleteUnit}
                className="bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Hapus unit pendidikan ini"
              >
                <FaTrash className="text-xs" />
                <span>Hapus Unit Ini</span>
              </button>
            </div>
          </div>

          {/* GRID CARD KONTEN: BAGIAN A, B, DAN C */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kolom Kiri: Bagian A & B (7 Kolom) */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSaveUnit} className="space-y-6">
                {/* CARD BAGIAN A: PROFIL & IDENTITAS LEMBAGA */}
                <div className="bg-white rounded-[10px] border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                        <FaSchool className="text-[#2ECC71] text-base" />
                        <span>Bagian A: Identitas & Profil Lembaga</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Informasi dasar yang dipublikasikan pada kartu unit di landing page
                      </p>
                    </div>

                    {/* Saklar Toggle Buka/Tutup Unit */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative"></div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          formData.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {formData.is_active ? 'Buka' : 'Tutup'}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Nama Unit Pendidikan
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        required
                        className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#2ECC71] focus:bg-white outline-none transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Label Kategori / Jenjang
                      </label>
                      <input
                        type="text"
                        name="kategori_label"
                        value={formData.kategori_label}
                        onChange={handleInputChange}
                        required
                        className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#2ECC71] focus:bg-white outline-none transition-all shadow-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Lokasi Kampus <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="lokasi_kampus"
                        value={formData.lokasi_kampus}
                        onChange={handleInputChange}
                        required
                        className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:border-[#2ECC71] focus:bg-white outline-none transition-all shadow-xs font-medium text-gray-800"
                      >
                        {KAMPUS_OPTIONS.map((k, idx) => (
                          <option key={idx} value={k}>
                            {k}
                          </option>
                        ))}
                        {formData.lokasi_kampus && !KAMPUS_OPTIONS.includes(formData.lokasi_kampus) && (
                          <option value={formData.lokasi_kampus}>{formData.lokasi_kampus}</option>
                        )}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Deskripsi Singkat (Tampil di Landing Page Card)
                      </label>
                      <textarea
                        name="deskripsi_singkat"
                        rows="2"
                        value={formData.deskripsi_singkat}
                        onChange={handleInputChange}
                        className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl p-3 focus:border-[#2ECC71] focus:bg-white outline-none transition-all shadow-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Profil Lengkap Lembaga (Tampil di Halaman Detail)
                      </label>
                      <textarea
                        name="profil_lembaga"
                        rows="3"
                        value={formData.profil_lembaga}
                        onChange={handleInputChange}
                        className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl p-3 focus:border-[#2ECC71] focus:bg-white outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* CARD BAGIAN B: EDITOR SYARAT PENDAFTARAN DINAMIS */}
                <div className="bg-white rounded-[10px] border-t-[5px] border-[#5294A9] shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                        <FaLayerGroup className="text-[#5294A9] text-base" />
                        <span>Bagian B: Persyaratan Berkas Digital ({formData.syarat_pendaftaran.length} Butir)</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Daftar kelengkapan dokumen yang wajib dipersiapkan oleh calon santri baru
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSyarat}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#5294A9] hover:bg-[#437d90] px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <FaPlus className="text-[10px]" /> Tambah Syarat
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                    {formData.syarat_pendaftaran.map((syarat, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 border border-gray-300 text-xs font-bold text-gray-700 flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={syarat}
                          onChange={(e) => handleSyaratChange(index, e.target.value)}
                          placeholder={`Masukkan butir syarat pendaftaran ${index + 1}`}
                          className="flex-1 text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2 focus:border-[#5294A9] focus:bg-white outline-none transition-all shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSyarat(index)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Hapus butir syarat"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button Simpan Bagian A & B */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-primary hover:bg-emerald-900 active:bg-emerald-950 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FaSave />
                  <span>{isSaving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Unit & Syarat'}</span>
                </button>
              </form>
            </div>

            {/* Kolom Kanan: Bagian C: Manajemen Multi-Gelombang (5 Kolom) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[10px] border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                      <FaCalendarAlt className="text-[#2ECC71] text-base" />
                      <span>Bagian C: Gelombang Pendaftaran</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Periode dan biaya registrasi masuk santri
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddWave}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-emerald-900 px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <FaPlus className="text-[10px]" /> Buat Gelombang
                  </button>
                </div>

                {unitData?.gelombang_list?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400 bg-slate-50 rounded-xl border border-dashed border-gray-300">
                    Belum ada gelombang pendaftaran yang dibuat untuk unit ini.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unitData?.gelombang_list?.map((wave) => (
                      <div
                        key={wave.id}
                        className="bg-slate-50 hover:bg-emerald-50/50 border border-gray-200 rounded-xl p-4 transition-colors relative group space-y-2.5 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-gray-900">
                                {wave.nama_gelombang}
                              </h4>
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  wave.status_waktu === 'AKTIF'
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : wave.status_waktu === 'AKAN_DATANG'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {wave.status_waktu}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <FaCalendarAlt className="text-gray-400 text-[10px]" />
                              {wave.tanggal_mulai} s/d {wave.tanggal_selesai}
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditWave(wave)}
                              className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Gelombang"
                            >
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleDeleteWave(wave.id, wave.nama_gelombang)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Gelombang"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200/80">
                          <span className="text-gray-500 font-medium">Biaya Registrasi:</span>
                          <span className="font-mono font-extrabold text-emerald-800 text-sm">
                            Rp {wave.biaya_pendaftaran?.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH UNIT PENDIDIKAN BARU */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-primary flex items-center justify-center text-sm">
                  <FaPlus />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 leading-tight">
                    Tambah Unit Pendidikan Baru
                  </h3>
                  <p className="text-xs text-gray-500">
                    Otomatis tampil di Landing Page dan seluruh menu administrasi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUnitModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Nama Unit Pendidikan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tahfidz Mentari Islamic School"
                  value={newUnitForm.nama}
                  onChange={(e) => {
                    const nama = e.target.value;
                    const autoKode = nama
                      .toLowerCase()
                      .replace(/mentari|islamic|school/g, '')
                      .replace(/[^a-z0-9]/g, '')
                      .trim();
                    setNewUnitForm((prev) => ({
                      ...prev,
                      nama,
                      kode: prev.kode ? prev.kode : autoKode,
                      kategori_label: prev.kategori_label ? prev.kategori_label : autoKode.toUpperCase(),
                    }));
                  }}
                  className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Kode Singkat (Slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: tahfidz"
                    value={newUnitForm.kode}
                    onChange={(e) =>
                      setNewUnitForm({ ...newUnitForm, kode: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })
                    }
                    className="w-full text-sm font-mono bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs"
                  />
                  <span className="text-[10px] text-gray-400">Huruf kecil, tanpa spasi</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Label Kategori <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TAHFIDZ"
                    value={newUnitForm.kategori_label}
                    onChange={(e) =>
                      setNewUnitForm({ ...newUnitForm, kategori_label: e.target.value.toUpperCase() })
                    }
                    className="w-full text-sm font-bold bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Lokasi Kampus <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={newUnitForm.lokasi_kampus}
                  onChange={(e) =>
                    setNewUnitForm({ ...newUnitForm, lokasi_kampus: e.target.value })
                  }
                  className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs font-medium text-gray-800 cursor-pointer"
                >
                  {KAMPUS_OPTIONS.map((k, idx) => (
                    <option key={idx} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Deskripsi Singkat (Tampil di Landing Page Card)
                </label>
                <textarea
                  rows="2"
                  placeholder="Deskripsi singkat program keunggulan unit..."
                  value={newUnitForm.deskripsi_singkat}
                  onChange={(e) =>
                    setNewUnitForm({ ...newUnitForm, deskripsi_singkat: e.target.value })
                  }
                  className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl p-3 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={newUnitForm.is_active}
                  onChange={(e) =>
                    setNewUnitForm({ ...newUnitForm, is_active: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-gray-700">
                  Langsung buka status pendaftaran unit ini (Aktif)
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddUnitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2ECC71] hover:bg-emerald-600 shadow-sm cursor-pointer"
                >
                  Simpan & Buat Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT GELOMBANG */}
      {isWaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingWave ? 'Edit Gelombang Pendaftaran' : 'Tambah Gelombang Baru'}
              </h3>
              <button
                onClick={() => setIsWaveModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveWave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Nama Gelombang
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gelombang 1 (Early Bird)"
                  value={waveForm.nama_gelombang}
                  onChange={(e) =>
                    setWaveForm({ ...waveForm, nama_gelombang: e.target.value })
                  }
                  className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    required
                    value={waveForm.tanggal_mulai}
                    onChange={(e) =>
                      setWaveForm({ ...waveForm, tanggal_mulai: e.target.value })
                    }
                    className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    required
                    value={waveForm.tanggal_selesai}
                    onChange={(e) =>
                      setWaveForm({ ...waveForm, tanggal_selesai: e.target.value })
                    }
                    className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Biaya Pendaftaran (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="10000"
                  value={waveForm.biaya_pendaftaran}
                  onChange={(e) =>
                    setWaveForm({
                      ...waveForm,
                      biaya_pendaftaran: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full text-sm font-mono font-bold bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#2ECC71] focus:bg-white shadow-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={waveForm.is_aktif}
                  onChange={(e) =>
                    setWaveForm({ ...waveForm, is_aktif: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-gray-700">
                  Aktifkan gelombang ini
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-emerald-900 shadow-sm cursor-pointer"
                >
                  Simpan Gelombang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSave, BiTrash, BiInfoCircle } from 'react-icons/bi';
import SuccessNotification from '../../components/common/SuccessNotification';

const DEFAULT_UNIT_OPTIONS = [
  { value: 'tpa', label: 'TPA — Taman Pendidikan Al-Qur\'an' },
  { value: 'kb', label: 'KB — Kelompok Bermain' },
  { value: 'tk', label: 'TK — Taman Kanak-Kanak' },
  { value: 'sd', label: 'SD — Sekolah Dasar' },
  { value: 'smp', label: 'SMP — Sekolah Menengah Pertama' },
  { value: 'sma', label: 'SMA — Sekolah Menengah Atas' },
];

export default function AdminInputJadwal() {
  const [unitOptions, setUnitOptions] = useState(DEFAULT_UNIT_OPTIONS);

  useEffect(() => {
    axios.get(`${getBaseApiUrl()}/units/`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(u => ({
            value: u.kode?.toLowerCase(),
            label: `${u.kategori_label || u.kode?.toUpperCase()} — ${u.nama}`
          }));
          setUnitOptions(mapped);
        }
      })
      .catch(err => console.error('Gagal mengambil dynamic units di input jadwal:', err));
  }, []);

  const initialForm = {
    unit: 'sd',
    gelombang: 'Gelombang 1 - Tahun Ajaran 2026/2027',
    tanggal: new Date().toISOString().split('T')[0],
    waktu_mulai: '08:00',
    waktu_selesai: '11:30',
    lokasi: 'Aula Kampus Utama (Polanharjo)',
    penguji: 'Tim Seleksi PPDB Mentari Islamic School',
    deskripsi: 'Tes Pemetaan Karakter, Observasi Tahsin/Tahfidz Al-Qur\'an & Wawancara Wali Santri'
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (e, withWa = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.unit || !form.gelombang || !form.tanggal || !form.waktu_mulai || !form.waktu_selesai || !form.lokasi) {
      alert('Mohon lengkapi kolom formulir yang wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${getBaseApiUrl()}/admin/jadwal/`, form);
      const msg = withWa
        ? `Jadwal seleksi ${form.unit.toUpperCase()} tersimpan & draf WhatsApp siap!`
        : `Jadwal seleksi unit ${form.unit.toUpperCase()} berhasil disimpan!`;
      triggerNotification(msg);
      setForm(initialForm);
    } catch (err) {
      console.error('Gagal menyimpan jadwal:', err);
      alert('Gagal menyimpan jadwal seleksi. Silakan periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  const FormInput = ({ label, type = "text", name, value, options, disabled, placeholder, onChange }) => {
    const baseClass = `w-full bg-white border border-slate-300 rounded-[6px] px-4 py-2.5 font-[500] h-[45px] outline-none text-slate-800 focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-all text-sm ${disabled ? 'bg-slate-100 cursor-not-allowed' : ''}`;
    return (
      <div className="w-full">
        <label className="block font-[700] text-slate-700 mb-2 text-[0.9rem]">{label}</label>
        {type === "select" ? (
          <select name={name} className={baseClass} value={value} onChange={onChange} disabled={disabled}>
            {options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input type={type} name={name} className={baseClass} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showSuccess && <SuccessNotification message={successMsg} />}

      {/* CARD FORM UTAMA PERSIS INPUT HAFALAN PAGE TAHFIDZ_MIS */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
        {/* Info Bar Atas */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 text-[#1B4332]">
          <BiInfoCircle className="text-2xl shrink-0" />
          <p className="text-sm font-medium">
            Lengkapi formulir agenda dan sesi tes seleksi penerimaan santri baru di bawah ini.
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Baris 1: Unit & Gelombang */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="1. Pilih Unit Pendidikan *"
              name="unit"
              type="select"
              options={unitOptions}
              value={form.unit}
              onChange={handleChange}
            />
            <FormInput
              label="2. Gelombang Pendaftaran *"
              name="gelombang"
              type="text"
              placeholder="Contoh: Gelombang 1 - 2026/2027"
              value={form.gelombang}
              onChange={handleChange}
            />
          </div>

          {/* Baris 2: Tanggal, Waktu Mulai, Waktu Selesai */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Tanggal Pelaksanaan *"
              name="tanggal"
              type="date"
              value={form.tanggal}
              onChange={handleChange}
            />
            <FormInput
              label="Waktu Mulai *"
              name="waktu_mulai"
              type="time"
              value={form.waktu_mulai}
              onChange={handleChange}
            />
            <FormInput
              label="Waktu Selesai *"
              name="waktu_selesai"
              type="time"
              value={form.waktu_selesai}
              onChange={handleChange}
            />
          </div>

          {/* Baris 3: Lokasi & Tim Penguji */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Lokasi Kampus / Ruangan *"
              name="lokasi"
              type="text"
              placeholder="Contoh: Aula Kampus Utama (Polanharjo)"
              value={form.lokasi}
              onChange={handleChange}
            />
            <FormInput
              label="PIC / Tim Penguji Seleksi"
              name="penguji"
              type="text"
              placeholder="Contoh: Panitia Seleksi PPDB Mentari"
              value={form.penguji}
              onChange={handleChange}
            />
          </div>

          {/* Baris 4: Catatan / Deskripsi Materi */}
          <div>
            <label className="block font-[700] text-slate-700 mb-2 text-[0.9rem]">
              Rincian Materi Tes & Keterangan Tambahan
            </label>
            <textarea
              name="deskripsi"
              className="w-full bg-white border border-slate-300 rounded-[6px] px-4 py-3 h-[110px] outline-none resize-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-all text-sm font-medium"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan rincian materi seleksi (Observasi Tahsin/Tahfidz, Wawancara Wali, perlengkapan yang wajib dibawa)..."
            />
          </div>

          {/* Tombol Aksi di Bawah Form */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#E53E3E] text-white font-bold text-sm flex justify-center items-center gap-2 hover:bg-[#9c0707] shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <BiTrash /> Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#5294A9] text-white font-bold hover:bg-[#3e7283] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <BiSave /> {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

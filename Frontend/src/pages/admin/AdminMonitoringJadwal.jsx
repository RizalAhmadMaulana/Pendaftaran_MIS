import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  BiPencil,
  BiTrash,
  BiUser,
  BiSave,
  BiLogoWhatsapp,
  BiSearch,
  BiCalendar,
  BiX
} from 'react-icons/bi';
import SuccessNotification from '../../components/common/SuccessNotification';

const UNITS = [
  { kode: 'semua', label: 'Semua Unit' },
  { kode: 'tpa', label: 'TPA' },
  { kode: 'kb', label: 'KB' },
  { kode: 'tk', label: 'TK' },
  { kode: 'sd', label: 'SD' },
  { kode: 'smp', label: 'SMP' },
  { kode: 'sma', label: 'SMA' },
];

// --- MODAL INPUT STYLE PERSIS GAMBAR USER & RAPORTMODALS TAHFIDZ_MIS ---
const ModalInput = ({ label, type = "text", value, options, readOnly, placeholder, onChange, name, disabled, ...props }) => {
  const baseClass = `w-full bg-[#D9D9D9] border-none rounded-[4px] px-4 py-2.5 font-[500] h-[45px] outline-none text-slate-800 placeholder-slate-500 transition-all focus:ring-2 focus:ring-[#5294A9]/50 text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  return (
    <div className="w-full">
      {label && <label className="block font-[700] text-[#1a1a1a] mb-2 text-[0.95rem]">{label}</label>}
      {type === "select" ? (
        <select className={baseClass} name={name} value={value} onChange={onChange} disabled={readOnly || disabled} {...props}>
          <option value="">-- Pilih --</option>
          {options?.map((opt, idx) => (
            <option key={idx} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea className={`${baseClass} min-h-[105px] py-3 resize-none`} name={name} value={value} onChange={onChange} readOnly={readOnly || disabled} placeholder={placeholder} {...props} />
      ) : (
        <input type={type} name={name} className={baseClass} value={value} onChange={onChange} readOnly={readOnly || disabled} placeholder={placeholder} {...props} />
      )}
    </div>
  );
};

// --- MODAL WRAPPER PERSIS GAMBAR USER ---
const ModalWrapper = ({ title, icon: Icon, onClose, children, size = "max-w-lg" }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1070] flex items-center justify-center p-4">
    <div className={`bg-white rounded-[15px] w-full ${size} shadow-2xl flex flex-col max-h-[95vh] border border-slate-200`}>
      <div className="border-b border-black px-6 py-4 flex justify-between items-center shrink-0">
        <h5 className="font-[700] text-[1.2rem] flex items-center gap-2.5 text-slate-900">
          {Icon && <Icon className="text-2xl text-slate-800" />} {title}
        </h5>
        <button onClick={onClose} className="text-3xl text-slate-700 hover:text-red-500 transition-colors leading-none cursor-pointer">
          &times;
        </button>
      </div>
      <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  </div>
);

export default function AdminMonitoringJadwal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const unitParam = searchParams.get('unit') || 'sd';

  const [unitsList, setUnitsList] = useState([
    { kode: 'semua', label: 'Semua Unit' },
    { kode: 'tpa', label: 'TPA' },
    { kode: 'kb', label: 'KB' },
    { kode: 'tk', label: 'TK' },
    { kode: 'sd', label: 'SD' },
    { kode: 'smp', label: 'SMP' },
    { kode: 'sma', label: 'SMA' },
  ]);

  const [selectedUnit, setSelectedUnit] = useState(unitParam);
  const [jadwalList, setJadwalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Modals & Notifications
  const [activeModal, setActiveModal] = useState(null); // 'edit' | 'delete' | 'peserta'
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [pesertaList, setPesertaList] = useState([]);
  const [pesertaLoading, setPesertaLoading] = useState(false);
  const [pesertaSearch, setPesertaSearch] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Form State
  const [editForm, setEditForm] = useState({
    unit: 'sd',
    gelombang: '',
    tanggal: '',
    waktu_mulai: '',
    waktu_selesai: '',
    lokasi: '',
    deskripsi: ''
  });

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  useEffect(() => {
    axios.get(`${getBaseApiUrl()}/units/`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = [
            { kode: 'semua', label: 'Semua Unit' },
            ...res.data.map(u => ({
              kode: u.kode?.toLowerCase(),
              label: u.kategori_label || u.kode?.toUpperCase()
            }))
          ];
          setUnitsList(mapped);
        }
      })
      .catch(err => console.error('Gagal mengambil dynamic units di monitoring:', err));
  }, []);

  const fetchJadwal = async () => {
    setLoading(true);
    try {
      let url = `${getBaseApiUrl()}/admin/jadwal/?`;
      if (selectedUnit && selectedUnit !== 'semua') {
        url += `unit=${selectedUnit}&`;
      }
      if (filterTanggal) {
        url += `tanggal=${filterTanggal}&`;
      }
      if (searchTerm) {
        url += `search=${searchTerm}&`;
      }

      const res = await axios.get(url);
      setJadwalList(res.data);
    } catch (err) {
      console.error('Gagal mengambil jadwal seleksi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
    setCurrentPage(1);
  }, [selectedUnit, filterTanggal, searchTerm]);

  const handleUnitChange = (unitKode) => {
    setSelectedUnit(unitKode);
    setSearchParams(unitKode === 'semua' ? {} : { unit: unitKode });
  };

  // Open Edit Modal
  const handleOpenEdit = (jadwal) => {
    setSelectedJadwal(jadwal);
    setEditForm({
      unit: jadwal.unit || 'sd',
      gelombang: jadwal.gelombang,
      tanggal: jadwal.tanggal,
      waktu_mulai: jadwal.waktu_mulai?.slice(0, 5) || '08:00',
      waktu_selesai: jadwal.waktu_selesai?.slice(0, 5) || '11:30',
      lokasi: jadwal.lokasi,
      deskripsi: jadwal.deskripsi || ''
    });
    setActiveModal('edit');
  };

  // Open Delete Modal
  const handleOpenDelete = (jadwal) => {
    setSelectedJadwal(jadwal);
    setActiveModal('delete');
  };

  // Open Peserta Monitor
  const handleOpenPeserta = async (jadwal) => {
    setSelectedJadwal(jadwal);
    setActiveModal('peserta');
    setPesertaLoading(true);
    try {
      const res = await axios.get(`${getBaseApiUrl()}/admin/jadwal/${jadwal.id}/peserta/`);
      setPesertaList(res.data);
    } catch (err) {
      console.error('Gagal memuat peserta jadwal:', err);
    } finally {
      setPesertaLoading(false);
    }
  };

  // Save Edit (Simpan Saja vs Simpan & Kirim WA)
  const handleSaveEdit = async (withWa = false) => {
    try {
      await axios.patch(`${getBaseApiUrl()}/admin/jadwal/${selectedJadwal.id}/`, editForm);
      const msg = withWa
        ? 'Jadwal berhasil diperbarui & notifikasi WhatsApp disiapkan!'
        : 'Jadwal seleksi berhasil diperbarui!';
      triggerNotification(msg);
      setActiveModal(null);
      fetchJadwal();
    } catch (err) {
      console.error('Gagal memperbarui jadwal:', err);
      alert('Gagal memperbarui jadwal. Pastikan semua data terisi dengan benar.');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${getBaseApiUrl()}/admin/jadwal/${selectedJadwal.id}/`);
      triggerNotification('Jadwal seleksi berhasil dihapus!');
      setActiveModal(null);
      fetchJadwal();
    } catch (err) {
      console.error('Gagal menghapus jadwal:', err);
      alert('Gagal menghapus jadwal seleksi.');
    }
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = jadwalList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jadwalList.length / entriesPerPage);

  const filteredPeserta = pesertaList.filter(p => {
    if (!pesertaSearch) return true;
    const q = pesertaSearch.toLowerCase();
    return (
      p.nama_lengkap?.toLowerCase().includes(q) ||
      p.no_registrasi?.toLowerCase().includes(q) ||
      p.nik?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {showSuccess && <SuccessNotification message={successMsg} />}

      {/* Header Halaman (Tanpa tombol Tambah Jadwal) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <BiCalendar className="text-secondary text-2xl" />
            Monitoring Jadwal Seleksi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tabel agenda dan sesi tes seleksi pendaftaran per unit dengan gaya data Web Risalah MIS
          </p>
        </div>
      </div>

      {/* Dropdown Pemilihan Unit Pendidikan */}
      <div className="bg-white rounded-[10px] p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <label className="text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap">
            Pilih Unit Pendidikan:
          </label>
          <select
            value={selectedUnit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="w-full sm:w-[280px] bg-[#f8fafc] border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none font-bold text-xs sm:text-sm focus:border-[#2ECC71] transition-all shadow-xs text-slate-800 cursor-pointer"
          >
            {unitsList.map((u) => (
              <option key={u.kode} value={u.kode}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Unit Aktif:</span>
          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            {unitsList.find((u) => u.kode === selectedUnit)?.label || selectedUnit.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Card Tabel Master Gaya Tahfidz_MIS */}
      <div className="bg-white rounded-[8px] p-4 md:p-5 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        {/* Kontrol Baris Atas: Show entries & Search / Filter Tanggal */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-5 text-sm font-[600] text-slate-700">
          <div className="flex items-center shrink-0">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="mx-1.5 bg-[#f8fafc] border border-gray-300 rounded px-1.5 py-1 outline-none text-sm font-normal"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-end sm:items-center justify-end">
            {/* Filter Tanggal */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500">Tanggal:</span>
              <input
                type="date"
                value={filterTanggal}
                onChange={(e) => setFilterTanggal(e.target.value)}
                className="w-full sm:w-[160px] bg-[#f8fafc] border border-gray-300 rounded px-3 py-1.5 outline-none font-normal text-xs sm:text-sm focus:border-[#2ECC71] transition-all shadow-xs"
              />
              {filterTanggal && (
                <button
                  onClick={() => setFilterTanggal('')}
                  className="p-1.5 text-slate-400 hover:text-red-500 text-xs cursor-pointer"
                  title="Reset Filter Tanggal"
                >
                  <BiX className="text-base" />
                </button>
              )}
            </div>

            {/* Kolom Search */}
            <div className="flex items-center w-full sm:w-auto">
              <span className="mr-2 text-sm font-semibold text-slate-700 hidden sm:inline">Search:</span>
              <input
                type="text"
                placeholder="Cari Sesi / Ruang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[220px] bg-white border border-gray-300 rounded px-3 py-1.5 outline-none font-normal text-sm focus:border-[#2ECC71] transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Tabel Data Bergaris Hitam Tegas */}
        <div className="border border-black rounded-[4px] overflow-x-auto bg-white mb-4 custom-scrollbar">
          <table className="w-full border-collapse min-w-max">
            <thead>
              <tr className="bg-white">
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">#</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Unit</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Gelombang</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Tanggal & Waktu</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Lokasi / Kampus</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Rincian Materi</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Peserta</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 font-bold text-slate-400">
                    Memuat data jadwal seleksi...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 font-bold text-slate-400">
                    Tidak ada jadwal seleksi ditemukan.
                  </td>
                </tr>
              ) : (
                currentItems.map((row, idx) => (
                  <tr key={row.id} className="even:bg-[#f2f2f2] hover:bg-slate-100 transition-colors">
                    <td className="border border-black px-3 py-2.5 text-center font-medium">
                      {indexOfFirstItem + idx + 1}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-sm font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {row.unit ? row.unit.toUpperCase() : 'SD'}
                      </span>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center font-semibold text-slate-800">
                      {row.gelombang}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center text-xs">
                      <div className="font-bold text-slate-800">{row.tanggal}</div>
                      <div className="text-slate-500 font-medium">
                        {row.waktu_mulai?.slice(0, 5)} - {row.waktu_selesai?.slice(0, 5)} WIB
                      </div>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center text-xs font-medium text-slate-700">
                      {row.lokasi}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center text-xs text-slate-600 max-w-[220px] truncate" title={row.deskripsi}>
                      {row.deskripsi || '-'}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center font-bold text-emerald-700">
                      {row.total_peserta || 0} Calon
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center">
                      <div className="flex gap-1.5 justify-center items-center">
                        <button
                          onClick={() => handleOpenPeserta(row)}
                          className="bg-[#5294A9] hover:bg-[#437d90] text-white py-1 px-2.5 rounded-[4px] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Monitor Peserta"
                        >
                          <BiUser className="text-sm" /> Peserta
                        </button>
                        <button
                          onClick={() => handleOpenEdit(row)}
                          className="bg-[#2ECC71] hover:bg-[#27ae60] text-white py-1 px-2.5 rounded-[4px] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Edit Jadwal"
                        >
                          <BiPencil className="text-sm" /> Edit
                        </button>
                        <button
                          onClick={() => handleOpenDelete(row)}
                          className="bg-[#E74C3C] hover:bg-[#c0392b] text-white py-1 px-2.5 rounded-[4px] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Hapus Jadwal"
                        >
                          <BiTrash className="text-sm" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kontrol Baris Bawah: Info Showing Entries & Navigasi Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[0.85rem] font-[600] gap-3">
          <div className="text-slate-600">
            Showing {jadwalList.length === 0 ? 0 : indexOfFirstItem + 1} to{' '}
            {Math.min(indexOfLastItem, jadwalList.length)} of {jadwalList.length} entries
          </div>

          <div className="flex border border-gray-300 rounded shadow-xs overflow-hidden">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-white hover:bg-gray-50 border-r disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>
            <div className="px-4 py-1 bg-[#007BFF] text-white font-bold">{currentPage}</div>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* POP UP EDIT JADWAL SELEKSI — PERSIS GAMBAR REFERENSI USER */}
      {activeModal === 'edit' && selectedJadwal && (
        <ModalWrapper
          title="Edit Jadwal Seleksi"
          icon={BiPencil}
          onClose={() => setActiveModal(null)}
          size="max-w-[700px]"
        >
          <div className="space-y-5">
            {/* Baris 1: Pilih Unit & Gelombang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ModalInput
                label="Pilih Unit"
                type="select"
                name="unit"
                value={editForm.unit}
                onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                options={unitsList
                  .filter((u) => u.kode !== 'semua')
                  .map((u) => ({ value: u.kode, label: u.label }))}
              />

              <ModalInput
                label="Gelombang"
                type="text"
                name="gelombang"
                value={editForm.gelombang}
                onChange={(e) => setEditForm({ ...editForm, gelombang: e.target.value })}
                placeholder="Contoh: Gelombang 1 - 2026/2027"
              />
            </div>

            {/* Baris 2: Tanggal & Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ModalInput
                label="Tanggal Seleksi"
                type="date"
                name="tanggal"
                value={editForm.tanggal}
                onChange={(e) => setEditForm({ ...editForm, tanggal: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-2">
                <ModalInput
                  label="Jam Mulai"
                  type="time"
                  name="waktu_mulai"
                  value={editForm.waktu_mulai}
                  onChange={(e) => setEditForm({ ...editForm, waktu_mulai: e.target.value })}
                />
                <ModalInput
                  label="Jam Selesai"
                  type="time"
                  name="waktu_selesai"
                  value={editForm.waktu_selesai}
                  onChange={(e) => setEditForm({ ...editForm, waktu_selesai: e.target.value })}
                />
              </div>
            </div>

            {/* Baris 3: Lokasi Kampus */}
            <ModalInput
              label="Lokasi Kampus / Ruangan"
              type="text"
              name="lokasi"
              value={editForm.lokasi}
              onChange={(e) => setEditForm({ ...editForm, lokasi: e.target.value })}
              placeholder="Contoh: Aula Kampus Utama (Polanharjo)"
            />

            {/* Baris 4: Catatan / Deskripsi Materi */}
            <ModalInput
              label="Catatan / Rincian Materi Seleksi"
              type="textarea"
              name="deskripsi"
              value={editForm.deskripsi}
              onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
              placeholder="Tuliskan catatan rincian materi seleksi (Observasi Karakter, Tahsin, dll)..."
            />

            {/* Tombol Aksi di Bawah Garis Hitam Tegas (Persis Gambar) */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-black mt-2">
              <button
                type="button"
                onClick={() => handleSaveEdit(false)}
                className="bg-[#5294A9] hover:bg-[#3e7283] transition-colors text-white rounded-[4px] px-6 py-2.5 font-[700] flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
              >
                <BiSave className="text-lg" /> Simpan Saja
              </button>
              <button
                type="button"
                onClick={() => handleSaveEdit(true)}
                className="bg-[#25D366] hover:bg-[#20bd5a] transition-colors text-white rounded-[4px] px-6 py-2.5 font-[700] flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
              >
                <BiLogoWhatsapp className="text-[1.2rem]" /> Simpan & Kirim WA
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* POP UP PESERTA SELEKSI — PERSIS GAYA GAMBAR REFERENSI */}
      {activeModal === 'peserta' && selectedJadwal && (
        <ModalWrapper
          title={`Daftar Peserta Seleksi — ${selectedJadwal.unit?.toUpperCase() || 'SD'}`}
          icon={BiUser}
          onClose={() => setActiveModal(null)}
          size="max-w-[760px]"
        >
          <div className="space-y-4">
            <div className="bg-[#f2f2f2] p-3.5 rounded-[4px] border border-slate-300 text-xs sm:text-sm text-slate-800 space-y-1">
              <p className="font-bold text-slate-900">{selectedJadwal.gelombang}</p>
              <p className="text-slate-600">
                Tanggal: <strong>{selectedJadwal.tanggal}</strong> ({selectedJadwal.waktu_mulai?.slice(0, 5)} - {selectedJadwal.waktu_selesai?.slice(0, 5)} WIB) • Lokasi: <strong>{selectedJadwal.lokasi}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="font-[700] text-xs sm:text-sm text-slate-700">
                Total Calon Terdaftar: {filteredPeserta.length} Santri
              </span>

              <div className="flex items-center w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Cari Nama / No. Reg..."
                  value={pesertaSearch}
                  onChange={(e) => setPesertaSearch(e.target.value)}
                  className="w-full sm:w-[220px] bg-[#D9D9D9] border-none rounded-[4px] px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#5294A9]/50 placeholder-slate-500 font-medium"
                />
              </div>
            </div>

            <div className="border border-black rounded-[4px] overflow-x-auto bg-white max-h-[50vh]">
              <table className="w-full border-collapse min-w-max text-xs">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-black px-2.5 py-2 text-center font-bold">#</th>
                    <th className="border border-black px-2.5 py-2 text-center font-bold">No. Reg</th>
                    <th className="border border-black px-2.5 py-2 text-center font-bold">Nama Calon Siswa</th>
                    <th className="border border-black px-2.5 py-2 text-center font-bold">Status Bayar</th>
                    <th className="border border-black px-2.5 py-2 text-center font-bold">Hasil Seleksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pesertaLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center p-6 font-bold text-slate-400">
                        Memuat data peserta...
                      </td>
                    </tr>
                  ) : filteredPeserta.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-6 font-bold text-slate-400">
                        Belum ada peserta untuk jadwal ini.
                      </td>
                    </tr>
                  ) : (
                    filteredPeserta.map((p, idx) => (
                      <tr key={p.id} className="even:bg-[#f2f2f2] hover:bg-slate-100">
                        <td className="border border-black px-2.5 py-2 text-center">{idx + 1}</td>
                        <td className="border border-black px-2.5 py-2 text-center font-mono font-bold text-emerald-800">
                          {p.no_registrasi}
                        </td>
                        <td className="border border-black px-2.5 py-2 text-center font-semibold text-slate-800">
                          {p.nama_lengkap}
                        </td>
                        <td className="border border-black px-2.5 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.status_pembayaran === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {p.status_pembayaran}
                          </span>
                        </td>
                        <td className="border border-black px-2.5 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.status_seleksi === 'LULUS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : p.status_seleksi === 'TIDAK LULUS'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {p.status_seleksi || 'BELUM PENGUMUMAN'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tombol Tutup di Bawah Garis Hitam Tegas */}
            <div className="flex justify-end pt-4 border-t border-black mt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="bg-[#5294A9] hover:bg-[#3e7283] transition-colors text-white rounded-[4px] px-6 py-2 font-[700] text-xs sm:text-sm cursor-pointer shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* POP UP KONFIRMASI HAPUS */}
      {activeModal === 'delete' && selectedJadwal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1080] flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] w-full max-w-[420px] p-6 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-3xl">
              <BiTrash />
            </div>
            <h4 className="font-[800] text-slate-900 text-lg mb-1">Hapus Jadwal Seleksi?</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Apakah Anda yakin ingin menghapus jadwal <strong>{selectedJadwal.gelombang}</strong> pada tanggal{' '}
              <strong>{selectedJadwal.tanggal}</strong>?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-[4px] bg-gray-200 hover:bg-gray-300 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-[4px] bg-[#E74C3C] hover:bg-[#c0392b] text-white text-xs sm:text-sm font-bold cursor-pointer shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

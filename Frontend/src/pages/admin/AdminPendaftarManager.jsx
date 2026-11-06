import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaTrash,
  FaTimes,
  FaExternalLinkAlt,
  FaDownload,
  FaPhoneAlt,
  FaIdCard,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaQrcode
} from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import SuccessNotification from '../../components/common/SuccessNotification';

export default function AdminPendaftarManager() {
  const [pendaftarList, setPendaftarList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState('Semua');
  const [filterPembayaran, setFilterPembayaran] = useState('Semua');
  const [filterSeleksi, setFilterSeleksi] = useState('Semua');
  const [unitFilterOptions, setUnitFilterOptions] = useState(['TPA', 'KB', 'TK', 'SD', 'SMP', 'SMA']);

  useEffect(() => {
    fetch(`${getBaseApiUrl()}/units/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const list = data.map(u => u.kategori_label || u.kode?.toUpperCase());
          setUnitFilterOptions([...new Set(list)]);
        }
      })
      .catch(err => console.error('Failed to load filter units in pendaftar:', err));
  }, []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Notification State
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Modal Detail State
  const [selectedPendaftar, setSelectedPendaftar] = useState(null);
  const [activeTab, setActiveTab] = useState('biodata'); // 'biodata' | 'pembayaran' | 'dokumen'
  const [isUpdating, setIsUpdating] = useState(false);


  const fetchPendaftar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterUnit !== 'Semua') params.append('unit', filterUnit);
      if (filterPembayaran !== 'Semua') params.append('pembayaran', filterPembayaran);
      if (filterSeleksi !== 'Semua') params.append('seleksi', filterSeleksi);

      const res = await fetch(`${getBaseApiUrl()}/admin/pendaftar/?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPendaftarList(data);
      }
    } catch (err) {
      console.error('Error fetching pendaftar list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    const delayDebounceFn = setTimeout(() => {
      fetchPendaftar();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, filterUnit, filterPembayaran, filterSeleksi]);

  // Update Status via API
  const handleUpdateStatus = async (fields) => {
    if (!selectedPendaftar) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${getBaseApiUrl()}/admin/pendaftar/${selectedPendaftar.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedPendaftar(updated);
        // Refresh master list
        setPendaftarList((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        triggerNotification('Data pendaftar berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui status pendaftar.');
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Pendaftar
  const handleDeletePendaftar = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus seluruh data pendaftaran "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const res = await fetch(`${getBaseApiUrl()}/admin/pendaftar/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok || res.status === 204) {
        setSelectedPendaftar(null);
        setPendaftarList((prev) => prev.filter((item) => item.id !== id));
        triggerNotification('Data pendaftar berhasil dihapus!');
      } else {
        alert('Gagal menghapus pendaftar.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Terjadi kesalahan saat menghapus data.');
    }
  };


  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = pendaftarList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendaftarList.length / entriesPerPage);

  return (
    <div className="space-y-6">
      {showSuccess && <SuccessNotification message={successMsg} />}

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
            PUSAT DATA PENDAFTARAN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Data Calon Peserta Didik Baru
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Kelola verifikasi tagihan pembayaran, pemeriksaan berkas digital, dan keputusan hasil kelulusan santri.
          </p>
        </div>

        <div className="bg-slate-100 text-emerald-950 font-bold px-4 py-2.5 rounded-2xl border border-gray-200 text-xs self-start sm:self-center">
          Total Terdata: <span className="font-mono text-sm text-primary">{pendaftarList.length} Siswa</span>
        </div>
      </div>

      {/* Card Tabel Master Gaya Tahfidz_MIS */}
      <div className="bg-white rounded-[8px] p-4 md:p-5 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        {/* Kontrol Baris Atas: Show entries & Filters / Search */}
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

          <div className="flex flex-wrap gap-2.5 items-center justify-start lg:justify-end">
            {/* Filter Unit Dinamis */}
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="text-xs sm:text-sm bg-[#f8fafc] border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2ECC71] text-gray-700 font-medium shadow-xs"
            >
              <option value="Semua">Semua Jenjang Unit</option>
              {unitFilterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* Filter Status Pembayaran */}
            <select
              value={filterPembayaran}
              onChange={(e) => setFilterPembayaran(e.target.value)}
              className="text-xs sm:text-sm bg-[#f8fafc] border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2ECC71] text-gray-700 font-medium shadow-xs"
            >
              <option value="Semua">Semua Status Bayar</option>
              <option value="PAID">Lunas (PAID)</option>
              <option value="PENDING">Menunggu Bayar (PENDING)</option>
            </select>

            {/* Filter Status Seleksi */}
            <select
              value={filterSeleksi}
              onChange={(e) => setFilterSeleksi(e.target.value)}
              className="text-xs sm:text-sm bg-[#f8fafc] border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2ECC71] text-gray-700 font-medium shadow-xs"
            >
              <option value="Semua">Semua Status Seleksi</option>
              <option value="BELUM PENGUMUMAN">Belum Pengumuman</option>
              <option value="LULUS">LULUS</option>
              <option value="TIDAK LULUS">TIDAK LULUS</option>
            </select>

            {/* Search Input */}
            <div className="flex items-center w-full sm:w-auto">
              <span className="mr-2 text-xs sm:text-sm font-semibold text-slate-700 hidden sm:inline">Search:</span>
              <input
                type="text"
                placeholder="Cari Nama / No Reg / NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-[200px] bg-white border border-gray-300 rounded px-3 py-1.5 outline-none font-normal text-xs sm:text-sm focus:border-[#2ECC71] transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Tabel Data Bergaris Hitam Tegas Gaya Tahfidz_MIS */}
        <div className="border border-black rounded-[4px] overflow-x-auto bg-white mb-4 custom-scrollbar">
          <table className="w-full border-collapse min-w-max">
            <thead>
              <tr className="bg-white">
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">#</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">No. Registrasi</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Nama Lengkap</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Unit</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">WhatsApp / HP</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Status Bayar</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Berkas</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Hasil Seleksi</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 font-bold text-slate-400">
                    Memuat data pendaftar...
                  </td>
                </tr>
              ) : pendaftarList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 font-bold text-slate-400">
                    Tidak ada data pendaftar yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                currentItems.map((p, idx) => {
                  const isPaid = p.status_pembayaran === 'PAID' || p.status_pembayaran === 'LUNAS';
                  return (
                    <tr key={p.id} className="even:bg-[#f2f2f2] hover:bg-slate-100 transition-colors">
                      <td className="border border-black px-3 py-2.5 text-center font-medium">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      <td className="border border-black px-3 py-2.5 text-center font-mono font-bold text-xs text-emerald-800">
                        {p.no_registrasi}
                      </td>
                      <td className="border border-black px-3 py-2.5 text-left font-bold text-gray-900">
                        {p.nama_lengkap}
                      </td>
                      <td className="border border-black px-3 py-2.5 text-center">
                        <span className="text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-sm">
                          {p.unit}
                        </span>
                      </td>
                      <td className="border border-black px-3 py-2.5 text-center text-xs font-mono text-gray-600">
                        {p.no_hp || '-'}
                      </td>
                      <td className="border border-black px-3 py-2.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                            isPaid
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {isPaid ? <FaCheckCircle className="text-[10px]" /> : <FaClock className="text-[10px]" />}
                          {isPaid ? 'LUNAS' : 'PENDING'}
                        </span>
                      </td>
                      <td className="border border-black px-3 py-2.5 text-center">
                        <span className="text-[11px] font-semibold text-gray-700 bg-slate-100 border border-gray-300 px-2 py-0.5 rounded-sm">
                          {p.status_dokumen || 'BELUM LENGKAP'}
                        </span>
                      </td>
                      <td className="border border-black px-3 py-2.5 text-center">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                            p.status_seleksi === 'LULUS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : p.status_seleksi === 'TIDAK LULUS'
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-gray-100 text-gray-600 border border-gray-300'
                          }`}
                        >
                          {p.status_seleksi || 'BELUM PENGUMUMAN'}
                        </span>
                      </td>
                      <td className="border border-black px-3 py-2.5 text-center">
                        <div className="flex gap-1.5 justify-center items-center">
                          <button
                            onClick={() => {
                              setSelectedPendaftar(p);
                              setActiveTab('biodata');
                            }}
                            className="bg-[#5294A9] hover:bg-[#437d90] text-white py-1 px-2.5 rounded-[4px] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                            title="Detail & Verifikasi"
                          >
                            <FaEye className="text-xs" /> Detail
                          </button>
                          <button
                            onClick={() => handleDeletePendaftar(p.id, p.nama_lengkap)}
                            className="bg-[#E74C3C] hover:bg-[#c0392b] text-white py-1 px-2.5 rounded-[4px] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                            title="Hapus Data Siswa"
                          >
                            <FaTrash className="text-xs" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Kontrol Baris Bawah: Info Showing Entries & Navigasi Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[0.85rem] font-[600] gap-3">
          <div className="text-slate-600">
            Showing {pendaftarList.length === 0 ? 0 : indexOfFirstItem + 1} to{' '}
            {Math.min(indexOfLastItem, pendaftarList.length)} of {pendaftarList.length} entries
          </div>

          <div className="flex border border-gray-300 rounded shadow-xs overflow-hidden">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-white hover:bg-gray-50 border-r disabled:opacity-50 cursor-pointer text-xs sm:text-sm font-semibold text-slate-700"
            >
              Prev
            </button>
            <div className="px-4 py-1 bg-[#007BFF] text-white font-bold text-xs sm:text-sm flex items-center">
              {currentPage}
            </div>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer text-xs sm:text-sm font-semibold text-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Drawer Detail Pendaftar (3 Tab Lengkap) */}
      {selectedPendaftar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden my-auto animate-scale-in">
            {/* Header Modal */}
            <div className="bg-primary text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-secondary text-2xl shrink-0">
                  <FaUserGraduate />
                </div>
                <div>
                  <h3 className="text-lg font-black leading-tight text-white">
                    {selectedPendaftar.nama_lengkap}
                  </h3>
                  <p className="text-xs text-emerald-200 font-mono mt-0.5">
                    No. Reg: {selectedPendaftar.no_registrasi} • Unit {selectedPendaftar.unit}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPendaftar(null)}
                className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Navigation Tabs Modal */}
            <div className="bg-slate-50 border-b border-gray-200 px-6 flex items-center gap-4 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('biodata')}
                className={`py-3.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'biodata'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                1. Biodata Siswa & Ortu
              </button>
              <button
                onClick={() => setActiveTab('pembayaran')}
                className={`py-3.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'pembayaran'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                2. Tagihan & QRIS
              </button>
              <button
                onClick={() => setActiveTab('dokumen')}
                className={`py-3.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'dokumen'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                3. Berkas & Kelulusan
              </button>
            </div>

            {/* Body Content Tabs */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
              {/* TAB 1: BIODATA */}
              {activeTab === 'biodata' && (
                <div className="space-y-6">
                  {/* Bagian A: Calon Siswa */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-3">
                    <h4 className="font-extrabold text-primary text-xs uppercase tracking-wider border-b border-gray-200 pb-2">
                      A. Keterangan Calon Peserta Didik
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block">NIK:</span>
                        <span className="font-mono font-bold text-gray-900">{selectedPendaftar.nik || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Jenis Kelamin:</span>
                        <span className="font-semibold text-gray-900">{selectedPendaftar.jenis_kelamin || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Tempat, Tanggal Lahir:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedPendaftar.tempat_lahir || '-'}, {selectedPendaftar.tanggal_lahir || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Agama:</span>
                        <span className="font-semibold text-gray-900">{selectedPendaftar.agama || 'Islam'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">No. WhatsApp / HP:</span>
                        <span className="font-mono font-bold text-emerald-800">{selectedPendaftar.no_hp || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">No. KPS / KKS:</span>
                        <span className="font-semibold text-gray-900">{selectedPendaftar.no_kps_kks || '-'}</span>
                      </div>
                      <div className="sm:col-span-3">
                        <span className="text-gray-500 block">Alamat Domisili:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedPendaftar.jalan || '-'}, RT {selectedPendaftar.rt || '-'} / RW {selectedPendaftar.rw || '-'}, {selectedPendaftar.desa_kelurahan || '-'}, {selectedPendaftar.kecamatan || '-'}, {selectedPendaftar.kabupaten || 'Klaten'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bagian B: Orang Tua */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-3">
                    <h4 className="font-extrabold text-primary text-xs uppercase tracking-wider border-b border-gray-200 pb-2">
                      B. Data Orang Tua Kandung
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Ayah */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1.5">
                        <p className="font-bold text-emerald-900">Data Ayah:</p>
                        <p><span className="text-gray-500">Nama:</span> {selectedPendaftar.nama_ayah || '-'}</p>
                        <p><span className="text-gray-500">Pekerjaan:</span> {selectedPendaftar.pekerjaan_ayah || '-'}</p>
                        <p><span className="text-gray-500">Penghasilan:</span> {selectedPendaftar.penghasilan_ayah || '-'}</p>
                        <p><span className="text-gray-500">Status:</span> {selectedPendaftar.status_ayah || 'Masih hidup'}</p>
                      </div>

                      {/* Ibu */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1.5">
                        <p className="font-bold text-emerald-900">Data Ibu:</p>
                        <p><span className="text-gray-500">Nama:</span> {selectedPendaftar.nama_ibu || '-'}</p>
                        <p><span className="text-gray-500">Pekerjaan:</span> {selectedPendaftar.pekerjaan_ibu || '-'}</p>
                        <p><span className="text-gray-500">Penghasilan:</span> {selectedPendaftar.penghasilan_ibu || '-'}</p>
                        <p><span className="text-gray-500">Status:</span> {selectedPendaftar.status_ibu || 'Masih hidup'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bagian C: Periodik */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-3">
                    <h4 className="font-extrabold text-primary text-xs uppercase tracking-wider border-b border-gray-200 pb-2">
                      C. Data Periodik
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block">Tinggi / Berat:</span>
                        <span className="font-semibold text-gray-900">{selectedPendaftar.tinggi_badan || '-'} cm / {selectedPendaftar.berat_badan || '-'} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Anak Ke:</span>
                        <span className="font-semibold text-gray-900">{selectedPendaftar.anak_ke || '-'} dari {selectedPendaftar.dari_berapa_saudara || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Jarak ke Sekolah:</span>
                        <span className="font-semibold text-gray-900">{selectedPendaftar.jarak_sekolah || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Transportasi:</span>
                        <span className="font-semibold text-gray-900">{selectedPendaftar.transportasi || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone: Hapus Pendaftar */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() =>
                        handleDeletePendaftar(
                          selectedPendaftar.id,
                          selectedPendaftar.nama_lengkap
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      <FaTrash /> Hapus Data Pendaftar Ini
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PEMBAYARAN */}
              {activeTab === 'pembayaran' && (
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-emerald-50 to-slate-50 p-5 rounded-2xl border border-emerald-200/70 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Rincian Tagihan Registrasi</p>
                        <h4 className="text-xl font-black text-gray-900 mt-0.5">
                          Total: Rp {(selectedPendaftar.tagihan?.total_tagihan ?? 250000).toLocaleString('id-ID')}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600">Status Saat Ini:</span>
                        <span
                          className={`text-xs font-black px-3 py-1 rounded-full ${
                            selectedPendaftar.status_pembayaran === 'PAID' || selectedPendaftar.status_pembayaran === 'LUNAS'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {selectedPendaftar.status_pembayaran || 'PENDING'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-emerald-100">
                      <div>
                        <span className="text-gray-500 block">Biaya Pokok:</span>
                        <span className="font-mono font-bold text-gray-900">
                          Rp {(selectedPendaftar.tagihan?.biaya_pokok ?? 250000).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Kode Unik:</span>
                        <span className="font-mono font-bold text-gray-900">
                          {selectedPendaftar.tagihan?.kode_unik ?? 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Dibuat Pada:</span>
                        <span className="text-gray-700">
                          {selectedPendaftar.created_at ? new Date(selectedPendaftar.created_at).toLocaleString('id-ID') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QRIS Sandbox Viewer */}
                  {selectedPendaftar.tagihan?.qris_string && (
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center space-y-3">
                      <p className="text-xs font-bold text-gray-600 flex items-center justify-center gap-1.5">
                        <FaQrcode className="text-primary text-sm" /> QRIS Tagihan Peserta
                      </p>
                      <QRCodeSVG
                        value={selectedPendaftar.tagihan.qris_string}
                        size={160}
                        className="mx-auto"
                      />
                      <p className="text-[11px] font-mono text-gray-400 break-all max-w-lg mx-auto">
                        {selectedPendaftar.tagihan.qris_string}
                      </p>
                    </div>
                  )}

                  {/* Action: Ubah Status Bayar */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-2">
                    <p className="text-xs font-bold text-gray-700">
                      Ubah Status Pembayaran Manual:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={isUpdating || selectedPendaftar.status_pembayaran === 'PAID' || selectedPendaftar.status_pembayaran === 'LUNAS'}
                        onClick={() => handleUpdateStatus({ status_pembayaran: 'PAID' })}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40"
                      >
                        ✓ Ubah Status ke LUNAS (PAID)
                      </button>
                      <button
                        disabled={isUpdating || selectedPendaftar.status_pembayaran === 'PENDING' || selectedPendaftar.status_pembayaran === 'UNPAID'}
                        onClick={() => handleUpdateStatus({ status_pembayaran: 'PENDING' })}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40"
                      >
                        ⏳ Kembalikan ke PENDING (UNPAID)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DOKUMEN & KELULUSAN */}
              {activeTab === 'dokumen' && (
                <div className="space-y-6">
                  {/* File Uploads List */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                    <h4 className="font-extrabold text-primary text-xs uppercase tracking-wider border-b border-gray-200 pb-2">
                      Pratinjau Berkas Dokumen Digital
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* KK */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800">Kartu Keluarga (KK)</p>
                          <p className="text-[11px] text-gray-400">
                            {selectedPendaftar.file_kk ? 'File terunggah' : 'Belum diunggah'}
                          </p>
                        </div>
                        {selectedPendaftar.file_kk ? (
                          <a
                            href={`${getBackendOrigin()}${selectedPendaftar.file_kk}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-emerald-700 font-bold flex items-center gap-1"
                          >
                            <span>Lihat</span> <FaExternalLinkAlt className="text-[10px]" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>

                      {/* Akta */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800">Akta Kelahiran</p>
                          <p className="text-[11px] text-gray-400">
                            {selectedPendaftar.file_akta ? 'File terunggah' : 'Belum diunggah'}
                          </p>
                        </div>
                        {selectedPendaftar.file_akta ? (
                          <a
                            href={`${getBackendOrigin()}${selectedPendaftar.file_akta}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-emerald-700 font-bold flex items-center gap-1"
                          >
                            <span>Lihat</span> <FaExternalLinkAlt className="text-[10px]" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>

                      {/* Pas Foto */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800">Pas Foto 3x4</p>
                          <p className="text-[11px] text-gray-400">
                            {selectedPendaftar.file_foto ? 'File terunggah' : 'Belum diunggah'}
                          </p>
                        </div>
                        {selectedPendaftar.file_foto ? (
                          <a
                            href={`${getBackendOrigin()}${selectedPendaftar.file_foto}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-emerald-700 font-bold flex items-center gap-1"
                          >
                            <span>Lihat</span> <FaExternalLinkAlt className="text-[10px]" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>

                      {/* Ijazah */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800">Ijazah / SKL</p>
                          <p className="text-[11px] text-gray-400">
                            {selectedPendaftar.file_ijazah ? 'File terunggah' : 'Belum diunggah'}
                          </p>
                        </div>
                        {selectedPendaftar.file_ijazah ? (
                          <a
                            href={`${getBackendOrigin()}${selectedPendaftar.file_ijazah}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-emerald-700 font-bold flex items-center gap-1"
                          >
                            <span>Lihat</span> <FaExternalLinkAlt className="text-[10px]" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>

                      {/* Rapor Terakhir */}
                      <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800">Rapor Terakhir</p>
                          <p className="text-[11px] text-gray-400">
                            {selectedPendaftar.file_raport ? 'File terunggah' : 'Belum diunggah'}
                          </p>
                        </div>
                        {selectedPendaftar.file_raport ? (
                          <a
                            href={`${getBackendOrigin()}${selectedPendaftar.file_raport}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-emerald-700 font-bold flex items-center gap-1"
                          >
                            <span>Lihat</span> <FaExternalLinkAlt className="text-[10px]" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ubah Status Berkas */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-700">Verifikasi Kelengkapan Dokumen:</p>
                      <span className="text-xs font-bold text-primary bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        Saat ini: {selectedPendaftar.status_dokumen || 'BELUM LENGKAP'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus({ status_dokumen: 'TERVERIFIKASI' })}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        ✓ TERVERIFIKASI
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus({ status_dokumen: 'PERLU PERBAIKAN' })}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        ⚠️ PERLU PERBAIKAN
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus({ status_dokumen: 'BELUM LENGKAP' })}
                        className="px-3.5 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        ✕ BELUM LENGKAP
                      </button>
                    </div>
                  </div>

                  {/* Penentu Status Kelulusan Seleksi */}
                  <div className="bg-emerald-950 text-white p-5 rounded-2xl space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                          Keputusan Hasil Seleksi
                        </p>
                        <p className="text-xs text-emerald-200 mt-0.5">
                          Status ini langsung tampil di Halaman Pengumuman siswa.
                        </p>
                      </div>
                      <span className="text-xs font-black bg-white/20 text-white px-3 py-1 rounded-full">
                        {selectedPendaftar.status_seleksi || 'BELUM PENGUMUMAN'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus({ status_seleksi: 'LULUS' })}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-emerald-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        ★ NYATAKAN LULUS
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus({ status_seleksi: 'TIDAK LULUS' })}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        ✕ TIDAK LULUS
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus({ status_seleksi: 'BELUM PENGUMUMAN' })}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        RESET KE BELUM PENGUMUMAN
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-gray-200 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedPendaftar(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


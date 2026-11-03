import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BiCheckCircle,
  BiXCircle,
  BiReset,
  BiUserCheck,
  BiSearch,
  BiTimeFive,
  BiGroup
} from 'react-icons/bi';
import SuccessNotification from '../../components/common/SuccessNotification';

const DEFAULT_UNITS = [
  { kode: 'tpa', label: 'TPA', name: 'Taman Pendidikan Al-Qur\'an' },
  { kode: 'kb', label: 'KB', name: 'Kelompok Bermain' },
  { kode: 'tk', label: 'TK', name: 'Taman Kanak-Kanak' },
  { kode: 'sd', label: 'SD', name: 'Sekolah Dasar' },
  { kode: 'smp', label: 'SMP', name: 'Sekolah Menengah Pertama' },
  { kode: 'sma', label: 'SMA', name: 'Sekolah Menengah Atas' },
];

export default function AdminKeputusanSeleksi() {
  const [units, setUnits] = useState(DEFAULT_UNITS);
  const [selectedUnit, setSelectedUnit] = useState('sd');
  const [pendaftarList, setPendaftarList] = useState([]);
  const [allUnitCounts, setAllUnitCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeleksi, setFilterSeleksi] = useState('Semua');
  const [filterBayar, setFilterBayar] = useState('Semua');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Notification state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Load dynamic units from API
  useEffect(() => {
    axios.get('http://localhost:8000/api/units/')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(u => ({
            kode: u.kode?.toLowerCase(),
            label: u.kode?.toUpperCase(),
            name: u.nama
          }));
          setUnits(mapped);
          if (!mapped.some(u => u.kode === selectedUnit)) {
            setSelectedUnit(mapped[0].kode);
          }
        }
      })
      .catch(err => console.error('Gagal mengambil dynamic units:', err));
  }, []);

  // Fetch count of all candidates across units for unit switcher badges
  const fetchAllCounts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/pendaftar/');
      const counts = {};
      res.data.forEach(p => {
        const k = p.unit?.toLowerCase();
        if (k) counts[k] = (counts[k] || 0) + 1;
      });
      setAllUnitCounts(counts);
    } catch (err) {
      console.error('Gagal mengambil count unit:', err);
    }
  };

  const fetchPendaftar = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/admin/pendaftar/?unit=${selectedUnit}&`;
      if (searchTerm) url += `search=${searchTerm}&`;
      if (filterSeleksi !== 'Semua') url += `seleksi=${filterSeleksi}&`;
      if (filterBayar !== 'Semua') url += `pembayaran=${filterBayar}&`;

      const res = await axios.get(url);
      setPendaftarList(res.data);
    } catch (err) {
      console.error('Gagal mengambil data pendaftar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCounts();
  }, []);

  useEffect(() => {
    fetchPendaftar();
    setCurrentPage(1);
  }, [selectedUnit, searchTerm, filterSeleksi, filterBayar]);

  const handleUpdateKeputusan = async (pendaftar, keputusan) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/pendaftar/${pendaftar.id}/keputusan/`, {
        keputusan: keputusan
      });

      // Update state secara lokal untuk UX instan
      setPendaftarList(prev =>
        prev.map(p => (p.id === pendaftar.id ? { ...p, status_seleksi: keputusan } : p))
      );

      const labelTeks =
        keputusan === 'LULUS'
          ? 'LULUS'
          : keputusan === 'TIDAK LULUS'
          ? 'TIDAK LULUS'
          : 'Direset (Belum Pengumuman)';

      triggerNotification(`Status ${pendaftar.nama_lengkap} diubah menjadi: ${labelTeks}`);
    } catch (err) {
      console.error('Gagal memperbarui status seleksi:', err);
      alert('Gagal memperbarui keputusan seleksi.');
    }
  };

  // Metric counts
  const totalCalon = pendaftarList.length;
  const countLulus = pendaftarList.filter(p => p.status_seleksi === 'LULUS').length;
  const countTidakLulus = pendaftarList.filter(p => p.status_seleksi === 'TIDAK LULUS').length;
  const countBelum = pendaftarList.filter(
    p => !p.status_seleksi || p.status_seleksi === 'BELUM PENGUMUMAN'
  ).length;

  const percentLulus = totalCalon > 0 ? Math.round((countLulus / totalCalon) * 100) : 0;

  // Pagination calculation
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = pendaftarList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pendaftarList.length / entriesPerPage);

  return (
    <div className="space-y-6">
      {showSuccess && <SuccessNotification message={successMsg} />}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <BiUserCheck className="text-secondary text-2xl" />
            Keputusan Hasil Seleksi Masuk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Penetapan status kelulusan peserta tes PPDB per unit pendidikan secara langsung dan real-time
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
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full sm:w-[340px] bg-[#f8fafc] border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none font-bold text-xs sm:text-sm focus:border-[#2ECC71] transition-all shadow-xs text-slate-800 cursor-pointer"
          >
            {units.map((u) => {
              const count = allUnitCounts[u.kode] ?? 0;
              return (
                <option key={u.kode} value={u.kode}>
                  {u.label} — {u.name} ({count} Siswa)
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Unit Terpilih:</span>
          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            {units.find((u) => u.kode === selectedUnit)?.name || selectedUnit.toUpperCase()}
          </span>
        </div>
      </div>

      {/* CARD METRIK STATISTIK JAUH LEBIH MENARIK (EXECUTIVE MODERN CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Peserta */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#1B4332] via-[#245942] to-[#122c21] text-white shadow-lg shadow-emerald-950/20 border border-white/10 group hover:-translate-y-0.5 transition-transform">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-400/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-widest text-emerald-300 uppercase">
              Total Peserta ({selectedUnit.toUpperCase()})
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 text-xl border border-white/10 shadow-inner">
              <BiGroup />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{totalCalon}</div>
            <p className="text-xs text-emerald-200/90 font-medium mt-1">Calon santri terdaftar di unit ini</p>
          </div>
        </div>

        {/* Card 2: Dinyatakan Lulus */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-700/20 border border-white/10 group hover:-translate-y-0.5 transition-transform">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-300/25 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-widest text-emerald-100 uppercase">
              Dinyatakan Lulus
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl border border-white/20 shadow-inner">
              <BiCheckCircle />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{countLulus}</div>
            <p className="text-xs text-emerald-100/90 font-medium mt-1">
              <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-[10px] mr-1">{percentLulus}%</span>
              Lolos kriteria seleksi masuk
            </p>
          </div>
        </div>

        {/* Card 3: Tidak Lulus */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 text-white shadow-lg shadow-rose-700/20 border border-white/10 group hover:-translate-y-0.5 transition-transform">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-rose-300/25 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-widest text-rose-100 uppercase">
              Tidak Lulus
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl border border-white/20 shadow-inner">
              <BiXCircle />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{countTidakLulus}</div>
            <p className="text-xs text-rose-100/90 font-medium mt-1">Perlu pertimbangan / pembinaan</p>
          </div>
        </div>

        {/* Card 4: Belum Ditentukan */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 text-white shadow-lg shadow-amber-600/20 border border-white/10 group hover:-translate-y-0.5 transition-transform">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-200/25 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-widest text-amber-100 uppercase">
              Belum Ditentukan
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl border border-white/20 shadow-inner">
              <BiTimeFive />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{countBelum}</div>
            <p className="text-xs text-amber-100/90 font-medium mt-1">Menunggu rapat hasil ujian</p>
          </div>
        </div>
      </div>

      {/* Card Tabel Master Gaya Tahfidz_MIS */}
      <div className="bg-white rounded-[8px] p-4 md:p-5 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        {/* Kontrol Baris Atas */}
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
            {/* Filter Status Seleksi */}
            <select
              value={filterSeleksi}
              onChange={(e) => setFilterSeleksi(e.target.value)}
              className="w-full sm:w-[170px] bg-[#f8fafc] border border-gray-300 rounded px-3 py-1.5 outline-none font-normal text-xs sm:text-sm focus:border-[#2ECC71] transition-all cursor-pointer shadow-xs"
            >
              <option value="Semua">Semua Keputusan</option>
              <option value="BELUM PENGUMUMAN">Belum Ditentukan</option>
              <option value="LULUS">Lulus</option>
              <option value="TIDAK LULUS">Tidak Lulus</option>
            </select>

            {/* Filter Bayar */}
            <select
              value={filterBayar}
              onChange={(e) => setFilterBayar(e.target.value)}
              className="w-full sm:w-[150px] bg-[#f8fafc] border border-gray-300 rounded px-3 py-1.5 outline-none font-normal text-xs sm:text-sm focus:border-[#2ECC71] transition-all cursor-pointer shadow-xs"
            >
              <option value="Semua">Semua Tagihan</option>
              <option value="PAID">Lunas (PAID)</option>
              <option value="PENDING">Menunggu Bayar</option>
            </select>

            {/* Kolom Search */}
            <div className="flex items-center w-full sm:w-auto">
              <span className="mr-2 text-sm font-semibold text-slate-700 hidden sm:inline">Search:</span>
              <input
                type="text"
                placeholder="Cari Nama / No. Reg..."
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
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">No. Registrasi</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Nama Calon Siswa</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">L/P</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Sesi Tes Jadwal</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Status Bayar</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Status Berkas</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Hasil Seleksi</th>
                <th className="border border-black px-3 py-3 text-center font-[700] text-black text-[0.85rem] uppercase tracking-wider">Aksi Keputusan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 font-bold text-slate-400">
                    Memuat data pendaftar unit {selectedUnit.toUpperCase()}...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 font-bold text-slate-400">
                    Tidak ada calon siswa ditemukan untuk kriteria ini.
                  </td>
                </tr>
              ) : (
                currentItems.map((row, idx) => (
                  <tr key={row.id} className="even:bg-[#f2f2f2] hover:bg-slate-100 transition-colors">
                    <td className="border border-black px-3 py-2.5 text-center font-medium">
                      {indexOfFirstItem + idx + 1}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center font-mono font-bold text-emerald-800">
                      {row.no_registrasi}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center font-semibold text-slate-800">
                      {row.nama_lengkap}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center text-xs">
                      {row.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center text-xs text-slate-600">
                      {row.jadwal_detail ? (
                        <div>
                          <span className="font-bold text-slate-800">{row.jadwal_detail.tanggal}</span>
                          <span className="block text-[11px] text-slate-500">{row.jadwal_detail.lokasi}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sesi Reguler</span>
                      )}
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.status_pembayaran === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {row.status_pembayaran}
                      </span>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {row.status_dokumen || 'BELUM LENGKAP'}
                      </span>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold inline-block ${
                        row.status_seleksi === 'LULUS'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : row.status_seleksi === 'TIDAK LULUS'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}>
                        {row.status_seleksi || 'BELUM PENGUMUMAN'}
                      </span>
                    </td>
                    <td className="border border-black px-3 py-2.5 text-center">
                      <div className="flex gap-1.5 justify-center items-center">
                        <button
                          onClick={() => handleUpdateKeputusan(row, 'LULUS')}
                          disabled={row.status_seleksi === 'LULUS'}
                          className={`py-1 px-3 rounded-[4px] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            row.status_seleksi === 'LULUS'
                              ? 'bg-emerald-300 text-white cursor-not-allowed opacity-60'
                              : 'bg-[#2ECC71] hover:bg-[#27ae60] text-white shadow-xs'
                          }`}
                          title="Tetapkan Lulus"
                        >
                          <BiCheckCircle className="text-sm" /> Lulus
                        </button>

                        <button
                          onClick={() => handleUpdateKeputusan(row, 'TIDAK LULUS')}
                          disabled={row.status_seleksi === 'TIDAK LULUS'}
                          className={`py-1 px-3 rounded-[4px] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            row.status_seleksi === 'TIDAK LULUS'
                              ? 'bg-red-300 text-white cursor-not-allowed opacity-60'
                              : 'bg-[#E74C3C] hover:bg-[#c0392b] text-white shadow-xs'
                          }`}
                          title="Tetapkan Tidak Lulus"
                        >
                          <BiXCircle className="text-sm" /> Tidak
                        </button>

                        <button
                          onClick={() => handleUpdateKeputusan(row, 'BELUM PENGUMUMAN')}
                          className="bg-[#7F8C8D] hover:bg-[#6c7a7b] text-white py-1 px-2.5 rounded-[4px] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="Reset Status Seleksi"
                        >
                          <BiReset className="text-sm" /> Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kontrol Baris Bawah: Info & Navigasi Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[0.85rem] font-[600] gap-3">
          <div className="text-slate-600">
            Showing {pendaftarList.length === 0 ? 0 : indexOfFirstItem + 1} to{' '}
            {Math.min(indexOfLastItem, pendaftarList.length)} of {pendaftarList.length} entries
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
    </div>
  );
}

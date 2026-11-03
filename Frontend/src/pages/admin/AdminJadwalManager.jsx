import { useState, useEffect } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaSave,
  FaInfoCircle,
  FaUserCheck,
  FaSearch
} from 'react-icons/fa';

export default function AdminJadwalManager() {
  const [jadwalList, setJadwalList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active View / Tab: 'list' (Master Jadwal) | 'monitoring' (Monitor Peserta)
  const [viewMode, setViewMode] = useState('list');
  const [monitoredJadwal, setMonitoredJadwal] = useState(null);
  const [pesertaList, setPesertaList] = useState([]);
  const [loadingPeserta, setLoadingPeserta] = useState(false);
  const [searchPeserta, setSearchPeserta] = useState('');

  // Modal State Tambah / Edit Jadwal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState(null);
  const [formData, setFormData] = useState({
    gelombang: 'Gelombang 1 - Tahun Ajaran 2026/2027',
    tanggal: '',
    waktu_mulai: '08:00',
    waktu_selesai: '11:30',
    lokasi: 'Aula Kampus Utama Mentari Islamic School',
    deskripsi: 'Tes Pemetaan Karakter, Observasi Tahsin & Wawancara Orang Tua',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Master Jadwal
  const fetchJadwalList = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/admin/jadwal/');
      if (res.ok) {
        const data = await res.json();
        setJadwalList(data);
      }
    } catch (err) {
      console.error('Error fetching jadwal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwalList();
  }, []);

  // Fetch Peserta untuk Jadwal Tertentu
  const fetchPesertaJadwal = async (jadwal) => {
    setMonitoredJadwal(jadwal);
    setViewMode('monitoring');
    setLoadingPeserta(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/jadwal/${jadwal.id}/peserta/`);
      if (res.ok) {
        const data = await res.json();
        setPesertaList(data);
      }
    } catch (err) {
      console.error('Error fetching peserta per jadwal:', err);
    } finally {
      setLoadingPeserta(false);
    }
  };

  // Open Modal Tambah
  const handleOpenAdd = () => {
    setEditingJadwal(null);
    setFormData({
      gelombang: 'Gelombang 1 - Tahun Ajaran 2026/2027',
      tanggal: new Date().toISOString().split('T')[0],
      waktu_mulai: '08:00',
      waktu_selesai: '11:30',
      lokasi: 'Aula Kampus Utama Mentari Islamic School (Polanharjo)',
      deskripsi: 'Tes Pemetaan Karakter, Observasi Tahsin & Wawancara Orang Tua',
    });
    setIsModalOpen(true);
  };

  // Open Modal Edit
  const handleOpenEdit = (jadwal) => {
    setEditingJadwal(jadwal);
    setFormData({
      gelombang: jadwal.gelombang || '',
      tanggal: jadwal.tanggal || '',
      waktu_mulai: jadwal.waktu_mulai || '08:00',
      waktu_selesai: jadwal.waktu_selesai || '11:30',
      lokasi: jadwal.lokasi || '',
      deskripsi: jadwal.deskripsi || '',
    });
    setIsModalOpen(true);
  };

  // Save Jadwal (POST or PATCH)
  const handleSaveJadwal = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingJadwal
        ? `http://localhost:8000/api/admin/jadwal/${editingJadwal.id}/`
        : 'http://localhost:8000/api/admin/jadwal/';
      const method = editingJadwal ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchJadwalList();
      } else {
        alert('Gagal menyimpan jadwal seleksi.');
      }
    } catch (err) {
      console.error('Error saving jadwal:', err);
      alert('Terjadi kesalahan koneksi saat menyimpan jadwal.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Jadwal
  const handleDeleteJadwal = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus jadwal "${nama}"?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/jadwal/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok || res.status === 204) {
        fetchJadwalList();
        if (monitoredJadwal?.id === id) {
          setViewMode('list');
          setMonitoredJadwal(null);
        }
      } else {
        alert('Gagal menghapus jadwal.');
      }
    } catch (err) {
      console.error('Error deleting jadwal:', err);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  // Quick Update Status Seleksi Peserta di Halaman Monitoring
  const handleUpdateStatusPeserta = async (pendaftarId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/pendaftar/${pendaftarId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_seleksi: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPesertaList((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const formatTanggalIndo = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const safe = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
      const d = new Date(safe);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const filteredPeserta = pesertaList.filter((p) => {
    if (!searchPeserta) return true;
    const q = searchPeserta.toLowerCase();
    return (
      p.nama_lengkap?.toLowerCase().includes(q) ||
      p.no_registrasi?.toLowerCase().includes(q) ||
      p.unit?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
            AGENDA SELEKSI & PEMETAAN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Jadwal Seleksi & Monitoring Peserta
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Kelola agenda observasi, tes pemetaan santri, serta pantau kehadiran dan status kelulusan peserta.
          </p>
        </div>

        {viewMode === 'list' ? (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-primary hover:bg-emerald-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-sm transition-all cursor-pointer self-start sm:self-center"
          >
            <FaPlus className="text-xs" />
            <span>Buat Jadwal Baru</span>
          </button>
        ) : (
          <button
            onClick={() => setViewMode('list')}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-2xl border border-gray-200 transition-all cursor-pointer self-start sm:self-center"
          >
            <FaArrowLeft className="text-xs" />
            <span>Kembali ke Master Jadwal</span>
          </button>
        )}
      </div>

      {/* SECTION 1: MASTER DAFTAR JADWAL SELEKSI */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FaCalendarAlt className="text-primary text-base" />
                <span>Daftar Agenda Seleksi Tersedia</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Jadwal ini tampil langsung pada kartu peserta di Portal Calon Siswa.
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-gray-700 px-3 py-1 rounded-full font-mono">
              Total {jadwalList.length} Jadwal
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500 animate-pulse">
              Memuat daftar jadwal seleksi...
            </div>
          ) : jadwalList.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-400">
              Belum ada jadwal seleksi yang dibuat. Silakan klik tombol <strong>"Buat Jadwal Baru"</strong> di atas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase font-extrabold text-gray-500 bg-slate-50/80">
                    <th className="py-3.5 px-4">Gelombang / Sesi</th>
                    <th className="py-3.5 px-4">Hari, Tanggal</th>
                    <th className="py-3.5 px-4">Waktu</th>
                    <th className="py-3.5 px-4">Lokasi Pelaksanaan</th>
                    <th className="py-3.5 px-4">Deskripsi Tes</th>
                    <th className="py-3.5 px-4 text-center">Monitoring</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jadwalList.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {j.gelombang}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-emerald-900 whitespace-nowrap">
                        {formatTanggalIndo(j.tanggal)}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                          <FaClock className="text-gray-400 text-[10px]" />
                          {j.waktu_mulai?.slice(0, 5)} - {j.waktu_selesai?.slice(0, 5)} WIB
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-700 max-w-xs truncate">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-secondary shrink-0 text-xs" />
                          <span className="truncate">{j.lokasi}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500 max-w-xs truncate">
                        {j.deskripsi || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => fetchPesertaJadwal(j)}
                          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-primary font-extrabold text-xs px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all cursor-pointer shadow-2xs"
                        >
                          <FaUsers className="text-xs" />
                          <span>Monitor Peserta</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(j)}
                            className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Jadwal"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDeleteJadwal(j.id, j.gelombang)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Jadwal"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: MONITORING PESERTA SELEKSI */}
      {viewMode === 'monitoring' && monitoredJadwal && (
        <div className="space-y-6 animate-fade-in">
          {/* Card Info Jadwal yang Dimonitor */}
          <div className="bg-gradient-to-r from-emerald-950 via-primary to-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-300 px-3 py-0.5 rounded-full inline-block">
                  SESI SELEKSI SEDANG DIMONITOR
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {monitoredJadwal.gelombang}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200 pt-1">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt /> {formatTanggalIndo(monitoredJadwal.tanggal)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaClock /> {monitoredJadwal.waktu_mulai?.slice(0, 5)} - {monitoredJadwal.waktu_selesai?.slice(0, 5)} WIB
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt /> {monitoredJadwal.lokasi}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-center self-start md:self-center">
                <p className="text-[10px] uppercase font-bold text-emerald-300">Total Peserta Terdata</p>
                <p className="text-2xl font-black font-mono text-white mt-0.5">
                  {pesertaList.length} Siswa
                </p>
              </div>
            </div>
          </div>

          {/* Filter & Search Peserta */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Cari santri peserta seleksi..."
                value={searchPeserta}
                onChange={(e) => setSearchPeserta(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <button
              onClick={() => fetchPesertaJadwal(monitoredJadwal)}
              className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer self-start sm:self-center"
            >
              Segarkan Data Peserta
            </button>
          </div>

          {/* Tabel Santri Peserta */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            {loadingPeserta ? (
              <div className="p-12 text-center text-sm text-gray-500 animate-pulse">
                Memuat data peserta seleksi...
              </div>
            ) : filteredPeserta.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-400">
                Tidak ada data santri yang cocok dengan pencarian.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase font-extrabold text-gray-500 bg-slate-50/80">
                      <th className="py-3.5 px-4">No. Registrasi</th>
                      <th className="py-3.5 px-4">Nama Santri</th>
                      <th className="py-3.5 px-4">Jenjang</th>
                      <th className="py-3.5 px-4">Kontak Wali</th>
                      <th className="py-3.5 px-4 text-center">Status Pembayaran</th>
                      <th className="py-3.5 px-4 text-center">Hasil Seleksi</th>
                      <th className="py-3.5 px-4 text-center">Tetapkan Keputusan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPeserta.map((p) => {
                      const isPaid = p.status_pembayaran === 'PAID' || p.status_pembayaran === 'LUNAS';
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-xs text-emerald-800">
                            {p.no_registrasi}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-900">
                            {p.nama_lengkap}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-bold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md">
                              {p.unit}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-mono text-gray-600">
                            {p.no_hp || '-'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                isPaid
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isPaid ? <FaCheckCircle className="text-[10px]" /> : <FaClock className="text-[10px]" />}
                              {isPaid ? 'LUNAS' : 'PENDING'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                p.status_seleksi === 'LULUS'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status_seleksi === 'TIDAK LULUS'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {p.status_seleksi || 'BELUM PENGUMUMAN'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateStatusPeserta(p.id, 'LULUS')}
                                className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all cursor-pointer"
                                title="Nyatakan LULUS"
                              >
                                Lulus
                              </button>
                              <button
                                onClick={() => handleUpdateStatusPeserta(p.id, 'TIDAK LULUS')}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all cursor-pointer"
                                title="Nyatakan TIDAK LULUS"
                              >
                                Tidak
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Form Tambah / Edit Jadwal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingJadwal ? 'Edit Agenda Jadwal Seleksi' : 'Buat Jadwal Seleksi Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveJadwal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Gelombang / Keterangan Sesi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gelombang 1 - Tahun Ajaran 2026/2027"
                  value={formData.gelombang}
                  onChange={(e) =>
                    setFormData({ ...formData, gelombang: e.target.value })
                  }
                  className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Hari & Tanggal Pelaksanaan
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.waktu_mulai}
                    onChange={(e) =>
                      setFormData({ ...formData, waktu_mulai: e.target.value })
                    }
                    className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.waktu_selesai}
                    onChange={(e) =>
                      setFormData({ ...formData, waktu_selesai: e.target.value })
                    }
                    className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Lokasi Tempat Tes
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aula Kampus Utama Mentari Islamic School"
                  value={formData.lokasi}
                  onChange={(e) =>
                    setFormData({ ...formData, lokasi: e.target.value })
                  }
                  className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Deskripsi & Materi Pengujian
                </label>
                <textarea
                  rows="3"
                  placeholder="Contoh: Tes Pemetaan Karakter, Observasi Tahsin & Wawancara"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  className="w-full text-sm bg-slate-50 border border-gray-300 rounded-xl p-3 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-emerald-900 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Agenda Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


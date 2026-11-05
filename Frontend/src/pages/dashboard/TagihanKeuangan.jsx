import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCreditCard,
  FaCheckCircle,
  FaPrint,
  FaLock,
  FaDownload,
  FaFileInvoiceDollar,
  FaFileUpload,
  FaExternalLinkAlt,
  FaReceipt,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaBuilding,
  FaShieldAlt
} from 'react-icons/fa';

export default function TagihanKeuangan() {
  const navigate = useNavigate();
  const [dataSiswa, setDataSiswa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalKwitansiOpen, setIsModalKwitansiOpen] = useState(false);
  const [isUploadingBukti, setIsUploadingBukti] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`${getBaseApiUrl()}/dashboard-data/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDataSiswa(data);
        if (data.nama_lengkap) {
          localStorage.setItem('user_name', data.nama_lengkap);
          window.dispatchEvent(new Event('user_profile_updated'));
        }
      } else {
        localStorage.removeItem('access_token');
        navigate('/login');
      }
    } catch (err) {
      console.error('Error fetching dashboard-data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleUploadBuktiManual = async (file) => {
    if (!file || !dataSiswa) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file struk melebihi batas 2 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('bukti_pembayaran', file);

    setIsUploadingBukti(true);
    setUploadSuccess('');
    try {
      const res = await fetch(
        `${getBaseApiUrl()}/payment/upload-bukti/${dataSiswa.no_registrasi}/`,
        {
          method: 'POST',
          body: formData
        }
      );
      if (res.ok) {
        setUploadSuccess('Bukti pembayaran berhasil diunggah!');
        await fetchData();
      } else {
        alert('Gagal mengunggah bukti pembayaran.');
      }
    } catch (err) {
      console.error('Error uploading bukti:', err);
      alert('Koneksi terputus saat mengunggah file.');
    } finally {
      setIsUploadingBukti(false);
    }
  };

  const handlePrintKwitansi = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-500 font-semibold flex flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-secondary text-3xl" />
        <span className="text-sm font-medium">Memuat data keuangan & tagihan...</span>
      </div>
    );
  }

  if (!dataSiswa) return null;

  const tagihan = dataSiswa.tagihan;
  const nominalTotal = tagihan?.total_tagihan ?? 250000;
  const biayaPokok = tagihan?.biaya_pokok ?? 250000;
  const kodeUnik = tagihan?.kode_unik ?? 0;
  const noKwitansi = `KW-MIS-${dataSiswa.no_registrasi?.replace('MIS-', '') || '2026-001'}`;
  const buktiUrl = tagihan?.bukti_pembayaran;

  // Tanggal Transaksi
  const tglBayar = dataSiswa.created_at
    ? new Date(dataSiswa.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '12 Oktober 2026';

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <FaFileInvoiceDollar className="text-secondary text-2xl" />
            Tagihan & Keuangan Santri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rincian pelunasan biaya formulir pendaftaran, struk transaksi, dan kwitansi resmi pembayaran
          </p>
        </div>

        <button
          onClick={() => setIsModalKwitansiOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <FaPrint />
          <span>Cetak Kwitansi Resmi</span>
        </button>
      </div>

      {/* ==============================================================
          1. CARD RIWAYAT PELUNASAN FORMULIR (STATUS SUDAH LUNAS)
          ============================================================== */}
      <div className="bg-white rounded-[10px] p-6 border-t-[5px] border-[#2ECC71] shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-lg shadow-xs">
              <FaReceipt />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  Bukti Pelunasan Biaya Pendaftaran
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  LUNAS ✓
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pendaftaran Unit {dataSiswa.unit?.toUpperCase() || 'SD'} Tahun Ajaran 2026/2027
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalKwitansiOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <FaPrint className="text-xs text-emerald-700" />
            <span>Lihat Kwitansi Resmi</span>
          </button>
        </div>

        {/* Tabel Rincian Pembayaran */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-y border-slate-200 text-xs uppercase tracking-wider font-extrabold">
                <th className="py-3 px-4">No. Kwitansi</th>
                <th className="py-3 px-4">Nama Tagihan</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4">Tanggal Lunas</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-4 font-mono font-bold text-xs text-slate-700">
                  {noKwitansi}
                </td>
                <td className="py-4 px-4">
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                    Biaya Formulir & Pendaftaran Santri Baru
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Unit {dataSiswa.unit?.toUpperCase()} (Pokok: Rp {biayaPokok.toLocaleString('id-ID')} + Unik: Rp {kodeUnik})
                  </span>
                </td>
                <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                  QRIS SNAP BRI / Transfer
                </td>
                <td className="py-4 px-4 text-xs font-medium text-slate-600">
                  {tglBayar}
                </td>
                <td className="py-4 px-4 font-black text-slate-900 font-mono text-sm">
                  Rp {nominalTotal.toLocaleString('id-ID')}
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                    <FaCheckCircle className="text-xs text-emerald-700" />
                    LUNAS
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ==============================================================
            2. BAGIAN BUKTI PEMBAYARAN MANUAL / STRUK TRANSFER
            ============================================================== */}
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-emerald-50/70 rounded-xl p-5 border border-emerald-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-2">
                <FaReceipt className="text-secondary" />
                Bukti Struk Transfer / Pembayaran Manual
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                File struk transfer bank atau bukti transaksi QRIS yang telah diunggah saat pendaftaran
              </p>
            </div>
            {buktiUrl && (
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300 self-start sm:self-auto">
                Tersimpan di Sistem ✓
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              {buktiUrl ? (
                <a
                  href={buktiUrl.startsWith('http') ? buktiUrl : `${getBackendOrigin()}${buktiUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-emerald-900 text-xs font-black rounded-lg border border-emerald-300 shadow-xs transition-colors"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  <span>Lihat Struk Pembayaran Asli ↗</span>
                </a>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  Belum ada file struk manual yang diunggah.
                </span>
              )}
            </div>

            {/* Tombol Upload / Ganti Struk */}
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-900 text-xs font-bold rounded-lg border border-slate-300 transition-colors shadow-2xs self-start sm:self-auto">
              {isUploadingBukti ? (
                <>
                  <FaSpinner className="animate-spin text-secondary" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <FaFileUpload className="text-secondary" />
                  <span>{buktiUrl ? 'Ganti File Struk' : 'Upload Bukti Transfer'}</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                disabled={isUploadingBukti}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadBuktiManual(file);
                }}
              />
            </label>
          </div>

          {uploadSuccess && (
            <p className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
              ✓ {uploadSuccess}
            </p>
          )}
        </div>
      </div>

      {/* ==============================================================
          3. CARD TAGIHAN DAFTAR ULANG (INFORMATIF TAHAP SELANJUTNYA)
          ============================================================== */}
      <div className="bg-white rounded-[10px] p-6 sm:p-8 border-t-[5px] border-slate-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-x border-b border-slate-200 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-2xl mx-auto shadow-inner">
          <FaLock />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-base sm:text-lg font-black text-slate-800">
            Biaya Daftar Ulang & Infaq Pendidikan
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Rincian tagihan daftar ulang dan seragam akan dibuka setelah calon santri dinyatakan <strong className="text-emerald-700">Lulus Seleksi Masuk</strong> pada tahap pengumuman resmi.
          </p>
        </div>
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
            Status: Menunggu Keputusan Seleksi
          </span>
        </div>
      </div>

      {/* ==============================================================
          4. MODAL & CETAK KWITANSI RESMI (OFFICIAL RECEIPT PRINT)
          ============================================================== */}
      {isModalKwitansiOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-8">
            {/* Header Modal Bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2.5">
                <FaReceipt className="text-secondary text-lg" />
                <span className="font-black text-sm">Preview Kwitansi Pembayaran Resmi</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintKwitansi}
                  className="px-3.5 py-1.5 bg-secondary hover:bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FaPrint />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  onClick={() => setIsModalKwitansiOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* DOKUMEN KWITANSI RESMI (AREA YANG DICETAK) */}
            <div id="area-kwitansi-print" className="p-8 sm:p-10 space-y-6 text-slate-900 bg-white">
              {/* Kop Lembaga */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
                    PKBM MENTARI KAYAARTA KLATEN
                  </h2>
                  <p className="text-xs font-bold text-slate-700">
                    PANITIA PENERIMAAN SANTRI BARU (PPDB) 2026/2027
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-mono font-black text-xs rounded border border-emerald-300">
                    {noKwitansi}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Tanggal: {tglBayar}</p>
                </div>
              </div>

              {/* Judul Kwitansi */}
              <div className="text-center py-1">
                <h3 className="text-base font-black uppercase tracking-wider underline underline-offset-4 text-slate-900">
                  KWITANSI BUKTI PEMBAYARAN
                </h3>
              </div>

              {/* Rincian Kwitansi */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start">
                  <span className="w-40 font-bold text-slate-600 shrink-0">Telah Diterima Dari</span>
                  <span className="font-bold text-slate-900">: Wali dari {dataSiswa.nama_lengkap}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-40 font-bold text-slate-600 shrink-0">Nomor Registrasi</span>
                  <span className="font-mono font-bold text-slate-900">: {dataSiswa.no_registrasi}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-40 font-bold text-slate-600 shrink-0">Unit Pendidikan</span>
                  <span className="font-bold text-emerald-800 uppercase">: {dataSiswa.unit} Mentari Islamic School</span>
                </div>
                <div className="flex items-start">
                  <span className="w-40 font-bold text-slate-600 shrink-0">Uang Sejumlah</span>
                  <span className="font-black text-slate-900 font-mono text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    : Rp {nominalTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-40 font-bold text-slate-600 shrink-0">Untuk Pembayaran</span>
                  <span className="text-slate-800">
                    : Biaya Formulir Pendaftaran dan Ujian Masuk Santri Baru (Pokok: Rp {biayaPokok.toLocaleString('id-ID')}, Kode Unik: Rp {kodeUnik})
                  </span>
                </div>
              </div>

              {/* Tanda Terima & Cap Stempel */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
                {/* Cap Stempel Lunas */}
                <div className="w-28 h-28 rounded-full border-4 border-dashed border-emerald-600 text-emerald-700 flex flex-col items-center justify-center rotate-[-12deg] shadow-sm font-black p-2">
                  <span className="text-[10px] uppercase tracking-widest">PPDB MIS</span>
                  <span className="text-lg leading-none py-0.5">LUNAS</span>
                  <span className="text-[9px] uppercase tracking-wider font-mono">TERVERIFIKASI</span>
                </div>

                <div className="text-center space-y-12">
                  <p className="text-slate-600">Klaten, {tglBayar}</p>
                  <div>
                    <p className="font-black underline text-slate-900">Bendahara PPDB</p>
                    <p className="text-[10px] text-slate-500">Mentari Islamic School</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

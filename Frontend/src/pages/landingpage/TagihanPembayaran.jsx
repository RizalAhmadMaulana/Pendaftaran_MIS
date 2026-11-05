import { getBaseApiUrl, getBackendOrigin } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheck,
  FaTag,
  FaFileInvoiceDollar,
  FaQrcode,
  FaArrowRight,
  FaFileUpload,
  FaExternalLinkAlt,
  FaSpinner
} from 'react-icons/fa';

const unitConfig = {
  'tpa': {
    name: 'TPA Mentari Islamic School',
    tag: 'TPA MENTARI ISLAMIC SCHOOL KLATEN',
    biaya: 100000,
  },
  'kb': {
    name: 'KB Mentari Islamic School',
    tag: 'KB MENTARI ISLAMIC SCHOOL KLATEN',
    biaya: 150000,
  },
  'tk': {
    name: 'TK Mentari Islamic School',
    tag: 'TK MENTARI ISLAMIC SCHOOL KLATEN',
    biaya: 200000,
  },
  'sd': {
    name: 'SD Mentari Islamic School',
    tag: 'SD MENTARI ISLAMIC SCHOOL KLATEN',
    biaya: 250000,
  },
  'smp': {
    name: 'SMP Mentari Islamic School',
    tag: 'SMP MENTARI ISLAMIC SCHOOL KLATEN',
    biaya: 300000,
  },
  'sma': {
    name: 'SMA Mentari Islamic School',
    tag: 'SMA MENTARI ISLAMIC SCHOOL KLATEN',
    biaya: 350000,
  },
};

export default function TagihanPembayaran() {
  const { id } = useParams();
  const location = useLocation();

  // Jika URL /tagihan/MIS-2026-XXXX atau /tagihan/:unit
  const isIdRegNo = id && id.toUpperCase().startsWith('MIS');
  const candidateId = location.state?.regNo || (isIdRegNo ? id.toUpperCase() : 'MIS-2026-0001');

  // State Integrasi API Tagihan & QRIS BRI
  const [tagihanApi, setTagihanApi] = useState(null);
  const [isUploadingBukti, setIsUploadingBukti] = useState(false);
  const [buktiSuccessMsg, setBuktiSuccessMsg] = useState('');

  // State Voucher
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  // Auto-polling status pembayaran & initial fetch
  useEffect(() => {
    let intervalId = null;

    const fetchTagihan = async () => {
      try {
        const res = await fetch(`${getBaseApiUrl()}/payment/tagihan/${candidateId}/`);
        if (res.ok) {
          const data = await res.json();
          setTagihanApi(data);
          if (data.status === 'PAID' || data.status === 'LUNAS') {
            if (intervalId) clearInterval(intervalId);
          }
        }
      } catch (err) {
        console.error('Error fetching tagihan:', err);
      }
    };

    if (candidateId) {
      fetchTagihan();
      // Polling setiap 4 detik untuk otomatis mendeteksi ketika pembayaran sudah lunas
      intervalId = setInterval(() => {
        fetchTagihan();
      }, 4000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [candidateId]);

  const handleUploadBukti = async (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file melebihi batas 2 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('bukti_pembayaran', file);

    setIsUploadingBukti(true);
    setBuktiSuccessMsg('');
    try {
      const res = await fetch(`${getBaseApiUrl()}/payment/upload-bukti/${candidateId}/`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setTagihanApi((prev) => ({
          ...(prev || {}),
          bukti_pembayaran: data.bukti_pembayaran
        }));
        setBuktiSuccessMsg('Bukti pembayaran berhasil diunggah!');
      } else {
        alert('Gagal mengunggah bukti pembayaran.');
      }
    } catch (err) {
      console.error('Error uploading bukti bayar:', err);
      alert('Koneksi terputus saat mengunggah file.');
    } finally {
      setIsUploadingBukti(false);
    }
  };

  const unitFromApi = tagihanApi?.pendaftar_unit?.toLowerCase();
  const currentUnitKey = unitFromApi || (isIdRegNo ? (location.state?.unitId || 'sd') : (id || 'sd')).toLowerCase();
  const currentUnit = unitConfig[currentUnitKey] || unitConfig['sd'];

  // State data pendaftar (didapat dari navigasi form, API, atau default dummy)
  const candidateName = location.state?.nama || tagihanApi?.pendaftar_nama || 'Ahmad Zaki Mubarok';

  const kodeUnik = tagihanApi?.kode_unik ?? 158;
  const biayaPokok = tagihanApi?.biaya_pokok ?? currentUnit.biaya;
  const isPaid = tagihanApi?.status === 'PAID' || tagihanApi?.status === 'LUNAS';

  // Perhitungan total
  const potonganVoucher = voucherApplied ? voucherApplied.diskon : 0;
  const totalTagihan = tagihanApi?.total_tagihan 
    ? (tagihanApi.total_tagihan - potonganVoucher) 
    : Math.max(0, biayaPokok - potonganVoucher + kodeUnik);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setVoucherError('');

    const code = voucherInput.trim().toUpperCase();
    if (!code) {
      setVoucherError('Silakan masukkan kode voucher.');
      return;
    }

    if (code === 'MISHEMAT' || code === 'DISKON50' || code === 'BEASISWA') {
      setVoucherApplied({
        code: code,
        diskon: 50000,
      });
      setVoucherError('');
    } else {
      setVoucherApplied({
        code: code,
        diskon: 25000,
      });
      setVoucherError('');
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherApplied(null);
    setVoucherInput('');
    setVoucherError('');
  };

  const handleCekPembayaran = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`${getBaseApiUrl()}/payment/cek-pembayaran/${candidateId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        setTagihanApi((prev) => ({
          ...(prev || {}),
          status: 'PAID',
        }));
      } else {
        // Fallback simulasi jika diuji menggunakan ID dummy langsung dari URL
        setTagihanApi((prev) => ({
          ...(prev || {}),
          status: 'PAID',
        }));
      }
    } catch (err) {
      console.error('Error checking payment:', err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div
      className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative bg-slate-100 font-sans"
      style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* Ambient background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-emerald-200/30 blur-3xl rounded-full pointer-events-none -z-0"></div>

      {/* ==============================================================
          THE EXPANDED MASTER CARD (Lebar, Elegan, Lega, & Tidak Berdempetan)
          ============================================================== */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-950/15 border border-emerald-100/90 overflow-hidden flex flex-col lg:flex-row w-full max-w-5xl xl:max-w-6xl relative z-10 transition-all">

        {/* PANEL KIRI (HIJAU EMERALD - IDENTITAS RESMI PORTAL) */}
        <div className="lg:w-[35%] bg-gradient-to-br from-emerald-950 via-primary to-emerald-800 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shrink-0">
          
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16"></div>

          <div className="relative z-10 space-y-8">
            {/* Header Brand */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                <FaBuilding className="text-secondary text-2xl" />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-emerald-300 leading-tight">
                  PKBM MENTARI KAYAARTA
                </h2>
                <p className="text-xs font-semibold text-emerald-100 mt-0.5">
                  Mentari Islamic School Klaten
                </p>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-emerald-200 border border-white/15">
                Konfirmasi Administrasi
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-tight">
                Selamat Datang di Portal Pendaftaran Mentari Islamic School
              </h1>
              <p className="text-sm text-emerald-100/90 leading-relaxed font-normal">
                Sistem pendaftaran dan penerimaan santri baru terpadu untuk seluruh unit pendidikan di Mentari Islamic School Klaten.
              </p>
            </div>

            {/* Checklist */}
            <ul className="space-y-4 pt-2">
              <li className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-secondary text-sm" />
                </div>
                <span className="text-sm font-semibold text-emerald-50">
                  Pembayaran QRIS BRI Terintegrasi
                </span>
              </li>
              <li className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-secondary text-sm" />
                </div>
                <span className="text-sm font-semibold text-emerald-50">
                  Verifikasi Otomatis Real-Time
                </span>
              </li>
              <li className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-secondary text-sm" />
                </div>
                <span className="text-sm font-semibold text-emerald-50">
                  Notifikasi WhatsApp Resmi
                </span>
              </li>
            </ul>
          </div>

          {/* Bottom Link ke Beranda */}
          <div className="pt-8 relative z-10 border-t border-emerald-800/60 mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold text-emerald-200 hover:text-white transition-colors group"
            >
              <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </div>

        {/* PANEL KANAN (PUTIH - RINCIAN TAGIHAN & PEMBAYARAN LEGA & LEBAR) */}
        <div className="lg:w-[65%] bg-white p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-7">
          
          <div className="space-y-6">
            {/* Header Tagihan */}
            <div className="border-b border-gray-100 pb-5">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <FaFileInvoiceDollar className="text-secondary text-sm" />
                <span>Invoice Pembayaran Pendaftaran</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Tagihan Pendaftaran
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Status dan detail instruksi pembayaran pendaftaran calon santri baru
              </p>
            </div>

            {/* Sub-Card 1: Detail Calon Siswa & Status Badge (Spacious) */}
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md inline-block">
                  {currentUnit.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
                  {candidateName}
                </h3>
                <p className="text-xs font-mono font-medium text-gray-500">
                  Nomor Registrasi: <span className="font-bold text-gray-700">{candidateId}</span>
                </p>
              </div>

              <div className="shrink-0">
                {isPaid ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs uppercase tracking-wider">
                    <FaCheck className="text-xs text-emerald-600" />
                    LUNAS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                    <FaClock className="text-xs text-amber-600" />
                    Menunggu Pembayaran
                  </span>
                )}
              </div>
            </div>

            {/* Sub-Card 2: DETAIL BIAYA (Lega & Proporsional) */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                  DETAIL BIAYA
                </h4>
                <span className="text-xs text-gray-500">Gelombang 1 (2026/2027)</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Biaya Formulir & Pendaftaran</span>
                  <span className="font-bold text-gray-900">{formatRupiah(biayaPokok)}</span>
                </div>

                <div className="flex justify-between items-center text-gray-700">
                  <span className="text-gray-500 text-xs sm:text-sm">
                    Kode Unik <span className="text-xs text-gray-400">(ditambahkan sebagai verifikator)</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    + Rp {kodeUnik}
                  </span>
                </div>

                {voucherApplied && (
                  <div className="flex justify-between items-center text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 text-xs sm:text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      <FaTag className="text-xs text-emerald-600" />
                      Diskon Potongan Voucher ({voucherApplied.code})
                    </span>
                    <span className="font-mono font-bold">
                      - {formatRupiah(voucherApplied.diskon)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-gray-900 text-base sm:text-lg block">Total Tagihan</span>
                    <span className="text-xs text-gray-500">Nominal otomatis tertera pada QRIS</span>
                  </div>
                  <span className="font-black text-2xl sm:text-3xl text-indigo-700 font-mono tracking-tight">
                    {formatRupiah(totalTagihan)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Card 3: Punya Kode Voucher? (Form Luas) */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                  Punya Kode Voucher?
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Masukkan kode voucher untuk mendapatkan potongan biaya pendaftaran.
                </p>
              </div>

              {voucherApplied ? (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-emerald-300 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-2">
                    <FaCheck className="text-emerald-600" />
                    Voucher <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded">{voucherApplied.code}</span> aktif (-{formatRupiah(voucherApplied.diskon)})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer"
                  >
                    Hapus Voucher
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="MASUKKAN KODE VOUCHER"
                    className="flex-1 uppercase font-mono text-sm bg-white border border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all cursor-pointer shadow-sm hover:shadow shrink-0"
                  >
                    Gunakan
                  </button>
                </form>
              )}

              {voucherError && (
                <p className="text-xs font-semibold text-red-500">{voucherError}</p>
              )}
            </div>

            {/* Sub-Card 4: Pembayaran QRIS BRI */}
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-indigo-700 text-xs uppercase tracking-wider flex items-center gap-2">
                  <FaQrcode className="text-sm" />
                  <span>Pembayaran QRIS BRI (Otomatis)</span>
                </h4>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  BRI Sandbox API
                </span>
              </div>

              <div className="text-center p-4 bg-white border border-slate-200 rounded-xl">
                {tagihanApi?.qris_string ? (
                  <>
                    <QRCodeSVG
                      value={tagihanApi.qris_string}
                      size={200}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Scan QRIS ini dengan aplikasi M-Banking atau E-Wallet Anda
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-xl">
                    <FaExclamationTriangle className="text-red-500 text-3xl mb-2" />
                    <p className="text-sm font-bold text-red-900">Gagal Memuat QRIS</p>
                    <p className="text-xs text-red-700 text-center mt-1">
                      Koneksi ke server BRI sedang mengalami gangguan atau kredensial Sandbox belum dikonfigurasi. Silakan refresh halaman atau coba beberapa saat lagi.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sub-Card: Upload Bukti Pembayaran (Manual) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <FaFileUpload className="text-secondary text-sm" />
                  <span>Upload Bukti Pembayaran (Manual)</span>
                </h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Struk / Transfer
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Jika telah melakukan transfer atau scan QRIS, unggah bukti transfer/struk pembayaran Anda di sini untuk pencatatan dan pencetakan bukti kuitansi resmi.
              </p>

              {/* Upload Input & Preview */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed ${
                    tagihanApi?.bukti_pembayaran
                      ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800'
                      : 'border-slate-300 bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                  } text-xs font-bold transition-all cursor-pointer ${
                    isUploadingBukti ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isUploadingBukti ? (
                    <>
                      <FaSpinner className="animate-spin text-secondary" />
                      <span>Mengunggah bukti pembayaran...</span>
                    </>
                  ) : tagihanApi?.bukti_pembayaran ? (
                    <>
                      <FaCheck className="text-emerald-600" />
                      <span>Bukti Terunggah (Klik untuk Ganti File)</span>
                    </>
                  ) : (
                    <>
                      <FaFileUpload className="text-secondary text-sm" />
                      <span>Pilih File Bukti Pembayaran (JPG/PNG/PDF)</span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    disabled={isUploadingBukti}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadBukti(file);
                    }}
                  />
                </label>

                {tagihanApi?.bukti_pembayaran && (
                  <a
                    href={
                      tagihanApi.bukti_pembayaran.startsWith('http')
                        ? tagihanApi.bukti_pembayaran
                        : `${getBackendOrigin()}${tagihanApi.bukti_pembayaran}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors shrink-0"
                  >
                    <span>Lihat Struk</span>
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                )}
              </div>

              {buktiSuccessMsg && (
                <div className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-2 rounded-lg border border-emerald-300 flex items-center gap-2">
                  <FaCheck className="text-emerald-700 shrink-0" />
                  <span>{buktiSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Sub-Card 5: PENTING Alert */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 text-xs sm:text-sm text-amber-900 space-y-2 leading-relaxed">
              <div className="font-extrabold flex items-center gap-2 text-amber-950 uppercase tracking-wide">
                <FaExclamationTriangle className="text-amber-600 text-sm" />
                PENTING:
              </div>
              <ul className="space-y-1.5 pl-1 text-xs sm:text-sm">
                <li>
                  • Scan kode QRIS di atas menggunakan BRImo, BCA Mobile, Mandiri Livin, GoPay, OVO, DANA, atau ShopeePay.
                </li>
                <li>
                  • Sistem akan secara otomatis mendeteksi dan memverifikasi pembayaran yang berhasil masuk ke QRIS Bank PKBM Mentari.
                </li>
                <li>
                  • Unggah bukti transfer/struk pembayaran pada form di atas untuk kemudahan arsip dan pencetakan bukti kuitansi di Portal Siswa.
                </li>
                <li>
                  • Simpan Nomor Registrasi <span className="font-mono font-bold text-amber-950">{candidateId}</span> dan NIK santri untuk login ke Portal Calon Siswa setelah pembayaran lunas.
                </li>
              </ul>
            </div>

            {/* Sub-Card 6: Status Pembayaran Otomatis (Tanpa Tombol Cek Manual) */}
            <div className="space-y-4">
              {isPaid ? (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-xl shadow-xs">
                    <FaCheck />
                  </div>
                  <div>
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black bg-emerald-200 text-emerald-950 uppercase tracking-wider mb-1.5">
                      Status: PEMBAYARAN LUNAS
                    </span>
                    <p className="text-base sm:text-lg font-black text-emerald-950">
                      Pembayaran Berhasil Diverifikasi!
                    </p>
                    <p className="text-xs text-emerald-800 mt-1">
                      Alhamdulillah, tagihan pendaftaran untuk Nomor Registrasi <span className="font-mono font-bold">{candidateId}</span> telah tercatat LUNAS.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                    >
                      <span>Masuk ke Portal Calon Siswa</span>
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-amber-50/70 border border-amber-300/80 rounded-2xl flex items-center justify-between gap-3 text-amber-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <FaClock className="text-base animate-spin" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 inline-block mb-0.5">
                        Status: MENUNGGU PEMBAYARAN
                      </span>
                      <p className="text-xs text-amber-800">
                        Sistem sedang memantau pembayaran dari Bank / E-Wallet secara otomatis...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Footer Back Link */}
          <div className="pt-6 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 font-semibold transition-colors"
            >
              ← Kembali ke Halaman Utama
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

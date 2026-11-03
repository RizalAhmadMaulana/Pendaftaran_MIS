import { useState } from 'react';
import { FaUserPlus, FaCreditCard, FaFileAlt, FaPencilAlt, FaTrophy } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    title: 'Pendaftaran Akun',
    icon: <FaUserPlus className="text-2xl" />,
    description: 'Buat akun pendaftaran dengan mengisi data dasar calon peserta didik. Anda akan menerima nomor pendaftaran setelah proses registrasi berhasil.',
    details: [
      'Kunjungi halaman Daftar di portal PSHB MIS',
      'Isi formulir registrasi dengan data diri yang valid',
      'Masukkan email dan nomor WhatsApp yang aktif',
      'Anda akan menerima nomor pendaftaran via WhatsApp'
    ]
  },
  {
    id: 2,
    title: 'Pembayaran',
    icon: <FaCreditCard className="text-2xl" />,
    description: 'Lakukan pembayaran biaya pendaftaran melalui transfer bank ke rekening yang telah ditentukan. Upload bukti pembayaran untuk verifikasi.',
    details: [
      'Biaya pendaftaran sebesar Rp 250.000 + kode unik',
      'Transfer ke rekening BSI atas nama PSHB MIS',
      'Upload bukti transfer melalui portal',
      'Tunggu verifikasi admin (maks. 1x24 jam)'
    ]
  },
  {
    id: 3,
    title: 'Pengisian Berkas',
    icon: <FaFileAlt className="text-2xl" />,
    description: 'Setelah pembayaran terverifikasi, lengkapi seluruh berkas persyaratan melalui formulir online yang tersedia di portal siswa.',
    details: [
      'Login ke portal menggunakan akun yang telah dibuat',
      'Lengkapi data calon siswa (biodata, alamat, riwayat pendidikan)',
      'Upload dokumen persyaratan (akta, KK, foto, dll)',
      'Pastikan semua data terisi dengan benar'
    ]
  },
  {
    id: 4,
    title: 'Tes Seleksi',
    icon: <FaPencilAlt className="text-2xl" />,
    description: 'Ikuti tes seleksi sesuai jadwal yang telah ditentukan. Tes meliputi kemampuan akademik dasar dan wawancara.',
    details: [
      'Jadwal tes akan diinformasikan via WhatsApp dan email',
      'Tes terdiri dari kemampuan baca tulis, numerasi, dan wawancara',
      'Calon siswa wajib hadir di lokasi yang ditentukan',
      'Orang tua/wali ikut sesi wawancara'
    ]
  },
  {
    id: 5,
    title: 'Hasil Seleksi',
    icon: <FaTrophy className="text-2xl" />,
    description: 'Pengumuman hasil seleksi akan dipublikasikan melalui portal dan notifikasi WhatsApp. Peserta yang lolos melanjutkan proses daftar ulang.',
    details: [
      'Hasil diumumkan 7 hari setelah tes seleksi',
      'Cek hasil melalui menu "Cek Kelulusan" di portal',
      'Peserta lulus melakukan daftar ulang online',
      'Peserta tidak lulus dapat mendaftar di gelombang berikutnya'
    ]
  },
];

export default function AlurPendaftaran() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Alur Pendaftaran</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Ikuti langkah-langkah berikut untuk mendaftarkan putra-putri Anda di Mentari Islamic School</p>
        </div>

        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Kiri - List Tahapan (40%) */}
          <div className="lg:w-[40%] space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                  activeStep === index
                    ? 'bg-white border-2 border-secondary shadow-md'
                    : 'bg-white border border-gray-100 hover:border-green-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  activeStep === index
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step.id}
                </div>
                <span className={`font-semibold text-sm ${
                  activeStep === index ? 'text-primary' : 'text-gray-600'
                }`} >
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Kanan - Detail (60%) */}
          <div className="lg:w-[60%]">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 h-full">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-secondary mb-5">
                {steps[activeStep].icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tahap {steps[activeStep].id}: {steps[activeStep].title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{steps[activeStep].description}</p>

              <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Detail Langkah:</h3>
              <ul className="space-y-3">
                {steps[activeStep].details.map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-secondary">{i + 1}</span>
                    </div>
                    <span className="text-sm text-gray-600">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

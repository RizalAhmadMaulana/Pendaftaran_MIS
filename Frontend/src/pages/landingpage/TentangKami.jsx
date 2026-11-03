import { FaEye, FaBullseye, FaUsers } from 'react-icons/fa';

const pengurus = [
  { jabatan: 'Ketua Yayasan', nama: 'H. Ahmad Fauzi, M.Pd.I' },
  { jabatan: 'Direktur Pendidikan', nama: 'Dr. Siti Aisyah, M.Ag' },
  { jabatan: 'Kepala Bidang Kurikulum', nama: 'Ustadz Muhammad Rizki, S.Pd' },
  { jabatan: 'Kepala Bidang Kesiswaan', nama: 'Ustadzah Fatimah, S.Pd.I' },
];

export default function TentangKami() {
  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-primary h-64 md:h-80 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-green-800 opacity-90"></div>
        <div className="relative text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Tentang Mentari Islamic School</h1>
          <p className="text-green-200 text-sm md:text-base">Mendidik Generasi Berilmu, Beradab, dan Berprestasi</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Sejarah */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sejarah Singkat Yayasan</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                MENTARI ISLAMIC SCHOOL, Sekolah Tahfidz dan Sains, Hadir di Klaten. Kami sudah meluluskan banyak santri tersebar di berbagai sekolah dan universitas terbaik. Sejak 2012 kami berdiri dan sudah terakreditasi dengan peringkat A TERBAIK. Kami juga menjadi sekolah induk bagi sekolah, pesantren, dan mahad di sekitar.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mentari Islamic School adalah pusat belajar sepanjang hayat yang membuka akses pendidikan bagi semua warga, dari remaja hingga orang dewasa yang ingin kembali melanjutkan sekolah. Di sini, peserta didik difasilitasi untuk mengembangkan pengetahuan, keterampilan, dan kemandirian melalui pembelajaran yang fleksibel, ramah, dan berbasis pemberdayaan masyarakat.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Mentari Islamic School hadir sebagai ruang tumbuh, tempat setiap orang diberi kesempatan untuk memperbaiki masa depan dan meningkatkan kualitas hidupnya. Saat ini kami membina sekitar 500-an santri dan peserta didik aktif di Klaten.
              </p>
            </div>
          </div>
        </section>

        {/* Visi Misi */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <FaEye className="text-2xl text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Menjadi lembaga pendidikan Islam terdepan yang melahirkan generasi unggul, beriman, berilmu, dan berakhlak mulia serta berdaya saing global pada tahun 2030.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <FaBullseye className="text-2xl text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Misi</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
                <li>• Menyelenggarakan pendidikan berkualitas berbasis Al-Quran dan Sunnah</li>
                <li>• Mengembangkan potensi akademik dan non-akademik peserta didik</li>
                <li>• Membangun karakter Islami yang kuat pada setiap individu</li>
                <li>• Menciptakan lingkungan belajar yang kondusif dan menyenangkan</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Struktur Pengurus */}
        <section className="py-12">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-2xl text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Struktur Pengurus</h2>
            <p className="text-gray-500 text-sm">Tim profesional yang memimpin Yayasan Mentari Islamic School</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {pengurus.map((p, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <FaUsers className="text-gray-400 text-xl" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{p.nama}</h4>
                <p className="text-xs text-secondary font-medium mt-1">{p.jabatan}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Galeri Foto */}
        <section className="py-12 pb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Galeri Fasilitas</h2>
            <p className="text-gray-500 text-sm">Fasilitas modern untuk menunjang proses belajar mengajar</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {['Masjid & Musholla', 'Ruang Kelas', 'Laboratorium Sains', 'Perpustakaan', 'Lapangan Olahraga', 'Area Bermain'].map((caption, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center hover:bg-gray-200 transition-colors group">
                <div className="text-center">
                  <p className="text-gray-400 text-sm group-hover:text-gray-500">{caption}</p>
                  <p className="text-gray-300 text-xs mt-1">Foto Fasilitas</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

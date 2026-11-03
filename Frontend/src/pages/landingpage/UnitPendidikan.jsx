import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMosque, FaSchool, FaBookOpen, FaGraduationCap, FaArrowRight, FaStar } from 'react-icons/fa';

const filters = ['Semua Unit', 'TPA', 'KB', 'TK', 'SD', 'SMP', 'SMA'];

const unitList = [
  { id: 'tpa', category: 'TPA', icon: <FaMosque className="text-3xl text-secondary" />, title: 'TPA Mentari Islamic School', desc: 'Program Taman Pendidikan Al-Quran usia dini untuk membina hafalan dan bacaan Al-Quran.', status: 'Buka', kampus: 'Kampus PAUD (Tulung)' },
  { id: 'kb', category: 'KB', icon: <FaStar className="text-3xl text-secondary" />, title: 'KB Mentari Islamic School', desc: 'Kelompok Bermain dengan pendekatan belajar aktif, stimulasi motorik, dan adab Islami.', status: 'Buka', kampus: 'Kampus PAUD (Tulung)' },
  { id: 'tk', category: 'TK', icon: <FaStar className="text-3xl text-secondary" />, title: 'TK Mentari Islamic School', desc: 'Taman Kanak-Kanak dengan kurikulum bermain sambil belajar berbasis nilai-nilai Islami.', status: 'Buka', kampus: 'Kampus Utama (Polanharjo)' },
  { id: 'sd', category: 'SD', icon: <FaSchool className="text-3xl text-secondary" />, title: 'SD Mentari Islamic School', desc: 'Pendidikan dasar 6 tahun dengan kurikulum nasional terintegrasi nilai-nilai keislaman.', status: 'Buka', kampus: 'Kampus Utama (Polanharjo)' },
  { id: 'smp', category: 'SMP', icon: <FaBookOpen className="text-3xl text-secondary" />, title: 'SMP Mentari Islamic School', desc: 'Jenjang menengah pertama yang mencetak generasi muda berilmu dan berakhlak mulia.', status: 'Buka', kampus: 'Kampus Utama (Polanharjo)' },
  { id: 'sma', category: 'SMA', icon: <FaGraduationCap className="text-3xl text-secondary" />, title: 'SMA Mentari Islamic School', desc: 'Jenjang menengah atas untuk mempersiapkan siswa menuju perguruan tinggi terbaik.', status: 'Tutup', kampus: 'Kampus Utama (Polanharjo)' },
];

export default function UnitPendidikan() {
  const [activeFilter, setActiveFilter] = useState('Semua Unit');

  const filtered = activeFilter === 'Semua Unit'
    ? unitList
    : unitList.filter(u => u.category === activeFilter);

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Daftar Unit Pendidikan</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Pilih unit pendidikan yang sesuai untuk putra-putri Anda di Klaten</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((unit) => (
            <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4 z-10">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  unit.status === 'Buka' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {unit.status}
                </span>
              </div>

              <div className="p-6">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  {unit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{unit.title}</h3>
                <p className="text-xs font-semibold text-emerald-700 mb-2">{unit.kampus}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{unit.desc}</p>
                <Link to={`/unit/${unit.id}`} className="inline-flex items-center gap-1 text-sm text-secondary font-medium hover:gap-2 transition-all">
                  Baca Selengkapnya <FaArrowRight className="text-xs" />
                </Link>
              </div>

              <div className="px-6 pb-6">
                <Link
                  to={`/daftar/${unit.id}`}
                  className={`block text-center w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    unit.status === 'Buka'
                      ? 'bg-secondary hover:bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

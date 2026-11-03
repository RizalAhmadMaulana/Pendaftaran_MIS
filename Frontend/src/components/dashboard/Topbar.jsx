import { useState, useEffect } from 'react';
import { FaBars, FaUserGraduate } from 'react-icons/fa';

export default function Topbar({ onToggleSidebar }) {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('user_name') || 'Calon Santri MIS';
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserName(localStorage.getItem('user_name') || 'Calon Santri MIS');
    };
    window.addEventListener('storage', handleProfileUpdate);
    window.addEventListener('user_profile_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('storage', handleProfileUpdate);
      window.removeEventListener('user_profile_updated', handleProfileUpdate);
    };
  }, []);

  return (
    <header className="h-16 bg-secondary text-white px-4 sm:px-6 flex items-center justify-between shadow-md shrink-0 sticky top-0 z-30">
      {/* Left: Hamburger Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-black/10 active:bg-black/20 text-white transition-colors cursor-pointer"
          title="Toggle Navigasi"
          aria-label="Toggle Navigasi"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Right: Nama Siswa Login Badge (Menggantikan Periode 2026/2027) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-black/15 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide backdrop-blur-xs border border-white/20 shadow-xs">
          <FaUserGraduate className="text-emerald-200 text-sm" />
          <span className="truncate max-w-[170px] sm:max-w-[280px] text-white">
            {userName}
          </span>
          <span className="hidden sm:inline-block text-[10px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Siswa
          </span>
        </div>
      </div>
    </header>
  );
}

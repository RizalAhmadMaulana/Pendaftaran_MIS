import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaFileAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaTrophy,
  FaCog,
  FaGraduationCap,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';

export default function Sidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Beranda', path: '/dashboard', icon: FaHome, end: true },
    { name: 'Biodata & Dokumen', path: '/dashboard/biodata', icon: FaFileAlt },
    { name: 'Tagihan & Keuangan', path: '/dashboard/tagihan', icon: FaCreditCard },
    { name: 'Jadwal Seleksi', path: '/dashboard/jadwal', icon: FaCalendarAlt },
    { name: 'Hasil Seleksi', path: '/dashboard/hasil', icon: FaTrophy },
    { name: 'Pengaturan', path: '/dashboard/pengaturan', icon: FaCog },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen bg-primary text-white flex flex-col justify-between shrink-0 shadow-xl transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Title */}
        <div>
          <div
            className={`h-16 flex items-center border-b border-white/10 ${
              isCollapsed ? 'justify-center px-3' : 'justify-between px-5'
            }`}
          >
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 group ${isCollapsed ? 'justify-center' : ''}`}
              title="Portal Siswa MIS"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary shadow-inner shrink-0">
                <FaGraduationCap className="text-xl" />
              </div>
              {!isCollapsed && (
                <div className="text-left overflow-hidden">
                  <h1 className="font-black text-sm tracking-tight text-white leading-tight truncate">
                    Portal Siswa MIS
                  </h1>
                  <p className="text-[11px] text-emerald-200 font-medium truncate">
                    Mentari Islamic School
                  </p>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            {!isCollapsed && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                aria-label="Tutup Sidebar"
              >
                <FaTimes className="text-lg" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  title={item.name}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsMobileOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-3.5' : 'gap-3.5 px-3.5 py-3'
                    } rounded-xl text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-white/10 text-white font-bold border-l-4 border-secondary shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 font-medium'
                    }`
                  }
                >
                  <Icon className={`${isCollapsed ? 'text-lg' : 'text-base'} shrink-0`} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Logout */}
        <div className="p-3 border-t border-white/10 bg-black/10">
          <button
            onClick={handleLogout}
            title="Keluar"
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-2.5'
            } rounded-xl text-sm font-semibold text-red-200 hover:text-white hover:bg-red-600/30 transition-colors cursor-pointer`}
          >
            <FaSignOutAlt className={`${isCollapsed ? 'text-lg' : 'text-base'} shrink-0 text-red-300`} />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

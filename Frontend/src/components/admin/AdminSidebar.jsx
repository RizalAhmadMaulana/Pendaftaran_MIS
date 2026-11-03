import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaChartPie,
  FaSchool,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaShieldAlt,
  FaTimes,
  FaUserCheck,
  FaChevronDown,
  FaPlusCircle,
  FaCalendarCheck
} from 'react-icons/fa';

export default function AdminSidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isJadwalActive = location.pathname.startsWith('/admin-portal/jadwal');
  const [isJadwalOpen, setIsJadwalOpen] = useState(isJadwalActive);

  useEffect(() => {
    if (isJadwalActive) {
      setIsJadwalOpen(true);
    }
  }, [isJadwalActive]);

  useEffect(() => {
    if (isCollapsed) {
      setIsJadwalOpen(false);
    }
  }, [isCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  const jadwalSubMenus = [
    { name: 'Input Jadwal Seleksi', path: '/admin-portal/jadwal/input', icon: FaPlusCircle },
    { name: 'Monitoring Jadwal', path: '/admin-portal/jadwal/monitoring', icon: FaCalendarCheck },
  ];

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
        className={`fixed lg:static top-0 left-0 z-50 h-screen bg-primary text-white flex flex-col justify-between shrink-0 shadow-2xl transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Header & Menus */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & Brand Header */}
          <div
            className={`h-16 flex items-center border-b border-white/10 ${
              isCollapsed ? 'justify-center px-3' : 'justify-between px-5'
            }`}
          >
            <Link
              to="/admin-portal"
              className={`flex items-center gap-3 group ${isCollapsed ? 'justify-center' : ''}`}
              title="Portal Admin PPDB"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-emerald-400 flex items-center justify-center text-primary text-lg shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <FaShieldAlt />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-black tracking-tight text-white leading-tight">
                    Admin PPDB
                  </p>
                  <p className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider truncate">
                    Mentari Islamic School
                  </p>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Tutup Menu"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
            {!isCollapsed && (
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400/80">
                Menu Utama
              </p>
            )}

            {/* Menu 1: Dashboard Statistik */}
            <NavLink
              to="/admin-portal"
              end
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? 'Dashboard Statistik' : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-secondary text-primary font-bold shadow-md shadow-emerald-950/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <FaChartPie className="text-lg shrink-0 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="truncate">Dashboard Statistik</span>}
            </NavLink>

            {/* Menu 2: Kelola Unit & Gelombang */}
            <NavLink
              to="/admin-portal/unit"
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? 'Kelola Unit & Gelombang' : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-secondary text-primary font-bold shadow-md shadow-emerald-950/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <FaSchool className="text-lg shrink-0 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="truncate">Kelola Unit & Gelombang</span>}
            </NavLink>

            {/* Menu 3: Jadwal Seleksi (Collapsible Sub-menu) */}
            <div>
              <button
                type="button"
                onClick={() => {
                  if (isCollapsed) {
                    navigate('/admin-portal/jadwal/monitoring');
                  } else {
                    setIsJadwalOpen(!isJadwalOpen);
                  }
                }}
                title={isCollapsed ? 'Jadwal Seleksi' : undefined}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isJadwalActive && !isJadwalOpen
                    ? 'bg-secondary/20 text-emerald-300 font-bold border-l-4 border-secondary'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <FaCalendarAlt className="text-lg shrink-0" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 overflow-hidden">
                    <span className="truncate">Jadwal Seleksi</span>
                    <FaChevronDown
                      className={`text-xs transition-transform duration-200 ${
                        isJadwalOpen ? 'rotate-180 text-secondary' : 'text-white/50'
                      }`}
                    />
                  </div>
                )}
              </button>

              {/* Sub-Menu Items */}
              {!isCollapsed && isJadwalOpen && (
                <div className="mt-1 ml-3 pl-3 border-l-2 border-white/15 space-y-1">
                  {jadwalSubMenus.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                            isActive
                              ? 'bg-secondary text-primary font-bold shadow-sm'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`
                        }
                      >
                        <SubIcon className="text-sm shrink-0" />
                        <span className="truncate">{sub.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Menu 4: Keputusan Seleksi */}
            <NavLink
              to="/admin-portal/keputusan"
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? 'Keputusan Seleksi' : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-secondary text-primary font-bold shadow-md shadow-emerald-950/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <FaUserCheck className="text-lg shrink-0 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="truncate">Keputusan Seleksi</span>}
            </NavLink>

            {/* Menu 5: Data Pendaftar */}
            <NavLink
              to="/admin-portal/pendaftar"
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? 'Data Pendaftar' : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-secondary text-primary font-bold shadow-md shadow-emerald-950/20'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <FaUsers className="text-lg shrink-0 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="truncate">Data Pendaftar</span>}
            </NavLink>
          </nav>
        </div>

        {/* Bottom: Logout Button */}
        <div className="p-3 border-t border-white/10 bg-black/10">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-200 hover:text-white hover:bg-red-600/80 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title={isCollapsed ? 'Keluar' : undefined}
          >
            <FaSignOutAlt className="text-lg shrink-0" />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

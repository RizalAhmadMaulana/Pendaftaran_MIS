import { FaBars, FaShieldAlt, FaUserTie } from 'react-icons/fa';

export default function AdminTopbar({ onToggleSidebar }) {
  const adminName = localStorage.getItem('user_name') || 'Administrator PPDB';

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

      {/* Right: Badge Administrator PPDB & User Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Badge Administrator PPDB */}
        <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-xs border border-white/20">
          <FaShieldAlt className="text-xs text-white/90" />
          <span>Administrator PPDB — Mentari Islamic School</span>
        </div>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/20">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <FaUserTie className="text-xs text-white" />
          </div>
          <div className="text-left hidden xs:block">
            <p className="text-xs font-bold leading-tight">{adminName}</p>
            <p className="text-[10px] text-white/80 leading-tight">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

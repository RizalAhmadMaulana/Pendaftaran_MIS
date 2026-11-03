import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Proteksi Route: Verifikasi hak akses admin
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    const token = localStorage.getItem('access_token');
    if (!token || role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleToggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed((prev) => !prev);
    } else {
      setIsMobileOpen((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Right Content Area (Topbar + Outlet) */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <AdminTopbar onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}


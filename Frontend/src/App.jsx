import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';

// Pages with MainLayout
import Home from './pages/landingpage/Home';
import DetailUnit from './pages/landingpage/DetailUnit';
import FormDaftarAwal from './pages/landingpage/FormDaftarAwal';
import TagihanPembayaran from './pages/landingpage/TagihanPembayaran';

// Pages without MainLayout
import CekKelulusan from './pages/landingpage/CekKelulusan';
import LoginPeserta from './pages/landingpage/LoginPeserta';

// Admin Components & Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUnitManager from './pages/admin/AdminUnitManager';
import AdminJadwalManager from './pages/admin/AdminJadwalManager';
import AdminInputJadwal from './pages/admin/AdminInputJadwal';
import AdminMonitoringJadwal from './pages/admin/AdminMonitoringJadwal';
import AdminKeputusanSeleksi from './pages/admin/AdminKeputusanSeleksi';
import AdminPendaftarManager from './pages/admin/AdminPendaftarManager';

// Dashboard Components & Pages
import DashboardLayout from './components/dashboard/DashboardLayout';
import BerandaDashboard from './pages/dashboard/BerandaDashboard';
import BiodataDokumen from './pages/dashboard/BiodataDokumen';
import TagihanKeuangan from './pages/dashboard/TagihanKeuangan';
import JadwalSeleksi from './pages/dashboard/JadwalSeleksi';
import HasilSeleksi from './pages/dashboard/HasilSeleksi';
import PengaturanAkun from './pages/dashboard/PengaturanAkun';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Home — scrollable landing page (Beranda + Unit + Alur + Tentang) */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />

          {/* Detail & Form pages (still separate) */}
          <Route path="/unit/:id" element={<MainLayout><DetailUnit /></MainLayout>} />
          <Route path="/daftar/:id" element={<MainLayout><FormDaftarAwal /></MainLayout>} />

          {/* Standalone pages (no MainLayout) — Unified Card Pages */}
          <Route path="/pengumuman" element={<CekKelulusan />} />
          <Route path="/cek-status" element={<CekKelulusan />} />
          <Route path="/login" element={<LoginPeserta />} />
          <Route path="/tagihan" element={<TagihanPembayaran />} />
          <Route path="/tagihan/:id" element={<TagihanPembayaran />} />

          {/* Portal Administrator PPDB */}
          <Route path="/admin-portal" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="unit" element={<AdminUnitManager />} />
            <Route path="jadwal" element={<AdminMonitoringJadwal />} />
            <Route path="jadwal/input" element={<AdminInputJadwal />} />
            <Route path="jadwal/monitoring" element={<AdminMonitoringJadwal />} />
            <Route path="keputusan" element={<AdminKeputusanSeleksi />} />
            <Route path="pendaftar" element={<AdminPendaftarManager />} />
          </Route>


          {/* Portal Calon Siswa (Dashboard Post-Login) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<BerandaDashboard />} />
            <Route path="biodata" element={<BiodataDokumen />} />
            <Route path="tagihan" element={<TagihanKeuangan />} />
            <Route path="jadwal" element={<JadwalSeleksi />} />
            <Route path="hasil" element={<HasilSeleksi />} />
            <Route path="pengaturan" element={<PengaturanAkun />} />
          </Route>
        </Routes>

      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

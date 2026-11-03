import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { name: 'Beranda', sectionId: 'beranda' },
  { name: 'Unit Pendidikan', sectionId: 'unit' },
  { name: 'Alur Pendaftaran', sectionId: 'alur' },
  { name: 'Tentang Kami', sectionId: 'tentang' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  // Scroll spy — detect which section is currently in view
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollY = window.scrollY + 100; // offset for sticky navbar

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const section = document.getElementById(navLinks[i].sectionId);
        if (section && section.offsetTop <= scrollY) {
          setActiveSection(navLinks[i].sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 72; // navbar height
        const top = el.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      // Navigate to home then scroll after render
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const offset = 72;
          const top = el.offsetTop - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    }
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <button
            onClick={() => scrollToSection('beranda')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-800 rounded-xl flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <FaGraduationCap className="text-secondary text-xl" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-base md:text-lg text-emerald-950 block leading-tight">Portal Pendaftaran</span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wider">Mentari Islamic School</span>
            </div>
          </button>

          {/* Center - Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isHomePage && activeSection === link.sectionId
                    ? 'text-emerald-900 bg-emerald-100/90 shadow-xs'
                    : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right - CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg"
            >
              Login Peserta
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-emerald-900 hover:bg-emerald-50 cursor-pointer"
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId)}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isHomePage && activeSection === link.sectionId
                    ? 'text-emerald-950 bg-emerald-100'
                    : 'text-gray-700 hover:text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {link.name}
              </button>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all mt-3 shadow-md"
            >
              Login Peserta
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

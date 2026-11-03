import { FaMapMarkerAlt, FaEnvelope, FaWhatsapp, FaInstagram, FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';


export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Kolom 1 - Kontak & Lokasi */}
          <div>
            <h3 className="text-lg font-bold mb-4">Informasi Kontak & Lokasi</h3>
            <ul className="space-y-3.5 text-sm text-green-100">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-secondary" />
                <div>
                  <span className="font-semibold text-white block">Kampus Utama (TK, SD, SMP, SMA):</span>
                  <span>Komplek Masjid Al Mahabbah Lembu, Jimus, Polanharjo, Klaten 57474</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-secondary" />
                <div>
                  <span className="font-semibold text-white block">Kampus PAUD (TPA & KB):</span>
                  <span>Perkiosan Tulung No. 259, Klaten 57482</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="shrink-0 text-secondary" />
                <a href="mailto:admin@cyberschool.sch.id" className="hover:text-secondary transition-colors">
                  admin@cyberschool.sch.id
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="shrink-0 text-secondary" />
                <span>+62 812-3456-7890 (Hotline WA)</span>
              </li>
            </ul>
          </div>

          {/* Kolom 2 - Link Cepat */}
          <div>
            <h3 className="text-lg font-bold mb-4">Link Cepat</h3>
            <ul className="space-y-2.5 text-sm text-green-100">
              <li>
                <button onClick={() => scrollToSection('beranda')} className="hover:text-secondary transition-colors cursor-pointer">Beranda</button>
              </li>
              <li>
                <Link to="/login?tab=status" className="hover:text-secondary transition-colors">Cek Status / Kelulusan</Link>
              </li>

              <li>
                <button onClick={() => scrollToSection('alur')} className="hover:text-secondary transition-colors cursor-pointer">Bantuan & Alur Pendaftaran</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('unit')} className="hover:text-secondary transition-colors cursor-pointer">Unit Pendidikan</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('tentang')} className="hover:text-secondary transition-colors cursor-pointer">Tentang Kami</button>
              </li>
            </ul>
          </div>

          {/* Kolom 3 - Sosial Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
            <p className="text-sm text-green-100 mb-4">
              Ikuti media sosial resmi Mentari Islamic School untuk mendapatkan informasi dan kegiatan terkini:
            </p>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://www.instagram.com/mentari_tahfidzschool?vrfl=c203eHp2bzd1eWhu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-xs"
                title="Instagram Mentari Islamic School"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                href="https://www.tiktok.com/@mentariislamicschool?_r=1&_t=ZS-9AUBtzKNlPY"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-xs"
                title="TikTok Mentari Islamic School"
              >
                <FaTiktok className="text-lg" />
              </a>
              <a
                href="https://www.youtube.com/@mentariislamicschool5489"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-xs"
                title="YouTube Mentari Islamic School"
              >
                <FaYoutube className="text-lg" />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all shadow-xs"
                title="Hotline WhatsApp"
              >
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
            <p className="text-xs text-green-200">Yayasan Mentari Islamic School &bull; Klaten</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-green-200">
          <p>&copy; 2026 Portal Pendaftaran Mentari Islamic School Klaten. All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
}

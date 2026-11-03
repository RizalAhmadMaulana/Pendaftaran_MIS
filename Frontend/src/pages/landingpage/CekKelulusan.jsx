import LoginPeserta from './LoginPeserta';

/**
 * CekKelulusan sekarang digabung dengan LoginPeserta dalam satu unified card.
 * Komponen ini merender LoginPeserta dengan tab 'status' aktif secara default.
 */
export default function CekKelulusan() {
  return <LoginPeserta defaultTab="status" />;
}

import React from 'react';
import { BiCheck } from 'react-icons/bi';

export default function SuccessNotification({ message }) {
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[2000] pointer-events-none">
      {/* ANIMASI GOYANG TIPIS (POP-WIGGLE) PERSIS WEB RISALAH */}
      <style>
        {`
          @keyframes pop-wiggle {
            0% { opacity: 0; transform: scale(0.6) translateY(-15px) rotate(-3deg); }
            40% { opacity: 1; transform: scale(1.06) translateY(0) rotate(2deg); }
            60% { transform: scale(0.97) rotate(-1deg); }
            80% { transform: scale(1.02) rotate(1deg); }
            100% { transform: scale(1) translateY(0) rotate(0); }
          }
        `}
      </style>

      {/* CONTAINER PIL HITAM MELAYANG */}
      <div
        style={{ animation: 'pop-wiggle 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards' }}
        className="
          flex items-center gap-3.5 justify-center
          w-max max-w-[90vw]
          px-6 py-3 sm:px-7 sm:py-3.5
          rounded-full
          shadow-[0_12px_35px_-5px_rgba(0,0,0,0.65)]
          border border-white/10 ring-1 ring-white/5
          bg-[#181818]/95 backdrop-blur-md text-white
        "
      >
        {/* ICON CHECK HIJAU DALAM LINGKARAN PERSIS GAMBAR */}
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#123824] border-[1.5px] border-[#2ECC71] flex items-center justify-center text-[#2ECC71] shrink-0 shadow-inner">
          <BiCheck className="text-lg sm:text-xl font-black" />
        </div>

        {/* PESAN TEKS */}
        <span className="font-bold text-xs sm:text-sm tracking-wide font-sans text-white truncate max-w-[70vw]">
          {message}
        </span>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  CheckCircle2,
  CalendarClock,
  FireExtinguisher,
  TrendingUp,
  Award,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCcw,
  Share2,
  BarChart3,
  Timer,
  Zap,
  MapPin,
  Settings2,
  Wrench,
  AlertOctagon,
  CheckCircle,
  Download,
  Loader2,
  Copy
} from 'lucide-react';

// --- MOCK DATABASE (Simulasi Backend) ---
const MOCK_DB = {
  'user_high': {
    userName: "PT Sejahtera Abadi",
    totalApar: 200,
    inspectionsScheduled: 2400,
    inspectionsRealized: 2380,
    ontimePercentage: 99,
    refillCount: 85,
    refillTypeMost: "Powder 6kg",
    safetyScore: 98,
    busiestMonth: "Desember",
    busiestMonthCount: 210,
    damageCases: 12,
    damageResolved: 12,
    topIssue: "Pressure",
    topLocation: "Head Office Lt. 1",
    topLocationCompliance: 100,
    personaTitle: "THE FIRE COMMANDER",
    personaAnalogy: "🛡️ Benteng Besi"
  },
  'user_medium': {
    userName: "CV Maju Terus",
    totalApar: 50,
    inspectionsScheduled: 600,
    inspectionsRealized: 460,
    ontimePercentage: 76,
    refillCount: 12,
    refillTypeMost: "CO2 3kg",
    safetyScore: 75,
    busiestMonth: "Agustus",
    busiestMonthCount: 50,
    damageCases: 35,
    damageResolved: 28,
    topIssue: "Hose",
    topLocation: "Gudang Belakang",
    topLocationCompliance: 90,
    personaTitle: "THE VIGILANT OWL",
    personaAnalogy: "🦉 Mata Elang"
  },
  'user_low': {
    userName: "Toko Kelontong Barokah",
    totalApar: 20,
    inspectionsScheduled: 240,
    inspectionsRealized: 85,
    ontimePercentage: 35,
    refillCount: 0,
    refillTypeMost: "N/A",
    safetyScore: 45,
    busiestMonth: "Januari",
    busiestMonthCount: 20,
    damageCases: 8,
    damageResolved: 1,
    topIssue: "Need Refill",
    topLocation: "Kasir Depan",
    topLocationCompliance: 60,
    personaTitle: "THE GAMBLER",
    personaAnalogy: "🎲 Dadu Panas"
  }
};

// --- API SERVICE SIMULATION ---
const apiService = {
  getRecapData: async (kodeCustomer) => {
    return new Promise((resolve, reject) => {
      // Simulasi delay network 1.5 detik
      setTimeout(() => {
        const data = MOCK_DB[kodeCustomer] || MOCK_DB['user_high'];
        if (data) {
          resolve(data);
        } else {
          reject(new Error("Data not found"));
        }
      }, 1500);
    });
  }
};

// --- KOMPONEN UTILITAS ---

const ProgressBar = ({ current, total }) => {
  return (
    <div className="absolute top-4 left-0 w-full px-2 flex gap-1 z-50">
      {Array.from({ length: total }).map((_, idx) => (
        <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: idx < current ? "100%" : idx === current ? "100%" : "0%" }}
            transition={{ duration: idx === current ? 5 : 0.3, ease: "linear" }}
            className={`h-full ${idx <= current ? 'bg-white' : 'bg-transparent'}`}
          />
        </div>
      ))}
    </div>
  );
};

// --- MODAL BERBAGI (FALLBACK TEKS SAJA) ---
// Digunakan hanya jika Web Share API tidak mendukung berbagi file.
const ShareModal = ({ isOpen, onClose, shareText }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = shareText;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-9999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.focus();
    tempTextArea.select();
    try {
      document.execCommand('copy');
      window.alert('Pesan berhasil disalin ke clipboard! Sekarang, ambil gambar hasil Anda untuk dibagikan.');
    } catch (err) {
      console.error('Gagal menyalin:', err);
      window.alert('Gagal menyalin pesan. Silakan salin manual.');
    }
    document.body.removeChild(tempTextArea);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gray-800/90 text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><Share2 size={24} className="text-red-400" /> Berbagi Gagal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Instruksi Ambil Gambar */}
        <div className="bg-red-900/40 p-3 rounded-lg border border-red-700/50 mb-4">
          <p className="text-red-300 text-sm font-medium flex items-center gap-2">
            <AlertOctagon size={16} /> Web Share API Tidak Didukung
          </p>
          <p className="text-xs text-red-200 mt-1">
            *Browser* Anda tidak mendukung berbagi gambar + teks secara langsung.
            Silakan tekan **Unduh Gambar** lalu salin teks di bawah ini.
          </p>
        </div>

        <p className="text-sm font-medium mb-2 text-gray-300">Salin pesan berikut untuk dibagikan bersama gambar:</p>

        {/* Teks yang Disematkan */}
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 text-sm text-gray-200 mb-4 overflow-auto max-h-40">
          {shareText}
        </div>

        {/* Tombol Aksi */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-red-700 transition"
        >
          <Copy size={18} /> Salin Teks Pesan
        </motion.button>

      </motion.div>
    </motion.div>
  );
};

// --- HALAMAN-HALAMAN SLIDE ---

// NOTE: Tombol 'LIHAT RECAP' dihapus dan perpindahan slide akan ditangani oleh useEffect di komponen App
const IntroSlide = ({ data }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
    {/* Plasma/Blob Background Effect (Enhanced) */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`plasma-${i}`}
        className="absolute bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
        style={{
          width: Math.random() * 300 + 100,
          height: Math.random() * 300 + 100,
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
        }}
        animate={{ y: [0, -50, 0], x: [0, 40, 0], scale: [0.9, 1.3, 0.9], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: Math.random() * 8 + 8, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}

    <div className="z-10 relative flex flex-col items-center w-full">

      {/* Firecek Logo/Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, duration: 1.5 }}
        className="mb-8 relative p-6 bg-white/10 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)]"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame size={60} className="text-red-500 fill-red-500 drop-shadow-xl" strokeWidth={1.5} />
        </motion.div>

      </motion.div>

      {/* JUDUL UTAMA */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-5xl font-extrabold text-white mb-2 tracking-tighter drop-shadow-md"
      >
        <span className="text-blue-400">FIRECEK</span> WRAPPED
      </motion.h1>
      <motion.h2
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 drop-shadow-lg"
      >
        2025
      </motion.h2>

      {/* Prepared For Box - Teks diubah menjadi lebih ringan dan santai */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-10 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/20 w-full max-w-xs shadow-xl"
      >
        {/* Perubahan teks: "Dibuat Khusus Untuk" -> "Ini Dia Rekapan Spesial Punya" */}
        <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-1">Ini Dia Rekapan Spesial Punya</p>
        <p className="text-white font-bold text-xl leading-tight">{data.userName}</p>
      </motion.div>

      {/* Ganti Tombol CTA dengan Text Auto-Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-12 text-lg font-medium text-blue-400 flex items-center gap-3"
      >
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        >
          <ArrowRight size={22} strokeWidth={3} />
        </motion.div>
        <span>Rekapan dimulai otomatis...</span>
      </motion.div>
    </div>
  </div>
);

const InspectionSlide = ({ data }) => (
  <div className="flex flex-col h-full px-6 pt-20 bg-gray-900 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 p-10 opacity-10">
      <CalendarClock size={300} />
    </div>
    <motion.h2 initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-3xl font-bold mb-8 z-10 leading-tight">
      {data.ontimePercentage > 80 ? (<>Anda sangat <br /><span className="text-green-400">Disiplin!</span></>) :
        data.ontimePercentage > 50 ? (<>Usaha yang <br /><span className="text-yellow-400">Cukup Baik!</span></>) :
          (<>Perlu lebih <br /><span className="text-red-400">Konsisten.</span></>)}
    </motion.h2>
    <div className="space-y-6 z-10">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
        <div className="flex justify-between items-end mb-2">
          <span className="text-gray-400 text-sm">Jadwal Inspeksi</span>
          <span className="text-2xl font-bold">{data.inspectionsScheduled}</span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full"><div className="h-full bg-gray-500 rounded-full w-full"></div></div>
      </motion.div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className={`backdrop-blur-md p-6 rounded-2xl border shadow-lg ${data.ontimePercentage > 80 ? "bg-gray-800/80 border-green-500/30 shadow-green-500/10" : "bg-gray-800/80 border-red-500/30 shadow-red-500/10"}`}>
        <div className="flex justify-between items-end mb-2">
          <span className={`${data.ontimePercentage > 80 ? "text-green-400" : "text-red-400"} text-sm font-bold flex items-center gap-1`}><CheckCircle2 size={14} /> Terlaksana</span>
          <span className="text-4xl font-black text-white">{data.inspectionsRealized}</span>
        </div>
        <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(data.inspectionsRealized / data.inspectionsScheduled) * 100}%` }} transition={{ duration: 1.5, delay: 0.8 }} className={`h-full rounded-full bg-gradient-to-r ${data.ontimePercentage > 80 ? "from-green-500 to-emerald-300" : data.ontimePercentage > 50 ? "from-yellow-500 to-orange-400" : "from-red-600 to-red-400"}`}></motion.div>
        </div>
        <p className="mt-4 text-sm text-gray-300">Itu artinya <span className={`font-bold ${data.ontimePercentage > 80 ? "text-green-400" : "text-white"}`}>{data.ontimePercentage}%</span> APAR Anda selalu siap siaga.</p>
      </motion.div>
    </div>
  </div>
);

const BusyMonthSlide = ({ data }) => (
  <div className="flex flex-col h-full justify-center px-6 bg-gradient-to-tr from-purple-900 to-indigo-900 text-white relative">
    <div className="absolute top-10 left-[-50px] opacity-10 rotate-12"><BarChart3 size={300} /></div>
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="z-10 text-center">
      <h2 className="text-2xl font-light text-purple-200 mb-6">Bulan Tersibuk Anda</h2>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-purple-500/30">
        <h1 className="text-5xl font-black text-yellow-300 mb-2">{data.busiestMonth.toUpperCase()}</h1>
        <p className="text-white/80 text-lg">Dengan total aktivitas</p>
        <div className="text-6xl font-bold mt-2">{data.busiestMonthCount}</div>
        <p className="text-sm text-purple-200 mt-1">Kali Pengecekan</p>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 text-purple-200 px-4">"Di bulan ini, tim Anda bekerja ekstra keras untuk memastikan keamanan."</motion.p>
    </motion.div>
  </div>
);

const DamageReportSlide = ({ data }) => (
  <div className="flex flex-col h-full justify-center px-6 bg-amber-950 text-white relative overflow-hidden">
    <div className="absolute -bottom-10 -left-10 opacity-10 animate-pulse"><AlertOctagon size={400} /></div>
    <motion.div className="z-10">
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-600 rounded-full shadow-[0_0_20px_rgba(217,119,6,0.5)]"><Wrench size={32} className="text-white" /></div>
        <h2 className="text-2xl font-bold">Total Kerusakan</h2>
      </motion.div>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} className="h-1 w-20 bg-amber-600 mb-10 origin-left" />
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="col-span-2 bg-white/10 p-6 rounded-2xl border border-amber-500/20">
          <div className="flex justify-between items-start">
            <div><p className="text-amber-200 text-sm mb-1 uppercase tracking-wider font-semibold">Total Temuan</p><div className="text-6xl font-black text-white">{data.damageCases}</div></div>
            <div className="text-right"><p className="text-amber-200 text-sm mb-1 uppercase tracking-wider font-semibold">Selesai</p><div className="text-4xl font-bold text-green-400 flex items-center justify-end gap-2">{data.damageResolved} <CheckCircle size={24} /></div></div>
          </div>
          <div className="mt-4 h-2 bg-black/30 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${(data.damageResolved / data.damageCases) * 100}%` }} transition={{ delay: 1, duration: 1 }} className="h-full bg-green-500" /></div>
        </motion.div>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="col-span-2 bg-amber-900/40 p-5 rounded-2xl border border-amber-500/10 mt-2">
          <p className="text-xs text-amber-300 mb-1">Masalah Paling Sering</p>
          <div className="text-2xl font-bold text-white flex items-center gap-2"><AlertTriangle size={20} className="text-amber-500" /> {data.topIssue}</div>
        </motion.div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 text-amber-200/60 text-sm italic text-center">{data.damageResolved === data.damageCases ? "Luar biasa! Semua kerusakan telah ditangani." : "Masih ada beberapa PR perbaikan yang perlu diselesaikan."}</motion.p>
    </motion.div>
  </div>
);

const TopLocationSlide = ({ data }) => (
  <div className="flex flex-col h-full items-center justify-center px-6 bg-slate-900 text-white relative">
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bg-blue-500/20 w-80 h-80 rounded-full blur-3xl" />
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 flex flex-col items-center text-center">
      <div className="mb-6 bg-blue-600 p-4 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.5)]"><MapPin size={40} className="text-white" /></div>
      <h3 className="text-blue-300 font-medium tracking-widest text-sm mb-2">ZONA PALING AMAN</h3>
      <h1 className="text-4xl font-bold mb-4 max-w-xs leading-tight">{data.topLocation}</h1>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 px-6 py-4 rounded-xl mt-4">
        <p className="text-slate-400 text-sm mb-1">Tingkat Kepatuhan</p>
        <div className={`text-3xl font-black ${data.topLocationCompliance >= 90 ? "text-green-400" : "text-yellow-400"}`}>{data.topLocationCompliance}%</div>
      </div>
      <p className="mt-8 text-slate-400 text-sm px-8">Area ini menjadi contoh teladan bagi seluruh gedung. Pertahankan!</p>
    </motion.div>
  </div>
);

const RefillSlide = ({ data }) => {
  const hasRefills = data.refillCount > 0;

  return (
    <div className="flex flex-col h-full justify-center px-6 bg-gradient-to-b from-blue-900 to-indigo-950 text-white relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5"><RefreshCcw size={400} /></div>

      {hasRefills ? (
        // Tampilan Jika Ada Transaksi Refill
        <>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-10 z-10">
            <h2 className="text-2xl font-medium text-blue-200">Penyegaran Aset</h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <FireExtinguisher size={48} className="text-blue-400" />
              <span className="text-6xl font-black">{data.refillCount}</span>
            </div>
            <p className="text-xl mt-2 font-medium">Transaksi Refill</p>
          </motion.div>
          <div className="grid grid-cols-1 gap-4 z-10">
            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white/10 p-4 rounded-xl flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-full"><TrendingUp className="text-blue-300" /></div>
              <div><p className="text-xs text-blue-200">Tipe Terbanyak</p><p className="font-bold text-lg">{data.refillTypeMost}</p></div>
            </motion.div>
            <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/10 p-4 rounded-xl">
              <p className="text-sm italic text-center text-blue-100">"Pencegahan lebih baik daripada penanggulangan. Anda memastikan alat Anda selalu prima."</p>
            </motion.div>
          </div>
        </>
      ) : (
        // Tampilan Jika TIDAK Ada Transaksi Refill (Tombol "Cek Status APAR Anda" DIHAPUS)
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center z-10 p-8 bg-white/10 rounded-2xl border border-blue-500/30 backdrop-blur-md shadow-xl"
        >
          <FireExtinguisher size={64} className="text-blue-400 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Refill = 0</h2>
          <p className="text-blue-200 mb-6">
            Wah, kami tidak menemukan transaksi refill di catatan Anda tahun ini.
          </p>
          <div className="bg-red-800/50 p-3 rounded-lg border border-red-500/70">
            <p className="text-sm font-medium text-white flex items-center gap-2">
              <AlertOctagon size={16} className="text-red-400" /> Awas! Jangan sampai APAR kedaluwarsa.
            </p>
          </div>
          {/* Tombol 'Cek Status APAR Anda' sudah dihapus di sini sesuai permintaan */}
        </motion.div>
      )}
    </div>
  );
};

// PersonaSlide sekarang menerima ref dan handler untuk Download & Share
const PersonaSlide = React.forwardRef(({ data, onDownload, onShare, isDownloading, isCapturing }, ref) => {
  let persona = {};
  if (data.safetyScore >= 90) {
    persona = { title: "THE FIRE COMMANDER", subtitle: "Sang Penakluk Risiko", desc: "Anda tidak hanya mematuhi aturan, Anda menetapkan standar! Aset Anda seperti benteng besi yang tak tertembus api.", color: "from-yellow-400 to-red-600", icon: <Award size={80} className="text-yellow-200" />, analogy: "🛡️ Benteng Besi" };
  } else if (data.safetyScore >= 70) {
    persona = { title: "THE VIGILANT OWL", subtitle: "Siaga Senyap", desc: "Anda selalu waspada. Meski ada sedikit celah, mata Anda setajam elang dalam memantau jadwal expired.", color: "from-blue-500 to-cyan-600", icon: <ShieldCheck size={80} className="text-blue-100" />, analogy: "🦉 Mata Elang" };
  } else {
    persona = { title: "THE GAMBLER", subtitle: "Pemain Api", desc: "Hati-hati! Keberuntungan tidak berlangsung selamanya. Jadwal inspeksi Anda butuh perhatian serius tahun depan.", color: "from-gray-800 to-gray-900", icon: <AlertTriangle size={80} className="text-red-500" />, analogy: "🎲 Dadu Panas" };
  }

  return (
    <div
      ref={ref} // Ref diletakkan di container slide untuk di-capture
      className={`flex flex-col h-full items-center justify-center px-6 bg-gradient-to-br ${persona.color} text-white relative`}
    >
      {/* Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">{[...Array(20)].map((_, i) => (<motion.div key={i} className="absolute rounded-full bg-white/20" initial={{ top: -20, left: Math.random() * 100 + "%", width: Math.random() * 20 + 5, height: Math.random() * 20 + 5 }} animate={{ top: "120%", rotate: 360 }} transition={{ duration: Math.random() * 2 + 3, repeat: Infinity, delay: Math.random() * 2 }} />))}</div>

      {/* Content */}
      <motion.div initial={{ scale: 0.5, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] border border-white/30">{persona.icon}</motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/80 font-medium tracking-widest text-sm mb-2">STATUS KESIAPAN 2025</motion.p>
      <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl font-black text-center mb-1 uppercase leading-tight">{persona.title}</motion.h1>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl font-bold text-white/90 mb-6 px-4 py-1 rounded-full">{persona.analogy}</motion.h2>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl text-center border border-white/10"><p className="text-lg leading-relaxed font-medium">"{persona.desc}"</p></motion.div>

      {/* Tombol Aksi: Sembunyikan jika isCapturing=true */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`mt-8 flex flex-col gap-3 ${isCapturing ? 'hidden' : 'block'}`}
      >
        {/* Tombol Download Gambar */}
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-black shadow-lg hover:scale-[1.03] active:scale-95 transition-transform duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Loader2 size={18} /></motion.div>
          ) : (
            <Download size={18} />
          )}
          {isDownloading ? 'Sedang Mengunduh...' : 'UNDUH GAMBAR HASIL'}
        </button>

        {/* Tombol Bagikan LENGKAP - Memicu Web Share API */}
        <button
          onClick={onShare} // Memanggil fungsi berbagi yang baru
          disabled={isDownloading}
          className="flex items-center gap-2 text-white bg-blue-600 px-6 py-3 rounded-full font-black shadow-lg hover:scale-[1.03] active:scale-95 transition-transform duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <Share2 size={18} /> BAGIKAN HASIL LENGKAP
        </button>
      </motion.div>
    </div>
  );
});

// --- LOADING & ERROR SCREENS ---

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-950 text-white">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 size={48} className="text-blue-500 mb-4" />
    </motion.div>
    <p className="text-sm font-medium animate-pulse text-blue-200">Mengambil Data Firecek...</p>
  </div>
);

const ErrorScreen = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-950 text-white px-6 text-center">
    <AlertTriangle size={48} className="text-red-500 mb-4" />
    <h3 className="text-xl font-bold mb-2">Gagal Memuat Data</h3>
    <p className="text-gray-400 text-sm mb-6">Terjadi kesalahan saat menghubungi server.</p>
    <button onClick={onRetry} className="px-6 py-2 bg-white text-gray-900 rounded-full font-bold text-sm">Coba Lagi</button>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const personaSlideRef = useRef(null);

  // API READY STATES
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state to control button visibility during capture
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Reused for capturing status

  // SHARE MODAL STATES (for fallback only)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [fallbackShareText, setFallbackShareText] = useState('');

  // Simulation for debug/demo
  const [debugScenario, setDebugScenario] = useState('user_low'); // Default ke user_low untuk tes 0 Refill

  // --- Memuat Pustaka Eksternal (html2canvas) ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => console.log('html2canvas loaded');
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setFallbackShareText('');
  };

  // 1. Fungsi Fallback Berbagi (Modal Salin Teks)
  const handleFallbackShare = useCallback((text) => {
    setFallbackShareText(text);
    setIsShareModalOpen(true);
    setIsAutoPlaying(false); // Stop autoplay when modal is open
  }, []);

  // 2. Fungsi Utama Berbagi (Web Share API)
  const handleCaptureAndShare = useCallback(async () => {
    // START: REFINED GUARD CLAUSE
    if (!window.html2canvas || !personaSlideRef.current || isDownloading || !data) {
      console.error('Prasyarat berbagi belum terpenuhi:', { html2canvasReady: !!window.html2canvas, refReady: !!personaSlideRef.current, isDownloading, dataExists: !!data });
      window.alert('Mohon tunggu sebentar, atau data belum siap. Coba lagi.');
      return;
    }
    // END: REFINED GUARD CLAUSE

    // Tentukan Persona & Teks untuk Sharing
    let persona = {};
    if (data.safetyScore >= 90) {
      persona = { title: "THE FIRE COMMANDER", analogy: "🛡️ Benteng Besi" };
    } else if (data.safetyScore >= 70) {
      persona = { title: "THE VIGILANT OWL", analogy: "🦉 Mata Elang" };
    } else {
      persona = { title: "THE GAMBLER", analogy: "🎲 Dadu Panas" };
    }

    const shareText = `Lihat status kesiapan APAR ${data.userName} tahun 2025 di Firecek Wrapped! Kami mendapatkan gelar ${persona.analogy} - ${persona.title}!
Capai proteksi terbaik untuk aset Anda. Ayo, jadilah #FireCommander! Lindungi aset dari bahaya kebakaran sekarang: https://firecek.com`;

    setIsDownloading(true); // Reusing state for capturing status
    setIsCapturing(true);

    // Tunggu sebentar untuk memastikan React selesai merender perubahan (tombol tersembunyi)
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const element = personaSlideRef.current;
      const canvas = await window.html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // 1. Konversi Canvas ke Blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

      // 2. Buat Objek File
      const fileName = `Firecek_Wrapped_2025_${data.userName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const imageFile = new File([blob], fileName, { type: 'image/png' });

      const shareData = {
        files: [imageFile],
        title: 'Firecek Wrapped 2025: Status Kesiapan APAR',
        text: shareText,
        url: 'https://firecek.com'
      };

      // 3. Coba Web Share API dengan File
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 4. Jika Web Share API Gagal/Tidak Didukung, gunakan Fallback Modal
        handleFallbackShare(shareText);
      }

    } catch (e) {
      // Jika pengguna membatalkan (AbortError), tidak perlu modal
      if (e.name !== 'AbortError') {
        console.error("Gagal berbagi menggunakan Web Share API:", e);
        // Beri Fallback jika ada error tak terduga
        handleFallbackShare(shareText);
      }
    } finally {
      setIsDownloading(false);
      setIsCapturing(false);
    }
  }, [data, isDownloading, handleFallbackShare]); // Tambahkan isDownloading dan handleFallbackShare sebagai dependency

  // Fungsi untuk menangkap DOM dan mengunduh gambar (tetap ada untuk tombol Download)
  const handleCaptureAndDownload = useCallback(async () => {
    // START: REFINED GUARD CLAUSE
    if (!window.html2canvas || !personaSlideRef.current || !data) {
      console.error('Prasyarat unduh belum terpenuhi:', { html2canvasReady: !!window.html2canvas, refReady: !!personaSlideRef.current, dataExists: !!data });
      window.alert('Mohon tunggu sebentar, atau data belum siap. Coba lagi.');
      return;
    }
    // END: REFINED GUARD CLAUSE

    setIsDownloading(true);
    setIsCapturing(true);

    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const element = personaSlideRef.current;
      const canvas = await window.html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = image;
      a.download = `Firecek_Wrapped_2025_${data.userName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.alert('Gambar hasil wrapped berhasil diunduh!');

    } catch (e) {
      console.error("Gagal mengunduh gambar:", e);
      window.alert('Gagal mengunduh gambar. Silakan coba *screenshot* manual.');
    } finally {
      setIsDownloading(false);
      setIsCapturing(false);
    }
  }, [data?.userName, data]);

  // Function to fetch data (Bisa diganti dengan real API Call)
  const fetchData = async (kodeCustomer) => {
    setIsLoading(true);
    setError(null);
    setCurrentSlide(0); // Reset slide ke awal

    try {
      const result = await apiService.getRecapData(kodeCustomer);
      setData(result);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false);
    }
  };

  // Initial Load & Debug Toggle Effect
  useEffect(() => {
    fetchData(debugScenario);
  }, [debugScenario]);

  const slides = [
    // NOTE: IntroSlide tidak lagi menerima onNext
    { id: 0, component: <IntroSlide data={data} /> },
    { id: 1, component: <InspectionSlide data={data} /> },
    { id: 2, component: <BusyMonthSlide data={data} /> },
    { id: 3, component: <DamageReportSlide data={data} /> },
    { id: 4, component: <TopLocationSlide data={data} /> },
    { id: 5, component: <RefillSlide data={data} /> },
    // PersonaSlide menerima handler share yang baru
    {
      id: 6,
      component: (
        <PersonaSlide
          ref={personaSlideRef}
          data={data}
          onShare={handleCaptureAndShare} // NEW: Panggil Web Share API
          onDownload={handleCaptureAndDownload} // Tetap untuk download
          isDownloading={isDownloading}
          isCapturing={isCapturing}
        />
      )
    },
  ];

  const goToSlide = (index) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  // Logika Autoplay/Auto-scroll
  useEffect(() => {
    if (!isAutoPlaying || isLoading || !data || isShareModalOpen) return;

    // Slide 0 (Intro) akan berjalan otomatis selama 3 detik sebelum lanjut
    // Slide lain berjalan 5 detik
    const duration = currentSlide === 0 ? 3000 : 5000;

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsAutoPlaying(false); // Stop autoplay setelah slide terakhir
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [currentSlide, isAutoPlaying, slides.length, isLoading, data, isShareModalOpen]);


  const handleTap = (e) => {
    if (isLoading || !data || isShareModalOpen) return;
    if (e.target.closest('.debug-controls')) return;

    // Cek apakah yang di-klik adalah tombol, jika ya, jangan navigasi
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    // Cek apakah yang di-klik adalah tombol di slide Persona
    if (currentSlide === slides.length - 1 && e.target.closest('button')) return;

    const container = e.currentTarget.getBoundingClientRect();
    const relativeClickX = e.clientX - container.left;

    // Menangani tap di slide intro setelah autoplay selesai (untuk navigasi manual)
    if (currentSlide === 0) {
      // Izinkan tap ke slide 1 jika autoplay sudah lewat 3 detik
      if (relativeClickX > container.width / 3 && relativeClickX < (container.width * 2) / 3) {
        goToSlide(1);
        return;
      }
    }

    // Navigasi Manual
    if (relativeClickX < container.width / 3) {
      goToSlide(currentSlide - 1);
    } else {
      goToSlide(currentSlide + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 font-sans p-4">

      {/* Mobile Frame Container */}
      <div
        className="w-full max-w-md h-[100dvh] sm:h-[800px] bg-black relative overflow-hidden sm:rounded-3xl shadow-2xl sm:border-8 sm:border-gray-800 transition-all"
        onClick={handleTap}
      >
        {/* Render Content Based on State */}
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorScreen onRetry={() => fetchData(debugScenario)} />
        ) : (
          <>
            {/* Progress Bars */}
            {currentSlide > 0 && currentSlide < slides.length - 1 && (
              <ProgressBar current={currentSlide} total={slides.length - 1} />
            )}

            {/* Slide Content */}
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {slides[currentSlide].component}
              </motion.div>
            </AnimatePresence>

            {/* Controls (Panah Navigasi) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between z-50 pointer-events-none">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide > 0 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => { e.stopPropagation(); goToSlide(currentSlide - 1); }}
                className="pointer-events-auto bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition shadow-lg"
              >
                <ArrowRight size={20} className="rotate-180" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide < slides.length - 1 && currentSlide > 0 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => { e.stopPropagation(); goToSlide(currentSlide + 1); }}
                className="pointer-events-auto bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition shadow-lg"
              >
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </>
        )}
      </div>

      {/* Debug/Scenario Controls */}
      <div className="debug-controls mt-4 text-center">
        <p className="text-sm text-gray-500 mb-2">Simulasi Pengguna:</p>
        <div className="flex gap-2 text-xs">
          {Object.keys(MOCK_DB).map(key => (
            <button
              key={key}
              onClick={() => setDebugScenario(key)}
              className={`px-3 py-1 rounded-full font-medium transition ${debugScenario === key ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {key.replace('user_', '').toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsAutoPlaying(prev => !prev)}
          className="mt-2 text-xs text-blue-400 hover:text-blue-300"
        >
          {isAutoPlaying ? '⏸️ Jeda Autoplay' : '▶️ Lanjutkan Autoplay'}
        </button>
      </div>

      {/* Fallback Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={closeShareModal}
            shareText={fallbackShareText}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, // Digunakan untuk IntroSlide
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
  Loader2 // Ikon untuk loading
} from 'lucide-react';

// --- MOCK DATABASE (Simulasi Backend) ---
// Nanti data ini akan datang dari JSON response API Anda
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
    topLocationCompliance: 100
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
    topLocationCompliance: 90
  },
  'user_low': {
    userName: "Toko Kelontong Barokah",
    totalApar: 20,
    inspectionsScheduled: 240,
    inspectionsRealized: 85,
    ontimePercentage: 35,
    refillCount: 2,
    refillTypeMost: "Powder 3kg",
    safetyScore: 45,
    busiestMonth: "Januari",
    busiestMonthCount: 20,
    damageCases: 8,
    damageResolved: 1,
    topIssue: "Need Refill",
    topLocation: "Kasir Depan",
    topLocationCompliance: 60
  }
};

// --- API SERVICE SIMULATION ---
// [API] Ganti fungsi ini nanti dengan call ke Backend sungguhan
const apiService = {
  getRecapData: async (kodeCustomer) => {
    return new Promise((resolve, reject) => {
      // Simulasi delay network 1.5 detik
      setTimeout(() => {
        // [API Integration Note]
        // Endpoint Real: GET https://web.firecek.com/api/v1/recap?year=2025&kode_customer={kodeCustomer}
        //
        // const response = await fetch(`https://web.firecek.com/api/v1/recap?year=2025&kode_customer=${kodeCustomer}`);
        // const data = await response.json();

        const data = MOCK_DB[kodeCustomer] || MOCK_DB['user_high']; // Default ke high jika not found
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

// --- HALAMAN-HALAMAN SLIDE ---

// REVISI INTRO SLIDE DISINI
const IntroSlide = ({ onNext, data }) => (
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

      {/* Prepared For Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-10 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/20 w-full max-w-xs shadow-xl"
      >
        <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-1">Dipersiapkan Untuk</p>
        <p className="text-white font-bold text-xl leading-tight">{data.userName}</p>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(59, 130, 246, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="mt-12 px-10 py-4 bg-blue-600 text-white font-black text-lg rounded-full shadow-2xl flex items-center gap-3 relative overflow-hidden group hover:bg-blue-700 transition"
      >
        <span className="relative z-10">LIHAT RECAP</span>
        <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="relative z-10">
          <ArrowRight size={22} strokeWidth={3} />
        </motion.span>
        {/* Shimmer effect inside button */}
        <motion.div
          className="absolute top-0 -left-[150%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
          animate={{ left: ["-150%", "150%"] }}
          transition={{ repeat: Infinity, duration: 3, delay: 2, repeatDelay: 1 }}
        />
      </motion.button>
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

const RefillSlide = ({ data }) => (
  <div className="flex flex-col h-full justify-center px-6 bg-gradient-to-b from-blue-900 to-indigo-950 text-white relative">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5"><RefreshCcw size={400} /></div>
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-10 z-10">
      <h2 className="text-2xl font-medium text-blue-200">Penyegaran Aset</h2>
      <div className="mt-4 flex items-center justify-center gap-3"><FireExtinguisher size={48} className="text-blue-400" /><span className="text-6xl font-black">{data.refillCount}</span></div>
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
  </div>
);

const PersonaSlide = ({ data }) => {
  let persona = {};
  if (data.safetyScore >= 90) {
    persona = { title: "THE FIRE COMMANDER", subtitle: "Sang Penakluk Risiko", desc: "Anda tidak hanya mematuhi aturan, Anda menetapkan standar! Aset Anda seperti benteng besi yang tak tertembus api.", color: "from-yellow-400 to-red-600", icon: <Award size={80} className="text-yellow-200" />, analogy: "🛡️ Benteng Besi" };
  } else if (data.safetyScore >= 70) {
    persona = { title: "THE VIGILANT OWL", subtitle: "Siaga Senyap", desc: "Anda selalu waspada. Meski ada sedikit celah, mata Anda setajam elang dalam memantau jadwal expired.", color: "from-blue-500 to-cyan-600", icon: <ShieldCheck size={80} className="text-blue-100" />, analogy: "🦉 Mata Elang" };
  } else {
    persona = { title: "THE GAMBLER", subtitle: "Pemain Api", desc: "Hati-hati! Keberuntungan tidak berlangsung selamanya. Jadwal inspeksi Anda butuh perhatian serius tahun depan.", color: "from-gray-800 to-gray-900", icon: <AlertTriangle size={80} className="text-red-500" />, analogy: "🎲 Dadu Panas" };
  }
  return (
    <div className={`flex flex-col h-full items-center justify-center px-6 bg-gradient-to-br ${persona.color} text-white relative`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">{[...Array(20)].map((_, i) => (<motion.div key={i} className="absolute rounded-full bg-white/20" initial={{ top: -20, left: Math.random() * 100 + "%", width: Math.random() * 20 + 5, height: Math.random() * 20 + 5 }} animate={{ top: "120%", rotate: 360 }} transition={{ duration: Math.random() * 2 + 3, repeat: Infinity, delay: Math.random() * 2 }} />))}</div>
      <motion.div initial={{ scale: 0.5, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] border border-white/30">{persona.icon}</motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/80 font-medium tracking-widest text-sm mb-2">STATUS KESIAPAN 2025</motion.p>
      <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl font-black text-center mb-1 uppercase leading-tight">{persona.title}</motion.h1>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl font-bold text-white/90 mb-6 bg-black/20 px-4 py-1 rounded-full">{persona.analogy}</motion.h2>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl text-center border border-white/10"><p className="text-lg leading-relaxed font-medium">"{persona.desc}"</p></motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 flex gap-4"><button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"><Share2 size={18} /> Bagikan</button></motion.div>
    </div>
  );
};

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

  // API READY STATES
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulation for debug/demo
  const [debugScenario, setDebugScenario] = useState('user_high');

  // Function to fetch data (Bisa diganti dengan real API Call)
  const fetchData = async (kodeCustomer) => {
    setIsLoading(true);
    setError(null);
    setCurrentSlide(0); // Reset slide ke awal

    try {
      // [API Integration Note - URL Handling]
      // Jika aplikasi berjalan di: recap.firecek.com/2025/ENCODED_STRING
      // Anda perlu mengambil 'ENCODED_STRING' dari URL dan melakukan decoding.
      // 
      // Contoh implementasi di React Router atau window.location:
      // const pathSegments = window.location.pathname.split('/');
      // const encodedCode = pathSegments[pathSegments.length - 1]; // asumsi segmen terakhir
      // const decodedKodeCustomer = atob(encodedCode); // jika base64, atau gunakan decoder custom Anda

      // [API Integration Note - Fetching]
      // Gunakan kode customer yang sudah di-decode untuk fetch data:
      // const response = await fetch(`https://web.firecek.com/api/v1/recap?year=2025&kode_customer=${decodedKodeCustomer}`);
      // if (!response.ok) throw new Error("Gagal mengambil data");
      // const result = await response.json();

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
    // [API Integration Note]
    // Di sinilah Anda memanggil fungsi decoding URL saat pertama kali load
    // const customerCodeFromUrl = ... (logika ambil dari URL)
    // fetchData(customerCodeFromUrl);

    // Untuk demo saat ini, kita gunakan debug scenario
    fetchData(debugScenario);
  }, [debugScenario]);

  const slides = [
    { id: 0, component: <IntroSlide onNext={() => goToSlide(1)} data={data} /> },
    { id: 1, component: <InspectionSlide data={data} /> },
    { id: 2, component: <BusyMonthSlide data={data} /> },
    { id: 3, component: <DamageReportSlide data={data} /> },
    { id: 4, component: <TopLocationSlide data={data} /> },
    { id: 5, component: <RefillSlide data={data} /> },
    { id: 6, component: <PersonaSlide data={data} /> },
  ];

  const goToSlide = (index) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || isLoading || !data) return;
    const duration = currentSlide === 0 ? 99999 : 5000;
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [currentSlide, isAutoPlaying, slides.length, isLoading, data]);

  const handleTap = (e) => {
    if (isLoading || !data) return;
    if (e.target.closest('.debug-controls')) return;

    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    if (e.target.tagName === 'BUTTON') return;

    const container = e.currentTarget.getBoundingClientRect();
    const relativeClickX = clickX - container.left;

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
            {currentSlide > 0 && (
              <ProgressBar current={currentSlide} total={slides.length} />
            )}

            {/* Slides Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide + debugScenario}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full"
              >
                {slides[currentSlide].component}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Hints */}
            <div className="hidden sm:block absolute top-1/2 left-2 text-white/20 pointer-events-none">◀</div>
            <div className="hidden sm:block absolute top-1/2 right-2 text-white/20 pointer-events-none">▶</div>

            {/* Branding Small */}
            <div className="absolute bottom-4 left-0 w-full flex flex-col items-center z-50 pointer-events-none">
              <p className="text-[10px] text-white/40 font-bold tracking-widest">FIRECEK</p>
            </div>
          </>
        )}
      </div>

      {/* --- DEBUG/DEMO CONTROLS (OUTSIDE PHONE) --- */}
      <div className="mt-8 bg-gray-900 p-4 rounded-xl border border-gray-800 debug-controls flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-white/60 text-sm uppercase tracking-wider font-bold">
          <Settings2 size={16} /> API Simulation
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDebugScenario('user_high')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${debugScenario === 'user_high' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Load User A (High)
          </button>
          <button
            onClick={() => setDebugScenario('user_medium')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${debugScenario === 'user_medium' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Load User B (Med)
          </button>
          <button
            onClick={() => setDebugScenario('user_low')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${debugScenario === 'user_low' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Load User C (Low)
          </button>
        </div>
        <p className="text-xs text-gray-500">Tombol ini mensimulasikan fetch data API dengan delay.</p>
      </div>

    </div>
  );
}
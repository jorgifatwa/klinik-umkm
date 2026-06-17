import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ══════════════════════════════════════════════════════════════════
   KLINIK KEUANGAN UMKM — Landing Page
   Government-grade digital public service platform
   ══════════════════════════════════════════════════════════════════ */

/* ── Data ──────────────────────────────────────────────────────── */

const trustStats = [
  { value: "1.200+", label: "UMKM Dibantu", icon: "users" },
  { value: "4.500+", label: "Total Konsultasi", icon: "chat" },
  { value: "96%", label: "Tingkat Kepuasan", icon: "star" },
  { value: "+34%", label: "Peningkatan Skor Keuangan", icon: "trend" },
];

const features = [
  {
    icon: "health",
    title: "Cek Kesehatan Keuangan",
    description:
      "Assessment multi-step untuk menganalisis omzet, biaya, utang, kas, dan modal usaha secara komprehensif.",
    href: "/assessment",
    authRequired: true,
  },
  {
    icon: "consultation",
    title: "Konsultasi Ahli",
    description:
      "Terhubung langsung dengan konsultan keuangan profesional untuk strategi bisnis, pembiayaan, dan pengelolaan usaha.",
    href: "/consultations",
    authRequired: true,
  },
  {
    icon: "roadmap",
    title: "Roadmap Keuangan UMKM",
    description:
      "Rekomendasi langkah pengembangan 3–6–12 bulan berdasarkan data keuangan usaha Anda.",
    href: "/dashboard",
  },
  {
    icon: "article",
    title: "Artikel & Edukasi",
    description:
      "Materi literasi keuangan tentang cash flow, laporan keuangan, investasi, pajak, dan keuangan syariah.",
    href: "/articles",
  },
  {
    icon: "forum",
    title: "Forum Komunitas",
    description:
      "Diskusi antar pelaku UMKM, bertanya, berbagi pengalaman, dan saling mendukung dalam forum komunitas.",
    href: "/forum",
  },
  {
    icon: "calculator",
    title: "Kalkulator Bisnis",
    description:
      "Hitung laba rugi, BEP, kebutuhan modal, dan proyeksi keuntungan secara instan dan akurat.",
    href: "/calculators",
  },
];

const roadmapPhases = [
  {
    period: "3 Bulan",
    tagline: "Pondasi Keuangan",
    color: "#1E73D8",
    items: [
      "Pisahkan rekening pribadi & usaha",
      "Catat pemasukan/pengeluaran harian",
      "Buat laporan arus kas mingguan",
      "Identifikasi biaya terbesar",
    ],
  },
  {
    period: "6 Bulan",
    tagline: "Optimalisasi",
    color: "#0F4C9A",
    items: [
      "Evaluasi margin per produk/layanan",
      "Optimalkan biaya operasional",
      "Mulai alokasi dana investasi",
      "Bangun cadangan kas 3 bulan",
    ],
  },
  {
    period: "1 Tahun",
    tagline: "Pertumbuhan",
    color: "#37B24D",
    items: [
      "Review & revisi strategi bisnis",
      "Konsolidasi laporan keuangan tahunan",
      "Siapkan ekspansi atau diversifikasi",
      "Evaluasi ROI seluruh investasi",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Daftarkan Usaha",
    description: "Buat akun dan lengkapi profil dasar usaha Anda dalam 2–3 menit.",
  },
  {
    number: "02",
    title: "Isi Data Keuangan",
    description: "Jawab assessment 4 langkah tentang kondisi keuangan usaha Anda.",
  },
  {
    number: "03",
    title: "Dapatkan Financial Health Score",
    description: "Terima skor kesehatan keuangan beserta analisis 4 dimensi utama.",
  },
  {
    number: "04",
    title: "Konsultasi dengan Ahli",
    description: "Diskusi langsung dengan konsultan keuangan untuk strategi yang tepat.",
  },
  {
    number: "05",
    title: "Jalankan Roadmap",
    description: "Ikuti rekomendasi pengembangan usaha 3–12 bulan yang terstruktur.",
  },
];

const testimonials = [
  {
    quote:
      "Setelah cek kesehatan keuangan, saya jadi tahu selama ini pengeluaran terlalu besar di biaya operasional. Sekarang arus kas lebih terkontrol dan bisnis berjalan lebih stabil.",
    name: "Budi Santoso",
    business: "Kedai Kopi Nusantara",
    location: "Jakarta",
    score: 82,
  },
  {
    quote:
      "Roadmap 6 bulan sangat membantu. Saya jadi punya target yang jelas dan bisa evaluasi pencapaian setiap bulan. Omzet naik 25% dalam 4 bulan.",
    name: "Sari Dewi",
    business: "Batik Ciprat",
    location: "Yogyakarta",
    score: 78,
  },
  {
    quote:
      "Konsultasi dengan ahlinya langsung memberi perspektif baru. Saya jadi berani ambil langkah ekspansi setelah dapat rekomendasi yang terukur dan berbasis data.",
    name: "Rudi Hartono",
    business: "Tani Makmur",
    location: "Jawa Timur",
    score: 85,
  },
];

const faqs = [
  {
    q: "Apa itu Klinik Keuangan UMKM?",
    a: "Platform digital resmi yang membantu pelaku UMKM memahami kondisi keuangan usaha melalui assessment otomatis, mendapatkan rekomendasi pengembangan, mengakses edukasi, dan berkonsultasi dengan ahlinya.",
  },
  {
    q: "Apakah platform ini gratis?",
    a: "Ya, layanan dasar seperti cek kesehatan keuangan, artikel edukasi, forum, dan kalkulator bisnis dapat diakses secara gratis oleh seluruh pelaku UMKM di Indonesia.",
  },
  {
    q: "Berapa lama proses assessment?",
    a: "Assessment terdiri dari 4 langkah dan dapat diselesaikan dalam waktu 10–15 menit, tergantung kelengkapan data usaha yang Anda miliki.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Seluruh data usaha Anda disimpan dengan enkripsi dan hanya digunakan untuk kepentingan analisis keuangan. Data tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.",
  },
  {
    q: "Siapa yang bisa menggunakan platform ini?",
    a: "Platform ini dirancang untuk seluruh pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia dari berbagai sektor usaha.",
  },
  {
    q: "Apakah ada konsultan yang bisa dihubungi?",
    a: "Ya, Anda bisa menjadwalkan konsultasi dengan konsultan keuangan yang tersedia di platform. Jadwal dapat dipilih sesuai ketersediaan waktu Anda.",
  },
];

/* ── Icon Components ───────────────────────────────────────────── */

function IconConsultation() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function IconHealth() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

function IconRoadmap() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-11.042a24.948 24.948 0 00-6.662 0C6.318 5.958 5.636 6.56 5.25 7.382c-.377.833-.657 1.863-.754 2.958a12.3 12.3 0 00-.018 1.71c.097 1.095.377 2.125.754 2.958.386.842 1.068 1.444 2.587 1.444h1.06c1.519 0 2.201-.602 2.587-1.444.377-.833.657-1.863.754-2.958a12.3 12.3 0 00-.018-1.71c-.097-1.095-.377-2.125-.754-2.958C18.462 6.56 17.78 5.958 16.748 5.874zM12 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function IconAI() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function IconCalculator() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
    </svg>
  );
}

function IconArticle() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function IconForum() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.641.641 0 01-.627-.044 12.016 12.016 0 01-3.818-4.255M10.34 15.84a11.963 11.963 0 01-1.36-3.59m4.32-5.34c.688.06 1.386.09 2.09.09H16.5a4.5 4.5 0 110 9h-.75c-.704 0-1.402.03-2.09.09m0-9.18a12.013 12.013 0 01-1.36 3.59m4.32 5.34a12.013 12.013 0 01-1.36 3.59m0 0l.657.38c.462.267.998.063 1.14-.384.403-1.105.734-2.035.985-2.783M9.678 9.75a11.98 11.98 0 010 4.5" />
    </svg>
  );
}

function IconTemplate() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

const featureIcons: Record<string, React.ReactNode> = {
  consultation: <IconConsultation />,
  health: <IconHealth />,
  roadmap: <IconRoadmap />,
  ai: <IconAI />,
  article: <IconArticle />,
  forum: <IconForum />,
  calculator: <IconCalculator />,
  template: <IconTemplate />,
};

/* ── SVG Icon Helpers ──────────────────────────────────────────── */

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg className="h-5 w-5 text-[#1E73D8]/30" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.996-1.741 3.575-3.583 3.575-1.76 0-3.054-1.084-3.834-2.254zM16.583 17.321C15.553 16.227 15 15 15 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.996-1.741 3.575-3.583 3.575-1.76 0-3.054-1.084-3.834-2.254z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ════════════════════════════════════════════════════════════
         1. NAVBAR
         ════════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Klinik Keuangan UMKM"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-bold tracking-tight text-[#0F4C9A]">
                Klinik Keuangan UMKM
              </p>
              <p className="text-[10px] font-medium text-gray-400 -mt-0.5">
                Platform Pendampingan Keuangan
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
            <a href="#layanan" className="transition-colors hover:text-[#0F4C9A]">
              Layanan
            </a>
            <a href="#skor" className="transition-colors hover:text-[#0F4C9A]">
              Skor Keuangan
            </a>
            <a href="#roadmap" className="transition-colors hover:text-[#0F4C9A]">
              Roadmap
            </a>
            <a href="#cara-kerja" className="transition-colors hover:text-[#0F4C9A]">
              Cara Kerja
            </a>
            <a href="#faq" className="transition-colors hover:text-[#0F4C9A]">
              FAQ
            </a>
            <div className="flex items-center gap-2.5 pl-5 border-l border-gray-200">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="h-9 text-gray-700">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="h-9">
                  Daftar Gratis
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="h-9 text-gray-700">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="h-9">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════
         2. HERO SECTION
         ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(15,76,154,0.03),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(30,115,216,0.02),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pt-32">
          <div className="grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0F4C9A]/10 bg-[#E8F0FE] px-4 py-1.5 text-xs font-semibold text-[#0F4C9A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#37B24D]" />
                Program Pendampingan UMKM Indonesia
              </div>

              {/* Headlines */}
              <div className="space-y-5">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                  Kesehatan Keuangan yang{" "}
                  <span className="text-[#0F4C9A]">Lebih Baik</span>{" "}
                  untuk UMKM Indonesia
                </h1>

                <p className="max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
                  Bantu usaha Anda tumbuh melalui konsultasi, analisis
                  kesehatan keuangan, roadmap pengembangan usaha, dan
                  pendampingan digital.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/login">
                  <Button size="lg" className="w-full sm:w-auto px-8 h-13 text-base">
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cek Kesehatan Keuangan
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-13 px-8 text-base">
                    Konsultasi Sekarang
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-4 w-4 text-[#37B24D]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  Data Terenkripsi
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-4 w-4 text-[#37B24D]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Gratis untuk UMKM
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-4 w-4 text-[#37B24D]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  24/7 Online
                </div>
              </div>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="relative">
              <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-elevated sm:p-6">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/logo.png"
                      alt="KU"
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Dashboard UMKM</p>
                      <p className="text-[10px] text-gray-400">Ringkasan Keuangan</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-[#E6F9EC] px-2.5 py-1 text-[11px] font-semibold text-[#37B24D]">
                    Aktif
                  </span>
                </div>

                {/* Financial Health Score */}
                <div className="mt-5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    Skor Kesehatan Keuangan
                  </p>
                  <div className="mt-2 flex items-end gap-3">
                    <span className="text-5xl font-bold tracking-tight text-[#37B24D]">82</span>
                    <div className="mb-1.5">
                      <span className="rounded-md bg-[#E6F9EC] px-2 py-0.5 text-[11px] font-semibold text-[#37B24D]">
                        Sehat
                      </span>
                      <p className="mt-1 text-[10px] text-gray-400">dari skala 0–100</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-gray-100">
                    <div className="h-2 w-[82%] rounded-full bg-[#37B24D]" />
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-gray-400">Revenue</p>
                      <svg className="h-3.5 w-3.5 text-[#37B24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                    <p className="mt-1.5 text-lg font-bold text-gray-900">Rp 48.5Jt</p>
                    <p className="text-[10px] font-medium text-[#37B24D]">+12.3% dari bulan lalu</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-gray-400">Cash Flow</p>
                      <svg className="h-3.5 w-3.5 text-[#1E73D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="mt-1.5 text-lg font-bold text-gray-900">Rp 8.2Jt</p>
                    <p className="text-[10px] font-medium text-[#37B24D]">Positif</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3.5">
                    <p className="text-[11px] font-medium text-gray-400">Profitability</p>
                    <p className="mt-1.5 text-lg font-bold text-gray-900">78</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3.5">
                    <p className="text-[11px] font-medium text-gray-400">Growth</p>
                    <p className="mt-1.5 text-lg font-bold text-gray-900">91</p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-4 rounded-xl border border-[#1E73D8]/10 bg-[#E8F0FE] p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#0F4C9A] text-white">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#0F4C9A]">Rekomendasi Bulan Ini</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
                        Fokus pada pengelolaan arus kas dan pengurangan biaya operasional yang tidak produktif.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-[#0F4C9A]/5 bg-[#E8F0FE]/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         3. TRUST INDICATORS
         ════════════════════════════════════════════════════════════ */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {trustStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-[#0F4C9A] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         4. FITUR UNGGULAN
         ════════════════════════════════════════════════════════════ */}
      <section id="layanan" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E73D8]">
              Fitur Unggulan
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Semua yang UMKM butuhkan dalam satu platform
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Dari assessment hingga konsultasi — kami menyediakan alat yang
              Anda perlukan untuk mengelola keuangan usaha.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.authRequired ? `/auth/login?callbackUrl=${feature.href}` : feature.href}
                className="group rounded-2xl border border-gray-150 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F4C9A]/20 hover:shadow-elevated sm:p-7"
                style={{ borderColor: "#E5E7EB" }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#0F4C9A] transition-colors group-hover:bg-[#0F4C9A] group-hover:text-white">
                  {featureIcons[feature.icon]}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
                <p className="mt-4 text-xs font-semibold text-[#1E73D8] opacity-0 transition-opacity group-hover:opacity-100">
                  Pelajari selengkapnya →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         5. FINANCIAL HEALTH SCORE SECTION
         ════════════════════════════════════════════════════════════ */}
      <section id="skor" className="bg-[#0F0F1A] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            {/* Left: Explanation */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1E73D8]">
                Financial Health Score
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ketahui skor kesehatan keuangan usaha Anda
              </h2>
              <p className="mt-5 text-base leading-relaxed text-gray-400">
                Assessment kami menganalisis 4 dimensi utama keuangan UMKM
                secara otomatis dan memberikan skor yang mudah dipahami.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  {
                    icon: (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                    ),
                    title: "Profitability",
                    desc: "Apakah usaha Anda menghasilkan keuntungan yang cukup?",
                  },
                  {
                    icon: (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "Liquidity",
                    desc: "Seberapa lancar arus kas untuk kebutuhan operasional?",
                  },
                  {
                    icon: (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 4.97z" />
                      </svg>
                    ),
                    title: "Debt Management",
                    desc: "Apakah tingkat utang masih dalam batas wajar?",
                  },
                  {
                    icon: (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    ),
                    title: "Growth Potential",
                    desc: "Bagaimana prospek pertumbuhan usaha ke depan?",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#1E73D8]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-0.5 text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Score Visualization */}
            <div className="order-first lg:order-last">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#1E73D8]">
                      Financial Health Score
                    </p>
                    <p className="mt-1.5 text-xl font-bold text-white">
                      Analisis Kesehatan Keuangan
                    </p>
                  </div>
                </div>

                {/* Big Score */}
                <div className="mt-7 flex items-end gap-4">
                  <div className="relative">
                    {/* Circular Score */}
                    <div className="relative h-32 w-32 sm:h-36 sm:w-36">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60" cy="60" r="52"
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="60" cy="60" r="52"
                          fill="none"
                          stroke="#37B24D"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(82 / 100) * 327} 327`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white sm:text-4xl">82</span>
                        <span className="text-[10px] font-medium text-gray-400">/ 100</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="rounded-md bg-[#37B24D]/20 px-2.5 py-1 text-xs font-semibold text-[#37B24D]">
                      Sehat
                    </span>
                    <p className="mt-1.5 text-xs text-gray-500">
                      Di atas rata-rata UMKM
                    </p>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-5 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[82%] rounded-full bg-[#37B24D]" />
                </div>

                {/* Sub Scores */}
                <div className="mt-7 grid grid-cols-2 gap-3">
                  {[
                    { label: "Profitability", score: 78, color: "#37B24D" },
                    { label: "Liquidity", score: 85, color: "#1E73D8" },
                    { label: "Debt Mgmt", score: 72, color: "#D97706" },
                    { label: "Growth", score: 91, color: "#0F4C9A" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-white/[0.05] p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">{item.label}</span>
                        <span className="text-sm font-bold text-white">{item.score}</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${item.score}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div className="mt-5 rounded-xl border border-[#37B24D]/20 bg-[#37B24D]/5 p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#37B24D]/20">
                      <CheckIcon className="h-3 w-3 text-[#37B24D]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#37B24D]">
                        Rekomendasi Utama
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
                        Tingkatkan Debt Management dengan mengurangi rasio utang terhadap pendapatan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         6. ROADMAP KEUANGAN SECTION
         ════════════════════════════════════════════════════════════ */}
      <section id="roadmap" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E73D8]">
              Roadmap Pengembangan
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Rencana langkah demi langkah
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Dapatkan rekomendasi pengembangan usaha untuk 3, 6, dan 12 bulan
              ke depan berdasarkan hasil assessment.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative mt-16">
            {/* Connector Line (desktop) */}
            <div className="absolute left-0 top-0 hidden h-full w-px bg-gray-200 lg:block" style={{ left: "calc(16.666% + 12px)" }} />

            <div className="space-y-8 lg:space-y-0">
              {roadmapPhases.map((phase, idx) => (
                <div key={phase.period} className="relative lg:grid lg:grid-cols-[1fr_2.5fr] lg:gap-12 lg:py-8">
                  {/* Period Label (desktop) */}
                  <div className="hidden lg:flex lg:items-start lg:justify-end lg:pr-12">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{phase.period}</p>
                        <p className="text-xs font-medium text-gray-400">{phase.tagline}</p>
                      </div>
                      <div
                        className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-white text-[10px] font-bold"
                        style={{ backgroundColor: phase.color }}
                      >
                        {idx + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 sm:p-7">
                    {/* Mobile Period Badge */}
                    <div className="mb-4 lg:hidden">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: phase.color }}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-900">{phase.period}</p>
                          <p className="text-xs text-gray-400">{phase.tagline}</p>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {phase.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: `${phase.color}15` }}>
                            <CheckIcon className="h-3 w-3" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         7. HOW IT WORKS
         ════════════════════════════════════════════════════════════ */}
      <section id="cara-kerja" className="bg-gray-50/50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E73D8]">
              Cara Kerja
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Mulai dalam 5 langkah mudah
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Dari mendaftar hingga menjalankan roadmap pengembangan — semuanya
              bisa dilakukan dalam hitungan menit.
            </p>
          </div>

          <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative text-center">
                {/* Connector (desktop) */}
                {idx < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full lg:block" style={{ background: "linear-gradient(to right, #E5E7EB, transparent)" }} />
                )}

                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-card">
                  <span className="text-lg font-bold text-[#0F4C9A]">{step.number}</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500 max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         8. TESTIMONIALS
         ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E73D8]">
              Testimoni
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Dipercaya oleh ribuan pelaku UMKM
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Dengarkan pengalaman pelaku UMKM yang telah merasakan manfaat
              platform kami.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 sm:p-7 transition-all duration-200 hover:shadow-elevated"
              >
                <QuoteIcon />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Score badge */}
                <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#E6F9EC] px-3 py-1.5 w-fit">
                  <svg className="h-3.5 w-3.5 text-[#37B24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                  <span className="text-[11px] font-semibold text-[#37B24D]">
                    Skor: {t.score}/100
                  </span>
                </div>

                {/* Author */}
                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F0FE] text-sm font-bold text-[#0F4C9A]">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">
                      {t.business} — {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         FAQ SECTION
         ════════════════════════════════════════════════════════════ */}
      <section id="faq" className="bg-gray-50/50 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E73D8]">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pertanyaan yang sering diajukan
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-gray-100 bg-white shadow-card transition-all hover:border-gray-200"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-gray-900 select-none">
                  {faq.q}
                  <ChevronDown />
                </summary>
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="text-sm leading-relaxed text-gray-500">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         9. FINAL CTA
         ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0F4C9A] py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#37B24D]" />
            Gratis untuk semua UMKM
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Mulai perjalanan UMKM Anda menuju kesehatan keuangan
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Daftar gratis, lengkapi profil usaha, dan dapatkan gambaran jelas
            tentang kondisi keuangan bisnis Anda. Tanpa biaya, tanpa ribet.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-white px-8 h-13 text-base text-[#0F4C9A] hover:bg-gray-50 shadow-lg"
              >
                Daftar Sekarang — Gratis
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base border-[#0F4C9A] text-[#0F4C9A] hover:bg-[#0F4C9A] hover:text-white hover:border-white"
              >
                Masuk ke Akun
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         10. FOOTER
         ════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          {/* Main Footer */}
          <div className="grid gap-10 py-12 sm:py-16 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Klinik Keuangan UMKM"
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-[#0F4C9A]">Klinik Keuangan UMKM</p>
                </div>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Platform digital pendampingan keuangan untuk Usaha Mikro, Kecil,
                dan Menengah di Indonesia.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                Layanan
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Cek Kesehatan Keuangan", href: "/assessment" },
                  { label: "Konsultasi", href: "/consultations" },
                  { label: "Kalkulator Keuangan", href: "/calculators" },
                  { label: "Artikel Edukasi", href: "/articles" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-[#0F4C9A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                Sumber Daya
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Forum Komunitas", href: "/forum" },
                  { label: "AI Assistant", href: "/chat" },
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Template", href: "/articles" },
                ].map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-[#0F4C9A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                Kontak
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  info@klinikumkm.go.id
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  (021) 1234-5678
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-500">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Jakarta, Indonesia
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 py-6 sm:flex-row">
            <p className="text-xs text-gray-400">
              © 2026 Klinik Keuangan UMKM. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-5 text-xs text-gray-400">
              <Link href="/auth/login" className="transition-colors hover:text-[#0F4C9A]">
                Masuk
              </Link>
              <Link href="/auth/register" className="transition-colors hover:text-[#0F4C9A]">
                Daftar
              </Link>
              <span className="text-gray-200">|</span>
              <span className="font-medium text-gray-500">
                Indonesia Maju · UMKM Naik Kelas
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
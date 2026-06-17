"use client";

import { useState } from "react";

type CalculatorType = "laba-rugi" | "bep" | "modal" | "proyeksi";

const calculators = {
  "laba-rugi": {
    title: "Kalkulator Laba Rugi",
    icon: "📊",
    desc: "Menghitung laba atau rugi bersih dari pendapatan dan biaya usaha.",
    rumus: "Laba Bersih = Total Pendapatan - Total Biaya",
    example: { in: "Pendapatan Rp 10jt, Biaya Rp 7jt", out: "Laba Rp 3jt (30%)" },
    tips: [
      "Jika margin ≥ 20% → usaha Anda sehat",
      "Jika margin 10-20% → perlu optimasi biaya",
      "Jika margin < 10% atau negatif → evaluasi besar-besaran",
    ],
    color: "#1E73D8",
  },
  bep: {
    title: "Kalkulator BEP (Break Even Point)",
    icon: "🎯",
    desc: "Menentukan jumlah unit yang harus dijual agar tidak rugi maupun untung.",
    rumus: "BEP (unit) = Biaya Tetap ÷ (Harga Jual - Biaya Variabel per unit)",
    example: { in: "Biaya Tetap Rp 5jt, Harga Rp 50rb, Biaya Variabel Rp 30rb", out: "BEP = 250 unit" },
    tips: [
      "Selisih (Harga - Biaya Variabel) disebut kontribusi margin",
      "Semakin rendah BEP, semakin cepat balik modal",
      "Upayakan BEP tercapai dalam 3-6 bulan pertama",
    ],
    color: "#F59E0B",
  },
  modal: {
    title: "Kalkulator Modal Usaha",
    icon: "🏦",
    desc: "Menghitung total modal yang dibutuhkan untuk mencapai target produksi.",
    rumus: "Modal = Target Produksi (unit) × Biaya Produksi per Unit",
    example: { in: "Target 1000 unit, Biaya Rp 50rb/unit", out: "Modal Rp 50jt" },
    tips: [
      "Hitung modal untuk 3 bulan pertama operasi",
      "Siapkan dana cadangan 20% di luar modal produksi",
      "Pertimbangkan biaya pemasaran dan operasional juga",
    ],
    color: "#37B24D",
  },
  proyeksi: {
    title: "Kalkulator Proyeksi Keuntungan",
    icon: "🚀",
    desc: "Memproyeksikan keuntungan bulanan dan tahunan berdasarkan penjualan dan margin.",
    rumus: "Proyeksi Tahunan = Penjualan Bulanan × (Margin ÷ 100) × 12",
    example: { in: "Penjualan Rp 20jt/bln, Margin 15%", out: "Proyeksi 12 bulan = Rp 36jt" },
    tips: [
      "Gunakan margin yang realistis, jangan terlalu optimis",
      "Bandingkan dengan data historical jika ada",
      "Lakukan update proyeksi setiap 3 bulan",
    ],
    color: "#8B5CF6",
  },
};

export function CalculatorGuideButton({ type }: { type: CalculatorType }) {
  const [open, setOpen] = useState(false);
  const calc = calculators[type];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-gray-300 text-gray-400 hover:text-[#0F4C9A] hover:border-[#0F4C9A] transition-colors flex-shrink-0"
        title={`Cara menggunakan ${calc.title}`}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>

      {open && (
        <CalculatorGuideModal type={type} calc={calc} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function CalculatorGuideModal({
  type,
  calc,
  onClose,
}: {
  type: CalculatorType;
  calc: (typeof calculators)[CalculatorType];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-base"
              style={{ backgroundColor: calc.color + "15" }}
            >
              {calc.icon}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">{calc.title}</h3>
              <p className="text-[11px] text-gray-500">{calc.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Rumus */}
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 mb-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Rumus</p>
          <div className="bg-white rounded-lg px-3 py-2 text-[12px] font-mono text-gray-700 border border-gray-100">
            {calc.rumus}
          </div>
        </div>

        {/* Contoh */}
        <div className="rounded-xl bg-[#E8F0FE] border border-[#0F4C9A]/10 p-4 mb-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#0F4C9A] mb-1.5">Contoh Kasus</p>
          <div className="space-y-1 text-[12px]">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Input:</span> {calc.example.in}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Hasil:</span> {calc.example.out}
            </p>
          </div>
        </div>

        {/* Tips */}
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-500 mb-2">💡 Tips Penggunaan</p>
          <ul className="space-y-1.5">
            {calc.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-gray-600">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: calc.color }} />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Close */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-6 py-2.5 text-[12.5px] font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
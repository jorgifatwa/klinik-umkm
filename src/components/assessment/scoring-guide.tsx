"use client";

import { useState } from "react";

const dimensions = [
  {
    label: "Profitabilitas",
    weight: "30%",
    icon: "📈",
    color: "#1E73D8",
    desc: "Mengukur margin laba dari pendapatan setelah dikurangi biaya.",
    rumus: "(Pendapatan - Total Biaya) / Pendapatan",
    baik: "≥ 30% = skor 100",
    buruk: "< 5% = skor 20",
  },
  {
    label: "Likuiditas",
    weight: "30%",
    icon: "💰",
    color: "#37B24D",
    desc: "Mengukur kemampuan kas menutupi biaya operasional.",
    rumus: "Saldo Kas / Biaya Operasional",
    baik: "≥ 3x = skor 100",
    buruk: "< 0.5x = skor 20",
  },
  {
    label: "Pengelolaan Utang",
    weight: "20%",
    icon: "🏦",
    color: "#F59E0B",
    desc: "Mengukur seberapa besar utang dibanding modal usaha.",
    rumus: "Total Utang / Modal Usaha",
    baik: "≤ 30% = skor 100",
    buruk: "> 100% = skor 20",
  },
  {
    label: "Pertumbuhan",
    weight: "20%",
    icon: "🚀",
    color: "#8B5CF6",
    desc: "Mengukur pertumbuhan pendapatan bulan ini vs bulan lalu.",
    rumus: "(Revenue - Revenue sebelumnya) / Revenue sebelumnya",
    baik: "≥ 20% = skor 100",
    buruk: "< 0% = skor 20",
  },
];

const categories = [
  { range: "≥ 90", label: "Sangat Sehat", color: "bg-emerald-500" },
  { range: "≥ 75", label: "Sehat", color: "bg-emerald-400" },
  { range: "≥ 60", label: "Cukup Sehat", color: "bg-amber-400" },
  { range: "≥ 40", label: "Perlu Perbaikan", color: "bg-orange-400" },
  { range: "< 40", label: "Risiko Tinggi", color: "bg-red-500" },
];

export function ScoringGuideButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-gray-300 text-gray-400 hover:text-[#0F4C9A] hover:border-[#0F4C9A] transition-colors flex-shrink-0"
        title="Bagaimana skor ini dihitung?"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>

      {open && (
        <ScoringGuideModal onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function ScoringGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0FE] text-base">
              ❓
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Bagaimana Skor Dihitung?</h3>
              <p className="text-[11.5px] text-gray-500">Cek Kesehatan Keuangan UMKM</p>
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

        {/* Intro */}
        <p className="text-[12.5px] text-gray-600 leading-relaxed mb-5">
          Skor Kesehatan Keuangan dihitung dari <strong>4 dimensi</strong> dengan bobot berbeda.
          Setiap dimensi diskor 20–100, lalu dikalikan bobotnya untuk mendapatkan skor akhir (0–100).
        </p>

        {/* 4 Dimensi Cards */}
        <div className="grid gap-3 sm:grid-cols-2 mb-5">
          {dimensions.map((dim) => (
            <div key={dim.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{dim.icon}</span>
                <span className="text-[12px] font-bold text-gray-900">{dim.label}</span>
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-gray-200" style={{ color: dim.color }}>
                  {dim.weight}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-1.5">{dim.desc}</p>
              <div className="bg-white rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono text-gray-600 mb-1.5 border border-gray-100">
                {dim.rumus}
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-emerald-600">✅ {dim.baik}</span>
                <span className="text-red-500">❌ {dim.buruk}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Formula */}
        <div className="rounded-xl bg-[#0F4C9A]/5 border border-[#0F4C9A]/10 p-4 mb-5">
          <p className="text-[11.5px] font-bold text-gray-900 mb-1">📊 Rumus Skor Akhir</p>
          <div className="bg-white rounded-lg px-3 py-2 text-[11.5px] font-mono text-gray-700 border border-gray-100">
            Skor = (Profit × 30%) + (Likuiditas × 30%) + (Utang × 20%) + (Growth × 20%)
          </div>
        </div>

        {/* Categories */}
        <div className="mb-5">
          <p className="text-[11.5px] font-bold text-gray-900 mb-2">🏷️ Kategori Skor</p>
          <div className="space-y-1.5">
            {categories.map((cat) => (
              <div key={cat.range} className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${cat.color} flex-shrink-0`} />
                <span className="text-[11px] font-semibold text-gray-500 w-10">{cat.range}</span>
                <span className="text-[12px] font-semibold text-gray-900">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
          <p className="text-[11.5px] font-bold text-gray-900 mb-1">🗺️ Bagaimana Roadmap Ditentukan?</p>
          <p className="text-[11.5px] text-gray-600 leading-relaxed">
            Berdasarkan skor akhir, sistem menghasilkan <strong>target 3, 6, dan 12 bulan</strong>.
            Semakin rendah skor, semakin fundamental targetnya (misal: pisah rekening, laporan arus kas).
            Semakin tinggi skor, target lebih ke arah ekspansi dan optimalisasi.
          </p>
        </div>

        {/* Close button */}
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
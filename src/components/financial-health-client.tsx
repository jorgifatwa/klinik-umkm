"use client";

import { useState } from "react";
import Link from "next/link";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import { HealthRadar } from "@/components/charts/health-radar";
import { ScoringGuideButton } from "@/components/assessment/scoring-guide";

type ScoreData = {
  finalScore: number;
  category: string;
  profitabilityScore: number;
  liquidityScore: number;
  debtScore: number;
  growthScore: number;
  strengths: string[];
  weaknesses: string[];
};

type RoadmapData = {
  target3Months: string;
  target6Months: string;
  target1Year: string;
  tasks: { completed: boolean }[];
};

type AssessmentData = {
  createdAt: string;
  score: ScoreData | null;
  roadmap: RoadmapData | null;
};

function InsightCard({ icon, title, description, color }: { icon: string; title: string; description: string; color: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[16px]" style={{ backgroundColor: color + "12" }}>
          {icon}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-gray-900">{title}</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
    </div>
  );
}

export function FinancialHealthClient({ assessment }: { assessment: AssessmentData | null }) {
  const [mode, setMode] = useState<"view" | "assessment">(assessment ? "view" : "assessment");
  const [currentAssessment, setCurrentAssessment] = useState(assessment);

  const score = currentAssessment?.score;
  const roadmap = currentAssessment?.roadmap;

  const totalTasks = roadmap?.tasks.length ?? 0;
  const completedTasks = roadmap?.tasks.filter((t) => t.completed).length ?? 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const categoryColors: Record<string, string> = {
    "Sangat Sehat": "#37B24D",
    "Sehat": "#1E73D8",
    "Cukup": "#D97706",
    "Kurang": "#DC2626",
    "Sangat Kurang": "#991B1B",
  };

  // Build insights from strengths & weaknesses
  const insights: { icon: string; title: string; description: string; color: string }[] = [];

  if (score) {
    if (score.weaknesses.length > 0) {
      score.weaknesses.forEach((w) => {
        insights.push({
          icon: "⚠️",
          title: "Perlu Perbaikan",
          description: w,
          color: "#D97706",
        });
      });
    }
    if (score.strengths.length > 0) {
      score.strengths.forEach((s) => {
        insights.push({
          icon: "✅",
          title: "Sudah Baik",
          description: s,
          color: "#37B24D",
        });
      });
    }

    // Fallback insights based on score thresholds if no structured data
    if (insights.length === 0) {
      if (score.profitabilityScore < 60) {
        insights.push({ icon: "💰", title: "Profitabilitas", description: "Profitabilitas masih rendah. Review harga jual dan optimalkan biaya operasional.", color: "#D97706" });
      } else {
        insights.push({ icon: "💰", title: "Profitabilitas", description: "Profitabilitas sudah cukup baik. Pertahankan tren positif ini.", color: "#37B24D" });
      }
      if (score.liquidityScore < 60) {
        insights.push({ icon: "💧", title: "Likuiditas", description: "Likuiditas masih perlu ditingkatkan. Siapkan cadangan kas 3-6 bulan pengeluaran.", color: "#D97706" });
      } else {
        insights.push({ icon: "💧", title: "Likuiditas", description: "Likuiditas sudah cukup baik. Kelola arus kas dengan disiplin.", color: "#37B24D" });
      }
      if (score.debtScore < 60) {
        insights.push({ icon: "📊", title: "Pengelolaan Utang", description: "Rasio utang perlu diperbaiki. Buat rencana pembayaran utang terstruktur.", color: "#D97706" });
      } else {
        insights.push({ icon: "📊", title: "Pengelolaan Utang", description: "Pengelolaan utang sudah baik. Pertahankan kebijakan utang yang sehat.", color: "#37B24D" });
      }
      if (score.growthScore < 60) {
        insights.push({ icon: "🌱", title: "Pertumbuhan Usaha", description: "Pertumbuhan usaha perlu didorong. Eksplorasi pasar dan kanal penjualan baru.", color: "#D97706" });
      } else {
        insights.push({ icon: "🌱", title: "Pertumbuhan Usaha", description: "Pertumbuhan usaha sudah positif. Kembangkan strategi ekspansi secara bertahap.", color: "#37B24D" });
      }
    }
  }

  function handleAssessmentSuccess() {
    // Refresh the page data after a successful assessment
    window.location.reload();
  }

  // ── CASE 1: No assessment history yet ──────────────────────────────────
  if (!currentAssessment) {
    return (
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#1E73D8] p-8 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(55,178,77,0.15),transparent_50%)] pointer-events-none" />
          <div className="relative text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="mt-5 text-[24px] font-bold text-white">Analisis Keuangan SUFIC'C</h1>
            <p className="mt-3 text-[14px] leading-relaxed text-white/70 max-w-lg mx-auto">
              Dapatkan gambaran lengkap kondisi keuangan usaha Anda berdasarkan data yang akurat.
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <svg className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="mt-5 text-[17px] font-bold text-gray-900">Belum ada hasil analisis</h3>
          <p className="mt-2 text-[13px] text-gray-500 max-w-md mx-auto">
            Lakukan assessment pertama untuk mengetahui kondisi keuangan usaha Anda.
          </p>
        </div>

        {/* Assessment Form Only - No results visible */}
        <AssessmentWizard onSuccess={handleAssessmentSuccess} />
      </div>
    );
  }

  // ── CASE 2: Has assessment history ─────────────────────────────────────
  return (
    <div className="space-y-6">
      {mode === "view" ? (
        /* ══════════════ VIEW MODE ══════════════ */
        <>
          {/* Hasil Analisis Terakhir */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Hasil Analisis Terakhir</p>
                <h2 className="mt-1 text-[18px] font-bold text-gray-900">
                  Assessment Keuangan
                </h2>
                <p className="mt-2 text-[13px] text-gray-500">
                  Assessment terakhir dilakukan pada{" "}
                  <span className="font-semibold text-gray-700">
                    {new Date(currentAssessment.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  .
                </p>
              </div>
              {score && (
                <div className="flex shrink-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-5 py-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-[20px] font-bold text-white"
                    style={{ backgroundColor: categoryColors[score.category] || "#0F4C9A" }}
                  >
                    {score.finalScore}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-gray-500">Kategori</p>
                    <p className="text-[14px] font-bold text-gray-900">{score.category}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Radar Chart */}
          {score && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Radar Chart Terakhir</p>
              <div className="flex items-center gap-2">
                <h3 className="mt-1 text-[15px] font-semibold text-gray-900">Visualisasi Skor Kesehatan</h3>
                <ScoringGuideButton />
              </div>
              <div className="mt-4">
                <HealthRadar
                  profitabilityScore={score.profitabilityScore}
                  liquidityScore={score.liquidityScore}
                  debtScore={score.debtScore}
                  growthScore={score.growthScore}
                />
              </div>
            </div>
          )}

          {/* Roadmap */}
          {roadmap && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Roadmap Keuangan Terakhir</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-gray-900">Rencana Aksi Keuangan</h3>
                    </div>
                    <ScoringGuideButton />
                  </div>
                </div>
                <Link href="/dashboard/roadmap-keuangan" className="text-[12px] font-semibold text-[#0F4C9A] hover:underline">
                  Lihat Lengkap →
                </Link>
              </div>

              {/* Progress */}
              {totalTasks > 0 && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-gray-600">Progress Tugas</span>
                    <span className="text-[14px] font-bold text-gray-900">{completionPercentage}%</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar
                      value={completionPercentage}
                      color={completionPercentage >= 80 ? "#37B24D" : completionPercentage >= 50 ? "#1E73D8" : "#D97706"}
                    />
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-gray-400">{completedTasks} dari {totalTasks} tugas selesai</p>
                </div>
              )}

              {/* Roadmap Cards */}
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "3 Bulan", value: roadmap.target3Months, color: "#1E73D8", icon: "🎯" },
                  { label: "6 Bulan", value: roadmap.target6Months, color: "#8B5CF6", icon: "📈" },
                  { label: "1 Tahun", value: roadmap.target1Year, color: "#37B24D", icon: "🏆" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px]" style={{ backgroundColor: item.color + "15", color: item.color }}>
                        {item.icon}
                      </div>
                      <p className="text-[12.5px] font-semibold text-gray-900">Target {item.label}</p>
                    </div>
                    <p className="mt-2.5 text-[12px] leading-relaxed text-gray-600">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Insights */}
          {score && insights.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Insight Ringkasan</p>
              <h3 className="mt-1 text-[15px] font-semibold text-gray-900">Temuan Utama</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {insights.map((insight, i) => (
                  <InsightCard key={i} {...insight} />
                ))}
              </div>
            </div>
          )}

          {/* CTA: Assessment Ulang */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 text-center">
            <h3 className="text-[17px] font-bold text-gray-900">Perbarui Analisis Keuangan Anda</h3>
            <p className="mt-2 text-[13px] text-gray-500 max-w-md mx-auto">
              Lakukan assessment ulang untuk mendapatkan analisis dan rekomendasi terbaru sesuai kondisi usaha Anda saat ini.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setMode("assessment")}
                className="inline-flex h-11 items-center rounded-xl bg-[#0F4C9A] px-6 text-[13px] font-semibold text-white hover:bg-[#0A3A75] transition-colors shadow-sm"
              >
                Lakukan Assessment Ulang
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ══════════════ ASSESSMENT MODE ══════════════ */
        <>
          {/* Assessment Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#1E73D8] p-8 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(55,178,77,0.15),transparent_50%)] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMode("view")}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-[22px] font-bold text-white">Assessment Keuangan Baru</h1>
                  <p className="mt-1 text-[13px] text-white/70">
                    Isi data keuangan terbaru Anda untuk mendapatkan analisis yang akurat.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Form + Cancel Button */}
          <div className="relative">
            <AssessmentWizard onSuccess={handleAssessmentSuccess} />

            {/* Cancel Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setMode("view")}
                className="inline-flex h-10 items-center rounded-xl border border-gray-300 bg-white px-5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
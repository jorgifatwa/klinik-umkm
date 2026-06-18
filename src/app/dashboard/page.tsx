import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { HealthRadar } from "@/components/charts/health-radar";
import { FinancialHealthScoreCard } from "@/components/financial-health-score-card";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function KPICard({ title, value, subtitle, icon, color, trend }: {
  title: string; value: string; subtitle?: string; icon: string; color: string; trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="kpi-card-icon" style={{ backgroundColor: color + "15" }}>
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-3 text-[13px] font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-[22px] font-bold text-gray-900 tracking-tight">{value}</p>
      {subtitle && <p className="mt-0.5 text-[11.5px] text-gray-400">{subtitle}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Silakan login untuk mengakses dashboard</h2>
          <p className="mt-2 text-sm text-slate-500">Gunakan akun Anda untuk melihat kesehatan keuangan usaha.</p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex h-10 items-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            Masuk ke Akun
          </Link>
        </div>
      </main>
    );
  }

  const profile = await prisma.businessProfile.findUnique({ where: { userId: user.id } });
  const latestAssessment = await prisma.financialAssessment.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { score: true, roadmap: true },
  });
  const nextConsultation = await prisma.consultation.findFirst({
    where: { userId: user.id, status: "CONFIRMED" },
    orderBy: { scheduledAt: "asc" },
  });

  const totalAssessments = await prisma.financialAssessment.count({ where: { userId: user.id } });
  const totalConsultations = await prisma.consultation.count({ where: { userId: user.id } });
  const score = latestAssessment?.score?.finalScore ?? 0;

  return (
    <AuthenticatedLayout
      title="Dashboard"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Hero Section — Two-Column Layout */}
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          {/* Left Column — Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#1E73D8] p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(55,178,77,0.15),transparent_50%)]" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Dashboard {"SUFIC'C"}</p>
              <h1 className="mt-2 text-[24px] sm:text-[26px] font-bold text-white">
                Halo, {user.name ?? "Pelaku UMKM"} 👋
              </h1>
              <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-relaxed text-white/55 max-w-md">
                Pantau kesehatan keuangan, roadmap, dan konsultasi Anda dalam satu tampilan.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {!profile && (
                  <Link
                    href="/dashboard/profil-usaha"
                    className="inline-flex h-9 items-center rounded-xl bg-white/15 px-4 text-[12.5px] font-semibold text-white backdrop-blur hover:bg-white/25 transition-colors"
                  >
                    Lengkapi Profil Usaha
                  </Link>
                )}
                <Link
                  href="/dashboard/financial-health"
                  className="inline-flex h-9 items-center rounded-xl bg-white/10 px-4 text-[12.5px] font-medium text-white/80 backdrop-blur hover:bg-white/20 hover:text-white transition-colors"
                >
                  Cek Kesehatan →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column — Financial Health Score KPI Card */}
          {latestAssessment?.score ? (
            <FinancialHealthScoreCard
              score={score}
              category={latestAssessment.score.category}
              size={110}
              strokeWidth={8}
              showLink
              linkHref="/dashboard/financial-health"
              linkLabel="Lihat Detail →"
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <svg className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="mt-3 text-[12.5px] font-medium text-gray-600">Belum ada skor</p>
              <p className="mt-0.5 text-[11px] text-gray-400">Mulai assessment untuk melihat skor.</p>
              <Link
                href="/dashboard/financial-health"
                className="mt-3 inline-flex h-8 items-center rounded-lg bg-[#0F4C9A] px-3.5 text-[11.5px] font-medium text-white hover:bg-[#0A3A75] transition-colors"
              >
                Mulai Assessment
              </Link>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Skor Kesehatan"
            value={score > 0 ? `${score}` : "-"}
            subtitle={latestAssessment?.score?.category || "Belum ada data"}
            icon="♥"
            color="#37B24D"
          />
          <KPICard
            title="Omset Bulanan"
            value={profile ? formatCurrency(profile.monthlyRevenue) : "-"}
            subtitle={profile?.industry || "Lengkapi profil"}
            icon="↗"
            color="#1E73D8"
            trend={profile ? { value: "+12%", positive: true } : undefined}
          />
          <KPICard
            title="Total Assessment"
            value={`${totalAssessments}`}
            subtitle="Kali melakukan pengecekan"
            icon="◎"
            color="#0F4C9A"
          />
          <KPICard
            title="Konsultasi"
            value={`${totalConsultations}`}
            subtitle={nextConsultation ? "Jadwal berikutnya ada" : "Belum ada jadwal"}
            icon="◇"
            color="#8B5CF6"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Financial Health Score */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Financial Health Score</p>
                {latestAssessment?.score && (
                  <p className="mt-1 text-[11px] text-gray-400">Terakhir diperbarui: {new Date(latestAssessment.createdAt).toLocaleDateString("id-ID")}</p>
                )}
              </div>
              <Link href="/dashboard/financial-health" className="text-[12px] font-semibold text-[#0F4C9A] hover:underline">
                → Detail
              </Link>
            </div>
            {latestAssessment?.score ? (
              <div className="mt-5 space-y-4">
                {[
                  { label: "Profitability", value: latestAssessment.score.profitabilityScore, color: "#37B24D" },
                  { label: "Liquidity", value: latestAssessment.score.liquidityScore, color: "#1E73D8" },
                  { label: "Debt Management", value: latestAssessment.score.debtScore, color: "#8B5CF6" },
                  { label: "Growth", value: latestAssessment.score.growthScore, color: "#D97706" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-medium text-gray-600">{item.label}</span>
                      <span className="text-[12.5px] font-bold text-gray-900">{item.value}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-[13px] font-medium text-gray-600">Belum ada assessment</p>
                <p className="mt-1 text-[11.5px] text-gray-400">Isi cek kesehatan untuk melihat skor.</p>
                <Link href="/dashboard/financial-health" className="mt-4 inline-flex h-9 items-center rounded-xl bg-[#0F4C9A] px-4 text-[12px] font-medium text-white hover:bg-[#0A3A75] transition-colors">
                  Mulai Assessment
                </Link>
              </div>
            )}
          </div>

          {/* Radar Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Radar Skor</p>
            {latestAssessment?.score ? (
              <div className="mt-4">
                <HealthRadar
                  profitabilityScore={latestAssessment.score.profitabilityScore}
                  liquidityScore={latestAssessment.score.liquidityScore}
                  debtScore={latestAssessment.score.debtScore}
                  growthScore={latestAssessment.score.growthScore}
                />
              </div>
            ) : (
              <div className="mt-5 flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
                <p className="text-[12.5px] text-gray-400">Belum ada data</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Profile & Consultation */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Business Profile */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Profil Usaha</p>
              {profile && (
                <Link href="/dashboard/profil-usaha" className="text-[12px] font-semibold text-[#0F4C9A] hover:underline">Edit →</Link>
              )}
            </div>
            {profile ? (
              <div className="mt-5 space-y-3">
                <h3 className="text-[17px] font-bold text-gray-900">{profile.businessName}</h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {[
                    { label: "Jenis Usaha", value: profile.industry },
                    { label: "Lokasi", value: profile.location },
                    { label: "Karyawan", value: `${profile.employeeCount} orang` },
                    { label: "WhatsApp", value: profile.whatsapp || "-" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-gray-50 px-3.5 py-2.5">
                      <p className="text-[10.5px] font-medium text-gray-400">{item.label}</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-[13px] font-medium text-gray-600">Belum ada profil usaha</p>
                <p className="mt-1 text-[11.5px] text-gray-400">Lengkapi profil untuk memulai.</p>
                <Link href="/dashboard/profil-usaha" className="mt-4 inline-flex h-9 items-center rounded-xl bg-[#0F4C9A] px-4 text-[12px] font-medium text-white hover:bg-[#0A3A75] transition-colors">
                  Buat Profil
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Consultation */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Konsultasi</p>
              <Link href="/dashboard/konsultasi" className="text-[12px] font-semibold text-[#0F4C9A] hover:underline">Lihat Semua →</Link>
            </div>
            {nextConsultation ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-gray-900">
                      {new Date(nextConsultation.scheduledAt).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-gray-500">
                      {new Date(nextConsultation.scheduledAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <span className="mt-2 inline-flex items-center rounded-lg bg-emerald-100 px-2.5 py-0.5 text-[10.5px] font-semibold text-emerald-700">
                      Dikonfirmasi
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-[13px] font-medium text-gray-600">Belum ada jadwal konsultasi</p>
                <p className="mt-1 text-[11.5px] text-gray-400">Jadwalkan konsultasi dengan konsultan.</p>
                <Link href="/dashboard/konsultasi" className="mt-4 inline-flex h-9 items-center rounded-xl bg-[#0F4C9A] px-4 text-[12px] font-medium text-white hover:bg-[#0A3A75] transition-colors">
                  Jadwalkan
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Roadmap Progress */}
        {latestAssessment?.roadmap && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Roadmap Keuangan</p>
              <Link href="/dashboard/roadmap-keuangan" className="text-[12px] font-semibold text-[#0F4C9A] hover:underline">Lihat Roadmap →</Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { label: "3 Bulan", value: latestAssessment.roadmap.target3Months, color: "#1E73D8" },
                { label: "6 Bulan", value: latestAssessment.roadmap.target6Months, color: "#8B5CF6" },
                { label: "1 Tahun", value: latestAssessment.roadmap.target1Year, color: "#37B24D" },
              ].map((item, i) => (
                <div key={item.label} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ backgroundColor: item.color }}>
                      {i + 1}
                    </div>
                    <p className="text-[12.5px] font-semibold text-gray-900">Target {item.label}</p>
                  </div>
                  <p className="mt-2.5 text-[12px] leading-relaxed text-gray-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Aksi Cepat</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {[
                { href: "/dashboard/financial-health", label: "Cek Kesehatan", icon: "◎", color: "#37B24D" },
                { href: "/dashboard/kalkulator", label: "Kalkulator", icon: "⊞", color: "#1E73D8" },
                { href: "/dashboard/artikel", label: "Baca Artikel", icon: "☰", color: "#0F4C9A" },
                { href: "/dashboard/forum", label: "Forum Diskusi", icon: "💬", color: "#8B5CF6" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[15px]" style={{ backgroundColor: action.color + "12", color: action.color }}>
                    {action.icon}
                  </div>
                  <span className="text-[12.5px] font-semibold text-gray-700 group-hover:text-gray-900">{action.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity / Insights */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Insight Keuangan</p>
            <div className="mt-4 space-y-3">
              {latestAssessment?.score ? (
                <>
                  {(latestAssessment.score as unknown as { category: string }).category === "Sangat Sehat" || (latestAssessment.score as unknown as { category: string }).category === "Sehat" ? (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-[12.5px] font-semibold text-emerald-700">✨ Kondisi keuangan Anda dalam kondisi baik</p>
                      <p className="mt-1 text-[11.5px] text-emerald-600/70">Pertahankan kinerja dan pertimbangkan ekspansi bertahap.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                      <p className="text-[12.5px] font-semibold text-amber-700">⚠️ Perhatian: Kondisi keuangan perlu perbaikan</p>
                      <p className="mt-1 text-[11.5px] text-amber-600/70">Lakukan konsultasi untuk mendapatkan rekomendasi perbaikan.</p>
                    </div>
                  )}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-[12px] font-medium text-gray-700">Rekomendasi Hari Ini</p>
                    <ul className="mt-2 space-y-1.5">
                      <li className="flex items-start gap-2 text-[11.5px] text-gray-600">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C9A]" />
                        Review laporan keuangan bulanan secara rutin
                      </li>
                      <li className="flex items-start gap-2 text-[11.5px] text-gray-600">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E73D8]" />
                        Siapkan dokumen untuk sesi konsultasi berikutnya
                      </li>
                      <li className="flex items-start gap-2 text-[11.5px] text-gray-600">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#37B24D]" />
                        Baca artikel edukasi tentang pengelolaan kas
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="rounded-xl bg-gray-50 p-6 text-center">
                  <p className="text-[12.5px] text-gray-500">Mulai assessment untuk mendapatkan insight keuangan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
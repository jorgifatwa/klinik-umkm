import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { FinancialHealthScoreCard } from "@/components/financial-health-score-card";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
    </div>
  );
}

export default async function RoadmapKeuanganPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Silakan login untuk melihat roadmap</h2>
          <p className="mt-2 text-sm text-slate-500">Lakukan assessment terlebih dahulu untuk mendapatkan roadmap keuangan.</p>
          <Link href="/auth/login" className="mt-6 inline-flex h-10 items-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors">
            Masuk ke Akun
          </Link>
        </div>
      </main>
    );
  }

  const latestAssessment = await prisma.financialAssessment.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { score: true, roadmap: { include: { tasks: true } } },
  });

  const profile = await prisma.businessProfile.findUnique({ where: { userId: user.id } });

  const roadmap = latestAssessment?.roadmap;
  const score = latestAssessment?.score;

  // Calculate completion percentage
  const totalTasks = roadmap?.tasks.length ?? 0;
  const completedTasks = roadmap?.tasks.filter((t) => t.completed).length ?? 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks by time period (split tasks roughly into 3 periods)
  const tasks = roadmap?.tasks ?? [];
  const periodSize = Math.ceil(tasks.length / 3);
  const tasks3Months = tasks.slice(0, periodSize);
  const tasks6Months = tasks.slice(periodSize, periodSize * 2);
  const tasks1Year = tasks.slice(periodSize * 2);

  return (
    <AuthenticatedLayout
      title="Roadmap Keuangan"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Roadmap Keuangan" }]}
    >
      <div className="space-y-6">
        {!roadmap ? (
          /* No Roadmap State */
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#37B24D] p-8 sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(55,178,77,0.15),transparent_50%)]" />
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h1 className="mt-5 text-[24px] font-bold text-white">Roadmap Keuangan UMKM</h1>
                <p className="mt-3 text-[14px] leading-relaxed text-white/70 max-w-lg mx-auto">
                  Rencana aksi keuangan terstruktur untuk membantu bisnis Anda tumbuh secara berkelanjutan.
                </p>
              </div>
            </div>

            {/* No Data Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                <svg className="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="mt-5 text-[17px] font-bold text-gray-900">Belum Ada Roadmap</h3>
              <p className="mt-2 text-[13px] text-gray-500 max-w-md mx-auto">
                Anda perlu melakukan assessment kesehatan keuangan terlebih dahulu untuk mendapatkan roadmap keuangan yang personal.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href="/dashboard/financial-health"
                  className="inline-flex h-10 items-center rounded-xl bg-[#0F4C9A] px-5 text-[13px] font-semibold text-white hover:bg-[#0A3A75] transition-colors"
                >
                  Mulai Assessment
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center rounded-xl border border-gray-200 px-5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Kembali ke Dashboard
                </Link>
              </div>
            </div>

            {/* Feature Preview */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: "🎯", title: "Target 3 Bulan", desc: "Quick wins dan perbaikan segera untuk kondisi keuangan Anda.", color: "#1E73D8" },
                { icon: "📈", title: "Target 6 Bulan", desc: "Strategi pertumbuhan dan optimalisasi arus kas.", color: "#8B5CF6" },
                { icon: "🏆", title: "Target 1 Tahun", desc: "Pencapaian jangka panjang dan keberlanjutan bisnis.", color: "#37B24D" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-[18px]" style={{ backgroundColor: item.color + "12" }}>
                    {item.icon}
                  </div>
                  <h4 className="mt-3 text-[14px] font-bold text-gray-900">{item.title}</h4>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Roadmap Content */
          <>
            {/* Roadmap Overview — two-column layout */}
            <div className="grid items-start gap-5 lg:grid-cols-[1fr_280px]">
              {/* Left Column — Gradient Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#37B24D] p-7 sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(55,178,77,0.15),transparent_50%)] pointer-events-none" />
                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">Ringkasan Roadmap</p>
                  <h1 className="mt-2 text-[24px] font-bold text-white leading-tight">
                    Roadmap Keuangan {user.name ?? "UMKM"}
                  </h1>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-white/60 max-w-lg">
                    Rencana aksi personal untuk meningkatkan kesehatan keuangan bisnis Anda berdasarkan hasil assessment.
                  </p>
                  {/* Financial metric badges — inline score factors as part of left summary */}
                  {score && (
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                      {[
                        { label: "Profitabilitas", value: score.profitabilityScore, color: "#37B24D" },
                        { label: "Likuiditas", value: score.liquidityScore, color: "#1E73D8" },
                        { label: "Utang", value: score.debtScore, color: "#8B5CF6" },
                        { label: "Pertumbuhan", value: score.growthScore, color: "#D97706" },
                      ].map((item) => (
                        <div key={item.label} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1">
                          <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-[11.5px] text-white/80">
                            <span className="text-white font-medium">{item.value}</span>
                            <span className="text-white/50 ml-1 hidden sm:inline">{item.label}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column — Financial Health Score Card (exact same component as Dashboard) */}
              {score && (
                <FinancialHealthScoreCard
                  score={score.finalScore}
                  category={score.category}
                  size={110}
                  strokeWidth={8}
                  showLink
                  linkHref="/dashboard/financial-health"
                  linkLabel="Lihat Detail →"
                />
              )}
            </div>

            {/* Overall Progress */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Progress Keseluruhan</p>
                  <p className="mt-1 text-[13px] text-gray-500">{completedTasks} dari {totalTasks} tugas selesai</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[28px] font-extrabold text-gray-900">{completionPercentage}%</span>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={completionPercentage} color={completionPercentage >= 80 ? "#37B24D" : completionPercentage >= 50 ? "#1E73D8" : "#D97706"} />
              </div>
              {completionPercentage === 100 && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-emerald-700">Selamat! Semua tugas telah selesai! 🎉</p>
                    <p className="text-[11.5px] text-emerald-600/70">Pertahankan pencapaian Anda dan pertimbangkan assessment ulang.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Target Cards Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Target 3 Bulan */}
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="border-b border-gray-100 bg-gradient-to-r from-[#1E73D8] to-[#3B82F6] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-[13px] font-bold text-white">1</div>
                    <div>
                      <h3 className="text-[15px] font-bold text-white">Target 3 Bulan</h3>
                      <p className="text-[11px] text-white/70">Quick Wins</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[13px] leading-relaxed text-gray-700">{roadmap.target3Months}</p>
                  {tasks3Months.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {tasks3Months.map((task) => (
                        <div key={task.id} className="flex items-start gap-2.5 rounded-lg border border-gray-100 p-3">
                          <div className="mt-0.5">
                            <input type="checkbox" checked={task.completed} readOnly className="h-4 w-4 rounded border-gray-300 accent-[#1E73D8]" />
                          </div>
                          <span className={`text-[12.5px] ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Target 6 Bulan */}
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="border-b border-gray-100 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-[13px] font-bold text-white">2</div>
                    <div>
                      <h3 className="text-[15px] font-bold text-white">Target 6 Bulan</h3>
                      <p className="text-[11px] text-white/70">Strategi Pertumbuhan</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[13px] leading-relaxed text-gray-700">{roadmap.target6Months}</p>
                  {tasks6Months.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {tasks6Months.map((task) => (
                        <div key={task.id} className="flex items-start gap-2.5 rounded-lg border border-gray-100 p-3">
                          <div className="mt-0.5">
                            <input type="checkbox" checked={task.completed} readOnly className="h-4 w-4 rounded border-gray-300 accent-[#8B5CF6]" />
                          </div>
                          <span className={`text-[12.5px] ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Target 1 Tahun */}
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <div className="border-b border-gray-100 bg-gradient-to-r from-[#37B24D] to-[#4ADE80] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-[13px] font-bold text-white">3</div>
                    <div>
                      <h3 className="text-[15px] font-bold text-white">Target 1 Tahun</h3>
                      <p className="text-[11px] text-white/70">Keberlanjutan</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[13px] leading-relaxed text-gray-700">{roadmap.target1Year}</p>
                  {tasks1Year.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {tasks1Year.map((task) => (
                        <div key={task.id} className="flex items-start gap-2.5 rounded-lg border border-gray-100 p-3">
                          <div className="mt-0.5">
                            <input type="checkbox" checked={task.completed} readOnly className="h-4 w-4 rounded border-gray-300 accent-[#37B24D]" />
                          </div>
                          <span className={`text-[12.5px] ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendation Cards */}
            {score && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Rekomendasi Berdasarkan Skor</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {score.profitabilityScore < 60 && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px]">💰</span>
                        <p className="text-[13px] font-semibold text-amber-700">Tingkatkan Profitabilitas</p>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-amber-600/80">
                        Review harga jual dan optimalkan struktur biaya. Pertimbangkan diversifikasi produk untuk meningkatkan margin.
                      </p>
                    </div>
                  )}
                  {score.liquidityScore < 60 && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px]">💧</span>
                        <p className="text-[13px] font-semibold text-blue-700">Perbaiki Likuiditas</p>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-blue-600/80">
                        Siapkan cadangan kas 3-6 bulan pengeluaran. Percepat penagihan piutang dan optimalkan persediaan.
                      </p>
                    </div>
                  )}
                  {score.debtScore < 60 && (
                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px]">📊</span>
                        <p className="text-[13px] font-semibold text-purple-700">Kelola Utang Lebih Baik</p>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-purple-600/80">
                        Buat rencana pembayaran utang secara terstruktur. Prioritaskan utang dengan bunga tertinggi.
                      </p>
                    </div>
                  )}
                  {score.growthScore < 60 && (
                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px]">🌱</span>
                        <p className="text-[13px] font-semibold text-orange-700">Percepat Pertumbuhan</p>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-orange-600/80">
                        Eksplorasi pasar baru dan kanal penjualan digital. Investasikan sebagian keuntungan untuk ekspansi.
                      </p>
                    </div>
                  )}
                  {score.finalScore >= 80 && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px]">✨</span>
                        <p className="text-[13px] font-semibold text-emerald-700">Kondisi Keuangan Sangat Baik!</p>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-emerald-600/80">
                        Pertahankan performa keuangan Anda! Pertimbangkan untuk melakukan ekspansi bisnis, diversifikasi investasi, atau membuka cabang baru.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business Profile Context */}
            {profile && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Konteks Usaha</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  {[
                    { label: "Nama Usaha", value: profile.businessName },
                    { label: "Jenis Usaha", value: profile.industry },
                    { label: "Omset/Bulan", value: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(profile.monthlyRevenue) },
                    { label: "Lokasi", value: profile.location },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-gray-50 px-3.5 py-2.5">
                      <p className="text-[10.5px] font-medium text-gray-400">{item.label}</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Aksi Terkait</p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {[
                  { href: "/dashboard/financial-health", label: "Assessment Ulang", icon: "◎", color: "#37B24D" },
                  { href: "/dashboard/konsultasi", label: "Konsultasi", icon: "💬", color: "#8B5CF6" },
                  { href: "/dashboard/artikel", label: "Baca Artikel", icon: "☰", color: "#0F4C9A" },
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
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
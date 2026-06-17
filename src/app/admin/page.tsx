import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Anda tidak memiliki akses admin.</p>
        </div>
      </main>
    );
  }

  const totalUMKM = await prisma.user.count({ where: { role: "UMKM" } });
  const totalConsultants = await prisma.user.count({ where: { role: "KONSULTAN" } });
  const totalConsultations = await prisma.consultation.count();
  const totalArticles = await prisma.article.count();
  const totalForumTopics = await prisma.forumTopic.count();
  const avgScoreResult = await prisma.financialScore.aggregate({
    _avg: { finalScore: true },
  });
  const activeUsers = await prisma.user.count({
    where: { role: { in: ["UMKM", "KONSULTAN"] } },
  });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const recentConsultations = await prisma.consultation.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true, consultant: true },
  });

  const avgScore = avgScoreResult._avg.finalScore ? avgScoreResult._avg.finalScore.toFixed(1) : "-";

  return (
    <AuthenticatedLayout
      title="Admin Dashboard"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Admin" }]}
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#DC2626] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.12),transparent_50%)]" />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-white/50">Admin Control Center</p>
            <h1 className="mt-2 text-[26px] font-bold text-white">
              Halo, {user.name ?? "Admin"} ⚡
            </h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/60 max-w-lg">
              Pantau seluruh aktivitas platform, kelola pengguna, dan analisis performa sistem.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div className="kpi-card-icon" style={{ backgroundColor: "#0F4C9A15" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F4C9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">+18%</span>
            </div>
            <p className="mt-3 text-[13px] font-medium text-gray-500">Total UMKM</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900">{totalUMKM}</p>
            <p className="mt-0.5 text-[11.5px] text-gray-400">Pengguna terdaftar</p>
          </div>
          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div className="kpi-card-icon" style={{ backgroundColor: "#8B5CF615" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-[13px] font-medium text-gray-500">Total Konsultan</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900">{totalConsultants}</p>
            <p className="mt-0.5 text-[11.5px] text-gray-400">Konsultan aktif</p>
          </div>
          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div className="kpi-card-icon" style={{ backgroundColor: "#37B24D15" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#37B24D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-[13px] font-medium text-gray-500">Total Konsultasi</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900">{totalConsultations}</p>
            <p className="mt-0.5 text-[11.5px] text-gray-400">Sesi konsultasi</p>
          </div>
          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div className="kpi-card-icon" style={{ backgroundColor: "#1E73D815" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E73D8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-[13px] font-medium text-gray-500">Rata-rata Skor</p>
            <p className="mt-1 text-[22px] font-bold text-gray-900">{avgScore}</p>
            <p className="mt-0.5 text-[11.5px] text-gray-400">Skor kesehatan rata-rata</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="kpi-card flex items-center gap-4">
            <div className="kpi-card-icon" style={{ backgroundColor: "#10B98115" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500">Active Users</p>
              <p className="text-[18px] font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
          <div className="kpi-card flex items-center gap-4">
            <div className="kpi-card-icon" style={{ backgroundColor: "#F59E0B15" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500">Artikel</p>
              <p className="text-[18px] font-bold text-gray-900">{totalArticles}</p>
            </div>
          </div>
          <div className="kpi-card flex items-center gap-4">
            <div className="kpi-card-icon" style={{ backgroundColor: "#EC489915" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500">Forum Topics</p>
              <p className="text-[18px] font-bold text-gray-900">{totalForumTopics}</p>
            </div>
          </div>
        </div>

        {/* Recent Data Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <p className="text-[13px] font-semibold text-gray-900">Pengguna Terbaru</p>
              <Link href="/admin/users" className="text-[12px] font-semibold text-[#0F4C9A] hover:underline">Lihat Semua →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentUsers.length > 0 ? recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
                    {u.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold text-gray-900">{u.name || "User"}</p>
                    <p className="truncate text-[11px] text-gray-400">{u.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    u.role === "ADMIN" ? "bg-rose-50 text-rose-600" :
                    u.role === "KONSULTAN" ? "bg-amber-50 text-amber-600" :
                    "bg-blue-50 text-blue-600"
                  }`}>
                    {u.role}
                  </span>
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-[12.5px] text-gray-400">Belum ada pengguna</div>
              )}
            </div>
          </div>

          {/* Recent Consultations */}
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <p className="text-[13px] font-semibold text-gray-900">Konsultasi Terbaru</p>
              <Link href="/admin/consultations" className="text-[12px] font-semibold text-[#0F4C9A] hover:underline">Lihat Semua →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentConsultations.length > 0 ? recentConsultations.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    c.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-600" :
                    c.status === "COMPLETED" ? "bg-gray-100 text-gray-600" :
                    c.status === "CANCELLED" ? "bg-red-100 text-red-600" :
                    "bg-amber-100 text-amber-600"
                  }`}>
                    {c.status.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold text-gray-900">{c.user.name || "User"}</p>
                    <p className="truncate text-[11px] text-gray-400">
                      {new Date(c.scheduledAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    c.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600" :
                    c.status === "COMPLETED" ? "bg-gray-100 text-gray-600" :
                    c.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                    "bg-amber-50 text-amber-600"
                  }`}>
                    {c.status}
                  </span>
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-[12.5px] text-gray-400">Belum ada konsultasi</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Administrasi</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/admin/users", label: "User Management", icon: "👥", color: "#0F4C9A" },
              { href: "/admin/consultants", label: "Konsultan", icon: "📚", color: "#8B5CF6" },
              { href: "/admin/articles", label: "Kelola Artikel", icon: "📄", color: "#37B24D" },
              { href: "/admin/consultations", label: "Forum Moderation", icon: "💬", color: "#1E73D8" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3.5 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[15px]" style={{ backgroundColor: link.color + "12" }}>
                  {link.icon}
                </div>
                <span className="text-[12.5px] font-semibold text-gray-700 group-hover:text-gray-900">{link.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
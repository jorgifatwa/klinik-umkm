"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Star,
  Activity,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface KpiData {
  totalKonsultasi: number;
  konsultasiAktif: number;
  umkmDampingan: number;
  tingkatPenyelesaian: number;
}

interface TrendData {
  labels: string[];
  total: number[];
  completed: number[];
}

interface StatusBreakdown {
  selesai: number;
  berjalan: number;
  dijadwalkan: number;
  dibatalkan: number;
}

interface TopUmkm {
  id: string;
  name: string;
  email: string;
  totalSessions: number;
}

interface UpcomingConsultation {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: string;
}

interface RecentActivity {
  id: string;
  type: string;
  clientName: string;
  timestamp: string;
  status: string;
}

interface DashboardData {
  kpi: KpiData;
  trends: TrendData;
  statusBreakdown: StatusBreakdown;
  topUmkm: TopUmkm[];
  upcomingConsultations: UpcomingConsultation[];
  recentActivity: RecentActivity[];
  insights: string[];
  recentClients: {
    id: string;
    name: string;
    email: string;
    status: string;
    date: string;
  }[];
}

const STATUS_COLORS = {
  PENDING: "#F59E0B",
  CONFIRMED: "#3B82F6",
  COMPLETED: "#10B981",
  CANCELLED: "#EF4444",
};

const STATUS_BG = {
  PENDING: "#FFFBEB",
  CONFIRMED: "#EFF6FF",
  COMPLETED: "#ECFDF5",
  CANCELLED: "#FEF2F2",
};

const DONUT_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

function formatCurrency(value: number): string {
  if (value >= 1000000) return `Rp${(value / 1000000).toFixed(1)}Jt`;
  if (value >= 1000) return `Rp${(value / 1000).toFixed(0)}Rb`;
  return `Rp${value}`;
}

function timeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  return then.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function ConsultantPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/consultant/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((dashboardData) => {
        if (dashboardData) {
          setData(dashboardData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const user = session?.user;
  const userName = user?.name || "Konsultan";

  if (loading) {
    return (
      <AuthenticatedLayout title="Dashboard" breadcrumbs={[{ label: "Home", href: "/consultant" }, { label: "Dashboard" }]}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4C9A]"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!data) {
    return (
      <AuthenticatedLayout title="Dashboard" breadcrumbs={[{ label: "Home", href: "/consultant" }, { label: "Dashboard" }]}>
        <div className="text-center py-20 text-gray-500">Gagal memuat data dashboard.</div>
      </AuthenticatedLayout>
    );
  }

  const { kpi, trends, statusBreakdown, topUmkm, upcomingConsultations, recentActivity, insights } = data;

  const statusDonutData = [
    { name: "Selesai", value: statusBreakdown.selesai, color: DONUT_COLORS[0] },
    { name: "Berjalan", value: statusBreakdown.berjalan, color: DONUT_COLORS[1] },
    { name: "Dijadwalkan", value: statusBreakdown.dijadwalkan, color: DONUT_COLORS[2] },
    { name: "Dibatalkan", value: statusBreakdown.dibatalkan, color: DONUT_COLORS[3] },
  ].filter((item) => item.value > 0);

  const totalStatus = statusDonutData.reduce((sum, item) => sum + item.value, 0);

  const trendChartData = trends.labels.map((label, i) => ({
    month: label,
    total: trends.total[i],
    completed: trends.completed[i],
  }));

  const maxTrendValue = Math.max(...trends.total, 1);

  return (
    <AuthenticatedLayout
      title="Dashboard"
      breadcrumbs={[{ label: "Home", href: "/consultant" }, { label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#8B5CF6] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-white/50">Konsultan Dashboard</p>
            <h1 className="mt-2 text-[26px] font-bold text-white">
              Selamat datang, {userName} 🎯
            </h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/60 max-w-lg">
              Kelola jadwal konsultasi, pantau klien, dan berikan yang terbaik untuk UMKM.
            </p>
          </div>
        </div>

        {/* SECTION 1: Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Konsultasi */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#0F4C9A]">
                <Activity className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                Aktif
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[28px] font-bold text-slate-900 tracking-tight">{kpi.totalKonsultasi}</p>
              <p className="mt-1 text-[13px] text-slate-500">Total Konsultasi</p>
            </div>
          </div>

          {/* Konsultasi Aktif */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                Berlangsung
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[28px] font-bold text-slate-900 tracking-tight">{kpi.konsultasiAktif}</p>
              <p className="mt-1 text-[13px] text-slate-500">Konsultasi Aktif</p>
            </div>
          </div>

          {/* UMKM Dampingan */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-[11px] font-semibold text-purple-700">
                Klien
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[28px] font-bold text-slate-900 tracking-tight">{kpi.umkmDampingan}</p>
              <p className="mt-1 text-[13px] text-slate-500">UMKM Dampingan</p>
            </div>
          </div>

          {/* Tingkat Penyelesaian */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              {kpi.tingkatPenyelesaian >= 80 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                  <TrendingUp className="h-3 w-3" />
                  Baik
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                  <AlertCircle className="h-3 w-3" />
                  Perlu Perhatian
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-[28px] font-bold text-slate-900 tracking-tight">{kpi.tingkatPenyelesaian}%</p>
              <p className="mt-1 text-[13px] text-slate-500">Tingkat Penyelesaian</p>
            </div>
          </div>
        </div>

        {/* Insight Card */}
        {insights.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Star className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-bold text-slate-900">Insight</h3>
                <div className="mt-2 space-y-1.5">
                  {insights.map((insight, idx) => (
                    <p key={idx} className="text-[13px] leading-relaxed text-slate-600">
                      {insight}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Main Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tren Konsultasi - Line Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Tren Konsultasi</h3>
                <p className="mt-1 text-[12px] text-slate-500">6 bulan terakhir</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0F4C9A]" />
                  Total
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Selesai
                </div>
              </div>
            </div>
            <div className="mt-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "12px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                    labelStyle={{ fontSize: 12, fontWeight: 600, color: "#1E293B", marginBottom: 4 }}
                    itemStyle={{ fontSize: 12, padding: "2px 0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#0F4C9A"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#0F4C9A", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                    name="Selesai"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Konsultasi - Donut Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <div className="mb-4">
              <h3 className="text-[15px] font-bold text-slate-900">Status Konsultasi</h3>
              <p className="mt-1 text-[12px] text-slate-500">Distribusi status</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #E2E8F0",
                        borderRadius: "12px",
                        padding: "10px 12px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                      }}
                      formatter={(value, name) => {
                        const numValue = typeof value === 'number' ? value : 0;
                        return [
                          <span key={name} className="text-[13px] font-semibold text-slate-900">{numValue} ({totalStatus > 0 ? Math.round((numValue / totalStatus) * 100) : 0}%)</span>,
                          <span key={`label-${name}`} className="text-[12px] text-slate-500">{name}</span>,
                        ];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-4 w-full space-y-2.5">
                {statusDonutData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[13px] text-slate-600">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-slate-900">{item.value}</span>
                      <span className="text-[11px] text-slate-400 w-10 text-right">
                        {totalStatus > 0 ? Math.round((item.value / totalStatus) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Top UMKM Dampingan */}
        {topUmkm.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Top UMKM Dampingan</h3>
                <p className="mt-1 text-[12px] text-slate-500">Berdasarkan jumlah sesi konsultasi</p>
              </div>
              <Link
                href="/consultant/clients"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F4C9A] hover:text-[#0A3A75] transition-colors"
              >
                Lihat Semua
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {topUmkm.slice(0, 7).map((umkm, idx) => {
                const percentage = totalStatus > 0 ? (umkm.totalSessions / topUmkm[0].totalSessions) * 100 : 0;
                return (
                  <div key={umkm.id} className="group flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-600">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="truncate text-[13px] font-semibold text-slate-900">{umkm.name}</p>
                        <span className="text-[12px] font-semibold text-slate-700">{umkm.totalSessions} sesi</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0F4C9A] to-[#1E73D8] transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4 & 5: Upcoming Consultations + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Consultations */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Jadwal Konsultasi</h3>
                <p className="mt-1 text-[12px] text-slate-500">7 hari ke depan</p>
              </div>
              <Link
                href="/consultant/konsultasi"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F4C9A] hover:text-[#0A3A75] transition-colors"
              >
                Lihat Semua
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {upcomingConsultations.length > 0 ? (
                upcomingConsultations.map((consultation) => {
                  const statusColor = STATUS_COLORS[consultation.status as keyof typeof STATUS_COLORS] || "#6B7280";
                  const statusBg = STATUS_BG[consultation.status as keyof typeof STATUS_BG] || "#F9FAFB";
                  const statusLabel =
                    consultation.status === "PENDING" ? "Menunggu" :
                    consultation.status === "CONFIRMED" ? "Dikonfirmasi" :
                    consultation.status === "COMPLETED" ? "Selesai" : "Dibatalkan";

                  return (
                    <div
                      key={consultation.id}
                      className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
                    >
                      {/* Avatar */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F4C9A] to-[#1E73D8] text-[13px] font-bold text-white">
                        {consultation.clientName.charAt(0).toUpperCase()}
                      </div>
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-slate-900">{consultation.clientName}</p>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(consultation.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {consultation.time}
                          </span>
                        </div>
                      </div>
                      {/* Status Badge */}
                      <span
                        className="shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
                        style={{ backgroundColor: statusBg, color: statusColor }}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center">
                  <Calendar className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-[13px] text-slate-400">Tidak ada jadwal konsultasi minggu ini</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <div className="mb-4">
              <h3 className="text-[15px] font-bold text-slate-900">Aktivitas Terbaru</h3>
              <p className="mt-1 text-[12px] text-slate-500">Timeline konsultasi terkini</p>
            </div>
            <div className="relative">
              {recentActivity.length > 0 ? (
                <div className="space-y-0">
                  {recentActivity.map((activity, idx) => {
                    const isLast = idx === recentActivity.length - 1;
                    const statusColor = STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS] || "#6B7280";
                    const icon =
                      activity.status === "COMPLETED" ? <CheckCircle2 className="h-4 w-4" style={{ color: statusColor }} /> :
                      activity.status === "CONFIRMED" ? <Clock className="h-4 w-4" style={{ color: statusColor }} /> :
                      activity.status === "CANCELLED" ? <XCircle className="h-4 w-4" style={{ color: statusColor }} /> :
                      <Calendar className="h-4 w-4" style={{ color: statusColor }} />;

                    return (
                      <div key={activity.id} className="relative flex gap-4 pb-5">
                        {/* Timeline line */}
                        {!isLast && (
                          <div className="absolute left-[15px] top-[28px] h-full w-px bg-slate-100" />
                        )}
                        {/* Icon */}
                        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200">
                          {icon}
                        </div>
                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <p className="text-[13px] font-semibold text-slate-900">{activity.type}</p>
                          <p className="mt-0.5 text-[12px] text-slate-500">{activity.clientName}</p>
                          <p className="mt-1 text-[11px] text-slate-400">{timeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <Activity className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-[13px] text-slate-400">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/consultant/konsultasi" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-slate-900">Konsultasi</p>
                <p className="text-[11px] text-slate-400">Lihat & kelola jadwal</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
            </div>
          </Link>
          <Link href="/consultant/clients" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-slate-900">Klien</p>
                <p className="text-[11px] text-slate-400">Pantau klien UMKM</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
            </div>
          </Link>
          <Link href="/consultant/profile" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
                <Star className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-slate-900">Profil</p>
                <p className="text-[11px] text-slate-400">Edit profil konsultan</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
            </div>
          </Link>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
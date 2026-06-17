"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";

interface TrendData {
  labels: string[];
  total: number[];
  completed: number[];
}

interface RecentClient {
  id: string;
  name: string;
  email: string;
  status: string;
  date: string;
}

export default function ConsultantPage() {
  const { data: session } = useSession();
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/consultant/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setTrends(data.trends);
          setRecentClients(data.recentClients);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxTrend = trends ? Math.max(...trends.total, 1) : 1;

  const user = session?.user;
  const userName = user?.name || "Konsultan";

  return (
    <AuthenticatedLayout
      title="Panel Konsultan"
      breadcrumbs={[{ label: "Home", href: "/consultant" }, { label: "Konsultan" }]}
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

        {/* Trend Chart */}
        {trends && trends.labels.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-[15px] font-bold text-gray-900">Tren Konsultasi 6 Bulan</h3>
            <div className="mt-6">
              <div className="flex items-end gap-2" style={{ height: "140px" }}>
                {trends.labels.map((label, i) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center justify-end" style={{ height: "120px" }}>
                      <div
                        className="w-full max-w-[32px] rounded-t-md bg-[#0F4C9A] transition-all"
                        style={{ height: `${(trends.total[i] / maxTrend) * 100}%`, opacity: 0.7 }}
                        title={`Total: ${trends.total[i]}`}
                      />
                      <div
                        className="w-full max-w-[32px] rounded-t-md bg-emerald-400 transition-all -mt-1"
                        style={{ height: `${(trends.completed[i] / maxTrend) * 100}%` }}
                        title={`Selesai: ${trends.completed[i]}`}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 text-center whitespace-nowrap">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#0F4C9A] opacity-70" />
                  Total
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
                  Selesai
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/consultant/konsultasi" className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-[var(--shadow-elevated)] transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Konsultasi</p>
                <p className="text-[11px] text-gray-400">Lihat & kelola jadwal</p>
              </div>
            </div>
          </Link>
          <Link href="/consultant/clients" className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-[var(--shadow-elevated)] transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Klien</p>
                <p className="text-[11px] text-gray-400">Pantau klien UMKM</p>
              </div>
            </div>
          </Link>
          <Link href="/consultant/profile" className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-[var(--shadow-elevated)] transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Profil</p>
                <p className="text-[11px] text-gray-400">Edit profil konsultan</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Clients */}
        {recentClients.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[14px] font-bold text-gray-900">Klien Terbaru</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/consultant/clients/${client.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F0FE] text-[11px] font-bold text-[#0F4C9A]">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-gray-900">{client.name}</p>
                    <p className="truncate text-[11px] text-gray-400">{client.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    client.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                    client.status === "COMPLETED" ? "bg-slate-100 text-slate-700" :
                    client.status === "CANCELLED" ? "bg-rose-100 text-rose-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {client.status === "PENDING" ? "Menunggu" :
                     client.status === "CONFIRMED" ? "Dikonfirmasi" :
                     client.status === "COMPLETED" ? "Selesai" : "Dibatalkan"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </AuthenticatedLayout>
  );
}
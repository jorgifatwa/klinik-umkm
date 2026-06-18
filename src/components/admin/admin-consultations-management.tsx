"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";

// ── Types ────────────────────────────────────────────────────────────
type ConsultationTab = "consultations" | "consultants" | "assignment";

type ConsultationItem = {
  id: string;
  scheduledAt: string;
  status: string;
  user: { name: string | null; email: string } | null;
  consultant: { user: { name: string | null } | null; speciality?: string } | null;
};

type ConsultantItem = {
  id: string;
  name: string;
  email: string;
  speciality: string;
  bio: string;
  totalConsultations: number;
  completedConsultations: number;
  status: string;
};


// ── Helpers ──────────────────────────────────────────────────────────
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", { dateStyle: "medium" });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("id-ID", { timeStyle: "short" });
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-700";
    case "COMPLETED":
      return "bg-slate-100 text-slate-700";
    case "CANCELLED":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "PENDING": return "Menunggu";
    case "CONFIRMED": return "Dikonfirmasi";
    case "COMPLETED": return "Selesai";
    case "CANCELLED": return "Dibatalkan";
    default: return status;
  }
}

// ── Main Component ───────────────────────────────────────────────────
export function AdminConsultationsManagement() {
  const [activeTab, setActiveTab] = useState<ConsultationTab>("consultations");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-8 pt-8 pb-0">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Management</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Konsultasi</h2>
          <p className="mt-1 text-sm text-slate-500">Kelola konsultasi, konsultan, dan penugasan dalam satu halaman.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <TabButton
            active={activeTab === "consultations"}
            onClick={() => setActiveTab("consultations")}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          >
            Daftar Konsultasi
          </TabButton>
          <TabButton
            active={activeTab === "consultants"}
            onClick={() => setActiveTab("consultants")}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
          >
            Daftar Konsultan
          </TabButton>
          <TabButton
            active={activeTab === "assignment"}
            onClick={() => setActiveTab("assignment")}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            }
          >
            Penugasan Konsultan
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === "consultations" && <ConsultationsTab />}
        {activeTab === "consultants" && <ConsultantsTab />}
        {activeTab === "assignment" && <AssignmentTab />}
      </div>
    </section>
  );
}

// ── Tab Button ───────────────────────────────────────────────────────
function TabButton({ active, onClick, children, icon }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
        active
          ? "border-[#0F4C9A] text-[#0F4C9A]"
          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

// ── Tab 1: Daftar Konsultasi ────────────────────────────────────────
function ConsultationsTab() {
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/consultations");
        if (!r.ok) throw new Error("Gagal memuat data konsultasi.");
        const d = await r.json();
        if (!cancelled) setConsultations(d.consultations ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleStatusChange(id: string, status: string) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const r = await fetch(`/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Gagal memperbarui status.");
      setSuccess(`✓ Status diubah menjadi ${statusLabel(status)}.`);
      // Refetch data
      const refetch = await fetch("/api/admin/consultations");
      if (refetch.ok) {
        const d = await refetch.json();
        setConsultations(d.consultations ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = statusFilter === "ALL"
    ? consultations
    : consultations.filter((c) => c.status === statusFilter);

  const statusCounts = {
    ALL: consultations.length,
    PENDING: consultations.filter((c) => c.status === "PENDING").length,
    CONFIRMED: consultations.filter((c) => c.status === "CONFIRMED").length,
    COMPLETED: consultations.filter((c) => c.status === "COMPLETED").length,
    CANCELLED: consultations.filter((c) => c.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span>⚠</span>{error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <span>✓</span>{success}
        </div>
      )}

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              statusFilter === s
                ? "bg-[#0F4C9A] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {s === "ALL" ? "Semua" : statusLabel(s)}
            <span className={cn(
              "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
              statusFilter === s ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      <DataTable<ConsultationItem>
        data={filtered}
        keyExtractor={(c) => c.id}
        searchPlaceholder="Cari nama UMKM atau konsultan..."
        loading={loading}
        pageSize={8}
        emptyMessage="Belum ada data konsultasi."
        emptyIcon="📅"
        columns={[
          {
            key: "user",
            header: "Nama UMKM",
            render: (c) => (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F4C9A]/10 text-xs font-bold text-[#0F4C9A]">
                  {c.user?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{c.user?.name ?? "-"}</p>
                  <p className="text-xs text-slate-400 truncate">{c.user?.email ?? ""}</p>
                </div>
              </div>
            ),
          },
          {
            key: "consultant",
            header: "Konsultan",
            render: (c) => (
              <span className="text-slate-600">{c.consultant?.user?.name ?? "-"}</span>
            ),
          },
          {
            key: "scheduledAt",
            header: "Tanggal",
            render: (c) => <span className="text-slate-500">{formatDate(c.scheduledAt)}</span>,
          },
          {
            key: "scheduledAtTime",
            header: "Jam",
            render: (c) => <span className="text-slate-500">{formatTime(c.scheduledAt)}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (c) => (
              <Badge className={cn(statusBadgeClass(c.status), "rounded-full")}>
                {statusLabel(c.status)}
              </Badge>
            ),
          },
        ]}
        actions={(c) => (
          <div className="flex flex-wrap justify-end gap-1.5">
            {c.status !== "CONFIRMED" && (
              <Button variant="secondary" size="sm" onClick={() => handleStatusChange(c.id, "CONFIRMED")}>
                Konfirmasi
              </Button>
            )}
            {c.status !== "COMPLETED" && c.status !== "CANCELLED" && (
              <Button variant="outline" size="sm" onClick={() => handleStatusChange(c.id, "COMPLETED")}>
                Selesai
              </Button>
            )}
            {c.status !== "CANCELLED" && c.status !== "COMPLETED" && (
              <Button variant="ghost" size="sm" onClick={() => handleStatusChange(c.id, "CANCELLED")}>
                Batal
              </Button>
            )}
          </div>
        )}
      />
    </div>
  );
}

// ── Tab 2: Daftar Konsultan ──────────────────────────────────────────
function ConsultantsTab() {
  const [consultants, setConsultants] = useState<ConsultantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultantItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/admin/consultants");
        if (!r.ok) throw new Error("Gagal memuat data konsultan.");
        const d = await r.json();
        if (!cancelled) setConsultants(d.consultants ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span>⚠</span>{error}
        </div>
      )}
      <DataTable<ConsultantItem>
        data={consultants}
        keyExtractor={(c) => c.id}
        searchPlaceholder="Cari nama konsultan atau spesialisasi..."
        loading={loading}
        pageSize={8}
        emptyMessage="Belum ada konsultan terdaftar."
        emptyIcon="👤"
        columns={[
          {
            key: "name",
            header: "Nama Konsultan",
            render: (c) => (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/10 text-xs font-bold text-[#8B5CF6]">
                  {c.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{c.name}</p>
                  <p className="text-xs text-slate-400 truncate">{c.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "speciality",
            header: "Spesialisasi",
            render: (c) => (
              <Badge className="bg-[#E8F0FE] text-[#0F4C9A] rounded-full">{c.speciality}</Badge>
            ),
          },
          {
            key: "totalConsultations",
            header: "Total Konsultasi",
            render: (c) => (
              <div className="text-center">
                <span className="font-semibold text-slate-900">{c.totalConsultations}</span>
                <span className="text-slate-400 ml-1 text-xs">({c.completedConsultations} selesai)</span>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (c) => (
              <Badge className={cn(
                c.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
                "rounded-full"
              )}>
                {c.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
              </Badge>
            ),
          },
        ]}
        actions={(c) => (
          <div className="flex flex-wrap justify-end gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => setSelectedConsultant(c)}>
              Lihat
            </Button>
          </div>
        )}
      />

      {/* Consultant Detail Modal */}
      {selectedConsultant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedConsultant(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/10 text-lg font-bold text-[#8B5CF6]">
                {selectedConsultant.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-950">{selectedConsultant.name}</h3>
                <p className="text-sm text-slate-500">{selectedConsultant.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Spesialisasi</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selectedConsultant.speciality}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedConsultant.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Total Konsultasi</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selectedConsultant.totalConsultations}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Selesai</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selectedConsultant.completedConsultations}</p>
                </div>
              </div>

              {selectedConsultant.bio && (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Bio</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedConsultant.bio}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setSelectedConsultant(null)}>Tutup</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab 3: Penugasan Konsultan ───────────────────────────────────────
function AssignmentTab() {
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [consultants, setConsultants] = useState<ConsultantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assignTarget, setAssignTarget] = useState<ConsultationItem | null>(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [consR, conslR] = await Promise.all([
        fetch("/api/admin/consultants"),
        fetch("/api/admin/consultations"),
      ]);
      if (consR.ok) {
        const d = await consR.json();
        setConsultants(d.consultants ?? []);
      }
      if (conslR.ok) {
        const d = await conslR.json();
        setConsultations(d.consultations ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [consR, conslR] = await Promise.all([
          fetch("/api/admin/consultants"),
          fetch("/api/admin/consultations"),
        ]);
        if (consR.ok && !cancelled) {
          const d = await consR.json();
          setConsultants(d.consultants ?? []);
        }
        if (conslR.ok && !cancelled) {
          const d = await conslR.json();
          setConsultations(d.consultations ?? []);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleAssign() {
    if (!assignTarget || !selectedConsultantId) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const r = await fetch(`/api/admin/consultations/${assignTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultantId: selectedConsultantId }),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d?.error || "Gagal menugaskan konsultan.");
      }
      setSuccess("✓ Konsultan berhasil ditugaskan/diubah.");
      setAssignTarget(null);
      setSelectedConsultantId("");
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  const pendingConsultations = consultations.filter((c) => c.status === "PENDING");
  const assignedConsultations = consultations.filter((c) => c.status === "CONFIRMED");

  // Consultant workload data
  const consultantWorkload = consultants.map((c) => ({
    ...c,
    activeCount: assignedConsultations.filter((ac) => ac.consultant?.user?.name === c.name).length,
  }));

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span>⚠</span>{error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <span>✓</span>{success}
        </div>
      )}

      {/* Consultation Requests */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Konsultasi Menunggu Penugasan</h3>
        {pendingConsultations.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-6 py-8 text-center">
            <p className="text-sm text-slate-500">Tidak ada konsultasi yang menunggu penugasan.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingConsultations.map((c) => (
              <div key={c.id} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 hover:bg-slate-50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {c.user?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{c.user?.name ?? "-"}</p>
                  <p className="text-xs text-slate-400">{formatDate(c.scheduledAt)} · {formatTime(c.scheduledAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-700 rounded-full">Menunggu</Badge>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setAssignTarget(c);
                      setSelectedConsultantId(c.consultant?.user?.name ? "" : "");
                    }}
                  >
                    Tugaskan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Consultations */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Konsultasi Aktif (Sudah Ditugaskan)</h3>
        {assignedConsultations.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-6 py-8 text-center">
            <p className="text-sm text-slate-500">Tidak ada konsultasi aktif.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">UMKM</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Konsultan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Jadwal</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignedConsultations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-900">{c.user?.name ?? "-"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-600">{c.consultant?.user?.name ?? "-"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-500">{formatDate(c.scheduledAt)} · {formatTime(c.scheduledAt)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAssignTarget(c);
                          setSelectedConsultantId("");
                        }}
                      >
                        Ubah Konsultan
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Consultant Workload */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Beban Kerja Konsultan</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {consultantWorkload.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/10 text-xs font-bold text-[#8B5CF6]">
                  {c.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.speciality}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Aktif: <span className="font-semibold text-slate-700">{c.activeCount}</span></span>
                <span>Total: <span className="font-semibold text-slate-700">{c.totalConsultations}</span></span>
                <span>Selesai: <span className="font-semibold text-slate-700">{c.completedConsultations}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Dialog */}
      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setAssignTarget(null); setSelectedConsultantId(""); }} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-950">
              {assignTarget.consultant?.user?.name ? "Ubah Konsultan" : "Tugaskan Konsultan"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Konsultasi: <span className="font-medium text-slate-700">{assignTarget.user?.name ?? "-"}</span>
              {" · "}
              {formatDate(assignTarget.scheduledAt)} {formatTime(assignTarget.scheduledAt)}
            </p>

            {assignTarget.consultant?.user?.name && (
              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Konsultan saat ini: <span className="font-semibold text-slate-900">{assignTarget.consultant.user.name}</span>
              </div>
            )}

            <div className="mt-4">
              <Label>Pilih Konsultan</Label>
              <select
                value={selectedConsultantId}
                onChange={(e) => setSelectedConsultantId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-[#0F4C9A] focus:ring-2 focus:ring-[#0F4C9A]/10"
              >
                <option value="">Pilih Konsultan</option>
                {consultants.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.speciality} ({c.totalConsultations} sesi)
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setAssignTarget(null); setSelectedConsultantId(""); }}>
                Batal
              </Button>
              <Button onClick={handleAssign} disabled={!selectedConsultantId || loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
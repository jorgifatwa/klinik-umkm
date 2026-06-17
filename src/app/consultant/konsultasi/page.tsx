"use client";

import { useState, useEffect } from "react";
import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { Button } from "@/components/ui/button";

interface ConsultationItem {
  id: string;
  scheduledAt: string;
  status: string;
  userName: string;
  userEmail: string;
  businessName: string | null;
  industry: string | null;
}

type FilterKey = "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export default function ConsultantKonsultasiPage() {
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("ALL");

  useEffect(() => {
    fetch("/api/consultant/consultations")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setConsultations(data.consultations || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    const prev = consultations;
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    try {
      const res = await fetch("/api/consultant/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) {
        setConsultations(prev);
      }
    } catch {
      setConsultations(prev);
    }
  }

  const filtered =
    filter === "ALL"
      ? consultations
      : consultations.filter((c) => c.status === filter);

  function statusLabel(status: string) {
    switch (status) {
      case "PENDING":
        return "Menunggu";
      case "CONFIRMED":
        return "Dikonfirmasi";
      case "COMPLETED":
        return "Selesai";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  }

  function statusColor(status: string) {
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

  function statusIconColor(status: string) {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-600";
      case "COMPLETED":
        return "bg-gray-100 text-gray-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-amber-100 text-amber-600";
    }
  }

  return (
    <AuthenticatedLayout
      title="Konsultasi Saya"
      breadcrumbs={[
        { label: "Home", href: "/consultant" },
        { label: "Konsultasi" },
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-[17px] font-bold text-gray-900">
            Jadwal Konsultasi
          </h2>
          <p className="mt-1 text-[12.5px] text-gray-500">
            Kelola jadwal konsultasi dengan klien UMKM Anda.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as FilterKey[]
          ).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                filter === f
                  ? "bg-[#0F4C9A] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "ALL" ? "Semua" : statusLabel(f)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-[13px] text-gray-500">Memuat data...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold ${statusIconColor(c.status)}`}
                  >
                    {c.status.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-gray-900">
                      {c.userName}
                    </p>
                    <p className="text-[11.5px] text-gray-400">
                      {new Date(c.scheduledAt).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(c.scheduledAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {c.businessName && (
                      <p className="text-[11px] text-gray-400">
                        {c.businessName}
                        {c.industry ? ` · ${c.industry}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {c.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] h-8 px-3"
                          onClick={() =>
                            handleStatusChange(c.id, "CONFIRMED")
                          }
                        >
                          Konfirmasi
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50 text-[11px] h-8 px-3"
                          onClick={() =>
                            handleStatusChange(c.id, "CANCELLED")
                          }
                        >
                          Tolak
                        </Button>
                      </>
                    )}
                    {c.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white text-[11px] h-8 px-3"
                        onClick={() =>
                          handleStatusChange(c.id, "COMPLETED")
                        }
                      >
                        Selesai
                      </Button>
                    )}
                    <span
                      className={`shrink-0 rounded-md px-2.5 py-1 text-[10.5px] font-semibold ${statusColor(c.status)}`}
                    >
                      {statusLabel(c.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-[13px] font-medium text-gray-500">
              Belum ada jadwal konsultasi
            </p>
            <p className="mt-1 text-[11.5px] text-gray-400">
              Konsultasi akan muncul di sini setelah dijadwalkan.
            </p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type ConsultantConsultationItem = {
  id: string;
  scheduledAt: string;
  status: string;
  userName: string;
  userEmail: string;
  userWhatsApp: string | null;
};

const statusBadge = (status: string) => {
  if (status === "CONFIRMED") return "bg-emerald-100 text-emerald-700";
  if (status === "COMPLETED") return "bg-slate-100 text-slate-700";
  if (status === "CANCELLED") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
};

export function ConsultantSchedule({ initialConsultations }: { initialConsultations: ConsultantConsultationItem[] }) {
  const [consultations, setConsultations] = useState<ConsultantConsultationItem[]>(initialConsultations);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(consultationId: string, status: string) {
    setLoadingId(consultationId);
    setError(null);

    try {
      const response = await fetch(`/api/consultant/consultations/${consultationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Gagal memperbarui status konsultasi.");
      }

      setConsultations((current) =>
        current.map((item) => (item.id === consultationId ? { ...item, status } : item))
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Konsultan</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Jadwal Konsultasi Saya</h2>
        <p className="mt-2 text-slate-600">Lihat permintaan konsultasi UMKM dan kelola status sesi Anda.</p>
      </div>

      {error ? <p className="mb-6 text-sm text-rose-600">{error}</p> : null}

      <div className="space-y-5">
        {consultations.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            Belum ada jadwal konsultasi untuk saat ini.
          </div>
        ) : (
          consultations.map((consultation) => (
            <div key={consultation.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">{new Date(consultation.scheduledAt).toLocaleString("id-ID")}</p>
                  <p className="text-lg font-semibold text-slate-950">UMKM: {consultation.userName}</p>
                  <p className="text-sm text-slate-700">Email: {consultation.userEmail}</p>
                  <p className="text-sm text-slate-700">WhatsApp: {consultation.userWhatsApp ?? "Belum tersedia"}</p>
                </div>
                <div className="flex flex-col gap-3 sm:items-end">
                  <Badge className={statusBadge(consultation.status)}>{consultation.status}</Badge>
                  {consultation.userWhatsApp ? (
                    <a
                      href={`https://wa.me/${consultation.userWhatsApp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Chat WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {consultation.status !== "CONFIRMED" && consultation.status !== "COMPLETED" && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={loadingId === consultation.id}
                    onClick={() => updateStatus(consultation.id, "CONFIRMED")}
                  >
                    {loadingId === consultation.id ? "Memuat..." : "Konfirmasi"}
                  </Button>
                )}
                {consultation.status !== "COMPLETED" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loadingId === consultation.id}
                    onClick={() => updateStatus(consultation.id, "COMPLETED")}
                  >
                    {loadingId === consultation.id ? "Memuat..." : "Selesaikan"}
                  </Button>
                )}
                {consultation.status !== "CANCELLED" && consultation.status !== "COMPLETED" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={loadingId === consultation.id}
                    onClick={() => updateStatus(consultation.id, "CANCELLED")}
                  >
                    {loadingId === consultation.id ? "Memuat..." : "Batalkan"}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

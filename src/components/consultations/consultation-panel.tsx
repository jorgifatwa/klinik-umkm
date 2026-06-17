"use client";

import { useState } from "react";
import { ConsultationForm } from "@/components/consultations/consultation-form";
import { Badge } from "@/components/ui/badge";

export type ConsultationItem = {
  id: string;
  scheduledAt: string;
  status: string;
  consultantName: string;
};

interface ConsultationPanelProps {
  consultants: Array<{ id: string; user: { name: string | null } }>;
  initialConsultations: ConsultationItem[];
}

export function ConsultationPanel({ consultants, initialConsultations }: ConsultationPanelProps) {
  const [consultations, setConsultations] = useState<ConsultationItem[]>(initialConsultations);

  function handleCreatedConsultation(consultation: ConsultationItem) {
    setConsultations((current) => [consultation, ...current]);
  }

  return (
    <div className="space-y-6">
      <ConsultationForm consultants={consultants} onSuccess={handleCreatedConsultation} />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-950">Jadwal Konsultasi</h2>
        <div className="mt-6 space-y-4">
          {consultations.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
              Belum ada jadwal konsultasi.
            </div>
          ) : (
            consultations.map((consultation) => (
              <div key={consultation.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{new Date(consultation.scheduledAt).toLocaleString("id-ID")}</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">Konsultan: {consultation.consultantName}</p>
                <Badge className="mt-2 inline-block bg-amber-100 text-amber-700">{consultation.status}</Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

interface ConsultationFormProps {
  consultants: Array<{ id: string; user: { name: string | null } }>;
  onSuccess?: (consultation: { id: string; scheduledAt: string; status: string; consultantName: string }) => void;
}

type ConsultationFormValues = z.infer<typeof consultationSchema>;

export function ConsultationForm({ consultants, onSuccess }: ConsultationFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
  });

  async function onSubmit(values: ConsultationFormValues) {
    setStatus(null);
    setIsSaving(true);
    const response = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    setIsSaving(false);
    if (!response.ok) {
      setStatus(data?.error || "Gagal booking konsultasi.");
      return;
    }
    const consultation = data?.consultation;
    if (consultation) {
      onSuccess?.({
        id: consultation.id,
        scheduledAt: consultation.scheduledAt,
        status: consultation.status,
        consultantName: consultants.find((item) => item.id === consultation.consultantId)?.user.name ?? "Konsultan UMKM",
      });
    }
    setStatus("Konsultasi berhasil dipesan. Tunggu konfirmasi konsultan.");
  }

  return (
    <form className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="consultantId">Pilih Konsultan</Label>
        <select id="consultantId" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" {...register("consultantId")}> 
          <option value="">Pilih konsultan</option>
          {consultants.map((consultant) => (
            <option key={consultant.id} value={consultant.id}>{consultant.user.name || "Konsultan UMKM"}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="scheduledAt">Tanggal & Jam</Label>
        <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} />
      </div>
      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
      <Button type="submit" disabled={isSaving}>{isSaving ? "Mengirim..." : "Book Konsultasi"}</Button>
    </form>
  );
}

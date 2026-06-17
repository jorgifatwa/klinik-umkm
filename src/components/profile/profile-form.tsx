"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessProfileSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { z } from "zod";

type BusinessProfileForm = z.input<typeof businessProfileSchema>;

interface ProfileFormProps {
  profile: BusinessProfileForm | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: profile
      ? {
          businessName: profile.businessName ?? "",
          industry: profile.industry ?? "",
          establishedYear: profile.establishedYear ?? new Date().getFullYear(),
          employeeCount: profile.employeeCount ?? 0,
          monthlyRevenue: profile.monthlyRevenue ?? 0,
          monthlyProfit: profile.monthlyProfit ?? 0,
          initialCapital: profile.initialCapital ?? 0,
          location: profile.location ?? "",
          whatsapp: profile.whatsapp ?? "",
        }
      : {
          businessName: "",
          industry: "",
          establishedYear: new Date().getFullYear(),
          employeeCount: 0,
          monthlyRevenue: 0,
          monthlyProfit: 0,
          initialCapital: 0,
          location: "",
          whatsapp: "",
        },
  });

  async function onSubmit(values: BusinessProfileForm) {
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const text = await response.text();

      if (!text) {
        setStatus({ type: "error", message: "Server tidak mengembalikan respons." });
        return;
      }

      let result: Record<string, unknown>;
      try {
        result = JSON.parse(text);
      } catch {
        setStatus({ type: "error", message: `Respons tidak valid: ${text}` });
        return;
      }

      if (!response.ok) {
        const detail = (result?.detail as string) || "";
        const errorMsg = (result?.error as string) || "Gagal menyimpan profil.";
        setStatus({
          type: "error",
          message: detail ? `${errorMsg} (${detail})` : errorMsg,
        });
        return;
      }

      setStatus({ type: "success", message: "Profil usaha berhasil diperbarui." });
    } catch {
      setStatus({ type: "error", message: "Terjadi kesalahan jaringan. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit(onSubmit)}>
      {/* Section header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900">Data Usaha</h2>
        <p className="mt-1 text-sm text-slate-500">Informasi dasar tentang bisnis Anda.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="businessName">Nama Usaha</Label>
          <Input id="businessName" {...register("businessName")} />
          {errors.businessName && (
            <p className="text-xs text-red-500">{errors.businessName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="industry">Jenis Usaha</Label>
          <Input id="industry" {...register("industry")} />
          {errors.industry && (
            <p className="text-xs text-red-500">{errors.industry.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="establishedYear">Tahun Berdiri</Label>
          <Controller
            name="establishedYear"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="establishedYear"
                value={field.value}
                onChange={field.onChange}
                min={1900}
                max={new Date().getFullYear()}
              />
            )}
          />
          {errors.establishedYear && (
            <p className="text-xs text-red-500">{errors.establishedYear.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="employeeCount">Jumlah Karyawan</Label>
          <Controller
            name="employeeCount"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="employeeCount"
                value={field.value}
                onChange={field.onChange}
                min={0}
              />
            )}
          />
          {errors.employeeCount && (
            <p className="text-xs text-red-500">{errors.employeeCount.message}</p>
          )}
        </div>
      </div>

      {/* Section header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900">Data Keuangan</h2>
        <p className="mt-1 text-sm text-slate-500">Nominal dalam Rupiah (Rp).</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="monthlyRevenue">Omset Bulanan</Label>
          <Controller
            name="monthlyRevenue"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="monthlyRevenue"
                value={field.value}
                onChange={field.onChange}
                min={0}
                step={1000}
              />
            )}
          />
          {errors.monthlyRevenue && (
            <p className="text-xs text-red-500">{errors.monthlyRevenue.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monthlyProfit">Laba Bulanan</Label>
          <Controller
            name="monthlyProfit"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="monthlyProfit"
                value={field.value}
                onChange={field.onChange}
                min={0}
                step={1000}
              />
            )}
          />
          {errors.monthlyProfit && (
            <p className="text-xs text-red-500">{errors.monthlyProfit.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="initialCapital">Modal Awal</Label>
          <Controller
            name="initialCapital"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="initialCapital"
                value={field.value}
                onChange={field.onChange}
                min={0}
                step={1000}
              />
            )}
          />
          {errors.initialCapital && (
            <p className="text-xs text-red-500">{errors.initialCapital.message}</p>
          )}
        </div>
      </div>

      {/* Section header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900">Kontak & Lokasi</h2>
        <p className="mt-1 text-sm text-slate-500">Informasi yang bisa dihubungi.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
          <Input id="whatsapp" {...register("whatsapp")} placeholder="Contoh: +6281234567890" />
          {errors.whatsapp && (
            <p className="text-xs text-red-500">{errors.whatsapp.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Lokasi Usaha</Label>
          <Input id="location" {...register("location")} />
          {errors.location && (
            <p className="text-xs text-red-500">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Status messages */}
      {status && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === "success" ? (
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            {status.message}
          </div>
        </div>
      )}
      {Object.keys(errors).length > 0 && !status && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            Lengkapi data dengan benar sebelum menyimpan.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <p className="text-xs text-slate-400">Semua data disimpan dengan aman.</p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Menyimpan...
            </span>
          ) : (
            "Simpan Profil"
          )}
        </Button>
      </div>
    </form>
  );
}
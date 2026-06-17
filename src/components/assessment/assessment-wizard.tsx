"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { HealthRadar } from "@/components/charts/health-radar";
import { ScoringGuideButton } from "@/components/assessment/scoring-guide";
import { z } from "zod";

type AssessmentValues = z.infer<typeof assessmentSchema>;
type AssessmentResult = {
  score: {
    finalScore: number;
    category: string;
    profitabilityScore: number;
    liquidityScore: number;
    debtScore: number;
    growthScore: number;
    recommendations: string[];
  };
  roadmap: {
    target3Months: string;
    target6Months: string;
    target1Year: string;
  };
};

export function AssessmentWizard({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { handleSubmit, control, watch } = useForm<AssessmentValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      monthlyRevenue: 0,
      priorRevenue: 0,
      operatingCost: 0,
      payrollCost: 0,
      otherCost: 0,
      totalDebt: 0,
      monthlyInstallment: 0,
      businessCapital: 0,
      cashBalance: 0,
    },
  });

  const fieldsByStep: Array<{ title: string; fields: Array<{ name: keyof AssessmentValues; label: string; type: "number" }> }> = [
    {
      title: "Data Pendapatan",
      fields: [
        { name: "monthlyRevenue", label: "Pendapatan Bulanan", type: "number" },
        { name: "priorRevenue", label: "Pendapatan 3 Bulan Lalu", type: "number" },
      ],
    },
    {
      title: "Pengeluaran",
      fields: [
        { name: "operatingCost", label: "Biaya Operasional", type: "number" },
        { name: "payrollCost", label: "Gaji Karyawan", type: "number" },
        { name: "otherCost", label: "Biaya Lainnya", type: "number" },
      ],
    },
    {
      title: "Utang",
      fields: [
        { name: "totalDebt", label: "Total Utang", type: "number" },
        { name: "monthlyInstallment", label: "Cicilan Bulanan", type: "number" },
      ],
    },
    {
      title: "Modal dan Kas",
      fields: [
        { name: "businessCapital", label: "Modal Usaha", type: "number" },
        { name: "cashBalance", label: "Saldo Kas Saat Ini", type: "number" },
      ],
    },
  ];

  async function onSubmit(values: AssessmentValues) {
    setIsSaving(true);
    setStatus(null);
    const response = await fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    setIsSaving(false);
    if (!response.ok) {
      setStatus(data?.error || "Gagal menyimpan assessment.");
      return;
    }

    setResult(data.assessment);
    setHasSubmitted(true);
    setStatus("Assessment berhasil disimpan.");
    if (onSuccess) onSuccess();
  }

  // Watch all values to validate step progression and submission
  const formValues = watch();
  const currentStepFields = fieldsByStep[step - 1].fields;
  const isStepComplete = currentStepFields.every(
    (field) => formValues[field.name] > 0,
  );
  // All fields across all steps must be filled to submit
  const allFields = fieldsByStep.flatMap((s) => s.fields);
  const isAllComplete = allFields.every(
    (field) => formValues[field.name] > 0,
  );

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold text-slate-950">Cek Kesehatan Keuangan</h1>
              <ScoringGuideButton />
            </div>
            <p className="mt-2 text-slate-600">Isi wizard untuk mendapatkan skor keuangan UMKM Anda.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">Langkah {step} dari 4</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {currentStepFields.map((field) => (
              <div key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <NumberInput
                      id={controllerField.name}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                      min={0}
                    />
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                Sebelumnya
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={() => setStep(step + 1)} disabled={!isStepComplete}>
                Selanjutnya
              </Button>
            ) : (
              <Button type="submit" disabled={isSaving || !isAllComplete}>
                {isSaving ? "Memproses..." : "Lihat Hasil"}
              </Button>
            )}
            {!isStepComplete && step < 4 && (
              <p className="text-xs text-slate-400 ml-2">Isi semua field untuk melanjutkan</p>
            )}
            {!isAllComplete && step === 4 && (
              <p className="text-xs text-slate-400 ml-2">Lengkapi semua data di setiap langkah</p>
            )}
          </div>
          {status ? <p className="text-sm text-slate-700">{status}</p> : null}
        </form>
      </div>

      {hasSubmitted && result ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Hasil Analisis</h2>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-slate-50 p-6">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-500">Skor Kesehatan Keuangan</p>
                  <ScoringGuideButton />
                </div>
                <p className="mt-3 text-5xl font-semibold text-slate-950">{result.score.finalScore}</p>
                <p className="text-sm text-slate-600">Kategori: {result.score.category}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Rekomendasi</h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  {result.score.recommendations.map((item: string, index: number) => (
                    <li key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <HealthRadar
              profitabilityScore={result.score.profitabilityScore}
              liquidityScore={result.score.liquidityScore}
              debtScore={result.score.debtScore}
              growthScore={result.score.growthScore}
            />
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-950">Roadmap Keuangan</h3>
                <ScoringGuideButton />
              </div>
              <div className="mt-4 space-y-4 text-slate-600">
                <div>
                  <p className="font-semibold text-slate-950">Target 3 Bulan</p>
                  <p>{result.roadmap.target3Months}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Target 6 Bulan</p>
                  <p>{result.roadmap.target6Months}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Target 1 Tahun</p>
                  <p>{result.roadmap.target1Year}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

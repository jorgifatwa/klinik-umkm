"use client";

import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { FinanceCalculators } from "./finance-calculators";

export function AuthenticatedCalculators() {
  return (
    <AuthenticatedLayout
      title="Kalkulator Keuangan"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Kalkulator" }]}
    >
      <div className="space-y-6">
        {/* Calculator Library Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-gray-900">Kalkulator Keuangan</h2>
              <p className="mt-1 text-[12.5px] text-gray-500">
                Alat perhitungan keuangan profesional untuk UMKM.
              </p>
            </div>
          </div>

          {/* Calculator Categories */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Laba Rugi", desc: "Hitung profit dan loss usaha", icon: "📊", color: "#0F4C9A" },
              { label: "Titik Impas", desc: "Temukan break-even point", icon: "🎯", color: "#37B24D" },
              { label: "Proyeksi", desc: "Prediksi keuntungan masa depan", icon: "📈", color: "#1E73D8" },
            ].map((cat) => (
              <div key={cat.label} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[18px]" style={{ backgroundColor: cat.color + "12" }}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{cat.label}</p>
                    <p className="text-[11px] text-gray-400">{cat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator Content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <FinanceCalculators />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
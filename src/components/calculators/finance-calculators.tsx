"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { CalculatorGuideButton } from "@/components/calculators/calculator-guide";

type CalculatorTab = "laba-rugi" | "bep" | "modal" | "proyeksi";

const tabs: { id: CalculatorTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "laba-rugi",
    label: "Laba Rugi",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "bep",
    label: "BEP",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: "modal",
    label: "Modal Usaha",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    id: "proyeksi",
    label: "Proyeksi Keuntungan",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

function formatRupiah(value: number): string {
  if (value === 0) return "Rp 0";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function FinanceCalculators() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("laba-rugi");

  // Laba Rugi
  const [revenue, setRevenue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // BEP
  const [fixedCost, setFixedCost] = useState(0);
  const [variableCost, setVariableCost] = useState(0);
  const [price, setPrice] = useState(0);

  // Modal
  const [targetProduction, setTargetProduction] = useState(0);
  const [unitCost, setUnitCost] = useState(0);

  // Proyeksi
  const [monthlySales, setMonthlySales] = useState(0);
  const [margin, setMargin] = useState(0);

  // Results
  const netProfit = useMemo(() => revenue - totalCost, [revenue, totalCost]);
  const netProfitPercent = useMemo(
    () => (revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : "0"),
    [netProfit, revenue]
  );
  const bep = useMemo(
    () => (price > variableCost ? fixedCost / (price - variableCost) : 0),
    [fixedCost, price, variableCost]
  );
  const requiredCapital = useMemo(
    () => targetProduction * unitCost,
    [targetProduction, unitCost]
  );
  const twelveMonthProjection = useMemo(
    () => monthlySales * (margin / 100) * 12,
    [monthlySales, margin]
  );
  const monthlyProjection = useMemo(
    () => monthlySales * (margin / 100),
    [monthlySales, margin]
  );

  return (
    <div className="space-y-6">
      {/* Calculator Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#0F4C9A] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Laba Rugi Calculator */}
      {activeTab === "laba-rugi" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#0F4C9A]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Kalkulator Laba Rugi</h2>
                  <CalculatorGuideButton type="laba-rugi" />
                </div>
                <p className="text-sm text-gray-500">Hitung keuntungan bersih dari pendapatan dan biaya usaha</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="revenue">Total Pendapatan</Label>
                <NumberInput id="revenue" value={revenue} onChange={setRevenue} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="totalCost">Total Biaya</Label>
                <NumberInput id="totalCost" value={totalCost} onChange={setTotalCost} />
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hasil Perhitungan</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Laba Bersih</p>
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-[#37B24D]" : "text-red-600"}`}>
                    {formatRupiah(netProfit)}
                  </p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-sm text-gray-500">Margin Keuntungan</p>
                  <p className="text-lg font-semibold text-gray-900">{netProfitPercent}%</p>
                </div>
                <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                  <p className="text-xs text-gray-500">
                    {netProfit >= 0
                      ? "✅ Usaha Anda menghasilkan keuntungan. Pertahankan pengelolaan biaya."
                      : "⚠️ Usaha Anda masih rugi. Perlu evaluasi pendapatan dan biaya."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BEP Calculator */}
      {activeTab === "bep" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#0F4C9A]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Kalkulator BEP</h2>
                  <CalculatorGuideButton type="bep" />
                </div>
                <p className="text-sm text-gray-500">Temukan titik impas (break-even point) usaha Anda</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fixedCost">Biaya Tetap (per bulan)</Label>
                <NumberInput id="fixedCost" value={fixedCost} onChange={setFixedCost} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="variableCost">Biaya Variabel per Unit</Label>
                <NumberInput id="variableCost" value={variableCost} onChange={setVariableCost} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Harga Jual per Unit</Label>
                <NumberInput id="price" value={price} onChange={setPrice} />
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hasil Perhitungan</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Titik Impas (Unit)</p>
                  <p className="text-2xl font-bold text-[#0F4C9A]">
                    {isFinite(bep) && bep > 0 ? Math.ceil(bep).toLocaleString("id-ID") : "-"}
                  </p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-sm text-gray-500">Titik Impas (Rupiah)</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {isFinite(bep) && bep > 0 && price > 0
                      ? formatRupiah(Math.ceil(bep) * price)
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kontribusi Margin per Unit</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {price > 0 ? formatRupiah(price - variableCost) : "-"}
                  </p>
                </div>
                <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                  <p className="text-xs text-gray-500">
                    {isFinite(bep) && bep > 0
                      ? `💡 Anda perlu menjual minimal ${Math.ceil(bep)} unit untuk menutup semua biaya.`
                      : "💡 Masukkan data untuk menghitung titik impas."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Calculator */}
      {activeTab === "modal" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#0F4C9A]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Kalkulator Modal Usaha</h2>
                  <CalculatorGuideButton type="modal" />
                </div>
                <p className="text-sm text-gray-500">Hitung kebutuhan modal untuk target produksi</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="targetProduction">Target Produksi (unit)</Label>
                <NumberInput id="targetProduction" value={targetProduction} onChange={setTargetProduction} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unitCost">Biaya Produksi per Unit</Label>
                <NumberInput id="unitCost" value={unitCost} onChange={setUnitCost} />
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hasil Perhitungan</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Modal yang Dibutuhkan</p>
                  <p className="text-2xl font-bold text-[#0F4C9A]">{formatRupiah(requiredCapital)}</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-sm text-gray-500">Total Unit Produksi</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {targetProduction.toLocaleString("id-ID")} unit
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Biaya per Unit</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {unitCost > 0 ? formatRupiah(unitCost) : "-"}
                  </p>
                </div>
                <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                  <p className="text-xs text-gray-500">
                    {requiredCapital > 0
                      ? `💡 Siapkan modal minimal ${formatRupiah(requiredCapital)} untuk produksi ${targetProduction.toLocaleString("id-ID")} unit.`
                      : "💡 Masukkan data untuk menghitung kebutuhan modal."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proyeksi Calculator */}
      {activeTab === "proyeksi" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#0F4C9A]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Kalkulator Proyeksi Keuntungan</h2>
                  <CalculatorGuideButton type="proyeksi" />
                </div>
                <p className="text-sm text-gray-500">Proyeksikan keuntungan dalam 12 bulan ke depan</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="monthlySales">Penjualan Bulanan (Rupiah)</Label>
                <NumberInput id="monthlySales" value={monthlySales} onChange={setMonthlySales} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="margin">Margin Keuntungan (%)</Label>
                <NumberInput id="margin" value={margin} onChange={setMargin} />
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hasil Proyeksi</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Proyeksi 12 Bulan</p>
                  <p className="text-2xl font-bold text-[#37B24D]">{formatRupiah(twelveMonthProjection)}</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-sm text-gray-500">Proyeksi per Bulan</p>
                  <p className="text-lg font-semibold text-gray-900">{formatRupiah(monthlyProjection)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Margin yang Digunakan</p>
                  <p className="text-lg font-semibold text-gray-900">{margin}%</p>
                </div>
                <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                  <p className="text-xs text-gray-500">
                    {twelveMonthProjection > 0
                      ? `💡 Dengan margin ${margin}%, proyeksi keuntungan 12 bulan adalah ${formatRupiah(twelveMonthProjection)}.`
                      : "💡 Masukkan data penjualan dan margin untuk melihat proyeksi."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

interface AssessmentInput {
  monthlyRevenue: number;
  priorRevenue: number;
  operatingCost: number;
  payrollCost: number;
  otherCost: number;
  totalDebt: number;
  monthlyInstallment: number;
  businessCapital: number;
  cashBalance: number;
}

export function calculateFinancialScore(data: AssessmentInput) {
  const totalCost = data.operatingCost + data.payrollCost + data.otherCost;
  const profitMargin = data.monthlyRevenue > 0 ? (data.monthlyRevenue - totalCost) / data.monthlyRevenue : 0;
  const cashRatio = data.operatingCost > 0 ? data.cashBalance / data.operatingCost : 0;
  const debtRatio = data.businessCapital > 0 ? data.totalDebt / data.businessCapital : 0;
  const growthRate = data.priorRevenue > 0 ? (data.monthlyRevenue - data.priorRevenue) / data.priorRevenue : 0;

  const profitabilityScore = profitMargin >= 0.3 ? 100 : profitMargin >= 0.2 ? 80 : profitMargin >= 0.1 ? 60 : profitMargin >= 0.05 ? 40 : 20;
  const liquidityScore = cashRatio >= 3 ? 100 : cashRatio >= 2 ? 80 : cashRatio >= 1 ? 60 : cashRatio >= 0.5 ? 40 : 20;
  const debtScore = debtRatio <= 0.3 ? 100 : debtRatio <= 0.5 ? 80 : debtRatio <= 0.7 ? 60 : debtRatio <= 1 ? 40 : 20;
  const growthScore = growthRate >= 0.2 ? 100 : growthRate >= 0.1 ? 80 : growthRate >= 0.05 ? 60 : growthRate >= 0 ? 40 : 20;

  const finalScore = Math.round(profitabilityScore * 0.3 + liquidityScore * 0.3 + debtScore * 0.2 + growthScore * 0.2);

  const category =
    finalScore >= 90 ? "Sangat Sehat" :
    finalScore >= 75 ? "Sehat" :
    finalScore >= 60 ? "Cukup Sehat" :
    finalScore >= 40 ? "Perlu Perbaikan" :
    "Risiko Tinggi";

  const strengths = [] as string[];
  const weaknesses = [] as string[];
  const recommendations = [] as string[];

  if (profitabilityScore >= 80) strengths.push("Margin laba sehat");
  else weaknesses.push("Margin laba belum optimal");

  if (liquidityScore >= 80) strengths.push("Cadangan kas memadai");
  else weaknesses.push("Rasio kas rendah");

  if (debtScore >= 80) strengths.push("Pengelolaan utang baik");
  else weaknesses.push("Beban utang tinggi");

  if (growthScore >= 80) strengths.push("Pertumbuhan pendapatan kuat");
  else weaknesses.push("Pertumbuhan pendapatan menurun");

  if (debtScore <= 80 && debtScore > 20) {
    recommendations.push("Kurangi rasio utang dan susun jadwal pelunasan.");
  }
  if (liquidityScore < 60) {
    recommendations.push("Bangun cadangan kas minimal 3 bulan biaya operasional.");
  }
  if (profitabilityScore < 60) {
    recommendations.push("Perbaiki struktur harga dan kurangi biaya tidak produktif.");
  }
  if (growthScore < 60) {
    recommendations.push("Buat strategi pemasaran dan pendapatan baru untuk mempercepat pertumbuhan.");
  }
  if (finalScore >= 80) {
    recommendations.push("Pertahankan proses bisnis dan rencanakan ekspansi secara bertahap.");
  }

  return {
    profitabilityScore,
    liquidityScore,
    debtScore,
    growthScore,
    finalScore,
    category,
    strengths,
    weaknesses,
    recommendations,
    profitMargin,
    cashRatio,
    debtRatio,
    growthRate,
  };
}

export function generateRoadmapFromScore(score: number) {
  if (score < 60) {
    return {
      target3Months: "Pisahkan rekening pribadi dan usaha; buat laporan arus kas mingguan.",
      target6Months: "Kurangi rasio utang hingga 20%; kembangkan anggaran rutin.",
      target1Year: "Tingkatkan profit margin menjadi 20%; persiapkan akses pembiayaan bank.",
    };
  }

  if (score >= 80) {
    return {
      target3Months: "Optimalkan investasi usaha dan dokumentasi keuangan.",
      target6Months: "Ekspansi pemasaran dengan proyek digital.",
      target1Year: "Persiapan akses pembiayaan bank dan peningkatan kapasitas produksi.",
    };
  }

  return {
    target3Months: "Rencanakan penguatan kas dan kontrol biaya operasi.",
    target6Months: "Susun strategi peningkatan margin dan kelola utang.",
    target1Year: "Bangun sistem laporan keuangan dan persiapkan skala usaha.",
  };
}

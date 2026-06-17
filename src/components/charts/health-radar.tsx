"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface HealthRadarProps {
  profitabilityScore: number;
  liquidityScore: number;
  debtScore: number;
  growthScore: number;
}

export function HealthRadar({ profitabilityScore, liquidityScore, debtScore, growthScore }: HealthRadarProps) {
  const data = [
    { subject: "Profitability", A: profitabilityScore, fullMark: 100 },
    { subject: "Liquidity", A: liquidityScore, fullMark: 100 },
    { subject: "Debt", A: debtScore, fullMark: 100 },
    { subject: "Growth", A: growthScore, fullMark: 100 },
  ];

  return (
    <div className="h-80 w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-950">Radar Skor Keuangan</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius={90}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Skor" dataKey="A" stroke="#0f766e" fill="#0f766e" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

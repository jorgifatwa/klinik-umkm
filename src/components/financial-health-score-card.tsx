"use client";

import { useMemo } from "react";

type ScoreColor = {
  color: string;
  bg: string;
  border: string;
  label: string;
};

function getScoreColor(score: number): ScoreColor {
  if (score >= 90) return { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", label: "Sangat Sehat" };
  if (score >= 75) return { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", label: "Sehat" };
  if (score >= 60) return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Cukup Sehat" };
  if (score >= 40) return { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", label: "Perlu Perhatian" };
  return { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Kurang Sehat" };
}

interface FinancialHealthScoreCardProps {
  score: number;
  category?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLink?: boolean;
  linkHref?: string;
  linkLabel?: string;
  variant?: "card" | "inline";
}

export function FinancialHealthScoreCard({
  score,
  category,
  size,
  strokeWidth = 8,
  className = "",
  showLink = false,
  linkHref = "/dashboard/financial-health",
  linkLabel = "Lihat Detail →",
  variant = "card",
}: FinancialHealthScoreCardProps) {
  const scoreInfo = useMemo(() => {
    const colors = getScoreColor(score);
    return {
      ...colors,
      displayLabel: category || colors.label,
    };
  }, [score, category]);

  // Inline variant uses smaller sizing
  const isInline = variant === "inline";
  const ringSize = size ?? (isInline ? 80 : 110);
  const ringStroke = isInline ? 6 : strokeWidth;

  const radius = (ringSize - ringStroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  // Card variant: the original white card with border/shadow
  if (!isInline) {
    return (
      <div
        className={`flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
        style={{ width: 220 }}
      >
        {/* Label */}
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 text-center">
          Financial Health Score
        </p>

        {/* Ring + Score */}
        <div className="mt-4 flex flex-col items-center gap-3">
          <div
            className="relative flex items-center justify-center"
            style={{ width: ringSize, height: ringSize }}
          >
            <svg
              width={ringSize}
              height={ringSize}
              style={{ transform: "rotate(-90deg)" }}
              className="absolute inset-0"
            >
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth={ringStroke}
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke={scoreInfo.color}
                strokeWidth={ringStroke}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="flex flex-col items-center leading-none">
              <span
                className="font-extrabold tracking-tight"
                style={{ color: scoreInfo.color, fontSize: ringSize >= 100 ? "32px" : "24px", lineHeight: 1 }}
              >
                {score}
              </span>
              <span
                className="mt-0.5 font-semibold"
                style={{ color: scoreInfo.color + "99", fontSize: "11px" }}
              >
                /100
              </span>
            </div>
          </div>
        </div>

        {/* Badge */}
        <span
          className="mt-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border"
          style={{
            backgroundColor: scoreInfo.bg,
            color: scoreInfo.color,
            borderColor: scoreInfo.border,
          }}
        >
          {scoreInfo.displayLabel}
        </span>

        {/* Link */}
        {showLink && (
          <a
            href={linkHref}
            className="mt-3 text-[11.5px] font-semibold text-[#0F4C9A] hover:underline transition-colors"
          >
            {linkLabel}
          </a>
        )}
      </div>
    );
  }

  // Inline variant: compact, no card wrapper, designed to sit inside the hero
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Ring + Score */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: ringSize, height: ringSize }}
      >
        <svg
          width={ringSize}
          height={ringSize}
          style={{ transform: "rotate(-90deg)" }}
          className="absolute inset-0"
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={ringStroke}
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke={scoreInfo.color}
            strokeWidth={ringStroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="flex flex-col items-center leading-none">
          <span
            className="font-extrabold tracking-tight text-white"
            style={{ fontSize: ringSize >= 80 ? "28px" : "20px", lineHeight: 1 }}
          >
            {score}
          </span>
          <span
            className="mt-0.5 font-semibold"
            style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}
          >
            /100
          </span>
        </div>
      </div>

      {/* Badge */}
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
        style={{
          backgroundColor: scoreInfo.color + "20",
          color: scoreInfo.color,
        }}
      >
        {scoreInfo.displayLabel}
      </span>

      {/* Subtle link */}
      {showLink && (
        <a
          href={linkHref}
          className="text-[11px] font-medium transition-colors"
          style={{ color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        >
          {linkLabel}
        </a>
      )}
    </div>
  );
}

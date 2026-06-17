import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "secondary";
}

const badgeStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-slate-100 text-slate-900",
  success: "bg-emerald-100 text-emerald-900",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-rose-100 text-rose-900",
  secondary: "bg-slate-200 text-slate-950",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", badgeStyles[variant], className)} {...props} />;
}

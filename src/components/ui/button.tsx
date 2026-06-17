import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-[#0F4C9A] text-white shadow-sm hover:bg-[#0A3A75] active:bg-[#082E5E]",
  outline:
    "border border-gray-200 bg-white text-[#0F4C9A] shadow-sm hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200",
  secondary:
    "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-5 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-7 text-base",
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E73D8] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
}

export function Separator({ className, vertical, ...props }: SeparatorProps) {
  return (
    <div
      className={cn(
        vertical ? "mx-4 h-full w-px bg-slate-200" : "my-6 h-px w-full bg-slate-200",
        className,
      )}
      {...props}
    />
  );
}

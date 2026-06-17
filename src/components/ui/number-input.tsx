"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  value?: number;
  onChange?: (value: number) => void;
  /** Locale for formatting, default: "id-ID" */
  locale?: string;
}

// ── Locale Separator Detection ───────────────────────────────────────────────
type Separators = { group: string; decimal: string };

function detectSeparators(locale: string): Separators {
  const sample = new Intl.NumberFormat(locale).format(1111.1);
  if (sample.includes(",") && sample.includes(".")) {
    if (sample.lastIndexOf(",") < sample.lastIndexOf(".")) {
      return { group: ",", decimal: "." };
    }
    return { group: ".", decimal: "," };
  }
  return { group: ".", decimal: "," };
}

function applyGroupSeparator(intPart: string, groupSep: string): string {
  if (intPart.length <= 3) return intPart;
  const chars = intPart.split("");
  const result: string[] = [];
  for (let i = chars.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      result.push(groupSep);
    }
    result.push(chars[i]);
  }
  return result.reverse().join("");
}

function formatDisplay(raw: string, sep: Separators): string {
  if (!raw) return "";
  const decimalIdx = raw.indexOf(sep.decimal);
  let intPart: string;
  let decPart: string;
  if (decimalIdx === -1) {
    intPart = raw;
    decPart = "";
  } else {
    intPart = raw.slice(0, decimalIdx);
    decPart = raw.slice(decimalIdx + 1);
  }
  if (intPart.length > 1) {
    intPart = intPart.replace(/^0+/, "");
  }
  if (intPart === "") intPart = "0";
  const formattedInt = applyGroupSeparator(intPart, sep.group);
  if (decimalIdx !== -1) {
    return formattedInt + sep.decimal + decPart;
  }
  return formattedInt;
}

function parseFormattedNumber(display: string, sep: Separators): number {
  if (!display) return 0;
  let cleaned = display;
  if (sep.decimal === ",") {
    cleaned = display.replace(/\./g, "").replace(",", ".");
  } else {
    cleaned = display.replace(/,/g, "");
  }
  cleaned = cleaned.replace(/[^0-9.\-]/g, "");
  return parseFloat(cleaned) || 0;
}

/** Strip formatting chars, keep only digits + decimal separator */
function stripToRaw(input: string, sep: Separators): string {
  const allowed = new Set(["0","1","2","3","4","5","6","7","8","9", sep.decimal]);
  let result = "";
  let decimalSeen = false;
  for (const ch of input) {
    if (ch === sep.decimal) {
      if (decimalSeen) continue;
      decimalSeen = true;
      result += ch;
    } else if (allowed.has(ch)) {
      result += ch;
    }
  }
  return result;
}

// ── Component ────────────────────────────────────────────────────────────────
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value = 0, onChange, locale = "id-ID", min, max, disabled, placeholder, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const sep = React.useMemo(() => detectSeparators(locale), [locale]);
    const [raw, setRaw] = React.useState(() => (value !== 0 ? String(value) : ""));
    const cursorRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      setRaw(value !== 0 ? String(value) : "");
    }, [value]);

    // Restore cursor after re-render
    React.useLayoutEffect(() => {
      if (cursorRef.current !== null && inputRef.current) {
        inputRef.current.setSelectionRange(cursorRef.current, cursorRef.current);
        cursorRef.current = null;
      }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputEl = e.target;
      const cursorPos = inputEl.selectionStart ?? 0;

      // Count how many digits were before cursor in the CURRENT (formatted) value
      const currentFormatted = inputEl.value;
      const digitsBeforeCursor = currentFormatted.slice(0, cursorPos).replace(/[^0-9]/g, "").length;

      // Strip formatting to get raw value
      const newRaw = stripToRaw(currentFormatted, sep);

      // Enforce min/max
      const numericValue = parseFormattedNumber(formatDisplay(newRaw, sep), sep);
      if (min !== undefined && numericValue < Number(min)) return;
      if (max !== undefined && numericValue > Number(max)) return;

      // Build new formatted display
      const newFormatted = formatDisplay(newRaw, sep);

      // Count digits in newFormatted to know where cursor should be
      // We want cursor right after the (digitsBeforeCursor)-th digit in newFormatted
      let digitCount = 0;
      let newCursor = newFormatted.length;
      for (let i = 0; i < newFormatted.length; i++) {
        if (/[0-9]/.test(newFormatted[i])) {
          digitCount++;
          if (digitCount === digitsBeforeCursor) {
            newCursor = i + 1;
            break;
          }
        }
      }
      // If digitsBeforeCursor is 0, cursor stays at start
      if (digitsBeforeCursor === 0) {
        newCursor = 0;
      }

      setRaw(newRaw);
      cursorRef.current = newCursor;

      onChange?.(numericValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
        "Backspace", "Delete", "Tab", "Escape", "Enter",
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        "Home", "End",
      ];
      if (allowedKeys.includes(e.key)) return;
      if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) return;
      if (/^\d$/.test(e.key)) return;
      if (e.key === sep.decimal) return;
      e.preventDefault();
    };

    const displayValue = formatDisplay(raw, sep);

    return (
      <input
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="text"
        inputMode="numeric"
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || (value === 0 ? "0" : "")}
        disabled={disabled}
        autoComplete="off"
        {...props}
      />
    );
  },
);
NumberInput.displayName = "NumberInput";
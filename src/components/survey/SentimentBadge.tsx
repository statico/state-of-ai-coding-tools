"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, CheckIcon, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentBadgeProps {
  value: number;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function SentimentBadge({
  value,
  label,
  isSelected,
  onClick,
}: SentimentBadgeProps) {
  const isPositive = value === 1;
  const isNeutral = value === 0;
  const isNegative = value === -1;

  return (
    <Badge
      variant="outline"
      className={cn(
        "relative cursor-pointer overflow-visible px-2 py-0.5 text-sm transition-colors select-none",
        isSelected
          ? isPositive
            ? "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-600"
            : isNeutral
              ? "border-slate-500 bg-slate-500 text-white dark:border-slate-400 dark:bg-slate-600"
              : "border-rose-500 bg-rose-500 text-white dark:border-rose-400 dark:bg-rose-600"
          : isPositive
            ? "border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/40"
            : isNeutral
              ? "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-900/30 dark:text-slate-300 dark:hover:bg-slate-800/40"
              : "border-rose-300 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-800/40",
      )}
      onClick={onClick}
    >
      {isPositive ? (
        <ArrowUp className="h-3 w-3" />
      ) : isNeutral ? (
        <Minus className="h-3 w-3" />
      ) : (
        <ArrowDown className="h-3 w-3" />
      )}{" "}
      {label}
      {isSelected && (
        <span
          className={cn(
            "absolute -top-2 -right-2 z-10 flex h-4 w-4 items-center justify-center rounded-full border bg-white text-xs font-bold shadow-sm",
            isPositive
              ? "border-emerald-200 text-emerald-600"
              : isNeutral
                ? "border-slate-200 text-slate-600"
                : "border-rose-200 text-rose-600",
          )}
        >
          <CheckIcon className="h-3 w-3" />
        </span>
      )}
    </Badge>
  );
}

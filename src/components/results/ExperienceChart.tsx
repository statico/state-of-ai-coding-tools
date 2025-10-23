"use client";

import { ExperienceChartCell } from "./ExperienceChartCell";
import { cn } from "@/lib/utils";

interface ExperienceChartProps {
  breakdown: Array<{
    awareness: string;
    awarenessValue: number;
    awarenessCount: number;
    sentimentBreakdown: Array<{
      sentiment: string;
      count: number;
      percentage: number;
    }>;
  }>;
  actualResponses: number;
}

export function ExperienceChart({
  breakdown,
  actualResponses,
}: ExperienceChartProps) {
  if (breakdown.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No data</p>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-2">
      {breakdown
        .filter((item) => item.awarenessCount > 0)
        .map((item) => (
          <ExperienceChartCell
            key={item.awareness}
            item={item}
            actualResponses={actualResponses}
          />
        ))}
    </div>
  );
}

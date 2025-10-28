"use client";

import { ExperienceChartCell } from "./ExperienceChartCell";
import { cn } from "@/lib/utils";

interface ExperienceChartProps {
  breakdown: Array<{
    awareness?: string;
    awarenessValue?: number;
    awarenessCount?: number;
    sentimentBreakdown?: Array<{
      sentiment: string;
      count: number;
      percentage: number;
    }>;
    // New fields for sentiment grouping
    sentiment?: string;
    sentimentValue?: number;
    sentimentCount?: number;
    awarenessBreakdown?: Array<{
      awareness: string;
      awarenessValue: number;
      awarenessCount: number;
      percentage: number;
    }>;
  }>;
  actualResponses: number;
  groupBy?: "awareness" | "sentiment";
}

export function ExperienceChart({
  breakdown,
  actualResponses,
  groupBy = "awareness",
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
      {groupBy === "awareness"
        ? // Original awareness grouping
          breakdown
            .filter((item) => item.awarenessCount && item.awarenessCount > 0)
            .map((item) => (
              <ExperienceChartCell
                key={item.awareness}
                item={item}
                actualResponses={actualResponses}
                groupBy="awareness"
              />
            ))
        : // New sentiment grouping
          breakdown
            .filter((item) => item.sentimentCount && item.sentimentCount > 0)
            .map((item) => (
              <ExperienceChartCell
                key={item.sentiment}
                item={item}
                actualResponses={actualResponses}
                groupBy="sentiment"
              />
            ))}
    </div>
  );
}

"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AWARENESS_LABELS, AWARENESS_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

// Color mappings based on awareness level values
const AWARENESS_COLOR_MAP = {
  0: "bg-zinc-400 dark:bg-zinc-500", // Never heard of it
  1: "bg-cyan-400 dark:bg-cyan-500", // Heard of it
  2: "bg-blue-400 dark:bg-blue-500", // Used it in the past
  3: "bg-indigo-400 dark:bg-indigo-500", // Actively using it
} as const;

// Color mappings based on sentiment values
const SENTIMENT_COLOR_MAP = {
  positive: "bg-emerald-400 dark:bg-emerald-500",
  neutral: "bg-zinc-400 dark:bg-zinc-500",
  negative: "bg-rose-400 dark:bg-rose-500",
} as const;

interface ExperienceChartCellProps {
  item: {
    awareness?: string;
    awarenessValue?: number;
    awarenessCount?: number;
    sentimentBreakdown?: Array<{
      sentiment: string;
      count: number;
      percentage: number;
    }>;
    sentiment?: string;
    sentimentValue?: number;
    sentimentCount?: number;
    awarenessBreakdown?: Array<{
      awareness: string;
      awarenessValue: number;
      awarenessCount: number;
      percentage: number;
    }>;
  };
  actualResponses: number;
  groupBy?: "awareness" | "sentiment";
}

export function ExperienceChartCell({
  item,
  actualResponses,
  groupBy = "awareness",
}: ExperienceChartCellProps) {
  if (groupBy === "awareness") {
    const percentage = Math.round(
      ((item.awarenessCount || 0) / actualResponses) * 100,
    );

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="cursor-pointer space-y-1"
            style={{
              width: `${((item.awarenessCount || 0) / actualResponses) * 100}%`,
            }}
          >
            <div
              className={cn(
                "flex h-8 items-center justify-center overflow-hidden rounded-xs p-1 text-xs lg:h-10",
                AWARENESS_COLOR_MAP[
                  (item.awarenessValue || 0) as keyof typeof AWARENESS_COLOR_MAP
                ],
              )}
            >
              {percentage}%
            </div>

            <div className="flex w-full gap-1">
              {item.sentimentBreakdown
                ?.filter((sentiment) => sentiment.count > 0)
                .map((sentiment) => (
                  <div
                    key={sentiment.sentiment}
                    className={cn(
                      "h-2 overflow-hidden rounded-xs",
                      SENTIMENT_COLOR_MAP[
                        sentiment.sentiment as keyof typeof SENTIMENT_COLOR_MAP
                      ],
                    )}
                    style={{
                      width: `${(sentiment.percentage / 100) * 100}%`,
                    }}
                  ></div>
                ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="font-bold">
              {
                AWARENESS_LABELS[
                  (item.awarenessValue || 0) as keyof typeof AWARENESS_LABELS
                ]
              }
            </div>
            <div className="text-right font-bold">{percentage.toFixed(1)}%</div>
            <div className="flex items-center justify-end gap-1 font-bold">
              {(item.awarenessCount || 0).toLocaleString()}
              <User className="h-3 w-3" />
            </div>

            <div className="col-span-3 border-b"></div>

            {item.sentimentBreakdown?.map((sentiment) => (
              <React.Fragment key={sentiment.sentiment}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      SENTIMENT_COLOR_MAP[
                        sentiment.sentiment as keyof typeof SENTIMENT_COLOR_MAP
                      ],
                    )}
                  />
                  <span className="text-muted-foreground capitalize">
                    {sentiment.sentiment}:
                  </span>
                </div>
                <div className="text-right">
                  {sentiment.percentage.toFixed(1)}%{" "}
                </div>
                <div className="flex items-center justify-end gap-1">
                  {sentiment.count.toLocaleString()}
                  <User className="h-3 w-3" />
                </div>
              </React.Fragment>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  } else {
    const percentage = Math.round(
      ((item.sentimentCount || 0) / actualResponses) * 100,
    );

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="cursor-pointer space-y-1"
            style={{
              width: `${((item.sentimentCount || 0) / actualResponses) * 100}%`,
            }}
          >
            <div className="flex w-full gap-1">
              {item.awarenessBreakdown
                ?.filter((awareness) => awareness.awarenessCount > 0)
                .map((awareness) => (
                  <div
                    key={awareness.awareness}
                    className={cn(
                      "h-8 overflow-hidden rounded-xs lg:h-10",
                      AWARENESS_COLOR_MAP[
                        awareness.awarenessValue as keyof typeof AWARENESS_COLOR_MAP
                      ],
                    )}
                    style={{
                      width: `${(awareness.percentage / 100) * 100}%`,
                    }}
                  >
                    <div className="flex h-full items-center justify-center text-xs">
                      {Math.round(awareness.percentage)}%
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex w-full gap-1">
              <div
                className={cn(
                  "h-2 overflow-hidden rounded-xs",
                  SENTIMENT_COLOR_MAP[
                    (
                      item.sentiment || "neutral"
                    ).toLowerCase() as keyof typeof SENTIMENT_COLOR_MAP
                  ],
                )}
                style={{
                  width: "100%",
                }}
              ></div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="font-bold">{item.sentiment}</div>
            <div className="text-right font-bold">{percentage.toFixed(1)}%</div>
            <div className="flex items-center justify-end gap-1 font-bold">
              {(item.sentimentCount || 0).toLocaleString()}
              <User className="h-3 w-3" />
            </div>

            <div className="col-span-3 border-b"></div>

            {item.awarenessBreakdown?.map((awareness) => (
              <React.Fragment key={awareness.awareness}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      AWARENESS_COLOR_MAP[
                        awareness.awarenessValue as keyof typeof AWARENESS_COLOR_MAP
                      ],
                    )}
                  />
                  <span className="text-muted-foreground">
                    {awareness.awareness}:
                  </span>
                </div>
                <div className="text-right">
                  {awareness.percentage.toFixed(1)}%{" "}
                </div>
                <div className="flex items-center justify-end gap-1">
                  {awareness.awarenessCount.toLocaleString()}
                  <User className="h-3 w-3" />
                </div>
              </React.Fragment>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }
}

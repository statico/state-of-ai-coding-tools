"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import {
  AWARENESS_OPTIONS,
  AWARENESS_SHORT_LABELS,
  SENTIMENT_SHORT_LABELS,
} from "@/lib/constants";
import { ChevronDown, ChevronUp } from "lucide-react";

// Color mappings for awareness levels (matching ExperienceChartCell)
const AWARENESS_COLOR_MAP = {
  0: "bg-zinc-400 dark:bg-zinc-500", // Never heard of it
  1: "bg-cyan-400 dark:bg-cyan-500", // Heard of it
  2: "bg-blue-400 dark:bg-blue-500", // Used it in the past
  3: "bg-indigo-400 dark:bg-indigo-500", // Actively using it
} as const;

export type GroupByOption = "awareness" | "sentiment";
export type SortDirection = "asc" | "desc";

interface ExperienceControlsProps {
  groupBy: GroupByOption;
  onGroupByChange: (groupBy: GroupByOption) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: SortDirection) => void;
}

export function ExperienceControls({
  groupBy,
  onGroupByChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
}: ExperienceControlsProps) {
  const handleSortOptionClick = (optionValue: string) => {
    if (sortBy === optionValue) {
      // Toggle direction if same option is clicked
      onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new option with default direction
      onSortByChange(optionValue);
      onSortDirectionChange("desc");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-6">
      <span className="text-muted-foreground text-sm">Sort:</span>

      {/* Group By Controls */}
      <ButtonGroup>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onGroupByChange("awareness")}
          className={cn("truncate", groupBy === "awareness" && "bg-accent!")}
        >
          Awareness
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onGroupByChange("sentiment")}
          className={cn("truncate", groupBy === "sentiment" && "bg-accent!")}
        >
          Sentiment
        </Button>
      </ButtonGroup>

      {/* Sort By Controls */}
      <ButtonGroup>
        {groupBy === "awareness"
          ? [...AWARENESS_OPTIONS].reverse().map((option) => {
              const isSelected = sortBy === option.value.toString();
              return (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortOptionClick(option.value.toString())}
                  className={cn(
                    "flex items-center gap-2 truncate",
                    isSelected && "bg-accent!",
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      AWARENESS_COLOR_MAP[
                        option.value as keyof typeof AWARENESS_COLOR_MAP
                      ],
                    )}
                  />
                  <span className="truncate">
                    {
                      AWARENESS_SHORT_LABELS[
                        option.value as keyof typeof AWARENESS_SHORT_LABELS
                      ]
                    }
                  </span>
                  {isSelected && (
                    <span className="ml-1 shrink-0">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </Button>
              );
            })
          : // Reverse sentiment options to match chart order
            [1, 0, -1].map((sentimentValue) => {
              const sentimentLabel =
                SENTIMENT_SHORT_LABELS[
                  sentimentValue as keyof typeof SENTIMENT_SHORT_LABELS
                ];
              const isSelected =
                groupBy === "sentiment" && sortBy === sentimentValue.toString();
              return (
                <Button
                  key={sentimentValue}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSortOptionClick(sentimentValue.toString())
                  }
                  className={cn(
                    "flex items-center gap-2 truncate",
                    isSelected && "bg-accent!",
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      sentimentValue === 1
                        ? "bg-emerald-400 dark:bg-emerald-500"
                        : sentimentValue === 0
                          ? "bg-zinc-400 dark:bg-zinc-500"
                          : "bg-rose-400 dark:bg-rose-500",
                    )}
                  />
                  <span className="truncate">{sentimentLabel}</span>
                  {isSelected && (
                    <span className="ml-1 shrink-0">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </Button>
              );
            })}
      </ButtonGroup>
    </div>
  );
}

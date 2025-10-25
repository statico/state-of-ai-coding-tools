"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SentimentBadge } from "./SentimentBadge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MarkdownText } from "@/components/ui/markdown-text";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  AWARENESS_OPTIONS,
  SENTIMENT_OPTIONS,
  INTEREST_OPTIONS,
} from "@/lib/constants";

interface OptionState {
  awareness: number | undefined;
  sentiment: number | undefined;
}

interface ExperienceOptionProps {
  option: {
    slug: string;
    label: string;
  };
  state: OptionState;
  isSkipped: boolean;
  onAwarenessChange: (optionSlug: string, value: string) => void;
  onSentimentChange: (optionSlug: string, value: string) => void;
}

export function ExperienceOption({
  option,
  state,
  isSkipped,
  onAwarenessChange,
  onSentimentChange,
}: ExperienceOptionProps) {
  const [hoveredAwarenessLevel, setHoveredAwarenessLevel] = useState<
    number | null
  >(null);

  const getSentimentOptions = (awarenessLevel?: number) => {
    if (awarenessLevel === 0 || awarenessLevel === 1) {
      return INTEREST_OPTIONS;
    } else if (awarenessLevel === 2 || awarenessLevel === 3) {
      return SENTIMENT_OPTIONS;
    }
    return [];
  };

  return (
    <Card
      className={cn(isSkipped && "opacity-50")}
      onMouseLeave={() => setHoveredAwarenessLevel(null)}
    >
      <CardContent className="px-6">
        <div className="space-y-4">
          {/* Option header */}
          <h4 className="text-foreground text-xl font-medium">
            <MarkdownText>{option.label}</MarkdownText>
          </h4>

          {/* Awareness Level with inline badges */}
          <div className="flex flex-col">
            <RadioGroup
              value={state.awareness?.toString()}
              onValueChange={(value) => onAwarenessChange(option.slug, value)}
              disabled={isSkipped}
              onClick={(e) => e.stopPropagation()}
              className="gap-0"
            >
              {AWARENESS_OPTIONS.map((awarenessOption, index) => {
                const showBadges =
                  state.awareness === awarenessOption.value ||
                  hoveredAwarenessLevel === awarenessOption.value;
                const sentimentOptions = getSentimentOptions(
                  awarenessOption.value,
                );

                return (
                  <div
                    key={awarenessOption.value}
                    className={cn(
                      "hover:bg-muted/50 flex cursor-pointer items-center space-x-4 rounded-md p-3 transition-colors",
                      index % 2 === 1 && "bg-muted/20",
                    )}
                    onMouseEnter={() =>
                      setHoveredAwarenessLevel(awarenessOption.value)
                    }
                    onClick={(e) => {
                      // Don't trigger if clicking on the radio button or label
                      if (
                        e.target ===
                          e.currentTarget.querySelector(
                            'input[type="radio"]',
                          ) ||
                        e.target === e.currentTarget.querySelector("label")
                      ) {
                        return;
                      }

                      if (!isSkipped) {
                        onAwarenessChange(
                          option.slug,
                          awarenessOption.value.toString(),
                        );
                      }
                    }}
                  >
                    <RadioGroupItem
                      value={awarenessOption.value.toString()}
                      id={`${option.slug}-awareness-${awarenessOption.value}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="flex flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-6">
                        <Label
                          htmlFor={`${option.slug}-awareness-${awarenessOption.value}`}
                          className="cursor-pointer py-2 text-base"
                        >
                          {awarenessOption.label}
                        </Label>
                        {showBadges && sentimentOptions.length > 0 && (
                          <div
                            className={cn(
                              "ml-0 flex gap-4 sm:ml-0",
                              state.awareness !== awarenessOption.value &&
                                "opacity-80",
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {sentimentOptions.map((sentimentOption) => (
                              <SentimentBadge
                                key={sentimentOption.value}
                                value={sentimentOption.value}
                                label={sentimentOption.label}
                                isSelected={
                                  state.awareness === awarenessOption.value &&
                                  state.sentiment === sentimentOption.value
                                }
                                onClick={() => {
                                  // First select the awareness level if it's not already selected
                                  if (
                                    state.awareness !== awarenessOption.value
                                  ) {
                                    onAwarenessChange(
                                      option.slug,
                                      awarenessOption.value.toString(),
                                    );
                                  }
                                  // Then set the sentiment
                                  onSentimentChange(
                                    option.slug,
                                    sentimentOption.value.toString(),
                                  );
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

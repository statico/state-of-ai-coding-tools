"use client";

import { Button } from "@/components/ui/button";
import { SentimentBadge } from "./SentimentBadge";
import { Card, CardContent } from "@/components/ui/card";
import { CommentSection } from "./CommentSection";
import { SkipButton } from "./SkipButton";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  QuestionWithOptions,
  ResponseData,
  ClientResponse,
  AWARENESS_OPTIONS,
  SENTIMENT_OPTIONS,
  INTEREST_OPTIONS,
} from "@/lib/constants";

interface ExperienceQuestionProps {
  question: QuestionWithOptions;
  existingResponses?: ClientResponse[];
  onResponseChange: (data: ResponseData[]) => void;
}

interface OptionState {
  awareness: number | undefined;
  sentiment: number | undefined;
}

export function ExperienceQuestion({
  question,
  existingResponses = [],
  onResponseChange,
}: ExperienceQuestionProps) {
  // Initialize state for each option
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>(
    () => {
      const states: Record<string, OptionState> = {};
      question.options?.forEach((option) => {
        const existingResponse = existingResponses.find(
          (r) => r.single_option_slug === option.slug,
        );
        states[option.slug] = {
          awareness: existingResponse?.experience_awareness ?? undefined,
          sentiment: existingResponse?.experience_sentiment ?? undefined,
        };
      });
      return states;
    },
  );

  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponses.some((r) => r.skipped) || false,
  );
  const [comment, setComment] = useState<string>(
    () => existingResponses[0]?.comment ?? "",
  );

  // Track previous response data to prevent unnecessary calls
  const prevResponseDataRef = useRef<ResponseData[]>([]);

  const handleAwarenessChange = (optionSlug: string, value: string) => {
    const awarenessValue = parseInt(value);
    setOptionStates((prev) => ({
      ...prev,
      [optionSlug]: {
        ...prev[optionSlug],
        awareness: awarenessValue,
        sentiment: undefined, // Reset sentiment when awareness changes
      },
    }));
    setIsSkipped(false);
  };

  const handleSentimentChange = (optionSlug: string, value: string) => {
    const sentimentValue = value === "" ? undefined : parseInt(value);
    setOptionStates((prev) => ({
      ...prev,
      [optionSlug]: {
        ...prev[optionSlug],
        sentiment: sentimentValue,
      },
    }));
    setIsSkipped(false);
  };

  const handleSkip = () => {
    if (isSkipped) {
      setIsSkipped(false);
    } else {
      setIsSkipped(true);
      // Clear all option states when skipping
      setOptionStates((prev) => {
        const newStates: Record<string, OptionState> = {};
        Object.keys(prev).forEach((key) => {
          newStates[key] = { awareness: undefined, sentiment: undefined };
        });
        return newStates;
      });
    }
  };

  const handleCommentChange = useCallback((newComment: string) => {
    setComment(newComment);
  }, []);

  const getSentimentOptions = (awarenessLevel?: number) => {
    if (awarenessLevel === 0 || awarenessLevel === 1) {
      return INTEREST_OPTIONS;
    } else if (awarenessLevel === 2) {
      return SENTIMENT_OPTIONS;
    }
    return [];
  };

  // Notify parent of changes
  useEffect(() => {
    let responses: ResponseData[] = [];

    if (isSkipped) {
      responses = [];
    } else {
      Object.entries(optionStates).forEach(([optionSlug, state]) => {
        if (state.awareness !== undefined) {
          responses.push({
            optionSlug: optionSlug,
            experienceAwareness: state.awareness,
            experienceSentiment: state.sentiment,
            skipped: false,
            comment,
          } as ResponseData);
        }
      });
    }

    // Only call onResponseChange if the data has actually changed
    const hasChanged =
      JSON.stringify(responses) !== JSON.stringify(prevResponseDataRef.current);
    if (hasChanged) {
      prevResponseDataRef.current = responses;
      onResponseChange(responses);
    }
  }, [optionStates, isSkipped, comment, onResponseChange]);

  // Shuffle options if randomize is enabled
  const [displayOptions] = useState(() => {
    if (question.randomize && question.options) {
      return [...question.options].sort(() => Math.random() - 0.5);
    }
    return question.options || [];
  });

  return (
    <div className="space-y-6">
      {/* Question title and description outside of card */}
      <div className="space-y-2">
        <h3 className="text-foreground text-lg font-semibold">
          {question.title}
        </h3>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </div>

      {/* Individual cards for each option */}
      <div className="space-y-6">
        {displayOptions.map((option) => {
          const state = optionStates[option.slug] || {
            awareness: undefined,
            sentiment: undefined,
          };

          return (
            <Card
              key={option.slug}
              className={cn(
                "hover:bg-muted/50 cursor-pointer transition-colors",
                isSkipped && "opacity-50",
              )}
              onClick={() => {
                if (!isSkipped) {
                  // Cycle through awareness levels or reset to undefined
                  const currentAwareness = state.awareness;
                  let newAwareness: number | undefined;

                  if (currentAwareness === undefined) {
                    newAwareness = 0; // Start with "Never heard of it"
                  } else if (currentAwareness < 2) {
                    newAwareness = currentAwareness + 1; // Move to next level
                  } else {
                    newAwareness = undefined; // Reset to unselected
                  }

                  handleAwarenessChange(
                    option.slug,
                    newAwareness?.toString() || "",
                  );
                }
              }}
            >
              <CardContent className="px-6">
                <div className="space-y-4">
                  {/* Option header */}
                  <h4 className="text-foreground text-xl font-medium">
                    {option.label}
                  </h4>

                  {/* Awareness Level with inline badges */}
                  <div className="flex flex-col gap-3">
                    <RadioGroup
                      value={state.awareness?.toString()}
                      onValueChange={(value) =>
                        handleAwarenessChange(option.slug, value)
                      }
                      disabled={isSkipped}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {AWARENESS_OPTIONS.map((awarenessOption) => {
                        const showBadges =
                          state.awareness === awarenessOption.value;
                        const sentimentOptions = getSentimentOptions(
                          awarenessOption.value,
                        );

                        return (
                          <div
                            key={awarenessOption.value}
                            className="flex items-center space-x-4 p-2"
                          >
                            <RadioGroupItem
                              value={awarenessOption.value.toString()}
                              id={`${option.slug}-awareness-${awarenessOption.value}`}
                            />
                            <div className="flex-1">
                              <div className="flex flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-6">
                                <Label
                                  htmlFor={`${option.slug}-awareness-${awarenessOption.value}`}
                                  className="py-2 text-base"
                                >
                                  {awarenessOption.label}
                                </Label>
                                {showBadges && sentimentOptions.length > 0 && (
                                  <div
                                    className="ml-0 flex gap-4 sm:ml-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {sentimentOptions.map((sentimentOption) => (
                                      <SentimentBadge
                                        key={sentimentOption.value}
                                        value={sentimentOption.value}
                                        label={sentimentOption.label}
                                        isSelected={
                                          state.sentiment ===
                                          sentimentOption.value
                                        }
                                        onClick={() => {
                                          // If this option is already selected, deselect it (set to neutral)
                                          if (
                                            state.sentiment ===
                                            sentimentOption.value
                                          ) {
                                            handleSentimentChange(
                                              option.slug,
                                              "",
                                            );
                                          } else {
                                            handleSentimentChange(
                                              option.slug,
                                              sentimentOption.value.toString(),
                                            );
                                          }
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
        })}
      </div>

      {/* Comment section and skip button */}
      <div className="space-y-4">
        <CommentSection
          initialComment={comment}
          onCommentChange={handleCommentChange}
          disabled={isSkipped}
          hasResponse={Object.values(optionStates).some(
            (state) => state.awareness !== undefined,
          )}
        />

        <div className="flex justify-end">
          <SkipButton isSkipped={isSkipped} onSkip={handleSkip} />
        </div>
      </div>
    </div>
  );
}

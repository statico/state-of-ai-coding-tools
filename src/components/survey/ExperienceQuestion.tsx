"use client";

import { Button } from "@/components/ui/button";
import { SkipButton } from "./SkipButton";
import { SentimentBadge } from "./SentimentBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
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
  existingResponse?: ClientResponse;
  onResponseChange: (data: ResponseData) => void;
}

export function ExperienceQuestion({
  question,
  existingResponse,
  onResponseChange,
}: ExperienceQuestionProps) {
  const [awareness, setAwareness] = useState<number | undefined>(
    () => existingResponse?.experience_awareness ?? undefined,
  );
  const [sentiment, setSentiment] = useState<number | undefined>(
    () => existingResponse?.experience_sentiment ?? undefined,
  );
  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponse?.skipped || false,
  );

  const handleAwarenessChange = (value: string) => {
    const awarenessValue = parseInt(value);
    setAwareness(awarenessValue);
    setIsSkipped(false);

    // Reset sentiment when awareness changes
    setSentiment(undefined);

    onResponseChange({
      experienceAwareness: awarenessValue,
      experienceSentiment: undefined,
      skipped: false,
    });
  };

  const handleSentimentChange = (value: string) => {
    const sentimentValue = value === "" ? undefined : parseInt(value);
    setSentiment(sentimentValue);
    setIsSkipped(false);

    onResponseChange({
      experienceAwareness: awareness,
      experienceSentiment: sentimentValue,
      skipped: false,
    });
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setAwareness(undefined);
    setSentiment(undefined);
    onResponseChange({
      skipped: true,
    });
  };

  const getSentimentOptions = (awarenessLevel?: number) => {
    const level = awarenessLevel ?? awareness;
    if (level === 0 || level === 1) {
      return INTEREST_OPTIONS;
    } else if (level === 2) {
      return SENTIMENT_OPTIONS;
    }
    return [];
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-xl">{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pb-4">
        {/* Awareness Level with inline badges */}
        <div className="flex flex-col gap-3">
          <RadioGroup
            value={awareness?.toString()}
            onValueChange={handleAwarenessChange}
            disabled={isSkipped}
          >
            {AWARENESS_OPTIONS.map((option) => {
              const showBadges = awareness === option.value;
              const sentimentOptions = getSentimentOptions(option.value);

              return (
                <div key={option.value} className="flex items-center space-x-4">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`awareness-${option.value}`}
                  />
                  <div className="flex-1">
                    <div className="flex flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-6">
                      <Label
                        htmlFor={`awareness-${option.value}`}
                        className="py-2 text-base"
                      >
                        {option.label}
                      </Label>
                      {showBadges && sentimentOptions.length > 0 && (
                        <div className="ml-0 flex gap-4 sm:ml-0">
                          {sentimentOptions.map((sentimentOption) => (
                            <SentimentBadge
                              key={sentimentOption.value}
                              value={sentimentOption.value}
                              label={sentimentOption.label}
                              isSelected={sentiment === sentimentOption.value}
                              onClick={() => {
                                // If this option is already selected, deselect it (set to neutral)
                                if (sentiment === sentimentOption.value) {
                                  handleSentimentChange("");
                                } else {
                                  handleSentimentChange(
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

        <div className="absolute right-0 bottom-0 flex justify-between">
          <SkipButton isSkipped={isSkipped} onSkip={handleSkip} />
        </div>
      </CardContent>
    </Card>
  );
}

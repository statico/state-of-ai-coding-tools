"use client";

import { Button } from "@/components/ui/button";
import { SkipButton } from "./SkipButton";
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
    const sentimentValue = parseInt(value);
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

  const getSentimentOptions = () => {
    if (awareness === 0 || awareness === 1) {
      return INTEREST_OPTIONS;
    } else if (awareness === 2) {
      return SENTIMENT_OPTIONS;
    }
    return [];
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Awareness Level */}
        <div className="space-y-3">
          <RadioGroup
            value={awareness?.toString()}
            onValueChange={handleAwarenessChange}
            disabled={isSkipped}
          >
            {AWARENESS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-4">
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`awareness-${option.value}`}
                />
                <Label
                  htmlFor={`awareness-${option.value}`}
                  className="flex-1 py-2"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Sentiment/Interest */}
        {awareness !== undefined && (
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {awareness === 2
                ? "What was your experience?"
                : "Are you interested?"}
            </Label>
            <RadioGroup
              value={sentiment?.toString()}
              onValueChange={handleSentimentChange}
              disabled={isSkipped}
            >
              {getSentimentOptions().map((option) => (
                <div key={option.value} className="flex items-center space-x-4">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`sentiment-${option.value}`}
                  />
                  <Label
                    htmlFor={`sentiment-${option.value}`}
                    className="flex-1 py-2"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="absolute right-0 bottom-0 flex justify-between">
          <SkipButton isSkipped={isSkipped} onSkip={handleSkip} />
        </div>
      </CardContent>
    </Card>
  );
}

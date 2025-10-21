"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

interface Question {
  slug: string;
  title: string;
  description?: string;
}

interface Response {
  experience_awareness?: number;
  experience_sentiment?: number;
  skipped?: boolean;
}

interface ExperienceQuestionProps {
  question: Question;
  existingResponse?: Response;
  onResponseChange: (data: any) => void;
}

const AWARENESS_OPTIONS = [
  { value: 0, label: "Never heard of it" },
  { value: 1, label: "Heard of it" },
  { value: 2, label: "Used it" },
];

const SENTIMENT_OPTIONS = [
  { value: -1, label: "Negative experience" },
  { value: 1, label: "Positive experience" },
];

const INTEREST_OPTIONS = [
  { value: -1, label: "Not interested" },
  { value: 1, label: "Interested" },
];

export function ExperienceQuestion({
  question,
  existingResponse,
  onResponseChange,
}: ExperienceQuestionProps) {
  const [awareness, setAwareness] = useState<number | undefined>();
  const [sentiment, setSentiment] = useState<number | undefined>();
  const [isSkipped, setIsSkipped] = useState<boolean>(false);

  useEffect(() => {
    if (existingResponse) {
      setAwareness(existingResponse.experience_awareness);
      setSentiment(existingResponse.experience_sentiment);
      setIsSkipped(existingResponse.skipped || false);
    }
  }, [existingResponse]);

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
    <Card>
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Awareness Level */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            What is your experience level?
          </Label>
          <RadioGroup
            value={awareness?.toString()}
            onValueChange={handleAwarenessChange}
            disabled={isSkipped}
          >
            {AWARENESS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`awareness-${option.value}`}
                />
                <Label htmlFor={`awareness-${option.value}`}>
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
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`sentiment-${option.value}`}
                  />
                  <Label htmlFor={`sentiment-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
            className={isSkipped ? "bg-muted" : ""}
          >
            {isSkipped ? "Skipped" : "Skip this question"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

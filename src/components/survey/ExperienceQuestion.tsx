"use client";

import { CommentSection } from "./CommentSection";
import { SkipButton } from "./SkipButton";
import { ExperienceOption } from "./ExperienceOption";
import { MarkdownText } from "@/components/ui/markdown-text";
import { useEffect, useState, useCallback, useRef } from "react";
import { QuestionWithOptions, ResponseData, ClientResponse } from "@/lib/constants";

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
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>(() => {
    const states: Record<string, OptionState> = {};
    question.options?.forEach((option) => {
      const existingResponse = existingResponses.find((r) => r.option_slug === option.slug);
      states[option.slug] = {
        awareness: existingResponse?.experience_awareness ?? undefined,
        sentiment: existingResponse?.experience_sentiment ?? undefined,
      };
    });
    return states;
  });

  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponses.some((r) => r.skipped) || false,
  );
  const [comment, setComment] = useState<string>(() => existingResponses[0]?.comment ?? "");

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
    const hasChanged = JSON.stringify(responses) !== JSON.stringify(prevResponseDataRef.current);
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
          <MarkdownText>{question.title}</MarkdownText>
        </h3>
        {question.description && (
          <div className="text-muted-foreground">
            <MarkdownText>{question.description}</MarkdownText>
          </div>
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
            <ExperienceOption
              key={option.slug}
              option={option}
              state={state}
              isSkipped={isSkipped}
              onAwarenessChange={handleAwarenessChange}
              onSentimentChange={handleSentimentChange}
            />
          );
        })}
      </div>

      {/* Comment section and skip button */}
      <div className="space-y-4">
        <CommentSection
          initialComment={comment}
          onCommentChange={handleCommentChange}
          disabled={isSkipped}
          hasResponse={Object.values(optionStates).some((state) => state.awareness !== undefined)}
        />

        <div className="flex justify-end">
          <SkipButton isSkipped={isSkipped} onSkip={handleSkip} />
        </div>
      </div>
    </div>
  );
}

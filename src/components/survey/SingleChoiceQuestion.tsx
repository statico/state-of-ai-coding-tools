"use client";

import { useState, useEffect, useCallback } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "./QuestionCard";
import { MarkdownText } from "@/components/ui/markdown-text";
import { cn } from "@/lib/utils";
import {
  QuestionWithOptions,
  ResponseData,
  ClientResponse,
} from "@/lib/constants";

interface SingleChoiceQuestionProps {
  question: QuestionWithOptions;
  existingResponse?: ClientResponse;
  onResponseChange: (data: ResponseData) => void;
}

export function SingleChoiceQuestion({
  question,
  existingResponse,
  onResponseChange,
}: SingleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    () => existingResponse?.single_option_slug || "",
  );
  const [writeinText, setWriteinText] = useState<string>(
    () => existingResponse?.single_writein_response || "",
  );
  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponse?.skipped || false,
  );
  const [comment, setComment] = useState<string>(
    () => existingResponse?.comment ?? "",
  );

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setIsSkipped(false);
    onResponseChange({
      singleOptionSlug: value,
      singleWriteinResponse: value === "other" ? writeinText : undefined,
      skipped: false,
      comment,
    });
  };

  const handleWriteinChange = (value: string) => {
    setWriteinText(value);
    if (selectedOption === "other") {
      onResponseChange({
        singleOptionSlug: "other",
        singleWriteinResponse: value,
        skipped: false,
        comment,
      });
    }
  };

  const handleSkip = () => {
    setSelectedOption("");
    setWriteinText("");
    if (isSkipped) {
      setIsSkipped(false);
      onResponseChange({ skipped: false, comment });
    } else {
      setIsSkipped(true);
      onResponseChange({ skipped: true, comment });
    }
  };

  const handleCommentChange = useCallback(
    (newComment: string) => {
      setComment(newComment);
      onResponseChange({
        singleOptionSlug: selectedOption,
        singleWriteinResponse:
          selectedOption === "other" ? writeinText : undefined,
        skipped: isSkipped,
        comment: newComment,
      });
    },
    [selectedOption, writeinText, isSkipped, onResponseChange],
  );

  return (
    <QuestionCard
      title={question.title}
      description={question.description ?? undefined}
      isSkipped={isSkipped}
      comment={comment}
      hasResponse={selectedOption !== ""}
      onSkip={handleSkip}
      onCommentChange={handleCommentChange}
    >
      <RadioGroup
        value={selectedOption}
        onValueChange={handleOptionChange}
        disabled={isSkipped}
        className={cn("flex flex-col gap-0", isSkipped && "opacity-50")}
      >
        {question.options.map((option, index) => (
          <div
            key={option.slug}
            className={cn(
              "hover:bg-muted/50 flex cursor-pointer items-center space-x-4 rounded-md p-3 transition-colors",
              index % 2 === 1 && "bg-muted/20",
            )}
            onClick={() => {
              if (!isSkipped) {
                handleOptionChange(option.slug);
              }
            }}
          >
            <RadioGroupItem
              value={option.slug}
              id={option.slug}
              onClick={(e) => e.stopPropagation()}
            />
            <Label
              htmlFor={option.slug}
              className="flex flex-1 cursor-pointer flex-col items-start gap-0 py-2 text-base"
            >
              <div>
                <MarkdownText>{option.label}</MarkdownText>
              </div>
              {option.description && (
                <div className="text-muted-foreground text-sm">
                  <MarkdownText>{option.description}</MarkdownText>
                </div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedOption === "other" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="writein" className="text-base">
            Please specify:
          </Label>
          <Input
            id="writein"
            value={writeinText}
            onChange={(e) => handleWriteinChange(e.target.value)}
            placeholder="Enter your response..."
          />
        </div>
      )}
    </QuestionCard>
  );
}

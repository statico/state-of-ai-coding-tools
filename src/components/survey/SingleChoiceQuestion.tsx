"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  QuestionWithOptions,
  ResponseData,
  ClientResponse,
} from "@/lib/constants";
import { SkipButton } from "./SkipButton";
import { CommentSection } from "./CommentSection";
import { cn } from "@/lib/utils";

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
    () => existingResponse?.comment || "",
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
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-xl">{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionChange}
          disabled={isSkipped}
          className={cn("flex flex-col gap-2", isSkipped && "opacity-50")}
        >
          {question.options.map((option) => (
            <div key={option.slug} className="flex items-center space-x-4">
              <RadioGroupItem value={option.slug} id={option.slug} />
              <Label
                htmlFor={option.slug}
                className="flex flex-1 flex-col items-start gap-0 py-2 text-base"
              >
                <div>{option.label}</div>
                {option.description && (
                  <div className="text-muted-foreground text-sm">
                    {option.description}
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

        <CommentSection
          initialComment={comment}
          onCommentChange={handleCommentChange}
          disabled={isSkipped}
        />

        <div className="absolute right-0 bottom-0 flex justify-between">
          <SkipButton isSkipped={isSkipped} onSkip={handleSkip} />
        </div>
      </CardContent>
    </Card>
  );
}

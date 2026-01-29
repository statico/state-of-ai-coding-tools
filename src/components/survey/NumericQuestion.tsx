"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "./QuestionCard";
import { cn } from "@/lib/utils";
import { QuestionWithOptions, ResponseData, ClientResponse } from "@/lib/constants";

interface NumericQuestionProps {
  question: QuestionWithOptions;
  existingResponse?: ClientResponse;
  onResponseChange: (data: ResponseData) => void;
}

export function NumericQuestion({
  question,
  existingResponse,
  onResponseChange,
}: NumericQuestionProps) {
  const [value, setValue] = useState<string>(
    () => existingResponse?.numeric_response?.toString() || "",
  );
  const [isSkipped, setIsSkipped] = useState<boolean>(() => existingResponse?.skipped || false);
  const [comment, setComment] = useState<string>(() => existingResponse?.comment ?? "");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setIsSkipped(false);

    const numericValue = newValue ? parseFloat(newValue) : undefined;
    onResponseChange({
      numericResponse: numericValue,
      skipped: false,
      comment,
    });
  };

  const handleSkip = () => {
    setValue("");
    if (isSkipped) {
      setIsSkipped(false);
      onResponseChange({
        skipped: false,
        comment,
      });
    } else {
      setIsSkipped(true);
      onResponseChange({
        skipped: true,
        comment,
      });
    }
  };

  const handleCommentChange = useCallback(
    (newComment: string) => {
      setComment(newComment);
      onResponseChange({
        numericResponse: value ? parseFloat(value) : undefined,
        skipped: isSkipped,
        comment: newComment,
      });
    },
    [value, isSkipped, onResponseChange],
  );

  return (
    <QuestionCard
      title={question.title}
      description={question.description ?? undefined}
      isSkipped={isSkipped}
      comment={comment}
      hasResponse={value !== ""}
      onSkip={handleSkip}
      onCommentChange={handleCommentChange}
    >
      <div className={cn("flex flex-col gap-2", isSkipped && "opacity-50")}>
        <Input
          id="numeric-input"
          type="number"
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          disabled={isSkipped}
          className="w-32"
        />
      </div>
    </QuestionCard>
  );
}

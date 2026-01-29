"use client";

import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { QuestionCard } from "./QuestionCard";
import { cn } from "@/lib/utils";
import { QuestionWithOptions, ResponseData, ClientResponse } from "@/lib/constants";

interface FreeformQuestionProps {
  question: QuestionWithOptions;
  existingResponse?: ClientResponse;
  onResponseChange: (data: ResponseData) => void;
}

export function FreeformQuestion({
  question,
  existingResponse,
  onResponseChange,
}: FreeformQuestionProps) {
  const [value, setValue] = useState<string>(() => existingResponse?.freeform_response || "");
  const [isSkipped, setIsSkipped] = useState<boolean>(() => existingResponse?.skipped || false);
  const [comment, setComment] = useState<string>(() => existingResponse?.comment ?? "");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setIsSkipped(false);

    onResponseChange({
      freeformResponse: newValue,
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
        freeformResponse: value,
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
        <Textarea
          id="freeform-textarea"
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          rows={4}
          disabled={isSkipped}
        />
      </div>
    </QuestionCard>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { QuestionCard } from "./QuestionCard";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { QuestionWithOptions, ResponseData, ClientResponse } from "@/lib/constants";
import { XIcon } from "lucide-react";

interface MultipleFreeformQuestionProps {
  question: QuestionWithOptions;
  existingResponse?: ClientResponse;
  onResponseChange: (data: ResponseData) => void;
}

export function MultipleFreeformQuestion({
  question,
  existingResponse,
  onResponseChange,
}: MultipleFreeformQuestionProps) {
  const [responses, setResponses] = useState<string[]>(
    () => existingResponse?.multiple_writein_responses || [],
  );
  const [isSkipped, setIsSkipped] = useState<boolean>(() => existingResponse?.skipped || false);
  const [comment, setComment] = useState<string>(() => existingResponse?.comment ?? "");

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
    setIsSkipped(false);

    onResponseChange({
      multipleWriteinResponses: newResponses,
      skipped: false,
      comment,
    });
  };

  const addResponse = () => {
    const newResponses = [...responses, ""];
    setResponses(newResponses);
    setIsSkipped(false);

    onResponseChange({
      multipleWriteinResponses: newResponses,
      skipped: false,
      comment,
    });
  };

  const removeResponse = (index: number) => {
    const newResponses = responses.filter((_, i) => i !== index);
    setResponses(newResponses);
    setIsSkipped(false);

    onResponseChange({
      multipleWriteinResponses: newResponses,
      skipped: false,
      comment,
    });
  };

  const handleSkip = () => {
    setResponses([]);
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
        multipleWriteinResponses: responses,
        skipped: isSkipped,
        comment: newComment,
      });
    },
    [responses, isSkipped, onResponseChange],
  );

  return (
    <QuestionCard
      title={question.title}
      description={question.description ?? undefined}
      isSkipped={isSkipped}
      comment={comment}
      hasResponse={responses.length > 0}
      onSkip={handleSkip}
      onCommentChange={handleCommentChange}
    >
      <div className={cn("flex flex-col gap-3", isSkipped && "opacity-50")}>
        {responses.map((response, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={response}
              onChange={(e) => handleResponseChange(index, e.target.value)}
              disabled={isSkipped}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeResponse(index)}
              disabled={isSkipped}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" onClick={addResponse} disabled={isSkipped} className="w-full">
          Add Response
        </Button>
      </div>
    </QuestionCard>
  );
}

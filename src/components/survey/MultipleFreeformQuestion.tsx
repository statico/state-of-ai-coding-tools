"use client";

import { Button } from "@/components/ui/button";
import { SkipButton } from "./SkipButton";
import { CommentSection } from "./CommentSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  QuestionWithOptions,
  ResponseData,
  ClientResponse,
} from "@/lib/constants";
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
  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponse?.skipped || false,
  );
  const [comment, setComment] = useState<string>(
    () => existingResponse?.comment || "",
  );

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
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-xl">{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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

          <Button
            variant="outline"
            onClick={addResponse}
            disabled={isSkipped}
            className="w-full"
          >
            Add Response
          </Button>
        </div>

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

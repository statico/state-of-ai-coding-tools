"use client";

import { Button } from "@/components/ui/button";
import { SkipButton } from "./SkipButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
    setIsSkipped(false);

    onResponseChange({
      multipleWriteinResponses: newResponses,
      skipped: false,
    });
  };

  const addResponse = () => {
    const newResponses = [...responses, ""];
    setResponses(newResponses);
    setIsSkipped(false);

    onResponseChange({
      multipleWriteinResponses: newResponses,
      skipped: false,
    });
  };

  const removeResponse = (index: number) => {
    const newResponses = responses.filter((_, i) => i !== index);
    setResponses(newResponses);
    setIsSkipped(false);

    onResponseChange({
      multipleWriteinResponses: newResponses,
      skipped: false,
    });
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setResponses([]);
    onResponseChange({
      skipped: true,
    });
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-xl">{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {responses.map((response, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={response}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                placeholder={`Response ${index + 1}...`}
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

        <div className="absolute right-0 bottom-0 flex justify-between">
          <SkipButton isSkipped={isSkipped} onSkip={handleSkip} />
          {responses.length > 0 && (
            <span className="text-muted-foreground text-base">
              {responses.length} response{responses.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

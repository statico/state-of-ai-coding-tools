"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  QuestionWithOptions,
  ResponseData,
  ClientResponse,
} from "@/lib/constants";

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
    <Card>
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
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
                variant="outline"
                size="sm"
                onClick={() => removeResponse(index)}
                disabled={isSkipped}
              >
                Remove
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

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
            className={isSkipped ? "bg-muted" : ""}
          >
            {isSkipped ? "Skipped" : "Skip this question"}
          </Button>
          {responses.length > 0 && (
            <span className="text-muted-foreground text-sm">
              {responses.length} response{responses.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

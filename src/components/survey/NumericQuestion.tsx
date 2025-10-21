"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  QuestionWithOptions,
  ResponseData,
  ClientResponse,
} from "@/lib/constants";

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
  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponse?.skipped || false,
  );

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setIsSkipped(false);

    const numericValue = newValue ? parseFloat(newValue) : undefined;
    onResponseChange({
      numericResponse: numericValue,
      skipped: false,
    });
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setValue("");
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
        <div className="space-y-2">
          <Label htmlFor="numeric-input">Enter a number:</Label>
          <Input
            id="numeric-input"
            type="number"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter your response..."
            disabled={isSkipped}
          />
        </div>

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

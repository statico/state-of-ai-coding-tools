"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SkipButton } from "./SkipButton";
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
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-xl">{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            id="numeric-input"
            type="number"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={isSkipped}
          />
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between">
          <SkipButton isSkipped={isSkipped} onSkip={handleSkip} />
        </div>
      </CardContent>
    </Card>
  );
}

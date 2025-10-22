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

interface SingleFreeformQuestionProps {
  question: QuestionWithOptions;
  existingResponse?: ClientResponse;
  onResponseChange: (data: ResponseData) => void;
}

export function SingleFreeformQuestion({
  question,
  existingResponse,
  onResponseChange,
}: SingleFreeformQuestionProps) {
  const [value, setValue] = useState<string>(
    () => existingResponse?.single_writein_response || "",
  );
  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponse?.skipped || false,
  );

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setIsSkipped(false);

    onResponseChange({
      singleWriteinResponse: newValue,
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
      <CardContent className="flex flex-col gap-4 pb-4">
        <div className="flex flex-col gap-2">
          <Input
            id="freeform-input"
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

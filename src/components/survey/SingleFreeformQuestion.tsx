"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Question {
  slug: string;
  title: string;
  description?: string;
}

interface Response {
  single_writein_response?: string;
  skipped?: boolean;
}

interface SingleFreeformQuestionProps {
  question: Question;
  existingResponse?: Response;
  onResponseChange: (data: any) => void;
}

export function SingleFreeformQuestion({
  question,
  existingResponse,
  onResponseChange,
}: SingleFreeformQuestionProps) {
  const [value, setValue] = useState<string>("");
  const [isSkipped, setIsSkipped] = useState<boolean>(false);

  useEffect(() => {
    if (existingResponse) {
      setValue(existingResponse.single_writein_response || "");
      setIsSkipped(existingResponse.skipped || false);
    }
  }, [existingResponse]);

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
    <Card>
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="freeform-input">Your response:</Label>
          <Input
            id="freeform-input"
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

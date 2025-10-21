"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Question {
  slug: string;
  title: string;
  description?: string;
}

interface Response {
  freeform_response?: string;
  skipped?: boolean;
}

interface FreeformQuestionProps {
  question: Question;
  existingResponse?: Response;
  onResponseChange: (data: any) => void;
}

export function FreeformQuestion({
  question,
  existingResponse,
  onResponseChange,
}: FreeformQuestionProps) {
  const [value, setValue] = useState<string>("");
  const [isSkipped, setIsSkipped] = useState<boolean>(false);

  useEffect(() => {
    if (existingResponse) {
      setValue(existingResponse.freeform_response || "");
      setIsSkipped(existingResponse.skipped || false);
    }
  }, [existingResponse]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setIsSkipped(false);

    onResponseChange({
      freeformResponse: newValue,
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
          <Label htmlFor="freeform-textarea">Your response:</Label>
          <Textarea
            id="freeform-textarea"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter your detailed response..."
            rows={4}
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

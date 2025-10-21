"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  QuestionWithOptions,
  ResponseData,
  ClientResponse,
} from "@/lib/constants";

interface SingleChoiceQuestionProps {
  question: QuestionWithOptions;
  existingResponse?: ClientResponse;
  onResponseChange: (data: ResponseData) => void;
}

export function SingleChoiceQuestion({
  question,
  existingResponse,
  onResponseChange,
}: SingleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    () => existingResponse?.single_option_slug || "",
  );
  const [writeinText, setWriteinText] = useState<string>(
    () => existingResponse?.single_writein_response || "",
  );
  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponse?.skipped || false,
  );

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setIsSkipped(false);
    onResponseChange({
      singleOptionSlug: value,
      singleWriteinResponse: value === "other" ? writeinText : undefined,
      skipped: false,
    });
  };

  const handleWriteinChange = (value: string) => {
    setWriteinText(value);
    if (selectedOption === "other") {
      onResponseChange({
        singleOptionSlug: "other",
        singleWriteinResponse: value,
        skipped: false,
      });
    }
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setSelectedOption("");
    setWriteinText("");
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
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionChange}
          disabled={isSkipped}
        >
          {question.options.map((option) => (
            <div key={option.slug} className="flex items-center space-x-2">
              <RadioGroupItem value={option.slug} id={option.slug} />
              <Label htmlFor={option.slug} className="flex-1">
                {option.label}
                {option.description && (
                  <span className="text-muted-foreground block text-sm">
                    {option.description}
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {selectedOption === "other" && (
          <div className="space-y-2">
            <Label htmlFor="writein">Please specify:</Label>
            <Input
              id="writein"
              value={writeinText}
              onChange={(e) => handleWriteinChange(e.target.value)}
              placeholder="Enter your response..."
            />
          </div>
        )}

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

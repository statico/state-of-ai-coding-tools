"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Option {
  slug: string;
  label: string;
  description?: string;
}

interface Question {
  slug: string;
  title: string;
  description?: string;
  options: Option[];
  multiple_max?: number;
}

interface Response {
  multiple_option_slugs?: string[];
  multiple_writein_responses?: string[];
  skipped?: boolean;
}

interface MultipleChoiceQuestionProps {
  question: Question;
  existingResponse?: Response;
  onResponseChange: (data: any) => void;
}

export function MultipleChoiceQuestion({
  question,
  existingResponse,
  onResponseChange,
}: MultipleChoiceQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [writeinTexts, setWriteinTexts] = useState<string[]>([]);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);

  useEffect(() => {
    if (existingResponse) {
      setSelectedOptions(existingResponse.multiple_option_slugs || []);
      setWriteinTexts(existingResponse.multiple_writein_responses || []);
      setIsSkipped(existingResponse.skipped || false);
    }
  }, [existingResponse]);

  const handleOptionChange = (optionSlug: string, checked: boolean) => {
    let newSelectedOptions;
    if (checked) {
      if (
        question.multiple_max &&
        selectedOptions.length >= question.multiple_max
      ) {
        return; // Don't add if at max
      }
      newSelectedOptions = [...selectedOptions, optionSlug];
    } else {
      newSelectedOptions = selectedOptions.filter(
        (slug) => slug !== optionSlug,
      );
    }

    setSelectedOptions(newSelectedOptions);
    setIsSkipped(false);

    const hasOther = newSelectedOptions.includes("other");
    onResponseChange({
      multipleOptionSlugs: newSelectedOptions,
      multipleWriteinResponses: hasOther ? writeinTexts : undefined,
      skipped: false,
    });
  };

  const handleWriteinChange = (index: number, value: string) => {
    const newWriteinTexts = [...writeinTexts];
    newWriteinTexts[index] = value;
    setWriteinTexts(newWriteinTexts);

    if (selectedOptions.includes("other")) {
      onResponseChange({
        multipleOptionSlugs: selectedOptions,
        multipleWriteinResponses: newWriteinTexts,
        skipped: false,
      });
    }
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setSelectedOptions([]);
    setWriteinTexts([]);
    onResponseChange({
      skipped: true,
    });
  };

  const maxSelections = question.multiple_max || question.options.length;
  const canSelectMore = selectedOptions.length < maxSelections;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
        {question.multiple_max && (
          <p className="text-muted-foreground text-sm">
            Select up to {question.multiple_max} options
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option) => (
            <div key={option.slug} className="flex items-start space-x-2">
              <Checkbox
                id={option.slug}
                checked={selectedOptions.includes(option.slug)}
                onCheckedChange={(checked) =>
                  handleOptionChange(option.slug, checked as boolean)
                }
                disabled={
                  isSkipped ||
                  (!selectedOptions.includes(option.slug) && !canSelectMore)
                }
              />
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
        </div>

        {selectedOptions.includes("other") && (
          <div className="space-y-2">
            <Label>Please specify:</Label>
            {writeinTexts.map((text, index) => (
              <Input
                key={index}
                value={text}
                onChange={(e) => handleWriteinChange(index, e.target.value)}
                placeholder="Enter your response..."
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWriteinTexts([...writeinTexts, ""])}
            >
              Add another response
            </Button>
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
          {selectedOptions.length > 0 && (
            <span className="text-muted-foreground text-sm">
              {selectedOptions.length} of {maxSelections} selected
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SkipButton } from "./SkipButton";
import { CommentSection } from "./CommentSection";
import { cn } from "@/lib/utils";
import {
  QuestionWithOptions,
  ResponseData,
  ClientResponse,
} from "@/lib/constants";

interface MultipleChoiceQuestionProps {
  question: QuestionWithOptions;
  existingResponse?: ClientResponse;
  onResponseChange: (data: ResponseData) => void;
}

export function MultipleChoiceQuestion({
  question,
  existingResponse,
  onResponseChange,
}: MultipleChoiceQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    () => existingResponse?.multiple_option_slugs || [],
  );
  const [writeinTexts, setWriteinTexts] = useState<string[]>(
    () => existingResponse?.multiple_writein_responses || [],
  );
  const [isSkipped, setIsSkipped] = useState<boolean>(
    () => existingResponse?.skipped || false,
  );
  const [comment, setComment] = useState<string>(
    () => existingResponse?.comment || "",
  );

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
      comment,
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
        comment,
      });
    }
  };

  const handleSkip = () => {
    setSelectedOptions([]);
    setWriteinTexts([]);
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
        multipleOptionSlugs: selectedOptions,
        multipleWriteinResponses: writeinTexts,
        skipped: isSkipped,
        comment: newComment,
      });
    },
    [selectedOptions, writeinTexts, isSkipped, onResponseChange],
  );

  const maxSelections = question.multiple_max || question.options.length;
  const canSelectMore = selectedOptions.length < maxSelections;

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-xl">{question.title}</CardTitle>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
        {question.multiple_max && (
          <p className="text-muted-foreground text-base">
            Select up to {question.multiple_max}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className={cn("flex flex-col gap-3", isSkipped && "opacity-50")}>
          {question.options.map((option) => (
            <div key={option.slug} className="flex items-center space-x-4">
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
              <Label
                htmlFor={option.slug}
                className="flex flex-1 flex-col items-start gap-0 py-2 text-base"
              >
                <div>{option.label}</div>
                {option.description && (
                  <div className="text-muted-foreground text-sm">
                    {option.description}
                  </div>
                )}
              </Label>
            </div>
          ))}
        </div>

        {selectedOptions.includes("other") && (
          <div className="flex flex-col gap-2">
            <Label className="text-base">Please specify:</Label>
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

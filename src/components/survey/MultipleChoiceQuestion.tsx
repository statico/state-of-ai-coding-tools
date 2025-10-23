"use client";

import { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "./QuestionCard";
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
    () => existingResponse?.comment ?? "",
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
    <QuestionCard
      title={question.title}
      description={question.description ?? undefined}
      additionalInfo={
        question.multiple_max
          ? `Select up to ${question.multiple_max}`
          : undefined
      }
      isSkipped={isSkipped}
      comment={comment}
      hasResponse={selectedOptions.length > 0}
      onSkip={handleSkip}
      onCommentChange={handleCommentChange}
    >
      <div className={cn("flex flex-col gap-0", isSkipped && "opacity-50")}>
        {question.options.map((option, index) => (
          <div
            key={option.slug}
            className={cn(
              "hover:bg-muted/50 flex cursor-pointer items-center space-x-4 rounded-md p-3 transition-colors",
              index % 2 === 1 && "bg-muted/20",
            )}
            onClick={(e) => {
              // Don't trigger if clicking directly on the checkbox (it has its own handler)
              if (
                e.target ===
                e.currentTarget.querySelector('input[type="checkbox"]')
              ) {
                return;
              }

              // Prevent default label behavior to avoid double-triggering
              e.preventDefault();

              if (!isSkipped) {
                const isCurrentlySelected = selectedOptions.includes(
                  option.slug,
                );
                const canToggle = isCurrentlySelected || canSelectMore;
                if (canToggle) {
                  handleOptionChange(option.slug, !isCurrentlySelected);
                }
              }
            }}
          >
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
              className="flex flex-1 cursor-pointer flex-col items-start gap-0 py-2 text-base"
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
    </QuestionCard>
  );
}

"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommentSection } from "./CommentSection";
import { SkipButton } from "./SkipButton";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  title: string;
  description?: string;
  additionalInfo?: string;
  children: ReactNode;
  isSkipped: boolean;
  comment: string;
  hasResponse: boolean;
  onSkip: () => void;
  onCommentChange: (comment: string) => void;
  className?: string;
}

export function QuestionCard({
  title,
  description,
  additionalInfo,
  children,
  isSkipped,
  comment,
  onSkip,
  onCommentChange,
  className,
}: QuestionCardProps) {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <p className="text-muted-foreground">{description}</p>}
        {additionalInfo && (
          <p className="text-muted-foreground text-base">{additionalInfo}</p>
        )}
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-3 pb-2", className)}>
        {children}

        <CommentSection
          initialComment={comment}
          onCommentChange={onCommentChange}
          disabled={isSkipped}
        />

        <div className="absolute right-0 bottom-0 flex justify-between">
          <SkipButton isSkipped={isSkipped} onSkip={onSkip} />
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { BanIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkipButtonProps {
  isSkipped: boolean;
  onSkip: () => void;
  className?: string;
}

export function SkipButton({ isSkipped, onSkip, className }: SkipButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onSkip}
      title={isSkipped ? "This question has been skipped" : "Skip this question"}
      className={cn("text-sm", !isSkipped && "text-muted-foreground", className)}
    >
      {isSkipped ? "Skipped" : "Skip"}
      <BanIcon className="size-4" />
    </Button>
  );
}

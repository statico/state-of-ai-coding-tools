"use client";

import { cn } from "@/lib/utils";
import {
  Calculator,
  ChartBarStacked,
  List,
  ListChecks,
  MessageCircleMore,
  Rows3,
  TextCursorInput,
} from "lucide-react";

interface QuestionTypeIconProps {
  type: string;
  className?: string;
}

export function QuestionTypeIcon({ type, className }: QuestionTypeIconProps) {
  const iconClass = cn("text-muted-foreground h-5 w-5", className);

  switch (type) {
    case "single":
      return <List className={iconClass} />;
    case "multiple":
      return <ListChecks className={iconClass} />;
    case "experience":
      return <ChartBarStacked className={iconClass} />;
    case "numeric":
      return <Calculator className={iconClass} />;
    case "single-freeform":
      return <TextCursorInput className={iconClass} />;
    case "multiple-freeform":
      return <Rows3 className={iconClass} />;
    case "freeform":
    default:
      return <MessageCircleMore className={iconClass} />;
  }
}

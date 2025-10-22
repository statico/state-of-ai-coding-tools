"use client";

import {
  List,
  ListChecks,
  ArrowDownUp,
  Calculator,
  TextCursorInput,
  Rows3,
  MessageCircleMore,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      return <ArrowDownUp className={iconClass} />;
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

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface IncompleteWeekBannerProps {
  isCurrentWeek: boolean;
}

export function IncompleteWeekBanner({
  isCurrentWeek,
}: IncompleteWeekBannerProps) {
  if (!isCurrentWeek) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertDescription className="text-foreground">
        This week's data is still being collected. Results may change as more
        responses are submitted.
      </AlertDescription>
    </Alert>
  );
}

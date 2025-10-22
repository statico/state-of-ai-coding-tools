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
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <strong>Current Week - Data Incomplete:</strong> This week's data is
        still being collected. Results may change as more responses are
        submitted.
      </AlertDescription>
    </Alert>
  );
}

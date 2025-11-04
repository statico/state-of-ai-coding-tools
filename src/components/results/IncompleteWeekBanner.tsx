"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface IncompleteMonthBannerProps {
  isCurrentMonth: boolean;
}

export function IncompleteMonthBanner({
  isCurrentMonth,
}: IncompleteMonthBannerProps) {
  if (!isCurrentMonth) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertDescription className="text-foreground">
        This month's data is still being collected. Results may change as more
        responses are submitted.
      </AlertDescription>
    </Alert>
  );
}

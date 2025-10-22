"use client";

import { Percent, User } from "lucide-react";

interface ReportFooterProps {
  totalResponses: number;
  responseRate: number;
}

export function ReportFooter({
  totalResponses,
  responseRate,
}: ReportFooterProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="text-muted-foreground flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {totalResponses.toLocaleString()} respondents
        </div>
        <div className="flex items-center gap-1">
          <Percent className="h-4 w-4" />
          {responseRate}% response rate
        </div>
      </div>
    </div>
  );
}

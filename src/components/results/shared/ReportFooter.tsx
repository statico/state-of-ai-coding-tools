"use client";

import { Percent, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReportFooterProps {
  totalResponses: number;
  responseRate: number;
}

export function ReportFooter({ totalResponses, responseRate }: ReportFooterProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="text-muted-foreground flex items-center gap-4 text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-help items-center gap-1">
                <User className="h-4 w-4" />
                {totalResponses.toLocaleString()}
              </div>
            </TooltipTrigger>
            <TooltipContent>{totalResponses.toLocaleString()} respondents</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-help items-center gap-1">
                <Percent className="h-4 w-4" />
                {responseRate}%
              </div>
            </TooltipTrigger>
            <TooltipContent>{responseRate}% response rate</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { List, MessageCircleMore, Percent, User } from "lucide-react";

interface SingleChoiceReportProps {
  data: {
    options: Array<{
      optionSlug: string;
      label: string;
      description?: string;
      count: number;
      percentage: number;
    }>;
    writeIns: Array<{
      response: string;
      count: number;
    }>;
  };
  totalResponses: number;
  skippedResponses: number;
  questionTitle: string;
  questionType: string;
  questionDescription?: string | null;
  multipleMax?: number | null;
  randomize?: boolean;
  comments?: Array<{
    comment: string;
    sessionId: string;
  }>;
}

export function SingleChoiceReport({
  data,
  totalResponses,
  skippedResponses,
  questionTitle,
  questionType,
  questionDescription,
  multipleMax,
  randomize,
  comments = [],
}: SingleChoiceReportProps) {
  // Filter out options with zero respondents and sort by count (most popular first)
  const sortedOptions = [...data.options]
    .filter((option) => option.count > 0)
    .sort((a, b) => b.count - a.count);

  const responseRate =
    totalResponses > 0
      ? Math.round(((totalResponses - skippedResponses) / totalResponses) * 100)
      : 0;

  // Create human-readable question type name
  const getQuestionTypeName = (type: string) => {
    switch (type) {
      case "single":
        return "Single Choice";
      case "multiple":
        return "Multiple Choice";
      case "experience":
        return "Experience";
      case "numeric":
        return "Numeric";
      case "freeform":
        return "Freeform";
      case "single-freeform":
        return "Single Choice with Freeform";
      case "multiple-freeform":
        return "Multiple Choice with Freeform";
      default:
        return type;
    }
  };

  // Create tooltip content
  const tooltipContent = (
    <div className="space-y-2 text-sm">
      <div>
        <span className="font-semibold">Title:</span> {questionTitle}
      </div>
      <div>
        <span className="font-semibold">Type:</span>{" "}
        {getQuestionTypeName(questionType)}
      </div>
      {questionDescription && (
        <div>
          <span className="font-semibold">Description:</span>{" "}
          {questionDescription}
        </div>
      )}
      {multipleMax && (
        <div>
          <span className="font-semibold">Max selections:</span> {multipleMax}
        </div>
      )}
      {randomize && (
        <div>
          <span className="font-semibold">Randomize options:</span> Yes
        </div>
      )}
    </div>
  );

  return (
    <Card>
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-help items-center gap-3">
                  <List className="text-muted-foreground h-5 w-5" />
                  <CardTitle className="text-lg">{questionTitle}</CardTitle>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {comments.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-lg border border-dashed px-3 py-1.5 text-sm">
                  <MessageCircleMore className="h-4 w-4" />
                  {comments.length} comments
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Comments for "{questionTitle}"</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-96">
                  <div className="space-y-3 pr-4">
                    {comments.map((comment, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 rounded-lg border p-3"
                      >
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      {/* Main Chart Area */}
      <CardContent className="pt-0">
        {sortedOptions.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart */}
            <div className="space-y-3">
              {sortedOptions.map((option, index) => (
                <div key={option.optionSlug} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="h-6 w-6 rounded-full p-0 text-xs"
                      >
                        {index + 1}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help text-sm font-medium">
                              {option.label}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-semibold">Title:</span>{" "}
                                {option.label}
                              </div>
                              <div>
                                <span className="font-semibold">
                                  Description:
                                </span>{" "}
                                {option.description ||
                                  "No description available"}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {option.percentage.toFixed(1)}%
                      </span>
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <User className="h-4 w-4" />
                        {option.count.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-muted h-2 w-full rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

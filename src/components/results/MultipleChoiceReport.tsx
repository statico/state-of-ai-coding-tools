"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReportHeader } from "@/components/results/shared/ReportHeader";
import { ProgressBar } from "@/components/results/shared/ProgressBar";
import { QuestionTypeIcon } from "@/components/results/shared/QuestionTypeIcon";
import { Percent, User, Eye, EyeOff } from "lucide-react";
import { MarkdownText } from "@/components/ui/markdown-text";

interface MultipleChoiceReportProps {
  data: {
    options: Array<{
      optionSlug: string;
      label: string;
      description?: string;
      count: number;
      percentage: number;
      order: number;
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

export function MultipleChoiceReport({
  data,
  totalResponses,
  skippedResponses,
  questionTitle,
  questionType,
  questionDescription,
  multipleMax,
  randomize,
  comments = [],
}: MultipleChoiceReportProps) {
  const [showAll, setShowAll] = useState(false);

  // Filter out options with zero respondents and sort by count (most popular first)
  const filteredOptions = [...data.options]
    .filter((option) => option.count > 0)
    .sort((a, b) => b.count - a.count);

  // Show all options sorted by database order
  const allOptions = [...data.options].sort((a, b) => a.order - b.order);

  const sortedOptions = showAll ? allOptions : filteredOptions;

  const responseRate =
    totalResponses > 0
      ? Math.round(((totalResponses - skippedResponses) / totalResponses) * 100)
      : 0;

  return (
    <Card>
      <ReportHeader
        questionTitle={questionTitle}
        questionType={questionType}
        questionDescription={questionDescription}
        multipleMax={multipleMax}
        randomize={randomize}
        comments={comments}
        icon={<QuestionTypeIcon type={questionType} />}
        totalResponses={totalResponses}
        responseRate={responseRate}
      />

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
                      <Badge variant="outline" className="h-6 w-6 rounded-full p-0 text-xs">
                        {index + 1}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help text-sm font-medium">
                              <MarkdownText>{option.label}</MarkdownText>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-semibold">Title:</span>{" "}
                                <MarkdownText>{option.label}</MarkdownText>
                              </div>
                              <div>
                                <span className="font-semibold">Description:</span>{" "}
                                <MarkdownText>
                                  {option.description || "No description available"}
                                </MarkdownText>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{option.percentage.toFixed(1)}%</span>
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <User className="h-4 w-4" />
                        {option.count.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <ProgressBar percentage={option.percentage} />
                </div>
              ))}
            </div>

            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-muted-foreground hover:text-foreground gap-2 text-sm"
            >
              {showAll ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Show Popular Only
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Show All
                </>
              )}
            </Button>

            {/* Write-in Responses */}
            {data.writeIns.length > 0 && (
              <div className="space-y-2 pt-4">
                <h4 className="text-muted-foreground text-sm font-medium">
                  {data.writeIns.length} Write-in Response
                  {data.writeIns.length === 1 ? "" : "s"}
                </h4>
                <ScrollArea className="h-32 rounded-md border md:h-48">
                  <div className="space-y-2 p-4">
                    {data.writeIns.map((writeIn, index) => (
                      <div
                        key={index}
                        className="bg-muted/30 flex items-center justify-between rounded-lg p-2"
                      >
                        <span className="text-sm">{writeIn.response}</span>
                        <Badge variant="outline" className="text-xs">
                          {writeIn.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportFooter } from "@/components/results/shared/ReportFooter";
import { ReportHeader } from "@/components/results/shared/ReportHeader";
import { ProgressBar } from "@/components/results/shared/ProgressBar";
import { QuestionTypeIcon } from "@/components/results/shared/QuestionTypeIcon";
import { AWARENESS_OPTIONS } from "@/lib/constants";
import { Percent, User } from "lucide-react";

interface ExperienceReportProps {
  data: {
    awareness: Array<{
      level: number;
      label: string;
      count: number;
      percentage: number;
    }>;
    sentiment: Array<{
      level: number;
      label: string;
      count: number;
      percentage: number;
    }>;
    combined: Array<{
      awareness: number;
      sentiment: number;
      count: number;
    }>;
  };
  totalResponses: number;
  skippedResponses: number;
  questionTitle: string;
  questionType: string;
  questionDescription?: string | null;
  comments?: Array<{
    comment: string;
    sessionId: string;
  }>;
}

export function ExperienceReport({
  data,
  totalResponses,
  skippedResponses,
  questionTitle,
  questionType,
  questionDescription,
  comments = [],
}: ExperienceReportProps) {
  // Sort awareness and sentiment by count (most popular first)
  const sortedAwareness = [...data.awareness]
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const sortedSentiment = [...data.sentiment]
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

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
        comments={comments}
        icon={<QuestionTypeIcon type={questionType} />}
      />

      <CardContent className="pt-0">
        {sortedAwareness.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {sortedAwareness.map((item, index) => {
                // Get the correct label from AWARENESS_OPTIONS
                const awarenessOption = AWARENESS_OPTIONS.find(
                  (opt) => opt.value === item.level,
                );
                const displayLabel = awarenessOption
                  ? awarenessOption.label
                  : item.label;

                return (
                  <div key={item.level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="h-6 w-6 rounded-full p-0 text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">
                          {displayLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">
                          {item.percentage.toFixed(1)}%
                        </span>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <User className="h-4 w-4" />
                          {item.count.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <ProgressBar percentage={item.percentage} />
                  </div>
                );
              })}
            </div>

            <ReportFooter
              totalResponses={totalResponses}
              responseRate={responseRate}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportHeader } from "@/components/results/shared/ReportHeader";
import { ProgressBar } from "@/components/results/shared/ProgressBar";
import { QuestionTypeIcon } from "@/components/results/shared/QuestionTypeIcon";
import { Percent, User } from "lucide-react";

interface NumericReportProps {
  data: {
    summary: {
      mean: number;
      median: number;
      min: number;
      max: number;
      count: number;
    };
    distribution: Array<{
      range: string;
      count: number;
      percentage: number;
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

export function NumericReport({
  data,
  totalResponses,
  skippedResponses,
  questionTitle,
  questionType,
  questionDescription,
  comments = [],
}: NumericReportProps) {
  const responseRate =
    totalResponses > 0
      ? Math.round(((totalResponses - skippedResponses) / totalResponses) * 100)
      : 0;

  // Create quartile data for 4 progress bars
  const quartiles = [
    { label: "Q1 (0-25%)", percentage: 25 },
    { label: "Q2 (25-50%)", percentage: 25 },
    { label: "Q3 (50-75%)", percentage: 25 },
    { label: "Q4 (75-100%)", percentage: 25 },
  ];

  return (
    <Card>
      <ReportHeader
        questionTitle={questionTitle}
        questionType={questionType}
        questionDescription={questionDescription}
        comments={comments}
        icon={<QuestionTypeIcon type={questionType} />}
        totalResponses={totalResponses}
        responseRate={responseRate}
      />

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-3">
            {quartiles.map((quartile, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="h-6 w-6 rounded-full p-0 text-xs"
                    >
                      {index + 1}
                    </Badge>
                    <span className="text-sm font-medium">
                      {quartile.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {quartile.percentage}%
                    </span>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <User className="h-4 w-4" />
                      {Math.round(
                        (totalResponses * quartile.percentage) / 100,
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
                <ProgressBar percentage={quartile.percentage} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

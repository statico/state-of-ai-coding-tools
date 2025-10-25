"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportHeader } from "@/components/results/shared/ReportHeader";
import { QuestionTypeIcon } from "@/components/results/shared/QuestionTypeIcon";
import { Percent, User } from "lucide-react";
import { useState } from "react";

interface FreeformReportProps {
  data: {
    responses: Array<{
      response: string;
      count: number;
    }>;
    totalCount: number;
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

export function FreeformReport({
  data,
  totalResponses,
  skippedResponses,
  questionTitle,
  questionType,
  questionDescription,
  comments = [],
}: FreeformReportProps) {
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
        totalResponses={totalResponses}
        responseRate={responseRate}
      />

      {/* Main Content */}
      <CardContent className="pt-0">
        {data.responses.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Response Count */}
            <div className="text-muted-foreground text-sm">
              {data.responses.length}{" "}
              {data.responses.length === 1 ? "response" : "responses"}
            </div>

            {/* Freeform Responses in ScrollArea */}
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="space-y-3 p-4">
                {data.responses.map((item, index) => (
                  <div
                    key={index}
                    className="bg-muted/30 rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">
                          {item.response}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {item.count} {item.count === 1 ? "time" : "times"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

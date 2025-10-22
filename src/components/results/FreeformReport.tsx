"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ReportFooter } from "@/components/results/shared/ReportFooter";
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
  const [showAll, setShowAll] = useState(false);
  const displayResponses = showAll
    ? data.responses
    : data.responses.slice(0, 10);

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

      {/* Main Content */}
      <CardContent className="pt-0">
        {data.responses.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalResponses}</div>
                <div className="text-muted-foreground text-sm">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {data.responses.length}
                </div>
                <div className="text-muted-foreground text-sm">Unique</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{responseRate}%</div>
                <div className="text-muted-foreground text-sm">
                  Response Rate
                </div>
              </div>
            </div>

            {/* Freeform Responses */}
            <div className="space-y-3">
              {displayResponses.map((item, index) => (
                <div key={index} className="bg-muted/30 rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{item.response}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {item.count} {item.count === 1 ? "time" : "times"}
                    </Badge>
                  </div>
                </div>
              ))}

              {data.responses.length > 10 && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-primary text-sm hover:underline"
                  >
                    {showAll
                      ? "Show less"
                      : `Show all ${data.responses.length} responses`}
                  </button>
                </div>
              )}
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

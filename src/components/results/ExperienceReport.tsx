"use client";

import { QuestionTypeIcon } from "@/components/results/shared/QuestionTypeIcon";
import { ReportFooter } from "@/components/results/shared/ReportFooter";
import { ReportHeader } from "@/components/results/shared/ReportHeader";
import { Card, CardContent } from "@/components/ui/card";
import { AWARENESS_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Color mappings based on awareness level values
const AWARENESS_COLOR_MAP = {
  0: "bg-zinc-500", // Never heard of it
  1: "bg-cyan-500", // Heard of it
  2: "bg-blue-500", // Used it
} as const;

// Color mappings based on sentiment values
const SENTIMENT_COLOR_MAP = {
  positive: "bg-emerald-500",
  neutral: "bg-zinc-500",
  negative: "bg-rose-500",
} as const;

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
  const responseRate =
    totalResponses > 0
      ? Math.round(((totalResponses - skippedResponses) / totalResponses) * 100)
      : 0;

  const actualResponses = totalResponses - skippedResponses;

  // Create breakdown by awareness level and sentiment (reversed order)
  const breakdown = [...AWARENESS_OPTIONS].reverse().map((awarenessOption) => {
    const awarenessData = data.awareness.find(
      (item) => item.level === awarenessOption.value,
    );

    // Get sentiment breakdown for this awareness level
    // Check for positive, negative, and neutral responses
    const positiveData = data.combined.find(
      (item) =>
        item.awareness === awarenessOption.value && item.sentiment === 1,
    );

    const negativeData = data.combined.find(
      (item) =>
        item.awareness === awarenessOption.value && item.sentiment === -1,
    );

    // Calculate neutral responses (awareness responses without sentiment)
    const totalWithSentiment =
      (positiveData?.count || 0) + (negativeData?.count || 0);
    const neutralCount = Math.max(
      0,
      (awarenessData?.count || 0) - totalWithSentiment,
    );

    const sentimentBreakdown = [
      {
        sentiment: "positive",
        count: positiveData?.count || 0,
        percentage: awarenessData?.count
          ? ((positiveData?.count || 0) / awarenessData.count) * 100
          : 0,
      },
      {
        sentiment: "neutral",
        count: neutralCount,
        percentage: awarenessData?.count
          ? (neutralCount / awarenessData.count) * 100
          : 0,
      },
      {
        sentiment: "negative",
        count: negativeData?.count || 0,
        percentage: awarenessData?.count
          ? ((negativeData?.count || 0) / awarenessData.count) * 100
          : 0,
      },
    ];

    return {
      awareness: awarenessOption.label,
      awarenessValue: awarenessOption.value,
      awarenessCount: awarenessData?.count || 0,
      sentimentBreakdown,
    };
  });

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
        {breakdown.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>{totalResponses} respondents</div>

            <div className="flex w-full gap-2">
              {breakdown
                .filter((item) => item.awarenessCount > 0)
                .map((item, index) => (
                  <div
                    key={item.awareness}
                    className="space-y-1"
                    style={{
                      width: `${(item.awarenessCount / actualResponses) * 100}%`,
                    }}
                  >
                    <div
                      className={cn(
                        "h-12 overflow-hidden rounded-xs text-xs",
                        AWARENESS_COLOR_MAP[
                          item.awarenessValue as keyof typeof AWARENESS_COLOR_MAP
                        ],
                      )}
                    >
                      {item.awareness}{" "}
                      {Math.round(
                        (item.awarenessCount / actualResponses) * 100,
                      )}
                      %
                    </div>

                    <div className="flex w-full gap-1">
                      {item.sentimentBreakdown
                        .filter((sentiment) => sentiment.count > 0)
                        .map((sentiment, index) => (
                          <div
                            key={sentiment.sentiment}
                            className={cn(
                              "h-4 overflow-hidden rounded-xs text-xs",
                              SENTIMENT_COLOR_MAP[
                                sentiment.sentiment as keyof typeof SENTIMENT_COLOR_MAP
                              ],
                            )}
                            style={{
                              width: `${(sentiment.percentage / 100) * 100}%`,
                            }}
                          >
                            {sentiment.percentage.toFixed(1)}%
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="space-y-4">
              {breakdown.map((item) => (
                <div key={item.awareness} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{item.awareness.toLowerCase()}</span>
                    <span>
                      {item.awarenessCount > 0
                        ? `${((item.awarenessCount / actualResponses) * 100).toFixed(1)}% (${item.awarenessCount.toLocaleString()} respondents)`
                        : "0% (0 respondents)"}
                    </span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.sentimentBreakdown.map((sentiment) => (
                      <div
                        key={sentiment.sentiment}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {sentiment.sentiment}:
                        </span>
                        <span>
                          {sentiment.percentage.toFixed(1)}% (
                          {sentiment.count.toLocaleString()} respondents)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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

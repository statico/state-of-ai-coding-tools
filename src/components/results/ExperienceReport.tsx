"use client";

import { QuestionTypeIcon } from "@/components/results/shared/QuestionTypeIcon";
import { ReportFooter } from "@/components/results/shared/ReportFooter";
import { ReportHeader } from "@/components/results/shared/ReportHeader";
import { ExperienceChart } from "./ExperienceChart";
import { Card, CardContent } from "@/components/ui/card";
import { AWARENESS_OPTIONS } from "@/lib/constants";

interface ExperienceReportProps {
  data: {
    options: Array<{
      optionSlug: string;
      label: string;
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
        <div className="space-y-8">
          {data.options.map((option) => {
            // Calculate the total responses for this specific option
            const optionTotalResponses = option.awareness.reduce(
              (sum, item) => sum + item.count,
              0,
            );

            // Create breakdown by awareness level and sentiment (reversed order)
            const breakdown = [...AWARENESS_OPTIONS]
              .reverse()
              .map((awarenessOption) => {
                const awarenessData = option.awareness.find(
                  (item) => item.level === awarenessOption.value,
                );

                // Get sentiment breakdown for this awareness level
                // Check for positive, negative, and neutral responses
                const positiveData = option.combined.find(
                  (item) =>
                    item.awareness === awarenessOption.value &&
                    item.sentiment === 1,
                );

                const negativeData = option.combined.find(
                  (item) =>
                    item.awareness === awarenessOption.value &&
                    item.sentiment === -1,
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
              <div key={option.optionSlug} className="space-y-4">
                {/* Option header */}
                <h4 className="text-foreground text-lg font-medium">
                  {option.label}
                </h4>

                <ExperienceChart
                  breakdown={breakdown}
                  actualResponses={optionTotalResponses}
                />
              </div>
            );
          })}

          <ReportFooter
            totalResponses={totalResponses}
            responseRate={responseRate}
          />
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { QuestionTypeIcon } from "@/components/results/shared/QuestionTypeIcon";
import { ReportHeader } from "@/components/results/shared/ReportHeader";
import { ExperienceChart } from "./ExperienceChart";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AWARENESS_OPTIONS } from "@/lib/constants";
import { User } from "lucide-react";
import { MarkdownText } from "@/components/ui/markdown-text";

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
        totalResponses={totalResponses}
        responseRate={responseRate}
      />

      <CardContent className="pt-0">
        <div className="space-y-8">
          {data.options
            .map((option) => {
              // Calculate percentages for each awareness level
              const totalResponses = option.awareness.reduce(
                (sum, item) => sum + item.count,
                0,
              );

              const usedItData = option.awareness.find(
                (item) => item.level === 2,
              );
              const heardOfItData = option.awareness.find(
                (item) => item.level === 1,
              );
              const neverHeardData = option.awareness.find(
                (item) => item.level === 0,
              );

              const usedItPercent =
                totalResponses > 0
                  ? ((usedItData?.count || 0) / totalResponses) * 100
                  : 0;
              const heardOfItPercent =
                totalResponses > 0
                  ? ((heardOfItData?.count || 0) / totalResponses) * 100
                  : 0;
              const neverHeardPercent =
                totalResponses > 0
                  ? ((neverHeardData?.count || 0) / totalResponses) * 100
                  : 0;

              // Calculate positive sentiment percentage for "Used it" responses
              const usedItPositiveData = option.combined.find(
                (item) => item.awareness === 2 && item.sentiment === 1,
              );
              const usedItPositivePercent =
                (usedItData?.count || 0) > 0
                  ? ((usedItPositiveData?.count || 0) /
                      (usedItData?.count || 1)) *
                    100
                  : 0;

              return {
                ...option,
                usedItPercent,
                heardOfItPercent,
                neverHeardPercent,
                usedItPositivePercent,
              };
            })
            .sort((a, b) => {
              // Primary sort: by "Used it" percentage (descending)
              if (b.usedItPercent !== a.usedItPercent) {
                return b.usedItPercent - a.usedItPercent;
              }

              // Secondary sort: by "Heard of it" percentage (descending)
              if (b.heardOfItPercent !== a.heardOfItPercent) {
                return b.heardOfItPercent - a.heardOfItPercent;
              }

              // Tertiary sort: by "Never heard of it" percentage (ascending - lower is better)
              if (a.neverHeardPercent !== b.neverHeardPercent) {
                return a.neverHeardPercent - b.neverHeardPercent;
              }

              // Final sort: by positive sentiment percentage for "Used it" (descending)
              return b.usedItPositivePercent - a.usedItPositivePercent;
            })
            .map((option) => {
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
                        ? ((positiveData?.count || 0) / awarenessData.count) *
                          100
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
                        ? ((negativeData?.count || 0) / awarenessData.count) *
                          100
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
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground text-lg font-medium">
                      <MarkdownText>{option.label}</MarkdownText>
                    </h4>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <User className="h-4 w-4" />
                      <span>{optionTotalResponses}</span>
                    </div>
                  </div>

                  <ExperienceChart
                    breakdown={breakdown}
                    actualResponses={optionTotalResponses}
                  />
                </div>
              );
            })}
        </div>

        {/* Comments Section */}
        {comments.length > 0 && (
          <div className="mt-8 space-y-2">
            <h4 className="text-muted-foreground text-sm font-medium">
              {comments.length} Comment{comments.length === 1 ? "" : "s"}
            </h4>
            <ScrollArea className="h-32 rounded-md border md:h-48">
              <div className="space-y-2 p-4">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { WeekSelector } from "@/components/results/WeekSelector";
import { IncompleteWeekBanner } from "@/components/results/IncompleteWeekBanner";
import { SingleChoiceReport } from "@/components/results/SingleChoiceReport";
import { MultipleChoiceReport } from "@/components/results/MultipleChoiceReport";
import { ExperienceReport } from "@/components/results/ExperienceReport";
import { NumericReport } from "@/components/results/NumericReport";
import { FreeformReport } from "@/components/results/FreeformReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { getCurrentISOWeek, isCurrentWeek } from "@/lib/utils";
import { useState } from "react";

export default function ReportsPage() {
  const trpc = useTRPC();
  const current = getCurrentISOWeek();
  const [selectedWeek, setSelectedWeek] = useState(current.week);
  const [selectedYear, setSelectedYear] = useState(current.year);

  const { data: availableWeeks = [], isLoading: weeksLoading } = useQuery(
    trpc.results.getAllWeeksSinceStart.queryOptions(),
  );

  const { data: weekSummary, isLoading: summaryLoading } = useQuery(
    trpc.results.getWeekSummary.queryOptions(
      { week: selectedWeek, year: selectedYear },
      { enabled: !!selectedWeek && !!selectedYear },
    ),
  );

  const handleWeekChange = (week: number, year: number) => {
    setSelectedWeek(week);
    setSelectedYear(year);
  };

  const isCurrent = isCurrentWeek(selectedWeek, selectedYear);

  if (weeksLoading) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <div className="space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Survey Results</h1>
            <p className="text-muted-foreground">
              View aggregated survey results by week
            </p>
          </div>

          <WeekSelector
            currentWeek={selectedWeek}
            currentYear={selectedYear}
            availableWeeks={availableWeeks}
            onWeekChange={handleWeekChange}
          />
        </div>

        {/* Incomplete Week Banner */}
        <IncompleteWeekBanner isCurrentWeek={isCurrent} />

        {/* Week Summary */}
        {summaryLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : weekSummary ? (
          <Card>
            <CardHeader>
              <CardTitle>Week Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {weekSummary.totalResponses}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Total Responses
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {weekSummary.uniqueSessions}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Unique Sessions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {weekSummary.questions.length}
                  </div>
                  <div className="text-muted-foreground text-sm">Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No survey responses found for the selected week.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Question Reports */}
        {weekSummary && weekSummary.questions.length > 0 && (
          <div className="space-y-8">
            {weekSummary.questions.map((question) => (
              <Card key={question.questionSlug}>
                <CardHeader>
                  <CardTitle>{question.questionTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  {question.questionType === "single" && question.data && (
                    <SingleChoiceReport
                      data={question.data}
                      totalResponses={question.totalResponses}
                      skippedResponses={question.skippedResponses}
                    />
                  )}

                  {question.questionType === "multiple" && question.data && (
                    <MultipleChoiceReport
                      data={question.data}
                      totalResponses={question.totalResponses}
                      skippedResponses={question.skippedResponses}
                    />
                  )}

                  {question.questionType === "experience" && question.data && (
                    <ExperienceReport
                      data={question.data}
                      totalResponses={question.totalResponses}
                      skippedResponses={question.skippedResponses}
                    />
                  )}

                  {question.questionType === "numeric" && question.data && (
                    <NumericReport
                      data={question.data}
                      totalResponses={question.totalResponses}
                      skippedResponses={question.skippedResponses}
                    />
                  )}

                  {(question.questionType === "freeform" ||
                    question.questionType === "single-freeform" ||
                    question.questionType === "multiple-freeform") &&
                    question.data && (
                      <FreeformReport
                        data={question.data}
                        totalResponses={question.totalResponses}
                        skippedResponses={question.skippedResponses}
                      />
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

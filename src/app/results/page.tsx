"use client";

import { WeekSelector } from "@/components/results/WeekSelector";
import { IncompleteWeekBanner } from "@/components/results/IncompleteWeekBanner";
import { SingleChoiceReport } from "@/components/results/SingleChoiceReport";
import { MultipleChoiceReport } from "@/components/results/MultipleChoiceReport";
import { ExperienceReport } from "@/components/results/ExperienceReport";
import { NumericReport } from "@/components/results/NumericReport";
import { FreeformReport } from "@/components/results/FreeformReport";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { getCurrentISOWeek, isCurrentWeek } from "@/lib/utils";
import { useQueryState, parseAsInteger } from "nuqs";
import pluralize from "pluralize";

export default function ReportsPage() {
  const trpc = useTRPC();
  const current = getCurrentISOWeek();

  // Read week and year from URL query parameters
  const [selectedWeek] = useQueryState(
    "week",
    parseAsInteger.withDefault(current.week),
  );
  const [selectedYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(current.year),
  );

  const { data: availableWeeks = [], isLoading: weeksLoading } = useQuery(
    trpc.results.getAllWeeksSinceStart.queryOptions(),
  );

  const { data: weekSummary, isLoading: summaryLoading } = useQuery(
    trpc.results.getWeekSummary.queryOptions(
      { week: selectedWeek, year: selectedYear },
      { enabled: !!selectedWeek && !!selectedYear },
    ),
  );

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
          <h1 className="text-3xl">Results by Week</h1>
          <WeekSelector availableWeeks={availableWeeks} />
        </div>

        {/* Week Summary */}
        {summaryLoading ? (
          <Skeleton className="h-6 w-64" />
        ) : weekSummary ? (
          <p className="text-muted-foreground">
            {weekSummary.uniqueSessions}{" "}
            {pluralize("respondent", weekSummary.uniqueSessions)} ·{" "}
            {weekSummary.totalResponses}{" "}
            {pluralize("total response", weekSummary.totalResponses)} for{" "}
            {weekSummary.questions.length}{" "}
            {pluralize("question", weekSummary.questions.length)}
          </p>
        ) : (
          <p className="text-muted-foreground">No data</p>
        )}

        {/* Question Reports */}
        {weekSummary && weekSummary.questions.length > 0 && (
          <div className="space-y-6">
            {weekSummary.questions.map((question) => (
              <div key={question.questionSlug}>
                {question.questionType === "single" && question.data && (
                  <SingleChoiceReport
                    data={question.data}
                    totalResponses={question.totalResponses}
                    skippedResponses={question.skippedResponses}
                    questionTitle={question.questionTitle}
                    questionType={question.questionType}
                    questionDescription={question.questionDescription}
                    multipleMax={question.multipleMax}
                    randomize={question.randomize}
                    comments={question.comments}
                  />
                )}

                {question.questionType === "multiple" && question.data && (
                  <MultipleChoiceReport
                    data={question.data}
                    totalResponses={question.totalResponses}
                    skippedResponses={question.skippedResponses}
                    questionTitle={question.questionTitle}
                    questionType={question.questionType}
                    questionDescription={question.questionDescription}
                    multipleMax={question.multipleMax}
                    randomize={question.randomize}
                    comments={question.comments}
                  />
                )}

                {question.questionType === "experience" && question.data && (
                  <ExperienceReport
                    data={question.data}
                    totalResponses={question.totalResponses}
                    skippedResponses={question.skippedResponses}
                    questionTitle={question.questionTitle}
                    questionType={question.questionType}
                    questionDescription={question.questionDescription}
                    comments={question.comments}
                  />
                )}

                {question.questionType === "numeric" && question.data && (
                  <NumericReport
                    data={question.data}
                    totalResponses={question.totalResponses}
                    skippedResponses={question.skippedResponses}
                    questionTitle={question.questionTitle}
                    questionType={question.questionType}
                    questionDescription={question.questionDescription}
                    comments={question.comments}
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
                      questionTitle={question.questionTitle}
                      questionType={question.questionType}
                      questionDescription={question.questionDescription}
                      comments={question.comments}
                    />
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

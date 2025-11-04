"use client";

import { MonthSelector } from "@/components/results/MonthSelector";
import { IncompleteMonthBanner } from "@/components/results/IncompleteWeekBanner";
import { SingleChoiceReport } from "@/components/results/SingleChoiceReport";
import { MultipleChoiceReport } from "@/components/results/MultipleChoiceReport";
import { ExperienceReport } from "@/components/results/ExperienceReport";
import { NumericReport } from "@/components/results/NumericReport";
import { FreeformReport } from "@/components/results/FreeformReport";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { getCurrentMonth, isCurrentMonth, formatWithCount } from "@/lib/utils";
import { useQueryState, parseAsInteger } from "nuqs";

export function ReportsPageContent() {
  const trpc = useTRPC();
  const current = getCurrentMonth();

  // Read month and year from URL query parameters
  const [selectedMonth] = useQueryState(
    "month",
    parseAsInteger.withDefault(current.month),
  );
  const [selectedYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(current.year),
  );

  const { data: availableMonths = [], isLoading: monthsLoading } = useQuery(
    trpc.results.getAllMonthsSinceStart.queryOptions(),
  );

  const { data: monthSummary, isLoading: summaryLoading } = useQuery(
    trpc.results.getMonthSummary.queryOptions(
      { month: selectedMonth, year: selectedYear },
      { enabled: !!selectedMonth && !!selectedYear },
    ),
  );

  const isCurrent = isCurrentMonth(selectedMonth, selectedYear);

  if (monthsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MonthSelector availableMonths={availableMonths} />

      {/* Month Summary */}
      {summaryLoading ? (
        <Skeleton className="h-6 w-64" />
      ) : monthSummary ? (
        <p className="text-muted-foreground">
          {formatWithCount(monthSummary.uniqueSessions, "respondent")} ·{" "}
          {formatWithCount(monthSummary.totalResponses, "total response")} for{" "}
          {formatWithCount(monthSummary.questions.length, "question")}
        </p>
      ) : (
        <p className="text-muted-foreground">No data</p>
      )}

      {/* Question Reports */}
      {monthSummary && monthSummary.questions.length > 0 && (
        <div className="space-y-6">
          {monthSummary.questions.map((question) => (
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
  );
}

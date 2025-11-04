"use client";

import { SurveyHeader } from "@/components/SurveyHeader";
import { ExperienceQuestion } from "@/components/survey/ExperienceQuestion";
import { FreeformQuestion } from "@/components/survey/FreeformQuestion";
import { MultipleChoiceQuestion } from "@/components/survey/MultipleChoiceQuestion";
import { MultipleFreeformQuestion } from "@/components/survey/MultipleFreeformQuestion";
import { NumericQuestion } from "@/components/survey/NumericQuestion";
import { SingleChoiceQuestion } from "@/components/survey/SingleChoiceQuestion";
import { SingleFreeformQuestion } from "@/components/survey/SingleFreeformQuestion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { MarkdownText } from "@/components/ui/markdown-text";
import { ResponseData } from "@/lib/constants";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useSectionNavigation } from "@/hooks/use-section-navigation";

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Check authentication status
  const { data: authData } = useQuery(trpc.auth.check.queryOptions());
  const isAuthenticated =
    authData && typeof authData === "object" && "isAuthenticated" in authData
      ? authData.isAuthenticated
      : false;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authData && !isAuthenticated) {
      router.push("/");
    }
  }, [authData, isAuthenticated, router]);

  const { data: sections, isLoading: sectionsLoading } = useQuery(
    trpc.survey.getSections.queryOptions(),
  );
  const { data: questions, isLoading: questionsLoading } = useQuery(
    trpc.survey.getQuestionsBySection.queryOptions(
      { sectionSlug: slug },
      { enabled: !!slug },
    ),
  );
  const { data: responsesData } = useQuery(
    trpc.survey.getResponses.queryOptions(),
  );

  const { data: sessionData } = useQuery(trpc.survey.getSession.queryOptions());

  const responses =
    responsesData &&
    typeof responsesData === "object" &&
    "responses" in responsesData
      ? responsesData.responses
      : [];

  // Log session ID when survey is loaded
  useEffect(() => {
    if (sessionData?.sessionId) {
      console.log("Survey session ID:", sessionData.sessionId);
    }
  }, [sessionData?.sessionId]);

  const saveResponseMutation = useMutation(
    trpc.survey.saveResponse.mutationOptions(),
  );

  const saveExperienceResponsesMutation = useMutation(
    trpc.survey.saveExperienceResponses.mutationOptions(),
  );

  const { data: canFillFromPrevious } = useQuery(
    trpc.survey.canFillFromPreviousMonth.queryOptions(),
  );

  const fillFromPreviousMonthMutation = useMutation(
    trpc.survey.fillFromPreviousMonth.mutationOptions(),
  );

  const { currentSection, nextSection, prevSection, currentSectionIndex } =
    useSectionNavigation();

  const handleResponseChange = useCallback(
    async (questionSlug: string, responseData: ResponseData) => {
      try {
        await saveResponseMutation.mutateAsync({
          questionSlug,
          ...responseData,
        });
        // Invalidate completion percentage to update the header
        queryClient.invalidateQueries({
          queryKey: trpc.survey.getCompletionPercentage.queryKey(),
        });
      } catch (error) {
        console.error("Failed to save response:", error);
      }
    },
    [saveResponseMutation, queryClient, trpc.survey.getCompletionPercentage],
  );

  const handleExperienceResponseChange = useCallback(
    async (questionSlug: string, data: any[]) => {
      // For experience questions, we need to handle multiple responses
      try {
        await saveExperienceResponsesMutation.mutateAsync({
          questionSlug,
          responses: data,
        });
        // Invalidate completion percentage to update the header
        queryClient.invalidateQueries({
          queryKey: trpc.survey.getCompletionPercentage.queryKey(),
        });
      } catch (error) {
        console.error("Failed to save experience responses:", error);
      }
    },
    [
      saveExperienceResponsesMutation,
      queryClient,
      trpc.survey.getCompletionPercentage,
    ],
  );

  // Memoize the response change handlers for each question
  const getResponseChangeHandler = useCallback(
    (questionSlug: string) => (data: any) =>
      handleResponseChange(questionSlug, data),
    [handleResponseChange],
  );

  const getExperienceResponseChangeHandler = useCallback(
    (questionSlug: string) => (data: any[]) =>
      handleExperienceResponseChange(questionSlug, data),
    [handleExperienceResponseChange],
  );

  const handleFillFromPreviousMonth = useCallback(async () => {
    try {
      await fillFromPreviousMonthMutation.mutateAsync();
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: trpc.survey.canFillFromPreviousMonth.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.survey.getCompletionPercentage.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.survey.getResponses.queryKey(),
      });
    } catch (error) {
      console.error("Failed to fill from previous month:", error);
    }
  }, [fillFromPreviousMonthMutation, queryClient, trpc]);

  const handleNext = () => {
    if (nextSection) {
      router.push(`/survey/${nextSection.slug}`);
    } else {
      router.push("/outro");
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (prevSection) {
      router.push(`/survey/${prevSection.slug}`);
    } else {
      router.push("/intro");
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show loading while checking authentication or loading sections
  if (!authData || sectionsLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  if (!currentSection) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Section not found</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              The section you are looking for does not exist. Maybe it was
              changed or deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto max-w-4xl p-6">
        <SurveyHeader />

        <div className="space-y-6 lg:space-y-10">
          {/* Section header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h2 className="text-3xl">
                <MarkdownText>{currentSection.title}</MarkdownText>
              </h2>
              {currentSection.description && (
                <div className="text-muted-foreground">
                  <MarkdownText>{currentSection.description}</MarkdownText>
                </div>
              )}
            </div>
            {canFillFromPrevious && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-muted-foreground text-sm">Welcome back!</p>
                <Button
                  onClick={handleFillFromPreviousMonth}
                  disabled={fillFromPreviousMonthMutation.isPending}
                >
                  {fillFromPreviousMonthMutation.isPending
                    ? "Copying..."
                    : "Copy Previous Responses"}
                </Button>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-6 lg:space-y-10">
            {questionsLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Spinner />
              </div>
            ) : questions && Array.isArray(questions) ? (
              questions.map((question: any) => {
                const existingResponse =
                  responses && Array.isArray(responses)
                    ? responses.find(
                        (r: any) => r.question_slug === question.slug,
                      )
                    : undefined;

                const commonProps = {
                  question,
                  existingResponse,
                  onResponseChange: getResponseChangeHandler(question.slug),
                };

                const experienceProps = {
                  question,
                  existingResponses:
                    responses && Array.isArray(responses)
                      ? responses.filter(
                          (r: any) => r.question_slug === question.slug,
                        )
                      : [],
                  onResponseChange: getExperienceResponseChangeHandler(
                    question.slug,
                  ),
                };

                switch (question.type) {
                  case "single":
                    return (
                      <SingleChoiceQuestion
                        key={question.slug}
                        {...commonProps}
                      />
                    );
                  case "multiple":
                    return (
                      <MultipleChoiceQuestion
                        key={question.slug}
                        {...commonProps}
                      />
                    );
                  case "experience":
                    return (
                      <ExperienceQuestion
                        key={question.slug}
                        {...experienceProps}
                      />
                    );
                  case "numeric":
                    return (
                      <NumericQuestion key={question.slug} {...commonProps} />
                    );
                  case "single-freeform":
                    return (
                      <SingleFreeformQuestion
                        key={question.slug}
                        {...commonProps}
                      />
                    );
                  case "multiple-freeform":
                    return (
                      <MultipleFreeformQuestion
                        key={question.slug}
                        {...commonProps}
                      />
                    );
                  case "freeform":
                    return (
                      <FreeformQuestion key={question.slug} {...commonProps} />
                    );
                  default:
                    return null;
                }
              })
            ) : null}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="size-4" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {nextSection ? "Next Section" : "Complete Survey"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

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
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const trpc = useTRPC();

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

  const responses = responsesData?.responses;

  const saveResponseMutation = useMutation(
    trpc.survey.saveResponse.mutationOptions(),
  );

  const currentSection = sections?.find((s) => s.slug === slug);
  const currentSectionIndex = sections?.findIndex((s) => s.slug === slug) ?? -1;
  const nextSection =
    currentSectionIndex >= 0 &&
    currentSectionIndex < (sections?.length ?? 0) - 1
      ? sections?.[currentSectionIndex + 1]
      : null;

  const handleResponseChange = async (
    questionSlug: string,
    responseData: any,
  ) => {
    try {
      await saveResponseMutation.mutateAsync({
        questionSlug,
        ...responseData,
      });
    } catch (error) {
      console.error("Failed to save response:", error);
    }
  };

  const handleNext = () => {
    if (nextSection) {
      router.push(`/survey/${nextSection.slug}`);
    } else {
      router.push("/outro");
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      const prevSection = sections?.[currentSectionIndex - 1];
      if (prevSection) {
        router.push(`/survey/${prevSection.slug}`);
      }
    } else {
      router.push("/intro");
    }
  };

  if (sectionsLoading || questionsLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Section not found</CardTitle>
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
    <div className="container mx-auto max-w-4xl p-4">
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            Section {currentSectionIndex + 1} of {sections?.length}
          </span>
          <span>{currentSection.title}</span>
        </div>

        {/* Section header */}
        <div className="space-y-2">
          <h2 className="text-2xl">{currentSection.title}</h2>
          {currentSection.description && (
            <p className="text-muted-foreground">
              {currentSection.description}
            </p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions?.map((question) => {
            const existingResponse = responses?.find(
              (r) => r.question_slug === question.slug,
            );

            const commonProps = {
              question,
              existingResponse,
              onResponseChange: (data: any) =>
                handleResponseChange(question.slug, data),
            };

            switch (question.type) {
              case "single":
                return (
                  <SingleChoiceQuestion key={question.slug} {...commonProps} />
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
                  <ExperienceQuestion key={question.slug} {...commonProps} />
                );
              case "numeric":
                return <NumericQuestion key={question.slug} {...commonProps} />;
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
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
          <Button onClick={handleNext}>
            {nextSection ? "Next Section" : "Complete Survey"}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { SurveyHeader } from "@/components/survey-header";
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
import { ResponseData } from "@/lib/constants";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

  const responses =
    responsesData &&
    typeof responsesData === "object" &&
    "responses" in responsesData
      ? responsesData.responses
      : [];

  const saveResponseMutation = useMutation(
    trpc.survey.saveResponse.mutationOptions(),
  );

  const currentSection =
    sections && Array.isArray(sections)
      ? sections.find((s: any) => s.slug === slug)
      : undefined;
  const currentSectionIndex =
    sections && Array.isArray(sections)
      ? sections.findIndex((s: any) => s.slug === slug)
      : -1;
  const nextSection =
    currentSectionIndex >= 0 &&
    currentSectionIndex <
      (sections && Array.isArray(sections) ? sections.length : 0) - 1
      ? sections && Array.isArray(sections)
        ? sections[currentSectionIndex + 1]
        : null
      : null;

  const handleResponseChange = async (
    questionSlug: string,
    responseData: ResponseData,
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
    if (currentSectionIndex > 0 && sections && Array.isArray(sections)) {
      const prevSection = sections[currentSectionIndex - 1];
      if (
        prevSection &&
        typeof prevSection === "object" &&
        "slug" in prevSection
      ) {
        router.push(`/survey/${prevSection.slug}`);
      }
    } else {
      router.push("/intro");
    }
  };

  if (sectionsLoading || questionsLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
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
    <>
      <div className="container mx-auto max-w-4xl p-6">
        <SurveyHeader />

        <div className="space-y-6">
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
            {questions && Array.isArray(questions)
              ? questions.map((question: any) => {
                  const existingResponse =
                    responses && Array.isArray(responses)
                      ? responses.find(
                          (r: any) => r.question_slug === question.slug,
                        )
                      : undefined;

                  const commonProps = {
                    question,
                    existingResponse,
                    onResponseChange: (data: any) =>
                      handleResponseChange(question.slug, data),
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
                          {...commonProps}
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
                        <FreeformQuestion
                          key={question.slug}
                          {...commonProps}
                        />
                      );
                    default:
                      return null;
                  }
                })
              : null}
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

import { getCurrentMonth } from "../utils";
import { getActiveQuestionsBySection } from "./questions";
import { getResponsesBySession } from "./responses";
import { getActiveSections } from "./sections";

export interface SectionCompletion {
  sectionSlug: string;
  sectionTitle: string;
  completedQuestions: number;
  totalQuestions: number;
  percentage: number;
}

export interface CompletionData {
  overallPercentage: number;
  totalCompletedQuestions: number;
  totalQuestions: number;
  sectionCompletion: SectionCompletion[];
}

export async function getCompletionPercentage(
  sessionId: string,
): Promise<CompletionData> {
  // Get current month and year
  const { month, year } = getCurrentMonth();

  // Get all active sections
  const sections = await getActiveSections();

  // Get all active questions across all sections
  const allQuestions = await Promise.all(
    sections.map((section) => getActiveQuestionsBySection(section.slug)),
  );
  const flatQuestions = allQuestions.flat();

  // Get user's responses for current month
  const userResponses = await getResponsesBySession(sessionId, month, year);

  // Calculate completion percentage for each section
  const sectionCompletion = sections.map((section) => {
    const sectionQuestions = allQuestions[sections.indexOf(section)];
    const sectionResponses = userResponses.filter((response) =>
      sectionQuestions.some((q) => q.slug === response.question_slug),
    );

    // For experience questions, we need to group by question_slug since each option gets its own row
    const questionCompletionMap = new Map<string, boolean>();

    sectionResponses.forEach((response) => {
      const questionSlug = response.question_slug;
      const sectionQuestion = sectionQuestions.find(
        (q) => q.slug === questionSlug,
      );

      // Skip if this question is not in this section
      if (!sectionQuestion) return;

      // If already marked as completed, don't override
      if (
        questionCompletionMap.has(questionSlug) &&
        questionCompletionMap.get(questionSlug)
      ) {
        return;
      }

      // Check if this response indicates completion
      let isCompleted = false;

      // If skipped, it counts as completed
      if (response.skipped) {
        isCompleted = true;
      } else {
        // If not skipped, check if it has actual values
        isCompleted = !!(
          response.single_option_slug ||
          response.single_writein_response ||
          response.multiple_option_slugs?.length ||
          response.multiple_writein_responses ||
          response.experience_awareness !== null ||
          response.experience_sentiment !== null ||
          response.freeform_response ||
          response.numeric_response !== null
        );
      }

      questionCompletionMap.set(questionSlug, isCompleted);
    });

    // Count unique completed questions
    const completedQuestions = Array.from(
      questionCompletionMap.values(),
    ).filter(Boolean).length;
    const totalQuestions = sectionQuestions.length;

    return {
      sectionSlug: section.slug,
      sectionTitle: section.title,
      completedQuestions,
      totalQuestions,
      percentage:
        totalQuestions > 0
          ? Math.round((completedQuestions / totalQuestions) * 100)
          : 0,
    };
  });

  // Calculate overall completion percentage (including skipped responses)
  // For experience questions, we need to group by question_slug since each option gets its own row
  const overallQuestionCompletionMap = new Map<string, boolean>();

  userResponses.forEach((response) => {
    const questionSlug = response.question_slug;

    // If already marked as completed, don't override
    if (
      overallQuestionCompletionMap.has(questionSlug) &&
      overallQuestionCompletionMap.get(questionSlug)
    ) {
      return;
    }

    // Check if this response indicates completion
    let isCompleted = false;

    // If skipped, it counts as completed
    if (response.skipped) {
      isCompleted = true;
    } else {
      // If not skipped, check if it has actual values
      isCompleted = !!(
        response.single_option_slug ||
        response.single_writein_response ||
        response.multiple_option_slugs?.length ||
        response.multiple_writein_responses ||
        response.experience_awareness !== null ||
        response.experience_sentiment !== null ||
        response.freeform_response ||
        response.numeric_response !== null
      );
    }

    overallQuestionCompletionMap.set(questionSlug, isCompleted);
  });

  const totalCompletedQuestions = Array.from(
    overallQuestionCompletionMap.values(),
  ).filter(Boolean).length;
  const totalQuestions = flatQuestions.length;
  const overallPercentage =
    totalQuestions > 0
      ? Math.round((totalCompletedQuestions / totalQuestions) * 100)
      : 0;

  return {
    overallPercentage,
    totalCompletedQuestions,
    totalQuestions,
    sectionCompletion,
  };
}

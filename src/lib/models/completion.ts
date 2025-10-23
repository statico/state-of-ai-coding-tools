import { getCurrentISOWeek } from "../utils";
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
  // Get current week and year
  const { week, year } = getCurrentISOWeek();

  // Get all active sections
  const sections = await getActiveSections();

  // Get all active questions across all sections
  const allQuestions = await Promise.all(
    sections.map((section) => getActiveQuestionsBySection(section.slug)),
  );
  const flatQuestions = allQuestions.flat();

  // Get user's responses for current week
  const userResponses = await getResponsesBySession(sessionId, week, year);

  // Calculate completion percentage for each section
  const sectionCompletion = sections.map((section) => {
    const sectionQuestions = allQuestions[sections.indexOf(section)];
    const sectionResponses = userResponses.filter((response) =>
      sectionQuestions.some((q) => q.slug === response.question_slug),
    );

    // Count responses that have actual values (not just skipped or empty)
    const completedQuestions = sectionResponses.filter((response) => {
      // If skipped, it counts as completed
      if (response.skipped) {
        return true;
      }

      // If not skipped, check if it has actual values
      return !!(
        response.single_option_slug ||
        response.single_writein_response ||
        response.multiple_option_slugs?.length ||
        response.multiple_writein_responses ||
        response.experience_awareness !== null ||
        response.experience_sentiment !== null ||
        response.freeform_response ||
        response.numeric_response !== null
      );
    }).length;
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
  const totalCompletedQuestions = userResponses.filter((response) => {
    // If skipped, it counts as completed
    if (response.skipped) {
      return true;
    }

    // If not skipped, check if it has actual values
    return !!(
      response.single_option_slug ||
      response.single_writein_response ||
      response.multiple_option_slugs?.length ||
      response.multiple_writein_responses ||
      response.experience_awareness !== null ||
      response.experience_sentiment !== null ||
      response.freeform_response ||
      response.numeric_response !== null
    );
  }).length;
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

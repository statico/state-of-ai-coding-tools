import { db } from "@/server/db";
import type { Responses } from "@/server/db/types";
import type { Insertable, Selectable, Updateable } from "kysely";
import { getCurrentMonth, getPreviousMonth } from "@/lib/utils";
import { getActiveQuestions } from "./questions";
import { getActiveSections } from "./sections";

export type SelectableResponse = Selectable<Responses>;
export type InsertableResponse = Insertable<Responses>;
export type UpdateableResponse = Updateable<Responses>;

export async function getResponsesBySession(
  sessionId: string,
  month: number,
  year: number,
) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("session_id", "=", sessionId)
    .where("month", "=", month)
    .where("year", "=", year)
    .execute();
}

export async function getResponseByQuestion(
  sessionId: string,
  month: number,
  year: number,
  questionSlug: string,
) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("session_id", "=", sessionId)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("question_slug", "=", questionSlug)
    .executeTakeFirst();
}

export async function getResponsesByMonth(month: number, year: number) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("month", "=", month)
    .where("year", "=", year)
    .execute();
}

export async function getResponsesByQuestionSlug(questionSlug: string) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .execute();
}

export async function createResponse(data: {
  session_id: string;
  month: number;
  year: number;
  question_slug: string;
  option_slug?: string;
  skipped?: boolean;
  single_option_slug?: string;
  single_writein_response?: string;
  multiple_option_slugs?: string[];
  multiple_writein_responses?: string[];
  experience_awareness?: number;
  experience_sentiment?: number;
  freeform_response?: string;
  numeric_response?: number;
  comment?: string;
}) {
  return await db
    .insertInto("responses")
    .values({
      ...data,
      skipped: data.skipped ?? false,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateResponse(
  sessionId: string,
  month: number,
  year: number,
  questionSlug: string,
  optionSlug: string | null | undefined,
  data: UpdateableResponse,
) {
  const query = db
    .updateTable("responses")
    .set(data)
    .where("session_id", "=", sessionId)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("question_slug", "=", questionSlug);

  if (optionSlug !== undefined) {
    query.where("option_slug", "=", optionSlug);
  }

  return await query.returningAll().executeTakeFirstOrThrow();
}

export async function upsertResponse(data: InsertableResponse) {
  return await db
    .insertInto("responses")
    .values(data)
    .onConflict((oc) =>
      oc.constraint("responses_pkey").doUpdateSet({
        skipped: (eb) => eb.ref("excluded.skipped"),
        single_option_slug: (eb) => eb.ref("excluded.single_option_slug"),
        single_writein_response: (eb) =>
          eb.ref("excluded.single_writein_response"),
        multiple_option_slugs: (eb) => eb.ref("excluded.multiple_option_slugs"),
        multiple_writein_responses: (eb) =>
          eb.ref("excluded.multiple_writein_responses"),
        experience_awareness: (eb) => eb.ref("excluded.experience_awareness"),
        experience_sentiment: (eb) => eb.ref("excluded.experience_sentiment"),
        freeform_response: (eb) => eb.ref("excluded.freeform_response"),
        numeric_response: (eb) => eb.ref("excluded.numeric_response"),
        comment: (eb) => eb.ref("excluded.comment"),
      }),
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteResponse(
  sessionId: string,
  month: number,
  year: number,
  questionSlug: string,
  optionSlug?: string | null,
) {
  const query = db
    .deleteFrom("responses")
    .where("session_id", "=", sessionId)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("question_slug", "=", questionSlug);

  if (optionSlug !== undefined) {
    query.where("option_slug", "=", optionSlug);
  }

  return await query.returningAll().executeTakeFirstOrThrow();
}

// New functions for handling option-specific responses
export async function getResponsesByQuestionAndOption(
  sessionId: string,
  month: number,
  year: number,
  questionSlug: string,
) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("session_id", "=", sessionId)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("question_slug", "=", questionSlug)
    .execute();
}

export async function getResponseByQuestionAndOption(
  sessionId: string,
  month: number,
  year: number,
  questionSlug: string,
  optionSlug: string,
) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("session_id", "=", sessionId)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("question_slug", "=", questionSlug)
    .where("option_slug", "=", optionSlug)
    .executeTakeFirst();
}

export interface ExperienceResponse {
  optionSlug: string;
  experienceAwareness: number;
  experienceSentiment?: number;
  skipped?: boolean;
  comment?: string;
}

export async function saveExperienceResponses(
  sessionId: string,
  month: number,
  year: number,
  questionSlug: string,
  responses: ExperienceResponse[],
) {
  // First, delete all existing experience responses for this question
  await db
    .deleteFrom("responses")
    .where("session_id", "=", sessionId)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("question_slug", "=", questionSlug)
    .execute();

  // Then insert the new responses
  const savedResponses = await Promise.all(
    responses.map((responseData) =>
      db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          month: month,
          year: year,
          question_slug: questionSlug,
          option_slug: responseData.optionSlug,
          skipped: responseData.skipped ?? false,
          experience_awareness: responseData.experienceAwareness,
          experience_sentiment: responseData.experienceSentiment,
          comment: responseData.comment,
        } as any)
        .returningAll()
        .executeTakeFirstOrThrow(),
    ),
  );

  return savedResponses;
}

export async function canFillFromPreviousMonth(
  sessionId: string,
): Promise<boolean> {
  const current = getCurrentMonth();
  const previous = getPreviousMonth(current.month, current.year);

  // Check if there are responses for the previous month
  const previousMonthResponses = await getResponsesBySession(
    sessionId,
    previous.month,
    previous.year,
  );

  // Check if there are responses for the current month
  const currentMonthResponses = await getResponsesBySession(
    sessionId,
    current.month,
    current.year,
  );

  // Return true if there are previous month responses but no current month responses
  return (
    previousMonthResponses.length > 0 && currentMonthResponses.length === 0
  );
}

export async function fillFromPreviousMonth(
  sessionId: string,
): Promise<SelectableResponse[]> {
  const current = getCurrentMonth();
  const previous = getPreviousMonth(current.month, current.year);

  // Get all active sections and questions
  const activeSections = await getActiveSections();
  const activeSectionSlugs = new Set(activeSections.map((s) => s.slug));

  const activeQuestions = await getActiveQuestions();
  const activeQuestionSlugs = new Set(activeQuestions.map((q) => q.slug));

  // Get previous month responses
  const previousResponses = await getResponsesBySession(
    sessionId,
    previous.month,
    previous.year,
  );

  // Filter to only active questions (and their sections must be active)
  const responsesToCopy = previousResponses.filter((response) => {
    // Check if the question is active
    if (!activeQuestionSlugs.has(response.question_slug)) {
      return false;
    }

    // Find the question to check its section
    const question = activeQuestions.find(
      (q) => q.slug === response.question_slug,
    );
    if (!question) {
      return false;
    }

    // Check if the question's section is active
    return activeSectionSlugs.has(question.section_slug);
  });

  // Copy each response to the current month
  const copiedResponses = await Promise.all(
    responsesToCopy.map((previousResponse) =>
      upsertResponse({
        session_id: sessionId,
        month: current.month,
        year: current.year,
        question_slug: previousResponse.question_slug,
        option_slug: previousResponse.option_slug ?? undefined,
        skipped: previousResponse.skipped ?? false,
        single_option_slug: previousResponse.single_option_slug ?? undefined,
        single_writein_response:
          previousResponse.single_writein_response ?? undefined,
        multiple_option_slugs:
          previousResponse.multiple_option_slugs ?? undefined,
        multiple_writein_responses:
          previousResponse.multiple_writein_responses ?? undefined,
        experience_awareness:
          previousResponse.experience_awareness ?? undefined,
        experience_sentiment:
          previousResponse.experience_sentiment ?? undefined,
        freeform_response: previousResponse.freeform_response ?? undefined,
        numeric_response: previousResponse.numeric_response ?? undefined,
        comment: previousResponse.comment ?? undefined,
      }),
    ),
  );

  return copiedResponses;
}

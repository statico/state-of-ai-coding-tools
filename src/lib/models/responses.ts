import { db } from "@/server/db";
import type { Responses } from "@/server/db/types";
import type { Insertable, Selectable, Updateable } from "kysely";

export type SelectableResponse = Selectable<Responses>;
export type InsertableResponse = Insertable<Responses>;
export type UpdateableResponse = Updateable<Responses>;

export async function getResponsesBySession(
  sessionId: string,
  isoWeek: number,
  isoYear: number,
) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("session_id", "=", sessionId)
    .where("iso_week", "=", isoWeek)
    .where("iso_year", "=", isoYear)
    .execute();
}

export async function getResponseByQuestion(
  sessionId: string,
  isoWeek: number,
  isoYear: number,
  questionSlug: string,
) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("session_id", "=", sessionId)
    .where("iso_week", "=", isoWeek)
    .where("iso_year", "=", isoYear)
    .where("question_slug", "=", questionSlug)
    .executeTakeFirst();
}

export async function getResponsesByWeek(isoWeek: number, isoYear: number) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("iso_week", "=", isoWeek)
    .where("iso_year", "=", isoYear)
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
  iso_week: number;
  iso_year: number;
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
  isoWeek: number,
  isoYear: number,
  questionSlug: string,
  optionSlug: string | null | undefined,
  data: UpdateableResponse,
) {
  const query = db
    .updateTable("responses")
    .set(data)
    .where("session_id", "=", sessionId)
    .where("iso_week", "=", isoWeek)
    .where("iso_year", "=", isoYear)
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
  isoWeek: number,
  isoYear: number,
  questionSlug: string,
  optionSlug?: string | null,
) {
  const query = db
    .deleteFrom("responses")
    .where("session_id", "=", sessionId)
    .where("iso_week", "=", isoWeek)
    .where("iso_year", "=", isoYear)
    .where("question_slug", "=", questionSlug);

  if (optionSlug !== undefined) {
    query.where("option_slug", "=", optionSlug);
  }

  return await query.returningAll().executeTakeFirstOrThrow();
}

// New functions for handling option-specific responses
export async function getResponsesByQuestionAndOption(
  sessionId: string,
  isoWeek: number,
  isoYear: number,
  questionSlug: string,
) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("session_id", "=", sessionId)
    .where("iso_week", "=", isoWeek)
    .where("iso_year", "=", isoYear)
    .where("question_slug", "=", questionSlug)
    .execute();
}

export async function getResponseByQuestionAndOption(
  sessionId: string,
  isoWeek: number,
  isoYear: number,
  questionSlug: string,
  optionSlug: string,
) {
  return await db
    .selectFrom("responses")
    .selectAll()
    .where("session_id", "=", sessionId)
    .where("iso_week", "=", isoWeek)
    .where("iso_year", "=", isoYear)
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
  isoWeek: number,
  isoYear: number,
  questionSlug: string,
  responses: ExperienceResponse[],
) {
  const savedResponses = await Promise.all(
    responses.map((responseData) =>
      db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: isoWeek,
          iso_year: isoYear,
          question_slug: questionSlug,
          option_slug: responseData.optionSlug,
          skipped: responseData.skipped ?? false,
          experience_awareness: responseData.experienceAwareness,
          experience_sentiment: responseData.experienceSentiment,
          comment: responseData.comment,
        } as any)
        .onConflict((oc) =>
          oc.constraint("responses_pkey").doUpdateSet({
            skipped: (eb) => eb.ref("excluded.skipped"),
            experience_awareness: (eb) =>
              eb.ref("excluded.experience_awareness"),
            experience_sentiment: (eb) =>
              eb.ref("excluded.experience_sentiment"),
            comment: (eb) => eb.ref("excluded.comment"),
          }),
        )
        .returningAll()
        .executeTakeFirstOrThrow(),
    ),
  );

  return savedResponses;
}

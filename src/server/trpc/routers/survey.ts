import { getActiveOptionsByQuestion } from "@/lib/models/options";
import { getActiveQuestionsBySection } from "@/lib/models/questions";
import {
  getResponsesBySession,
  upsertResponse,
  saveExperienceResponses,
} from "@/lib/models/responses";
import { getActiveSections, getFirstSection } from "@/lib/models/sections";
import { getCompletionPercentage } from "@/lib/models/completion";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

function getCurrentWeekAndYear() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return { week: weekNumber, year: now.getFullYear() };
}

export const surveyRouter = router({
  getSections: publicProcedure.query(async () => {
    return await getActiveSections();
  }),

  getFirstSection: publicProcedure.query(async () => {
    return await getFirstSection();
  }),

  getQuestionsBySection: publicProcedure
    .input(z.object({ sectionSlug: z.string() }))
    .query(async ({ input }) => {
      const questions = await getActiveQuestionsBySection(input.sectionSlug);
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await getActiveOptionsByQuestion(question.slug);
          return {
            ...question,
            options,
          };
        }),
      );
      return questionsWithOptions;
    }),

  getSession: publicProcedure.query(async ({ ctx }) => {
    return { sessionId: ctx.sessionId };
  }),

  getResponses: publicProcedure.query(async ({ ctx }) => {
    // Get current week and year
    const { week, year } = getCurrentWeekAndYear();

    return {
      sessionId: ctx.sessionId,
      responses: await getResponsesBySession(ctx.sessionId!, week, year),
    };
  }),

  saveResponse: publicProcedure
    .input(
      z.object({
        questionSlug: z.string(),
        skipped: z.boolean().optional(),
        singleOptionSlug: z.string().optional(),
        singleWriteinResponse: z.string().optional(),
        multipleOptionSlugs: z.array(z.string()).optional(),
        multipleWriteinResponses: z.array(z.string()).optional(),
        experienceAwareness: z.number().optional(),
        experienceSentiment: z.number().optional(),
        freeformResponse: z.string().optional(),
        numericResponse: z.number().optional(),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get current week and year
      const { week, year } = getCurrentWeekAndYear();

      const response = await upsertResponse({
        session_id: ctx.sessionId!,
        iso_week: week,
        iso_year: year,
        question_slug: input.questionSlug,
        skipped: input.skipped ?? false,
        single_option_slug: input.singleOptionSlug,
        single_writein_response: input.singleWriteinResponse,
        multiple_option_slugs: input.multipleOptionSlugs,
        multiple_writein_responses: input.multipleWriteinResponses,
        experience_awareness: input.experienceAwareness,
        experience_sentiment: input.experienceSentiment,
        freeform_response: input.freeformResponse,
        numeric_response: input.numericResponse,
        comment: input.comment,
      });

      return { sessionId: ctx.sessionId, response };
    }),

  saveExperienceResponses: publicProcedure
    .input(
      z.object({
        questionSlug: z.string(),
        responses: z.array(
          z.object({
            optionSlug: z.string(),
            experienceAwareness: z.number(),
            experienceSentiment: z.number().optional(),
            skipped: z.boolean().optional(),
            comment: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get current week and year
      const { week, year } = getCurrentWeekAndYear();

      const savedResponses = await saveExperienceResponses(
        ctx.sessionId!,
        week,
        year,
        input.questionSlug,
        input.responses,
      );

      return { sessionId: ctx.sessionId, responses: savedResponses };
    }),

  getCompletionPercentage: publicProcedure.query(async ({ ctx }) => {
    return await getCompletionPercentage(ctx.sessionId!);
  }),
});

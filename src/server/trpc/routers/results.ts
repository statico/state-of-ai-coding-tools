import {
  getAllWeeksSinceStart,
  getAvailableWeeks,
  getFirstResponseWeek,
  getQuestionReport,
  getWeekSummary,
} from "@/lib/models/results";
import { getCurrentISOWeek } from "@/lib/utils";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const resultsRouter = router({
  getAvailableWeeks: publicProcedure.query(async () => {
    return await getAvailableWeeks();
  }),

  getAllWeeksSinceStart: publicProcedure.query(async () => {
    return await getAllWeeksSinceStart();
  }),

  getCurrentWeek: publicProcedure.query(async () => {
    return getCurrentISOWeek();
  }),

  getEarliestResult: publicProcedure.query(async () => {
    const firstWeek = await getFirstResponseWeek();
    if (!firstWeek) {
      return getCurrentISOWeek();
    }
    return firstWeek;
  }),

  getWeekSummary: publicProcedure
    .input(
      z.object({
        week: z.number(),
        year: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return await getWeekSummary(input.week, input.year);
    }),

  getQuestionReport: publicProcedure
    .input(
      z.object({
        questionSlug: z.string(),
        week: z.number(),
        year: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return await getQuestionReport(
        input.questionSlug,
        input.week,
        input.year,
      );
    }),

  getHistoricalTrends: publicProcedure
    .input(
      z.object({
        questionSlug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // Get all weeks with data for this question
      const weeks = await getAvailableWeeks();
      const trends = [];

      for (const week of weeks) {
        const report = await getQuestionReport(
          input.questionSlug,
          week.week,
          week.year,
        );
        if (report) {
          trends.push({
            week: week.week,
            year: week.year,
            totalResponses: report.totalResponses,
            skippedResponses: report.skippedResponses,
            data: report.data,
          });
        }
      }

      return trends;
    }),
});

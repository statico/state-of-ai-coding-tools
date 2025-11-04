import {
  getAllMonthsSinceStart,
  getAvailableMonths,
  getFirstResponseMonth,
  getQuestionReport,
  getMonthSummary,
} from "@/lib/models/results";
import { getCurrentMonth } from "@/lib/utils";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const resultsRouter = router({
  getAvailableMonths: publicProcedure.query(async () => {
    return await getAvailableMonths();
  }),

  getAllMonthsSinceStart: publicProcedure.query(async () => {
    return await getAllMonthsSinceStart();
  }),

  getCurrentMonth: publicProcedure.query(async () => {
    return getCurrentMonth();
  }),

  getEarliestResult: publicProcedure.query(async () => {
    const firstMonth = await getFirstResponseMonth();
    if (!firstMonth) {
      return getCurrentMonth();
    }
    return firstMonth;
  }),

  getMonthSummary: publicProcedure
    .input(
      z.object({
        month: z.number(),
        year: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return await getMonthSummary(input.month, input.year);
    }),

  getQuestionReport: publicProcedure
    .input(
      z.object({
        questionSlug: z.string(),
        month: z.number(),
        year: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return await getQuestionReport(
        input.questionSlug,
        input.month,
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
      // Get all months with data for this question
      const months = await getAvailableMonths();
      const trends = [];

      for (const month of months) {
        const report = await getQuestionReport(
          input.questionSlug,
          month.month,
          month.year,
        );
        if (report) {
          trends.push({
            month: month.month,
            year: month.year,
            totalResponses: report.totalResponses,
            skippedResponses: report.skippedResponses,
            data: report.data,
          });
        }
      }

      return trends;
    }),
});

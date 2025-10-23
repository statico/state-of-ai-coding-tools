import { db } from "@/server/db";
import { setupTestData } from "@/test/setup";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAllWeeksSinceStart,
  getAvailableWeeks,
  getFirstResponseWeek,
  getQuestionReport,
  getWeekSummary,
} from "./results";

describe("results", () => {
  beforeEach(async () => {
    await setupTestData();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getAvailableWeeks", () => {
    it("should return empty array when no responses exist", async () => {
      const weeks = await getAvailableWeeks();
      expect(weeks).toEqual([]);
    });

    it("should return weeks with response data", async () => {
      // Create test data
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await db.insertInto("sessions").values({ id: sessionId }).execute();

      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();

      const questionSlug = "test-question";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: sectionSlug,
          title: "Test Question",
          type: "single",
          order: 1,
        })
        .execute();

      // Add responses for different weeks
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: 1,
          iso_year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: 3,
          iso_year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      const weeks = await getAvailableWeeks();
      expect(weeks).toEqual([
        { week: 1, year: 2024 },
        { week: 3, year: 2024 },
      ]);
    });
  });

  describe("getFirstResponseWeek", () => {
    it("should return null when no responses exist", async () => {
      const firstWeek = await getFirstResponseWeek();
      expect(firstWeek).toBeNull();
    });

    it("should return the earliest week with responses", async () => {
      // Create test data
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await db.insertInto("sessions").values({ id: sessionId }).execute();

      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();

      const questionSlug = "test-question";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: sectionSlug,
          title: "Test Question",
          type: "single",
          order: 1,
        })
        .execute();

      // Add responses in different order
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: 3,
          iso_year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: 1,
          iso_year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      const firstWeek = await getFirstResponseWeek();
      expect(firstWeek).toEqual({ week: 1, year: 2024 });
    });
  });

  describe("getAllWeeksSinceStart", () => {
    it("should return empty array when no responses exist", async () => {
      const weeks = await getAllWeeksSinceStart();
      expect(weeks).toEqual([]);
    });

    it("should return all weeks from first response to current week", async () => {
      // Set system time to a date in week 5, 2024 (January 29, 2024 is in week 5)
      vi.setSystemTime(new Date("2024-01-29"));

      // Create test data
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await db.insertInto("sessions").values({ id: sessionId }).execute();

      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();

      const questionSlug = "test-question";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: sectionSlug,
          title: "Test Question",
          type: "single",
          order: 1,
        })
        .execute();

      // Add response for week 2, 2024
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: 2,
          iso_year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      // Mock current week as week 5, 2024
      const weeks = await getAllWeeksSinceStart();
      expect(weeks).toEqual([
        { week: 2, year: 2024 },
        { week: 3, year: 2024 },
        { week: 4, year: 2024 },
        { week: 5, year: 2024 },
      ]);
    });

    it("should handle year boundary correctly", async () => {
      // Create test data
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await db.insertInto("sessions").values({ id: sessionId }).execute();

      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();

      const questionSlug = "test-question";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: sectionSlug,
          title: "Test Question",
          type: "single",
          order: 1,
        })
        .execute();

      // Add response for week 52, 2023
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: 52,
          iso_year: 2023,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      // Set system time to a date in week 2, 2024 (January 8, 2024 is in week 2)
      vi.setSystemTime(new Date("2024-01-08"));

      const weeks = await getAllWeeksSinceStart();
      expect(weeks).toEqual([
        { week: 52, year: 2023 },
        { week: 1, year: 2024 },
        { week: 2, year: 2024 },
      ]);
    });
  });

  describe("getWeekSummary", () => {
    it("should return week summary with no responses", async () => {
      const summary = await getWeekSummary(1, 2024);
      expect(summary).toEqual({
        week: 1,
        year: 2024,
        totalResponses: 0,
        uniqueSessions: 0,
        questions: [],
      });
    });

    it("should return week summary with responses", async () => {
      // Create test data
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await db.insertInto("sessions").values({ id: sessionId }).execute();

      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();

      const questionSlug = "test-question";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: sectionSlug,
          title: "Test Question",
          type: "single",
          order: 1,
        })
        .execute();

      // Add responses
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: 1,
          iso_year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      const summary = await getWeekSummary(1, 2024);
      expect(summary.week).toBe(1);
      expect(summary.year).toBe(2024);
      expect(summary.totalResponses).toBe(1);
      expect(summary.uniqueSessions).toBe(1);
      expect(summary.questions).toHaveLength(1);
      expect(summary.questions[0].questionSlug).toBe(questionSlug);
    });
  });

  describe("getQuestionReport", () => {
    it("should return null for non-existent question", async () => {
      const report = await getQuestionReport("non-existent", 1, 2024);
      expect(report).toBeNull();
    });

    it("should return null for inactive question", async () => {
      // Create inactive question
      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();

      const questionSlug = "inactive-question";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: sectionSlug,
          title: "Inactive Question",
          type: "single",
          order: 1,
          active: false,
        })
        .execute();

      const report = await getQuestionReport(questionSlug, 1, 2024);
      expect(report).toBeNull();
    });

    it("should return question report with no responses", async () => {
      // Create test data
      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();

      const questionSlug = "test-question";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: sectionSlug,
          title: "Test Question",
          type: "single",
          order: 1,
        })
        .execute();

      const report = await getQuestionReport(questionSlug, 1, 2024);
      expect(report).toEqual({
        totalResponses: 0,
        skippedResponses: 0,
        data: {
          options: [],
          writeIns: [],
        },
      });
    });

    it("should return question report with responses", async () => {
      // Create test data
      const sessionId = "550e8400-e29b-41d4-a716-446655440001";
      await db.insertInto("sessions").values({ id: sessionId }).execute();

      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();

      const questionSlug = "test-question";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: sectionSlug,
          title: "Test Question",
          type: "single",
          order: 1,
        })
        .execute();

      // Create another session for the second response
      const sessionId2 = "550e8400-e29b-41d4-a716-446655440004";
      await db.insertInto("sessions").values({ id: sessionId2 }).execute();

      // Add responses
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          iso_week: 1,
          iso_year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      await db
        .insertInto("responses")
        .values({
          session_id: sessionId2,
          iso_week: 1,
          iso_year: 2024,
          question_slug: questionSlug,
          skipped: true,
        })
        .execute();

      const report = await getQuestionReport(questionSlug, 1, 2024);
      expect(report?.totalResponses).toBe(2);
      expect(report?.skippedResponses).toBe(1);
    });
  });

  describe("aggregation functions", () => {
    beforeEach(async () => {
      // Create common test data
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await db.insertInto("sessions").values({ id: sessionId }).execute();

      const sectionSlug = "test-section";
      await db
        .insertInto("sections")
        .values({
          slug: sectionSlug,
          title: "Test Section",
          order: 1,
        })
        .execute();
    });

    describe("single choice aggregation", () => {
      it("should aggregate single choice responses", async () => {
        const questionSlug = "single-question";
        await db
          .insertInto("questions")
          .values({
            slug: questionSlug,
            section_slug: "test-section",
            title: "Single Question",
            type: "single",
            order: 1,
          })
          .execute();

        const optionSlug = "option-1";
        await db
          .insertInto("options")
          .values({
            slug: optionSlug,
            question_slug: questionSlug,
            label: "Option 1",
            order: 1,
          })
          .execute();

        // Add responses
        await db
          .insertInto("responses")
          .values({
            session_id: "550e8400-e29b-41d4-a716-446655440000",
            iso_week: 1,
            iso_year: 2024,
            question_slug: questionSlug,
            skipped: false,
            single_option_slug: optionSlug,
          })
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        expect(report?.data.options).toHaveLength(1);
        expect(report?.data.options[0].optionSlug).toBe(optionSlug);
        expect(report?.data.options[0].count).toBe(1);
        expect(report?.data.options[0].percentage).toBe(100);
      });
    });

    describe("multiple choice aggregation", () => {
      it("should aggregate multiple choice responses", async () => {
        const questionSlug = "multiple-question";
        await db
          .insertInto("questions")
          .values({
            slug: questionSlug,
            section_slug: "test-section",
            title: "Multiple Question",
            type: "multiple",
            order: 1,
          })
          .execute();

        const optionSlug = "option-1";
        await db
          .insertInto("options")
          .values({
            slug: optionSlug,
            question_slug: questionSlug,
            label: "Option 1",
            order: 1,
          })
          .execute();

        // Add responses
        await db
          .insertInto("responses")
          .values({
            session_id: "550e8400-e29b-41d4-a716-446655440000",
            iso_week: 1,
            iso_year: 2024,
            question_slug: questionSlug,
            skipped: false,
            multiple_option_slugs: [optionSlug],
          })
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        expect(report?.data.options).toHaveLength(1);
        expect(report?.data.options[0].optionSlug).toBe(optionSlug);
        expect(report?.data.options[0].count).toBe(1);
        expect(report?.data.options[0].percentage).toBe(100);
      });
    });

    describe("experience aggregation", () => {
      it("should aggregate experience responses", async () => {
        const questionSlug = "experience-question";
        const optionSlug = "test-option";

        await db
          .insertInto("questions")
          .values({
            slug: questionSlug,
            section_slug: "test-section",
            title: "Experience Question",
            type: "experience",
            order: 1,
          })
          .execute();

        // Add option
        await db
          .insertInto("options")
          .values({
            slug: optionSlug,
            question_slug: questionSlug,
            label: "Test Option",
            order: 1,
            active: true,
          })
          .execute();

        // Add responses
        await db
          .insertInto("responses")
          .values({
            session_id: "550e8400-e29b-41d4-a716-446655440000",
            iso_week: 1,
            iso_year: 2024,
            question_slug: questionSlug,
            option_slug: optionSlug,
            skipped: false,
            experience_awareness: 1,
            experience_sentiment: 1,
          })
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        expect(report?.data.options).toHaveLength(1);
        expect(report?.data.options[0].optionSlug).toBe(optionSlug);
        expect(report?.data.options[0].awareness).toHaveLength(1);
        expect(report?.data.options[0].sentiment).toHaveLength(1);
        expect(report?.data.options[0].combined).toHaveLength(1);
        expect(report?.data.options[0].awareness[0].level).toBe(1);
        expect(report?.data.options[0].awareness[0].count).toBe(1);
        expect(report?.data.options[0].awareness[0].percentage).toBe(100);
      });
    });

    describe("numeric aggregation", () => {
      it("should aggregate numeric responses", async () => {
        const questionSlug = "numeric-question";
        await db
          .insertInto("questions")
          .values({
            slug: questionSlug,
            section_slug: "test-section",
            title: "Numeric Question",
            type: "numeric",
            order: 1,
          })
          .execute();

        // Create sessions for the responses
        await db
          .insertInto("sessions")
          .values({ id: "550e8400-e29b-41d4-a716-446655440002" })
          .execute();
        await db
          .insertInto("sessions")
          .values({ id: "550e8400-e29b-41d4-a716-446655440003" })
          .execute();

        // Add responses with different session IDs
        await db
          .insertInto("responses")
          .values({
            session_id: "550e8400-e29b-41d4-a716-446655440002",
            iso_week: 1,
            iso_year: 2024,
            question_slug: questionSlug,
            skipped: false,
            numeric_response: 5,
          })
          .execute();

        await db
          .insertInto("responses")
          .values({
            session_id: "550e8400-e29b-41d4-a716-446655440003",
            iso_week: 1,
            iso_year: 2024,
            question_slug: questionSlug,
            skipped: false,
            numeric_response: 10,
          })
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        expect(report?.data.summary.mean).toBe(7.5);
        expect(report?.data.summary.median).toBe(7.5);
        expect(report?.data.summary.min).toBe(5);
        expect(report?.data.summary.max).toBe(10);
        expect(report?.data.summary.count).toBe(2);
      });
    });

    describe("freeform aggregation", () => {
      it("should aggregate freeform responses", async () => {
        const questionSlug = "freeform-question";
        await db
          .insertInto("questions")
          .values({
            slug: questionSlug,
            section_slug: "test-section",
            title: "Freeform Question",
            type: "freeform",
            order: 1,
          })
          .execute();

        // Add responses
        await db
          .insertInto("responses")
          .values({
            session_id: "550e8400-e29b-41d4-a716-446655440000",
            iso_week: 1,
            iso_year: 2024,
            question_slug: questionSlug,
            skipped: false,
            freeform_response: "Great tool!",
          })
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        expect(report?.data.responses).toHaveLength(1);
        expect(report?.data.responses[0].response).toBe("Great tool!");
        expect(report?.data.responses[0].count).toBe(1);
        expect(report?.data.totalCount).toBe(1);
      });
    });
  });
});

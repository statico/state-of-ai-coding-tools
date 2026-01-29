import { db } from "@/server/db";
import { setupTestData } from "@/test/setup";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAllMonthsSinceStart,
  getAvailableMonths,
  getFirstResponseMonth,
  getQuestionReport,
  getMonthSummary,
} from "./results";

describe("results", () => {
  beforeEach(async () => {
    await setupTestData();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getAvailableMonths", () => {
    it("should return empty array when no responses exist", async () => {
      const months = await getAvailableMonths();
      expect(months).toEqual([]);
    });

    it("should return months with response data", async () => {
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

      // Add responses for different months
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          month: 1,
          year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          month: 3,
          year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      const months = await getAvailableMonths();
      expect(months).toEqual([
        { month: 1, year: 2024 },
        { month: 3, year: 2024 },
      ]);
    });
  });

  describe("getFirstResponseMonth", () => {
    it("should return null when no responses exist", async () => {
      const firstMonth = await getFirstResponseMonth();
      expect(firstMonth).toBeNull();
    });

    it("should return the earliest month with responses", async () => {
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
          month: 3,
          year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          month: 1,
          year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      const firstMonth = await getFirstResponseMonth();
      expect(firstMonth).toEqual({ month: 1, year: 2024 });
    });
  });

  describe("getAllMonthsSinceStart", () => {
    it("should return empty array when no responses exist", async () => {
      const months = await getAllMonthsSinceStart();
      expect(months).toEqual([]);
    });

    it("should return all months from first response to current month", async () => {
      // Set system time to a date in month 1, 2024 (January 29, 2024)
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

      // Add response for month 1, 2024
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          month: 1,
          year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      // Mock current month as month 1, 2024
      const months = await getAllMonthsSinceStart();
      expect(months).toEqual([{ month: 1, year: 2024 }]);
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

      // Add response for month 12, 2023
      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          month: 12,
          year: 2023,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      // Set system time to a date in month 1, 2024 (January 8, 2024)
      vi.setSystemTime(new Date("2024-01-08"));

      const months = await getAllMonthsSinceStart();
      expect(months).toEqual([
        { month: 12, year: 2023 },
        { month: 1, year: 2024 },
      ]);
    });
  });

  describe("getMonthSummary", () => {
    it("should return month summary with no responses", async () => {
      const summary = await getMonthSummary(1, 2024);
      expect(summary).toEqual({
        month: 1,
        year: 2024,
        totalResponses: 0,
        uniqueSessions: 0,
        questions: [],
      });
    });

    it("should return month summary with responses", async () => {
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
          month: 1,
          year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      const summary = await getMonthSummary(1, 2024);
      expect(summary.month).toBe(1);
      expect(summary.year).toBe(2024);
      expect(summary.totalResponses).toBe(1);
      expect(summary.uniqueSessions).toBe(1);
      expect(summary.questions).toHaveLength(1);
      expect(summary.questions[0].questionSlug).toBe(questionSlug);
    });

    it("should exclude questions from inactive sections", async () => {
      // Create inactive section with active question
      const inactiveSectionSlug = "inactive-section";
      await db
        .insertInto("sections")
        .values({
          slug: inactiveSectionSlug,
          title: "Inactive Section",
          order: 1,
          active: false,
        })
        .execute();

      const questionSlug = "question-in-inactive-section";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: inactiveSectionSlug,
          title: "Question in Inactive Section",
          type: "single",
          order: 1,
          active: true, // Question is active but section is inactive
        })
        .execute();

      // Add a response for this question
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await db.insertInto("sessions").values({ id: sessionId }).execute();

      await db
        .insertInto("responses")
        .values({
          session_id: sessionId,
          month: 1,
          year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      const summary = await getMonthSummary(1, 2024);
      expect(summary.questions).toHaveLength(0); // Should exclude question from inactive section
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

    it("should return null for question in inactive section", async () => {
      // Create inactive section with active question
      const inactiveSectionSlug = "inactive-section";
      await db
        .insertInto("sections")
        .values({
          slug: inactiveSectionSlug,
          title: "Inactive Section",
          order: 1,
          active: false,
        })
        .execute();

      const questionSlug = "question-in-inactive-section";
      await db
        .insertInto("questions")
        .values({
          slug: questionSlug,
          section_slug: inactiveSectionSlug,
          title: "Question in Inactive Section",
          type: "single",
          order: 1,
          active: true, // Question is active but section is inactive
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
          month: 1,
          year: 2024,
          question_slug: questionSlug,
          skipped: false,
        })
        .execute();

      await db
        .insertInto("responses")
        .values({
          session_id: sessionId2,
          month: 1,
          year: 2024,
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
            month: 1,
            year: 2024,
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
            month: 1,
            year: 2024,
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
            month: 1,
            year: 2024,
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

      it("should count unique sessions for experience questions", async () => {
        const questionSlug = "experience-question-multi";
        const optionSlug1 = "test-option-1";
        const optionSlug2 = "test-option-2";

        await db
          .insertInto("questions")
          .values({
            slug: questionSlug,
            section_slug: "test-section",
            title: "Experience Question Multi",
            type: "experience",
            order: 1,
          })
          .execute();

        // Add options
        await db
          .insertInto("options")
          .values([
            {
              slug: optionSlug1,
              question_slug: questionSlug,
              label: "Test Option 1",
              order: 1,
              active: true,
            },
            {
              slug: optionSlug2,
              question_slug: questionSlug,
              label: "Test Option 2",
              order: 2,
              active: true,
            },
          ])
          .execute();

        const sessionId = "550e8400-e29b-41d4-a716-446655440000";

        // Add multiple responses from the same session (should count as 1 unique session)
        await db
          .insertInto("responses")
          .values([
            {
              session_id: sessionId,
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              option_slug: optionSlug1,
              skipped: false,
              experience_awareness: 1,
              experience_sentiment: 1,
            },
            {
              session_id: sessionId,
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              option_slug: optionSlug2,
              skipped: false,
              experience_awareness: 2,
              experience_sentiment: -1,
            },
          ])
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.totalResponses).toBe(1); // Should count unique sessions, not individual responses
        expect(report?.skippedResponses).toBe(0);
      });

      it("should handle awareness level 3 (Actively using it)", async () => {
        const questionSlug = "experience-question-level3";
        const optionSlug = "test-option-level3";

        await db
          .insertInto("questions")
          .values({
            slug: questionSlug,
            section_slug: "test-section",
            title: "Experience Question Level 3",
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
            label: "Test Option Level 3",
            order: 1,
            active: true,
          })
          .execute();

        // Add response with awareness level 3
        await db
          .insertInto("responses")
          .values({
            session_id: "550e8400-e29b-41d4-a716-446655440000",
            month: 1,
            year: 2024,
            question_slug: questionSlug,
            option_slug: optionSlug,
            skipped: false,
            experience_awareness: 3,
            experience_sentiment: 1,
          })
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        expect(report?.data.options).toHaveLength(1);
        expect(report?.data.options[0].optionSlug).toBe(optionSlug);
        expect(report?.data.options[0].awareness).toHaveLength(1);
        expect(report?.data.options[0].awareness[0].level).toBe(3);
        expect(report?.data.options[0].awareness[0].count).toBe(1);
        expect(report?.data.options[0].awareness[0].percentage).toBe(100);
        expect(report?.data.options[0].combined).toHaveLength(1);
        expect(report?.data.options[0].combined[0].awareness).toBe(3);
        expect(report?.data.options[0].combined[0].sentiment).toBe(1);
        expect(report?.data.options[0].combined[0].count).toBe(1);
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
            month: 1,
            year: 2024,
            question_slug: questionSlug,
            skipped: false,
            numeric_response: 5,
          })
          .execute();

        await db
          .insertInto("responses")
          .values({
            session_id: "550e8400-e29b-41d4-a716-446655440003",
            month: 1,
            year: 2024,
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
            month: 1,
            year: 2024,
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

      it("should group freeform responses by trimmed and lowercased text", async () => {
        const questionSlug = "freeform-question-grouped";
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

        // Create sessions for the responses
        await db
          .insertInto("sessions")
          .values([
            { id: "550e8400-e29b-41d4-a716-446655440001" },
            { id: "550e8400-e29b-41d4-a716-446655440002" },
            { id: "550e8400-e29b-41d4-a716-446655440003" },
            { id: "550e8400-e29b-41d4-a716-446655440004" },
            { id: "550e8400-e29b-41d4-a716-446655440005" },
          ])
          .execute();

        // Add responses with different casing and whitespace
        await db
          .insertInto("responses")
          .values([
            {
              session_id: "550e8400-e29b-41d4-a716-446655440001",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "FooBar",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440002",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "foobar",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440003",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: " FooBar ",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440004",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "FOOBAR",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440005",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Different Tool",
            },
          ])
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        // Should have 2 unique responses: "FooBar" (grouped) and "Different Tool"
        expect(report?.data.responses).toHaveLength(2);
        expect(report?.data.totalCount).toBe(5);

        // Find the grouped response
        const foobarResponse = report?.data.responses.find(
          (r: any) => r.response.toLowerCase() === "foobar",
        );
        expect(foobarResponse).toBeDefined();
        // All 4 variations should be counted together
        expect(foobarResponse?.count).toBe(4);
        // Should preserve the original trimmed text (first occurrence)
        expect(foobarResponse?.response).toBe("FooBar");

        // Find the different response
        const differentResponse = report?.data.responses.find(
          (r: any) => r.response === "Different Tool",
        );
        expect(differentResponse).toBeDefined();
        expect(differentResponse?.count).toBe(1);
      });

      it("should handle empty and whitespace-only responses correctly", async () => {
        const questionSlug = "freeform-question-empty";
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

        // Create sessions
        await db
          .insertInto("sessions")
          .values([
            { id: "550e8400-e29b-41d4-a716-446655440010" },
            { id: "550e8400-e29b-41d4-a716-446655440011" },
            { id: "550e8400-e29b-41d4-a716-446655440012" },
          ])
          .execute();

        // Add responses including whitespace-only
        await db
          .insertInto("responses")
          .values([
            {
              session_id: "550e8400-e29b-41d4-a716-446655440010",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "   ",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440011",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "\t\n",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440012",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Valid Response",
            },
          ])
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        // Whitespace-only responses should be grouped together (both become empty after trim)
        // Should have 2 unique responses: empty string (from whitespace) and "Valid Response"
        expect(report?.data.responses).toHaveLength(2);
        expect(report?.data.totalCount).toBe(3);

        // Find the empty response (from whitespace)
        const emptyResponse = report?.data.responses.find((r: any) => r.response === "");
        expect(emptyResponse).toBeDefined();
        expect(emptyResponse?.count).toBe(2);

        // Find the valid response
        const validResponse = report?.data.responses.find(
          (r: any) => r.response === "Valid Response",
        );
        expect(validResponse).toBeDefined();
        expect(validResponse?.count).toBe(1);
      });

      it("should handle special characters and unicode correctly", async () => {
        const questionSlug = "freeform-question-special";
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

        // Create sessions
        await db
          .insertInto("sessions")
          .values([
            { id: "550e8400-e29b-41d4-a716-446655440020" },
            { id: "550e8400-e29b-41d4-a716-446655440021" },
          ])
          .execute();

        // Add responses with special characters
        await db
          .insertInto("responses")
          .values([
            {
              session_id: "550e8400-e29b-41d4-a716-446655440020",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Tool@2024",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440021",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "tool@2024",
            },
          ])
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        // Should group by lowercase
        expect(report?.data.responses).toHaveLength(1);
        expect(report?.data.totalCount).toBe(2);
        expect(report?.data.responses[0].count).toBe(2);
        // Should preserve original casing from first occurrence
        expect(report?.data.responses[0].response).toBe("Tool@2024");
      });

      it("should sort responses by count descending", async () => {
        const questionSlug = "freeform-question-sorted";
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

        // Create sessions
        await db
          .insertInto("sessions")
          .values([
            { id: "550e8400-e29b-41d4-a716-446655440030" },
            { id: "550e8400-e29b-41d4-a716-446655440031" },
            { id: "550e8400-e29b-41d4-a716-446655440032" },
            { id: "550e8400-e29b-41d4-a716-446655440033" },
            { id: "550e8400-e29b-41d4-a716-446655440034" },
            { id: "550e8400-e29b-41d4-a716-446655440035" },
          ])
          .execute();

        // Add responses with different counts
        await db
          .insertInto("responses")
          .values([
            {
              session_id: "550e8400-e29b-41d4-a716-446655440030",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Tool A",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440031",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Tool B",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440032",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Tool B",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440033",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Tool B",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440034",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Tool C",
            },
            {
              session_id: "550e8400-e29b-41d4-a716-446655440035",
              month: 1,
              year: 2024,
              question_slug: questionSlug,
              skipped: false,
              freeform_response: "Tool C",
            },
          ])
          .execute();

        const report = await getQuestionReport(questionSlug, 1, 2024);
        expect(report?.data).toBeDefined();
        expect(report?.data.responses).toHaveLength(3);
        expect(report?.data.totalCount).toBe(6);

        // Verify sorting: Tool B (3), Tool C (2), Tool A (1)
        expect(report?.data.responses[0].response).toBe("Tool B");
        expect(report?.data.responses[0].count).toBe(3);
        expect(report?.data.responses[1].response).toBe("Tool C");
        expect(report?.data.responses[1].count).toBe(2);
        expect(report?.data.responses[2].response).toBe("Tool A");
        expect(report?.data.responses[2].count).toBe(1);
      });
    });
  });
});

import { getCurrentMonth } from "@/lib/utils";
import { db } from "@/server/db";
import { setupTestData } from "@/test/setup";
import { beforeEach, describe, expect, it } from "vitest";
import { surveyRouter } from "./survey";

describe("Survey Router", () => {
  beforeEach(async () => {
    await setupTestData();
  });

  describe("getSections", () => {
    it("should return active sections", async () => {
      // Insert test sections
      await db
        .insertInto("sections")
        .values([
          {
            slug: "section1",
            title: "Section 1",
            order: 1,
            active: true,
          },
          {
            slug: "section2",
            title: "Section 2",
            order: 2,
            active: true,
          },
          {
            slug: "inactive-section",
            title: "Inactive Section",
            order: 3,
            active: false,
          },
        ])
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.getSections();

      expect(result).toHaveLength(2);
      expect(result.map((s) => s.slug)).toEqual(["section1", "section2"]);
    });
  });

  describe("getFirstSection", () => {
    it("should return the first active section", async () => {
      // Insert test sections
      await db
        .insertInto("sections")
        .values([
          {
            slug: "section1",
            title: "Section 1",
            order: 2,
            active: true,
          },
          {
            slug: "section2",
            title: "Section 2",
            order: 1,
            active: true,
          },
        ])
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.getFirstSection();

      expect(result?.slug).toBe("section2"); // Lower order number
    });
  });

  describe("getQuestionsBySection", () => {
    it("should return questions with options for a section", async () => {
      // Insert test data
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          order: 1,
          active: true,
        })
        .execute();

      await db
        .insertInto("questions")
        .values({
          slug: "question1",
          section_slug: "test-section",
          title: "Question 1",
          type: "single",
          order: 1,
          active: true,
        })
        .execute();

      await db
        .insertInto("options")
        .values([
          {
            slug: "option1",
            question_slug: "question1",
            label: "Option 1",
            order: 1,
            active: true,
          },
          {
            slug: "option2",
            question_slug: "question1",
            label: "Option 2",
            order: 2,
            active: true,
          },
        ])
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.getQuestionsBySection({
        sectionSlug: "test-section",
      });

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("question1");
      expect(result[0].options).toHaveLength(2);
      expect(result[0].options.map((o) => o.slug)).toEqual(["option1", "option2"]);
    });
  });

  describe("getSession", () => {
    it("should return session ID", async () => {
      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.getSession();

      expect(result).toEqual({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
      });
    });
  });

  describe("getResponses", () => {
    it("should return user responses for current week", async () => {
      // Insert test session
      await db
        .insertInto("sessions")
        .values({ id: "550e8400-e29b-41d4-a716-446655440000" })
        .execute();

      // Insert test section and question
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          order: 1,
          active: true,
        })
        .execute();

      await db
        .insertInto("questions")
        .values({
          slug: "question1",
          section_slug: "test-section",
          title: "Question 1",
          type: "single",
          order: 1,
          active: true,
        })
        .execute();

      // Get current month and year
      const { month: monthNumber, year: currentYear } = getCurrentMonth();

      // Insert test responses
      await db
        .insertInto("responses")
        .values([
          {
            session_id: "550e8400-e29b-41d4-a716-446655440000",
            month: monthNumber,
            year: currentYear,
            question_slug: "question1",
            skipped: false,
            single_option_slug: "option1",
          },
        ])
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.getResponses();

      expect(result.sessionId).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(result.responses).toHaveLength(1);
      expect(result.responses[0].question_slug).toBe("question1");
      expect(result.responses[0].skipped).toBe(false);
    });
  });

  describe("saveResponse", () => {
    it("should save a single choice response", async () => {
      // Insert test session
      await db
        .insertInto("sessions")
        .values({ id: "550e8400-e29b-41d4-a716-446655440000" })
        .execute();

      // Insert test section and question
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          order: 1,
          active: true,
        })
        .execute();

      await db
        .insertInto("questions")
        .values({
          slug: "question1",
          section_slug: "test-section",
          title: "Question 1",
          type: "single",
          order: 1,
          active: true,
        })
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.saveResponse({
        questionSlug: "question1",
        singleOptionSlug: "option1",
        skipped: false,
      });

      expect(result.sessionId).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(result.response).toBeDefined();
      expect(result.response.question_slug).toBe("question1");
      expect(result.response.single_option_slug).toBe("option1");
      expect(result.response.skipped).toBe(false);
    });

    it("should save a multiple choice response", async () => {
      // Insert test session
      await db
        .insertInto("sessions")
        .values({ id: "550e8400-e29b-41d4-a716-446655440000" })
        .execute();

      // Insert test section and question
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          order: 1,
          active: true,
        })
        .execute();

      await db
        .insertInto("questions")
        .values({
          slug: "question1",
          section_slug: "test-section",
          title: "Question 1",
          type: "multiple",
          order: 1,
          active: true,
        })
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.saveResponse({
        questionSlug: "question1",
        multipleOptionSlugs: ["option1", "option2"],
        skipped: false,
      });

      expect(result.response.multiple_option_slugs).toEqual(["option1", "option2"]);
      expect(result.response.skipped).toBe(false);
    });

    it("should save a numeric response", async () => {
      // Insert test session
      await db
        .insertInto("sessions")
        .values({ id: "550e8400-e29b-41d4-a716-446655440000" })
        .execute();

      // Insert test section and question
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          order: 1,
          active: true,
        })
        .execute();

      await db
        .insertInto("questions")
        .values({
          slug: "question1",
          section_slug: "test-section",
          title: "Question 1",
          type: "numeric",
          order: 1,
          active: true,
        })
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.saveResponse({
        questionSlug: "question1",
        numericResponse: 42,
        skipped: false,
      });

      expect(result.response.numeric_response).toBe("42");
      expect(result.response.skipped).toBe(false);
    });

    it("should save a freeform response", async () => {
      // Insert test session
      await db
        .insertInto("sessions")
        .values({ id: "550e8400-e29b-41d4-a716-446655440000" })
        .execute();

      // Insert test section and question
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          order: 1,
          active: true,
        })
        .execute();

      await db
        .insertInto("questions")
        .values({
          slug: "question1",
          section_slug: "test-section",
          title: "Question 1",
          type: "freeform",
          order: 1,
          active: true,
        })
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.saveResponse({
        questionSlug: "question1",
        freeformResponse: "This is my response",
        skipped: false,
      });

      expect(result.response.freeform_response).toBe("This is my response");
      expect(result.response.skipped).toBe(false);
    });

    it("should save a skipped response", async () => {
      // Insert test session
      await db
        .insertInto("sessions")
        .values({ id: "550e8400-e29b-41d4-a716-446655440000" })
        .execute();

      // Insert test section and question
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          order: 1,
          active: true,
        })
        .execute();

      await db
        .insertInto("questions")
        .values({
          slug: "question1",
          section_slug: "test-section",
          title: "Question 1",
          type: "single",
          order: 1,
          active: true,
        })
        .execute();

      const caller = surveyRouter.createCaller({
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
        isAuthenticated: true,
      });
      const result = await caller.saveResponse({
        questionSlug: "question1",
        skipped: true,
      });

      expect(result.response.skipped).toBe(true);
    });
  });
});

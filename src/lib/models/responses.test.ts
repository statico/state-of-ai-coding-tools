import { afterEach, describe, expect, it, vi } from "vitest";
import { createQuestion, deactivateQuestion } from "./questions";
import {
  canFillFromPreviousMonth,
  createResponse,
  deleteResponse,
  fillFromPreviousMonth,
  getResponseByQuestion,
  getResponsesByQuestionSlug,
  getResponsesBySession,
  getResponsesByMonth,
  saveExperienceResponses,
  updateResponse,
  upsertResponse,
} from "./responses";
import { createSection, deactivateSection } from "./sections";
import { createSession } from "./sessions";

describe("Responses Model", () => {
  const testSessionId = "550e8400-e29b-41d4-a716-446655440000";
  const testMonth = 6; // June (1-12)
  const testIsoYear = 2024;
  const testQuestionSlug = "test-question";

  describe("getResponsesBySession", () => {
    it("should return empty array when no responses exist", async () => {
      const responses = await getResponsesBySession(
        "550e8400-e29b-41d4-a716-446655440001",
        testMonth,
        testIsoYear,
      );
      expect(responses).toEqual([]);
    });

    it("should return responses for specific session and week", async () => {
      // Create test session and questions
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question 1",
        type: "single",
        order: 1,
      });
      await createQuestion({
        slug: "question-2",
        section_slug: "section-1",
        title: "Test Question 2",
        type: "single",
        order: 2,
      });

      // Create test responses
      const response1 = await createResponse({
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });
      const response2 = await createResponse({
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: "question-2",
        single_option_slug: "option-2",
      });

      const responses = await getResponsesBySession(
        testSessionId,
        testMonth,
        testIsoYear,
      );
      expect(responses).toHaveLength(2);
      expect(
        responses.find((r) => r.question_slug === "question-1"),
      ).toBeDefined();
      expect(
        responses.find((r) => r.question_slug === "question-2"),
      ).toBeDefined();
    });
  });

  describe("getResponseByQuestion", () => {
    it("should return response for specific question", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const response = await createResponse({
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });

      const foundResponse = await getResponseByQuestion(
        testSessionId,
        testMonth,
        testIsoYear,
        testQuestionSlug,
      );

      expect(foundResponse?.session_id).toBe(testSessionId);
      expect(foundResponse?.question_slug).toBe(testQuestionSlug);
      expect(foundResponse?.single_option_slug).toBe("option-1");
    });

    it("should return undefined for non-existent response", async () => {
      const foundResponse = await getResponseByQuestion(
        "550e8400-e29b-41d4-a716-446655440001",
        testMonth,
        testIsoYear,
        "non-existent-question",
      );
      expect(foundResponse).toBeUndefined();
    });
  });

  describe("getResponsesByMonth", () => {
    it("should return responses for specific week", async () => {
      // Create test sessions and questions
      await createSession({ id: "550e8400-e29b-41d4-a716-446655440001" });
      await createSession({ id: "550e8400-e29b-41d4-a716-446655440002" });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question 1",
        type: "single",
        order: 1,
      });
      await createQuestion({
        slug: "question-2",
        section_slug: "section-1",
        title: "Test Question 2",
        type: "single",
        order: 2,
      });

      const response1 = await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440001",
        month: testMonth,
        year: testIsoYear,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });
      const response2 = await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440002",
        month: testMonth,
        year: testIsoYear,
        question_slug: "question-2",
        single_option_slug: "option-2",
      });

      const responses = await getResponsesByMonth(testMonth, testIsoYear);
      expect(responses).toHaveLength(2);
    });
  });

  describe("getResponsesByQuestionSlug", () => {
    it("should return responses for specific question across all sessions", async () => {
      // Create test sessions and question
      await createSession({ id: "550e8400-e29b-41d4-a716-446655440001" });
      await createSession({ id: "550e8400-e29b-41d4-a716-446655440002" });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const response1 = await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440001",
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });
      const response2 = await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440002",
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-2",
      });

      const responses = await getResponsesByQuestionSlug(testQuestionSlug);
      expect(responses).toHaveLength(2);
      expect(responses.every((r) => r.question_slug === testQuestionSlug)).toBe(
        true,
      );
    });
  });

  describe("createResponse", () => {
    it("should create a new response with single option", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const input = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      };
      const response = await createResponse(input);

      expect(response.session_id).toBe(testSessionId);
      expect(response.month).toBe(testMonth);
      expect(response.year).toBe(testIsoYear);
      expect(response.question_slug).toBe(testQuestionSlug);
      expect(response.single_option_slug).toBe("option-1");
      expect(response.skipped).toBe(false);
    });

    it("should create response with multiple options", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "multiple",
        order: 1,
      });

      const input = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        multiple_option_slugs: ["option-1", "option-2"],
      };
      const response = await createResponse(input);

      expect(response.multiple_option_slugs).toEqual(["option-1", "option-2"]);
    });

    it("should create response with write-in responses", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const input = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_writein_response: "Custom response",
      };
      const response = await createResponse(input);

      expect(response.single_writein_response).toBe("Custom response");
    });

    it("should create response with experience ratings", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const input = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        experience_awareness: 3,
        experience_sentiment: 1,
      };
      const response = await createResponse(input);

      expect(response.experience_awareness).toBe(3);
      expect(response.experience_sentiment).toBe(1);
    });

    it("should create response with freeform text", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const input = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        freeform_response: "This is a freeform response",
      };
      const response = await createResponse(input);

      expect(response.freeform_response).toBe("This is a freeform response");
    });

    it("should create response with numeric value", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const input = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        numeric_response: 42,
      };
      const response = await createResponse(input);

      expect(response.numeric_response).toBe("42");
    });

    it("should create skipped response", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const input = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        skipped: true,
      };
      const response = await createResponse(input);

      expect(response.skipped).toBe(true);
    });
  });

  describe("updateResponse", () => {
    it("should update response properties", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const response = await createResponse({
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });

      const updatedResponse = await updateResponse(
        testSessionId,
        testMonth,
        testIsoYear,
        testQuestionSlug,
        null,
        {
          single_option_slug: "option-2",
          comment: "Updated comment",
        },
      );

      expect(updatedResponse.single_option_slug).toBe("option-2");
      expect(updatedResponse.comment).toBe("Updated comment");
    });

    it("should throw error when updating non-existent response", async () => {
      await expect(
        updateResponse(
          "550e8400-e29b-41d4-a716-446655440001",
          testMonth,
          testIsoYear,
          "non-existent-question",
          null,
          { single_option_slug: "option-1" },
        ),
      ).rejects.toThrow();
    });
  });

  describe("upsertResponse", () => {
    it("should create new response when it doesn't exist", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const data = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
        skipped: false,
      };

      const response = await upsertResponse(data);

      expect(response.session_id).toBe(testSessionId);
      expect(response.question_slug).toBe(testQuestionSlug);
      expect(response.single_option_slug).toBe("option-1");
    });

    it("should update existing response when it exists", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      // Create initial response
      await createResponse({
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });

      // Upsert with updated data
      const data = {
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-2",
        comment: "Updated comment",
        skipped: false,
      };

      const response = await upsertResponse(data);

      expect(response.session_id).toBe(testSessionId);
      expect(response.question_slug).toBe(testQuestionSlug);
      expect(response.single_option_slug).toBe("option-2");
      expect(response.comment).toBe("Updated comment");
    });
  });

  describe("deleteResponse", () => {
    it("should delete an existing response", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const response = await createResponse({
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });

      const deletedResponse = await deleteResponse(
        testSessionId,
        testMonth,
        testIsoYear,
        testQuestionSlug,
      );

      expect(deletedResponse.session_id).toBe(testSessionId);
      expect(deletedResponse.question_slug).toBe(testQuestionSlug);

      // Verify response is actually deleted
      const responses = await getResponsesBySession(
        testSessionId,
        testMonth,
        testIsoYear,
      );
      expect(
        responses.find(
          (r) =>
            r.session_id === testSessionId &&
            r.question_slug === testQuestionSlug,
        ),
      ).toBeUndefined();
    });

    it("should throw error when deleting non-existent response", async () => {
      await expect(
        deleteResponse(
          "550e8400-e29b-41d4-a716-446655440001",
          testMonth,
          testIsoYear,
          "non-existent-question",
        ),
      ).rejects.toThrow();
    });
  });

  describe("CRUD operations integration", () => {
    it("should handle full CRUD lifecycle", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      // Create
      const response = await createResponse({
        session_id: testSessionId,
        month: testMonth,
        year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });
      expect(response.single_option_slug).toBe("option-1");
      expect(response.skipped).toBe(false);

      // Read
      const responses = await getResponsesBySession(
        testSessionId,
        testMonth,
        testIsoYear,
      );
      expect(
        responses.find(
          (r) =>
            r.session_id === testSessionId &&
            r.question_slug === testQuestionSlug,
        ),
      ).toBeDefined();

      // Update
      const updatedResponse = await updateResponse(
        testSessionId,
        testMonth,
        testIsoYear,
        testQuestionSlug,
        null,
        {
          single_option_slug: "option-2",
          comment: "Updated comment",
        },
      );
      expect(updatedResponse.single_option_slug).toBe("option-2");
      expect(updatedResponse.comment).toBe("Updated comment");

      // Delete
      const deletedResponse = await deleteResponse(
        testSessionId,
        testMonth,
        testIsoYear,
        testQuestionSlug,
      );
      expect(deletedResponse.session_id).toBe(testSessionId);

      // Verify deletion
      const finalResponses = await getResponsesBySession(
        testSessionId,
        testMonth,
        testIsoYear,
      );
      expect(
        finalResponses.find(
          (r) =>
            r.session_id === testSessionId &&
            r.question_slug === testQuestionSlug,
        ),
      ).toBeUndefined();
    });
  });

  describe("saveExperienceResponses", () => {
    it("should save multiple experience responses", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "test-section",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "test-section",
        title: "Test Question",
        type: "experience",
        order: 1,
      });

      const responses = [
        {
          optionSlug: "option1",
          experienceAwareness: 2,
          experienceSentiment: 1,
          skipped: false,
        },
        {
          optionSlug: "option2",
          experienceAwareness: 1,
          experienceSentiment: undefined,
          skipped: false,
        },
      ];

      const savedResponses = await saveExperienceResponses(
        testSessionId,
        testMonth,
        testIsoYear,
        testQuestionSlug,
        responses,
      );

      expect(savedResponses).toHaveLength(2);
      expect(savedResponses[0].experience_awareness).toBe(2);
      expect(savedResponses[0].experience_sentiment).toBe(1);
      expect(savedResponses[1].experience_awareness).toBe(1);
      expect(savedResponses[1].experience_sentiment).toBeNull();
    });

    it("should handle skipped experience responses", async () => {
      // Create test session and question
      await createSession({ id: testSessionId });
      await createSection({
        slug: "test-section",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: testQuestionSlug,
        section_slug: "test-section",
        title: "Test Question",
        type: "experience",
        order: 1,
      });

      const responses = [
        {
          optionSlug: "option1",
          experienceAwareness: 0,
          experienceSentiment: undefined,
          skipped: true,
        },
      ];

      const savedResponses = await saveExperienceResponses(
        testSessionId,
        testMonth,
        testIsoYear,
        testQuestionSlug,
        responses,
      );

      expect(savedResponses[0].skipped).toBe(true);
      expect(savedResponses[0].experience_awareness).toBe(0);
      expect(savedResponses[0].experience_sentiment).toBeNull();
    });
  });

  describe("canFillFromPreviousMonth", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return false when no previous month responses exist", async () => {
      vi.setSystemTime(new Date("2024-02-15"));
      await createSession({ id: testSessionId });

      const result = await canFillFromPreviousMonth(testSessionId);
      expect(result).toBe(false);
    });

    it("should return false when current month has responses", async () => {
      vi.setSystemTime(new Date("2024-02-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question 1",
        type: "single",
        order: 1,
      });

      // Create response for current month (February 2024)
      await createResponse({
        session_id: testSessionId,
        month: 2,
        year: 2024,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });

      // Create response for previous month (January 2024)
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });

      const result = await canFillFromPreviousMonth(testSessionId);
      expect(result).toBe(false);
    });

    it("should return true when previous month has responses but current month does not", async () => {
      vi.setSystemTime(new Date("2024-02-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question 1",
        type: "single",
        order: 1,
      });

      // Create response for previous month (January 2024)
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });

      const result = await canFillFromPreviousMonth(testSessionId);
      expect(result).toBe(true);
    });

    it("should handle year boundary correctly", async () => {
      vi.setSystemTime(new Date("2024-01-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question 1",
        type: "single",
        order: 1,
      });

      // Create response for previous month (December 2023)
      await createResponse({
        session_id: testSessionId,
        month: 12,
        year: 2023,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });

      const result = await canFillFromPreviousMonth(testSessionId);
      expect(result).toBe(true);
    });
  });

  describe("fillFromPreviousMonth", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should copy responses from previous month to current month", async () => {
      vi.setSystemTime(new Date("2024-02-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question 1",
        type: "single",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question-2",
        section_slug: "section-1",
        title: "Test Question 2",
        type: "multiple",
        order: 2,
        active: true,
      });

      // Create responses for previous month (January 2024)
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-1",
        single_option_slug: "option-1",
        comment: "Previous comment",
      });
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-2",
        multiple_option_slugs: ["option-a", "option-b"],
      });

      const copiedResponses = await fillFromPreviousMonth(testSessionId);
      expect(copiedResponses).toHaveLength(2);

      // Verify responses were copied to current month (February 2024)
      const currentMonthResponses = await getResponsesBySession(
        testSessionId,
        2,
        2024,
      );
      expect(currentMonthResponses).toHaveLength(2);
      expect(
        currentMonthResponses.find((r) => r.question_slug === "question-1")
          ?.single_option_slug,
      ).toBe("option-1");
      expect(
        currentMonthResponses.find((r) => r.question_slug === "question-1")
          ?.comment,
      ).toBe("Previous comment");
      expect(
        currentMonthResponses.find((r) => r.question_slug === "question-2")
          ?.multiple_option_slugs,
      ).toEqual(["option-a", "option-b"]);
    });

    it("should only copy responses for active questions", async () => {
      vi.setSystemTime(new Date("2024-02-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question-active",
        section_slug: "section-1",
        title: "Active Question",
        type: "single",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question-inactive",
        section_slug: "section-1",
        title: "Inactive Question",
        type: "single",
        order: 2,
      });
      await deactivateQuestion("question-inactive");

      // Create responses for both questions in previous month
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-active",
        single_option_slug: "option-1",
      });
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-inactive",
        single_option_slug: "option-2",
      });

      const copiedResponses = await fillFromPreviousMonth(testSessionId);
      expect(copiedResponses).toHaveLength(1);
      expect(copiedResponses[0].question_slug).toBe("question-active");

      // Verify only active question was copied
      const currentMonthResponses = await getResponsesBySession(
        testSessionId,
        2,
        2024,
      );
      expect(currentMonthResponses).toHaveLength(1);
      expect(currentMonthResponses[0].question_slug).toBe("question-active");
    });

    it("should only copy responses for active sections", async () => {
      vi.setSystemTime(new Date("2024-02-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-active",
        title: "Active Section",
        order: 1,
        active: true,
      });
      await createSection({
        slug: "section-inactive",
        title: "Inactive Section",
        order: 2,
      });
      await deactivateSection("section-inactive");
      await createQuestion({
        slug: "question-1",
        section_slug: "section-active",
        title: "Question in Active Section",
        type: "single",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question-2",
        section_slug: "section-inactive",
        title: "Question in Inactive Section",
        type: "single",
        order: 1,
        active: true,
      });

      // Create responses for both questions in previous month
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-2",
        single_option_slug: "option-2",
      });

      const copiedResponses = await fillFromPreviousMonth(testSessionId);
      expect(copiedResponses).toHaveLength(1);
      expect(copiedResponses[0].question_slug).toBe("question-1");

      // Verify only question from active section was copied
      const currentMonthResponses = await getResponsesBySession(
        testSessionId,
        2,
        2024,
      );
      expect(currentMonthResponses).toHaveLength(1);
      expect(currentMonthResponses[0].question_slug).toBe("question-1");
    });

    it("should copy all response fields correctly", async () => {
      vi.setSystemTime(new Date("2024-02-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
        active: true,
      });

      // Create comprehensive response for previous month
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-1",
        single_option_slug: "option-1",
        single_writein_response: "write-in",
        freeform_response: "freeform text",
        numeric_response: 42,
        experience_awareness: 3,
        experience_sentiment: 1,
        comment: "test comment",
        skipped: false,
      });

      const copiedResponses = await fillFromPreviousMonth(testSessionId);
      expect(copiedResponses).toHaveLength(1);

      const copied = copiedResponses[0];
      expect(copied.month).toBe(2); // Current month
      expect(copied.year).toBe(2024);
      expect(copied.single_option_slug).toBe("option-1");
      expect(copied.single_writein_response).toBe("write-in");
      expect(copied.freeform_response).toBe("freeform text");
      expect(copied.numeric_response).toBe("42");
      expect(copied.experience_awareness).toBe(3);
      expect(copied.experience_sentiment).toBe(1);
      expect(copied.comment).toBe("test comment");
      expect(copied.skipped).toBe(false);
    });

    it("should handle year boundary correctly", async () => {
      vi.setSystemTime(new Date("2024-01-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
        active: true,
      });

      // Create response for previous month (December 2023)
      await createResponse({
        session_id: testSessionId,
        month: 12,
        year: 2023,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });

      const copiedResponses = await fillFromPreviousMonth(testSessionId);
      expect(copiedResponses).toHaveLength(1);

      // Verify response was copied to current month (January 2024)
      const currentMonthResponses = await getResponsesBySession(
        testSessionId,
        1,
        2024,
      );
      expect(currentMonthResponses).toHaveLength(1);
      expect(currentMonthResponses[0].month).toBe(1);
      expect(currentMonthResponses[0].year).toBe(2024);
    });

    it("should handle experience responses with option_slug", async () => {
      vi.setSystemTime(new Date("2024-02-15"));
      await createSession({ id: testSessionId });
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Experience Question",
        type: "experience",
        order: 1,
        active: true,
      });

      // Create experience responses for previous month
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-1",
        option_slug: "option-1",
        experience_awareness: 2,
        experience_sentiment: 1,
        comment: "experience comment",
      });
      await createResponse({
        session_id: testSessionId,
        month: 1,
        year: 2024,
        question_slug: "question-1",
        option_slug: "option-2",
        experience_awareness: 3,
        experience_sentiment: undefined,
      });

      const copiedResponses = await fillFromPreviousMonth(testSessionId);
      expect(copiedResponses).toHaveLength(2);

      // Verify experience responses were copied
      const currentMonthResponses = await getResponsesBySession(
        testSessionId,
        2,
        2024,
      );
      expect(currentMonthResponses).toHaveLength(2);
      const option1Response = currentMonthResponses.find(
        (r) => r.option_slug === "option-1",
      );
      expect(option1Response?.experience_awareness).toBe(2);
      expect(option1Response?.experience_sentiment).toBe(1);
      expect(option1Response?.comment).toBe("experience comment");
    });
  });
});

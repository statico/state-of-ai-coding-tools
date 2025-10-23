import { describe, expect, it } from "vitest";
import { createQuestion } from "./questions";
import {
  createResponse,
  deleteResponse,
  getResponseByQuestion,
  getResponsesByQuestionSlug,
  getResponsesBySession,
  getResponsesByWeek,
  updateResponse,
  upsertResponse,
} from "./responses";
import { createSection } from "./sections";
import { createSession } from "./sessions";

describe("Responses Model", () => {
  const testSessionId = "550e8400-e29b-41d4-a716-446655440000";
  const testIsoWeek = 42;
  const testIsoYear = 2024;
  const testQuestionSlug = "test-question";

  describe("getResponsesBySession", () => {
    it("should return empty array when no responses exist", async () => {
      const responses = await getResponsesBySession(
        "550e8400-e29b-41d4-a716-446655440001",
        testIsoWeek,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });
      const response2 = await createResponse({
        session_id: testSessionId,
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: "question-2",
        single_option_slug: "option-2",
      });

      const responses = await getResponsesBySession(
        testSessionId,
        testIsoWeek,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });

      const foundResponse = await getResponseByQuestion(
        testSessionId,
        testIsoWeek,
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
        testIsoWeek,
        testIsoYear,
        "non-existent-question",
      );
      expect(foundResponse).toBeUndefined();
    });
  });

  describe("getResponsesByWeek", () => {
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: "question-1",
        single_option_slug: "option-1",
      });
      const response2 = await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440002",
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: "question-2",
        single_option_slug: "option-2",
      });

      const responses = await getResponsesByWeek(testIsoWeek, testIsoYear);
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });
      const response2 = await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440002",
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      };
      const response = await createResponse(input);

      expect(response.session_id).toBe(testSessionId);
      expect(response.iso_week).toBe(testIsoWeek);
      expect(response.iso_year).toBe(testIsoYear);
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: testQuestionSlug,
        experience_awareness: 3,
        experience_sentiment: 4,
      };
      const response = await createResponse(input);

      expect(response.experience_awareness).toBe(3);
      expect(response.experience_sentiment).toBe(4);
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });

      const updatedResponse = await updateResponse(
        testSessionId,
        testIsoWeek,
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
          testIsoWeek,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });

      // Upsert with updated data
      const data = {
        session_id: testSessionId,
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });

      const deletedResponse = await deleteResponse(
        testSessionId,
        testIsoWeek,
        testIsoYear,
        testQuestionSlug,
      );

      expect(deletedResponse.session_id).toBe(testSessionId);
      expect(deletedResponse.question_slug).toBe(testQuestionSlug);

      // Verify response is actually deleted
      const responses = await getResponsesBySession(
        testSessionId,
        testIsoWeek,
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
          testIsoWeek,
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
        iso_week: testIsoWeek,
        iso_year: testIsoYear,
        question_slug: testQuestionSlug,
        single_option_slug: "option-1",
      });
      expect(response.single_option_slug).toBe("option-1");
      expect(response.skipped).toBe(false);

      // Read
      const responses = await getResponsesBySession(
        testSessionId,
        testIsoWeek,
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
        testIsoWeek,
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
        testIsoWeek,
        testIsoYear,
        testQuestionSlug,
      );
      expect(deletedResponse.session_id).toBe(testSessionId);

      // Verify deletion
      const finalResponses = await getResponsesBySession(
        testSessionId,
        testIsoWeek,
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
});

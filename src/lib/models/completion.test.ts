import { setupTestData } from "@/test/setup";
import { beforeEach, describe, expect, it } from "vitest";
import { getCurrentMonth } from "../utils";
import { getCompletionPercentage } from "./completion";
import { createQuestion } from "./questions";
import { createResponse } from "./responses";
import { createSection } from "./sections";
import { createSession } from "./sessions";

describe("Completion Model", () => {
  beforeEach(async () => {
    await setupTestData();
  });

  describe("getCompletionPercentage", () => {
    it("should calculate completion percentage correctly", async () => {
      // Insert test session
      await createSession({ id: "550e8400-e29b-41d4-a716-446655440000" });

      // Insert test sections
      await createSection({
        slug: "section1",
        title: "Section 1",
        order: 1,
        active: true,
      });
      await createSection({
        slug: "section2",
        title: "Section 2",
        order: 2,
        active: true,
      });

      // Insert test questions
      await createQuestion({
        slug: "question1",
        section_slug: "section1",
        title: "Question 1",
        type: "single",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question2",
        section_slug: "section1",
        title: "Question 2",
        type: "single",
        order: 2,
        active: true,
      });
      await createQuestion({
        slug: "question3",
        section_slug: "section2",
        title: "Question 3",
        type: "single",
        order: 1,
        active: true,
      });

      // Get current month and year using the same method as completion function
      const { month: monthNumber, year: currentYear } = getCurrentMonth();

      // Insert test responses (2 completed, 1 skipped)
      await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440000",
        month: monthNumber,
        year: currentYear,
        question_slug: "question1",
        skipped: false,
        single_option_slug: "option1",
      });
      await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440000",
        month: monthNumber,
        year: currentYear,
        question_slug: "question2",
        skipped: false,
        single_option_slug: "option2",
      });
      await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440000",
        month: monthNumber,
        year: currentYear,
        question_slug: "question3",
        skipped: true,
      });

      const result = await getCompletionPercentage(
        "550e8400-e29b-41d4-a716-446655440000",
      );

      // Overall: 3 completed out of 3 total = 100% (skipped questions count as completed)
      expect(result.overallPercentage).toBe(100);
      expect(result.totalCompletedQuestions).toBe(3);
      expect(result.totalQuestions).toBe(3);

      // Section completion
      expect(result.sectionCompletion).toHaveLength(2);

      // Section 1: 2 completed out of 2 = 100%
      const section1 = result.sectionCompletion.find(
        (s) => s.sectionSlug === "section1",
      );
      expect(section1?.percentage).toBe(100);
      expect(section1?.completedQuestions).toBe(2);
      expect(section1?.totalQuestions).toBe(2);

      // Section 2: 1 completed out of 1 = 100% (skipped question counts as completed)
      const section2 = result.sectionCompletion.find(
        (s) => s.sectionSlug === "section2",
      );
      expect(section2?.percentage).toBe(100);
      expect(section2?.completedQuestions).toBe(1);
      expect(section2?.totalQuestions).toBe(1);
    });

    it("should handle empty responses", async () => {
      // Insert test session
      await createSession({ id: "550e8400-e29b-41d4-a716-446655440000" });

      // Insert test section and question
      await createSection({
        slug: "test-section",
        title: "Test Section",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question1",
        section_slug: "test-section",
        title: "Question 1",
        type: "single",
        order: 1,
        active: true,
      });

      const result = await getCompletionPercentage(
        "550e8400-e29b-41d4-a716-446655440000",
      );

      expect(result.overallPercentage).toBe(0);
      expect(result.totalCompletedQuestions).toBe(0);
      expect(result.totalQuestions).toBe(1);
    });

    it("should handle no questions in sections", async () => {
      // Insert test session
      await createSession({ id: "550e8400-e29b-41d4-a716-446655440000" });

      // Insert test section with no questions
      await createSection({
        slug: "empty-section",
        title: "Empty Section",
        order: 1,
        active: true,
      });

      const result = await getCompletionPercentage(
        "550e8400-e29b-41d4-a716-446655440000",
      );

      expect(result.overallPercentage).toBe(0);
      expect(result.totalCompletedQuestions).toBe(0);
      expect(result.totalQuestions).toBe(0);
    });

    it("should not count unskipped questions with no actual values as completed", async () => {
      // Insert test session
      await createSession({ id: "550e8400-e29b-41d4-a716-446655440000" });

      // Insert test section and question
      await createSection({
        slug: "test-section",
        title: "Test Section",
        order: 1,
        active: true,
      });
      await createQuestion({
        slug: "question1",
        section_slug: "test-section",
        title: "Question 1",
        type: "single",
        order: 1,
        active: true,
      });

      // Get current month and year
      const { month: monthNumber, year: currentYear } = getCurrentMonth();

      // Create a response that was unskipped but has no actual values
      // This simulates: user enters choice, skips, then unskips without re-entering values
      await createResponse({
        session_id: "550e8400-e29b-41d4-a716-446655440000",
        month: monthNumber,
        year: currentYear,
        question_slug: "question1",
        skipped: false, // unskipped
        // No actual values provided (no single_option_slug, etc.)
      });

      const result = await getCompletionPercentage(
        "550e8400-e29b-41d4-a716-446655440000",
      );

      // Should not count as completed since no actual values were provided
      expect(result.overallPercentage).toBe(0);
      expect(result.totalCompletedQuestions).toBe(0);
      expect(result.totalQuestions).toBe(1);

      // Section completion should also be 0%
      const section = result.sectionCompletion.find(
        (s) => s.sectionSlug === "test-section",
      );
      expect(section?.percentage).toBe(0);
      expect(section?.completedQuestions).toBe(0);
      expect(section?.totalQuestions).toBe(1);
    });
  });
});

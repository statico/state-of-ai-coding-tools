import { describe, expect, it } from "vitest";
import {
  createQuestion,
  deactivateQuestion,
  deleteQuestion,
  getActiveQuestions,
  getActiveQuestionsBySection,
  getAllQuestions,
  getQuestionBySlug,
  getQuestionsBySection,
  updateQuestion,
  upsertQuestion,
} from "./questions";
import { createSection } from "./sections";

describe("Questions Model", () => {
  describe("getAllQuestions", () => {
    it("should return empty array when no questions exist", async () => {
      const questions = await getAllQuestions();
      expect(questions).toEqual([]);
    });

    it("should return all questions ordered by order", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      // Create test questions
      const question1 = await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "First question",
        type: "single",
        order: 2,
      });
      const question2 = await createQuestion({
        slug: "question-2",
        section_slug: "section-1",
        title: "Second question",
        type: "multiple",
        order: 1,
      });

      const questions = await getAllQuestions();
      expect(questions).toHaveLength(2);
      expect(questions[0].slug).toBe("question-2"); // order: 1
      expect(questions[1].slug).toBe("question-1"); // order: 2
    });
  });

  describe("getActiveQuestions", () => {
    it("should return only active questions", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const question1 = await createQuestion({
        slug: "active-question",
        section_slug: "section-1",
        title: "Active question",
        type: "single",
        order: 1,
      });
      const question2 = await createQuestion({
        slug: "inactive-question",
        section_slug: "section-1",
        title: "Inactive question",
        type: "single",
        order: 2,
      });

      // Deactivate second question
      await deactivateQuestion("inactive-question");

      const activeQuestions = await getActiveQuestions();
      expect(activeQuestions).toHaveLength(1);
      expect(activeQuestions[0].slug).toBe("active-question");
      expect(activeQuestions[0].active).toBe(true);
    });
  });

  describe("getQuestionsBySection", () => {
    it("should return questions for specific section", async () => {
      // Create test sections first
      await createSection({
        slug: "section-1",
        title: "Test Section 1",
        order: 1,
      });
      await createSection({
        slug: "section-2",
        title: "Test Section 2",
        order: 2,
      });

      const question1 = await createQuestion({
        slug: "question-s1",
        section_slug: "section-1",
        title: "Question for S1",
        type: "single",
        order: 1,
      });
      const question2 = await createQuestion({
        slug: "question-s2",
        section_slug: "section-2",
        title: "Question for S2",
        type: "single",
        order: 1,
      });

      const questions = await getQuestionsBySection("section-1");
      expect(questions).toHaveLength(1);
      expect(questions[0].slug).toBe("question-s1");
    });
  });

  describe("getActiveQuestionsBySection", () => {
    it("should return only active questions for specific section", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const question1 = await createQuestion({
        slug: "active-s1",
        section_slug: "section-1",
        title: "Active question for S1",
        type: "single",
        order: 1,
      });
      const question2 = await createQuestion({
        slug: "inactive-s1",
        section_slug: "section-1",
        title: "Inactive question for S1",
        type: "single",
        order: 2,
      });

      await deactivateQuestion("inactive-s1");

      const activeQuestions = await getActiveQuestionsBySection("section-1");
      expect(activeQuestions).toHaveLength(1);
      expect(activeQuestions[0].slug).toBe("active-s1");
    });
  });

  describe("getQuestionBySlug", () => {
    it("should return question by slug", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const question = await createQuestion({
        slug: "test-question",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const foundQuestion = await getQuestionBySlug("test-question");
      expect(foundQuestion?.slug).toBe("test-question");
      expect(foundQuestion?.title).toBe("Test Question");
    });

    it("should return undefined for non-existent question", async () => {
      const foundQuestion = await getQuestionBySlug("non-existent");
      expect(foundQuestion).toBeUndefined();
    });
  });

  describe("createQuestion", () => {
    it("should create a new question with default values", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const input = {
        slug: "new-question",
        section_slug: "section-1",
        title: "New Question",
        type: "single",
        order: 1,
      };
      const question = await createQuestion(input);

      expect(question.slug).toBe("new-question");
      expect(question.section_slug).toBe("section-1");
      expect(question.title).toBe("New Question");
      expect(question.type).toBe("single");
      expect(question.order).toBe(1);
      expect(question.active).toBe(true);
      expect(question.description).toBeNull();
      expect(question.multiple_max).toBeNull();
    });

    it("should create question with description and multiple_max", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const input = {
        slug: "question-with-desc",
        section_slug: "section-1",
        title: "Question with Description",
        description: "This is a description",
        type: "multiple",
        order: 1,
        multiple_max: 3,
      };
      const question = await createQuestion(input);

      expect(question.description).toBe("This is a description");
      expect(question.multiple_max).toBe(3);
    });
  });

  describe("updateQuestion", () => {
    it("should update question properties", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const question = await createQuestion({
        slug: "update-test",
        section_slug: "section-1",
        title: "Original Title",
        type: "single",
        order: 1,
      });

      const updatedQuestion = await updateQuestion("update-test", {
        title: "Updated Title",
        description: "New description",
        type: "multiple",
        multiple_max: 2,
      });

      expect(updatedQuestion.slug).toBe("update-test");
      expect(updatedQuestion.title).toBe("Updated Title");
      expect(updatedQuestion.description).toBe("New description");
      expect(updatedQuestion.type).toBe("multiple");
      expect(updatedQuestion.multiple_max).toBe(2);
    });

    it("should throw error when updating non-existent question", async () => {
      await expect(
        updateQuestion("non-existent", { title: "Updated" }),
      ).rejects.toThrow();
    });
  });

  describe("deactivateQuestion", () => {
    it("should deactivate a question", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const question = await createQuestion({
        slug: "deactivate-test",
        section_slug: "section-1",
        title: "To be deactivated",
        type: "single",
        order: 1,
      });

      const deactivatedQuestion = await deactivateQuestion("deactivate-test");

      expect(deactivatedQuestion.slug).toBe("deactivate-test");
      expect(deactivatedQuestion.active).toBe(false);
    });

    it("should throw error when deactivating non-existent question", async () => {
      await expect(deactivateQuestion("non-existent")).rejects.toThrow();
    });
  });

  describe("deleteQuestion", () => {
    it("should delete an existing question", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const question = await createQuestion({
        slug: "delete-test",
        section_slug: "section-1",
        title: "To be deleted",
        type: "single",
        order: 1,
      });

      const deletedQuestion = await deleteQuestion("delete-test");

      expect(deletedQuestion.slug).toBe("delete-test");

      // Verify question is actually deleted
      const questions = await getAllQuestions();
      expect(questions.find((q) => q.slug === "delete-test")).toBeUndefined();
    });

    it("should throw error when deleting non-existent question", async () => {
      await expect(deleteQuestion("non-existent")).rejects.toThrow();
    });
  });

  describe("upsertQuestion", () => {
    it("should create new question when it doesn't exist", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      const data = {
        slug: "upsert-new",
        section_slug: "section-1",
        title: "Upsert New",
        type: "single",
        order: 1,
        active: true,
      };

      const question = await upsertQuestion(data);

      expect(question.slug).toBe("upsert-new");
      expect(question.title).toBe("Upsert New");
    });

    it("should update existing question when it exists", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      // Create initial question
      await createQuestion({
        slug: "upsert-existing",
        section_slug: "section-1",
        title: "Original Title",
        type: "single",
        order: 1,
      });

      // Upsert with updated data
      const data = {
        slug: "upsert-existing",
        section_slug: "section-1",
        title: "Updated Title",
        type: "multiple",
        order: 2,
        active: false,
        multiple_max: 3,
      };

      const question = await upsertQuestion(data);

      expect(question.slug).toBe("upsert-existing");
      expect(question.title).toBe("Updated Title");
      expect(question.type).toBe("multiple");
      expect(question.order).toBe(2);
      expect(question.active).toBe(false);
      expect(question.multiple_max).toBe(3);
    });
  });

  describe("CRUD operations integration", () => {
    it("should handle full CRUD lifecycle", async () => {
      // Create test section first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });

      // Create
      const question = await createQuestion({
        slug: "lifecycle-test",
        section_slug: "section-1",
        title: "Lifecycle test",
        type: "single",
        order: 1,
      });
      expect(question.title).toBe("Lifecycle test");
      expect(question.active).toBe(true);

      // Read
      const questions = await getAllQuestions();
      expect(questions.find((q) => q.slug === "lifecycle-test")).toBeDefined();

      // Update
      const updatedQuestion = await updateQuestion("lifecycle-test", {
        title: "Updated lifecycle test",
        description: "Updated description",
        type: "multiple",
        multiple_max: 2,
      });
      expect(updatedQuestion.title).toBe("Updated lifecycle test");
      expect(updatedQuestion.description).toBe("Updated description");
      expect(updatedQuestion.type).toBe("multiple");
      expect(updatedQuestion.multiple_max).toBe(2);

      // Deactivate
      const deactivatedQuestion = await deactivateQuestion("lifecycle-test");
      expect(deactivatedQuestion.active).toBe(false);

      // Delete
      const deletedQuestion = await deleteQuestion("lifecycle-test");
      expect(deletedQuestion.slug).toBe("lifecycle-test");

      // Verify deletion
      const finalQuestions = await getAllQuestions();
      expect(
        finalQuestions.find((q) => q.slug === "lifecycle-test"),
      ).toBeUndefined();
    });
  });
});

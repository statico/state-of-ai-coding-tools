import { describe, expect, it } from "vitest";
import {
  createOption,
  deactivateOption,
  deleteOption,
  getActiveOptions,
  getActiveOptionsByQuestion,
  getAllOptions,
  getOptionBySlug,
  getOptionsByQuestion,
  updateOption,
  upsertOption,
} from "./options";
import { createQuestion } from "./questions";
import { createSection } from "./sections";

describe("Options Model", () => {
  describe("getAllOptions", () => {
    it("should return empty array when no options exist", async () => {
      const options = await getAllOptions();
      expect(options).toEqual([]);
    });

    it("should return all options ordered by order", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      // Create test options
      const option1 = await createOption({
        slug: "option-1",
        question_slug: "question-1",
        label: "First option",
        order: 2,
      });
      const option2 = await createOption({
        slug: "option-2",
        question_slug: "question-1",
        label: "Second option",
        order: 1,
      });

      const options = await getAllOptions();
      expect(options).toHaveLength(2);
      expect(options[0].slug).toBe("option-2"); // order: 1
      expect(options[1].slug).toBe("option-1"); // order: 2
    });
  });

  describe("getActiveOptions", () => {
    it("should return only active options", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const option1 = await createOption({
        slug: "active-option",
        question_slug: "question-1",
        label: "Active option",
        order: 1,
      });
      const option2 = await createOption({
        slug: "inactive-option",
        question_slug: "question-1",
        label: "Inactive option",
        order: 2,
      });

      // Deactivate second option
      await deactivateOption("inactive-option");

      const activeOptions = await getActiveOptions();
      expect(activeOptions).toHaveLength(1);
      expect(activeOptions[0].slug).toBe("active-option");
      expect(activeOptions[0].active).toBe(true);
    });
  });

  describe("getOptionsByQuestion", () => {
    it("should return options for specific question", async () => {
      // Create test sections and questions first
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
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question 1",
        type: "single",
        order: 1,
      });
      await createQuestion({
        slug: "question-2",
        section_slug: "section-2",
        title: "Test Question 2",
        type: "single",
        order: 1,
      });

      const option1 = await createOption({
        slug: "option-q1",
        question_slug: "question-1",
        label: "Option for Q1",
        order: 1,
      });
      const option2 = await createOption({
        slug: "option-q2",
        question_slug: "question-2",
        label: "Option for Q2",
        order: 1,
      });

      const options = await getOptionsByQuestion("question-1");
      expect(options).toHaveLength(1);
      expect(options[0].slug).toBe("option-q1");
    });
  });

  describe("getActiveOptionsByQuestion", () => {
    it("should return only active options for specific question", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const option1 = await createOption({
        slug: "active-q1",
        question_slug: "question-1",
        label: "Active option for Q1",
        order: 1,
      });
      const option2 = await createOption({
        slug: "inactive-q1",
        question_slug: "question-1",
        label: "Inactive option for Q1",
        order: 2,
      });

      await deactivateOption("inactive-q1");

      const activeOptions = await getActiveOptionsByQuestion("question-1");
      expect(activeOptions).toHaveLength(1);
      expect(activeOptions[0].slug).toBe("active-q1");
    });
  });

  describe("getOptionBySlug", () => {
    it("should return option by slug", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const option = await createOption({
        slug: "test-option",
        question_slug: "question-1",
        label: "Test Option",
        order: 1,
      });

      const foundOption = await getOptionBySlug("test-option");
      expect(foundOption?.slug).toBe("test-option");
      expect(foundOption?.label).toBe("Test Option");
    });

    it("should return undefined for non-existent option", async () => {
      const foundOption = await getOptionBySlug("non-existent");
      expect(foundOption).toBeUndefined();
    });
  });

  describe("createOption", () => {
    it("should create a new option with default values", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const input = {
        slug: "new-option",
        question_slug: "question-1",
        label: "New Option",
        order: 1,
      };
      const option = await createOption(input);

      expect(option.slug).toBe("new-option");
      expect(option.question_slug).toBe("question-1");
      expect(option.label).toBe("New Option");
      expect(option.order).toBe(1);
      expect(option.active).toBe(true);
      expect(option.description).toBeNull();
    });

    it("should create option with description", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const input = {
        slug: "option-with-desc",
        question_slug: "question-1",
        label: "Option with Description",
        description: "This is a description",
        order: 1,
      };
      const option = await createOption(input);

      expect(option.description).toBe("This is a description");
    });
  });

  describe("updateOption", () => {
    it("should update option properties", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const option = await createOption({
        slug: "update-test",
        question_slug: "question-1",
        label: "Original Label",
        order: 1,
      });

      const updatedOption = await updateOption("update-test", {
        label: "Updated Label",
        description: "New description",
      });

      expect(updatedOption.slug).toBe("update-test");
      expect(updatedOption.label).toBe("Updated Label");
      expect(updatedOption.description).toBe("New description");
    });

    it("should throw error when updating non-existent option", async () => {
      await expect(updateOption("non-existent", { label: "Updated" })).rejects.toThrow();
    });
  });

  describe("deactivateOption", () => {
    it("should deactivate an option", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const option = await createOption({
        slug: "deactivate-test",
        question_slug: "question-1",
        label: "To be deactivated",
        order: 1,
      });

      const deactivatedOption = await deactivateOption("deactivate-test");

      expect(deactivatedOption.slug).toBe("deactivate-test");
      expect(deactivatedOption.active).toBe(false);
    });

    it("should throw error when deactivating non-existent option", async () => {
      await expect(deactivateOption("non-existent")).rejects.toThrow();
    });
  });

  describe("deleteOption", () => {
    it("should delete an existing option", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const option = await createOption({
        slug: "delete-test",
        question_slug: "question-1",
        label: "To be deleted",
        order: 1,
      });

      const deletedOption = await deleteOption("delete-test");

      expect(deletedOption.slug).toBe("delete-test");

      // Verify option is actually deleted
      const options = await getAllOptions();
      expect(options.find((o) => o.slug === "delete-test")).toBeUndefined();
    });

    it("should throw error when deleting non-existent option", async () => {
      await expect(deleteOption("non-existent")).rejects.toThrow();
    });
  });

  describe("upsertOption", () => {
    it("should create new option when it doesn't exist", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      const data = {
        slug: "upsert-new",
        question_slug: "question-1",
        label: "Upsert New",
        order: 1,
        active: true,
      };

      const option = await upsertOption(data);

      expect(option.slug).toBe("upsert-new");
      expect(option.label).toBe("Upsert New");
    });

    it("should update existing option when it exists", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      // Create initial option
      await createOption({
        slug: "upsert-existing",
        question_slug: "question-1",
        label: "Original Label",
        order: 1,
      });

      // Upsert with updated data
      const data = {
        slug: "upsert-existing",
        question_slug: "question-1",
        label: "Updated Label",
        order: 2,
        active: false,
      };

      const option = await upsertOption(data);

      expect(option.slug).toBe("upsert-existing");
      expect(option.label).toBe("Updated Label");
      expect(option.order).toBe(2);
      expect(option.active).toBe(false);
    });
  });

  describe("CRUD operations integration", () => {
    it("should handle full CRUD lifecycle", async () => {
      // Create test section and question first
      await createSection({
        slug: "section-1",
        title: "Test Section",
        order: 1,
      });
      await createQuestion({
        slug: "question-1",
        section_slug: "section-1",
        title: "Test Question",
        type: "single",
        order: 1,
      });

      // Create
      const option = await createOption({
        slug: "lifecycle-test",
        question_slug: "question-1",
        label: "Lifecycle test",
        order: 1,
      });
      expect(option.label).toBe("Lifecycle test");
      expect(option.active).toBe(true);

      // Read
      const options = await getAllOptions();
      expect(options.find((o) => o.slug === "lifecycle-test")).toBeDefined();

      // Update
      const updatedOption = await updateOption("lifecycle-test", {
        label: "Updated lifecycle test",
        description: "Updated description",
      });
      expect(updatedOption.label).toBe("Updated lifecycle test");
      expect(updatedOption.description).toBe("Updated description");

      // Deactivate
      const deactivatedOption = await deactivateOption("lifecycle-test");
      expect(deactivatedOption.active).toBe(false);

      // Delete
      const deletedOption = await deleteOption("lifecycle-test");
      expect(deletedOption.slug).toBe("lifecycle-test");

      // Verify deletion
      const finalOptions = await getAllOptions();
      expect(finalOptions.find((o) => o.slug === "lifecycle-test")).toBeUndefined();
    });
  });
});

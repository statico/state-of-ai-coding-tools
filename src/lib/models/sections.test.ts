import { describe, expect, it } from "vitest";
import {
  createSection,
  deactivateSection,
  deleteSection,
  getAllSections,
  getActiveSections,
  getSectionBySlug,
  updateSection,
  upsertSection,
} from "./sections";

describe("Sections Model", () => {
  describe("getAllSections", () => {
    it("should return empty array when no sections exist", async () => {
      const sections = await getAllSections();
      expect(sections).toEqual([]);
    });

    it("should return all sections ordered by order", async () => {
      // Create test sections
      const section1 = await createSection({
        slug: "section-1",
        title: "First section",
        order: 2,
      });
      const section2 = await createSection({
        slug: "section-2",
        title: "Second section",
        order: 1,
      });

      const sections = await getAllSections();
      expect(sections).toHaveLength(2);
      expect(sections[0].slug).toBe("section-2"); // order: 1
      expect(sections[1].slug).toBe("section-1"); // order: 2
    });
  });

  describe("getActiveSections", () => {
    it("should return only active sections", async () => {
      const section1 = await createSection({
        slug: "active-section",
        title: "Active section",
        order: 1,
      });
      const section2 = await createSection({
        slug: "inactive-section",
        title: "Inactive section",
        order: 2,
      });

      // Deactivate second section
      await deactivateSection("inactive-section");

      const activeSections = await getActiveSections();
      expect(activeSections).toHaveLength(1);
      expect(activeSections[0].slug).toBe("active-section");
      expect(activeSections[0].active).toBe(true);
    });
  });

  describe("getSectionBySlug", () => {
    it("should return section by slug", async () => {
      const section = await createSection({
        slug: "test-section",
        title: "Test Section",
        order: 1,
      });

      const foundSection = await getSectionBySlug("test-section");
      expect(foundSection?.slug).toBe("test-section");
      expect(foundSection?.title).toBe("Test Section");
    });

    it("should return undefined for non-existent section", async () => {
      const foundSection = await getSectionBySlug("non-existent");
      expect(foundSection).toBeUndefined();
    });
  });

  describe("createSection", () => {
    it("should create a new section with default values", async () => {
      const input = {
        slug: "new-section",
        title: "New Section",
        order: 1,
      };
      const section = await createSection(input);

      expect(section.slug).toBe("new-section");
      expect(section.title).toBe("New Section");
      expect(section.order).toBe(1);
      expect(section.active).toBe(true);
      expect(section.description).toBeNull();
    });

    it("should create section with description", async () => {
      const input = {
        slug: "section-with-desc",
        title: "Section with Description",
        description: "This is a description",
        order: 1,
      };
      const section = await createSection(input);

      expect(section.description).toBe("This is a description");
    });
  });

  describe("updateSection", () => {
    it("should update section properties", async () => {
      const section = await createSection({
        slug: "update-test",
        title: "Original Title",
        order: 1,
      });

      const updatedSection = await updateSection("update-test", {
        title: "Updated Title",
        description: "New description",
        order: 2,
      });

      expect(updatedSection.slug).toBe("update-test");
      expect(updatedSection.title).toBe("Updated Title");
      expect(updatedSection.description).toBe("New description");
      expect(updatedSection.order).toBe(2);
    });

    it("should throw error when updating non-existent section", async () => {
      await expect(updateSection("non-existent", { title: "Updated" })).rejects.toThrow();
    });
  });

  describe("deactivateSection", () => {
    it("should deactivate a section", async () => {
      const section = await createSection({
        slug: "deactivate-test",
        title: "To be deactivated",
        order: 1,
      });

      const deactivatedSection = await deactivateSection("deactivate-test");

      expect(deactivatedSection.slug).toBe("deactivate-test");
      expect(deactivatedSection.active).toBe(false);
    });

    it("should throw error when deactivating non-existent section", async () => {
      await expect(deactivateSection("non-existent")).rejects.toThrow();
    });
  });

  describe("deleteSection", () => {
    it("should delete an existing section", async () => {
      const section = await createSection({
        slug: "delete-test",
        title: "To be deleted",
        order: 1,
      });

      const deletedSection = await deleteSection("delete-test");

      expect(deletedSection.slug).toBe("delete-test");

      // Verify section is actually deleted
      const sections = await getAllSections();
      expect(sections.find((s) => s.slug === "delete-test")).toBeUndefined();
    });

    it("should throw error when deleting non-existent section", async () => {
      await expect(deleteSection("non-existent")).rejects.toThrow();
    });
  });

  describe("upsertSection", () => {
    it("should create new section when it doesn't exist", async () => {
      const data = {
        slug: "upsert-new",
        title: "Upsert New",
        order: 1,
        active: true,
      };

      const section = await upsertSection(data);

      expect(section.slug).toBe("upsert-new");
      expect(section.title).toBe("Upsert New");
    });

    it("should update existing section when it exists", async () => {
      // Create initial section
      await createSection({
        slug: "upsert-existing",
        title: "Original Title",
        order: 1,
      });

      // Upsert with updated data
      const data = {
        slug: "upsert-existing",
        title: "Updated Title",
        description: "Updated description",
        order: 2,
        active: false,
      };

      const section = await upsertSection(data);

      expect(section.slug).toBe("upsert-existing");
      expect(section.title).toBe("Updated Title");
      expect(section.description).toBe("Updated description");
      expect(section.order).toBe(2);
      expect(section.active).toBe(false);
    });
  });

  describe("CRUD operations integration", () => {
    it("should handle full CRUD lifecycle", async () => {
      // Create
      const section = await createSection({
        slug: "lifecycle-test",
        title: "Lifecycle test",
        order: 1,
      });
      expect(section.title).toBe("Lifecycle test");
      expect(section.active).toBe(true);

      // Read
      const sections = await getAllSections();
      expect(sections.find((s) => s.slug === "lifecycle-test")).toBeDefined();

      // Update
      const updatedSection = await updateSection("lifecycle-test", {
        title: "Updated lifecycle test",
        description: "Updated description",
        order: 2,
      });
      expect(updatedSection.title).toBe("Updated lifecycle test");
      expect(updatedSection.description).toBe("Updated description");
      expect(updatedSection.order).toBe(2);

      // Deactivate
      const deactivatedSection = await deactivateSection("lifecycle-test");
      expect(deactivatedSection.active).toBe(false);

      // Delete
      const deletedSection = await deleteSection("lifecycle-test");
      expect(deletedSection.slug).toBe("lifecycle-test");

      // Verify deletion
      const finalSections = await getAllSections();
      expect(finalSections.find((s) => s.slug === "lifecycle-test")).toBeUndefined();
    });
  });
});

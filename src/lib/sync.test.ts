import { db } from "@/server/db/index.js";
import { migrate } from "@/server/db/migrate.js";
import { beforeEach, describe, expect, it } from "vitest";
import type { Question, Section } from "./config.js";
import {
  syncConfig,
  syncOptions,
  syncQuestions,
  syncSections,
} from "./sync.js";

describe("Sync Functions", () => {
  beforeEach(async () => {
    // Run migrations to set up fresh database
    await migrate();
  });

  it("should sync sections to database", async () => {
    const sections: Section[] = [
      {
        slug: "demographics",
        title: "Demographics",
      },
      {
        slug: "ai-tools",
        title: "AI Tools",
      },
    ];

    await syncSections(sections);

    const result = await db.selectFrom("sections").selectAll().execute();
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe("demographics");
    expect(result[1].slug).toBe("ai-tools");
  });

  it("should sync questions to database", async () => {
    // First create a section
    await db
      .insertInto("sections")
      .values({
        slug: "demographics",
        title: "Demographics",
        active: true,
        order: 0,
      })
      .execute();

    const questions: Question[] = [
      {
        section: "demographics",
        slug: "role",
        title: "What is your role?",
        type: "single",
      },
      {
        section: "demographics",
        slug: "experience",
        title: "How many years of experience?",
        type: "numeric",
      },
    ];

    await syncQuestions(questions);

    const result = await db.selectFrom("questions").selectAll().execute();
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe("role");
    expect(result[1].slug).toBe("experience");
  });

  it("should sync options to database", async () => {
    // First create a section and question
    await db
      .insertInto("sections")
      .values({
        slug: "demographics",
        title: "Demographics",
        active: true,
        order: 0,
      })
      .execute();

    await db
      .insertInto("questions")
      .values({
        slug: "role",
        section_slug: "demographics",
        title: "What is your role?",
        type: "single",
        active: true,
        order: 0,
      })
      .execute();

    const questions: Question[] = [
      {
        section: "demographics",
        slug: "role",
        title: "What is your role?",
        type: "single",
        options: [
          {
            slug: "engineer",
            label: "Software Engineer (Individual contributor)",
          },
          {
            slug: "manager",
            label: "Engineering Manager (Team manager)",
          },
        ],
      },
    ];

    await syncOptions(questions);

    const result = await db.selectFrom("options").selectAll().execute();
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe("role_engineer");
    expect(result[1].slug).toBe("role_manager");
  });

  it("should handle experience questions without options", async () => {
    // First create a section and question
    await db
      .insertInto("sections")
      .values({
        slug: "ai-tools",
        title: "AI Tools",
        active: true,
        order: 0,
      })
      .execute();

    await db
      .insertInto("questions")
      .values({
        slug: "cursor-experience",
        section_slug: "ai-tools",
        title: "What is your experience with Cursor?",
        type: "experience",
        active: true,
        order: 0,
      })
      .execute();

    const questions: Question[] = [
      {
        section: "ai-tools",
        slug: "cursor-experience",
        title: "What is your experience with Cursor?",
        type: "experience",
        // No options - experience questions use preset UI values
      },
    ];

    await syncOptions(questions);

    // Should not create any options for experience questions
    const result = await db.selectFrom("options").selectAll().execute();
    expect(result).toHaveLength(0);
  });

  it("should sync with real config file", async () => {
    await syncConfig();

    // Verify sections were synced
    const sections = await db.selectFrom("sections").selectAll().execute();
    expect(sections.length).toBeGreaterThan(0);

    // Verify questions were synced
    const questions = await db.selectFrom("questions").selectAll().execute();
    expect(questions.length).toBeGreaterThan(0);

    // Verify options were synced
    const options = await db.selectFrom("options").selectAll().execute();
    expect(options.length).toBeGreaterThan(0);
  });

  it("should handle validation errors", async () => {
    // Test with a non-existent config file
    await expect(syncConfig("non-existent-config.yml")).rejects.toThrow(
      "Config file not found",
    );
  });

  it("should export sync functions", async () => {
    const sync = await import("./sync.js");

    expect(sync.syncConfig).toBeDefined();
    expect(sync.syncSections).toBeDefined();
    expect(sync.syncQuestions).toBeDefined();
    expect(sync.syncOptions).toBeDefined();
  });

  it("should sync sections with added_at field", async () => {
    const sections: Section[] = [
      {
        slug: "test-section",
        title: "Test Section",
        added: "2024-01-15",
      },
    ];

    await syncSections(sections);

    const result = await db.selectFrom("sections").selectAll().execute();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("test-section");
    expect(result[0].added_at).toEqual(new Date("2024-01-15"));
  });

  it("should sync questions with randomize and added_at fields", async () => {
    // First create a section
    await db
      .insertInto("sections")
      .values({
        slug: "test-section",
        title: "Test Section",
        active: true,
        order: 0,
      })
      .execute();

    const questions: Question[] = [
      {
        section: "test-section",
        slug: "test-question",
        title: "Test Question",
        type: "single",
        randomize: true,
        added: "2024-01-15",
      },
    ];

    await syncQuestions(questions);

    const result = await db.selectFrom("questions").selectAll().execute();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("test-question");
    expect(result[0].randomize).toBe(true);
    expect(result[0].added_at).toEqual(new Date("2024-01-15"));
  });

  it("should sync options with added_at field", async () => {
    // First create a section and question
    await db
      .insertInto("sections")
      .values({
        slug: "test-section",
        title: "Test Section",
        active: true,
        order: 0,
      })
      .execute();

    await db
      .insertInto("questions")
      .values({
        slug: "test-question",
        section_slug: "test-section",
        title: "Test Question",
        type: "single",
        active: true,
        order: 0,
      })
      .execute();

    const questions: Question[] = [
      {
        section: "test-section",
        slug: "test-question",
        title: "Test Question",
        type: "single",
        options: [
          {
            slug: "option1",
            label: "Option 1",
            added: "2024-01-15",
          },
        ],
      },
    ];

    await syncOptions(questions);

    const result = await db.selectFrom("options").selectAll().execute();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("test-question_option1");
    expect(result[0].added_at).toEqual(new Date("2024-01-15"));
  });

  it("should handle missing added field gracefully", async () => {
    const sections: Section[] = [
      {
        slug: "test-section",
        title: "Test Section",
        // No added field
      },
    ];

    await syncSections(sections);

    const result = await db.selectFrom("sections").selectAll().execute();
    expect(result).toHaveLength(1);
    expect(result[0].added_at).toBeNull();
  });

  describe("Active field syncing", () => {
    it("should sync sections with active: false", async () => {
      const sections: Section[] = [
        {
          slug: "active-section",
          title: "Active Section",
          active: true,
        },
        {
          slug: "inactive-section",
          title: "Inactive Section",
          active: false,
        },
      ];

      await syncSections(sections);

      const result = await db.selectFrom("sections").selectAll().execute();
      expect(result).toHaveLength(2);

      const activeSection = result.find((s) => s.slug === "active-section");
      const inactiveSection = result.find((s) => s.slug === "inactive-section");

      expect(activeSection?.active).toBe(true);
      expect(inactiveSection?.active).toBe(false);
    });

    it("should sync sections with missing active field (defaults to true)", async () => {
      const sections: Section[] = [
        {
          slug: "default-active-section",
          title: "Default Active Section",
          // No active field - should default to true
        },
      ];

      await syncSections(sections);

      const result = await db.selectFrom("sections").selectAll().execute();
      expect(result).toHaveLength(1);
      expect(result[0].active).toBe(true);
    });

    it("should sync questions with active: false", async () => {
      // First create a section
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          active: true,
          order: 0,
        })
        .execute();

      const questions: Question[] = [
        {
          section: "test-section",
          slug: "active-question",
          title: "Active Question",
          type: "single",
          active: true,
        },
        {
          section: "test-section",
          slug: "inactive-question",
          title: "Inactive Question",
          type: "single",
          active: false,
        },
      ];

      await syncQuestions(questions);

      const result = await db.selectFrom("questions").selectAll().execute();
      expect(result).toHaveLength(2);

      const activeQuestion = result.find((q) => q.slug === "active-question");
      const inactiveQuestion = result.find(
        (q) => q.slug === "inactive-question",
      );

      expect(activeQuestion?.active).toBe(true);
      expect(inactiveQuestion?.active).toBe(false);
    });

    it("should sync questions with missing active field (defaults to true)", async () => {
      // First create a section
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          active: true,
          order: 0,
        })
        .execute();

      const questions: Question[] = [
        {
          section: "test-section",
          slug: "default-active-question",
          title: "Default Active Question",
          type: "single",
          // No active field - should default to true
        },
      ];

      await syncQuestions(questions);

      const result = await db.selectFrom("questions").selectAll().execute();
      expect(result).toHaveLength(1);
      expect(result[0].active).toBe(true);
    });

    it("should update existing sections with new active status", async () => {
      // First create a section that's active
      await db
        .insertInto("sections")
        .values({
          slug: "existing-section",
          title: "Existing Section",
          active: true,
          order: 0,
        })
        .execute();

      // Now sync with active: false
      const sections: Section[] = [
        {
          slug: "existing-section",
          title: "Existing Section",
          active: false,
        },
      ];

      await syncSections(sections);

      const result = await db.selectFrom("sections").selectAll().execute();
      expect(result).toHaveLength(1);
      expect(result[0].active).toBe(false);
    });

    it("should update existing questions with new active status", async () => {
      // First create a section and question
      await db
        .insertInto("sections")
        .values({
          slug: "test-section",
          title: "Test Section",
          active: true,
          order: 0,
        })
        .execute();

      await db
        .insertInto("questions")
        .values({
          slug: "existing-question",
          section_slug: "test-section",
          title: "Existing Question",
          type: "single",
          active: true,
          order: 0,
        })
        .execute();

      // Now sync with active: false
      const questions: Question[] = [
        {
          section: "test-section",
          slug: "existing-question",
          title: "Existing Question",
          type: "single",
          active: false,
        },
      ];

      await syncQuestions(questions);

      const result = await db.selectFrom("questions").selectAll().execute();
      expect(result).toHaveLength(1);
      expect(result[0].active).toBe(false);
    });

    it("should sync real config with environment section marked as inactive", async () => {
      await syncConfig();

      const sections = await db.selectFrom("sections").selectAll().execute();
      const environmentSection = sections.find((s) => s.slug === "environment");

      expect(environmentSection).toBeDefined();
      expect(environmentSection?.active).toBe(false);
    });
  });
});

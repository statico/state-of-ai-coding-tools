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
});

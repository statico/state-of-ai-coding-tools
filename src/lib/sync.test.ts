import { db } from "@/server/db/index.js";
import { migrate } from "@/server/db/migrate.js";
import { describe, expect, it, vi } from "vitest";
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
    // Mock console.warn to avoid output during tests
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

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

    consoleSpy.mockRestore();
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
});

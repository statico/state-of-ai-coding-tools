import { db } from "@/server/db/index.js";
import {
  loadConfig,
  validateConfigReferences,
  validateUniqueSlugs,
  type Option,
  type Question,
  type Section,
} from "./config.js";

export async function syncSections(sections: Section[]) {
  // Get existing sections
  const existingSections = await db
    .selectFrom("sections")
    .selectAll()
    .execute();
  const existingSlugs = new Set(existingSections.map((s) => s.slug));

  // Upsert sections from config
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const addedAt = section.added ? new Date(section.added) : null;
    await db
      .insertInto("sections")
      .values({
        slug: section.slug,
        title: section.title,
        description: section.description || null,
        active: true,
        order: i,
        added_at: addedAt,
      })
      .onConflict((oc) =>
        oc.column("slug").doUpdateSet({
          title: section.title,
          description: section.description || null,
          active: true,
          order: i,
          added_at: addedAt,
        }),
      )
      .execute();
  }

  // Mark missing sections as inactive
  const configSlugs = new Set(sections.map((s) => s.slug));
  const missingSections = existingSections.filter(
    (s) => !configSlugs.has(s.slug),
  );

  for (const section of missingSections) {
    await db
      .updateTable("sections")
      .set({ active: false })
      .where("slug", "=", section.slug)
      .execute();
  }

  console.warn(
    `  📊 Processed ${sections.length} sections (${missingSections.length} marked inactive)`,
  );
}

export async function syncQuestions(questions: Question[]) {
  // Get existing questions
  const existingQuestions = await db
    .selectFrom("questions")
    .selectAll()
    .execute();
  const existingSlugs = new Set(existingQuestions.map((q) => q.slug));

  // Upsert questions from config
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const addedAt = question.added ? new Date(question.added) : null;
    await db
      .insertInto("questions")
      .values({
        slug: question.slug,
        section_slug: question.section,
        title: question.title,
        description: question.description || null,
        type: question.type,
        active: true,
        order: i,
        multiple_max: question.multiple_max || null,
        added_at: addedAt,
        randomize: question.randomize || false,
      })
      .onConflict((oc) =>
        oc.column("slug").doUpdateSet({
          section_slug: question.section,
          title: question.title,
          description: question.description || null,
          type: question.type,
          active: true,
          order: i,
          multiple_max: question.multiple_max || null,
          added_at: addedAt,
          randomize: question.randomize || false,
        }),
      )
      .execute();
  }

  // Mark missing questions as inactive
  const configSlugs = new Set(questions.map((q) => q.slug));
  const missingQuestions = existingQuestions.filter(
    (q) => !configSlugs.has(q.slug),
  );

  for (const question of missingQuestions) {
    await db
      .updateTable("questions")
      .set({ active: false })
      .where("slug", "=", question.slug)
      .execute();
  }

  console.warn(
    `  📊 Processed ${questions.length} questions (${missingQuestions.length} marked inactive)`,
  );
}

export async function syncOptions(questions: Question[]) {
  // Get all existing options
  const existingOptions = await db.selectFrom("options").selectAll().execute();
  const existingSlugs = new Set(existingOptions.map((o) => o.slug));

  // Collect all options from config
  const configOptions: Array<
    Option & { question_slug: string; order: number }
  > = [];
  for (const question of questions) {
    if (question.options) {
      for (let i = 0; i < question.options.length; i++) {
        const option = question.options[i];
        configOptions.push({
          ...option,
          question_slug: question.slug,
          order: i,
        });
      }
    }
  }

  // Upsert options from config
  for (const option of configOptions) {
    const optionSlug = `${option.question_slug}_${option.slug}`;
    const addedAt = option.added ? new Date(option.added) : null;
    await db
      .insertInto("options")
      .values({
        slug: optionSlug,
        question_slug: option.question_slug,
        label: option.label,
        description: option.description || null,
        active: true,
        order: option.order,
        added_at: addedAt,
      })
      .onConflict((oc) =>
        oc.column("slug").doUpdateSet({
          question_slug: option.question_slug,
          label: option.label,
          description: option.description || null,
          active: true,
          order: option.order,
          added_at: addedAt,
        }),
      )
      .execute();
  }

  // Mark missing options as inactive
  const configSlugs = new Set(
    configOptions.map((o) => `${o.question_slug}_${o.slug}`),
  );
  const missingOptions = existingOptions.filter(
    (o) => !configSlugs.has(o.slug),
  );

  for (const option of missingOptions) {
    await db
      .updateTable("options")
      .set({ active: false })
      .where("slug", "=", option.slug)
      .execute();
  }

  console.warn(
    `  📊 Processed ${configOptions.length} options (${missingOptions.length} marked inactive)`,
  );
}

export async function syncConfig(configPath?: string) {
  console.warn("🔄 Starting config synchronization...");

  try {
    // Load and validate config
    console.warn("📋 Loading and validating config.yml...");
    const config = loadConfig(configPath);
    validateConfigReferences(config);
    validateUniqueSlugs(config);
    console.warn("✅ Config validation passed");

    // Sync sections
    console.warn("📝 Synchronizing sections...");
    await syncSections(config.sections);

    // Sync questions
    console.warn("❓ Synchronizing questions...");
    await syncQuestions(config.questions);

    // Sync options
    console.warn("🔘 Synchronizing options...");
    await syncOptions(config.questions);

    console.warn("✅ Config synchronization completed successfully!");
  } catch (error) {
    console.error("❌ Config synchronization failed:");
    console.error(error instanceof Error ? error.message : error);
    throw error;
  }
}

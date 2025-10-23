#!/usr/bin/env tsx

import { loadConfig } from "@/lib/config";
import type { QuestionWithOptions } from "@/lib/constants";
import { upsertOption } from "@/lib/models/options";
import { upsertQuestion } from "@/lib/models/questions";
import { upsertSection } from "@/lib/models/sections";
import { db } from "@/server/db";
import { Logger } from "@/server/logging";
import { faker } from "@faker-js/faker";
import { getISOWeek, getISOWeekYear, subWeeks } from "date-fns";

const log = Logger.forModule();

// Set seed for consistent results
faker.seed(12345);

// Helper function to generate random weights for options
function generateOptionWeights(
  options: Array<{ slug: string; label: string }>,
): Array<{ slug: string; weight: number }> {
  // Generate completely random weights
  const weights = options.map(() => faker.number.float({ min: 0.1, max: 1.0 }));

  // Normalize weights to sum to 1
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const normalizedWeights = weights.map((w) => w / totalWeight);

  return options.map((option, index) => ({
    slug: option.slug,
    weight: normalizedWeights[index],
  }));
}

// Helper function to select weighted random option
function selectWeighted<T extends { weight: number }>(options: T[]): T {
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  let random = faker.number.float({ min: 0, max: totalWeight });

  for (const option of options) {
    random -= option.weight;
    if (random <= 0) {
      return option;
    }
  }

  return options[options.length - 1];
}

// Helper function to select multiple weighted options
function selectMultipleWeighted<T extends { weight: number; slug: string }>(
  options: T[],
  maxSelections: number,
): T[] {
  const selected: T[] = [];
  const remaining = [...options];

  for (let i = 0; i < maxSelections && remaining.length > 0; i++) {
    const selectedOption = selectWeighted(remaining);
    selected.push(selectedOption);
    remaining.splice(remaining.indexOf(selectedOption), 1);
  }

  return selected;
}

// Generate random experience responses
function generateExperienceResponse(): {
  awareness: number;
  sentiment: number;
} {
  const awareness = faker.number.int({ min: 0, max: 2 }); // 0: Never heard, 1: Heard of it, 2: Used it
  let sentiment: number;

  if (awareness === 0 || awareness === 1) {
    // For "Never heard" or "Heard of it", use interest values (1 or -1)
    sentiment = faker.datatype.boolean() ? 1 : -1;
  } else {
    // For "Used it", use sentiment values (1 or -1)
    sentiment = faker.datatype.boolean() ? 1 : -1;
  }

  return {
    awareness,
    sentiment,
  };
}

// Generate random numeric responses
function generateNumericResponse(): number {
  return faker.number.int({ min: 1, max: 20 });
}

// Generate random freeform responses
function generateFreeformResponse(): string {
  return faker.lorem.sentence({ min: 5, max: 15 });
}

// Generate random write-in responses (only 1 in 30 users)
function generateWriteInResponse(): string {
  return faker.lorem.sentence({ min: 3, max: 10 });
}

// Generate responses for a single user for a specific week
function generateUserResponses(
  sessionId: string,
  week: number,
  year: number,
  questions: QuestionWithOptions[],
): any[] {
  const responses: any[] = [];

  for (const question of questions) {
    // Skip some questions occasionally (5% chance)
    if (faker.number.float() < 0.05) {
      responses.push({
        session_id: sessionId,
        iso_week: week,
        iso_year: year,
        question_slug: question.slug,
        skipped: true as const,
      });
      continue;
    }

    const response: any = {
      session_id: sessionId,
      iso_week: week,
      iso_year: year,
      question_slug: question.slug,
      skipped: false,
    };

    switch (question.type) {
      case "single":
        if (question.options) {
          const weightedOptions = generateOptionWeights(question.options);
          const selectedOption = selectWeighted(weightedOptions);
          response.single_option_slug = `${question.slug}-${selectedOption.slug}`;

          // 1 in 30 chance for write-in response
          if (faker.number.int({ min: 1, max: 30 }) === 1) {
            response.single_writein_response = generateWriteInResponse();
          }
        }
        break;

      case "multiple":
        if (question.options) {
          const maxSelections = question.multiple_max || 3;
          const weightedOptions = generateOptionWeights(question.options);
          const selectedOptions = selectMultipleWeighted(
            weightedOptions,
            maxSelections,
          );
          response.multiple_option_slugs = selectedOptions.map(
            (opt) => `${question.slug}-${opt.slug}`,
          );

          // 1 in 30 chance for write-in responses
          if (faker.number.int({ min: 1, max: 30 }) === 1) {
            response.multiple_writein_responses = [generateWriteInResponse()];
          }
        }
        break;

      case "experience":
        const experience = generateExperienceResponse();
        response.experience_awareness = experience.awareness;
        response.experience_sentiment = experience.sentiment;
        break;

      case "numeric":
        response.numeric_response = generateNumericResponse();
        break;

      case "single-freeform":
        if (question.options) {
          const weightedOptions = generateOptionWeights(question.options);
          const selectedOption = selectWeighted(weightedOptions);
          response.single_option_slug = `${question.slug}-${selectedOption.slug}`;

          // 1 in 30 chance for write-in response
          if (faker.number.int({ min: 1, max: 30 }) === 1) {
            response.single_writein_response = generateWriteInResponse();
          }
        }
        break;

      case "multiple-freeform":
        if (question.options) {
          const weightedOptions = generateOptionWeights(question.options);
          const selectedOptions = selectMultipleWeighted(weightedOptions, 2);
          response.multiple_option_slugs = selectedOptions.map(
            (opt) => `${question.slug}-${opt.slug}`,
          );

          // 1 in 30 chance for write-in responses
          if (faker.number.int({ min: 1, max: 30 }) === 1) {
            response.multiple_writein_responses = [generateWriteInResponse()];
          }
        }
        break;

      case "freeform":
        response.freeform_response = generateFreeformResponse();
        break;
    }

    // Add occasional comments (10% chance)
    if (faker.number.float() < 0.1) {
      response.comment = faker.lorem.sentence({ min: 3, max: 8 });
    }

    responses.push(response);
  }

  return responses;
}

async function seedTestData() {
  log.info("🌱 Starting test data seeding...");

  try {
    // Load configuration
    const config = loadConfig();
    log.info(
      `📋 Loaded config with ${config.sections.length} sections and ${config.questions.length} questions`,
    );

    // Clear existing data
    log.info("🧹 Clearing existing data...");
    await db.deleteFrom("responses").execute();
    await db.deleteFrom("sessions").execute();
    await db.deleteFrom("options").execute();
    await db.deleteFrom("questions").execute();
    await db.deleteFrom("sections").execute();

    // Insert sections and questions from config
    log.info("📝 Inserting sections and questions...");

    // Insert sections using model functions
    for (const [index, section] of config.sections.entries()) {
      await upsertSection({
        slug: section.slug,
        title: section.title,
        description: section.description || null,
        active: true,
        order: index + 1,
        added_at: section.added ? new Date(section.added) : null,
      });
    }

    // Insert questions using model functions
    for (const [index, question] of config.questions.entries()) {
      await upsertQuestion({
        slug: question.slug,
        section_slug: question.section,
        title: question.title,
        description: question.description || null,
        type: question.type,
        active: true,
        order: index + 1,
        multiple_max: question.multiple_max || null,
        added_at: question.added ? new Date(question.added) : null,
        randomize: question.randomize || false,
      });
    }

    // Insert options using model functions
    for (const question of config.questions) {
      if (question.options) {
        for (const [optionIndex, option] of question.options.entries()) {
          await upsertOption({
            slug: `${question.slug}-${option.slug}`, // Make option slugs unique
            question_slug: question.slug,
            label: option.label,
            description: option.description || null,
            active: true,
            order: optionIndex + 1,
            added_at: option.added ? new Date(option.added) : null,
          });
        }
      }
    }

    // Generate sessions and responses
    const sessions: Array<{ id: string; created_at: Date; updated_at: Date }> =
      [];
    const allResponses: any[] = [];

    // Generate 4 weeks of data
    const currentDate = new Date();
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekDate = subWeeks(currentDate, i);
      weeks.push({
        week: getISOWeek(weekDate),
        year: getISOWeekYear(weekDate),
      });
    }

    log.info(
      `📅 Generating data for weeks: ${weeks.map((w) => `${w.year}-W${w.week}`).join(", ")}`,
    );

    // Generate 100 users
    for (let userId = 1; userId <= 100; userId++) {
      const sessionId = faker.string.uuid();
      const createdAt = faker.date.recent({ days: 30 });

      sessions.push({
        id: sessionId,
        created_at: createdAt,
        updated_at: createdAt,
      });

      // Generate responses for each week
      for (const { week, year } of weeks) {
        const userResponses = generateUserResponses(
          sessionId,
          week,
          year,
          config.questions.map((q) => ({
            slug: q.slug,
            title: q.title,
            description: q.description,
            type: q.type,
            order: 0, // Default order, will be set properly by the model
            section_slug: q.section,
            multiple_max: q.multiple_max,
            randomize: q.randomize || false,
            active: true,
            options: q.options?.map((opt) => ({
              slug: opt.slug,
              label: opt.label,
              description: opt.description,
              order: 0, // Default order, will be set properly by the model
              question_slug: q.slug,
              active: true,
            })),
          })) as QuestionWithOptions[],
        );
        allResponses.push(...userResponses);
      }

      if (userId % 20 === 0) {
        log.info(`👤 Generated data for ${userId} users...`);
      }
    }

    // Batch insert sessions
    log.info("💾 Inserting sessions...");
    await db.insertInto("sessions").values(sessions).execute();

    // Batch insert responses (in chunks to avoid memory issues)
    log.info("💾 Inserting responses...");
    const chunkSize = 1000;
    for (let i = 0; i < allResponses.length; i += chunkSize) {
      const chunk = allResponses.slice(i, i + chunkSize);
      await db.insertInto("responses").values(chunk).execute();

      if (i % (chunkSize * 5) === 0) {
        log.info(
          `📊 Inserted ${Math.min(i + chunkSize, allResponses.length)} responses...`,
        );
      }
    }

    log.info("✅ Test data seeding completed!");
    log.info(
      `📈 Generated ${sessions.length} sessions with ${allResponses.length} responses`,
    );
    log.info(
      `📊 Average responses per user: ${Math.round(allResponses.length / sessions.length)}`,
    );
  } catch (error) {
    log.error("❌ Error seeding test data:", error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTestData();
}

import { readFileSync } from "fs";
import yaml from "js-yaml";
import { join } from "path";
import { z } from "zod";

// Question type constants
export const QuestionTypes = {
  single: "Single choice",
  multiple: "Multiple choice",
  experience: "Experience",
  numeric: "Numeric response",
  "single-freeform": "Single write-in response",
  "multiple-freeform": "Multiple write-in responses",
  freeform: "Free-form text input",
} as const;

export type QuestionType = keyof typeof QuestionTypes;

// Zod schemas for YAML validation with custom error messages
export const OptionSchema = z.object({
  slug: z.string().min(1, "Option slug cannot be empty"),
  label: z.string().min(1, "Option label cannot be empty"),
  description: z.string().optional(),
});

export const QuestionSchema = z.object({
  section: z.string().min(1, "Question section cannot be empty"),
  slug: z.string().min(1, "Question slug cannot be empty"),
  title: z.string().min(1, "Question title cannot be empty"),
  description: z.string().optional(),
  type: z.enum(
    Object.keys(QuestionTypes) as [QuestionType, ...QuestionType[]],
    {
      message: `Question type must be one of: ${Object.keys(QuestionTypes).join(", ")}`,
    },
  ),
  options: z.array(OptionSchema).optional(),
  multiple_max: z
    .number()
    .int()
    .positive("multiple_max must be a positive integer")
    .optional(),
});

export const SectionSchema = z.object({
  slug: z.string().min(1, "Section slug cannot be empty"),
  title: z.string().min(1, "Section title cannot be empty"),
  description: z.string().optional(),
});

export const ConfigSchema = z.object({
  sections: z.array(SectionSchema).min(1, "At least one section is required"),
  questions: z
    .array(QuestionSchema)
    .min(1, "At least one question is required"),
});

export type Config = z.infer<typeof ConfigSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Option = z.infer<typeof OptionSchema>;

export function loadConfig(configPath?: string): Config {
  const path = configPath || join(process.cwd(), "config.yml");

  try {
    const fileContent = readFileSync(path, "utf8");
    const yamlData = yaml.load(fileContent);

    // Validate the YAML data against our schema using safeParse
    const result = ConfigSchema.safeParse(yamlData);

    if (!result.success) {
      console.error("❌ Config validation failed:");
      console.error("");

      // Group errors by path for better readability
      const errorsByPath = new Map<string, string[]>();

      result.error.issues.forEach((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "root";
        const message = issue.message;

        if (!errorsByPath.has(path)) {
          errorsByPath.set(path, []);
        }
        errorsByPath.get(path)!.push(message);
      });

      // Display errors in a clean format
      errorsByPath.forEach((messages, path) => {
        console.error(`  📍 ${path}:`);
        messages.forEach((message) => {
          console.error(`    • ${message}`);
        });
        console.error("");
      });

      throw new Error("Invalid config.yml structure");
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error && error.message.includes("ENOENT")) {
      throw new Error(`Config file not found: ${path}`);
    }

    throw error;
  }
}

export function validateConfigReferences(config: Config): void {
  const sectionSlugs = new Set(config.sections.map((s) => s.slug));

  for (const question of config.questions) {
    if (!sectionSlugs.has(question.section)) {
      throw new Error(
        `Question "${question.slug}" references non-existent section "${question.section}"`,
      );
    }
  }
}

export function validateUniqueSlugs(config: Config): void {
  const sectionSlugs = config.sections.map((s) => s.slug);
  const questionSlugs = config.questions.map((q) => q.slug);

  // Check for duplicate section slugs
  const duplicateSections = sectionSlugs.filter(
    (slug, index) => sectionSlugs.indexOf(slug) !== index,
  );
  if (duplicateSections.length > 0) {
    throw new Error(
      `Duplicate section slugs found: ${duplicateSections.join(", ")}`,
    );
  }

  // Check for duplicate question slugs
  const duplicateQuestions = questionSlugs.filter(
    (slug, index) => questionSlugs.indexOf(slug) !== index,
  );
  if (duplicateQuestions.length > 0) {
    throw new Error(
      `Duplicate question slugs found: ${duplicateQuestions.join(", ")}`,
    );
  }

  // Check for duplicate option slugs within each question
  for (const question of config.questions) {
    if (question.options) {
      const optionSlugs = question.options.map((o) => o.slug);
      const duplicateOptions = optionSlugs.filter(
        (slug, index) => optionSlugs.indexOf(slug) !== index,
      );
      if (duplicateOptions.length > 0) {
        throw new Error(
          `Duplicate option slugs found in question "${question.slug}": ${duplicateOptions.join(", ")}`,
        );
      }
    }
  }
}

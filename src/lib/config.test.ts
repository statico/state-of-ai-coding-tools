import { readFileSync } from "fs";
import yaml from "js-yaml";
import { describe, expect, it, vi } from "vitest";
import {
  ConfigSchema,
  loadConfig,
  validateConfigReferences,
  validateUniqueSlugs,
  type Config,
} from "./config";

// Mock fs module
vi.mock("fs", () => ({
  readFileSync: vi.fn(),
}));

// Mock js-yaml
vi.mock("js-yaml", () => ({
  default: {
    load: vi.fn(),
  },
}));

describe("Config Validation", () => {
  const mockReadFileSync = vi.mocked(readFileSync);
  const mockYamlLoad = vi.mocked(yaml.load);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loadConfig", () => {
    it("should load and validate a valid config", () => {
      const validConfig = {
        sections: [
          {
            slug: "demographics",
            title: "Demographics",
          },
        ],
        questions: [
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
            ],
          },
        ],
      };

      mockReadFileSync.mockReturnValue("mock yaml content");
      mockYamlLoad.mockReturnValue(validConfig);

      const result = loadConfig();
      expect(result).toEqual(validConfig);
    });

    it("should throw error for missing config file", () => {
      mockReadFileSync.mockImplementation(() => {
        const error = new Error("ENOENT: no such file or directory");
        (error as any).code = "ENOENT";
        throw error;
      });

      expect(() => loadConfig("nonexistent.yml")).toThrow(
        "Config file not found: nonexistent.yml",
      );
    });

    it("should throw error for invalid YAML structure", () => {
      const invalidConfig = {
        sections: [], // Empty sections should fail
        questions: [],
      };

      mockReadFileSync.mockReturnValue("mock yaml content");
      mockYamlLoad.mockReturnValue(invalidConfig);

      expect(() => loadConfig()).toThrow("Invalid config.yml structure");
    });

    it("should display readable validation errors", () => {
      const invalidConfig = {
        sections: [
          {
            slug: "", // Empty slug
            title: "", // Empty title
          },
        ],
        questions: [
          {
            section: "test",
            slug: "", // Empty slug
            title: "Test Question",
            type: "invalid-type", // Invalid type
            multiple_max: -5, // Negative number
          },
        ],
      };

      mockReadFileSync.mockReturnValue("mock yaml content");
      mockYamlLoad.mockReturnValue(invalidConfig);

      // Capture console.error calls
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => loadConfig()).toThrow("Invalid config.yml structure");

      // Verify that readable error messages were displayed
      expect(consoleSpy).toHaveBeenCalledWith("❌ Config validation failed:");
      expect(consoleSpy).toHaveBeenCalledWith("");
      expect(consoleSpy).toHaveBeenCalledWith("  📍 sections.0.slug:");
      expect(consoleSpy).toHaveBeenCalledWith(
        "    • Section slug cannot be empty",
      );
      expect(consoleSpy).toHaveBeenCalledWith("  📍 sections.0.title:");
      expect(consoleSpy).toHaveBeenCalledWith(
        "    • Section title cannot be empty",
      );

      consoleSpy.mockRestore();
    });
  });

  describe("validateConfigReferences", () => {
    it("should pass for valid references", () => {
      const validConfig: Config = {
        sections: [
          {
            slug: "demographics",
            title: "Demographics",
          },
        ],
        questions: [
          {
            section: "demographics",
            slug: "role",
            title: "What is your role?",
            type: "single",
          },
        ],
      };

      expect(() => validateConfigReferences(validConfig)).not.toThrow();
    });

    it("should throw error for invalid section reference", () => {
      const invalidConfig: Config = {
        sections: [
          {
            slug: "demographics",
            title: "Demographics",
          },
        ],
        questions: [
          {
            section: "nonexistent",
            slug: "role",
            title: "What is your role?",
            type: "single",
          },
        ],
      };

      expect(() => validateConfigReferences(invalidConfig)).toThrow(
        'Question "role" references non-existent section "nonexistent"',
      );
    });
  });

  describe("validateUniqueSlugs", () => {
    it("should pass for unique slugs", () => {
      const validConfig: Config = {
        sections: [
          {
            slug: "section1",
            title: "Section 1",
          },
          {
            slug: "section2",
            title: "Section 2",
          },
        ],
        questions: [
          {
            section: "section1",
            slug: "question1",
            title: "Question 1",
            type: "single",
          },
          {
            section: "section2",
            slug: "question2",
            title: "Question 2",
            type: "multiple",
          },
        ],
      };

      expect(() => validateUniqueSlugs(validConfig)).not.toThrow();
    });

    it("should throw error for duplicate section slugs", () => {
      const invalidConfig: Config = {
        sections: [
          {
            slug: "duplicate",
            title: "Section 1",
          },
          {
            slug: "duplicate",
            title: "Section 2",
          },
        ],
        questions: [],
      };

      expect(() => validateUniqueSlugs(invalidConfig)).toThrow(
        "Duplicate section slugs found: duplicate",
      );
    });

    it("should throw error for duplicate question slugs", () => {
      const invalidConfig: Config = {
        sections: [
          {
            slug: "section1",
            title: "Section 1",
          },
        ],
        questions: [
          {
            section: "section1",
            slug: "duplicate",
            title: "Question 1",
            type: "single",
          },
          {
            section: "section1",
            slug: "duplicate",
            title: "Question 2",
            type: "multiple",
          },
        ],
      };

      expect(() => validateUniqueSlugs(invalidConfig)).toThrow(
        "Duplicate question slugs found: duplicate",
      );
    });

    it("should throw error for duplicate option slugs within a question", () => {
      const invalidConfig: Config = {
        sections: [
          {
            slug: "section1",
            title: "Section 1",
          },
        ],
        questions: [
          {
            section: "section1",
            slug: "question1",
            title: "Question 1",
            type: "single",
            options: [
              {
                slug: "duplicate",
                label: "Option 1",
              },
              {
                slug: "duplicate",
                label: "Option 2",
              },
            ],
          },
        ],
      };

      expect(() => validateUniqueSlugs(invalidConfig)).toThrow(
        'Duplicate option slugs found in question "question1": duplicate',
      );
    });
  });

  describe("ConfigSchema validation", () => {
    it("should validate complete config with all question types", () => {
      const completeConfig = {
        sections: [
          {
            slug: "demographics",
            title: "Demographics",
          },
          {
            slug: "ai-tools",
            title: "AI Coding Tools",
          },
        ],
        questions: [
          {
            section: "demographics",
            slug: "role",
            title: "What is your primary role?",
            type: "single",
            options: [
              {
                slug: "software-engineer",
                label: "Software Engineer (Individual contributor)",
              },
              {
                slug: "engineering-manager",
                label: "Engineering Manager (Managing teams)",
              },
            ],
          },
          {
            section: "demographics",
            slug: "experience-years",
            title:
              "How many years of professional software development experience do you have?",
            type: "numeric",
          },
          {
            section: "ai-tools",
            slug: "primary-ai-tool",
            title: "What is your primary AI coding assistant?",
            type: "multiple",
            multiple_max: 3,
            options: [
              {
                slug: "github-copilot",
                label: "GitHub Copilot",
              },
              {
                slug: "cursor",
                label: "Cursor (AI-powered editor)",
              },
            ],
          },
          {
            section: "ai-tools",
            slug: "cursor-experience",
            title: "What is your experience with Cursor?",
            type: "experience",
            options: [
              {
                slug: "never-heard",
                label: "Never heard of it",
              },
              {
                slug: "heard-of",
                label: "Heard of it (but haven't used)",
              },
            ],
          },
          {
            section: "ai-tools",
            slug: "ai-feedback",
            title: "What would you like to see improved in AI coding tools?",
            type: "freeform",
          },
          {
            section: "ai-tools",
            slug: "write-in-tools",
            title: "What other AI coding tools do you use?",
            type: "single-freeform",
            options: [
              {
                slug: "other",
                label: "Other (specify below)",
              },
            ],
          },
        ],
      };

      const result = ConfigSchema.safeParse(completeConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(completeConfig);
      }
    });

    it("should reject config with missing required fields", () => {
      const incompleteConfig = {
        sections: [
          {
            slug: "", // Empty slug
            title: "", // Empty title
          },
        ],
        questions: [
          {
            section: "", // Empty section
            slug: "", // Empty slug
            title: "", // Empty title
            type: "invalid-type", // Invalid type
            multiple_max: -1, // Invalid number
          },
        ],
      };

      const result = ConfigSchema.safeParse(incompleteConfig);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(6); // Should have at least 6 validation errors
      }
    });

    it("should reject config with empty arrays", () => {
      const emptyConfig = {
        sections: [],
        questions: [],
      };

      const result = ConfigSchema.safeParse(emptyConfig);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.path.join(".") === "sections" &&
              issue.message === "At least one section is required",
          ),
        ).toBe(true);
        expect(
          result.error.issues.some(
            (issue) =>
              issue.path.join(".") === "questions" &&
              issue.message === "At least one question is required",
          ),
        ).toBe(true);
      }
    });

    it("should support descriptions when provided", () => {
      const configWithDescriptions = {
        sections: [
          {
            slug: "test",
            title: "Test Section",
            description: "Test section description",
          },
        ],
        questions: [
          {
            section: "test",
            slug: "test-question",
            title: "Test Question",
            description: "Test question description",
            type: "single",
            options: [
              {
                slug: "test-option",
                label: "Test Option",
                description: "Test option description",
              },
            ],
          },
        ],
      };

      const result = ConfigSchema.safeParse(configWithDescriptions);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(configWithDescriptions);
      }
    });
  });
});

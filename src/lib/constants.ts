// Import Selectable types from model files
import { SelectableOption } from "@/lib/models/options";
import { SelectableQuestion } from "@/lib/models/questions";
import { SelectableResponse } from "@/lib/models/responses";
import { SelectableSection } from "@/lib/models/sections";

// Create Client types that only include fields actually used by components
export type ClientOption = Pick<
  SelectableOption,
  "slug" | "label" | "description" | "order" | "question_slug" | "active"
>;
export type ClientQuestion = Pick<
  SelectableQuestion,
  | "slug"
  | "title"
  | "description"
  | "type"
  | "order"
  | "section_slug"
  | "multiple_max"
  | "randomize"
  | "active"
>;
export type ClientSection = Pick<
  SelectableSection,
  "slug" | "title" | "description" | "order" | "active"
>;

// ClientResponse needs special handling for numeric_response
export type ClientResponse = Omit<SelectableResponse, "numeric_response"> & {
  numeric_response?: string | number | null;
};

// Question types enum
export const QUESTION_TYPES = {
  SINGLE: "single",
  MULTIPLE: "multiple",
  EXPERIENCE: "experience",
  NUMERIC: "numeric",
  SINGLE_FREEFORM: "single-freeform",
  MULTIPLE_FREEFORM: "multiple-freeform",
  FREEFORM: "freeform",
} as const;

export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

// Experience question constants
export const AWARENESS_OPTIONS = [
  { value: 0, label: "Never heard of it" },
  { value: 1, label: "Heard of it" },
  { value: 2, label: "Used it" },
] as const;

export const SENTIMENT_OPTIONS = [
  { value: -1, label: "Negative experience" },
  { value: 1, label: "Positive experience" },
] as const;

export const INTEREST_OPTIONS = [
  { value: -1, label: "Not interested" },
  { value: 1, label: "Interested" },
] as const;

// Type guards
export function isQuestionType(type: string): type is QuestionType {
  return Object.values(QUESTION_TYPES).includes(type as QuestionType);
}

// Helper types for components
export interface QuestionWithOptions extends ClientQuestion {
  options: ClientOption[];
}

export interface ResponseData {
  skipped?: boolean;
  singleOptionSlug?: string;
  singleWriteinResponse?: string;
  multipleOptionSlugs?: string[];
  multipleWriteinResponses?: string[];
  experienceAwareness?: number;
  experienceSentiment?: number;
  freeformResponse?: string;
  numericResponse?: number;
  comment?: string;
}

// Simple types for seed scripts
export interface SimpleOption {
  slug: string;
  label: string;
  description?: string;
  order: number;
  added?: string;
}

export interface SimpleQuestion {
  slug: string;
  title: string;
  description?: string;
  type: string;
  section: string;
  order: number;
  options?: SimpleOption[];
  multiple_max?: number;
  added?: string;
  randomize?: boolean;
}

// Client-side types for components
export interface ClientOption {
  slug: string;
  label: string;
  description?: string | null;
  order: number;
  question_slug: string;
  active: boolean;
}

export interface ClientQuestion {
  slug: string;
  title: string;
  description?: string | null;
  type: string;
  order: number;
  section_slug: string;
  multiple_max?: number | null;
  randomize: boolean;
  active: boolean;
}

export interface ClientSection {
  slug: string;
  title: string;
  description?: string | null;
  order: number;
  active: boolean;
}

export interface ClientResponse {
  question_slug: string;
  session_id: string;
  iso_week: number;
  iso_year: number;
  skipped: boolean;
  single_option_slug?: string | null;
  single_writein_response?: string | null;
  multiple_option_slugs?: string[] | null;
  multiple_writein_responses?: string[] | null;
  experience_awareness?: number | null;
  experience_sentiment?: number | null;
  freeform_response?: string | null;
  numeric_response?: string | number | null;
  comment?: string | null;
}

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

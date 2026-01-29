import { AWARENESS_OPTIONS, SENTIMENT_OPTIONS } from "@/lib/constants";
import { getCurrentMonth } from "@/lib/utils";
import { db } from "@/server/db";

export interface MonthSummary {
  month: number;
  year: number;
  totalResponses: number;
  uniqueSessions: number;
  questions: QuestionReport[];
}

export interface QuestionReport {
  questionSlug: string;
  questionTitle: string;
  questionType: string;
  questionDescription?: string | null;
  multipleMax?: number | null;
  randomize?: boolean;
  totalResponses: number;
  skippedResponses: number;
  data: any; // Type depends on question type
  comments?: Array<{
    comment: string;
    sessionId: string;
  }>;
}

export interface SingleChoiceData {
  options: Array<{
    optionSlug: string;
    label: string;
    description?: string;
    count: number;
    percentage: number;
    order: number;
  }>;
  writeIns: Array<{
    response: string;
    count: number;
  }>;
}

export interface MultipleChoiceData {
  options: Array<{
    optionSlug: string;
    label: string;
    description?: string;
    count: number;
    percentage: number;
    order: number;
  }>;
  writeIns: Array<{
    response: string;
    count: number;
  }>;
}

export interface ExperienceData {
  options: Array<{
    optionSlug: string;
    label: string;
    description?: string;
    order: number;
    awareness: Array<{
      level: number;
      label: string;
      count: number;
      percentage: number;
    }>;
    sentiment: Array<{
      level: number;
      label: string;
      count: number;
      percentage: number;
    }>;
    combined: Array<{
      awareness: number;
      sentiment: number;
      count: number;
    }>;
  }>;
}

export interface NumericData {
  summary: {
    mean: number;
    median: number;
    min: number;
    max: number;
    count: number;
  };
  distribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

export interface FreeformData {
  responses: Array<{
    response: string;
    count: number;
  }>;
  totalCount: number;
}

/**
 * Get all months that have response data
 */
export async function getAvailableMonths(): Promise<Array<{ month: number; year: number }>> {
  const months = await db
    .selectFrom("responses")
    .select(["month", "year"])
    .groupBy(["month", "year"])
    .orderBy("year", "asc")
    .orderBy("month", "asc")
    .execute();

  return months.map((m) => ({ month: m.month, year: m.year }));
}

/**
 * Get the first month with response data
 */
export async function getFirstResponseMonth(): Promise<{
  month: number;
  year: number;
} | null> {
  const firstMonth = await db
    .selectFrom("responses")
    .select(["month", "year"])
    .orderBy("year", "asc")
    .orderBy("month", "asc")
    .limit(1)
    .executeTakeFirst();

  return firstMonth ? { month: firstMonth.month, year: firstMonth.year } : null;
}

/**
 * Get all months from first response to current month
 */
export async function getAllMonthsSinceStart(): Promise<Array<{ month: number; year: number }>> {
  const firstMonth = await getFirstResponseMonth();
  if (!firstMonth) return [];

  const current = getCurrentMonth();
  const months: Array<{ month: number; year: number }> = [];

  let currentMonth = firstMonth;
  while (
    currentMonth.year < current.year ||
    (currentMonth.year === current.year && currentMonth.month <= current.month)
  ) {
    months.push({ ...currentMonth });

    // Move to next month
    if (currentMonth.month === 12) {
      currentMonth = { month: 1, year: currentMonth.year + 1 };
    } else {
      currentMonth = {
        month: currentMonth.month + 1,
        year: currentMonth.year,
      };
    }
  }

  return months;
}

/**
 * Get aggregated data for a specific month
 */
export async function getMonthSummary(month: number, year: number): Promise<MonthSummary> {
  // Get total responses and unique sessions for the month
  const responseStats = await db
    .selectFrom("responses")
    .select([
      (eb) => eb.fn.countAll().as("totalResponses"),
      (eb) => eb.fn.count("session_id").distinct().as("uniqueSessions"),
    ])
    .where("month", "=", month)
    .where("year", "=", year)
    .executeTakeFirst();

  // Get all questions with their aggregated data
  // Only include questions from active sections
  const questions = await db
    .selectFrom("questions")
    .innerJoin("sections", "questions.section_slug", "sections.slug")
    .selectAll("questions")
    .where("questions.active", "=", true)
    .where("sections.active", "=", true)
    .orderBy("questions.order", "asc")
    .execute();

  const questionReports: QuestionReport[] = [];

  for (const question of questions) {
    const report = await getQuestionReport(question.slug, month, year);
    if (report) {
      const comments = await getQuestionComments(question.slug, month, year);
      questionReports.push({
        questionSlug: question.slug,
        questionTitle: question.title,
        questionType: question.type,
        questionDescription: question.description,
        multipleMax: question.multiple_max,
        randomize: question.randomize,
        totalResponses: report.totalResponses,
        skippedResponses: report.skippedResponses,
        data: report.data,
        comments,
      });
    }
  }

  return {
    month,
    year,
    totalResponses: Number(responseStats?.totalResponses || 0),
    uniqueSessions: Number(responseStats?.uniqueSessions || 0),
    questions: questionReports,
  };
}

/**
 * Get aggregated data for a specific question in a specific month
 */
export async function getQuestionReport(
  questionSlug: string,
  month: number,
  year: number,
): Promise<{
  totalResponses: number;
  skippedResponses: number;
  data: any;
} | null> {
  const question = await db
    .selectFrom("questions")
    .innerJoin("sections", "questions.section_slug", "sections.slug")
    .selectAll("questions")
    .where("questions.slug", "=", questionSlug)
    .where("questions.active", "=", true)
    .where("sections.active", "=", true)
    .executeTakeFirst();

  if (!question) return null;

  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("month", "=", month)
    .where("year", "=", year)
    .execute();

  // For experience questions, count unique sessions instead of individual responses
  // since each session can have multiple responses (one per option)
  let totalResponses: number;
  let skippedResponses: number;

  if (question.type === "experience") {
    const uniqueSessions = new Set(responses.map((r) => r.session_id));
    totalResponses = uniqueSessions.size;
    const skippedSessions = new Set(responses.filter((r) => r.skipped).map((r) => r.session_id));
    skippedResponses = skippedSessions.size;
  } else {
    totalResponses = responses.length;
    skippedResponses = responses.filter((r) => r.skipped).length;
  }

  let data: any;

  switch (question.type) {
    case "single":
      data = await aggregateSingleChoiceQuestion(questionSlug, month, year);
      break;
    case "multiple":
      data = await aggregateMultipleChoiceQuestion(questionSlug, month, year);
      break;
    case "experience":
      data = await aggregateExperienceQuestion(questionSlug, month, year);
      break;
    case "numeric":
      data = await aggregateNumericQuestion(questionSlug, month, year);
      break;
    case "freeform":
    case "single-freeform":
    case "multiple-freeform":
      data = await aggregateFreeformQuestion(questionSlug, month, year);
      break;
    default:
      data = null;
  }

  return {
    totalResponses,
    skippedResponses,
    data,
  };
}

/**
 * Aggregate single choice question responses
 */
async function aggregateSingleChoiceQuestion(
  questionSlug: string,
  month: number,
  year: number,
): Promise<SingleChoiceData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("skipped", "=", false)
    .execute();

  // Get options for this question
  const options = await db
    .selectFrom("options")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("active", "=", true)
    .orderBy("order", "asc")
    .execute();

  const optionCounts = new Map<string, number>();
  const writeInCounts = new Map<string, number>();

  for (const response of responses) {
    if (response.single_option_slug) {
      optionCounts.set(
        response.single_option_slug,
        (optionCounts.get(response.single_option_slug) || 0) + 1,
      );
    }
    if (response.single_writein_response) {
      writeInCounts.set(
        response.single_writein_response,
        (writeInCounts.get(response.single_writein_response) || 0) + 1,
      );
    }
  }

  const totalResponses = responses.length;
  const optionsData = options.map((option) => ({
    optionSlug: option.slug,
    label: option.label,
    description: option.description || undefined,
    count: optionCounts.get(option.slug) || 0,
    percentage:
      totalResponses > 0 ? ((optionCounts.get(option.slug) || 0) / totalResponses) * 100 : 0,
    order: option.order,
  }));

  const writeInsData = Array.from(writeInCounts.entries()).map(([response, count]) => ({
    response,
    count,
  }));

  return {
    options: optionsData,
    writeIns: writeInsData,
  };
}

/**
 * Aggregate multiple choice question responses
 */
async function aggregateMultipleChoiceQuestion(
  questionSlug: string,
  month: number,
  year: number,
): Promise<MultipleChoiceData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("skipped", "=", false)
    .execute();

  // Get options for this question
  const options = await db
    .selectFrom("options")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("active", "=", true)
    .orderBy("order", "asc")
    .execute();

  const optionCounts = new Map<string, number>();
  const writeInCounts = new Map<string, number>();

  for (const response of responses) {
    if (response.multiple_option_slugs) {
      for (const optionSlug of response.multiple_option_slugs) {
        optionCounts.set(optionSlug, (optionCounts.get(optionSlug) || 0) + 1);
      }
    }
    if (response.multiple_writein_responses) {
      for (const writeIn of response.multiple_writein_responses) {
        writeInCounts.set(writeIn, (writeInCounts.get(writeIn) || 0) + 1);
      }
    }
  }

  const totalSelections = Array.from(optionCounts.values()).reduce((sum, count) => sum + count, 0);
  const optionsData = options.map((option) => ({
    optionSlug: option.slug,
    label: option.label,
    description: option.description || undefined,
    count: optionCounts.get(option.slug) || 0,
    percentage:
      totalSelections > 0 ? ((optionCounts.get(option.slug) || 0) / totalSelections) * 100 : 0,
    order: option.order,
  }));

  const writeInsData = Array.from(writeInCounts.entries()).map(([response, count]) => ({
    response,
    count,
  }));

  return {
    options: optionsData,
    writeIns: writeInsData,
  };
}

/**
 * Aggregate experience question responses
 */
async function aggregateExperienceQuestion(
  questionSlug: string,
  month: number,
  year: number,
): Promise<ExperienceData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("skipped", "=", false)
    .execute();

  // Get options for this question
  const options = await db
    .selectFrom("options")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("active", "=", true)
    .orderBy("order", "asc")
    .execute();

  // Valid awareness values: 0, 1, 2, 3 (Never heard, Heard of it, Used it in the past, Actively using it)
  const validAwarenessValues = AWARENESS_OPTIONS.map((option) => option.value) as number[];
  // Valid sentiment values: -1, 1
  const validSentimentValues = SENTIMENT_OPTIONS.map((option) => option.value) as number[];

  const optionsData = [];

  for (const option of options) {
    // Filter responses for this specific option
    const optionResponses = responses.filter((response) => response.option_slug === option.slug);

    const awarenessCounts = new Map<number, number>();
    const sentimentCounts = new Map<number, number>();
    const combinedCounts = new Map<string, number>();

    for (const response of optionResponses) {
      // Count all awareness values, including null/invalid ones as "Never heard of it" (0)
      const awarenessLevel =
        response.experience_awareness !== null &&
        validAwarenessValues.includes(response.experience_awareness)
          ? response.experience_awareness
          : 0; // Default to "Never heard of it" for null/invalid values

      awarenessCounts.set(awarenessLevel, (awarenessCounts.get(awarenessLevel) || 0) + 1);

      // Only count valid sentiment values
      if (
        response.experience_sentiment !== null &&
        validSentimentValues.includes(response.experience_sentiment)
      ) {
        sentimentCounts.set(
          response.experience_sentiment,
          (sentimentCounts.get(response.experience_sentiment) || 0) + 1,
        );
      }

      // Only count combined data for valid values
      if (
        response.experience_awareness !== null &&
        response.experience_sentiment !== null &&
        validAwarenessValues.includes(response.experience_awareness) &&
        validSentimentValues.includes(response.experience_sentiment)
      ) {
        const key = `${response.experience_awareness}|${response.experience_sentiment}`;
        combinedCounts.set(key, (combinedCounts.get(key) || 0) + 1);
      }
    }

    const totalResponses = optionResponses.length;

    const awarenessData = Array.from(awarenessCounts.entries()).map(([level, count]) => {
      const awarenessOption = AWARENESS_OPTIONS.find((opt) => opt.value === level);
      return {
        level,
        label: awarenessOption?.label || `Level ${level}`,
        count,
        percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0,
      };
    });

    const sentimentData = Array.from(sentimentCounts.entries()).map(([level, count]) => {
      const sentimentOption = SENTIMENT_OPTIONS.find((opt) => opt.value === level);
      return {
        level,
        label: sentimentOption?.label || `Level ${level}`,
        count,
        percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0,
      };
    });

    const combinedData = Array.from(combinedCounts.entries()).map(([key, count]) => {
      const [awareness, sentiment] = key.split("|").map(Number);
      return {
        awareness,
        sentiment,
        count,
      };
    });

    optionsData.push({
      optionSlug: option.slug,
      label: option.label,
      description: option.description || undefined,
      order: option.order,
      awareness: awarenessData,
      sentiment: sentimentData,
      combined: combinedData,
    });
  }

  return {
    options: optionsData,
  };
}

/**
 * Aggregate numeric question responses
 */
async function aggregateNumericQuestion(
  questionSlug: string,
  month: number,
  year: number,
): Promise<NumericData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("skipped", "=", false)
    .where("numeric_response", "is not", null)
    .execute();

  const values = responses
    .map((r) => Number(r.numeric_response))
    .filter((v) => !isNaN(v))
    .sort((a, b) => a - b);

  if (values.length === 0) {
    return {
      summary: { mean: 0, median: 0, min: 0, max: 0, count: 0 },
      distribution: [],
    };
  }

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const median =
    values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];
  const min = values[0];
  const max = values[values.length - 1];

  // Create distribution buckets
  const bucketSize = Math.max(1, Math.ceil((max - min) / 10));
  const buckets = new Map<string, number>();

  for (const value of values) {
    const bucketStart = Math.floor(value / bucketSize) * bucketSize;
    const bucketEnd = bucketStart + bucketSize;
    const bucketKey = `${bucketStart}-${bucketEnd}`;
    buckets.set(bucketKey, (buckets.get(bucketKey) || 0) + 1);
  }

  const distribution = Array.from(buckets.entries()).map(([range, count]) => ({
    range,
    count,
    percentage: (count / values.length) * 100,
  }));

  return {
    summary: { mean, median, min, max, count: values.length },
    distribution,
  };
}

/**
 * Aggregate freeform question responses
 * Groups responses by trimmed and lowercased text to combine variations
 * like "FooBar", "foobar", " FooBar " into a single count
 */
async function aggregateFreeformQuestion(
  questionSlug: string,
  month: number,
  year: number,
): Promise<FreeformData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("skipped", "=", false)
    .where("freeform_response", "is not", null)
    .execute();

  // Map: normalized key -> { original response, count }
  const responseCounts = new Map<string, { originalResponse: string; count: number }>();

  for (const response of responses) {
    if (response.freeform_response) {
      // Normalize: trim and lowercase for grouping
      const normalized = response.freeform_response.trim().toLowerCase();

      if (responseCounts.has(normalized)) {
        // Increment count for existing normalized response
        const existing = responseCounts.get(normalized)!;
        existing.count += 1;
      } else {
        // First occurrence - store the original response text for display
        responseCounts.set(normalized, {
          originalResponse: response.freeform_response.trim(),
          count: 1,
        });
      }
    }
  }

  const responsesData = Array.from(responseCounts.values())
    .map(({ originalResponse, count }) => ({
      response: originalResponse,
      count,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  return {
    responses: responsesData,
    totalCount: responses.length,
  };
}

/**
 * Get comments for a specific question in a specific month
 */
async function getQuestionComments(
  questionSlug: string,
  month: number,
  year: number,
): Promise<Array<{ comment: string; sessionId: string }>> {
  const comments = await db
    .selectFrom("responses")
    .select(["comment", "session_id"])
    .where("question_slug", "=", questionSlug)
    .where("month", "=", month)
    .where("year", "=", year)
    .where("skipped", "=", false)
    .where("comment", "is not", null)
    .where("comment", "!=", "")
    .execute();

  return comments.map((c) => ({
    comment: c.comment!,
    sessionId: c.session_id,
  }));
}

import { AWARENESS_OPTIONS, SENTIMENT_OPTIONS } from "@/lib/constants";
import { getCurrentISOWeek } from "@/lib/utils";
import { db } from "@/server/db";

export interface WeekSummary {
  week: number;
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
    count: number;
    percentage: number;
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
    count: number;
    percentage: number;
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
 * Get all weeks that have response data
 */
export async function getAvailableWeeks(): Promise<
  Array<{ week: number; year: number }>
> {
  const weeks = await db
    .selectFrom("responses")
    .select(["iso_week", "iso_year"])
    .groupBy(["iso_week", "iso_year"])
    .orderBy("iso_year", "asc")
    .orderBy("iso_week", "asc")
    .execute();

  return weeks.map((w) => ({ week: w.iso_week, year: w.iso_year }));
}

/**
 * Get the first week with response data
 */
export async function getFirstResponseWeek(): Promise<{
  week: number;
  year: number;
} | null> {
  const firstWeek = await db
    .selectFrom("responses")
    .select(["iso_week", "iso_year"])
    .orderBy("iso_year", "asc")
    .orderBy("iso_week", "asc")
    .limit(1)
    .executeTakeFirst();

  return firstWeek
    ? { week: firstWeek.iso_week, year: firstWeek.iso_year }
    : null;
}

/**
 * Get all weeks from first response to current week
 */
export async function getAllWeeksSinceStart(): Promise<
  Array<{ week: number; year: number }>
> {
  const firstWeek = await getFirstResponseWeek();
  if (!firstWeek) return [];

  const current = getCurrentISOWeek();
  const weeks: Array<{ week: number; year: number }> = [];

  let currentWeek = firstWeek;
  while (
    currentWeek.year < current.year ||
    (currentWeek.year === current.year && currentWeek.week <= current.week)
  ) {
    weeks.push({ ...currentWeek });

    // Move to next week
    if (currentWeek.week === 52) {
      currentWeek = { week: 1, year: currentWeek.year + 1 };
    } else {
      currentWeek = { week: currentWeek.week + 1, year: currentWeek.year };
    }
  }

  return weeks;
}

/**
 * Get aggregated data for a specific week
 */
export async function getWeekSummary(
  week: number,
  year: number,
): Promise<WeekSummary> {
  // Get total responses and unique sessions for the week
  const responseStats = await db
    .selectFrom("responses")
    .select([
      (eb) => eb.fn.countAll().as("totalResponses"),
      (eb) => eb.fn.count("session_id").distinct().as("uniqueSessions"),
    ])
    .where("iso_week", "=", week)
    .where("iso_year", "=", year)
    .executeTakeFirst();

  // Get all questions with their aggregated data
  const questions = await db
    .selectFrom("questions")
    .selectAll()
    .where("active", "=", true)
    .orderBy("order", "asc")
    .execute();

  const questionReports: QuestionReport[] = [];

  for (const question of questions) {
    const report = await getQuestionReport(question.slug, week, year);
    if (report) {
      const comments = await getQuestionComments(question.slug, week, year);
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
    week,
    year,
    totalResponses: Number(responseStats?.totalResponses || 0),
    uniqueSessions: Number(responseStats?.uniqueSessions || 0),
    questions: questionReports,
  };
}

/**
 * Get aggregated data for a specific question in a specific week
 */
export async function getQuestionReport(
  questionSlug: string,
  week: number,
  year: number,
): Promise<{
  totalResponses: number;
  skippedResponses: number;
  data: any;
} | null> {
  const question = await db
    .selectFrom("questions")
    .selectAll()
    .where("slug", "=", questionSlug)
    .where("active", "=", true)
    .executeTakeFirst();

  if (!question) return null;

  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("iso_week", "=", week)
    .where("iso_year", "=", year)
    .execute();

  // For experience questions, count unique sessions instead of individual responses
  // since each session can have multiple responses (one per option)
  let totalResponses: number;
  let skippedResponses: number;

  if (question.type === "experience") {
    const uniqueSessions = new Set(responses.map((r) => r.session_id));
    totalResponses = uniqueSessions.size;
    const skippedSessions = new Set(
      responses.filter((r) => r.skipped).map((r) => r.session_id),
    );
    skippedResponses = skippedSessions.size;
  } else {
    totalResponses = responses.length;
    skippedResponses = responses.filter((r) => r.skipped).length;
  }

  let data: any;

  switch (question.type) {
    case "single":
      data = await aggregateSingleChoiceQuestion(questionSlug, week, year);
      break;
    case "multiple":
      data = await aggregateMultipleChoiceQuestion(questionSlug, week, year);
      break;
    case "experience":
      data = await aggregateExperienceQuestion(questionSlug, week, year);
      break;
    case "numeric":
      data = await aggregateNumericQuestion(questionSlug, week, year);
      break;
    case "freeform":
    case "single-freeform":
    case "multiple-freeform":
      data = await aggregateFreeformQuestion(questionSlug, week, year);
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
  week: number,
  year: number,
): Promise<SingleChoiceData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("iso_week", "=", week)
    .where("iso_year", "=", year)
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
    count: optionCounts.get(option.slug) || 0,
    percentage:
      totalResponses > 0
        ? ((optionCounts.get(option.slug) || 0) / totalResponses) * 100
        : 0,
  }));

  const writeInsData = Array.from(writeInCounts.entries()).map(
    ([response, count]) => ({
      response,
      count,
    }),
  );

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
  week: number,
  year: number,
): Promise<MultipleChoiceData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("iso_week", "=", week)
    .where("iso_year", "=", year)
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

  const totalSelections = Array.from(optionCounts.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  const optionsData = options.map((option) => ({
    optionSlug: option.slug,
    label: option.label,
    count: optionCounts.get(option.slug) || 0,
    percentage:
      totalSelections > 0
        ? ((optionCounts.get(option.slug) || 0) / totalSelections) * 100
        : 0,
  }));

  const writeInsData = Array.from(writeInCounts.entries()).map(
    ([response, count]) => ({
      response,
      count,
    }),
  );

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
  week: number,
  year: number,
): Promise<ExperienceData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("iso_week", "=", week)
    .where("iso_year", "=", year)
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

  // Valid awareness values: 0, 1, 2
  const validAwarenessValues = AWARENESS_OPTIONS.map(
    (option) => option.value,
  ) as number[];
  // Valid sentiment values: -1, 1
  const validSentimentValues = SENTIMENT_OPTIONS.map(
    (option) => option.value,
  ) as number[];

  const optionsData = [];

  for (const option of options) {
    // Filter responses for this specific option
    const optionResponses = responses.filter(
      (response) => response.option_slug === option.slug,
    );

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

      awarenessCounts.set(
        awarenessLevel,
        (awarenessCounts.get(awarenessLevel) || 0) + 1,
      );

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

    const awarenessData = Array.from(awarenessCounts.entries()).map(
      ([level, count]) => {
        const awarenessOption = AWARENESS_OPTIONS.find(
          (opt) => opt.value === level,
        );
        return {
          level,
          label: awarenessOption?.label || `Level ${level}`,
          count,
          percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0,
        };
      },
    );

    const sentimentData = Array.from(sentimentCounts.entries()).map(
      ([level, count]) => {
        const sentimentOption = SENTIMENT_OPTIONS.find(
          (opt) => opt.value === level,
        );
        return {
          level,
          label: sentimentOption?.label || `Level ${level}`,
          count,
          percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0,
        };
      },
    );

    const combinedData = Array.from(combinedCounts.entries()).map(
      ([key, count]) => {
        const [awareness, sentiment] = key.split("|").map(Number);
        return {
          awareness,
          sentiment,
          count,
        };
      },
    );

    optionsData.push({
      optionSlug: option.slug,
      label: option.label,
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
  week: number,
  year: number,
): Promise<NumericData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("iso_week", "=", week)
    .where("iso_year", "=", year)
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
 */
async function aggregateFreeformQuestion(
  questionSlug: string,
  week: number,
  year: number,
): Promise<FreeformData> {
  const responses = await db
    .selectFrom("responses")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("iso_week", "=", week)
    .where("iso_year", "=", year)
    .where("skipped", "=", false)
    .where("freeform_response", "is not", null)
    .execute();

  const responseCounts = new Map<string, number>();

  for (const response of responses) {
    if (response.freeform_response) {
      responseCounts.set(
        response.freeform_response,
        (responseCounts.get(response.freeform_response) || 0) + 1,
      );
    }
  }

  const responsesData = Array.from(responseCounts.entries()).map(
    ([response, count]) => ({
      response,
      count,
    }),
  );

  return {
    responses: responsesData,
    totalCount: responses.length,
  };
}

/**
 * Get comments for a specific question in a specific week
 */
async function getQuestionComments(
  questionSlug: string,
  week: number,
  year: number,
): Promise<Array<{ comment: string; sessionId: string }>> {
  const comments = await db
    .selectFrom("responses")
    .select(["comment", "session_id"])
    .where("question_slug", "=", questionSlug)
    .where("iso_week", "=", week)
    .where("iso_year", "=", year)
    .where("skipped", "=", false)
    .where("comment", "is not", null)
    .where("comment", "!=", "")
    .execute();

  return comments.map((c) => ({
    comment: c.comment!,
    sessionId: c.session_id,
  }));
}

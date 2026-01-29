import type { Kysely } from "kysely";
import { sql } from "kysely";
import { startOfISOWeek, getISOWeek, getISOWeekYear, getMonth, getYear } from "date-fns";

export async function up(db: Kysely<any>): Promise<void> {
  // Step 1: Add new month and year columns
  await db.schema.alterTable("responses").addColumn("month", "integer").execute();

  await db.schema.alterTable("responses").addColumn("year", "integer").execute();

  // Step 2: Migrate data from iso_week/iso_year to month/year
  // Get all unique iso_week/iso_year combinations
  const weekYearCombinations = await db
    .selectFrom("responses")
    .select(["iso_week", "iso_year"])
    .groupBy(["iso_week", "iso_year"])
    .execute();

  // For each combination, convert to month/year
  for (const combo of weekYearCombinations) {
    // Create a date in the given ISO week/year
    // ISO week 1 is the first week with at least 4 days in the new year
    const jan4 = new Date(combo.iso_year, 0, 4); // January 4th
    const week1Start = startOfISOWeek(jan4);
    const targetWeekStart = new Date(
      week1Start.getTime() + (combo.iso_week - 1) * 7 * 24 * 60 * 60 * 1000,
    );
    const weekStart = startOfISOWeek(targetWeekStart);

    // Extract month (1-12) and year from the start of the ISO week
    const month = getMonth(weekStart) + 1; // getMonth returns 0-11, we need 1-12
    const year = getYear(weekStart);

    // Update all responses with this iso_week/iso_year combination
    await db
      .updateTable("responses")
      .set({ month, year })
      .where("iso_week", "=", combo.iso_week)
      .where("iso_year", "=", combo.iso_year)
      .execute();
  }

  // Step 3: Drop the old primary key constraint
  await db.schema.alterTable("responses").dropConstraint("responses_pkey").execute();

  // Step 4: Drop the old index
  await sql`DROP INDEX IF EXISTS responses_session_week_year_idx`.execute(db);

  // Step 5: Handle duplicates - multiple ISO weeks can map to the same month
  // Keep the response with the highest iso_week for each (session_id, month, year, question_slug, option_slug) combination
  await sql`
    DELETE FROM responses
    WHERE ctid NOT IN (
      SELECT DISTINCT ON (session_id, month, year, question_slug, option_slug) ctid
      FROM responses
      ORDER BY session_id, month, year, question_slug, option_slug, iso_week DESC, iso_year DESC
    )
  `.execute(db);

  // Step 6: Make month and year NOT NULL now that data is migrated
  await db.schema
    .alterTable("responses")
    .alterColumn("month", (col) => col.setNotNull())
    .execute();

  await db.schema
    .alterTable("responses")
    .alterColumn("year", (col) => col.setNotNull())
    .execute();

  // Step 7: Drop iso_week column
  await db.schema.alterTable("responses").dropColumn("iso_week").execute();

  // Step 8: Drop iso_year column (we already have year column)
  await db.schema.alterTable("responses").dropColumn("iso_year").execute();

  // Step 9: Create new primary key constraint with month instead of iso_week
  await db.schema
    .alterTable("responses")
    .addPrimaryKeyConstraint("responses_pkey", [
      "session_id",
      "month",
      "year",
      "question_slug",
      "option_slug",
    ])
    .execute();

  // Step 10: Create new index with month/year
  await db.schema
    .createIndex("responses_session_month_year_idx")
    .on("responses")
    .columns(["session_id", "month", "year"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Step 1: Drop new primary key constraint
  await db.schema.alterTable("responses").dropConstraint("responses_pkey").execute();

  // Step 2: Drop new index
  await sql`DROP INDEX IF EXISTS responses_session_month_year_idx`.execute(db);

  // Step 3: Add back iso_week and iso_year columns
  await db.schema.alterTable("responses").addColumn("iso_week", "integer").execute();

  await db.schema.alterTable("responses").addColumn("iso_year", "integer").execute();

  // Step 4: Migrate data back from month/year to iso_week/iso_year
  // Get all unique month/year combinations
  const monthYearCombinations = await db
    .selectFrom("responses")
    .select(["month", "year"])
    .groupBy(["month", "year"])
    .execute();

  // For each combination, convert to iso_week/iso_year
  for (const combo of monthYearCombinations) {
    // Create a date in the given month/year (use first day of month)
    const date = new Date(combo.year, combo.month - 1, 1); // month is 1-12, Date constructor expects 0-11
    const isoWeek = getISOWeek(date);
    const isoYear = getISOWeekYear(date);

    // Update all responses with this month/year combination
    await db
      .updateTable("responses")
      .set({ iso_week: isoWeek, iso_year: isoYear })
      .where("month", "=", combo.month)
      .where("year", "=", combo.year)
      .execute();
  }

  // Step 5: Make iso_week and iso_year NOT NULL
  await db.schema
    .alterTable("responses")
    .alterColumn("iso_week", (col) => col.setNotNull())
    .execute();

  await db.schema
    .alterTable("responses")
    .alterColumn("iso_year", (col) => col.setNotNull())
    .execute();

  // Step 6: Drop month column (keep year column as iso_year)
  await db.schema.alterTable("responses").dropColumn("month").execute();

  // Step 7: Rename year back to iso_year
  await db.schema.alterTable("responses").renameColumn("year", "iso_year").execute();

  // Step 8: Create old primary key constraint
  await db.schema
    .alterTable("responses")
    .addPrimaryKeyConstraint("responses_pkey", [
      "session_id",
      "iso_week",
      "iso_year",
      "question_slug",
      "option_slug",
    ])
    .execute();

  // Step 9: Create old index
  await db.schema
    .createIndex("responses_session_week_year_idx")
    .on("responses")
    .columns(["session_id", "iso_week", "iso_year"])
    .execute();
}

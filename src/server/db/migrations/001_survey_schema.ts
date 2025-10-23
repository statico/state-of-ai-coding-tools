import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Create sessions table
  await db.schema
    .createTable("sessions")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo("now()"),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo("now()"),
    )
    .execute();

  // Create sections table
  await db.schema
    .createTable("sections")
    .addColumn("slug", "text", (col) => col.primaryKey().notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("active", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("order", "integer", (col) => col.notNull())
    .addColumn("added_at", "date")
    .execute();

  // Create questions table
  await db.schema
    .createTable("questions")
    .addColumn("slug", "text", (col) => col.primaryKey().notNull())
    .addColumn("section_slug", "text", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("active", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("order", "integer", (col) => col.notNull())
    .addColumn("multiple_max", "integer")
    .addColumn("added_at", "date")
    .addColumn("randomize", "boolean", (col) => col.notNull().defaultTo(false))
    .execute();

  // Create options table
  await db.schema
    .createTable("options")
    .addColumn("slug", "text", (col) => col.primaryKey().notNull())
    .addColumn("question_slug", "text", (col) => col.notNull())
    .addColumn("label", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("active", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("order", "integer", (col) => col.notNull())
    .addColumn("added_at", "date")
    .execute();

  // Create responses table with composite primary key
  await db.schema
    .createTable("responses")
    .addColumn("session_id", "uuid", (col) => col.notNull())
    .addColumn("iso_week", "integer", (col) => col.notNull())
    .addColumn("iso_year", "integer", (col) => col.notNull())
    .addColumn("question_slug", "text", (col) => col.notNull())
    .addColumn("option_slug", "text", (col) => col.notNull().defaultTo(""))
    .addColumn("skipped", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("single_option_slug", "text")
    .addColumn("single_writein_response", "text")
    .addColumn("multiple_option_slugs", sql`text[]`)
    .addColumn("multiple_writein_responses", sql`text[]`)
    .addColumn("experience_awareness", "integer")
    .addColumn("experience_sentiment", "integer")
    .addColumn("freeform_response", "text")
    .addColumn("numeric_response", "numeric")
    .addColumn("comment", "text")
    .addPrimaryKeyConstraint("responses_pkey", [
      "session_id",
      "iso_week",
      "iso_year",
      "question_slug",
      "option_slug",
    ])
    .execute();

  // Add foreign key constraints
  await db.schema
    .alterTable("questions")
    .addForeignKeyConstraint(
      "questions_section_slug_fkey",
      ["section_slug"],
      "sections",
      ["slug"],
      (fk) => fk.onDelete("cascade"),
    )
    .execute();

  await db.schema
    .alterTable("options")
    .addForeignKeyConstraint(
      "options_question_slug_fkey",
      ["question_slug"],
      "questions",
      ["slug"],
      (fk) => fk.onDelete("cascade"),
    )
    .execute();

  await db.schema
    .alterTable("responses")
    .addForeignKeyConstraint(
      "responses_session_id_fkey",
      ["session_id"],
      "sessions",
      ["id"],
      (fk) => fk.onDelete("cascade"),
    )
    .execute();

  await db.schema
    .alterTable("responses")
    .addForeignKeyConstraint(
      "responses_question_slug_fkey",
      ["question_slug"],
      "questions",
      ["slug"],
      (fk) => fk.onDelete("cascade"),
    )
    .execute();

  // Add indexes for performance
  await db.schema
    .createIndex("options_question_slug_idx")
    .on("options")
    .column("question_slug")
    .execute();

  await db.schema
    .createIndex("responses_session_week_year_idx")
    .on("responses")
    .columns(["session_id", "iso_week", "iso_year"])
    .execute();

  await db.schema
    .createIndex("responses_question_slug_idx")
    .on("responses")
    .column("question_slug")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order due to foreign key constraints
  await db.schema.dropTable("responses").execute();
  await db.schema.dropTable("options").execute();
  await db.schema.dropTable("questions").execute();
  await db.schema.dropTable("sections").execute();
  await db.schema.dropTable("sessions").execute();
}

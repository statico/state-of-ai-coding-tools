import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Add short_name column to sections table
  await db.schema.alterTable("sections").addColumn("short_name", "text").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove short_name column from sections table
  await db.schema.alterTable("sections").dropColumn("short_name").execute();
}

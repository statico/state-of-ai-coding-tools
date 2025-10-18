import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("todos")
    .addColumn("id", "serial", (col) => col.primaryKey().notNull())
    .addColumn("text", "text", (col) => col.notNull())
    .addColumn("completed", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo("now()"),
    )
    .addColumn("updated_at", "timestamp", (col) => col)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("todos").execute();
}

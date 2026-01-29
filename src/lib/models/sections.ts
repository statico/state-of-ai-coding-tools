import { db } from "@/server/db";
import type { Sections } from "@/server/db/types";
import type { Insertable, Selectable, Updateable } from "kysely";

export type SelectableSection = Selectable<Sections>;
export type InsertableSection = Insertable<Sections>;
export type UpdateableSection = Updateable<Sections>;

export async function getAllSections() {
  return await db.selectFrom("sections").selectAll().orderBy("order").execute();
}

export async function getActiveSections() {
  return await db
    .selectFrom("sections")
    .selectAll()
    .where("active", "=", true)
    .orderBy("order")
    .execute();
}

export async function getSectionBySlug(slug: string) {
  return await db.selectFrom("sections").selectAll().where("slug", "=", slug).executeTakeFirst();
}

export async function createSection(data: InsertableSection) {
  return await db
    .insertInto("sections")
    .values({
      ...data,
      active: true,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateSection(slug: string, data: UpdateableSection) {
  return await db
    .updateTable("sections")
    .set(data)
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deactivateSection(slug: string) {
  return await db
    .updateTable("sections")
    .set({ active: false })
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteSection(slug: string) {
  return await db
    .deleteFrom("sections")
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function upsertSection(data: InsertableSection) {
  return await db
    .insertInto("sections")
    .values(data)
    .onConflict((oc) =>
      oc.column("slug").doUpdateSet({
        title: (eb) => eb.ref("excluded.title"),
        description: (eb) => eb.ref("excluded.description"),
        active: (eb) => eb.ref("excluded.active"),
        order: (eb) => eb.ref("excluded.order"),
      }),
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getFirstSection() {
  return await db
    .selectFrom("sections")
    .selectAll()
    .where("active", "=", true)
    .orderBy("order")
    .limit(1)
    .executeTakeFirst();
}

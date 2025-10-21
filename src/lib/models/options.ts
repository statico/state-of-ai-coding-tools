import { db } from "@/server/db";
import type { Options } from "@/server/db/types";
import type { Insertable, Selectable, Updateable } from "kysely";

export type SelectableOption = Selectable<Options>;
export type InsertableOption = Insertable<Options>;
export type UpdateableOption = Updateable<Options>;

export async function getAllOptions() {
  return await db.selectFrom("options").selectAll().orderBy("order").execute();
}

export async function getActiveOptions() {
  return await db
    .selectFrom("options")
    .selectAll()
    .where("active", "=", true)
    .orderBy("order")
    .execute();
}

export async function getOptionsByQuestion(questionSlug: string) {
  return await db
    .selectFrom("options")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .orderBy("order")
    .execute();
}

export async function getActiveOptionsByQuestion(questionSlug: string) {
  return await db
    .selectFrom("options")
    .selectAll()
    .where("question_slug", "=", questionSlug)
    .where("active", "=", true)
    .orderBy("order")
    .execute();
}

export async function getOptionBySlug(slug: string) {
  return await db
    .selectFrom("options")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirst();
}

export async function createOption(data: InsertableOption) {
  return await db
    .insertInto("options")
    .values({
      ...data,
      active: true,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateOption(slug: string, data: UpdateableOption) {
  return await db
    .updateTable("options")
    .set(data)
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deactivateOption(slug: string) {
  return await db
    .updateTable("options")
    .set({ active: false })
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteOption(slug: string) {
  return await db
    .deleteFrom("options")
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function upsertOption(data: InsertableOption) {
  return await db
    .insertInto("options")
    .values(data)
    .onConflict((oc) =>
      oc.column("slug").doUpdateSet({
        question_slug: (eb) => eb.ref("excluded.question_slug"),
        label: (eb) => eb.ref("excluded.label"),
        description: (eb) => eb.ref("excluded.description"),
        active: (eb) => eb.ref("excluded.active"),
        order: (eb) => eb.ref("excluded.order"),
      }),
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}

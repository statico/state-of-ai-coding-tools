import { db } from "@/server/db";

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

export async function createOption(data: {
  slug: string;
  question_slug: string;
  label: string;
  description?: string;
  order: number;
}) {
  return await db
    .insertInto("options")
    .values({
      ...data,
      active: true,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateOption(
  slug: string,
  data: {
    label?: string;
    description?: string | null;
    order?: number;
    active?: boolean;
  },
) {
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

export async function upsertOption(data: {
  slug: string;
  label: string;
  description?: string | null;
  order: number;
  question_slug: string;
  active?: boolean;
  added_at?: Date | null;
}) {
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

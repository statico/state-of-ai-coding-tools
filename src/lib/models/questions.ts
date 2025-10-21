import { db } from "@/server/db";

export async function getAllQuestions() {
  return await db
    .selectFrom("questions")
    .selectAll()
    .orderBy("order")
    .execute();
}

export async function getActiveQuestions() {
  return await db
    .selectFrom("questions")
    .selectAll()
    .where("active", "=", true)
    .orderBy("order")
    .execute();
}

export async function getQuestionsBySection(sectionSlug: string) {
  return await db
    .selectFrom("questions")
    .selectAll()
    .where("section_slug", "=", sectionSlug)
    .orderBy("order")
    .execute();
}

export async function getActiveQuestionsBySection(sectionSlug: string) {
  return await db
    .selectFrom("questions")
    .selectAll()
    .where("section_slug", "=", sectionSlug)
    .where("active", "=", true)
    .orderBy("order")
    .execute();
}

export async function getQuestionBySlug(slug: string) {
  return await db
    .selectFrom("questions")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirst();
}

export async function createQuestion(data: {
  slug: string;
  section_slug: string;
  title: string;
  description?: string;
  type: string;
  order: number;
  multiple_max?: number;
}) {
  return await db
    .insertInto("questions")
    .values({
      ...data,
      active: true,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateQuestion(
  slug: string,
  data: Partial<typeof questions.$inferInsert>,
) {
  return await db
    .updateTable("questions")
    .set(data)
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deactivateQuestion(slug: string) {
  return await db
    .updateTable("questions")
    .set({ active: false })
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteQuestion(slug: string) {
  return await db
    .deleteFrom("questions")
    .where("slug", "=", slug)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function upsertQuestion(data: typeof questions.$inferInsert) {
  return await db
    .insertInto("questions")
    .values(data)
    .onConflict((oc) =>
      oc.column("slug").doUpdateSet({
        section_slug: (eb) => eb.ref("excluded.section_slug"),
        title: (eb) => eb.ref("excluded.title"),
        description: (eb) => eb.ref("excluded.description"),
        type: (eb) => eb.ref("excluded.type"),
        active: (eb) => eb.ref("excluded.active"),
        order: (eb) => eb.ref("excluded.order"),
        multiple_max: (eb) => eb.ref("excluded.multiple_max"),
      }),
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}

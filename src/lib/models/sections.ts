import { db } from "@/server/db";

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
  return await db
    .selectFrom("sections")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirst();
}

export async function createSection(data: {
  slug: string;
  title: string;
  description?: string;
  order: number;
}) {
  return await db
    .insertInto("sections")
    .values({
      ...data,
      active: true,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateSection(
  slug: string,
  data: {
    title?: string;
    description?: string | null;
    order?: number;
    active?: boolean;
  },
) {
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

export async function upsertSection(data: {
  slug: string;
  title: string;
  description?: string | null;
  order: number;
  active?: boolean;
  added_at?: Date | null;
}) {
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

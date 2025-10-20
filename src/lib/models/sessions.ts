import { db } from "@/server/db";

export async function getAllSessions() {
  return await db.selectFrom("sessions").selectAll().execute();
}

export async function getSessionById(id: string) {
  return await db
    .selectFrom("sessions")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createSession(data: { id: string }) {
  return await db
    .insertInto("sessions")
    .values({
      ...data,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteSession(id: string) {
  return await db
    .deleteFrom("sessions")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

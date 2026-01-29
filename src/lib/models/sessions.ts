import { db } from "@/server/db";
import { Logger } from "@/server/logging";
import { z } from "zod";

const log = Logger.forModule();

export const isValidUUID = (uuid: string): boolean => {
  return z.string().uuid().safeParse(uuid).success;
};

export const generateSessionId = (): string => {
  return crypto.randomUUID();
};

export async function getAllSessions() {
  return await db.selectFrom("sessions").selectAll().execute();
}

export async function getSessionById(id: string) {
  return await db.selectFrom("sessions").selectAll().where("id", "=", id).executeTakeFirst();
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

export async function updateSession(id: string) {
  return await db
    .updateTable("sessions")
    .set({ updated_at: new Date() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteSession(id: string) {
  return await db
    .deleteFrom("sessions")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getOrCreateSession(providedSessionId?: string): Promise<string> {
  // If a session ID is provided, validate it
  if (providedSessionId) {
    if (!isValidUUID(providedSessionId)) {
      log.warn("Invalid UUID provided, generating new session", {
        providedSessionId,
      });
      // Generate new session ID for invalid UUID
      const newSessionId = generateSessionId();
      await createSession({ id: newSessionId });
      return newSessionId;
    }

    // Try to find existing session
    const existingSession = await getSessionById(providedSessionId);

    if (existingSession) {
      // Update the session's updated_at timestamp
      await updateSession(providedSessionId);
      return providedSessionId;
    }

    // Session doesn't exist, create it
    await createSession({ id: providedSessionId });
    return providedSessionId;
  }

  // No session ID provided, create a new one
  const newSessionId = generateSessionId();
  await createSession({ id: newSessionId });
  return newSessionId;
}

import { setupTestData } from "@/test/setup";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createSession,
  deleteSession,
  generateSessionId,
  getAllSessions,
  getOrCreateSession,
  getSessionById,
  isValidUUID,
  updateSession,
} from "./sessions";

describe("sessions", () => {
  beforeEach(async () => {
    await setupTestData();
  });

  describe("isValidUUID", () => {
    it("should validate correct UUIDs", () => {
      expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isValidUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
      expect(isValidUUID("6ba7b811-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(isValidUUID("invalid-uuid")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
      expect(isValidUUID("")).toBe(false);
      expect(isValidUUID("not-a-uuid-at-all")).toBe(false);
    });
  });

  describe("generateSessionId", () => {
    it("should generate valid UUIDs", () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();

      expect(isValidUUID(id1)).toBe(true);
      expect(isValidUUID(id2)).toBe(true);
      expect(id1).not.toBe(id2);
    });
  });

  describe("createSession", () => {
    it("should create a new session", async () => {
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      const session = await createSession({ id: sessionId });

      expect(session.id).toBe(sessionId);
      expect(session.created_at).toBeDefined();
      expect(session.updated_at).toBeDefined();
    });
  });

  describe("getSessionById", () => {
    it("should return session if it exists", async () => {
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await createSession({ id: sessionId });

      const session = await getSessionById(sessionId);

      expect(session).toBeDefined();
      expect(session?.id).toBe(sessionId);
    });

    it("should return undefined if session does not exist", async () => {
      const session = await getSessionById(
        "550e8400-e29b-41d4-a716-446655440001",
      );

      expect(session).toBeUndefined();
    });
  });

  describe("updateSession", () => {
    it("should update session timestamp", async () => {
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await createSession({ id: sessionId });

      const originalSession = await getSessionById(sessionId);
      const originalUpdatedAt = originalSession?.updated_at;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updatedSession = await updateSession(sessionId);

      expect(updatedSession).toBeDefined();
      expect(updatedSession?.id).toBe(sessionId);
      expect(updatedSession?.updated_at.getTime()).toBeGreaterThan(
        originalUpdatedAt?.getTime() || 0,
      );
    });
  });

  describe("deleteSession", () => {
    it("should delete an existing session", async () => {
      const sessionId = "550e8400-e29b-41d4-a716-446655440000";
      await createSession({ id: sessionId });

      const deletedSession = await deleteSession(sessionId);

      expect(deletedSession.id).toBe(sessionId);

      const session = await getSessionById(sessionId);
      expect(session).toBeUndefined();
    });
  });

  describe("getOrCreateSession", () => {
    it("should create a new session when no sessionId is provided", async () => {
      const sessionId = await getOrCreateSession();

      expect(sessionId).toBeDefined();
      expect(isValidUUID(sessionId)).toBe(true);

      const session = await getSessionById(sessionId);
      expect(session).toBeDefined();
      expect(session?.id).toBe(sessionId);
    });

    it("should create a new session when invalid UUID is provided", async () => {
      const sessionId = await getOrCreateSession("invalid-uuid");

      expect(sessionId).toBeDefined();
      expect(isValidUUID(sessionId)).toBe(true);
      expect(sessionId).not.toBe("invalid-uuid");

      const session = await getSessionById(sessionId);
      expect(session).toBeDefined();
      expect(session?.id).toBe(sessionId);
    });

    it("should use existing session when valid UUID is provided", async () => {
      const existingSessionId = "550e8400-e29b-41d4-a716-446655440000";
      await createSession({ id: existingSessionId });

      const sessionId = await getOrCreateSession(existingSessionId);

      expect(sessionId).toBe(existingSessionId);

      const session = await getSessionById(existingSessionId);
      expect(session).toBeDefined();
      expect(session?.id).toBe(existingSessionId);
    });

    it("should create new session when valid UUID is provided but doesn't exist in database", async () => {
      const validButNonExistentUuid = "550e8400-e29b-41d4-a716-446655440001";

      const sessionId = await getOrCreateSession(validButNonExistentUuid);

      expect(sessionId).toBe(validButNonExistentUuid);

      const session = await getSessionById(validButNonExistentUuid);
      expect(session).toBeDefined();
      expect(session?.id).toBe(validButNonExistentUuid);
    });
  });

  describe("getAllSessions", () => {
    it("should return all sessions", async () => {
      const session1 = await createSession({
        id: "550e8400-e29b-41d4-a716-446655440000",
      });
      const session2 = await createSession({
        id: "550e8400-e29b-41d4-a716-446655440001",
      });

      const sessions = await getAllSessions();

      expect(sessions).toHaveLength(2);
      expect(sessions.map((s) => s.id)).toContain(session1.id);
      expect(sessions.map((s) => s.id)).toContain(session2.id);
    });
  });
});

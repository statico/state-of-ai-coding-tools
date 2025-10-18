import { migrate, teardown } from "@/server/db/migrate";
import { afterEach, beforeEach, vi } from "vitest";

// Set timezone to UTC for all tests to ensure consistent behavior
process.env.TZ = "UTC";

// Mock environment variables for tests
vi.mock("@/server/env", () => ({
  __TEST__: true,
  __DEV__: false,
  __LIVE__: false,
  getEnv: vi.fn((key: string, defaultValue?: string) => {
    // Return default value if provided, otherwise return test-api-key
    return defaultValue || "test-api-key";
  }),
  hasEnv: vi.fn(() => false),
  Env: {
    DATABASE_URL: "DATABASE_URL",
  },
}));

// Initialize test database before each test
beforeEach(async () => {
  await migrate();
});

afterEach(async () => {
  await teardown();
});

// Setup test data for each test
export async function setupTestData() {
  // Clear existing data - this will be handled by teardown
}

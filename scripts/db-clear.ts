#!/usr/bin/env tsx

import { db } from "@/server/db";
import { Logger } from "@/server/logging";

const log = new Logger("db-clear");

async function clearDatabase() {
  log.info("Starting database clear...");

  try {
    // Clear data in the correct order to respect foreign key constraints
    // Same order as in db-seed.ts
    log.info("Clearing responses...");
    await db.deleteFrom("responses").execute();

    log.info("Clearing sessions...");
    await db.deleteFrom("sessions").execute();

    log.info("Clearing options...");
    await db.deleteFrom("options").execute();

    log.info("Clearing questions...");
    await db.deleteFrom("questions").execute();

    log.info("Clearing sections...");
    await db.deleteFrom("sections").execute();

    log.info("Database cleared successfully!");
  } catch (error) {
    log.error("Error clearing database:", error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  clearDatabase();
}

import { promises as fs } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { db } from ".";

/*
 * Used by tests to reset the database. Note: We can't delete the database file
 * because it's reused in-process and deleting the file causes I/O errors.
 */
export const migrate = async () => {
  // FileMigrationProvider doesn't work
  // Get all migration files from the migrations directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const migrationFiles = await fs.readdir(path.join(__dirname, "migrations"));

  // Sort them to ensure they run in order
  const sortedMigrations = migrationFiles
    .filter((f) => f.endsWith(".ts"))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => `./migrations/${f.replace(/\.ts$/, "")}.ts`);

  // Import and run each migration in sequence
  for (const migrationFile of sortedMigrations) {
    const migration = await import(migrationFile);
    try {
      await migration.up(db);
    } catch (err) {
      // Check if error is about existing objects, which we can ignore
      const errorMessage = String(err);
      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate key value") ||
        (errorMessage.includes("constraint") && errorMessage.includes("already exists"))
      ) {
        // Silently continue for existing objects - this is expected in test environments
        // where migrations may run multiple times
      } else {
        throw new Error(`Failed to run up migration ${migrationFile}: ${err}`);
      }
    }
  }
};

export const teardown = async () => {
  // Drop tables in dependency order, CASCADE will handle constraints and indexes
  const tables = ["responses", "options", "questions", "sections", "sessions"];

  for (const table of tables) {
    try {
      await db.schema.dropTable(table).ifExists().cascade().execute();
    } catch (err) {
      // Ignore errors - table might not exist
      console.warn(`Warning: Could not drop table ${table}:`, err);
    }
  }
};

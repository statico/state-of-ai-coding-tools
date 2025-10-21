import "dotenv/config";

import { PGlite } from "@electric-sql/pglite";
import { Kysely, LogEvent, PostgresDialect } from "kysely";
import { PGliteDialect } from "kysely-pglite-dialect";
import { Pool } from "pg";
import { __TEST__, Env, getEnv } from "../env";
import { Logger } from "../logging";
import type { DB } from "./types";

const log = Logger.forModule();

const databaseUrl = getEnv(Env.DATABASE_URL, "postgresql://localhost:5432");

// Show only syntax errors in tests
const logger = (event: LogEvent) => {
  if (event.level !== "error") return;
  const err = event.error;
  if (__TEST__ && !/syntax error/.test(String(err))) return;
  const message = (err as any)?.message || String(err);
  const query = event.query.sql;
  const params = event.query.parameters;

  log.error("Database error: %s", message, {
    operation: "database_query",
    query: query,
    params: JSON.stringify(params).substring(0, 100),
  });
};

export let db: Kysely<DB>;

export const recreateDb = () => {
  if (db) db.destroy();

  if (__TEST__) {
    db = new Kysely<DB>({
      dialect: new PGliteDialect(new PGlite()),
      log: logger,
    });
  } else {
    db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({ connectionString: databaseUrl }),
      }),
      log: logger,
    });
  }
};

// Initialize database connection and handle hot module reloading
recreateDb();

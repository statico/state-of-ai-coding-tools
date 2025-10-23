#!/usr/bin/env tsx

import { syncConfig } from "@/lib/sync.js";
import { db } from "@/server/db/index.js";
import "dotenv/config";

try {
  const configPath = process.argv[2];
  await syncConfig(configPath);
} finally {
  await db.destroy();
}

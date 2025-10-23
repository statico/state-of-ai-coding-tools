#!/usr/bin/env tsx

import {
  loadConfig,
  validateConfigReferences,
  validateUniqueSlugs,
} from "@/lib/config.js";
import "dotenv/config";

try {
  const configPath = process.argv[2];
  console.log("🔍 Checking config.yml...");

  // Load and validate config
  const config = loadConfig(configPath);
  console.log("✅ Config file loaded successfully");

  // Validate config references
  validateConfigReferences(config);
  console.log("✅ Config references validated");

  // Validate unique slugs
  validateUniqueSlugs(config);
  console.log("✅ Unique slugs validated");

  console.log(
    "🎉 Config validation passed! All checks completed successfully.",
  );
} catch (error) {
  console.error("❌ Config validation failed:");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

import { db } from "./src/server/db";
import { defineConfig } from "kysely-ctl";

export default defineConfig({
  kysely: db,
  migrations: { migrationFolder: "src/server/db/migrations" },
  seeds: { seedFolder: "src/server/db/seeds" },
});

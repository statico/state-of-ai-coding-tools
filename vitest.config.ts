import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "node",
    globals: true,
    setupFiles: ["src/test/setup.ts"],
    fileParallelism: true,
    slowTestThreshold: 750,
    alias: {
      "@": resolve("./src"),
    },
  },
});

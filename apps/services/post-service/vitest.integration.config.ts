import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/integration/**/*.spec.ts"],
    setupFiles: ["tests/setup/vitest.setup.ts"],
    reporters: ["verbose"],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});

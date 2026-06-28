import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    // Testes E2E são sequenciais — cada arquivo roda um fluxo completo
    fileParallelism: false,
    testTimeout: 15000,
    hookTimeout: 10000,
    reporters: ["verbose"],
    setupFiles: ["src/setup.ts"],
  },
});

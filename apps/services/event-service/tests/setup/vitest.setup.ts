import { vi } from "vitest";

vi.mock("../../src/config/env", () => ({
    env: {
        port: 3004,
        jwtSecret: "test-secret",
        jwtExpiresIn: "1h",
        jwtRefreshExpiresIn: "7d",
        databaseUrl: "postgresql://user:pass@localhost:5432/test",
        allowedOrigins: ["http://localhost:3000"],
    },
}));

import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";

// fetch ao user-service é uma chamada cross-service — mantemos mockado (escopo de E2E)
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import prismaClient from "../../src/prisma/index";
import { buildServer } from "../helpers/fastify.test.helper";

describe("auth-service — HTTP Integration (Postgres real)", () => {
  let app: Awaited<ReturnType<typeof buildServer>>;

  beforeAll(async () => {
    app = await buildServer();
  });

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  });

  beforeEach(async () => {
    await prismaClient.access.deleteMany();

    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ accountId: "profile-acc-uuid" }),
    });
  });

  describe("POST /register", () => {
    it("cria conta e persiste no banco", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/register",
        payload: {
          username: "testuser",
          name: "Test User",
          email: "test@example.com",
          password: "senha123",
          bornAt: "1998-05-20",
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body).toHaveProperty("authId");
      expect(body).toHaveProperty("accountId");
      expect(body.username).toBe("testuser");
      expect(body.email).toBe("test@example.com");

      const row = await prismaClient.access.findFirst({ where: { username: "testuser" } });
      expect(row).not.toBeNull();
      expect(row?.email).toBe("test@example.com");
    });

    it("faz hash da senha antes de persistir", async () => {
      await app.inject({
        method: "POST",
        url: "/register",
        payload: {
          username: "hashuser",
          name: "Hash User",
          email: "hash@example.com",
          password: "senha123",
          bornAt: "1998-05-20",
        },
      });

      const row = await prismaClient.access.findFirst({ where: { username: "hashuser" } });
      expect(row?.passwordHash).not.toBe("senha123");
      expect(row?.passwordHash).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt format
    });

    it("retorna 400 quando username já existe", async () => {
      const payload = {
        username: "duplicate",
        name: "User",
        email: "first@example.com",
        password: "senha123",
        bornAt: "1998-05-20",
      };

      await app.inject({ method: "POST", url: "/register", payload });

      const res = await app.inject({
        method: "POST",
        url: "/register",
        payload: { ...payload, email: "second@example.com" },
      });

      expect(res.statusCode).toBe(400);
    });

    it("retorna 400 quando user-service falha ao criar perfil", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });

      const res = await app.inject({
        method: "POST",
        url: "/register",
        payload: {
          username: "failuser",
          name: "Fail User",
          email: "fail@example.com",
          password: "senha123",
          bornAt: "1998-05-20",
        },
      });

      expect(res.statusCode).toBe(400);
    });
  });
});

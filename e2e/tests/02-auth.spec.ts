import { describe, it, expect, beforeAll } from "vitest";
import { SERVICES } from "../src/config";
import { http } from "../src/http";
import { unique, uniqueEmail } from "../src/unique";

describe("Auth Service — /register e /login", () => {
  const username = unique("auth_user");
  const email = uniqueEmail("auth_user");
  const password = "Senha@123";

  describe("POST /register", () => {
    it("cria conta com dados válidos e retorna 201", async () => {
      const res = await http.post<{
        authId: string;
        accountId: string;
        username: string;
        email: string;
      }>(`${SERVICES.auth}/register`, {
        username,
        name: "Auth E2E User",
        email,
        password,
        bornAt: "1998-05-20",
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ username, email });
      expect(res.body.authId).toBeTruthy();
      expect(res.body.accountId).toBeTruthy();
    });

    it("retorna 400 ao tentar registrar username duplicado", async () => {
      const res = await http.post(`${SERVICES.auth}/register`, {
        username,
        name: "Outro Nome",
        email: uniqueEmail("dup_email"),
        password,
        bornAt: "1998-05-20",
      });

      expect(res.status).toBe(400);
    });

    it("retorna 400 ao tentar registrar email duplicado", async () => {
      const res = await http.post(`${SERVICES.auth}/register`, {
        username: unique("dup_user"),
        name: "Outro Nome",
        email,
        password,
        bornAt: "1998-05-20",
      });

      expect(res.status).toBe(400);
    });

    it("retorna 400 sem campo obrigatório (email ausente)", async () => {
      const res = await http.post(`${SERVICES.auth}/register`, {
        username: unique("nomail"),
        name: "Sem Email",
        password,
        bornAt: "1998-05-20",
      });

      expect(res.status).toBe(400);
    });

    it("retorna 400 com senha curta (< 6 chars)", async () => {
      const res = await http.post(`${SERVICES.auth}/register`, {
        username: unique("short_pwd"),
        name: "Short",
        email: uniqueEmail("short_pwd"),
        password: "123",
        bornAt: "1998-05-20",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /login", () => {
    it("autentica com email e senha corretos e retorna token", async () => {
      const res = await http.post<{
        token: string;
        accountId: string;
        authId: string;
      }>(`${SERVICES.auth}/login`, { email, password });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
      expect(res.body.accountId).toBeTruthy();
    });

    it("autentica com username e senha corretos", async () => {
      const res = await http.post<{ token: string }>(
        `${SERVICES.auth}/login`,
        { username, password },
      );

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
    });

    it("retorna 400 com senha incorreta", async () => {
      const res = await http.post(`${SERVICES.auth}/login`, {
        email,
        password: "senha_errada",
      });

      expect(res.status).toBe(400);
    });

    it("retorna 400 com email inexistente", async () => {
      const res = await http.post(`${SERVICES.auth}/login`, {
        email: "nao_existe@e2e.test",
        password,
      });

      expect(res.status).toBe(400);
    });

    it("retorna 400 sem fornecer email nem username", async () => {
      const res = await http.post(`${SERVICES.auth}/login`, { password });
      expect(res.status).toBe(400);
    });
  });
});

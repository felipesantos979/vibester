import { describe, it, expect, beforeAll } from "vitest";
import { SERVICES } from "../src/config";
import { http } from "../src/http";
import { registerAndLogin, RegisteredUser } from "../src/auth";

describe("User Service — perfis e follows", () => {
  let userA: RegisteredUser;
  let userB: RegisteredUser;

  beforeAll(async () => {
    [userA, userB] = await Promise.all([
      registerAndLogin("user_a"),
      registerAndLogin("user_b"),
    ]);

    // O user-service cria o perfil via evento Kafka após o registro.
    // Aguarda propagação assíncrona (até 5s).
    await new Promise((r) => setTimeout(r, 3000));
  });

  describe("GET /users/profile/:accountId", () => {
    it("retorna perfil do usuário A após criação via Kafka", async () => {
      const res = await http.get<{ accountId: string; followers: number }>(
        `${SERVICES.user}/users/profile/${userA.accountId}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.accountId).toBe(userA.accountId);
      expect(res.body.followers).toBe(0);
    });

    it("retorna 404 para accountId inexistente", async () => {
      const res = await http.get(
        `${SERVICES.user}/users/profile/00000000-0000-0000-0000-000000000000`,
      );

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /users/profile/bio", () => {
    it("atualiza a bio do usuário A", async () => {
      const res = await http.put<{ bio: string }>(
        `${SERVICES.user}/users/profile/bio`,
        { accountId: userA.accountId, bio: "Bio E2E atualizada" },
        userA.token,
      );

      expect(res.status).toBe(200);
      expect(res.body.bio).toBe("Bio E2E atualizada");
    });
  });

  describe("PUT /users/profile/info", () => {
    it("atualiza nome e username do usuário A", async () => {
      const newUsername = `${userA.username}_upd`;
      const res = await http.put<{ name: string; username: string }>(
        `${SERVICES.user}/users/profile/info`,
        { accountId: userA.accountId, name: "Nome Atualizado E2E", username: newUsername },
        userA.token,
      );

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Nome Atualizado E2E");
      expect(res.body.username).toBe(newUsername);
    });
  });

  describe("PUT /users/profile/avatar", () => {
    it("atualiza o avatarUrl do usuário A", async () => {
      const res = await http.put<{ avatarUrl: string }>(
        `${SERVICES.user}/users/profile/avatar`,
        {
          accountId: userA.accountId,
          avatarUrl: "https://cdn.example.com/avatars/e2e.png",
        },
        userA.token,
      );

      expect(res.status).toBe(200);
      expect(res.body.avatarUrl).toBe("https://cdn.example.com/avatars/e2e.png");
    });
  });

  describe("Follow / Unfollow", () => {
    it("B segue A — contadores incrementam", async () => {
      const res = await http.post<{ followers: number }>(
        `${SERVICES.user}/users/profile/followers/increase`,
        { followerId: userB.accountId, followingId: userA.accountId },
        userB.token,
      );

      expect(res.status).toBe(200);
      expect(res.body.followers).toBe(1);
    });

    it("GET /users/:id/followers retorna B como seguidor de A", async () => {
      const res = await http.get<Array<{ followerId: string }>>(
        `${SERVICES.user}/users/${userA.accountId}/followers`,
      );

      expect(res.status).toBe(200);
      expect(res.body.some((f) => f.followerId === userB.accountId)).toBe(true);
    });

    it("GET /users/:id/following retorna A como seguido por B", async () => {
      const res = await http.get<Array<{ followingId: string }>>(
        `${SERVICES.user}/users/${userB.accountId}/following`,
      );

      expect(res.status).toBe(200);
      expect(res.body.some((f) => f.followingId === userA.accountId)).toBe(true);
    });

    it("B deixa de seguir A — contador decrementa", async () => {
      const res = await http.post<{ followers: number }>(
        `${SERVICES.user}/users/profile/followers/decrease`,
        { followerId: userB.accountId, followingId: userA.accountId },
        userB.token,
      );

      expect(res.status).toBe(200);
      expect(res.body.followers).toBe(0);
    });

    it("GET /users/:id/followers retorna lista vazia após unfollow", async () => {
      const res = await http.get<Array<unknown>>(
        `${SERVICES.user}/users/${userA.accountId}/followers`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it("retorna 400 ao tentar seguir a si mesmo", async () => {
      const res = await http.post(
        `${SERVICES.user}/users/profile/followers/increase`,
        { followerId: userA.accountId, followingId: userA.accountId },
        userA.token,
      );

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });
});

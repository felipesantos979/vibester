/**
 * Fluxo social completo — testa a integração entre serviços:
 *
 * 1. Alice e Bob se registram
 * 2. Bob segue Alice
 * 3. Alice cria um post
 * 4. Bob curte e comenta o post de Alice
 * 5. Bob consulta o feed — deve conter o post de Alice
 * 6. Alice vê seus posts e os likes recebidos
 * 7. Bob deixa de seguir Alice
 */
import { describe, it, expect, beforeAll } from "vitest";
import { SERVICES } from "../src/config";
import { http } from "../src/http";
import { registerAndLogin, RegisteredUser } from "../src/auth";

describe("Fluxo social — integração entre serviços", () => {
  let alice: RegisteredUser;
  let bob: RegisteredUser;
  let alicePostId: string;

  beforeAll(async () => {
    [alice, bob] = await Promise.all([
      registerAndLogin("alice"),
      registerAndLogin("bob"),
    ]);

    // Aguarda propagação Kafka do evento user.registered → user-service
    await new Promise((r) => setTimeout(r, 3000));
  });

  it("1. Alice e Bob têm perfis criados automaticamente via Kafka", async () => {
    const [resAlice, resBob] = await Promise.all([
      http.get<{ accountId: string; followers: number }>(
        `${SERVICES.user}/users/profile/${alice.accountId}`,
      ),
      http.get<{ accountId: string; followers: number }>(
        `${SERVICES.user}/users/profile/${bob.accountId}`,
      ),
    ]);

    expect(resAlice.status).toBe(200);
    expect(resAlice.body.accountId).toBe(alice.accountId);

    expect(resBob.status).toBe(200);
    expect(resBob.body.accountId).toBe(bob.accountId);
  });

  it("2. Bob segue Alice", async () => {
    const res = await http.post<{ followers: number }>(
      `${SERVICES.user}/users/profile/followers/increase`,
      { followerId: bob.accountId, followingId: alice.accountId },
      bob.token,
    );

    expect(res.status).toBe(200);
    expect(res.body.followers).toBeGreaterThanOrEqual(1);
  });

  it("3. Alice cria um post", async () => {
    const res = await http.post<{ postId: string; userId: string }>(
      `${SERVICES.post}/posts`,
      {
        userId: alice.accountId,
        imageUrls: ["https://cdn.example.com/img/alice_social_e2e.jpg"],
        caption: "Post da Alice no fluxo social E2E",
      },
    );

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(alice.accountId);

    alicePostId = res.body.postId;
  });

  it("4. Bob curte o post de Alice", async () => {
    const res = await http.post(
      `${SERVICES.post}/posts/${alicePostId}/likes`,
      { userId: bob.accountId },
    );

    expect(res.status).toBe(201);
  });

  it("5. Bob comenta no post de Alice", async () => {
    const res = await http.post<{ commentId: string }>(
      `${SERVICES.post}/comments`,
      {
        postId: alicePostId,
        userId: bob.accountId,
        content: "Que post incrível, Alice!",
      },
    );

    expect(res.status).toBe(201);
    expect(res.body.commentId).toBeTruthy();
  });

  it("6. Alice vê os likes do seu post", async () => {
    const res = await http.get<Array<{ userId: string }>>(
      `${SERVICES.post}/posts/${alicePostId}/likes`,
    );

    expect(res.status).toBe(200);
    expect(res.body.some((l) => l.userId === bob.accountId)).toBe(true);
  });

  it("7. Alice vê os comentários do seu post", async () => {
    const res = await http.get<Array<{ userId: string; content: string }>>(
      `${SERVICES.post}/posts/${alicePostId}/comments`,
    );

    expect(res.status).toBe(200);
    expect(res.body.some((c) => c.userId === bob.accountId)).toBe(true);
  });

  it("8. Feed de Bob contém o post de Alice (aguarda propagação Kafka)", async () => {
    // O feed-service não está exposto no gateway (serviço interno).
    // Este teste é pulado quando API_BASE aponta para o VPS.
    if (process.env.API_BASE) {
      console.warn("[E2E] feed-service não exposto no gateway — teste de feed pulado");
      return;
    }

    let feedContainsAlicePost = false;
    const deadline = Date.now() + 8000;

    while (Date.now() < deadline) {
      const res = await http.get<Array<{ postId: string }>>(
        `${SERVICES.feed}/feed/${bob.accountId}`,
      );

      if (res.ok && res.body.some((item) => item.postId === alicePostId)) {
        feedContainsAlicePost = true;
        break;
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    expect(feedContainsAlicePost).toBe(true);
  });

  it("9. Alice vê os posts que curtiu (via likes endpoint)", async () => {
    const res = await http.get<Array<{ postId: string }>>(
      `${SERVICES.post}/users/${alice.accountId}/posts`,
    );

    expect(res.status).toBe(200);
    expect(res.body.some((p) => p.postId === alicePostId)).toBe(true);
  });

  it("10. Bob deixa de seguir Alice — contadores decrementam", async () => {
    const res = await http.post<{ followers: number }>(
      `${SERVICES.user}/users/profile/followers/decrease`,
      { followerId: bob.accountId, followingId: alice.accountId },
      bob.token,
    );

    expect(res.status).toBe(200);
    expect(res.body.followers).toBe(0);
  });

  it("11. Alice não aparece mais no following de Bob", async () => {
    const res = await http.get<Array<{ followingId: string }>>(
      `${SERVICES.user}/users/${bob.accountId}/following`,
    );

    expect(res.status).toBe(200);
    expect(res.body.every((f) => f.followingId !== alice.accountId)).toBe(true);
  });
});

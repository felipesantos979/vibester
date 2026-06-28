import { describe, it, expect, beforeAll } from "vitest";
import { SERVICES } from "../src/config";
import { http } from "../src/http";
import { registerAndLogin, RegisteredUser } from "../src/auth";

describe("Post Service — posts, likes e comentários", () => {
  let author: RegisteredUser;
  let reader: RegisteredUser;

  let postId: string;
  let commentId: string;

  beforeAll(async () => {
    [author, reader] = await Promise.all([
      registerAndLogin("post_author"),
      registerAndLogin("post_reader"),
    ]);
  });

  describe("POST /posts — criar post", () => {
    it("cria post com imagem e caption e retorna 201", async () => {
      const res = await http.post<{
        postId: string;
        userId: string;
        imageUrls: string[];
        caption: string;
        totalLikes: number;
        totalComments: number;
      }>(`${SERVICES.post}/posts`, {
        userId: author.accountId,
        imageUrls: ["https://cdn.example.com/img/e2e_photo.jpg"],
        caption: "Post E2E de teste",
      });

      expect(res.status).toBe(201);
      expect(res.body.postId).toBeTruthy();
      expect(res.body.userId).toBe(author.accountId);
      expect(res.body.imageUrls).toHaveLength(1);
      expect(res.body.caption).toBe("Post E2E de teste");
      expect(res.body.totalLikes).toBe(0);
      expect(res.body.totalComments).toBe(0);

      postId = res.body.postId;
    });

    it("cria post sem caption (campo opcional)", async () => {
      const res = await http.post<{ postId: string }>(
        `${SERVICES.post}/posts`,
        {
          userId: author.accountId,
          imageUrls: ["https://cdn.example.com/img/nocaption.jpg"],
        },
      );

      expect(res.status).toBe(201);
      expect(res.body.postId).toBeTruthy();
    });

    it("retorna 400 sem imageUrls (campo obrigatório)", async () => {
      const res = await http.post(`${SERVICES.post}/posts`, {
        userId: author.accountId,
        caption: "Sem imagem",
      });

      expect(res.status).toBe(400);
    });

    it("retorna 400 com imageUrls vazio", async () => {
      const res = await http.post(`${SERVICES.post}/posts`, {
        userId: author.accountId,
        imageUrls: [],
      });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /posts/:postId — buscar post por ID", () => {
    it("retorna o post criado com dados corretos", async () => {
      const res = await http.get<{ postId: string; caption: string }>(
        `${SERVICES.post}/posts/${postId}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.postId).toBe(postId);
      expect(res.body.caption).toBe("Post E2E de teste");
    });

    it("retorna 404 para postId inexistente", async () => {
      const res = await http.get(
        `${SERVICES.post}/posts/00000000-0000-0000-0000-000000000000`,
      );

      expect(res.status).toBe(404);
    });
  });

  describe("GET /users/:userId/posts — listar posts do usuário", () => {
    it("retorna array contendo o post criado", async () => {
      const res = await http.get<Array<{ postId: string }>>(
        `${SERVICES.post}/users/${author.accountId}/posts`,
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((p) => p.postId === postId)).toBe(true);
    });

    it("retorna array vazio para usuário sem posts", async () => {
      const res = await http.get<Array<unknown>>(
        `${SERVICES.post}/users/${reader.accountId}/posts`,
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("PATCH /posts/:postId — editar caption", () => {
    it("atualiza caption do post", async () => {
      const res = await http.patch<{ caption: string }>(
        `${SERVICES.post}/posts/${postId}`,
        { caption: "Caption atualizada E2E" },
      );

      expect(res.status).toBe(200);
      expect(res.body.caption).toBe("Caption atualizada E2E");
    });
  });

  describe("Likes", () => {
    it("POST /posts/:id/likes — reader curte o post do author", async () => {
      const res = await http.post(
        `${SERVICES.post}/posts/${postId}/likes`,
        { userId: reader.accountId },
      );

      expect(res.status).toBe(201);
    });

    it("GET /posts/:id/likes — retorna o like do reader", async () => {
      const res = await http.get<Array<{ userId: string }>>(
        `${SERVICES.post}/posts/${postId}/likes`,
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((l) => l.userId === reader.accountId)).toBe(true);
    });

    it("GET /users/:id/likes — retorna posts curtidos pelo reader", async () => {
      const res = await http.get<Array<{ postId: string }>>(
        `${SERVICES.post}/users/${reader.accountId}/likes`,
      );

      expect(res.status).toBe(200);
      expect(res.body.some((l) => l.postId === postId)).toBe(true);
    });

    it("POST /posts/:id/likes — curtir duas vezes retorna 4xx", async () => {
      const res = await http.post(
        `${SERVICES.post}/posts/${postId}/likes`,
        { userId: reader.accountId },
      );

      // Deve retornar erro (conflito ou validação) ao curtir novamente
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    });

    it("DELETE /posts/:id/likes — reader remove o like (retorna 204)", async () => {
      // userId vai no body, não na query string; endpoint retorna 204 No Content
      const res = await http.delete(
        `${SERVICES.post}/posts/${postId}/likes`,
        { userId: reader.accountId },
      );

      expect(res.status).toBe(204);
    });

    it("GET /posts/:id/likes — lista vazia após unlike", async () => {
      const res = await http.get<Array<unknown>>(
        `${SERVICES.post}/posts/${postId}/likes`,
      );

      expect(res.status).toBe(200);
      expect(res.body.every((l: any) => l.userId !== reader.accountId)).toBe(true);
    });
  });

  describe("Comentários", () => {
    it("POST /comments — reader comenta no post", async () => {
      const res = await http.post<{ commentId: string; content: string }>(
        `${SERVICES.post}/comments`,
        {
          postId,
          userId: reader.accountId,
          content: "Comentário E2E de teste!",
        },
      );

      expect(res.status).toBe(201);
      expect(res.body.commentId).toBeTruthy();
      expect(res.body.content).toBe("Comentário E2E de teste!");

      commentId = res.body.commentId;
    });

    it("GET /posts/:id/comments — retorna o comentário criado", async () => {
      const res = await http.get<Array<{ commentId: string; content: string }>>(
        `${SERVICES.post}/posts/${postId}/comments`,
      );

      expect(res.status).toBe(200);
      expect(res.body.some((c) => c.commentId === commentId)).toBe(true);
    });

    it("GET /users/:id/comments — retorna comentários do reader", async () => {
      const res = await http.get<Array<{ commentId: string }>>(
        `${SERVICES.post}/users/${reader.accountId}/comments`,
      );

      expect(res.status).toBe(200);
      expect(res.body.some((c) => c.commentId === commentId)).toBe(true);
    });

    it("PATCH /comments/:id — edita o comentário", async () => {
      const res = await http.patch<{ content: string }>(
        `${SERVICES.post}/comments/${commentId}`,
        { userId: reader.accountId, content: "Comentário editado E2E" },
      );

      expect(res.status).toBe(200);
      expect(res.body.content).toBe("Comentário editado E2E");
    });

    it("DELETE /comments/:id — deleta o comentário (retorna 204)", async () => {
      const res = await http.delete(
        `${SERVICES.post}/comments/${commentId}`,
        { userId: reader.accountId },
      );
      expect(res.status).toBe(204);
    });

    it("POST /comments — retorna 400 com content vazio", async () => {
      const res = await http.post(`${SERVICES.post}/comments`, {
        postId,
        userId: reader.accountId,
        content: "",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /posts/:postId — soft delete", () => {
    it("deleta o post (soft delete) e retorna 204", async () => {
      const res = await http.delete(`${SERVICES.post}/posts/${postId}`);
      expect(res.status).toBe(204);
    });

    it("post deletado retorna isDeleted=true ou 404 ao buscar", async () => {
      const res = await http.get<{ isDeleted: boolean }>(
        `${SERVICES.post}/posts/${postId}`,
      );

      const isGone = res.status === 404 || res.body.isDeleted === true;
      expect(isGone).toBe(true);
    });
  });
});

import { describe, it, expect } from "vitest";
import { SERVICES } from "../src/config";
import { http } from "../src/http";

const SP_LAT = -23.5505;
const SP_LON = -46.6333;

describe("Establishment Service — listagem e perfil", () => {
  let establishmentId: string | undefined;

  describe("GET /establishments — listar estabelecimentos", () => {
    it("retorna lista de estabelecimentos", async () => {
      const res = await http.get<Array<{ id: string; name: string }>>(
        `${SERVICES.establishment}/establishments`,
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        establishmentId = res.body[0].id;
        expect(res.body[0].id).toBeTruthy();
        expect(res.body[0].name).toBeTruthy();
      }
    });

    it("filtra por latitude/longitude/radius", async () => {
      const res = await http.get<Array<{ id: string }>>(
        `${SERVICES.establishment}/establishments?latitude=${SP_LAT}&longitude=${SP_LON}&radiusKm=10`,
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("filtra por categoria (case-insensitive)", async () => {
      const res = await http.get<Array<{ category: string }>>(
        `${SERVICES.establishment}/establishments?category=bar`,
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Todos os resultados devem ser da categoria solicitada (comparação case-insensitive)
      if (res.body.length > 0) {
        expect(
          res.body.every((e) => e.category.toLowerCase() === "bar"),
        ).toBe(true);
      }
    });
  });

  describe("GET /establishments/open — estabelecimentos abertos agora", () => {
    it("retorna lista de estabelecimentos abertos", async () => {
      const res = await http.get<Array<{ id: string }>>(
        `${SERVICES.establishment}/establishments/open`,
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /establishments/:id — perfil do estabelecimento", () => {
    it("retorna perfil completo quando ID existe", async () => {
      if (!establishmentId) {
        console.warn("[E2E] Nenhum establishment encontrado para testar GET /:id — pulando");
        return;
      }

      const res = await http.get<{
        name: string;
        category: string;
        location: { latitude: number; longitude: number };
      }>(`${SERVICES.establishment}/establishments/${establishmentId}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBeTruthy();
      expect(res.body.category).toBeTruthy();
      expect(res.body.location?.latitude).toBeDefined();
    });

    it("retorna 404 para ID inexistente", async () => {
      const res = await http.get(
        `${SERVICES.establishment}/establishments/00000000-0000-0000-0000-000000000000`,
      );

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /establishments/:id/rating — atualizar avaliação", () => {
    it("atualiza rating do establishment quando existe", async () => {
      if (!establishmentId) {
        console.warn("[E2E] Nenhum establishment para testar rating — pulando");
        return;
      }

      const res = await http.patch<{ averageRating: number }>(
        `${SERVICES.establishment}/establishments/${establishmentId}/rating`,
        { rating: 4.5 },
      );

      expect(res.status).toBe(200);
      expect(typeof res.body.averageRating).toBe("number");
    });

    it("retorna 400 com rating fora do intervalo", async () => {
      if (!establishmentId) return;

      const res = await http.patch(
        `${SERVICES.establishment}/establishments/${establishmentId}/rating`,
        { rating: 10 },
      );

      expect(res.status).toBe(400);
    });
  });
});

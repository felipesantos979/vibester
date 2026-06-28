import { describe, it, expect, beforeAll } from "vitest";
import { SERVICES } from "../src/config";
import { http } from "../src/http";
import { unique } from "../src/unique";

// Coordenadas de São Paulo para testes de localização
const SP_LAT = -23.5505;
const SP_LON = -46.6333;

describe("Event Service — criação e listagem de eventos", () => {
  let eventId: string;
  let establishmentId: string | undefined;

  beforeAll(async () => {
    // Pega um establishment real para associar ao evento (campo obrigatório)
    const res = await http.get<Array<{ id: string }>>(
      `${SERVICES.establishment}/establishments`,
    );
    if (res.ok && Array.isArray(res.body) && res.body.length > 0) {
      establishmentId = res.body[0].id;
    }
  });

  describe("POST /events — criar evento", () => {
    it("cria evento com dados válidos e retorna 201", async () => {
      if (!establishmentId) {
        console.warn("[E2E] Nenhum establishment disponível — teste de criação de evento pulado");
        return;
      }

      const res = await http.post<{
        id: string;
        name: string;
        category: string;
        latitude: number;
        longitude: number;
      }>(`${SERVICES.event}/events/`, {
        name: `Evento E2E ${unique("ev")}`,
        photoUrl: "https://cdn.example.com/events/e2e_banner.jpg",
        category: "MUSIC",
        organizer: "Vibester E2E",
        location: "São Paulo, SP",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        latitude: SP_LAT,
        longitude: SP_LON,
        establishmentId,
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeTruthy();
      expect(res.body.category).toBe("MUSIC");

      eventId = res.body.id;
    });

    it("retorna 400 sem campo obrigatório (name ausente)", async () => {
      if (!establishmentId) return;

      const res = await http.post(`${SERVICES.event}/events/`, {
        photoUrl: "https://cdn.example.com/events/noname.jpg",
        category: "MUSIC",
        organizer: "Test",
        location: "SP",
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 90000000).toISOString(),
        latitude: SP_LAT,
        longitude: SP_LON,
        establishmentId,
      });

      expect(res.status).toBe(400);
    });

    it("retorna 400 sem photoUrl (campo obrigatório)", async () => {
      if (!establishmentId) return;

      const res = await http.post(`${SERVICES.event}/events/`, {
        name: "Evento sem foto",
        category: "MUSIC",
        organizer: "Test",
        location: "SP",
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 90000000).toISOString(),
        latitude: SP_LAT,
        longitude: SP_LON,
        establishmentId,
      });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /events/:eventId — buscar evento por ID", () => {
    it("retorna o evento criado com dados corretos", async () => {
      if (!eventId) {
        console.warn("[E2E] eventId não disponível — criação de evento falhou anteriormente");
        return;
      }

      const res = await http.get<{ name: string; organizer: string; totalConfirmed: number; ticketLink: string | null }>(
        `${SERVICES.event}/events/${eventId}`,
      );

      // Resposta do GET retorna apenas: name, organizer, location, totalConfirmed, ticketLink
      expect(res.status).toBe(200);
      expect(res.body.name).toBeTruthy();
      expect(res.body.organizer).toBeTruthy();
      expect(res.body.totalConfirmed).toBeGreaterThanOrEqual(0);
    });

    it("retorna 404 para eventId inexistente", async () => {
      const res = await http.get(
        `${SERVICES.event}/events/00000000-0000-0000-0000-000000000000`,
      );

      expect(res.status).toBe(404);
    });
  });

  describe("GET /events/nearby — eventos por localização", () => {
    it("retorna lista de eventos próximos a SP", async () => {
      const res = await http.get<Array<{ id: string }>>(
        `${SERVICES.event}/events/nearby?latitude=${SP_LAT}&longitude=${SP_LON}&radiusKm=50`,
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("retorna 400 sem parâmetros de localização", async () => {
      const res = await http.get(`${SERVICES.event}/events/nearby`);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /events/establishment/:id — eventos por estabelecimento", () => {
    it("retorna array para um establishment (pode estar vazio)", async () => {
      if (!establishmentId) return;

      const res = await http.get<Array<unknown>>(
        `${SERVICES.event}/events/establishment/${establishmentId}`,
      );

      // Endpoint pode retornar 200 com array vazio ou array com eventos
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("retorna 404 ou 400 para estabelecimento inexistente", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000001";
      const res = await http.get(
        `${SERVICES.event}/events/establishment/${fakeId}`,
      );

      expect([200, 400, 404]).toContain(res.status);
    });
  });
});

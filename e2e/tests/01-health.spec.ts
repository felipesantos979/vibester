import { describe, it, expect } from "vitest";
import { SERVICES } from "../src/config";
import { http } from "../src/http";

describe("Health checks — todos os serviços", () => {
  // feed-service não possui rota exposta no gateway (serviço interno)
  const endpoints = [
    { name: "auth-service",          url: `${SERVICES.auth}/health` },
    { name: "user-service",          url: `${SERVICES.user}/health` },
    { name: "post-service",          url: `${SERVICES.post}/health` },
    { name: "event-service",         url: `${SERVICES.event}/health` },
    { name: "establishment-service", url: `${SERVICES.establishment}/health` },
  ];

  for (const { name, url } of endpoints) {
    it(`${name} responde 200 com { status: "ok" }`, async () => {
      const res = await http.get<{ status: string }>(url);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: "ok" });
    });
  }
});

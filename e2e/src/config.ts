import { loadEnv } from "./env";

loadEnv();

// Se API_BASE estiver definido, usa gateway único (VPS com Traefik).
// Senão, usa URLs individuais por porta (desenvolvimento local).
const API_BASE = process.env.API_BASE?.replace(/\/$/, "");

function serviceUrl(localDefault: string, gatewayPrefix: string): string {
  if (API_BASE) return `${API_BASE}/${gatewayPrefix}`;
  return process.env[`${gatewayPrefix.toUpperCase()}_URL`] ?? localDefault;
}

export const SERVICES = {
  auth:          serviceUrl("http://localhost:3001", "auth"),
  user:          serviceUrl("http://localhost:3003", "user"),
  post:          serviceUrl("http://localhost:3000", "post"),
  feed:          serviceUrl("http://localhost:3006", "feed"),
  event:         serviceUrl("http://localhost:3334", "event"),
  establishment: serviceUrl("http://localhost:3002", "establishment"),
  scrapping:     serviceUrl("http://localhost:3005", "scrapping"),
} as const;

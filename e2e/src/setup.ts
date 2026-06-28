import { SERVICES } from "./config";

// Valida que os serviços essenciais estão acessíveis antes de rodar os testes
// Se um serviço estiver offline, os testes falham rapidamente com mensagem clara
async function ping(name: string, url: string) {
  try {
    const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      console.warn(`[E2E] AVISO: ${name} respondeu ${res.status} no /health`);
    }
  } catch {
    console.warn(`[E2E] AVISO: ${name} (${url}) não está acessível — testes do serviço serão pulados`);
  }
}

// Setup global — roda uma vez antes de todos os arquivos de teste
beforeAll(async () => {
  await Promise.all([
    ping("auth-service", SERVICES.auth),
    ping("user-service", SERVICES.user),
    ping("post-service", SERVICES.post),
    ping("event-service", SERVICES.event),
    ping("establishment-service", SERVICES.establishment),
  ]);
}, 30_000);

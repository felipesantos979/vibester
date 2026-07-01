/**
 * Smoke Test — Verificação rápida de sanidade
 *
 * 2 VUs, 1 minuto. Percorre health checks de auth, user e event + um ciclo
 * mínimo de escrita e leitura. Objetivo: confirmar que tudo está de pé antes
 * de rodar cenários mais pesados.
 *
 * post-service e feed-service (Cassandra) e establishment-service (bucket R2)
 * ficam de fora por dependerem de bancos/storages externos.
 *
 * Uso:
 *   k6 run load-tests/scenarios/01-smoke.js \
 *     --out influxdb=http://localhost:8086/k6
 */
import { sleep } from 'k6';
import { SERVICES, SLA } from '../config/base.js';
import { TREND_STATS } from '../config/thresholds.js';
import { get, ok } from '../helpers/http.js';
import { authWriteFlow } from '../flows/write-flows.js';
import { eventReadFlow, profileReadFlow } from '../flows/read-flows.js';
import { handleSummary as makeSummary } from '../summary/index.js';

export const options = {
  scenarios: {
    smoke: {
      executor:    'shared-iterations',
      vus:         2,
      iterations:  20,
      maxDuration: '2m',
    },
  },
  thresholds: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: [`p(95)<${SLA.p95_ms}`, `p(99)<${SLA.p99_ms}`],
    http_req_waiting:  [`p(95)<${SLA.ttfb_ms}`],
  },
  summaryTrendStats: TREND_STATS,
};

const HEALTH_CHECKS = [
  { url: `${SERVICES.auth}/health`,  service: 'auth'  },
  { url: `${SERVICES.user}/health`,  service: 'user'  },
  { url: `${SERVICES.event}/health`, service: 'event' },
];

export default function () {
  // Health check de todos os serviços
  for (const { url, service } of HEALTH_CHECKS) {
    const res = get(url, { tags: { endpoint: 'health', service } });
    ok(res, `health:${service}`);
  }
  sleep(0.2);

  // Fluxo mínimo de auth (escrita)
  authWriteFlow();
  sleep(0.2);

  // Leituras básicas
  eventReadFlow();
  sleep(0.2);
  profileReadFlow();
  sleep(1);
}

export function handleSummary(data) {
  return makeSummary(data, '01-smoke');
}

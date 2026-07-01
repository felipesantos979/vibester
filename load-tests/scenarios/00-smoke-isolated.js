/**
 * Smoke Test — Ambiente de teste isolado (namespace loadtest)
 *
 * Versão do smoke test restrita aos serviços isoláveis via Postgres próprio:
 * auth, user, event. post-service e feed-service ficam de fora porque
 * dependem do Astra/Cassandra externo, e establishment-service porque
 * depende de bucket R2 — nenhum isolável via k8s puro.
 *
 * Uso:
 *   k6 run load-tests/scenarios/00-smoke-isolated.js \
 *     -e AUTH_URL=http://localhost:13001 \
 *     -e USER_URL=http://localhost:13003 \
 *     -e EVENT_URL=http://localhost:13334
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
  for (const { url, service } of HEALTH_CHECKS) {
    const res = get(url, { tags: { endpoint: 'health', service } });
    ok(res, `health:${service}`);
  }
  sleep(0.2);

  authWriteFlow();
  sleep(0.2);

  eventReadFlow();
  sleep(0.2);
  profileReadFlow();
  sleep(1);
}

export function handleSummary(data) {
  return makeSummary(data, '00-smoke-isolated');
}

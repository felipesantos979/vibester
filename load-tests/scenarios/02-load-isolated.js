/**
 * Load Test — Ambiente de teste isolado (namespace loadtest)
 *
 * Versão do 02-load.js restrita aos serviços isoláveis via Postgres próprio:
 * event, establishment, user. post-service e feed-service ficam de fora
 * (dependem do Astra/Cassandra externo, não isolável via k8s puro).
 *
 * Sem rate-limit de produção interferindo e sem gerar dado real — o banco
 * inteiro é descartável (namespace loadtest + deployments *-loadtest).
 *
 * Uso:
 *   k6 run load-tests/scenarios/02-load-isolated.js \
 *     -e AUTH_URL=http://localhost:13001 \
 *     -e USER_URL=http://localhost:13003 \
 *     -e ESTABLISHMENT_URL=http://localhost:13002 \
 *     -e EVENT_URL=http://localhost:13334 \
 *     -e SEED_ACCOUNT_ID=<accountId de k6_test_01 no ambiente isolado> \
 *     -e SEED_ESTABLISHMENT_ID=11111111-1111-4111-8111-111111111111 \
 *     -e LOAD_VUS=100
 */
import { sleep } from 'k6';
import { VUS } from '../config/base.js';
import { THRESHOLDS, TREND_STATS } from '../config/thresholds.js';
import { establishmentListFlow, eventReadFlow, profileReadFlow } from '../flows/read-flows.js';
import { createEventFlow, followFlow } from '../flows/write-flows.js';
import { SEED_ACCOUNT_ID } from '../helpers/data.js';
import { handleSummary as makeSummary } from '../summary/index.js';

const TARGET = VUS.load;

function isolatedReadFlow() {
  eventReadFlow();
  sleep(0.2);
  establishmentListFlow();
  sleep(0.2);
  profileReadFlow();
}

function isolatedWriteFlow() {
  createEventFlow();
  sleep(0.3);
  followFlow(SEED_ACCOUNT_ID);
}

export const options = {
  scenarios: {
    readers: {
      executor:  'ramping-vus',
      startVUs:  0,
      stages: [
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.3) },
        { duration: '5m', target: Math.ceil(TARGET * 0.6) },
        { duration: '3m', target: Math.ceil(TARGET * 0.6) },
        { duration: '2m', target: 0 },
      ],
      exec: 'runRead',
    },
    writers: {
      executor:  'ramping-vus',
      startVUs:  0,
      stages: [
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.3) },
        { duration: '5m', target: Math.ceil(TARGET * 0.4) },
        { duration: '3m', target: Math.ceil(TARGET * 0.4) },
        { duration: '2m', target: 0 },
      ],
      exec: 'runWrite',
    },
  },
  thresholds: THRESHOLDS.load,
  summaryTrendStats: TREND_STATS,
};

export function runRead() {
  isolatedReadFlow();
  sleep(1);
}

export function runWrite() {
  isolatedWriteFlow();
  sleep(1);
}

export function handleSummary(data) {
  return makeSummary(data, '02-load-isolated');
}

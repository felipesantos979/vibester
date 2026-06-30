/**
 * Soak Test — Carga sustentada por longa duração
 *
 * Mantém carga normal (50 VUs) por 1 hora. Objetivo: detectar degradação
 * gradual causada por memory leaks, crescimento de pool de conexões,
 * acúmulo de dados no Redis ou comportamento diferenciado do GC ao longo
 * do tempo.
 *
 * O que observar no Grafana durante o soak:
 *   - Memória heap Node.js (nodejs_heap_size_used_bytes) crescendo linearmente?
 *   - Pool de conexões do Postgres esgotando?
 *   - Latência p99 subindo progressivamente?
 *   - Taxa de erro aumentando com o tempo?
 *
 * Duração padrão: 1h (sobrescreva com SOAK_DURATION)
 *
 * Uso:
 *   k6 run load-tests/scenarios/05-soak.js \
 *     --out influxdb=http://localhost:8086/k6 \
 *     -e SOAK_VUS=50 -e SOAK_DURATION=1h
 */
import { sleep } from 'k6';
import { VUS } from '../config/base.js';
import { THRESHOLDS, TREND_STATS } from '../config/thresholds.js';
import { mixedReadFlow } from '../flows/read-flows.js';
import { mixedWriteFlow, createPostFlow } from '../flows/write-flows.js';
import { handleSummary as makeSummary } from '../summary/index.js';

const TARGET   = VUS.soak;
const DURATION = __ENV.SOAK_DURATION || '1h';

export const options = {
  scenarios: {
    soak_readers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m',      target: Math.ceil(TARGET * 0.6) },  // warm-up
        { duration: DURATION,  target: Math.ceil(TARGET * 0.6) },  // soak
        { duration: '5m',      target: 0 },
      ],
      exec: 'runRead',
    },
    soak_writers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m',      target: Math.ceil(TARGET * 0.4) },
        { duration: DURATION,  target: Math.ceil(TARGET * 0.4) },
        { duration: '5m',      target: 0 },
      ],
      exec: 'runWrite',
    },
  },
  thresholds: THRESHOLDS.soak,
  summaryTrendStats: TREND_STATS,
};

export function runRead() {
  mixedReadFlow();
  sleep(1.5);
}

export function runWrite() {
  // Menor frequência de escrita para simular uso realista
  if (__ITER % 3 === 0) {
    mixedWriteFlow();
  } else {
    createPostFlow();
  }
  sleep(2);
}

export function handleSummary(data) {
  return makeSummary(data, '05-soak');
}

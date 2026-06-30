/**
 * Stress Test — Carga progressivamente alta
 *
 * Sobe VUs em degraus (25% → 50% → 75% → 100% → descida) muito além do
 * esperado em produção. Objetivo: identificar onde a latência começa a degradar
 * e verificar se o sistema se recupera após o pico.
 *
 * Thresholds relaxados:
 *   p95 < 2000ms | p99 < 4000ms | error rate < 5%
 *
 * Uso:
 *   k6 run load-tests/scenarios/03-stress.js \
 *     --out influxdb=http://localhost:8086/k6 \
 *     -e STRESS_VUS=200
 */
import { sleep } from 'k6';
import { VUS } from '../config/base.js';
import { THRESHOLDS, TREND_STATS } from '../config/thresholds.js';
import { mixedReadFlow } from '../flows/read-flows.js';
import { mixedWriteFlow } from '../flows/write-flows.js';
import { handleSummary as makeSummary } from '../summary/index.js';

const TARGET = VUS.stress;

export const options = {
  scenarios: {
    readers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.25) },
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.5)  },
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.75) },
        { duration: '3m', target: Math.ceil(TARGET * 0.6)        },
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.5)  },
        { duration: '1m', target: 0 },
      ],
      exec: 'runRead',
    },
    writers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.25) },
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.5)  },
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.75) },
        { duration: '3m', target: Math.ceil(TARGET * 0.4)        },
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.5)  },
        { duration: '1m', target: 0 },
      ],
      exec: 'runWrite',
    },
  },
  thresholds: THRESHOLDS.stress,
  summaryTrendStats: TREND_STATS,
};

export function runRead() {
  mixedReadFlow();
  sleep(0.5);
}

export function runWrite() {
  mixedWriteFlow();
  sleep(0.5);
}

export function handleSummary(data) {
  return makeSummary(data, '03-stress');
}

/**
 * Load Test — Carga normal de produção
 *
 * Simula o tráfego esperado em horário de pico: 60% leitura, 40% escrita.
 * Objetivo: validar SLA de latência e disponibilidade sob uso típico.
 *
 * Thresholds:
 *   p95 < 500ms | p99 < 1000ms | TTFB p95 < 200ms | error rate < 1%
 *
 * Uso:
 *   k6 run load-tests/scenarios/02-load.js \
 *     --out influxdb=http://localhost:8086/k6 \
 *     -e LOAD_VUS=50
 */
import { sleep } from 'k6';
import { VUS } from '../config/base.js';
import { THRESHOLDS, TREND_STATS } from '../config/thresholds.js';
import { mixedReadFlow } from '../flows/read-flows.js';
import { mixedWriteFlow } from '../flows/write-flows.js';
import { handleSummary as makeSummary } from '../summary/index.js';

const TARGET = VUS.load;

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
  mixedReadFlow();
  sleep(1);
}

export function runWrite() {
  mixedWriteFlow();
  sleep(1);
}

export function handleSummary(data) {
  return makeSummary(data, '02-load');
}

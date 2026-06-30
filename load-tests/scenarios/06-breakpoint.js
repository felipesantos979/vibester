/**
 * Breakpoint Test — Encontrar o ponto de ruptura
 *
 * Aumenta VUs linearmente de 0 até BREAK_VUS (padrão: 1000). O teste
 * observa em que ponto o sistema começa a falhar irrecuperavelmente.
 *
 * ⚠️  Execute apenas em ambiente isolado — pode derrubar o serviço.
 *
 * O que o relatório captura:
 *   - VUs no momento em que p99 cruzou o threshold
 *   - VUs no momento em que error rate cruzou 1%, 5%, 10%
 *   - Throughput máximo antes da degradação
 *   - Bottleneck mais provável (CPU via Prometheus ou DB via pool exhaustion)
 *
 * Uso:
 *   k6 run load-tests/scenarios/06-breakpoint.js \
 *     --out influxdb=http://localhost:8086/k6 \
 *     -e BREAK_VUS=1000
 */
import { sleep } from 'k6';
import { VUS } from '../config/base.js';
import { THRESHOLDS, TREND_STATS } from '../config/thresholds.js';
import { mixedReadFlow } from '../flows/read-flows.js';
import { mixedWriteFlow } from '../flows/write-flows.js';
import { handleSummary as makeSummary } from '../summary/index.js';

const TARGET = VUS.breakpoint;

export const options = {
  scenarios: {
    bp_readers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.1) },
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.2) },
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.3) },
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.5) },
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.7) },
        { duration: '2m', target: Math.ceil(TARGET * 0.6 * 0.85) },
        { duration: '3m', target: Math.ceil(TARGET * 0.6) },
        { duration: '2m', target: 0 },
      ],
      exec: 'runRead',
    },
    bp_writers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.1) },
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.2) },
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.3) },
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.5) },
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.7) },
        { duration: '2m', target: Math.ceil(TARGET * 0.4 * 0.85) },
        { duration: '3m', target: Math.ceil(TARGET * 0.4) },
        { duration: '2m', target: 0 },
      ],
      exec: 'runWrite',
    },
  },
  // Sem abort em thresholds — queremos observar até o fim
  thresholds: THRESHOLDS.breakpoint,
  summaryTrendStats: TREND_STATS,
};

export function runRead() {
  mixedReadFlow();
  sleep(0.2);
}

export function runWrite() {
  mixedWriteFlow();
  sleep(0.2);
}

export function handleSummary(data) {
  return makeSummary(data, '06-breakpoint');
}

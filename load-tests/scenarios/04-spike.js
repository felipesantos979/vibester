/**
 * Spike Test — Pico súbito de tráfego
 *
 * Simula um evento viral: tráfego sobe de 0 para o pico em segundos, mantém
 * por curto período e volta ao normal. Objetivo: verificar se o sistema
 * degrada graciosamente ou falha abruptamente, e quanto tempo leva para
 * se recuperar após o pico.
 *
 * Perguntas respondidas:
 *   - O sistema aceita ou rejeita (503) sob spike?
 *   - Latência retorna ao normal após o pico?
 *   - Há memory leak / recursos não liberados após o spike?
 *
 * Uso:
 *   k6 run load-tests/scenarios/04-spike.js \
 *     --out influxdb=http://localhost:8086/k6 \
 *     -e SPIKE_VUS=400
 */
import { sleep } from 'k6';
import { VUS } from '../config/base.js';
import { THRESHOLDS, TREND_STATS } from '../config/thresholds.js';
import { mixedReadFlow } from '../flows/read-flows.js';
import { mixedWriteFlow } from '../flows/write-flows.js';
import { handleSummary as makeSummary } from '../summary/index.js';

const BASE  = Math.ceil(VUS.load  * 0.6);  // carga normal pré-spike
const PEAK  = VUS.spike;                    // pico do spike

export const options = {
  scenarios: {
    spike_readers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m',  target: Math.ceil(BASE * 0.6) },   // aquecimento
        { duration: '30s', target: Math.ceil(PEAK * 0.6) },   // spike
        { duration: '2m',  target: Math.ceil(PEAK * 0.6) },   // mantém pico
        { duration: '30s', target: Math.ceil(BASE * 0.6) },   // queda brusca
        { duration: '3m',  target: Math.ceil(BASE * 0.6) },   // recuperação
        { duration: '1m',  target: 0 },
      ],
      exec: 'runRead',
    },
    spike_writers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m',  target: Math.ceil(BASE * 0.4) },
        { duration: '30s', target: Math.ceil(PEAK * 0.4) },
        { duration: '2m',  target: Math.ceil(PEAK * 0.4) },
        { duration: '30s', target: Math.ceil(BASE * 0.4) },
        { duration: '3m',  target: Math.ceil(BASE * 0.4) },
        { duration: '1m',  target: 0 },
      ],
      exec: 'runWrite',
    },
  },
  thresholds: THRESHOLDS.spike,
  summaryTrendStats: TREND_STATS,
};

export function runRead() {
  mixedReadFlow();
  sleep(0.3);
}

export function runWrite() {
  mixedWriteFlow();
  sleep(0.3);
}

export function handleSummary(data) {
  return makeSummary(data, '04-spike');
}

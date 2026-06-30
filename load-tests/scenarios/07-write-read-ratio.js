/**
 * Write/Read Ratio Test — 1 escrita para cada 2 leituras
 *
 * Responde: "o sistema aguenta 1 milhão de escritas para 2 milhões de leituras?"
 *
 * Estratégia:
 *   Dois cenários paralelos com `constant-arrival-rate`:
 *     • writers: WRITE_RATE req/s  (padrão: 30/s)
 *     • readers: READ_RATE  req/s  (padrão: 60/s = 2× escritas)
 *   Duração configurável (padrão: 30min).
 *
 * Cálculo de capacidade (relatório final):
 *   Para atingir 1M escritas a 30/s → ~9.3 horas.
 *   Se o sistema sustenta esta taxa sem degradação → pode atingir 1M/2M.
 *   O relatório mostra a extrapolação e o maior gargalo observado.
 *
 * Uso:
 *   k6 run load-tests/scenarios/07-write-read-ratio.js \
 *     --out influxdb=http://localhost:8086/k6 \
 *     -e WRITE_RATE=30 -e READ_RATE=60 -e RATIO_DURATION=30m
 */
import { sleep } from 'k6';
import { ARRIVAL_RATE } from '../config/base.js';
import { THRESHOLDS, TREND_STATS } from '../config/thresholds.js';
import { mixedReadFlow } from '../flows/read-flows.js';
import { mixedWriteFlow } from '../flows/write-flows.js';
import { handleSummary as makeSummary } from '../summary/index.js';

const WRITE_RATE = ARRIVAL_RATE.writes;
const READ_RATE  = ARRIVAL_RATE.reads;
const DURATION   = ARRIVAL_RATE.duration;

// VUs pré-alocados: aproximação baseada em latência esperada de 200ms
const WRITER_VUS = Math.ceil(WRITE_RATE * 0.5);
const READER_VUS = Math.ceil(READ_RATE  * 0.5);

export const options = {
  scenarios: {
    writers: {
      executor:        'constant-arrival-rate',
      rate:            WRITE_RATE,
      timeUnit:        '1s',
      duration:        DURATION,
      preAllocatedVUs: WRITER_VUS,
      maxVUs:          WRITER_VUS * 5,
      exec:            'runWrite',
    },
    readers: {
      executor:        'constant-arrival-rate',
      rate:            READ_RATE,
      timeUnit:        '1s',
      duration:        DURATION,
      preAllocatedVUs: READER_VUS,
      maxVUs:          READER_VUS * 5,
      exec:            'runRead',
    },
  },
  thresholds: THRESHOLDS.ratio,
  summaryTrendStats: TREND_STATS,
};

export function runWrite() {
  mixedWriteFlow();
}

export function runRead() {
  mixedReadFlow();
  sleep(0.1);
}

export function handleSummary(data) {
  return makeSummary(data, '07-write-read-ratio', {
    targetWrites: 1_000_000,
    targetReads:  2_000_000,
    writeRate:    WRITE_RATE,
    readRate:     READ_RATE,
  });
}

import { SLA } from '../config/base.js';

const VUS_BREAKPOINT_HINT = 500;

// ── Helpers de extração ────────────────────────────────────────────────────────

function v(metrics, name, key = 'value') {
  return metrics[name]?.values?.[key] ?? 0;
}

function trend(metrics, name, key) {
  return metrics[name]?.values?.[key] ?? 0;
}

function fmt(ms) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

function fmtBytes(bytes) {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GB`;
  if (bytes >= 1_048_576)     return `${(bytes / 1_048_576).toFixed(2)} MB`;
  if (bytes >= 1_024)         return `${(bytes / 1_024).toFixed(2)} KB`;
  return `${Math.round(bytes)} B`;
}

function pct(rate) {
  return `${(rate * 100).toFixed(2)}%`;
}

function check(val, threshold, lowerIsBetter = true) {
  if (val === 0 && threshold === 0) return '~';
  return lowerIsBetter ? (val <= threshold ? '✓' : '✗') : (val >= threshold ? '✓' : '✗');
}

// ── Gerador principal ─────────────────────────────────────────────────────────

/**
 * @param {object} data  - dados do handleSummary do k6
 * @param {string} scenarioName
 * @param {object} [ratioContext]  - contexto extra para o cenário 07
 */
export function handleSummary(data, scenarioName = 'unknown', ratioContext = null) {
  const m   = data.metrics || {};
  const dur = (data.state?.testRunDurationMs || 0) / 1000;

  // ── Latência ───────────────────────────────────────────────────────────────
  const p50    = trend(m, 'http_req_duration', 'med');
  const p90    = trend(m, 'http_req_duration', 'p(90)');
  const p95    = trend(m, 'http_req_duration', 'p(95)');
  const p99    = trend(m, 'http_req_duration', 'p(99)');
  const mean   = trend(m, 'http_req_duration', 'avg');
  const maxLat = trend(m, 'http_req_duration', 'max');
  const ttfbP95 = trend(m, 'http_req_waiting', 'p(95)');
  const ttfbAvg = trend(m, 'ttfb_ms',          'avg');

  // ── Throughput ─────────────────────────────────────────────────────────────
  const rps       = v(m, 'http_reqs',              'rate');
  const totalReqs = v(m, 'http_reqs',              'count');
  const errRate   = v(m, 'http_req_failed',        'rate');
  const succRate  = 1 - errRate;
  const dataSent  = v(m, 'data_sent',              'count');
  const dataRecv  = v(m, 'data_received',          'count');
  const writes    = v(m, 'write_requests_total',   'count');
  const reads     = v(m, 'read_requests_total',    'count');

  // ── Erros ──────────────────────────────────────────────────────────────────
  const c2xx     = v(m, 'http_2xx_total',          'count');
  const c4xx     = v(m, 'http_4xx_total',          'count');
  const c5xx     = v(m, 'http_5xx_total',          'count');
  const timeouts = v(m, 'request_timeouts_total',  'count');
  const connErr  = v(m, 'connection_errors_total', 'count');

  // ── Concorrência ───────────────────────────────────────────────────────────
  const peakVUs  = v(m, 'vus_max',                 'max');
  const queueP95 = trend(m, 'queue_time_ms',       'p(95)');
  const queueAvg = trend(m, 'queue_time_ms',       'avg');

  // ── Consumo de dados por usuário ───────────────────────────────────────────
  const bytesPerReqAvg = trend(m, 'bytes_per_request', 'avg');
  const bytesPerReqMax = trend(m, 'bytes_per_request', 'max');
  const sessionsPerVU  = peakVUs > 0 ? Math.round(totalReqs / peakVUs) : 0;
  // Estimativa: dados transferidos por sessão de usuário
  const bytesPerSession = bytesPerReqAvg * sessionsPerVU;
  // Estimativa mensal: 100 sessões/usuário/mês
  const monthlyBytesEstimate = bytesPerSession * 100;

  // ── Análise de SLA ─────────────────────────────────────────────────────────
  const slaP95Ok  = p95 <= SLA.p95_ms;
  const slaP99Ok  = p99 <= SLA.p99_ms;
  const slaErrOk  = errRate <= SLA.error_rate;
  const slaTTFBOk = ttfbP95 <= SLA.ttfb_ms;
  const slaOk     = slaP95Ok && slaP99Ok && slaErrOk && slaTTFBOk;

  // ── Bottleneck heurístico ──────────────────────────────────────────────────
  let bottleneck = 'Indeterminado (verifique CPU e DB no Grafana)';
  if (c5xx > totalReqs * 0.03) bottleneck = 'Servidor (5xx alto — pool de conexões ou OOM)';
  else if (queueP95 > 500)      bottleneck = 'Rede / connection pool (queue time > 500ms)';
  else if (p95 > SLA.p95_ms * 3) bottleneck = 'DB ou I/O (latência muito alta sem erros 5xx)';
  else if (slaOk)                bottleneck = 'Nenhum detectado — sistema dentro do SLA';

  // ── Comportamento sob pico ─────────────────────────────────────────────────
  let peakBehavior = 'Sem dados de spike neste cenário';
  if (scenarioName.includes('spike')) {
    peakBehavior = errRate < 0.05
      ? 'Degradação graciosa (error rate < 5% no pico)'
      : `Falha abrupta (error rate ${pct(errRate)} no pico)`;
  }

  // ── Recomendação de escala ─────────────────────────────────────────────────
  let scaleRec = '';
  if (slaOk && peakVUs < 100) {
    scaleRec = 'Sistema estável. Sem necessidade imediata de escala.';
  } else if (!slaErrOk || c5xx > 100) {
    scaleRec = 'Escala HORIZONTAL recomendada: adicionar réplicas do(s) serviço(s) com maior taxa de 5xx.';
  } else if (p95 > SLA.p95_ms && queueP95 < 200) {
    scaleRec = 'Escala VERTICAL recomendada: CPU ou memória são o gargalo (latência alta sem fila).';
  } else {
    scaleRec = 'Escala HORIZONTAL recomendada: distribuir carga entre mais instâncias.';
  }

  // ── Capacidade máxima sustentável ─────────────────────────────────────────
  const maxSustainableRPS = slaOk ? rps.toFixed(1) : `< ${rps.toFixed(1)} (SLA violado)`;

  // ── Contexto de proporção (cenário 07) ────────────────────────────────────
  let ratioSection = '';
  if (ratioContext) {
    const { targetWrites, targetReads, writeRate, readRate } = ratioContext;
    const hoursForWrites   = (targetWrites / writeRate / 3600).toFixed(1);
    const hoursForReads    = (targetReads  / readRate  / 3600).toFixed(1);
    const canSustain       = slaOk ? '✓ SIM' : '✗ NÃO';
    const writesPerDaySLA  = Math.ceil(targetWrites / 86_400);
    const readsPerDaySLA   = Math.ceil(targetReads  / 86_400);
    const vuEstimate       = Math.ceil((writesPerDaySLA / writeRate) * Math.ceil(writeRate * 0.5));

    ratioSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANÁLISE DE CAPACIDADE: 1M ESCRITAS / 2M LEITURAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Taxa de escrita atual  :  ${writeRate} req/s
  Taxa de leitura atual  :  ${readRate} req/s

  Para atingir ${(targetWrites / 1_000_000).toFixed(0)}M escritas    :  ~${hoursForWrites}h nesta taxa
  Para atingir ${(targetReads  / 1_000_000).toFixed(0)}M leituras    :  ~${hoursForReads}h nesta taxa

  ${canSustain} — Sistema ${slaOk ? 'AGUENTA' : 'NÃO aguenta'} a proporção 1:2 dentro do SLA
    (SLA: p95<${SLA.p95_ms}ms, error<${pct(SLA.error_rate)}, TTFB<${SLA.ttfb_ms}ms)

  Para processar 1M/2M em ≤ 24h: precisaria de ${writesPerDaySLA} writes/s + ${readsPerDaySLA} reads/s
    ${writesPerDaySLA} writes/s requer ~${vuEstimate} VUs (estimativa linear)
`;
  }

  // ── Consumo de dados ───────────────────────────────────────────────────────
  const costSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONSUMO DE DADOS POR USUÁRIO (base para cálculo de custo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Bytes médios por request     :  ${fmtBytes(bytesPerReqAvg)}  (max: ${fmtBytes(bytesPerReqMax)})
  Total enviado (teste)        :  ${fmtBytes(dataSent)}
  Total recebido (teste)       :  ${fmtBytes(dataRecv)}
  Requests por VU (aprox.)     :  ${sessionsPerVU}
  Dados por sessão (estimativa):  ${fmtBytes(bytesPerSession)}
  Estimativa mensal / usuário  :  ${fmtBytes(monthlyBytesEstimate)}  (base: 100 sessões/mês)

  Referência de custo de banda (ex: Cloudflare/AWS egress ~$0.09/GB):
    ${fmtBytes(monthlyBytesEstimate)} / usuário × $0.09/GB = $${((monthlyBytesEstimate / 1_073_741_824) * 0.09).toFixed(4)}/usuário/mês
  Nota: inclui apenas tráfego HTTP medido pelo k6. Adicione S3/R2 (posts, avatars)
        e Kafka para o custo real de infraestrutura por usuário.
`;

  // ── Relatório completo ─────────────────────────────────────────────────────
  const report = `
╔══════════════════════════════════════════════════════════════════════════╗
║              VIBESTER — RELATÓRIO EXECUTIVO DE CARGA                    ║
║  Cenário: ${scenarioName.padEnd(58)}  ║
╚══════════════════════════════════════════════════════════════════════════╝

  Duração do teste : ${Math.round(dur / 60)}min ${Math.round(dur % 60)}s   |   Peak VUs: ${peakVUs}
  Timestamp        : ${new Date().toISOString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LATÊNCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  P50 (mediana) : ${fmt(p50).padEnd(12)}  P90  : ${fmt(p90).padEnd(12)}
  P95           : ${fmt(p95).padEnd(9)} ${check(p95, SLA.p95_ms)}   P99  : ${fmt(p99).padEnd(9)} ${check(p99, SLA.p99_ms)}
  Média         : ${fmt(mean).padEnd(12)}  Máxima: ${fmt(maxLat)}

  TTFB (p95)    : ${fmt(ttfbP95).padEnd(9)} ${check(ttfbP95, SLA.ttfb_ms)}   TTFB médio: ${fmt(ttfbAvg)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THROUGHPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RPS           : ${rps.toFixed(2)} req/s
  Total         : ${totalReqs.toLocaleString()} requests  (${writes.toLocaleString()} escritas + ${reads.toLocaleString()} leituras)
  Taxa de sucesso: ${pct(succRate)} ${check(errRate, SLA.error_rate)}   |   Erros: ${pct(errRate)}
  Dados enviados : ${fmtBytes(dataSent)}   |   Dados recebidos: ${fmtBytes(dataRecv)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROS & DISPONIBILIDADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  2xx : ${c2xx.toLocaleString().padEnd(10)} (${totalReqs > 0 ? pct(c2xx / totalReqs) : '0.00%'})
  4xx : ${c4xx.toLocaleString().padEnd(10)} (${totalReqs > 0 ? pct(c4xx / totalReqs) : '0.00%'})
  5xx : ${c5xx.toLocaleString().padEnd(10)} (${totalReqs > 0 ? pct(c5xx / totalReqs) : '0.00%'})
  Timeouts        : ${timeouts}
  Connection errors: ${connErr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCORRÊNCIA & FILA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  VUs simultâneos (pico) : ${peakVUs}
  Tempo em fila (p95)    : ${fmt(queueP95)}   (médio: ${fmt(queueAvg)})

  ℹ  Event loop lag, conexões HTTP keep-alive e GC pauses:
     Consulte o dashboard Grafana → painel "Node.js Metrics"
     (node_exporter + prom-client expõem nodejs_eventloop_lag_seconds,
      nodejs_heap_*, process_open_fds)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECURSOS DO SERVIDOR (requerem Prometheus/Grafana)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CPU%       → Grafana: node_exporter "CPU Usage"
  Memória    → Grafana: nodejs_heap_size_used_bytes / process_resident_memory
  GC pauses  → Grafana: nodejs_gc_duration_seconds_sum
  I/O disco  → Grafana: node_exporter "Disk I/O"
  I/O rede   → Grafana: node_exporter "Network Traffic"

  DB Pool    → Grafana: prisma_pool_connections_open (se instrumentado)
  Cache hit  → Grafana: redis_keyspace_hits_total / redis_keyspace_misses_total
  QPS DB     → Grafana: pg_stat_statements_calls_total

  Acesse: http://localhost:3000 (admin/admin) — dashboard "k6 Load Testing"
${ratioSection}${costSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUMO EXECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Capacidade máxima sustentável  : ${maxSustainableRPS} RPS (SLA: p95<${SLA.p95_ms}ms, error<${pct(SLA.error_rate)})
  Breaking point                 : ${peakVUs >= VUS_BREAKPOINT_HINT ? `~${peakVUs} VUs (pico atingido)` : 'Não atingido neste cenário'}
  Bottleneck identificado        : ${bottleneck}
  SLA compliance                 : ${slaOk ? `✓ DENTRO  (p95=${fmt(p95)}, err=${pct(errRate)}, TTFB=${fmt(ttfbP95)})` : `✗ VIOLADO (p95=${fmt(p95)}, err=${pct(errRate)}, TTFB=${fmt(ttfbP95)})`}
  Comportamento sob pico         : ${peakBehavior}
  Recomendação de escala         : ${scaleRec}
`;

  // Coleta o JSON estruturado para persistência / análise automatizada
  const jsonReport = {
    scenario:   scenarioName,
    timestamp:  new Date().toISOString(),
    durationSec: Math.round(dur),
    peakVUs,
    sla: { compliant: slaOk, p95_ms: p95, p99_ms: p99, errorRate: errRate, ttfbP95_ms: ttfbP95 },
    latency:    { p50, p90, p95, p99, mean, max: maxLat, ttfbP95, ttfbAvg },
    throughput: { rps, totalReqs, writes, reads, succRate, errRate, dataSentBytes: dataSent, dataRecvBytes: dataRecv },
    errors:     { c2xx, c4xx, c5xx, timeouts, connErr },
    concurrency: { peakVUs, queueTimeP95_ms: queueP95, queueTimeAvg_ms: queueAvg },
    costEstimate: { bytesPerReqAvg, bytesPerSession, monthlyBytesPerUser: monthlyBytesEstimate },
    summary:    { maxSustainableRPS, bottleneck, scaleRecommendation: scaleRec },
    ...(ratioContext ? { ratioContext } : {}),
  };

  return {
    'stdout': report,
    './load-tests/reports/summary.json': JSON.stringify(jsonReport, null, 2),
  };
}

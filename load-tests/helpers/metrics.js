import { Counter, Trend, Rate } from 'k6/metrics';

// ── Latência ──────────────────────────────────────────────────────────────────
// http_req_waiting (built-in) já é o TTFB; guardamos aqui uma Trend explícita
// com tag {type} para separar escrita × leitura no relatório.
export const ttfbTrend = new Trend('ttfb_ms', true);

// ── Throughput / classificação de requisições ─────────────────────────────────
export const writeCounter = new Counter('write_requests_total');
export const readCounter  = new Counter('read_requests_total');

// ── Distribuição de códigos HTTP ──────────────────────────────────────────────
export const count2xx = new Counter('http_2xx_total');
export const count4xx = new Counter('http_4xx_total');
export const count5xx = new Counter('http_5xx_total');

// ── Erros específicos ─────────────────────────────────────────────────────────
export const timeoutCounter = new Counter('request_timeouts_total');
export const connErrCounter = new Counter('connection_errors_total');

// ── Concorrência / fila ───────────────────────────────────────────────────────
// http_req_blocked (built-in) = tempo esperando conexão disponível (enqueue time)
export const queueTimeTrend = new Trend('queue_time_ms', true);

// ── Consumo de dados por requisição (custo por usuário) ───────────────────────
// Soma de bytes enviados + recebidos por request; dividido pelo total de VUs
// no relatório final para obter consumo médio por usuário por sessão.
export const bytesPerReqTrend = new Trend('bytes_per_request', true);

/**
 * Registra todas as métricas customizadas para uma resposta HTTP.
 * Deve ser chamado após cada http.* call.
 *
 * @param {import('k6/http').Response} res
 * @param {'read'|'write'} type
 */
export function recordResponse(res, type = 'read') {
  const tag = { type };

  // TTFB
  ttfbTrend.add(res.timings.waiting, tag);

  // Tempo em fila (esperando conexão HTTP)
  queueTimeTrend.add(res.timings.blocked, tag);

  // Tipo de operação
  if (type === 'write') writeCounter.add(1, tag);
  else                  readCounter.add(1, tag);

  // Distribuição de status
  const s = res.status;
  if      (s >= 200 && s < 300) count2xx.add(1);
  else if (s >= 400 && s < 500) count4xx.add(1);
  else if (s >= 500)            count5xx.add(1);
  else if (s === 0)             connErrCounter.add(1); // falha de rede

  // Timeout heurístico: duração próxima ao timeout padrão do k6 (60 s)
  if (res.timings.duration >= 59_900) timeoutCounter.add(1);

  // Consumo de dados (payload de request + body de resposta)
  const reqBytes  = res.request && res.request.body ? res.request.body.length : 0;
  const respBytes = res.body ? res.body.length : 0;
  bytesPerReqTrend.add(reqBytes + respBytes, tag);
}

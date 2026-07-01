import { sleep } from 'k6';
import { SERVICES } from '../config/base.js';
import { get, ok } from '../helpers/http.js';
import { initVU, bearerHeaders } from '../helpers/auth.js';
import { NEARBY_QS } from '../helpers/data.js';

// Feed, posts e estabelecimentos ficam fora destes flows: feed-service e
// post-service dependem de Cassandra, e establishment-service de bucket R2 —
// bancos/storages externos não isoláveis localmente.

// ── Eventos ───────────────────────────────────────────────────────────────────

export function eventReadFlow() {
  const featured = get(
    `${SERVICES.event}/events/featured`,
    { tags: { endpoint: 'featured-events', service: 'event' } },
  );
  ok(featured, 'featured-events');

  sleep(0.1);

  const today = new Date().toISOString().slice(0, 10);
  const week = get(
    `${SERVICES.event}/events/week?date=${today}`,
    { tags: { endpoint: 'week-events', service: 'event' } },
  );
  ok(week, 'week-events');

  sleep(0.1);

  const nearby = get(
    `${SERVICES.event}/events/nearby?${NEARBY_QS}`,
    { tags: { endpoint: 'nearby-events', service: 'event' } },
  );
  ok(nearby, 'nearby-events');
}

// ── Perfil de usuário ─────────────────────────────────────────────────────────

export function profileReadFlow() {
  const vu = initVU();
  if (!vu) return;

  const res = get(
    `${SERVICES.user}/users/profile/${vu.accountId}`,
    { headers: bearerHeaders(vu.token), tags: { endpoint: 'get-profile', service: 'user' } },
  );
  ok(res, 'get-profile');
}

// ── Flow misto de leitura (usado em cenários de carga) ────────────────────────
// Simula uma sessão típica de leitura: eventos → perfil

export function mixedReadFlow() {
  eventReadFlow();
  sleep(0.2);
  profileReadFlow();
}

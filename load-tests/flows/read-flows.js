import { sleep } from 'k6';
import { SERVICES } from '../config/base.js';
import { get, ok } from '../helpers/http.js';
import { initVU, bearerHeaders } from '../helpers/auth.js';
import { NEARBY_QS } from '../helpers/data.js';

// ── Feed ──────────────────────────────────────────────────────────────────────

export function feedReadFlow() {
  const vu = initVU();
  if (!vu) return;

  const res = get(
    `${SERVICES.feed}/feed/${vu.accountId}`,
    { headers: bearerHeaders(vu.token), tags: { endpoint: 'get-feed', service: 'feed' } },
  );
  ok(res, 'get-feed');
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export function userPostsReadFlow() {
  const vu = initVU();
  if (!vu) return;

  const res = get(
    `${SERVICES.post}/users/${vu.accountId}/posts`,
    { headers: bearerHeaders(vu.token), tags: { endpoint: 'list-user-posts', service: 'post' } },
  );
  ok(res, 'list-user-posts');
}

// ── Estabelecimentos ──────────────────────────────────────────────────────────

export function establishmentListFlow() {
  const listRes = get(
    `${SERVICES.establishment}/establishments`,
    { tags: { endpoint: 'list-establishments', service: 'establishment' } },
  );
  ok(listRes, 'list-establishments');

  sleep(0.1);

  const nearbyRes = get(
    `${SERVICES.establishment}/establishments/nearby?${NEARBY_QS}`,
    { tags: { endpoint: 'nearby-establishments', service: 'establishment' } },
  );
  ok(nearbyRes, 'nearby-establishments');
}

export function openEstablishmentsFlow() {
  const res = get(
    `${SERVICES.establishment}/establishments/open`,
    { tags: { endpoint: 'open-establishments', service: 'establishment' } },
  );
  ok(res, 'open-establishments');
}

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
// Simula uma sessão típica de leitura: feed → eventos → estabelecimentos → perfil

export function mixedReadFlow() {
  feedReadFlow();
  sleep(0.2);
  eventReadFlow();
  sleep(0.2);
  establishmentListFlow();
  sleep(0.2);
  profileReadFlow();
}

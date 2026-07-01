import { sleep } from 'k6';
import { SERVICES } from '../config/base.js';
import { post, ok } from '../helpers/http.js';
import { initVU, bearerHeaders } from '../helpers/auth.js';
import { generateEvent, SEED_ACCOUNT_ID } from '../helpers/data.js';

// ── Auth ──────────────────────────────────────────────────────────────────────

// Registro + login de um usuário novo (benchmark de throughput de auth)
export function authWriteFlow() {
  return initVU();
}

// Posts ficam fora deste flow: post-service depende de Cassandra, um banco
// externo não isolável localmente.

// ── Social ────────────────────────────────────────────────────────────────────

// Segue outro usuário (usa o próprio VU seguindo um ID fixo de seed)
export function followFlow(targetAccountId) {
  const vu = initVU();
  if (!vu) return;

  const res = post(
    `${SERVICES.user}/users/profile/followers/increase`,
    { followerId: vu.accountId, followingId: targetAccountId },
    { headers: bearerHeaders(vu.token), tags: { endpoint: 'follow-user', service: 'user' } },
  );
  ok(res, 'follow-user');
}

// ── Eventos ───────────────────────────────────────────────────────────────────

export function createEventFlow() {
  const vu = initVU();
  if (!vu) return;

  const res = post(
    `${SERVICES.event}/events`,
    generateEvent(vu.accountId),
    { headers: bearerHeaders(vu.token), tags: { endpoint: 'create-event', service: 'event' } },
  );
  ok(res, 'create-event');
}

// ── Flow misto de escrita (usado em cenários de carga) ────────────────────────
// Simula uma sessão típica de escrita: criar evento → seguir usuário

export function mixedWriteFlow() {
  createEventFlow();
  sleep(0.3);
  followFlow(SEED_ACCOUNT_ID);
}

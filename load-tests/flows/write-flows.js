import { sleep } from 'k6';
import { SERVICES } from '../config/base.js';
import { post, ok } from '../helpers/http.js';
import { initVU, bearerHeaders } from '../helpers/auth.js';
import { generatePost, generateEvent } from '../helpers/data.js';

// ── Auth ──────────────────────────────────────────────────────────────────────

// Registro + login de um usuário novo (benchmark de throughput de auth)
export function authWriteFlow() {
  return initVU();
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export function createPostFlow() {
  const vu = initVU();
  if (!vu) return;

  const createRes = post(
    `${SERVICES.post}/posts`,
    generatePost(vu.accountId),
    { headers: bearerHeaders(vu.token), tags: { endpoint: 'create-post', service: 'post' } },
  );
  ok(createRes, 'create-post');

  if (createRes.status === 201) {
    try {
      const { id: postId } = JSON.parse(createRes.body);
      sleep(0.05);
      const likeRes = post(
        `${SERVICES.post}/posts/${postId}/likes`,
        {},
        { headers: bearerHeaders(vu.token), tags: { endpoint: 'like-post', service: 'post' } },
      );
      ok(likeRes, 'like-post');
    } catch {}
  }
}

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
// Simula uma sessão típica de escrita: criar post → criar evento

export function mixedWriteFlow() {
  createPostFlow();
  sleep(0.3);
  createEventFlow();
}

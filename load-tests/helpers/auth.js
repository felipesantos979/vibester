import http from 'k6/http';
import { check } from 'k6';
import { SERVICES } from '../config/base.js';
import { generateUser } from './data.js';
import { recordResponse } from './metrics.js';

const CT = { 'Content-Type': 'application/json' };

// Cache por VU: cada VU se registra apenas uma vez por execução
const _vuCache = {};

/**
 * Registra + faz login do VU atual e armazena { token, accountId } em cache.
 * Chamadas subsequentes do mesmo VU retornam o cache sem novas requests.
 *
 * @returns {{ token: string, accountId: string } | null}
 */
export function initVU() {
  if (_vuCache[__VU]) return _vuCache[__VU];

  const user = generateUser();

  // 1. Registro
  const regRes = http.post(
    `${SERVICES.auth}/register`,
    JSON.stringify(user),
    { headers: CT, tags: { endpoint: 'register', service: 'auth', type: 'write' } },
  );
  recordResponse(regRes, 'write');
  check(regRes, { 'init: register 201': (r) => r.status === 201 });
  if (regRes.status !== 201) return null;

  let accountId;
  try { accountId = JSON.parse(regRes.body).id; } catch { return null; }

  // 2. Login
  const loginRes = http.post(
    `${SERVICES.auth}/login`,
    JSON.stringify({ email: user.email, password: user.password }),
    { headers: CT, tags: { endpoint: 'login', service: 'auth', type: 'write' } },
  );
  recordResponse(loginRes, 'write');
  check(loginRes, { 'init: login 200': (r) => r.status === 200 });
  if (loginRes.status !== 200) return null;

  let token;
  try { token = JSON.parse(loginRes.body).token; } catch { return null; }

  // 3. Cria perfil de usuário (necessário para feed/follow)
  http.post(
    `${SERVICES.user}/users/profile`,
    JSON.stringify({ accountId, username: user.username, name: user.name }),
    { headers: bearerHeaders(token), tags: { endpoint: 'create-profile', service: 'user', type: 'write' } },
  );

  _vuCache[__VU] = { token, accountId };
  return _vuCache[__VU];
}

export function bearerHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

import http from 'k6/http';
import { check } from 'k6';
import { SERVICES } from '../config/base.js';
import { recordResponse } from './metrics.js';

const CT = { 'Content-Type': 'application/json' };

// Contas pré-cadastradas e verificadas no ambiente de teste.
// O fluxo real é: POST /register (202) → verificar e-mail → POST /verify-email (201).
// Como essa etapa não pode ser automatizada, os testes usam contas já existentes.
const TEST_ACCOUNTS = [
  { email: 'k6_test_01@loadtest.invalid', password: 'K6Load#2024!' },
  { email: 'k6_test_02@loadtest.invalid', password: 'K6Load#2024!' },
  { email: 'k6_test_03@loadtest.invalid', password: 'K6Load#2024!' },
  { email: 'k6_test_04@loadtest.invalid', password: 'K6Load#2024!' },
  { email: 'k6_test_05@loadtest.invalid', password: 'K6Load#2024!' },
];

// Cache por VU: cada VU faz login apenas uma vez por execução
const _vuCache = {};

/**
 * Autentica o VU atual com uma conta pré-cadastrada e armazena { token, accountId } em cache.
 * Chamadas subsequentes do mesmo VU retornam o cache sem novas requests.
 *
 * @returns {{ token: string, accountId: string } | null}
 */
export function initVU() {
  if (_vuCache[__VU]) return _vuCache[__VU];

  const creds = TEST_ACCOUNTS[(__VU - 1) % TEST_ACCOUNTS.length];

  const loginRes = http.post(
    `${SERVICES.auth}/login`,
    JSON.stringify({ email: creds.email, password: creds.password }),
    { headers: CT, tags: { endpoint: 'login', service: 'auth', type: 'write' } },
  );
  recordResponse(loginRes, 'write');
  check(loginRes, { 'init: login 200': (r) => r.status === 200 });
  if (loginRes.status !== 200) return null;

  let token, accountId;
  try {
    const body = JSON.parse(loginRes.body);
    token = body.token;
    accountId = body.accountId;
  } catch { return null; }

  _vuCache[__VU] = { token, accountId };
  return _vuCache[__VU];
}

export function bearerHeaders(token) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config.js';

const HEADERS = { 'Content-Type': 'application/json' };

export function generateUser() {
  const uid = `${Date.now()}_vu${__VU}_it${__ITER}`;
  return {
    username: `testuser_${uid}`,
    name: `Test User ${__VU}`,
    email: `testuser_${uid}@k6test.com`,
    password: 'K6testPass123!',
    bornAt: '1995-06-15T00:00:00.000Z',
  };
}

export function register(user) {
  const res = http.post(
    `${BASE_URL}/register`,
    JSON.stringify(user),
    { headers: HEADERS, tags: { endpoint: 'register' } },
  );

  check(res, {
    'register: status 201': (r) => r.status === 201,
    'register: retornou id': (r) => {
      try { return !!JSON.parse(r.body).id; } catch { return false; }
    },
  });

  return res;
}

export function login(credentials) {
  const res = http.post(
    `${BASE_URL}/login`,
    JSON.stringify(credentials),
    { headers: HEADERS, tags: { endpoint: 'login' } },
  );

  check(res, {
    'login: status 200': (r) => r.status === 200,
    'login: retornou token': (r) => {
      try { return !!JSON.parse(r.body).token; } catch { return false; }
    },
  });

  return res;
}

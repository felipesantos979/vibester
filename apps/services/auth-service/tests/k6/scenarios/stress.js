/**
 * Teste de Stress (Carga Alta)
 *
 * Sobe a carga em degraus bem acima do esperado para identificar onde o desempenho
 * começa a degradar e se o serviço se recupera após o pico.
 *
 * Thresholds padrão:
 *   - p95 < 2000ms
 *   - p99 < 4000ms
 *   - error rate < 5%
 *
 * Variáveis de ambiente:
 *   BASE_URL    - URL base do serviço (default: http://cotaup.com.br:3001)
 *   STRESS_VUS  - pico de VUs (default: 200)
 */
import { sleep } from 'k6';
import { VUS, THRESHOLDS } from '../config.js';
import { generateUser, register, login } from '../helpers/users.js';

const TARGET_VUS = VUS.STRESS;

export const options = {
  stages: [
    { duration: '1m', target: Math.ceil(TARGET_VUS * 0.25) },  // degrau 1 — 25%
    { duration: '2m', target: Math.ceil(TARGET_VUS * 0.5) },   // degrau 2 — 50%
    { duration: '2m', target: Math.ceil(TARGET_VUS * 0.75) },  // degrau 3 — 75%
    { duration: '3m', target: TARGET_VUS },                     // pico máximo
    { duration: '2m', target: Math.ceil(TARGET_VUS * 0.5) },   // recuo parcial
    { duration: '1m', target: 0 },                              // ramp down
  ],
  thresholds: THRESHOLDS.stress,
};

export default function () {
  const user = generateUser();

  const regRes = register(user);

  if (regRes.status === 201) {
    sleep(0.2);
    login({ email: user.email, password: user.password });
  }

  sleep(0.5);
}

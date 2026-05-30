/**
 * Teste de Performance (Carga Normal)
 *
 * Simula a carga esperada em produção: ramp up gradual, período estável e ramp down.
 * Objetivo: verificar se o serviço mantém latência e taxa de erro dentro do aceitável
 * sob uso típico.
 *
 * Thresholds padrão:
 *   - p95 < 500ms
 *   - p99 < 1000ms
 *   - error rate < 1%
 *   - throughput > 5 req/s
 *
 * Variáveis de ambiente:
 *   BASE_URL   - URL base do serviço (default: http://cotaup.com.br:3001)
 *   PERF_VUS   - pico de VUs (default: 50)
 */
import { sleep } from 'k6';
import { VUS, THRESHOLDS } from '../config.js';
import { generateUser, register, login } from '../helpers/users.js';

const TARGET_VUS = VUS.PERFORMANCE;

export const options = {
  stages: [
    { duration: '1m', target: Math.ceil(TARGET_VUS * 0.3) },  // aquecimento
    { duration: '3m', target: TARGET_VUS },                    // carga estável
    { duration: '1m', target: 0 },                             // ramp down
  ],
  thresholds: THRESHOLDS.performance,
};

export default function () {
  const user = generateUser();

  // Registra o usuário (grava no banco)
  const regRes = register(user);

  if (regRes.status === 201) {
    sleep(0.3);
    // Faz login com o usuário recém-criado
    login({ email: user.email, password: user.password });
  }

  sleep(1);
}

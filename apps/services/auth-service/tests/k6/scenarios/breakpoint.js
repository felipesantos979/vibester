/**
 * Teste de Ponto de Ruptura (Breakpoint)
 *
 * Aumenta VUs linearmente até encontrar o limite físico do serviço: onde a taxa
 * de erros dispara ou a latência se torna inaceitável. Não há thresholds rígidos
 * de falha — o objetivo é observar e registrar o comportamento.
 *
 * ATENÇÃO: Este teste pode derrubar o serviço. Execute apenas em ambiente isolado.
 *
 * Variáveis de ambiente:
 *   BASE_URL    - URL base do serviço (default: http://cotaup.com.br:3001)
 *   BREAK_VUS   - VUs máximos antes de parar (default: 500)
 */
import { sleep } from 'k6';
import { VUS, THRESHOLDS } from '../config.js';
import { generateUser, register, login } from '../helpers/users.js';

const TARGET_VUS = VUS.BREAKPOINT;

export const options = {
  stages: [
    { duration: '2m', target: Math.ceil(TARGET_VUS * 0.1) },
    { duration: '2m', target: Math.ceil(TARGET_VUS * 0.2) },
    { duration: '2m', target: Math.ceil(TARGET_VUS * 0.4) },
    { duration: '2m', target: Math.ceil(TARGET_VUS * 0.6) },
    { duration: '2m', target: Math.ceil(TARGET_VUS * 0.8) },
    { duration: '2m', target: TARGET_VUS },
    { duration: '1m', target: 0 },
  ],
  thresholds: THRESHOLDS.breakpoint,
  // Não aborta o teste quando thresholds falham — queremos registrar tudo
  thresholdAbort: false,
};

export default function () {
  const user = generateUser();

  const regRes = register(user);

  if (regRes.status === 201) {
    sleep(0.1);
    login({ email: user.email, password: user.password });
  }

  sleep(0.3);
}

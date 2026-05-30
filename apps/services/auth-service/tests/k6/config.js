export const BASE_URL = __ENV.BASE_URL || 'http://cotaup.com.br:3001';

export const INFLUXDB_URL = __ENV.INFLUXDB_URL || 'http://cotaup.com.br:8086/k6';

// Ajuste os limites de VUs por variável de ambiente ou use os padrões
export const VUS = {
  PERFORMANCE: parseInt(__ENV.PERF_VUS) || 50,
  STRESS: parseInt(__ENV.STRESS_VUS) || 200,
  BREAKPOINT: parseInt(__ENV.BREAK_VUS) || 500,
};

// Métricas padrão de aceitação
export const THRESHOLDS = {
  performance: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    http_reqs: ['rate>5'],
  },
  stress: {
    http_req_duration: ['p(95)<2000', 'p(99)<4000'],
    http_req_failed: ['rate<0.05'],
  },
  breakpoint: {
    // Sem thresholds rígidos — queremos observar o ponto de ruptura
    http_req_duration: ['p(99)<10000'],
  },
};

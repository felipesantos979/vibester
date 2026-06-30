import { SLA } from './base.js';

export const THRESHOLDS = {
  smoke: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: [`p(95)<${SLA.p95_ms}`, `p(99)<${SLA.p99_ms}`],
    http_req_waiting:  [`p(95)<${SLA.ttfb_ms}`],
  },

  load: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: [`p(95)<${SLA.p95_ms}`, `p(99)<${SLA.p99_ms}`],
    http_req_waiting:  [`p(95)<${SLA.ttfb_ms}`],
    http_reqs:         ['rate>10'],
  },

  stress: {
    http_req_failed:   ['rate<0.05'],
    http_req_duration: ['p(95)<2000', 'p(99)<4000'],
    http_req_waiting:  ['p(95)<800'],
  },

  spike: {
    http_req_failed:   ['rate<0.10'],
    http_req_duration: ['p(95)<3000'],
  },

  soak: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: [`p(95)<${SLA.p95_ms}`, `p(99)<${SLA.p99_ms}`],
    http_req_waiting:  [`p(95)<${SLA.ttfb_ms}`],
  },

  breakpoint: {
    http_req_duration: ['p(99)<10000'],
  },

  ratio: {
    http_req_failed:              ['rate<0.01'],
    http_req_duration:            [`p(95)<${SLA.p95_ms}`],
    'http_req_duration{type:write}': ['p(95)<800'],
    'http_req_duration{type:read}':  [`p(95)<${SLA.p95_ms}`],
  },
};

// Estatísticas de percentil calculadas para Trends no relatório final
export const TREND_STATS = ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'];

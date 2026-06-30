import http from 'k6/http';
import { check } from 'k6';
import { recordResponse } from './metrics.js';

const CT_JSON = { 'Content-Type': 'application/json' };

function merge(base, extra) {
  return {
    ...extra,
    headers: { ...base.headers, ...(extra.headers || {}) },
    tags:    { ...base.tags,    ...(extra.tags    || {}) },
  };
}

export function get(url, opts = {}, type = 'read') {
  const res = http.get(url, merge({ headers: {}, tags: { type } }, opts));
  recordResponse(res, type);
  return res;
}

export function post(url, body, opts = {}, type = 'write') {
  const res = http.post(
    url,
    JSON.stringify(body),
    merge({ headers: CT_JSON, tags: { type } }, opts),
  );
  recordResponse(res, type);
  return res;
}

export function patch(url, body, opts = {}, type = 'write') {
  const res = http.patch(
    url,
    JSON.stringify(body),
    merge({ headers: CT_JSON, tags: { type } }, opts),
  );
  recordResponse(res, type);
  return res;
}

export function del(url, opts = {}, type = 'write') {
  const res = http.del(url, null, merge({ headers: {}, tags: { type } }, opts));
  recordResponse(res, type);
  return res;
}

// Assertion rápida de sucesso — retorna true se passou
export function ok(res, label) {
  return check(res, { [`${label}: 2xx`]: (r) => r.status >= 200 && r.status < 300 });
}

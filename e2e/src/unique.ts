// Gera dados únicos por execução para evitar conflitos entre runs
const RUN_ID = Date.now().toString(36);

export function unique(prefix: string) {
  return `${prefix}_${RUN_ID}`;
}

export function uniqueEmail(prefix: string) {
  return `${prefix}_${RUN_ID}@e2e.test`;
}

export function uniqueUuid() {
  return crypto.randomUUID();
}

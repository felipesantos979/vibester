// Guarda os dados da sessão logada no sessionStorage.
// Mantém a chave 'vibester_logged' que o DashboardLayout já usava,
// e adiciona token + accountId para as chamadas reais de API.

const KEYS = {
  logged: 'vibester_logged',
  token: 'vibester_token',
  accountId: 'vibester_account_id',
  displayName: 'vibester_display_name',
} as const;

export interface SessionData {
  token: string;
  accountId: string;
  displayName?: string;
}

export function saveSession({ token, accountId, displayName }: SessionData) {
  sessionStorage.setItem(KEYS.logged, 'true');
  sessionStorage.setItem(KEYS.token, token);
  sessionStorage.setItem(KEYS.accountId, accountId);
  if (displayName) sessionStorage.setItem(KEYS.displayName, displayName);
}

export function getAccountId(): string | null {
  return sessionStorage.getItem(KEYS.accountId);
}

export function getDisplayName(): string | null {
  return sessionStorage.getItem(KEYS.displayName);
}

export function isLoggedIn(): boolean {
  return sessionStorage.getItem(KEYS.logged) === 'true';
}

export function clearSession() {
  Object.values(KEYS).forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

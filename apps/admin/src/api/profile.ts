import { apiFetch, ApiError } from '../lib/apiClient';
import type { UserProfile } from '../lib/apiTypes';

export async function getProfile(accountId: string): Promise<UserProfile | null> {
  try {
    return await apiFetch<UserProfile>(`/user/users/profile/${accountId}`, { auth: false });
  } catch (err) {
    // Conta sem perfil criado ainda (comum pra contas registradas fora do app mobile) -> 404
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export function createProfile(accountId: string, name?: string, username?: string): Promise<UserProfile> {
  return apiFetch<UserProfile>('/user/users/profile', {
    method: 'POST',
    body: JSON.stringify({ accountId, name, username }),
  });
}

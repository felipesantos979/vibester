import { apiFetch } from '../lib/apiClient';
import type { LoginResponse, RegisterResponse } from '../lib/apiTypes';

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export function login({ emailOrUsername, password }: LoginInput): Promise<LoginResponse> {
  // A API aceita email OU username no mesmo body. Detecta pelo formato.
  const isEmail = emailOrUsername.includes('@');
  const body = isEmail
    ? { email: emailOrUsername, password }
    : { username: emailOrUsername, password };

  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    auth: false,
  });
}

export interface RegisterInput {
  username: string;
  name: string;
  email: string;
  password: string;
  bornAt: string; // formato YYYY-MM-DD
}

export function register(input: RegisterInput): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
    auth: false,
  });
}

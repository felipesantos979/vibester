import { randomUUID } from 'crypto';

export function makeUser(params?: Partial<any>) {
  const id = params?.id || randomUUID();
  const accountId = params?.accountId || randomUUID();
  return {
    id,
    accountId,
    username: params?.username || 'johndoe',
    email: params?.email || 'john@example.com',
    passwordHash: params?.passwordHash || 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

import { vi } from 'vitest';

export const sign = vi.fn(() => 'signed-token');
export const verify = vi.fn(() => ({ userId: 'user-id' }));
export default { sign, verify };

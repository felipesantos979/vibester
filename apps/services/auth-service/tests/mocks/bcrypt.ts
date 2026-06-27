import { vi } from 'vitest';

export const compare = vi.fn(() => true);
export const hash = vi.fn((p) => `hashed-${p}`);
export default { compare, hash };

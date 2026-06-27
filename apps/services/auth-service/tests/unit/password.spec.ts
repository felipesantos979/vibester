import { vi } from 'vitest';
import bcrypt from 'bcryptjs';

vi.mock('bcryptjs');

describe('Password helpers', () => {
  it('should hash password', async () => {
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never);

    const res = await bcrypt.hash('p', 10);

    expect(bcrypt.hash).toHaveBeenCalledWith('p', 10);
    expect(res).toBe('hashed');
  });

  it('should compare password', async () => {
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const ok = await bcrypt.compare('p', 'h');

    expect(bcrypt.compare).toHaveBeenCalledWith('p', 'h');
    expect(ok).toBe(true);
  });
});

import { vi } from 'vitest';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

describe('JWT failure cases', () => {
  it('should throw when verify fails', () => {
    vi.mocked(jwt.verify).mockImplementation(() => { throw new Error('invalid'); });

    expect(() => jwt.verify('t', 's')).toThrow('invalid');
  });
});

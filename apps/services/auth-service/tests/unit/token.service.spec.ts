import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env';

jest.mock('jsonwebtoken');

describe('Token generation/validation', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should sign token with env secret', () => {
    ((jwt.sign) as unknown as jest.Mock).mockReturnValue('signed');
    const token = ((jwt.sign) as unknown as jest.Mock)({ userId: 'u' }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    expect((jwt.sign as unknown as jest.Mock)).toHaveBeenCalledWith({ userId: 'u' }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    expect(token).toBe('signed');
  });

  it('should verify token', () => {
    ((jwt.verify) as unknown as jest.Mock).mockReturnValue({ userId: 'u' });
    const payload = ((jwt.verify) as unknown as jest.Mock)('token', env.jwtSecret);
    expect((jwt.verify as unknown as jest.Mock)).toHaveBeenCalledWith('token', env.jwtSecret);
    expect(payload).toHaveProperty('userId', 'u');
  });
});

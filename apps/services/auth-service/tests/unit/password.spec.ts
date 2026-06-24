import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('Password helpers', () => {
  it('should hash password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const res = await bcrypt.hash('p', 10);
    expect(bcrypt.hash).toHaveBeenCalledWith('p', 10);
    expect(res).toBe('hashed');
  });

  it('should compare password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const ok = await bcrypt.compare('p', 'h');
    expect(bcrypt.compare).toHaveBeenCalledWith('p', 'h');
    expect(ok).toBe(true);
  });
});

const prismaMockRequire = require('../mocks/prisma.client') as any;
jest.mock('../../src/prisma', () => ({
  __esModule: true,
  default: prismaMockRequire.default,
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token'),
}));

import { LoginService } from '../../src/services/login.service';
const { default: prismaMock, mockAccess } = prismaMockRequire;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { makeUser } from '../factories/user.factory';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LoginService();
  });

  it('should login successfully with email', async () => {
    const user = makeUser({ passwordHash: 'hashed' });
    mockAccess.findFirst.mockResolvedValueOnce(user);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.login({ email: user.email, password: 'plain' });

    expect(mockAccess.findFirst).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
    expect(result).toHaveProperty('token');
    expect(result.id).toBe(user.id);
  });

  it('should throw when user not found', async () => {
    mockAccess.findFirst.mockResolvedValueOnce(null);

    await expect(service.login({ email: 'no@user.com', password: 'x' })).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('should throw when password invalid', async () => {
    const user = makeUser({ passwordHash: 'hashed' });
    mockAccess.findFirst.mockResolvedValueOnce(user);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(service.login({ email: user.email, password: 'wrong' })).rejects.toThrow('Usuário ou senha inválidos');
  });
});

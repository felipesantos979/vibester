import { vi } from 'vitest';
import { LoginController } from '../../src/controllers/login.controller';
import { FastifyReply } from 'fastify';
import { LoginService } from '../../src/services/login.service';

vi.mock('../../src/services/login.service');

const mockReply = () => {
  const status = vi.fn().mockReturnThis();
  const send = vi.fn().mockReturnThis();
  return { status, send } as unknown as FastifyReply;
};

describe('LoginController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 400 on invalid payload', async () => {
    const controller = new LoginController();
    const req: any = { body: { password: 'short' } };
    const reply = mockReply();

    await controller.login(req, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalled();
  });

  it('should call service and return 200', async () => {
    vi.mocked(LoginService).prototype.login = vi.fn().mockResolvedValue({ id: '1', token: 't', accountId: 'acc' });

    const controller = new LoginController();
    const req: any = { body: { email: 'a@b.com', password: 'password' } };
    const reply = mockReply();

    await controller.login(req, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({ id: '1', token: 't', accountId: 'acc' });
  });
});

import { vi } from 'vitest';
import { RegisterController } from '../../src/controllers/register.controller';
import { RegisterService } from '../../src/services/register.service';

vi.mock('../../src/services/register.service');

const mockReply = () => {
  const status = vi.fn().mockReturnThis();
  const send = vi.fn().mockReturnThis();
  return { status, send } as any;
};

describe('RegisterController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should call register service and return 201', async () => {
    vi.mocked(RegisterService).prototype.register = vi.fn().mockResolvedValue({ id: '1', username: 'u' });

    const controller = new RegisterController();
    const req: any = { body: { username: 'u', email: 'e', password: 'p', name: 'n', bornAt: new Date().toISOString() } };
    const reply = mockReply();

    await controller.register(req, reply);

    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith({ id: '1', username: 'u' });
  });
});

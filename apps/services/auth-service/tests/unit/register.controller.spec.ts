import { RegisterController } from '../../src/controllers/register.controller';
import { RegisterService } from '../../src/services/register.service';

jest.mock('../../src/services/register.service');

const mockReply = () => {
  const status = jest.fn().mockReturnThis();
  const send = jest.fn().mockReturnThis();
  return { status, send } as any;
};

describe('RegisterController', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call register service and return 201', async () => {
    const mocked = (RegisterService as jest.MockedClass<typeof RegisterService>);
    mocked.prototype.register = jest.fn().mockResolvedValue({ id: '1', username: 'u' });

    const controller = new RegisterController();
    const req: any = { body: { username: 'u', email: 'e', password: 'p', name: 'n', bornAt: new Date().toISOString() } };
    const reply = mockReply();

    await controller.register(req, reply);

    expect(reply.status).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith({ id: '1', username: 'u' });
  });
});

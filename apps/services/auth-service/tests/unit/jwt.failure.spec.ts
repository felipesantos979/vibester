import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT failure cases', () => {
  it('should throw when verify fails', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid'); });
    expect(() => jwt.verify('t', 's')).toThrow('invalid');
  });
});

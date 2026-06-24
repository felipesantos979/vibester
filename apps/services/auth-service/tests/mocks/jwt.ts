export const sign = jest.fn(() => 'signed-token');
export const verify = jest.fn(() => ({ userId: 'user-id' }));
export default { sign, verify };

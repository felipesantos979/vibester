export const compare = jest.fn(() => true);
export const hash = jest.fn((p) => `hashed-${p}`);
export default { compare, hash };

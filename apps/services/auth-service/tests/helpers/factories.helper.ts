export function makeRegisterInput(overrides?: Partial<any>) {
  return {
    username: overrides?.username || 'johndoe',
    name: overrides?.name || 'John Doe',
    email: overrides?.email || 'john@example.com',
    password: overrides?.password || 'secret123',
    bornAt: overrides?.bornAt || new Date().toISOString(),
  };
}

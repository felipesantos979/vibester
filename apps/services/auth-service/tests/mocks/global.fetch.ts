// Simple fetch mock for tests
export default function setupFetchMock() {
  // @ts-ignore
  global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
}

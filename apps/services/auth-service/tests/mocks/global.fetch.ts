import { vi } from 'vitest';

export default function setupFetchMock() {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
}

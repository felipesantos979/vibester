const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 3;
const BASE_DELAY_MS = 500;

export async function fetchWithTimeout(
  url: URL | string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  retries = DEFAULT_RETRIES
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url.toString(), { signal: AbortSignal.timeout(timeoutMs) });
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, BASE_DELAY_MS * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}

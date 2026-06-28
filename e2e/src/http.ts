export type HttpResponse<T = unknown> = {
  status: number;
  body: T;
  ok: boolean;
};

async function request<T>(
  method: string,
  url: string,
  options: { body?: unknown; token?: string } = {},
): Promise<HttpResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code ?? "UNKNOWN";
    const message = (err as Error).message ?? String(err);
    throw new Error(`[E2E] ${method} ${url} — serviço inacessível (${code}): ${message}`);
  }

  let body: T;
  const text = await res.text();
  try {
    body = JSON.parse(text) as T;
  } catch {
    body = text as unknown as T;
  }

  return { status: res.status, body, ok: res.ok };
}

export const http = {
  get: <T>(url: string, token?: string) => request<T>("GET", url, { token }),
  post: <T>(url: string, body?: unknown, token?: string) =>
    request<T>("POST", url, { body, token }),
  put: <T>(url: string, body?: unknown, token?: string) =>
    request<T>("PUT", url, { body, token }),
  patch: <T>(url: string, body?: unknown, token?: string) =>
    request<T>("PATCH", url, { body, token }),
  // body é opcional — DELETE /likes envia userId no body conforme spec do post-service
  delete: <T>(url: string, body?: unknown, token?: string) =>
    request<T>("DELETE", url, { body, token }),
};

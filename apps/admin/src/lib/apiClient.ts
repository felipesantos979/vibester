// Cliente HTTP simples para falar com a API real do Vibester.
// Centraliza: base URL, header de auth, parse de erro, parse de JSON.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return sessionStorage.getItem('vibester_token');
}

interface RequestOptions extends RequestInit {
  auth?: boolean; // se true, manda o Bearer token (default: true)
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL não configurada. Copie .env.example para .env e preencha.'
    );
  }

  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  // 204 No Content (ex: delete de post/comentário)
  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      (body && (body.message || body.error)) || `Erro ${response.status} ao chamar ${path}`;
    throw new ApiError(response.status, message);
  }

  return body as T;
}

// PUT direto pro bucket (Cloudflare R2) usando a URL pré-assinada.
// Esse não passa pela nossa API, então não usa apiFetch.
export async function uploadFileToPresignedUrl(uploadUrl: string, file: File): Promise<void> {
  // PROVISÓRIO: O bucket R2 não tem CORS configurado, então o browser bloqueia o PUT direto.
  // Vamos interceptar a URL e enviar pelo nosso proxy do Vite (configurado em vite.config.ts)
  let finalUrl = uploadUrl;
  const R2_DOMAIN = 'https://vibester-bucket.25730f25551e1206f0cc2cbe6d3c4b53.r2.cloudflarestorage.com';
  
  if (uploadUrl.startsWith(R2_DOMAIN)) {
    finalUrl = uploadUrl.replace(R2_DOMAIN, '/r2-upload');
  }

  const response = await fetch(finalUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
  });
  if (!response.ok) {
    throw new Error(`Falha ao enviar imagem (${response.status})`);
  }
}

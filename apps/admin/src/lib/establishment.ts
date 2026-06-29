import { apiFetch, ApiError } from './apiClient';
import type { Establishment, EstablishmentProfile } from './apiTypes';

const CACHE_KEY = 'vibester_establishment_id';

/**
 * PROVISÓRIO: a API do Vibester ainda não tem um vínculo entre a conta
 * logada (auth-service) e um Establishment (establishment-service).
 * Esse helper resolve o establishmentId assim:
 *   1. Se VITE_ESTABLISHMENT_ID estiver definida no .env, usa ela.
 *   2. Se já buscou antes e está em cache (localStorage), usa o cache.
 *   3. Senão, busca o 1º estabelecimento de GET /establishment/establishments
 *      e guarda em localStorage pra não buscar de novo a cada load.
 *
 * Se o establishment-service estiver fora do ar (502/503), lança um erro
 * amigável ao invés de estourar genericamente.
 */
export async function getEstablishmentId(): Promise<string> {
  const fromEnv = import.meta.env.VITE_ESTABLISHMENT_ID;
  if (fromEnv) return fromEnv;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) return cached;

  try {
    const list = await apiFetch<Establishment[]>('/establishment/establishments', { auth: false });
    if (!list.length) {
      throw new Error(
        'Nenhum estabelecimento cadastrado na API ainda. Configure VITE_ESTABLISHMENT_ID no .env manualmente.'
      );
    }

    const id = list[0].id;
    localStorage.setItem(CACHE_KEY, id);
    return id;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 502 || err.status === 503)) {
      throw new Error(
        'O serviço de estabelecimentos está temporariamente fora do ar (502). ' +
        'Configure VITE_ESTABLISHMENT_ID no .env com o UUID do seu estabelecimento para contornar, ' +
        'ou aguarde o backend voltar.'
      );
    }
    throw err;
  }
}

export function getEstablishmentProfile(id: string): Promise<EstablishmentProfile> {
  return apiFetch<EstablishmentProfile>(`/establishment/establishments/${id}`, { auth: false });
}

export function updateEstablishmentRating(id: string, rating: number): Promise<Establishment> {
  return apiFetch<Establishment>(`/establishment/establishments/${id}/rating`, {
    method: 'PATCH',
    body: JSON.stringify({ rating }),
  });
}

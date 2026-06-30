import { env } from "../config/env";
import { fetchWithTimeout } from "../utils/retry";

export interface EstablishmentResponse {
  id: string;
  googlePlaceId: string | null;
  name: string;
  latitude: number;
  longitude: number;
}

export class EstablishmentClient {
  private readonly baseUrl = env.establishmentServiceUrl;

  async listOpenEstablishments(): Promise<EstablishmentResponse[]> {
    if (!this.baseUrl) {
      throw new Error("ESTABLISHMENT_SERVICE_URL não configurada");
    }

    const response = await fetchWithTimeout(`${this.baseUrl}/establishments/open`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar estabelecimentos: ${response.status}`);
    }

    return response.json();
  }

  async updateMovementLevel(
    id: string,
    level: "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH" | "UNAVAILABLE",
    source: "SERPAPI" | "ESTIMATED"
  ): Promise<void> {
    if (!this.baseUrl) {
      throw new Error("ESTABLISHMENT_SERVICE_URL não configurada");
    }

    const response = await fetchWithTimeout(
      `${this.baseUrl}/establishments/${id}/movement`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, source }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao atualizar movimento: ${response.status}`);
    }
  }
}

import { env } from "../config/env";

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

    const response = await fetch(`${this.baseUrl}/establishments/open`);

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar estabelecimentos: ${response.status}`
      );
    }

    return response.json();
  }
}
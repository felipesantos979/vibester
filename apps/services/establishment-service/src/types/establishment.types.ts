export interface EstablishmentInterface {
  id: string;
  name: string;
  photoUrl: string;
  bannerUrl: string;
  category: string;
  priceIndicator: string;
  averageRating: number;
  latitude: number;
  longitude: number;
  distanceTo?: number;
}

export interface ListEstablishmentsQuerystring {
  latitude?: number;
  longitude?: number;
}

export interface GetEstablishmentParams {
  id: string;
}

export interface EstablishmentProfileResponse {
  icon: string;
  name: string;
  banner: string;
  location: {
    latitude: number;
    longitude: number;
  };
  category: string;
  priceIndicator: string;
  rating: number;
}

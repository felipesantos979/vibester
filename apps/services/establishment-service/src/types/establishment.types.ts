export interface EstablishmentInterface {
  id: string;
  googlePlaceId?: string | null,
  name: string;
  photoUrl?: string | null;
  bannerUrl?: string | null;
  category: string;
  priceIndicator?: string | null;
  averageRating: number;
  latitude: number;
  longitude: number;
  movementLevel?: MovementLevelResponse | null;
  distanceTo?: number;
}

export type SortBy = "name" | "rating" | "distance";

export interface ListEstablishmentsQuerystring {
  latitude?: string;
  longitude?: string;
  category?: string;
  minRating?: string;
  search?: string;
  sortBy?: SortBy;
}

export interface GetEstablishmentParams {
  id: string;
}

export interface EstablishmentProfileResponse {
  icon: string | null;
  name: string;
  banner: string | null;
  location: {
    latitude: number;
    longitude: number;
  };
  category: string;
  priceIndicator: string | null;
  rating: number;
  movementLevel?: MovementLevelResponse | null;
}

export interface MovementLevelResponse {
  level: string;
  source: string;
  updatedAt: Date;
}

export interface UpdateMovementLevelParams {
  id: string;
}

export interface UpdateMovementLevelBody {
  level: "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH" | "UNAVAILABLE";
  source: "SERPAPI" | "GOOGLE_MAPS" | "MANUAL" | "ESTIMATED";
}

export interface OpeningHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

export interface ListEstablishmentsFilters {
  userLat?: number;
  userLon?: number;
  category?: string;
  minRating?: number;
  search?: string;
  sortBy?: SortBy;
}

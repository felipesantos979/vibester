export type GooglePlaceResult = {
  place_id: string;
  name: string;
  types?: string[];
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

export type GooglePlacesResponse = {
  status: string;
  error_message?: string;
  results?: GooglePlaceResult[];
  next_page_token?: string;
};
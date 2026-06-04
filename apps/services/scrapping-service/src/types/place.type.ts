export interface Place {
  name: string;
  placeId: string;
  latitude: number;
  longitude: number;
  rating?: number;
  address: string;
  city: string;
  state: string;
}

//provisorio
export type PlaceResult = {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
}
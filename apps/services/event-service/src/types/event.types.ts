export interface CreateEventInput {
  name: string;
  photoUrl: string;
  category: string;
  organizer: string;
  location: string;
  startDate: string;
  endDate: string;
  ticketLink?: string;
  latitude: number;
  longitude: number;
  establishmentId: string;
}

export interface UpdateEventInput {
  name?: string;
  photoUrl?: string;
  category?: string;
  organizer?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  ticketLink?: string;
  latitude?: number;
  longitude?: number;
}

export interface ListEventsInput{
  latitude: number;
  longitude: number;
  radiusKm?: number;
}
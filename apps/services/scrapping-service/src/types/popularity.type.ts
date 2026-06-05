export interface CurrentPopularity {
  placeId: string;
  currentBusyness?: number;
  statusText?: string;
  timeSpent?: string;
  capturedAt: Date;
  isEstimated: boolean;
}

export interface HourlyPopularity {
  hour: number;
  busynessScore: number;
  liveBusynessScore?: number;
  isCurrent: boolean;
}
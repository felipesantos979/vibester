export interface SerpApiResponse {
  place_results?: {
    title?: string;

    popular_times?: {
      current_day?: string;

      live_hash?: {
        info?: string;
        time_spent?: string;
      };

      graph_results?: {
        [day: string]: SerpApiGraphItem[];
      };
    };
  };
}

export interface SerpApiGraphItem {
  time: string;
  busyness_score?: number;
  live_busyness_score?: number;
  current?: boolean;
  info?: string;
}
import { env } from "../config/env";

const WEEK_DAYS: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export type PopularityHourData = {
  hour: number;
  busyness_score: number;
  live_busyness_score: number | null;
  is_current: boolean;
  status_text: string;
};

export type PlacePopularityResult = {
  currentDay: string | null;
  currentDayInt: number | null;
  liveStatus: string | null;
  liveBusynessScore: number | null;
  timeSpent: string | null;
  hoursData: PopularityHourData[];
};

export class SerpApiService {
  async getPlacePopularity(placeId: string): Promise<PlacePopularityResult | null> {
    const url = new URL("https://serpapi.com/search.json");

    url.searchParams.set("engine", "google_maps");
    url.searchParams.set("type", "place");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("api_key", env.serpapiKey ?? "");
    url.searchParams.set("hl", "pt-BR");
    url.searchParams.set("gl", "br");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao consultar SerpAPI: ${response.status}`);
    }

    const result = await response.json();
    
    const place = result.place_results ?? {};
    const popular = place.popular_times ?? {};

    if (!popular || Object.keys(popular).length === 0) {
      return null;
    }

    const currentDay = popular.current_day ?? null;
    const currentDayInt = currentDay ? WEEK_DAYS[currentDay] ?? null : null;
    const live = popular.live_hash ?? {};
    const graph = popular.graph_results ?? {};

    const hoursData: PopularityHourData[] = [];
    let liveBusynessScore: number | null = null;

    const todayGraph = currentDay ? graph[currentDay] : null;

    if (currentDay && Array.isArray(todayGraph)) {
      const currentHour = new Date().getHours();

      for (const hourData of todayGraph) {
        const time = hourData.time ?? "";
        const hour = Number(time.split(":")[0]) || 0;

        const isCurrent = Boolean(hourData.current);

        const score =
          hourData.live_busyness_score ??
          hourData.busyness_score ??
          null;

        if (isCurrent && typeof score === "number") {
          liveBusynessScore = score;
        }

        hoursData.push({
          hour,
          busyness_score: hourData.busyness_score ?? 0,
          live_busyness_score: hourData.live_busyness_score ?? null,
          is_current: isCurrent,
          status_text: hourData.info ?? "",
        });
      }

      if (liveBusynessScore === null) {
        const currentHourData = hoursData.find((item) => item.hour === currentHour);

        if (currentHourData) {
          liveBusynessScore =
            currentHourData.live_busyness_score ??
            currentHourData.busyness_score ??
            null;
        }
      }
    }

    return {
      currentDay,
      currentDayInt,
      liveStatus: live.info ?? null,
      liveBusynessScore,
      timeSpent: live.time_spent ?? null,
      hoursData,
    };
  }
}
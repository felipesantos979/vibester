import { env } from "../config/env";
import { fetchWithTimeout } from "../utils/retry";
import { TTLCache } from "../utils/cache";

const WEEK_DAYS: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const CACHE_TTL_MS = 30 * 60 * 1000;

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
  category: string | null;
};

const SERPAPI_TYPE_TO_CATEGORY: Record<string, string> = {
  bar: "bar",
  "bar e grill": "bar",
  "bar e restaurante": "bar",
  pub: "bar",
  "bar esportivo": "bar",
  "night club": "night_club",
  "clube noturno": "night_club",
  boate: "night_club",
  balada: "night_club",
  restaurante: "restaurant",
  restaurant: "restaurant",
  café: "cafe",
  cafe: "cafe",
  cafeteria: "cafe",
  "coffee shop": "cafe",
  lanchonete: "cafe",
};

function mapSerpApiTypeToCategory(type: string | undefined): string | null {
  if (!type) return null;
  return SERPAPI_TYPE_TO_CATEGORY[type.toLowerCase()] ?? null;
}

export class SerpApiService {
  private cache = new TTLCache<string, PlacePopularityResult | null>();

  async getPlacePopularity(placeId: string): Promise<PlacePopularityResult | null> {
    const cached = this.cache.get(placeId);
    if (cached !== null) return cached;

    const result = await this.fetchPopularity(placeId);
    this.cache.set(placeId, result, CACHE_TTL_MS);
    return result;
  }

  private async fetchPopularity(placeId: string): Promise<PlacePopularityResult | null> {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_maps");
    url.searchParams.set("type", "place");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("api_key", env.serpapiKey ?? "");
    url.searchParams.set("hl", "pt-BR");
    url.searchParams.set("gl", "br");

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Erro ao consultar SerpAPI: ${response.status}`);
    }

    const result = await response.json();

    const place = result.place_results ?? {};
    const popular = place.popular_times ?? {};
    const category = mapSerpApiTypeToCategory(place.type);

    if (!popular || Object.keys(popular).length === 0) return null;

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
        const score = hourData.live_busyness_score ?? hourData.busyness_score ?? null;

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
            currentHourData.live_busyness_score ?? currentHourData.busyness_score ?? null;
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
      category,
    };
  }
}

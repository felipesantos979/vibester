
from serpapi import GoogleSearch
from dotenv import load_dotenv
import os

load_dotenv()
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

DIAS_SEMANA = {
    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6
}


def buscar_popularity(place_id):
    try:
        search = GoogleSearch({
            "engine": "google_maps",
            "type": "place",
            "place_id": place_id,
            "api_key": SERPAPI_KEY,
            "hl": "pt-BR",
            "gl": "br"
        })

        result = search.get_dict()
        place = result.get("place_results", {})
        popular = place.get("popular_times", {})

        if not popular:
            return None

        current_day_str = popular.get("current_day")
        current_day_int = DIAS_SEMANA.get(current_day_str)
        live = popular.get("live_hash", {})
        graph = popular.get("graph_results", {})

        hours_data = []
        live_busyness_score = None

        if current_day_str and current_day_str in graph:
            for hora in graph[current_day_str]:
                time_str = hora.get("time", "")
                try:
                    hour_int = int(time_str.split(":")[0])
                except:
                    hour_int = 0

                is_current = hora.get("current", False)

                # Pega o score ao vivo da hora atual
                # Prioriza live_busyness_score, se nao tiver usa busyness_score
                score = hora.get("live_busyness_score") or hora.get("busyness_score", 0)

                if is_current:
                    live_busyness_score = score

                hours_data.append({
                    "hour": hour_int,
                    "busyness_score": hora.get("busyness_score", 0),
                    "live_busyness_score": hora.get("live_busyness_score"),
                    "is_current": is_current,
                    "status_text": hora.get("info", "")
                })

        return {
            "current_day": current_day_str,
            "current_day_int": current_day_int,
            "live_status": live.get("info"),
            "live_busyness_score": live_busyness_score,
            "time_spent": live.get("time_spent"),
            "hours_data": hours_data
        }

    except Exception as e:
        print(f"  [ERRO SerpApi] {place_id}: {e}")
        return None
from database.connection import Database
from repositories.place_repository import PlaceRepository
from repositories.place_hours_repository import PlaceHoursRepository
from repositories.current_popularity_repository import CurrentPopularityRepository
from repositories.popular_times_daily_repository import PopularTimesDailyRepository
from services.serpapi_service import buscar_popularity
from models.place import Place
import requests
import schedule
import time
from datetime import date, datetime
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

db = Database()
place_repo = PlaceRepository(db)
hours_repo = PlaceHoursRepository(db)
current_repo = CurrentPopularityRepository(db)
daily_repo = PopularTimesDailyRepository(db)

TIPOS_VALIDOS = {"bar", "night_club", "restaurant", "cafe"}
TIPOS_INVALIDOS = {"hair_care", "beauty_salon", "spa", "doctor", "health", "car_wash", "lodging", "barber_shop"}

#Para mudar para buscar todos, alterar para NONE e remover o print de limite aplicado
LIMITE_LUGARES = 5


def buscar_lugares_google(api_key, tipo, lat=-23.4205, lng=-51.9333, radius=5000):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    lugares = []

    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": tipo,
        "key": api_key
    }

    while True:
        response = requests.get(url, params=params)
        data = response.json()

        if data.get("status") != "OK":
            break

        for item in data.get("results", []):
            tipos_do_lugar = set(item.get("types", []))

            if not tipos_do_lugar & TIPOS_VALIDOS:
                continue
            if tipos_do_lugar & TIPOS_INVALIDOS:
                continue

            lugares.append({
                "place_id": item.get("place_id"),
                "name": item.get("name"),
                "lat": item["geometry"]["location"]["lat"],
                "lng": item["geometry"]["location"]["lng"],
                "rating": item.get("rating"),
            })

        next_page = data.get("next_page_token")
        if not next_page:
            break

        time.sleep(2)
        params = {"pagetoken": next_page, "key": api_key}

    return lugares


def buscar_detalhes_google(api_key, place_id):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "opening_hours,formatted_address,address_components",
        "key": api_key
    }
    response = requests.get(url, params=params)
    data = response.json()
    return data.get("result", {})


def job_mensal():
    print("[MENSAL] Buscando lugares...")

    tipos = ["bar", "night_club", "restaurant", "cafe"]
    todos = []
    vistos = set()

    for tipo in tipos:
        resultados = buscar_lugares_google(API_KEY, tipo=tipo)
        print(f"  [{tipo}] {len(resultados)} lugares validos")
        for item in resultados:
            pid = item.get("place_id")
            if pid and pid not in vistos:
                vistos.add(pid)
                todos.append(item)

    print(f"\nTotal unico encontrado: {len(todos)}")

    if LIMITE_LUGARES is not None:
        todos = todos[:LIMITE_LUGARES]
        print(f"Limite aplicado: {len(todos)} lugares\n")
    else:
        print(f"Processando todos: {len(todos)} lugares\n")

    for item in todos:
        place_id = item.get("place_id")
        name = item.get("name")

        detalhes = buscar_detalhes_google(API_KEY, place_id)

        address = detalhes.get("formatted_address", "")
        city = "Maringá"
        state = "PR"

        place = Place(
            name=name,
            place_id=place_id,
            lat=item.get("lat"),
            lng=item.get("lng"),
            rating=item.get("rating"),
            address=address,
            city=city,
            state=state
        )

        try:
            place_repo.save(place)
            print(f"  [SALVO] {name}")
        except Exception as e:
            print(f"  [ERRO place] {name}: {e}")
            continue

        periods = detalhes.get("opening_hours", {}).get("periods", [])
        if periods:
            try:
                hours_repo.save(place_id, periods)
                print(f"  [HORARIOS] {name}")
            except Exception as e:
                print(f"  [ERRO horarios] {name}: {e}")

    print("[MENSAL] Concluido.")


def job_horario():
    print("[HORARIO] Iniciando...")

    daily_repo.limpar_antigos()

    lugares_abertos = hours_repo.get_open_now()
    print(f"  Lugares abertos agora: {len(lugares_abertos)}")

    hoje = date.today()

    for place_id, name in lugares_abertos:
        print(f"  Consultando: {name}")

        dados = buscar_popularity(place_id)

        if dados:
            busyness_score = dados.get("live_busyness_score")
            status_text = dados.get("live_status")
            time_spent = dados.get("time_spent")

            current_repo.save(
                place_id=place_id,
                busyness_score=busyness_score,
                status_text=status_text,
                time_spent=time_spent,
                is_estimated=False
            )

            daily_repo.save(
                place_id=place_id,
                captured_date=hoje,
                day_of_week=dados.get("current_day_int"),
                hours_data=dados.get("hours_data", [])
            )

            print(f"  [OK] {name}: {busyness_score}% - {status_text}")

        else:
            print(f"  [FALHOU] {name} - tentando fallback...")

            google_day = (datetime.now().weekday() + 1) % 7
            medias = daily_repo.get_media_fallback(place_id, google_day)

            if medias:
                hora_atual = datetime.now().hour
                score_estimado = next(
                    (int(media) for hora, media in medias if hora == hora_atual),
                    None
                )

                if score_estimado is not None:
                    current_repo.save(
                        place_id=place_id,
                        busyness_score=score_estimado,
                        status_text="Estimativa baseada em historico",
                        time_spent=None,
                        is_estimated=True
                    )
                    print(f"  [ESTIMADO] {name}: {score_estimado}%")
                else:
                    print(f"  [SEM DADO] {name}")
            else:
                print(f"  [SEM HISTORICO] {name}")

    print("[HORARIO] Concluido.")


schedule.every().day.at("03:00").do(job_mensal)
schedule.every().hour.do(job_horario)

job_mensal()
job_horario()

print("\nAgendador rodando...")
while True:
    schedule.run_pending()
    time.sleep(60)
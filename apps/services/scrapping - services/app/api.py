from fastapi import FastAPI
from database.connection import Database

app = FastAPI()
db = Database()


@app.get("/places")
def get_places():
    db.cursor.execute("""
        SELECT
            p.place_id, p.name, p.lat, p.lng, p.rating,
            p.address, p.city, p.state,
            cp.busyness_score, cp.status_text, cp.time_spent,
            cp.is_estimated, cp.captured_at
        FROM places p
        LEFT JOIN LATERAL (
            SELECT busyness_score, status_text, time_spent, is_estimated, captured_at
            FROM current_popularity
            WHERE place_id = p.place_id
            ORDER BY captured_at DESC
            LIMIT 1
        ) cp ON true
        ORDER BY p.name
    """)
    places = db.cursor.fetchall()

    db.cursor.execute("""
        SELECT place_id, day_of_week, open_time, close_time
        FROM place_hours
        ORDER BY place_id, day_of_week
    """)
    hours_by_place = {}
    for row in db.cursor.fetchall():
        pid = row[0]
        if pid not in hours_by_place:
            hours_by_place[pid] = []
        hours_by_place[pid].append({
            "day_of_week": row[1],
            "open_time": row[2],
            "close_time": row[3]
        })

    db.cursor.execute("""
        SELECT place_id, captured_date, day_of_week, hour,
               busyness_score, is_current, status_text
        FROM popular_times_daily
        ORDER BY place_id, captured_date, hour
    """)
    daily_by_place = {}
    for row in db.cursor.fetchall():
        pid = row[0]
        if pid not in daily_by_place:
            daily_by_place[pid] = []
        daily_by_place[pid].append({
            "captured_date": row[1].isoformat(),
            "day_of_week": row[2],
            "hour": row[3],
            "busyness_score": row[4],
            "is_current": row[5],
            "status_text": row[6]
        })

    result = []
    for row in places:
        place_id = row[0]
        result.append({
            "place_id": place_id,
            "name": row[1],
            "lat": row[2],
            "lng": row[3],
            "rating": row[4],
            "address": row[5],
            "city": row[6],
            "state": row[7],
            "opening_hours": hours_by_place.get(place_id, []),
            "current_popularity": {
                "busyness_score": row[8],
                "status_text": row[9],
                "time_spent": row[10],
                "is_estimated": row[11],
                "captured_at": row[12].isoformat() if row[12] else None
            } if row[8] is not None else None,
            "popular_times_history": daily_by_place.get(place_id, [])
        })

    return result

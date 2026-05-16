from datetime import datetime, timedelta, date

class PopularTimesDailyRepository:
    def __init__(self, db):
        self.db = db

    def save(self, place_id, captured_date, day_of_week, hours_data):
        self.db.cursor.execute("""
            DELETE FROM popular_times_daily
            WHERE place_id = ? AND captured_date = ?
        """, (place_id, captured_date))

        for hora in hours_data:
            self.db.cursor.execute("""
                INSERT INTO popular_times_daily
                    (place_id, captured_date, day_of_week, hour, busyness_score, is_current, status_text)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                place_id,
                captured_date,
                day_of_week,
                hora.get("hour"),
                hora.get("busyness_score", 0),
                hora.get("is_current", False),
                hora.get("status_text", "")
            ))

        self.db.commit()

    def limpar_antigos(self):
        limite = date.today() - timedelta(days=14)
        self.db.cursor.execute("""
            DELETE FROM popular_times_daily WHERE captured_date < ?
        """, (limite,))
        self.db.commit()

    def get_media_fallback(self, place_id, day_of_week):
        self.db.cursor.execute("""
            SELECT hour, AVG(busyness_score) as media
            FROM popular_times_daily
            WHERE place_id = ? AND day_of_week = ?
            GROUP BY hour
            ORDER BY hour
        """, (place_id, day_of_week))
        return self.db.cursor.fetchall()
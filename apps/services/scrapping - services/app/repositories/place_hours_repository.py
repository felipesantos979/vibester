from datetime import datetime

class PlaceHoursRepository:
    def __init__(self, db):
        self.db = db

    def save(self, place_id, periods):
        self.db.cursor.execute("DELETE FROM place_hours WHERE place_id = ?", (place_id,))

        for period in periods:
            open_day = period.get("open", {}).get("day")
            open_time = period.get("open", {}).get("time")
            close_time = period.get("close", {}).get("time", "2359")

            if open_day is not None and open_time:
                self.db.cursor.execute("""
                    INSERT INTO place_hours (place_id, day_of_week, open_time, close_time)
                    VALUES (?, ?, ?, ?)
                """, (place_id, open_day, open_time, close_time))

        self.db.commit()

    def get_open_now(self):
        now = datetime.now()
        google_day = (now.weekday() + 1) % 7
        current_time = now.strftime("%H%M")

        self.db.cursor.execute("""
            SELECT p.place_id, p.name
            FROM places p
            INNER JOIN place_hours ph ON p.place_id = ph.place_id
            WHERE ph.day_of_week = ?
        """, (google_day,))

        rows = self.db.cursor.fetchall()
        abertos = []

        for place_id, name in rows:
            self.db.cursor.execute("""
                SELECT open_time, close_time
                FROM place_hours
                WHERE place_id = ? AND day_of_week = ?
            """, (place_id, google_day))

            horario = self.db.cursor.fetchone()
            if not horario:
                continue

            open_time, close_time = horario

            if close_time < open_time:
                if current_time >= open_time or current_time <= close_time:
                    abertos.append((place_id, name))
            else:
                if open_time <= current_time <= close_time:
                    abertos.append((place_id, name))

        return abertos
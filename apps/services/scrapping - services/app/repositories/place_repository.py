# repositories/place_repository.py
from models.place import Place

class PlaceRepository:
    def __init__(self, db):
        self.db = db

    def save(self, place):
        self.db.cursor.execute("""
            IF NOT EXISTS (SELECT 1 FROM places WHERE place_id = ?)
                INSERT INTO places (name, place_id, lat, lng, rating, address, city, state)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ELSE
                UPDATE places SET
                    name = ?,
                    lat = ?,
                    lng = ?,
                    rating = ?,
                    address = ?,
                    city = ?,
                    state = ?,
                    updated_at = GETDATE()
                WHERE place_id = ?
        """, (
            place.place_id,
            place.name, place.place_id, place.lat, place.lng, place.rating, place.address, place.city, place.state,
            place.name, place.lat, place.lng, place.rating, place.address, place.city, place.state, place.place_id
        ))
        self.db.commit()

    def get_all(self):
        self.db.cursor.execute("SELECT place_id, name FROM places")
        return self.db.cursor.fetchall()
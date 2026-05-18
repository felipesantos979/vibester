from models.place import Place

class PlaceRepository:
    def __init__(self, db):
        self.db = db

    def save(self, place):
        self.db.cursor.execute("""
            INSERT INTO places (name, place_id, lat, lng, rating, address, city, state)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (place_id) DO UPDATE SET
                name = EXCLUDED.name,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng,
                rating = EXCLUDED.rating,
                address = EXCLUDED.address,
                city = EXCLUDED.city,
                state = EXCLUDED.state,
                updated_at = NOW()
        """, (
            place.name, place.place_id, place.lat, place.lng,
            place.rating, place.address, place.city, place.state
        ))
        self.db.commit()

    def get_all(self):
        self.db.cursor.execute("SELECT place_id, name FROM places")
        return self.db.cursor.fetchall()

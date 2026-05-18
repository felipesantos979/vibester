class CurrentPopularityRepository:
    def __init__(self, db):
        self.db = db

    def save(self, place_id, busyness_score, status_text, time_spent, is_estimated=False):
        self.db.cursor.execute("""
            INSERT INTO current_popularity
                (place_id, busyness_score, status_text, time_spent, is_estimated)
            VALUES (%s, %s, %s, %s, %s)
        """, (place_id, busyness_score, status_text, time_spent, is_estimated))
        self.db.commit()

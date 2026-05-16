# models/place.py
class Place:
    def __init__(self, name, place_id, lat=None, lng=None, rating=None, address=None, city=None, state=None):
        self.name = name
        self.place_id = place_id
        self.lat = lat
        self.lng = lng
        self.rating = rating
        self.address = address
        self.city = city
        self.state = state
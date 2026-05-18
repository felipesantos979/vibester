import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5434"),
            dbname=os.getenv("DB_NAME", "scrappingdb"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD")
        )
        self.conn.autocommit = False
        self.cursor = self.conn.cursor()
        self.create_tables()

    def create_tables(self):
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS places (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            place_id VARCHAR(255) UNIQUE NOT NULL,
            lat FLOAT,
            lng FLOAT,
            rating FLOAT,
            status VARCHAR(50) DEFAULT 'unknown',
            address VARCHAR(500),
            city VARCHAR(100),
            state VARCHAR(100),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        """)

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS place_hours (
            id SERIAL PRIMARY KEY,
            place_id VARCHAR(255) NOT NULL,
            day_of_week INT NOT NULL,
            open_time VARCHAR(10) NOT NULL,
            close_time VARCHAR(10) NOT NULL,
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        )
        """)

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS popular_times (
            id SERIAL PRIMARY KEY,
            place_id VARCHAR(255) NOT NULL,
            day_of_week INT NOT NULL,
            hour INT NOT NULL,
            busyness_score INT NOT NULL,
            status_text VARCHAR(255),
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        )
        """)

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS popular_times_daily (
            id SERIAL PRIMARY KEY,
            place_id VARCHAR(255) NOT NULL,
            captured_date DATE NOT NULL,
            day_of_week INT NOT NULL,
            hour INT NOT NULL,
            busyness_score INT NOT NULL,
            is_current BOOLEAN DEFAULT FALSE,
            status_text VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        )
        """)

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS current_popularity (
            id SERIAL PRIMARY KEY,
            place_id VARCHAR(255) NOT NULL,
            busyness_score INT,
            status_text VARCHAR(255),
            time_spent VARCHAR(255),
            is_estimated BOOLEAN DEFAULT FALSE,
            captured_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        )
        """)

        self.conn.commit()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.conn.close()

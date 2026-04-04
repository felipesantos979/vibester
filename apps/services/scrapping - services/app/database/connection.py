import pyodbc
from dotenv import load_dotenv
import os

load_dotenv()

class Database:
    def __init__(self):
        server = os.getenv("DB_SERVER", "localhost")
        database = os.getenv("DB_NAME", "automacaodb")
        self.conn = pyodbc.connect(
            f'DRIVER={{ODBC Driver 17 for SQL Server}};'
            f'SERVER={server};DATABASE={database};Trusted_Connection=yes;'
        )
        self.cursor = self.conn.cursor()
        self.create_tables()

    def create_tables(self):
        self.cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='places' AND xtype='U')
        CREATE TABLE places (
            id INT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(255) NOT NULL,
            place_id NVARCHAR(255) UNIQUE NOT NULL,
            lat FLOAT,
            lng FLOAT,
            rating FLOAT,
            status NVARCHAR(50) DEFAULT 'unknown',
            address NVARCHAR(500),
            city NVARCHAR(100),
            state NVARCHAR(100),
            created_at DATETIME DEFAULT GETDATE(),
            updated_at DATETIME DEFAULT GETDATE()
        )
        """)

        self.cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='place_hours' AND xtype='U')
        CREATE TABLE place_hours (
            id INT IDENTITY(1,1) PRIMARY KEY,
            place_id NVARCHAR(255) NOT NULL,
            day_of_week INT NOT NULL,
            open_time NVARCHAR(10) NOT NULL,
            close_time NVARCHAR(10) NOT NULL,
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        )
        """)

        self.cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='popular_times' AND xtype='U')
        CREATE TABLE popular_times (
            id INT IDENTITY(1,1) PRIMARY KEY,
            place_id NVARCHAR(255) NOT NULL,
            day_of_week INT NOT NULL,
            hour INT NOT NULL,
            busyness_score INT NOT NULL,
            status_text NVARCHAR(255),
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        )
        """)

        self.cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='popular_times_daily' AND xtype='U')
        CREATE TABLE popular_times_daily (
            id INT IDENTITY(1,1) PRIMARY KEY,
            place_id NVARCHAR(255) NOT NULL,
            captured_date DATE NOT NULL,
            day_of_week INT NOT NULL,
            hour INT NOT NULL,
            busyness_score INT NOT NULL,
            is_current BIT DEFAULT 0,
            status_text NVARCHAR(255),
            created_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        )
        """)

        self.cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='current_popularity' AND xtype='U')
        CREATE TABLE current_popularity (
            id INT IDENTITY(1,1) PRIMARY KEY,
            place_id NVARCHAR(255) NOT NULL,
            busyness_score INT,
            status_text NVARCHAR(255),
            time_spent NVARCHAR(255),
            is_estimated BIT DEFAULT 0,
            captured_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (place_id) REFERENCES places(place_id)
        )
        """)

        self.conn.commit()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.conn.close()
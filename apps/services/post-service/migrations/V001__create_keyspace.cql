CREATE KEYSPACE IF NOT EXISTS vibester_posts
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};
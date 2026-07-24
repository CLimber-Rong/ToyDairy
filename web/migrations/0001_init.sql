-- Toy Dairy D1 schema stub (plan.md contract)
-- Apply later: wrangler d1 execute toydairy-db --remote --file=./migrations/0001_init.sql

CREATE TABLE IF NOT EXISTS toys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  role TEXT NOT NULL,
  traits TEXT NOT NULL, -- JSON array
  zodiac TEXT,
  bio TEXT,
  monologue TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  toy_id TEXT NOT NULL REFERENCES toys(id),
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  title TEXT,
  user_note TEXT,
  mood TEXT,
  image_url TEXT,
  ai_diary TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_entries_toy_date ON entries(toy_id, date DESC);

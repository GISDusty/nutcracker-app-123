-- Database Migration for Nutcracker App 123 Leaderboard
-- Run this SQL in your Vercel Postgres database

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  initials VARCHAR(3) NOT NULL,
  age INTEGER,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster score lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC, created_at ASC);

-- Insert some sample data for testing (optional)
INSERT INTO leaderboard (initials, score, age) VALUES
  ('AAA', 50, 5),
  ('BBB', 48, 7),
  ('CCC', 45, 9),
  ('DDD', 42, 12),
  ('EEE', 40, 4),
  ('FFF', 35, 6),
  ('GGG', 30, 8),
  ('HHH', 25, 11),
  ('III', 20, 5),
  ('JJJ', 15, 7)
ON CONFLICT DO NOTHING;

-- Database Migration for Nutcracker App 123 Leaderboard
-- Run this SQL in your Vercel Postgres database

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  initials VARCHAR(3) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster score lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC, created_at ASC);

-- Insert some sample data for testing (optional)
INSERT INTO leaderboard (initials, score) VALUES
  ('AAA', 50),
  ('BBB', 48),
  ('CCC', 45),
  ('DDD', 42),
  ('EEE', 40),
  ('FFF', 35),
  ('GGG', 30),
  ('HHH', 25),
  ('III', 20),
  ('JJJ', 15)
ON CONFLICT DO NOTHING;

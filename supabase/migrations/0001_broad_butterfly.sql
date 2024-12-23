/*
  # Create Voting System Tables

  1. New Tables
    - `voting_sessions`
      - `id` (uuid, primary key)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    - `voting_options`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `name` (text)
      - `votes` (integer)
    - `votes`
      - `id` (uuid, primary key)
      - `option_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for reading and writing data
*/

-- Create tables
CREATE TABLE voting_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE voting_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES voting_sessions(id) ON DELETE CASCADE,
  name text NOT NULL,
  votes integer DEFAULT 0
);

CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id uuid REFERENCES voting_options(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(option_id, user_id)
);

-- Enable RLS
ALTER TABLE voting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read voting sessions"
  ON voting_sessions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read voting options"
  ON voting_options
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM voting_options vo
      JOIN voting_sessions vs ON vo.session_id = vs.id
      WHERE vo.id = option_id
      AND vs.is_active = true
    )
  );

-- Function to update vote count
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE voting_options
    SET votes = votes + 1
    WHERE id = NEW.option_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vote count
CREATE TRIGGER update_vote_count_trigger
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION update_vote_count();
/*
  # Voting System Schema

  1. Tables
    - voting_state: Stores the current state of the voting system
      - id: Primary key (always 1)
      - options: Array of voting options
      - votes: Array of vote counts
      - voting_enabled: Whether voting is currently enabled
      - created_at: Timestamp of creation
      - updated_at: Timestamp of last update

  2. Security
    - Enable RLS
    - Public read access
    - Authenticated users can update
*/

CREATE TABLE IF NOT EXISTS voting_state (
  id bigint PRIMARY KEY DEFAULT 1,
  options text[] NOT NULL DEFAULT ARRAY[]::text[],
  votes integer[] NOT NULL DEFAULT ARRAY[]::integer[],
  voting_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_voting_state_updated_at
  BEFORE UPDATE ON voting_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Initial record
INSERT INTO voting_state (id, options, votes)
VALUES (1, ARRAY['', '', '']::text[], ARRAY[0, 0, 0]::integer[])
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE voting_state ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users"
  ON voting_state FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable update for authenticated users only"
  ON voting_state FOR UPDATE
  TO authenticated
  USING (id = 1)
  WITH CHECK (id = 1);
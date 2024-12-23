/*
  # Create voting state table

  1. New Tables
    - `voting_state`
      - `id` (primary key)
      - `options` (text array)
      - `votes` (integer array)
      - `votingEnabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated updates
*/

CREATE TABLE IF NOT EXISTS voting_state (
  id bigint PRIMARY KEY DEFAULT 1,
  options text[] NOT NULL DEFAULT ARRAY[]::text[],
  votes integer[] NOT NULL DEFAULT ARRAY[]::integer[],
  votingEnabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger para actualizar updated_at
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

-- Insertar registro inicial
INSERT INTO voting_state (id, options, votes)
VALUES (1, ARRAY['', '', '']::text[], ARRAY[0, 0, 0]::integer[])
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS
ALTER TABLE voting_state ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Allow public read access"
  ON voting_state
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated updates"
  ON voting_state
  FOR UPDATE
  TO authenticated
  USING (id = 1)
  WITH CHECK (id = 1);
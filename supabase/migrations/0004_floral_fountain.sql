/*
  # Initial Schema Setup

  1. New Tables
    - `questions`: Stores voting questions with options and vote counts
    - `votes`: Records individual votes with user tracking

  2. Security
    - Enable RLS on both tables
    - Set up read/write policies with proper checks
*/

-- Questions table
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  options text[] NOT NULL,
  votes integer[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Votes tracking table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  question_id uuid REFERENCES questions(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for questions table
CREATE POLICY "Public read access for questions"
  ON questions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin insert access for questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'admin');

-- Policies for votes table
CREATE POLICY "Users can read their own votes"
  ON votes
  FOR SELECT
  TO public
  USING (auth.uid()::text = user_id);

CREATE POLICY "Public insert access for votes"
  ON votes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add index for vote queries
CREATE INDEX votes_user_id_idx ON votes(user_id);
CREATE INDEX votes_question_id_idx ON votes(question_id);
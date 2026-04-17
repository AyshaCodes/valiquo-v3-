
/*
  # Create scans table for Valiquo

  ## Summary
  Creates the core table to persist idea validation scan results for authenticated users.

  ## New Tables

  ### scans
  Stores each scan submitted by a user, including the problem description, location, sector, AI-generated score, and full result JSON.

  - `id` (uuid, primary key) — unique scan identifier
  - `user_id` (uuid, FK → auth.users) — owner of the scan
  - `problem` (text) — the problem description entered by the user
  - `ville` (text) — city or region selected
  - `secteur` (text) — optional sector category
  - `score` (integer) — validation score from 0 to 100
  - `result` (jsonb) — full structured report (SWOT, plan, badges, etc.)
  - `created_at` (timestamptz) — timestamp of the scan

  ## Security
  - RLS enabled: users can only access their own scans
  - Separate policies for SELECT, INSERT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem text NOT NULL,
  ville text NOT NULL DEFAULT 'National',
  secteur text NOT NULL DEFAULT '',
  score integer NOT NULL DEFAULT 0,
  result jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans"
  ON scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
  ON scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scans"
  ON scans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans"
  ON scans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS scans_user_id_idx ON scans(user_id);
CREATE INDEX IF NOT EXISTS scans_created_at_idx ON scans(created_at DESC);

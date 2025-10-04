/*
  # API Credentials Storage

  1. New Tables
    - `api_credentials`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform` (text) - The API platform name (spotify, apple_music, youtube, etc.)
      - `credentials` (jsonb) - Encrypted API credentials stored as JSON
      - `is_active` (boolean) - Whether the connection is active
      - `last_tested` (timestamptz) - Last time credentials were verified
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `api_credentials` table
    - Add policy for admin users to manage credentials
    - Add policy for users to view their own credentials

  3. Important Notes
    - Credentials are stored encrypted in the database
    - Only admin users can create/update/delete credentials
    - Users can only view credentials they own
*/

CREATE TABLE IF NOT EXISTS api_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  credentials jsonb NOT NULL,
  is_active boolean DEFAULT true,
  last_tested timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform)
);

ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can manage all API credentials"
  ON api_credentials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own API credentials"
  ON api_credentials
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_api_credentials_user_id ON api_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_api_credentials_platform ON api_credentials(platform);
CREATE INDEX IF NOT EXISTS idx_api_credentials_is_active ON api_credentials(is_active);

/*
  # Artist Tier and Revenue Sharing System
  
  ## Overview
  Adds artist subscription tier where artists pay $20/month to have their content
  featured in genre newsletters. Artists can offer their own free or $10/month 
  subscriptions and keep 80% of revenue.
  
  ## New Tables
  
  ### `artist_profiles`
  Extended profiles for artists
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `artist_name` (text)
  - `bio` (text)
  - `genre` (text)
  - `spotify_url` (text)
  - `instagram_url` (text)
  - `website_url` (text)
  - `profile_image_url` (text)
  - `is_verified` (boolean)
  - `subscription_price` (numeric) - 0 for free, 10 for paid
  - `created_at` (timestamptz)
  
  ### `artist_content`
  Content submissions from artists
  - `id` (uuid, primary key)
  - `artist_id` (uuid, foreign key to artist_profiles)
  - `title` (text)
  - `content` (text)
  - `content_type` (text) - 'track_release', 'show_announcement', 'behind_the_scenes', 'exclusive'
  - `media_urls` (jsonb) - Array of media URLs
  - `target_newsletters` (jsonb) - Array of newsletter slugs
  - `status` (text) - 'pending', 'approved', 'published', 'rejected'
  - `scheduled_for` (timestamptz)
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ### `artist_subscribers`
  Fans subscribed to individual artists
  - `id` (uuid, primary key)
  - `artist_id` (uuid, foreign key to artist_profiles)
  - `subscriber_email` (text)
  - `subscription_tier` (text) - 'free' or 'paid'
  - `status` (text) - 'active', 'cancelled', 'expired'
  - `started_at` (timestamptz)
  - `expires_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ### `artist_revenue`
  Revenue tracking for artist subscriptions
  - `id` (uuid, primary key)
  - `artist_id` (uuid, foreign key to artist_profiles)
  - `subscriber_id` (uuid, foreign key to artist_subscribers)
  - `amount` (numeric) - Full amount
  - `artist_share` (numeric) - 80% goes to artist
  - `platform_share` (numeric) - 20% platform fee
  - `period_start` (timestamptz)
  - `period_end` (timestamptz)
  - `status` (text) - 'pending', 'paid', 'failed'
  - `paid_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ## Updates to Existing Tables
  - Add 'artist' role to user_profiles
  - Add 'Artist Platform' subscription plan at $20/month
  
  ## Security
  - Enable RLS on all tables
  - Artists can manage their own profile and content
  - Artists can view their own subscribers and revenue
  - Admin can manage all artist content
  
  ## Important Notes
  1. Artists pay $20/month for platform access
  2. Artists can charge fans $0 (free) or $10/month
  3. Platform keeps 20%, artist keeps 80% of fan subscriptions
  4. Artist content must be approved before publishing to newsletters
*/

-- Create artist_profiles table
CREATE TABLE IF NOT EXISTS artist_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  artist_name text NOT NULL,
  bio text,
  genre text NOT NULL,
  spotify_url text,
  instagram_url text,
  website_url text,
  profile_image_url text,
  is_verified boolean DEFAULT false,
  subscription_price numeric(10,2) DEFAULT 0 CHECK (subscription_price IN (0, 10)),
  created_at timestamptz DEFAULT now()
);

-- Create artist_content table
CREATE TABLE IF NOT EXISTS artist_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES artist_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('track_release', 'show_announcement', 'behind_the_scenes', 'exclusive')),
  media_urls jsonb DEFAULT '[]'::jsonb,
  target_newsletters jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'published', 'rejected')),
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create artist_subscribers table
CREATE TABLE IF NOT EXISTS artist_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES artist_profiles(id) ON DELETE CASCADE,
  subscriber_email text NOT NULL,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'paid')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(artist_id, subscriber_email)
);

-- Create artist_revenue table
CREATE TABLE IF NOT EXISTS artist_revenue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES artist_profiles(id) ON DELETE CASCADE,
  subscriber_id uuid REFERENCES artist_subscribers(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL DEFAULT 10.00,
  artist_share numeric(10,2) NOT NULL DEFAULT 8.00,
  platform_share numeric(10,2) NOT NULL DEFAULT 2.00,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Update user_profiles role enum to include 'artist'
DO $$
BEGIN
  ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
  ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check 
    CHECK (role IN ('subscriber', 'premium', 'enterprise', 'artist', 'admin'));
END $$;

-- Add Artist Platform subscription plan
INSERT INTO subscription_plans (name, slug, price_monthly, features) VALUES
  ('Artist Platform', 'artist', 20.00, '["Submit content to newsletters", "Appear in genre newsletters", "Build your fanbase", "Offer free or $10/month subscriptions", "Keep 80% of fan subscription revenue", "Direct fan communication", "Analytics dashboard", "Verified artist badge"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  features = EXCLUDED.features;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_artist_profiles_genre ON artist_profiles(genre);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user ON artist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_content_artist ON artist_content(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_content_status ON artist_content(status);
CREATE INDEX IF NOT EXISTS idx_artist_subscribers_artist ON artist_subscribers(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_subscribers_email ON artist_subscribers(subscriber_email);
CREATE INDEX IF NOT EXISTS idx_artist_revenue_artist ON artist_revenue(artist_id);

-- Enable Row Level Security
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_revenue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artist_profiles
CREATE POLICY "Anyone can view verified artist profiles"
  ON artist_profiles FOR SELECT
  TO public
  USING (is_verified = true);

CREATE POLICY "Users can view their own artist profile"
  ON artist_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own artist profile"
  ON artist_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own artist profile"
  ON artist_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all artist profiles"
  ON artist_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for artist_content
CREATE POLICY "Anyone can view approved content"
  ON artist_content FOR SELECT
  TO public
  USING (status IN ('approved', 'published'));

CREATE POLICY "Artists can view their own content"
  ON artist_content FOR SELECT
  TO authenticated
  USING (
    artist_id IN (
      SELECT id FROM artist_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can create their own content"
  ON artist_content FOR INSERT
  TO authenticated
  WITH CHECK (
    artist_id IN (
      SELECT id FROM artist_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can update their pending content"
  ON artist_content FOR UPDATE
  TO authenticated
  USING (
    artist_id IN (
      SELECT id FROM artist_profiles WHERE user_id = auth.uid()
    ) AND status = 'pending'
  );

CREATE POLICY "Admins can manage all artist content"
  ON artist_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for artist_subscribers
CREATE POLICY "Artists can view their own subscribers"
  ON artist_subscribers FOR SELECT
  TO authenticated
  USING (
    artist_id IN (
      SELECT id FROM artist_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can subscribe to artists"
  ON artist_subscribers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can manage all subscribers"
  ON artist_subscribers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for artist_revenue
CREATE POLICY "Artists can view their own revenue"
  ON artist_revenue FOR SELECT
  TO authenticated
  USING (
    artist_id IN (
      SELECT id FROM artist_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all revenue"
  ON artist_revenue FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

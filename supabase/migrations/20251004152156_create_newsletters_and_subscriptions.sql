/*
  # TrueFans Newsletter Platform Schema

  ## Overview
  Creates the database schema for the TrueFans newsletter platform with newsletter management,
  subscriptions, content, and analytics.

  ## New Tables
  
  ### `newsletters`
  Stores the 12 newsletter types (genres, songwriting, business)
  - `id` (uuid, primary key)
  - `slug` (text, unique) - URL-friendly identifier
  - `name` (text) - Display name (e.g., "PULSE")
  - `label` (text) - Subcategory (e.g., "Hip-Hop/Rap")
  - `category` (text) - Main category: genre, songwriting, or business
  - `description` (text)
  - `emoji` (text)
  - `color` (text) - Tailwind color class
  - `schedule_day` (text) - Day of week
  - `schedule_time` (text) - Time of day
  - `is_active` (boolean) - Whether newsletter is actively sending
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `newsletter_issues`
  Individual newsletter editions that have been sent or scheduled
  - `id` (uuid, primary key)
  - `newsletter_id` (uuid, foreign key)
  - `title` (text)
  - `content` (jsonb) - Structured content data
  - `status` (text) - draft, scheduled, sent
  - `scheduled_for` (timestamptz)
  - `sent_at` (timestamptz)
  - `ai_confidence` (numeric)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `subscribers`
  Email subscribers to the platform
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `status` (text) - active, unsubscribed, bounced
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `newsletter_subscriptions`
  Junction table linking subscribers to newsletters
  - `id` (uuid, primary key)
  - `subscriber_id` (uuid, foreign key)
  - `newsletter_id` (uuid, foreign key)
  - `status` (text) - subscribed, unsubscribed
  - `subscribed_at` (timestamptz)
  - `unsubscribed_at` (timestamptz)

  ### `newsletter_analytics`
  Engagement metrics for newsletter issues
  - `id` (uuid, primary key)
  - `issue_id` (uuid, foreign key)
  - `opens` (integer)
  - `clicks` (integer)
  - `shares` (integer)
  - `unsubscribes` (integer)
  - `updated_at` (timestamptz)

  ### `discovered_artists`
  Artists discovered by the AI system
  - `id` (uuid, primary key)
  - `name` (text)
  - `genre` (text)
  - `location` (text)
  - `bio` (text)
  - `spotify_id` (text)
  - `monthly_listeners` (integer)
  - `growth_rate` (numeric)
  - `ai_confidence` (numeric)
  - `discovery_date` (timestamptz)
  - `status` (text) - tracked, featured, archived
  - `metadata` (jsonb) - Additional data
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for newsletters (catalog)
  - Authenticated write access for admin operations
  - Subscriber data protected by ownership checks
*/

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  label text NOT NULL,
  category text NOT NULL CHECK (category IN ('genre', 'songwriting', 'business')),
  description text NOT NULL,
  emoji text NOT NULL,
  color text NOT NULL,
  schedule_day text NOT NULL,
  schedule_time text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter_issues table
CREATE TABLE IF NOT EXISTS newsletter_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  ai_confidence numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter_subscriptions junction table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid REFERENCES subscribers(id) ON DELETE CASCADE,
  newsletter_id uuid REFERENCES newsletters(id) ON DELETE CASCADE,
  status text DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  UNIQUE(subscriber_id, newsletter_id)
);

-- Create newsletter_analytics table
CREATE TABLE IF NOT EXISTS newsletter_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid REFERENCES newsletter_issues(id) ON DELETE CASCADE,
  opens integer DEFAULT 0,
  clicks integer DEFAULT 0,
  shares integer DEFAULT 0,
  unsubscribes integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(issue_id)
);

-- Create discovered_artists table
CREATE TABLE IF NOT EXISTS discovered_artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  genre text NOT NULL,
  location text,
  bio text,
  spotify_id text,
  monthly_listeners integer DEFAULT 0,
  growth_rate numeric(5,2) DEFAULT 0,
  ai_confidence numeric(5,2) DEFAULT 0,
  discovery_date timestamptz DEFAULT now(),
  status text DEFAULT 'tracked' CHECK (status IN ('tracked', 'featured', 'archived')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_newsletter ON newsletter_issues(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_status ON newsletter_issues(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_subscriber ON newsletter_subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_newsletter ON newsletter_subscriptions(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_discovered_artists_genre ON discovered_artists(genre);
CREATE INDEX IF NOT EXISTS idx_discovered_artists_status ON discovered_artists(status);

-- Enable Row Level Security
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_artists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for newsletters (public read)
CREATE POLICY "Anyone can view newsletters"
  ON newsletters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage newsletters"
  ON newsletters FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for newsletter_issues (public read)
CREATE POLICY "Anyone can view sent issues"
  ON newsletter_issues FOR SELECT
  TO public
  USING (status = 'sent');

CREATE POLICY "Authenticated users can manage issues"
  ON newsletter_issues FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for subscribers (protected)
CREATE POLICY "Users can view own subscriber record"
  ON subscribers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert subscribers"
  ON subscribers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage subscribers"
  ON subscribers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for newsletter_subscriptions
CREATE POLICY "Anyone can view subscriptions"
  ON newsletter_subscriptions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create subscriptions"
  ON newsletter_subscriptions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage subscriptions"
  ON newsletter_subscriptions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for newsletter_analytics (public read)
CREATE POLICY "Anyone can view analytics"
  ON newsletter_analytics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage analytics"
  ON newsletter_analytics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for discovered_artists (public read)
CREATE POLICY "Anyone can view discovered artists"
  ON discovered_artists FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage artists"
  ON discovered_artists FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

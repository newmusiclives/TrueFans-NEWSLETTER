/*
  # Authentication and Subscription Tiers System
  
  ## Overview
  Adds user profiles, subscription plans, and user subscription tracking to enable
  two-tier access: Free (subscribers only) and Premium/Enterprise (platform access).
  
  ## New Tables
  
  ### `user_profiles`
  Extended user information linked to Supabase auth.users
  - `id` (uuid, primary key) - matches auth.uid()
  - `email` (text)
  - `full_name` (text)
  - `role` (text) - 'subscriber', 'premium', 'enterprise', 'admin'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `subscription_plans`
  Available subscription tiers
  - `id` (uuid, primary key)
  - `name` (text) - 'Free', 'Premium', 'Enterprise'
  - `slug` (text, unique) - 'free', 'premium', 'enterprise'
  - `price_monthly` (numeric) - 0, 20.00, 200.00
  - `features` (jsonb) - List of features
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  
  ### `user_subscriptions`
  Tracks user subscription status
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `plan_id` (uuid, foreign key to subscription_plans)
  - `status` (text) - 'active', 'cancelled', 'expired'
  - `started_at` (timestamptz)
  - `expires_at` (timestamptz)
  - `cancelled_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Users can read their own profile
  - Users can update their own profile
  - Anyone can read subscription plans
  - Users can only read their own subscriptions
  - Admin can manage all records
  
  ## Important Notes
  1. Free tier users are just newsletter subscribers (email-only)
  2. Premium/Enterprise users get authenticated platform access
  3. Default role is 'subscriber' for new signups
  4. Admins have full access to all features
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'premium', 'enterprise', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price_monthly numeric(10,2) NOT NULL DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, plan_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Insert subscription plans
INSERT INTO subscription_plans (name, slug, price_monthly, features) VALUES
  ('Free', 'free', 0.00, '["Subscribe to newsletters", "Email delivery", "Newsletter archive access", "Basic profile"]'::jsonb),
  ('Premium', 'premium', 20.00, '["All Free features", "Full dashboard access", "Advanced analytics with export", "48hr early artist access", "API access", "Custom digest scheduling", "Priority support", "Remove branding", "Advanced filtering"]'::jsonb),
  ('Enterprise', 'enterprise', 200.00, '["All Premium features", "White-label newsletters", "Custom AI training", "Dedicated account manager", "Bulk artist alerts", "Industry tool integrations", "Advanced reporting", "5 user seats included"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON user_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Anyone can view active plans"
  ON subscription_plans FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage plans"
  ON subscription_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON user_subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'subscriber'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

/*
  # Fix RLS Policies to Avoid Circular Dependencies

  1. Changes
    - Remove circular policy dependencies that cause "Database error querying schema"
    - Simplify admin policies to avoid recursion during authentication
    - Use raw_app_meta_data for admin checks instead of user_profiles lookup
    
  2. Security
    - Maintains same security level
    - Fixes authentication issues
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage plans" ON subscription_plans;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON user_subscriptions;

-- Recreate admin policies without circular dependencies
-- Use raw_app_meta_data instead of querying user_profiles
CREATE POLICY "Admins can manage all profiles"
  ON user_profiles FOR ALL
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'admin' 
    OR auth.uid() = id
  );

CREATE POLICY "Admins can manage plans"
  ON subscription_plans FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admins can manage all subscriptions"
  ON user_subscriptions FOR ALL
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'admin' 
    OR auth.uid() = user_id
  );

-- Update the handle_new_user function to set admin role in app_metadata if needed
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_app_meta_data->>'role')::text, 'subscriber')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update demo user to have role in app_metadata
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'demo@truefans.com';

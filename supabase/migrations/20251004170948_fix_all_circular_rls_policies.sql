/*
  # Fix All Circular RLS Policy Dependencies

  1. Problem
    - Multiple RLS policies query user_profiles during authentication
    - This creates circular dependencies causing "Database error querying schema"
    
  2. Solution
    - Replace all user_profiles lookups with auth.jwt()->>'role' checks
    - This uses the JWT token data instead of querying the database
    
  3. Tables Fixed
    - artist_profiles
    - artist_content
    - artist_subscribers
    - artist_revenue
*/

-- Drop all problematic admin policies
DROP POLICY IF EXISTS "Admins can manage all artist profiles" ON artist_profiles;
DROP POLICY IF EXISTS "Admins can manage all artist content" ON artist_content;
DROP POLICY IF EXISTS "Admins can manage all subscribers" ON artist_subscribers;
DROP POLICY IF EXISTS "Admins can manage all revenue" ON artist_revenue;

-- Recreate admin policies without circular dependencies
CREATE POLICY "Admins can manage all artist profiles"
  ON artist_profiles FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admins can manage all artist content"
  ON artist_content FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admins can manage all subscribers"
  ON artist_subscribers FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admins can manage all revenue"
  ON artist_revenue FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

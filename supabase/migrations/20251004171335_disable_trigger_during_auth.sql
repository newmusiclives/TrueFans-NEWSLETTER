/*
  # Disable Trigger During Authentication

  1. Problem
    - The trigger that inserts into user_profiles may be causing issues during login
    - Even with SECURITY DEFINER, RLS might be interfering
    
  2. Solution
    - Temporarily disable the trigger to test if this is the issue
    - We'll create profiles manually for now
*/

-- Disable the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

/*
  # Create Demo User Setup Function

  1. New Functions
    - `create_demo_user`: Creates a demo user account with admin privileges
    
  2. Purpose
    - Provides a secure way to create demo accounts
    - Automatically creates user profile with admin role
    
  3. Usage
    - Call this function to create/reset the demo account
*/

CREATE OR REPLACE FUNCTION create_demo_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  demo_user_id uuid;
BEGIN
  -- Delete existing demo user if exists
  DELETE FROM auth.users WHERE email = 'demo@truefans.com';
  
  -- Insert new demo user (password is 'demo123')
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'demo@truefans.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Demo User"}'::jsonb,
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO demo_user_id;
  
  -- Create user profile with admin role
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (demo_user_id, 'demo@truefans.com', 'Demo User', 'admin')
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin', full_name = 'Demo User';
  
  -- Create identity record
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    provider,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    demo_user_id,
    demo_user_id::text,
    'email',
    jsonb_build_object('sub', demo_user_id::text, 'email', 'demo@truefans.com'),
    now(),
    now(),
    now()
  );
  
END;
$$;

-- Execute the function to create the demo user
SELECT create_demo_user();

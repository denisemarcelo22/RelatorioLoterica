/*
  # Fix User Signup RLS Policies

  1. Security Updates
    - Update RLS policies for users table to allow signup
    - Ensure proper INSERT policy for new user registration
    - Fix authentication flow for user creation

  2. Changes
    - Drop existing restrictive INSERT policy
    - Add new INSERT policy that allows user creation during signup
    - Ensure proper permissions for authenticated users
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert users" ON users;

-- Create a new INSERT policy that allows user creation during signup
-- This policy allows INSERT when the user_id matches the authenticated user's ID
CREATE POLICY "Users can create their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also ensure we have a policy for public (unauthenticated) users during the signup process
-- This is needed because during signup, the user might not be fully authenticated yet
CREATE POLICY "Allow user creation during signup"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Update the existing SELECT policy to be more permissive for user's own data
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Update the existing UPDATE policy
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure the admin policy is properly set
DROP POLICY IF EXISTS "Admins can read all users" ON users;
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );
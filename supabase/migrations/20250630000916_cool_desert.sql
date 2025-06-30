/*
  # Fix RLS policies for user registration

  1. Security Updates
    - Update RLS policies to properly handle user registration
    - Ensure authenticated users can create their own profiles
    - Fix policy conflicts during signup process

  2. Changes
    - Drop conflicting policies
    - Create new policies that properly handle the signup flow
    - Ensure both public and authenticated contexts work correctly
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Permitir inserção pública durante signup" ON tb_usuario;
DROP POLICY IF EXISTS "Permitir inserção durante signup" ON tb_usuario;

-- Create a comprehensive INSERT policy that handles both signup scenarios
CREATE POLICY "Allow user profile creation during signup"
  ON tb_usuario
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Update the authenticated user INSERT policy to be more permissive during signup
CREATE POLICY "Authenticated users can create profiles"
  ON tb_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid()) OR 
    is_admin(auth.uid()) OR
    auth.uid() IS NULL  -- Allow during signup process
  );

-- Ensure the SELECT policy allows users to see their own profile
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON tb_usuario;
CREATE POLICY "Users can view own profile"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (
    (user_id = auth.uid()) OR 
    is_admin(auth.uid())
  );

-- Update the UPDATE policy to be more specific
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON tb_usuario;
CREATE POLICY "Users can update own profile"
  ON tb_usuario
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Update the DELETE policy
DROP POLICY IF EXISTS "Usuários podem deletar seu próprio perfil" ON tb_usuario;
CREATE POLICY "Users can delete own profile"
  ON tb_usuario
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Keep the admin policies as they are
-- Admin policies should remain unchanged as they're working correctly
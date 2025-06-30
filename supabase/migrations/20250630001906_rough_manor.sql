/*
  # Fix RLS policies for user registration

  1. Table Creation
    - Ensure tb_usuario table exists with proper structure
    - Create necessary functions and types if they don't exist

  2. Security Policies
    - Fix RLS policies to allow proper user registration
    - Update policies to handle both public and authenticated signup flows
    - Maintain admin access controls

  3. Important Notes
    - This migration ensures the table exists before modifying policies
    - Policies are designed to work with the signup flow without conflicts
*/

-- Create user type enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('admin', 'operador');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create helper functions if they don't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tb_usuario 
    WHERE user_id = user_uuid 
    AND tipo_usuario = 'admin' 
    AND ativo = true
  );
EXCEPTION
  WHEN undefined_table THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_is_active(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tb_usuario 
    WHERE user_id = user_uuid 
    AND ativo = true
  );
EXCEPTION
  WHEN undefined_table THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create tb_usuario table if it doesn't exist
CREATE TABLE IF NOT EXISTS tb_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  nome text NOT NULL,
  email text NOT NULL,
  cpf text,
  telefone text,
  cod_operador text UNIQUE NOT NULL,
  tipo_usuario user_type DEFAULT 'operador'::user_type,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tb_usuario_user_id_fkey'
    AND table_name = 'tb_usuario'
  ) THEN
    ALTER TABLE tb_usuario 
    ADD CONSTRAINT tb_usuario_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_tb_usuario_user_id ON tb_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_tb_usuario_user_id_active ON tb_usuario(user_id) WHERE ativo = true;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_tb_usuario_updated_at ON tb_usuario;
CREATE TRIGGER update_tb_usuario_updated_at
  BEFORE UPDATE ON tb_usuario
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE tb_usuario ENABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Permitir inserção pública durante signup" ON tb_usuario;
DROP POLICY IF EXISTS "Permitir inserção durante signup" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem deletar seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os usuários" ON tb_usuario;
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON tb_usuario;

-- Create comprehensive INSERT policy that handles signup scenarios
CREATE POLICY "Allow user profile creation during signup"
  ON tb_usuario
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create authenticated user INSERT policy
CREATE POLICY "Authenticated users can create profiles"
  ON tb_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (user_id = auth.uid()) OR 
    (EXISTS (
      SELECT 1 FROM tb_usuario 
      WHERE user_id = auth.uid() 
      AND tipo_usuario = 'admin' 
      AND ativo = true
    ))
  );

-- Create SELECT policy for users to see their own profile
CREATE POLICY "Users can view own profile"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (
    (user_id = auth.uid()) OR 
    (EXISTS (
      SELECT 1 FROM tb_usuario 
      WHERE user_id = auth.uid() 
      AND tipo_usuario = 'admin' 
      AND ativo = true
    ))
  );

-- Create UPDATE policy
CREATE POLICY "Users can update own profile"
  ON tb_usuario
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create DELETE policy
CREATE POLICY "Users can delete own profile"
  ON tb_usuario
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create admin management policy
CREATE POLICY "Admins can manage all users"
  ON tb_usuario
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tb_usuario 
      WHERE user_id = auth.uid() 
      AND tipo_usuario = 'admin' 
      AND ativo = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tb_usuario 
      WHERE user_id = auth.uid() 
      AND tipo_usuario = 'admin' 
      AND ativo = true
    )
  );

-- Create admin view policy
CREATE POLICY "Admins can view all users"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tb_usuario 
      WHERE user_id = auth.uid() 
      AND tipo_usuario = 'admin' 
      AND ativo = true
    )
  );
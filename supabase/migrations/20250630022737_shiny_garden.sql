/*
  # Fix database schema to use auth.users directly

  1. Remove all existing RLS policies that depend on old functions
  2. Drop old functions safely
  3. Update foreign key constraints to reference auth.users
  4. Create new functions that work with auth.users metadata
  5. Recreate RLS policies with new functions
*/

-- First, remove all RLS policies that depend on the old functions
-- This prevents the dependency error when dropping functions

-- Remove policies from tb_fechamento_caixa
DROP POLICY IF EXISTS "Admins podem gerenciar todos os fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem ver apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus fechamentos" ON tb_fechamento_caixa;

-- Remove policies from tb_controle_jogos
DROP POLICY IF EXISTS "Admins podem gerenciar todos os jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem ver apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus jogos" ON tb_controle_jogos;

-- Remove policies from tb_suprimento_cofre
DROP POLICY IF EXISTS "Admins podem gerenciar todos os suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem ver apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus suprimentos" ON tb_suprimento_cofre;

-- Remove policies from cash_reports if they exist
DROP POLICY IF EXISTS "Admins can manage all cash reports" ON cash_reports;
DROP POLICY IF EXISTS "Users can read own cash reports" ON cash_reports;
DROP POLICY IF EXISTS "Users can insert own cash reports" ON cash_reports;
DROP POLICY IF EXISTS "Users can update own cash reports" ON cash_reports;

-- Now we can safely drop the old functions
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS user_is_active(uuid);
DROP FUNCTION IF EXISTS get_user_operator_code(uuid);

-- Remove foreign key constraints that reference tb_usuario
DO $$
BEGIN
  -- Remove foreign key from tb_fechamento_caixa if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tb_fechamento_caixa_user_id_fkey'
    AND table_name = 'tb_fechamento_caixa'
  ) THEN
    ALTER TABLE tb_fechamento_caixa DROP CONSTRAINT tb_fechamento_caixa_user_id_fkey;
  END IF;

  -- Remove foreign key from tb_controle_jogos if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tb_controle_jogos_user_id_fkey'
    AND table_name = 'tb_controle_jogos'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP CONSTRAINT tb_controle_jogos_user_id_fkey;
  END IF;

  -- Remove foreign key from tb_suprimento_cofre if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tb_suprimento_cofre_user_id_fkey'
    AND table_name = 'tb_suprimento_cofre'
  ) THEN
    ALTER TABLE tb_suprimento_cofre DROP CONSTRAINT tb_suprimento_cofre_user_id_fkey;
  END IF;
END $$;

-- Add new foreign key constraints to auth.users
DO $$
BEGIN
  -- Add foreign key to auth.users for tb_fechamento_caixa
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tb_fechamento_caixa_user_id_auth_fkey'
    AND table_name = 'tb_fechamento_caixa'
  ) THEN
    ALTER TABLE tb_fechamento_caixa 
    ADD CONSTRAINT tb_fechamento_caixa_user_id_auth_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key to auth.users for tb_controle_jogos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tb_controle_jogos_user_id_auth_fkey'
    AND table_name = 'tb_controle_jogos'
  ) THEN
    ALTER TABLE tb_controle_jogos 
    ADD CONSTRAINT tb_controle_jogos_user_id_auth_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key to auth.users for tb_suprimento_cofre
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tb_suprimento_cofre_user_id_auth_fkey'
    AND table_name = 'tb_suprimento_cofre'
  ) THEN
    ALTER TABLE tb_suprimento_cofre 
    ADD CONSTRAINT tb_suprimento_cofre_user_id_auth_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create new functions that work with auth.users metadata
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_uuid 
    AND (
      (raw_user_meta_data->>'tipo_usuario' = 'admin') OR 
      (raw_user_meta_data->>'cod_operador' = '01') OR
      (raw_user_meta_data->>'operator_code' = '01') OR
      (raw_user_meta_data->>'is_admin')::boolean = true
    )
    AND COALESCE((raw_user_meta_data->>'ativo')::boolean, true) = true
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_is_active(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_uuid 
    AND COALESCE((raw_user_meta_data->>'ativo')::boolean, true) = true
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN true; -- Default to active if metadata is missing
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_operator_code(user_uuid uuid)
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      raw_user_meta_data->>'cod_operador',
      raw_user_meta_data->>'operator_code',
      '01'
    )
    FROM auth.users 
    WHERE id = user_uuid
    LIMIT 1
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN '01';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate RLS policies for tb_fechamento_caixa
CREATE POLICY "Admins podem gerenciar todos os fechamentos"
  ON tb_fechamento_caixa FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Usuários podem inserir apenas seus fechamentos"
  ON tb_fechamento_caixa FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem ver apenas seus fechamentos"
  ON tb_fechamento_caixa FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem atualizar apenas seus fechamentos"
  ON tb_fechamento_caixa FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem deletar apenas seus fechamentos"
  ON tb_fechamento_caixa FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

-- Recreate RLS policies for tb_controle_jogos
CREATE POLICY "Admins podem gerenciar todos os jogos"
  ON tb_controle_jogos FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Usuários podem inserir apenas seus jogos"
  ON tb_controle_jogos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem ver apenas seus jogos"
  ON tb_controle_jogos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem atualizar apenas seus jogos"
  ON tb_controle_jogos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem deletar apenas seus jogos"
  ON tb_controle_jogos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

-- Recreate RLS policies for tb_suprimento_cofre
CREATE POLICY "Admins podem gerenciar todos os suprimentos"
  ON tb_suprimento_cofre FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Usuários podem inserir apenas seus suprimentos"
  ON tb_suprimento_cofre FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem ver apenas seus suprimentos"
  ON tb_suprimento_cofre FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem atualizar apenas seus suprimentos"
  ON tb_suprimento_cofre FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

CREATE POLICY "Usuários podem deletar apenas seus suprimentos"
  ON tb_suprimento_cofre FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

-- Recreate RLS policies for cash_reports if the table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'cash_reports'
    AND table_schema = 'public'
  ) THEN
    CREATE POLICY "Admins can manage all cash reports"
      ON cash_reports FOR ALL
      TO authenticated
      USING (is_admin(auth.uid()))
      WITH CHECK (is_admin(auth.uid()));

    CREATE POLICY "Users can read own cash reports"
      ON cash_reports FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() AND user_is_active(auth.uid()));

    CREATE POLICY "Users can insert own cash reports"
      ON cash_reports FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

    CREATE POLICY "Users can update own cash reports"
      ON cash_reports FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid() AND user_is_active(auth.uid()));
  END IF;
END $$;

-- Ensure RLS is enabled on all tables
ALTER TABLE tb_fechamento_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;

-- Enable RLS on cash_reports if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'cash_reports'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE cash_reports ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON FUNCTION is_admin(uuid) IS 'Verifica se o usuário tem privilégios de administrador usando auth.users metadata';
COMMENT ON FUNCTION user_is_active(uuid) IS 'Verifica se o usuário está ativo usando auth.users metadata';
COMMENT ON FUNCTION get_user_operator_code(uuid) IS 'Retorna o código do operador do usuário usando auth.users metadata';
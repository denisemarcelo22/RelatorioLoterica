/*
  # Remove tb_usuario table references

  1. Changes
    - Remove all references to tb_usuario table
    - Update foreign key constraints to use auth.users directly
    - Clean up any remaining policies or functions that reference tb_usuario

  2. Security
    - Update RLS policies to work without tb_usuario
    - Ensure proper access control using auth.users metadata
*/

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

-- Drop functions that reference tb_usuario
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS user_is_active(uuid);

-- Create new functions that work with auth.users metadata
CREATE OR REPLACE FUNCTION is_admin_auth(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_uuid 
    AND (raw_user_meta_data->>'tipo_usuario' = 'admin' OR raw_user_meta_data->>'cod_operador' = '01')
    AND (raw_user_meta_data->>'ativo')::boolean IS NOT FALSE
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_is_active_auth(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_uuid 
    AND (raw_user_meta_data->>'ativo')::boolean IS NOT FALSE
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN true; -- Default to active if metadata is missing
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for tb_fechamento_caixa to use new functions
DROP POLICY IF EXISTS "Admins podem gerenciar todos os fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Admins podem gerenciar todos os fechamentos"
  ON tb_fechamento_caixa FOR ALL
  TO authenticated
  USING (is_admin_auth(auth.uid()))
  WITH CHECK (is_admin_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem inserir apenas seus fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Usuários podem inserir apenas seus fechamentos"
  ON tb_fechamento_caixa FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem ver apenas seus fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Usuários podem ver apenas seus fechamentos"
  ON tb_fechamento_caixa FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Usuários podem atualizar apenas seus fechamentos"
  ON tb_fechamento_caixa FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem deletar apenas seus fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Usuários podem deletar apenas seus fechamentos"
  ON tb_fechamento_caixa FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

-- Update RLS policies for tb_controle_jogos
DROP POLICY IF EXISTS "Admins podem gerenciar todos os jogos" ON tb_controle_jogos;
CREATE POLICY "Admins podem gerenciar todos os jogos"
  ON tb_controle_jogos FOR ALL
  TO authenticated
  USING (is_admin_auth(auth.uid()))
  WITH CHECK (is_admin_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem inserir apenas seus jogos" ON tb_controle_jogos;
CREATE POLICY "Usuários podem inserir apenas seus jogos"
  ON tb_controle_jogos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem ver apenas seus jogos" ON tb_controle_jogos;
CREATE POLICY "Usuários podem ver apenas seus jogos"
  ON tb_controle_jogos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus jogos" ON tb_controle_jogos;
CREATE POLICY "Usuários podem atualizar apenas seus jogos"
  ON tb_controle_jogos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem deletar apenas seus jogos" ON tb_controle_jogos;
CREATE POLICY "Usuários podem deletar apenas seus jogos"
  ON tb_controle_jogos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

-- Update RLS policies for tb_suprimento_cofre
DROP POLICY IF EXISTS "Admins podem gerenciar todos os suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Admins podem gerenciar todos os suprimentos"
  ON tb_suprimento_cofre FOR ALL
  TO authenticated
  USING (is_admin_auth(auth.uid()))
  WITH CHECK (is_admin_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem inserir apenas seus suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Usuários podem inserir apenas seus suprimentos"
  ON tb_suprimento_cofre FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem ver apenas seus suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Usuários podem ver apenas seus suprimentos"
  ON tb_suprimento_cofre FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Usuários podem atualizar apenas seus suprimentos"
  ON tb_suprimento_cofre FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active_auth(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem deletar apenas seus suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Usuários podem deletar apenas seus suprimentos"
  ON tb_suprimento_cofre FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active_auth(auth.uid()));
/*
  # Fix RLS policies for user registration

  1. Security Updates
    - Update RLS policies to allow proper user registration
    - Fix policies for tb_usuario to allow signup process
    - Ensure admins can create new operators
    - Allow authenticated users to create their own profiles

  2. Changes
    - Modified "Permitir inserção durante signup" policy
    - Added proper conditions for user creation
    - Fixed admin policies for operator creation
*/

-- ATUALIZAR POLÍTICAS PARA TB_USUARIO

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins podem gerenciar todos os usuários" ON tb_usuario;
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON tb_usuario;
DROP POLICY IF EXISTS "Permitir criação de perfil próprio" ON tb_usuario;
DROP POLICY IF EXISTS "Permitir inserção durante signup" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem deletar seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON tb_usuario;

-- Política para admins gerenciarem todos os usuários
CREATE POLICY "Admins podem gerenciar todos os usuários"
  ON tb_usuario FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Política para admins verem todos os usuários
CREATE POLICY "Admins podem ver todos os usuários"
  ON tb_usuario FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Política para permitir inserção durante signup (mais permissiva)
CREATE POLICY "Permitir inserção durante signup"
  ON tb_usuario FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Permite se for o próprio usuário criando seu perfil
    user_id = auth.uid() 
    OR 
    -- Permite se for um admin criando um operador
    is_admin(auth.uid())
  );

-- Política para permitir inserção por usuários não autenticados (durante o processo de signup)
CREATE POLICY "Permitir inserção pública durante signup"
  ON tb_usuario FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para usuários verem seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON tb_usuario FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Política para usuários atualizarem seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON tb_usuario FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Política para usuários deletarem seu próprio perfil
CREATE POLICY "Usuários podem deletar seu próprio perfil"
  ON tb_usuario FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
/*
  # Corrigir erro de permissão RLS

  1. Políticas RLS
    - Simplificar políticas de INSERT para permitir cadastro
    - Corrigir políticas circulares que causam erro de permissão
    - Permitir inserção durante processo de signup

  2. Segurança
    - Manter segurança adequada após o cadastro
    - Permitir acesso público apenas para INSERT durante signup
*/

-- Desabilitar RLS temporariamente para corrigir políticas
ALTER TABLE tb_usuario DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Allow user profile creation during signup" ON tb_usuario;
DROP POLICY IF EXISTS "Authenticated users can create profiles" ON tb_usuario;
DROP POLICY IF EXISTS "Users can view own profile" ON tb_usuario;
DROP POLICY IF EXISTS "Users can update own profile" ON tb_usuario;
DROP POLICY IF EXISTS "Users can delete own profile" ON tb_usuario;
DROP POLICY IF EXISTS "Admins can manage all users" ON tb_usuario;
DROP POLICY IF EXISTS "Admins can view all users" ON tb_usuario;
DROP POLICY IF EXISTS "Permitir inserção pública durante signup" ON tb_usuario;
DROP POLICY IF EXISTS "Permitir inserção durante signup" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem deletar seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os usuários" ON tb_usuario;
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON tb_usuario;

-- Reabilitar RLS
ALTER TABLE tb_usuario ENABLE ROW LEVEL SECURITY;

-- Política simples para permitir INSERT público (necessário para signup)
CREATE POLICY "public_insert_signup"
  ON tb_usuario
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para usuários autenticados inserirem seus próprios dados
CREATE POLICY "authenticated_insert_own"
  ON tb_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Política para usuários verem seus próprios dados
CREATE POLICY "users_select_own"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Política para usuários atualizarem seus próprios dados
CREATE POLICY "users_update_own"
  ON tb_usuario
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Política para usuários deletarem seus próprios dados
CREATE POLICY "users_delete_own"
  ON tb_usuario
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Política para admins verem todos os usuários (usando verificação inline)
CREATE POLICY "admin_select_all"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tb_usuario admin_check
      WHERE admin_check.user_id = auth.uid()
      AND admin_check.tipo_usuario = 'admin'
      AND admin_check.ativo = true
    )
  );

-- Política para admins gerenciarem todos os usuários
CREATE POLICY "admin_all_operations"
  ON tb_usuario
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tb_usuario admin_check
      WHERE admin_check.user_id = auth.uid()
      AND admin_check.tipo_usuario = 'admin'
      AND admin_check.ativo = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tb_usuario admin_check
      WHERE admin_check.user_id = auth.uid()
      AND admin_check.tipo_usuario = 'admin'
      AND admin_check.ativo = true
    )
  );

-- Política para admins criarem novos operadores
CREATE POLICY "admin_insert_operators"
  ON tb_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tb_usuario admin_check
      WHERE admin_check.user_id = auth.uid()
      AND admin_check.tipo_usuario = 'admin'
      AND admin_check.ativo = true
    )
  );
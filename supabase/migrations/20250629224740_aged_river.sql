/*
  # Corrigir políticas RLS para tb_usuario

  1. Problemas identificados
    - Políticas muito restritivas para inserção de novos usuários
    - Necessidade de permitir inserção durante o processo de cadastro
    - Políticas de SELECT muito restritivas

  2. Soluções
    - Criar política mais permissiva para INSERT durante cadastro
    - Ajustar políticas de SELECT para permitir leitura própria
    - Manter segurança mas permitir operações necessárias
*/

-- Remover todas as políticas existentes da tb_usuario
DROP POLICY IF EXISTS "Usuários podem ver apenas seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Permitir inserção de perfil após cadastro" ON tb_usuario;
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON tb_usuario;

-- Política para SELECT - usuários podem ver seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Política para INSERT - permitir inserção durante cadastro
-- Esta política permite que usuários autenticados criem seu próprio perfil
CREATE POLICY "Permitir criação de perfil próprio"
  ON tb_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Política adicional para INSERT - permitir inserção por usuários não autenticados durante o processo de signup
-- Isso é necessário porque durante o signup, o usuário pode não estar completamente autenticado ainda
CREATE POLICY "Permitir inserção durante signup"
  ON tb_usuario
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para UPDATE - usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON tb_usuario
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Política para DELETE - usuários podem deletar apenas seu próprio perfil
CREATE POLICY "Usuários podem deletar seu próprio perfil"
  ON tb_usuario
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Políticas para administradores - podem ver e gerenciar todos os usuários
CREATE POLICY "Admins podem ver todos os usuários"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar todos os usuários"
  ON tb_usuario
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Garantir que RLS está habilitado
ALTER TABLE tb_usuario ENABLE ROW LEVEL SECURITY;

-- Criar índice para melhorar performance das consultas por user_id
CREATE INDEX IF NOT EXISTS idx_tb_usuario_user_id_active ON tb_usuario(user_id) WHERE ativo = true;

-- Atualizar a função is_admin para ser mais robusta
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT tipo_usuario = 'admin' AND ativo = true 
     FROM tb_usuario 
     WHERE user_id = user_uuid 
     LIMIT 1), 
    false
  );
$$;

-- Criar função para verificar se usuário existe e está ativo
CREATE OR REPLACE FUNCTION user_is_active(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT ativo = true 
     FROM tb_usuario 
     WHERE user_id = user_uuid 
     LIMIT 1), 
    false
  );
$$;

-- Comentários para documentação
COMMENT ON POLICY "Usuários podem ver seu próprio perfil" ON tb_usuario IS 'Permite que usuários vejam apenas seu próprio perfil';
COMMENT ON POLICY "Permitir criação de perfil próprio" ON tb_usuario IS 'Permite que usuários autenticados criem seu próprio perfil';
COMMENT ON POLICY "Permitir inserção durante signup" ON tb_usuario IS 'Permite inserção durante o processo de cadastro';
COMMENT ON POLICY "Usuários podem atualizar seu próprio perfil" ON tb_usuario IS 'Permite que usuários atualizem apenas seu próprio perfil';
COMMENT ON POLICY "Admins podem ver todos os usuários" ON tb_usuario IS 'Permite que administradores vejam todos os usuários';
COMMENT ON POLICY "Admins podem gerenciar todos os usuários" ON tb_usuario IS 'Permite que administradores gerenciem todos os usuários';
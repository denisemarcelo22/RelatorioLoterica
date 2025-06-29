/*
  # Configurar relacionamentos da tb_usuario com demais tabelas

  1. Relacionamentos
    - tb_fechamento_caixa.user_id -> auth.users.id
    - tb_controle_jogos.user_id -> auth.users.id  
    - tb_suprimento_cofre.user_id -> auth.users.id
    - Manter tb_usuario.user_id -> auth.users.id

  2. Políticas de Segurança
    - tb_usuario: usuários podem ver/editar apenas seus próprios dados
    - tb_fechamento_caixa: usuários podem gerenciar apenas seus fechamentos
    - tb_controle_jogos: usuários podem gerenciar apenas seus jogos
    - tb_suprimento_cofre: usuários podem gerenciar apenas seus suprimentos
    - Admins podem ver todos os dados

  3. Índices para performance
    - Índices nas colunas user_id para melhor performance
*/

-- Primeiro, vamos garantir que as foreign keys estão corretas
-- tb_fechamento_caixa já tem user_id -> auth.users.id
-- tb_controle_jogos já tem user_id -> auth.users.id
-- tb_suprimento_cofre já tem user_id -> auth.users.id
-- tb_usuario já tem user_id -> auth.users.id

-- Verificar e criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_tb_usuario_user_id ON tb_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_tb_fechamento_caixa_user_id ON tb_fechamento_caixa(user_id);
CREATE INDEX IF NOT EXISTS idx_tb_controle_jogos_user_id ON tb_controle_jogos(user_id);
CREATE INDEX IF NOT EXISTS idx_tb_suprimento_cofre_user_id ON tb_suprimento_cofre(user_id);

-- Criar função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tb_usuario 
    WHERE user_id = user_uuid 
    AND tipo_usuario = 'admin'
    AND ativo = true
  );
$$;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Usuários podem ver apenas seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seu próprio perfil" ON tb_usuario;
DROP POLICY IF EXISTS "Permitir inserção de perfil após cadastro" ON tb_usuario;
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON tb_usuario;

DROP POLICY IF EXISTS "Usuários podem ver apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Admins podem ver todos os fechamentos" ON tb_fechamento_caixa;

DROP POLICY IF EXISTS "Usuários podem ver apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Admins podem ver todos os jogos" ON tb_controle_jogos;

DROP POLICY IF EXISTS "Usuários podem ver apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Admins podem ver todos os suprimentos" ON tb_suprimento_cofre;

-- Políticas para tb_usuario
CREATE POLICY "Usuários podem ver apenas seu próprio perfil"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar apenas seu próprio perfil"
  ON tb_usuario
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Permitir inserção de perfil após cadastro"
  ON tb_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins podem ver todos os usuários"
  ON tb_usuario
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Políticas para tb_fechamento_caixa
CREATE POLICY "Usuários podem ver apenas seus fechamentos"
  ON tb_fechamento_caixa
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem inserir apenas seus fechamentos"
  ON tb_fechamento_caixa
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar apenas seus fechamentos"
  ON tb_fechamento_caixa
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar apenas seus fechamentos"
  ON tb_fechamento_caixa
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins podem ver todos os fechamentos"
  ON tb_fechamento_caixa
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar todos os fechamentos"
  ON tb_fechamento_caixa
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Políticas para tb_controle_jogos
CREATE POLICY "Usuários podem ver apenas seus jogos"
  ON tb_controle_jogos
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem inserir apenas seus jogos"
  ON tb_controle_jogos
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar apenas seus jogos"
  ON tb_controle_jogos
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar apenas seus jogos"
  ON tb_controle_jogos
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins podem ver todos os jogos"
  ON tb_controle_jogos
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar todos os jogos"
  ON tb_controle_jogos
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Políticas para tb_suprimento_cofre
CREATE POLICY "Usuários podem ver apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem inserir apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins podem ver todos os suprimentos"
  ON tb_suprimento_cofre
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar todos os suprimentos"
  ON tb_suprimento_cofre
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Garantir que RLS está habilitado em todas as tabelas
ALTER TABLE tb_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_fechamento_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;

-- Criar função trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger de updated_at se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_tb_usuario_updated_at'
    ) THEN
        CREATE TRIGGER update_tb_usuario_updated_at
            BEFORE UPDATE ON tb_usuario
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_tb_fechamento_caixa_updated_at'
    ) THEN
        CREATE TRIGGER update_tb_fechamento_caixa_updated_at
            BEFORE UPDATE ON tb_fechamento_caixa
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_tb_controle_jogos_updated_at'
    ) THEN
        CREATE TRIGGER update_tb_controle_jogos_updated_at
            BEFORE UPDATE ON tb_controle_jogos
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_tb_suprimento_cofre_updated_at'
    ) THEN
        CREATE TRIGGER update_tb_suprimento_cofre_updated_at
            BEFORE UPDATE ON tb_suprimento_cofre
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Criar função para lidar com novos usuários automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Esta função pode ser usada para criar automaticamente um perfil na tb_usuario
  -- quando um novo usuário é criado no auth.users
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários para documentação
COMMENT ON FUNCTION is_admin(uuid) IS 'Verifica se o usuário tem privilégios de administrador';
COMMENT ON FUNCTION update_updated_at_column() IS 'Atualiza automaticamente a coluna updated_at';
COMMENT ON FUNCTION handle_new_user() IS 'Manipula a criação de novos usuários';
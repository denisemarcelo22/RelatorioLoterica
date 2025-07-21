/*
  # Criar relacionamentos da tb_usuario com as demais tabelas

  1. Relacionamentos
    - tb_fechamento_caixa.user_id → tb_usuario.user_id
    - tb_controle_jogos.user_id → tb_usuario.user_id  
    - tb_suprimento_cofre.user_id → tb_usuario.user_id
    - cash_reports.user_id → tb_usuario.user_id
    - product_reports via cash_reports → tb_usuario.user_id
    - supply_reports via cash_reports → tb_usuario.user_id

  2. Políticas de Segurança
    - Atualizar políticas para usar tb_usuario como referência
    - Manter isolamento de dados por usuário
    - Permitir acesso de admin quando necessário

  3. Funções Auxiliares
    - Função is_admin() usando tb_usuario
    - Função get_user_operator_code()
*/

-- Primeiro, vamos remover as foreign keys existentes que referenciam auth.users diretamente
-- e criar novas que referenciam tb_usuario.user_id

-- Para tb_fechamento_caixa
DO $$
BEGIN
    -- Remover constraint existente se existir
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tb_fechamento_caixa_user_id_fkey' 
        AND table_name = 'tb_fechamento_caixa'
    ) THEN
        ALTER TABLE tb_fechamento_caixa DROP CONSTRAINT tb_fechamento_caixa_user_id_fkey;
    END IF;
    
    -- Adicionar nova constraint referenciando tb_usuario
    ALTER TABLE tb_fechamento_caixa 
    ADD CONSTRAINT tb_fechamento_caixa_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES tb_usuario(user_id) ON DELETE CASCADE;
END $$;

-- Para tb_controle_jogos
DO $$
BEGIN
    -- Remover constraint existente se existir
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tb_controle_jogos_user_id_fkey' 
        AND table_name = 'tb_controle_jogos'
    ) THEN
        ALTER TABLE tb_controle_jogos DROP CONSTRAINT tb_controle_jogos_user_id_fkey;
    END IF;
    
    -- Adicionar nova constraint referenciando tb_usuario
    ALTER TABLE tb_controle_jogos 
    ADD CONSTRAINT tb_controle_jogos_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES tb_usuario(user_id) ON DELETE CASCADE;
END $$;

-- Para tb_suprimento_cofre
DO $$
BEGIN
    -- Remover constraint existente se existir
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tb_suprimento_cofre_user_id_fkey' 
        AND table_name = 'tb_suprimento_cofre'
    ) THEN
        ALTER TABLE tb_suprimento_cofre DROP CONSTRAINT tb_suprimento_cofre_user_id_fkey;
    END IF;
    
    -- Adicionar nova constraint referenciando tb_usuario
    ALTER TABLE tb_suprimento_cofre 
    ADD CONSTRAINT tb_suprimento_cofre_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES tb_usuario(user_id) ON DELETE CASCADE;
END $$;

-- Para cash_reports (se existir)
DO $$
BEGIN
    -- Verificar se a tabela cash_reports existe
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cash_reports'
    ) THEN
        -- Remover constraint existente se existir
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'cash_reports_user_id_fkey' 
            AND table_name = 'cash_reports'
        ) THEN
            ALTER TABLE cash_reports DROP CONSTRAINT cash_reports_user_id_fkey;
        END IF;
        
        -- Adicionar nova constraint referenciando tb_usuario
        ALTER TABLE cash_reports 
        ADD CONSTRAINT cash_reports_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES tb_usuario(user_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Atualizar a função is_admin para usar tb_usuario
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

-- Criar função para obter código do operador
CREATE OR REPLACE FUNCTION get_user_operator_code(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT cod_operador FROM tb_usuario 
  WHERE user_id = user_uuid 
  AND ativo = true
  LIMIT 1;
$$;

-- Criar função para verificar se usuário existe e está ativo
CREATE OR REPLACE FUNCTION user_is_active(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tb_usuario 
    WHERE user_id = user_uuid 
    AND ativo = true
  );
$$;

-- Atualizar políticas para tb_fechamento_caixa
DROP POLICY IF EXISTS "Usuários podem ver apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Admins podem ver todos os fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os fechamentos" ON tb_fechamento_caixa;

CREATE POLICY "Usuários podem ver apenas seus fechamentos"
  ON tb_fechamento_caixa
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem inserir apenas seus fechamentos"
  ON tb_fechamento_caixa
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem atualizar apenas seus fechamentos"
  ON tb_fechamento_caixa
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem deletar apenas seus fechamentos"
  ON tb_fechamento_caixa
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Admins podem gerenciar todos os fechamentos"
  ON tb_fechamento_caixa
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Atualizar políticas para tb_controle_jogos
DROP POLICY IF EXISTS "Usuários podem ver apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Admins podem ver todos os jogos" ON tb_controle_jogos;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os jogos" ON tb_controle_jogos;

CREATE POLICY "Usuários podem ver apenas seus jogos"
  ON tb_controle_jogos
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem inserir apenas seus jogos"
  ON tb_controle_jogos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem atualizar apenas seus jogos"
  ON tb_controle_jogos
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem deletar apenas seus jogos"
  ON tb_controle_jogos
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Admins podem gerenciar todos os jogos"
  ON tb_controle_jogos
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Atualizar políticas para tb_suprimento_cofre
DROP POLICY IF EXISTS "Usuários podem ver apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Usuários podem deletar apenas seus suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Admins podem ver todos os suprimentos" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os suprimentos" ON tb_suprimento_cofre;

CREATE POLICY "Usuários podem ver apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem inserir apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem atualizar apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Usuários podem deletar apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() 
    AND user_is_active(auth.uid())
  );

CREATE POLICY "Admins podem gerenciar todos os suprimentos"
  ON tb_suprimento_cofre
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Atualizar políticas para cash_reports (se existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cash_reports'
    ) THEN
        -- Remover políticas existentes
        DROP POLICY IF EXISTS "Users can read own cash reports" ON cash_reports;
        DROP POLICY IF EXISTS "Users can insert own cash reports" ON cash_reports;
        DROP POLICY IF EXISTS "Users can update own cash reports" ON cash_reports;
        
        -- Criar novas políticas
        CREATE POLICY "Users can read own cash reports"
          ON cash_reports
          FOR SELECT
          TO authenticated
          USING (
            user_id = auth.uid() 
            AND user_is_active(auth.uid())
          );

        CREATE POLICY "Users can insert own cash reports"
          ON cash_reports
          FOR INSERT
          TO authenticated
          WITH CHECK (
            user_id = auth.uid() 
            AND user_is_active(auth.uid())
          );

        CREATE POLICY "Users can update own cash reports"
          ON cash_reports
          FOR UPDATE
          TO authenticated
          USING (
            user_id = auth.uid() 
            AND user_is_active(auth.uid())
          );

        CREATE POLICY "Admins can manage all cash reports"
          ON cash_reports
          FOR ALL
          TO authenticated
          USING (is_admin(auth.uid()))
          WITH CHECK (is_admin(auth.uid()));
    END IF;
END $$;

-- Criar índices para melhor performance nos relacionamentos
CREATE INDEX IF NOT EXISTS idx_tb_fechamento_caixa_user_id_active ON tb_fechamento_caixa(user_id) 
WHERE EXISTS (SELECT 1 FROM tb_usuario WHERE tb_usuario.user_id = tb_fechamento_caixa.user_id AND ativo = true);

CREATE INDEX IF NOT EXISTS idx_tb_controle_jogos_user_id_active ON tb_controle_jogos(user_id) 
WHERE EXISTS (SELECT 1 FROM tb_usuario WHERE tb_usuario.user_id = tb_controle_jogos.user_id AND ativo = true);

CREATE INDEX IF NOT EXISTS idx_tb_suprimento_cofre_user_id_active ON tb_suprimento_cofre(user_id) 
WHERE EXISTS (SELECT 1 FROM tb_usuario WHERE tb_usuario.user_id = tb_suprimento_cofre.user_id AND ativo = true);

-- Comentários para documentação
COMMENT ON FUNCTION is_admin(uuid) IS 'Verifica se o usuário tem privilégios de administrador usando tb_usuario';
COMMENT ON FUNCTION get_user_operator_code(uuid) IS 'Retorna o código do operador do usuário';
COMMENT ON FUNCTION user_is_active(uuid) IS 'Verifica se o usuário existe e está ativo na tb_usuario';

-- Garantir que todas as tabelas têm RLS habilitado
ALTER TABLE tb_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_fechamento_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;

-- Verificar se cash_reports existe e habilitar RLS
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cash_reports'
    ) THEN
        ALTER TABLE cash_reports ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;
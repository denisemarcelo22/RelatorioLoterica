/*
  # Esquema Completo do Sistema de Relatórios de Lotérica

  1. Tipos Customizados
    - `user_type` enum para tipos de usuário (admin, operador)

  2. Funções Auxiliares
    - `update_updated_at_column()` - Atualiza automaticamente a coluna updated_at
    - `handle_new_user()` - Manipula a criação de novos usuários
    - `is_admin()` - Verifica se o usuário é administrador
    - `user_is_active()` - Verifica se o usuário está ativo

  3. Tabelas Principais
    - `tb_usuario` - Dados dos usuários/operadores
    - `tb_fechamento_caixa` - Relatórios de fechamento de caixa
    - `tb_controle_jogos` - Controle de produtos/jogos
    - `tb_suprimento_cofre` - Suprimento do cofre
    - `cash_reports` - Relatórios de caixa (versão alternativa)
    - `product_reports` - Relatórios de produtos (versão alternativa)
    - `supply_reports` - Relatórios de suprimento (versão alternativa)

  4. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas para admins e operadores
    - Controle de acesso baseado em user_id e status ativo

  5. Triggers
    - Atualização automática de timestamps
    - Manipulação de novos usuários
*/

-- Criar tipo enum para tipos de usuário
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('admin', 'operador');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tb_usuario 
    WHERE user_id = user_uuid 
    AND tipo_usuario = 'admin' 
    AND ativo = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário está ativo
CREATE OR REPLACE FUNCTION user_is_active(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tb_usuario 
    WHERE user_id = user_uuid 
    AND ativo = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para manipular novos usuários
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Esta função pode ser expandida conforme necessário
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS tb_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Índices para tb_usuario
CREATE INDEX IF NOT EXISTS idx_tb_usuario_user_id ON tb_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_tb_usuario_user_id_active ON tb_usuario(user_id) WHERE ativo = true;

-- Trigger para atualizar updated_at em tb_usuario
DROP TRIGGER IF EXISTS update_tb_usuario_updated_at ON tb_usuario;
CREATE TRIGGER update_tb_usuario_updated_at
  BEFORE UPDATE ON tb_usuario
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de fechamento de caixa
CREATE TABLE IF NOT EXISTS tb_fechamento_caixa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES tb_usuario(user_id) ON DELETE CASCADE,
  cod_operador text NOT NULL,
  data_fechamento date DEFAULT CURRENT_DATE NOT NULL,
  moeda_inicial numeric(10,2) DEFAULT 0,
  bolao_inicial numeric(10,2) DEFAULT 0,
  suprimento_inicial numeric(10,2) DEFAULT 0,
  comissao_bolao numeric(10,2) DEFAULT 0,
  venda_produtos numeric(10,2) DEFAULT 0,
  total_caixa_1 numeric(10,2) DEFAULT 0,
  total_caixa_2 numeric(10,2) DEFAULT 0,
  sangria_corpvs_1 numeric(10,2) DEFAULT 0,
  sangria_corpvs_2 numeric(10,2) DEFAULT 0,
  sangria_corpvs_3 numeric(10,2) DEFAULT 0,
  sangria_corpvs_4 numeric(10,2) DEFAULT 0,
  sangria_corpvs_5 numeric(10,2) DEFAULT 0,
  sangria_cofre_1 numeric(10,2) DEFAULT 0,
  sangria_cofre_2 numeric(10,2) DEFAULT 0,
  sangria_cofre_3 numeric(10,2) DEFAULT 0,
  sangria_cofre_4 numeric(10,2) DEFAULT 0,
  sangria_cofre_5 numeric(10,2) DEFAULT 0,
  pix_malote_1 numeric(10,2) DEFAULT 0,
  pix_malote_2 numeric(10,2) DEFAULT 0,
  pix_malote_3 numeric(10,2) DEFAULT 0,
  pix_malote_4 numeric(10,2) DEFAULT 0,
  pix_malote_5 numeric(10,2) DEFAULT 0,
  premios_instantaneos numeric(10,2) DEFAULT 0,
  recebido_caixa_1 numeric(10,2) DEFAULT 0,
  recebido_caixa_2 numeric(10,2) DEFAULT 0,
  recebido_caixa_3 numeric(10,2) DEFAULT 0,
  recebido_caixa_4 numeric(10,2) DEFAULT 0,
  recebido_caixa_5 numeric(10,2) DEFAULT 0,
  recebido_caixa_6 numeric(10,2) DEFAULT 0,
  vale_loteria_1 numeric(10,2) DEFAULT 0,
  vale_loteria_2 numeric(10,2) DEFAULT 0,
  vale_loteria_3 numeric(10,2) DEFAULT 0,
  vale_loteria_4 numeric(10,2) DEFAULT 0,
  vale_loteria_5 numeric(10,2) DEFAULT 0,
  repassado_caixa_1 numeric(10,2) DEFAULT 0,
  repassado_caixa_2 numeric(10,2) DEFAULT 0,
  repassado_caixa_3 numeric(10,2) DEFAULT 0,
  repassado_caixa_4 numeric(10,2) DEFAULT 0,
  repassado_caixa_5 numeric(10,2) DEFAULT 0,
  sangria_final numeric(10,2) DEFAULT 0,
  moeda_final numeric(10,2) DEFAULT 0,
  bolao_final numeric(10,2) DEFAULT 0,
  resgates numeric(10,2) DEFAULT 0,
  diferenca numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, data_fechamento)
);

-- Índices para tb_fechamento_caixa
CREATE INDEX IF NOT EXISTS idx_tb_fechamento_caixa_user_id ON tb_fechamento_caixa(user_id);

-- Trigger para atualizar updated_at em tb_fechamento_caixa
DROP TRIGGER IF EXISTS update_tb_fechamento_caixa_updated_at ON tb_fechamento_caixa;
CREATE TRIGGER update_tb_fechamento_caixa_updated_at
  BEFORE UPDATE ON tb_fechamento_caixa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de controle de jogos
CREATE TABLE IF NOT EXISTS tb_controle_jogos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES tb_usuario(user_id) ON DELETE CASCADE,
  fechamento_id uuid NOT NULL REFERENCES tb_fechamento_caixa(id) ON DELETE CASCADE,
  cod_operador text NOT NULL,
  nome_produto text NOT NULL,
  valor_unitario numeric(10,2) NOT NULL,
  quantidade_inicial integer DEFAULT 0,
  quantidade_recebida integer DEFAULT 0,
  quantidade_devolvida integer DEFAULT 0,
  quantidade_final integer DEFAULT 0,
  valor_vendido numeric(10,2) DEFAULT ((GREATEST(0, ((quantidade_inicial + quantidade_recebida) - (quantidade_final + quantidade_devolvida))))::numeric * valor_unitario),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para tb_controle_jogos
CREATE INDEX IF NOT EXISTS idx_tb_controle_jogos_user_id ON tb_controle_jogos(user_id);

-- Trigger para atualizar updated_at em tb_controle_jogos
DROP TRIGGER IF EXISTS update_tb_controle_jogos_updated_at ON tb_controle_jogos;
CREATE TRIGGER update_tb_controle_jogos_updated_at
  BEFORE UPDATE ON tb_controle_jogos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de suprimento do cofre
CREATE TABLE IF NOT EXISTS tb_suprimento_cofre (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES tb_usuario(user_id) ON DELETE CASCADE,
  fechamento_id uuid NOT NULL REFERENCES tb_fechamento_caixa(id) ON DELETE CASCADE,
  cod_operador text NOT NULL,
  denominacao text NOT NULL,
  valor_unitario numeric(10,2) NOT NULL,
  quantidade integer DEFAULT 0,
  valor_total numeric(10,2) DEFAULT ((quantidade)::numeric * valor_unitario),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para tb_suprimento_cofre
CREATE INDEX IF NOT EXISTS idx_tb_suprimento_cofre_user_id ON tb_suprimento_cofre(user_id);

-- Trigger para atualizar updated_at em tb_suprimento_cofre
DROP TRIGGER IF EXISTS update_tb_suprimento_cofre_updated_at ON tb_suprimento_cofre;
CREATE TRIGGER update_tb_suprimento_cofre_updated_at
  BEFORE UPDATE ON tb_suprimento_cofre
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabelas alternativas (cash_reports, product_reports, supply_reports)
CREATE TABLE IF NOT EXISTS cash_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES tb_usuario(user_id) ON DELETE SET NULL,
  operator_code text NOT NULL,
  report_date date DEFAULT CURRENT_DATE,
  moeda_inicial numeric(10,2) DEFAULT 0.00,
  bolao_inicial numeric(10,2) DEFAULT 0.00,
  suprimento_inicial numeric(10,2) DEFAULT 0.00,
  comissao_bolao numeric(10,2) DEFAULT 0.00,
  venda_produtos numeric(10,2) DEFAULT 0.00,
  total_caixa_1 numeric(10,2) DEFAULT 0.00,
  total_caixa_2 numeric(10,2) DEFAULT 0.00,
  premios_instantaneos numeric(10,2) DEFAULT 0.00,
  sangria_corpvs_1 numeric(10,2) DEFAULT 0.00,
  sangria_corpvs_2 numeric(10,2) DEFAULT 0.00,
  sangria_corpvs_3 numeric(10,2) DEFAULT 0.00,
  sangria_corpvs_4 numeric(10,2) DEFAULT 0.00,
  sangria_corpvs_5 numeric(10,2) DEFAULT 0.00,
  sangria_cofre_1 numeric(10,2) DEFAULT 0.00,
  sangria_cofre_2 numeric(10,2) DEFAULT 0.00,
  sangria_cofre_3 numeric(10,2) DEFAULT 0.00,
  sangria_cofre_4 numeric(10,2) DEFAULT 0.00,
  sangria_cofre_5 numeric(10,2) DEFAULT 0.00,
  pix_malote_1 numeric(10,2) DEFAULT 0.00,
  pix_malote_2 numeric(10,2) DEFAULT 0.00,
  pix_malote_3 numeric(10,2) DEFAULT 0.00,
  pix_malote_4 numeric(10,2) DEFAULT 0.00,
  pix_malote_5 numeric(10,2) DEFAULT 0.00,
  recebido_caixa_1 numeric(10,2) DEFAULT 0.00,
  recebido_caixa_2 numeric(10,2) DEFAULT 0.00,
  recebido_caixa_3 numeric(10,2) DEFAULT 0.00,
  recebido_caixa_4 numeric(10,2) DEFAULT 0.00,
  recebido_caixa_5 numeric(10,2) DEFAULT 0.00,
  recebido_caixa_6 numeric(10,2) DEFAULT 0.00,
  vale_loteria_1 numeric(10,2) DEFAULT 0.00,
  vale_loteria_2 numeric(10,2) DEFAULT 0.00,
  vale_loteria_3 numeric(10,2) DEFAULT 0.00,
  vale_loteria_4 numeric(10,2) DEFAULT 0.00,
  vale_loteria_5 numeric(10,2) DEFAULT 0.00,
  repassado_valor_1 numeric(10,2) DEFAULT 0.00,
  repassado_valor_2 numeric(10,2) DEFAULT 0.00,
  repassado_valor_3 numeric(10,2) DEFAULT 0.00,
  repassado_valor_4 numeric(10,2) DEFAULT 0.00,
  repassado_valor_5 numeric(10,2) DEFAULT 0.00,
  sangria_final numeric(10,2) DEFAULT 0.00,
  moeda_final numeric(10,2) DEFAULT 0.00,
  bolao_final numeric(10,2) DEFAULT 0.00,
  resgates numeric(10,2) DEFAULT 0.00,
  diferenca numeric(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(operator_code, report_date)
);

-- Índices para cash_reports
CREATE INDEX IF NOT EXISTS idx_cash_reports_user_id ON cash_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_reports_operator_code ON cash_reports(operator_code);
CREATE INDEX IF NOT EXISTS idx_cash_reports_date ON cash_reports(report_date);

CREATE TABLE IF NOT EXISTS product_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_report_id uuid REFERENCES cash_reports(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  unit_value numeric(10,2) NOT NULL,
  inicial integer DEFAULT 0,
  recebi integer DEFAULT 0,
  devolvi integer DEFAULT 0,
  final integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Índices para product_reports
CREATE INDEX IF NOT EXISTS idx_product_reports_cash_report_id ON product_reports(cash_report_id);

CREATE TABLE IF NOT EXISTS supply_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_report_id uuid REFERENCES cash_reports(id) ON DELETE CASCADE,
  denomination text NOT NULL,
  quantity integer DEFAULT 0,
  unit_value numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Índices para supply_reports
CREATE INDEX IF NOT EXISTS idx_supply_reports_cash_report_id ON supply_reports(cash_report_id);

-- HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE tb_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_fechamento_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_reports ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA TB_USUARIO
DROP POLICY IF EXISTS "Admins podem gerenciar todos os usuários" ON tb_usuario;
CREATE POLICY "Admins podem gerenciar todos os usuários"
  ON tb_usuario FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON tb_usuario;
CREATE POLICY "Admins podem ver todos os usuários"
  ON tb_usuario FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Permitir criação de perfil próprio" ON tb_usuario;
CREATE POLICY "Permitir criação de perfil próprio"
  ON tb_usuario FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Permitir inserção durante signup" ON tb_usuario;
CREATE POLICY "Permitir inserção durante signup"
  ON tb_usuario FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON tb_usuario;
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON tb_usuario FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Usuários podem deletar seu próprio perfil" ON tb_usuario;
CREATE POLICY "Usuários podem deletar seu próprio perfil"
  ON tb_usuario FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON tb_usuario;
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON tb_usuario FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- POLÍTICAS PARA TB_FECHAMENTO_CAIXA
DROP POLICY IF EXISTS "Admins podem gerenciar todos os fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Admins podem gerenciar todos os fechamentos"
  ON tb_fechamento_caixa FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem inserir apenas seus fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Usuários podem inserir apenas seus fechamentos"
  ON tb_fechamento_caixa FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem ver apenas seus fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Usuários podem ver apenas seus fechamentos"
  ON tb_fechamento_caixa FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Usuários podem atualizar apenas seus fechamentos"
  ON tb_fechamento_caixa FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem deletar apenas seus fechamentos" ON tb_fechamento_caixa;
CREATE POLICY "Usuários podem deletar apenas seus fechamentos"
  ON tb_fechamento_caixa FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

-- POLÍTICAS PARA TB_CONTROLE_JOGOS
DROP POLICY IF EXISTS "Admins podem gerenciar todos os jogos" ON tb_controle_jogos;
CREATE POLICY "Admins podem gerenciar todos os jogos"
  ON tb_controle_jogos FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem inserir apenas seus jogos" ON tb_controle_jogos;
CREATE POLICY "Usuários podem inserir apenas seus jogos"
  ON tb_controle_jogos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem ver apenas seus jogos" ON tb_controle_jogos;
CREATE POLICY "Usuários podem ver apenas seus jogos"
  ON tb_controle_jogos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus jogos" ON tb_controle_jogos;
CREATE POLICY "Usuários podem atualizar apenas seus jogos"
  ON tb_controle_jogos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem deletar apenas seus jogos" ON tb_controle_jogos;
CREATE POLICY "Usuários podem deletar apenas seus jogos"
  ON tb_controle_jogos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

-- POLÍTICAS PARA TB_SUPRIMENTO_COFRE
DROP POLICY IF EXISTS "Admins podem gerenciar todos os suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Admins podem gerenciar todos os suprimentos"
  ON tb_suprimento_cofre FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem inserir apenas seus suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Usuários podem inserir apenas seus suprimentos"
  ON tb_suprimento_cofre FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem ver apenas seus suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Usuários podem ver apenas seus suprimentos"
  ON tb_suprimento_cofre FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Usuários podem atualizar apenas seus suprimentos"
  ON tb_suprimento_cofre FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()))
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Usuários podem deletar apenas seus suprimentos" ON tb_suprimento_cofre;
CREATE POLICY "Usuários podem deletar apenas seus suprimentos"
  ON tb_suprimento_cofre FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

-- POLÍTICAS PARA CASH_REPORTS
DROP POLICY IF EXISTS "Admins can manage all cash reports" ON cash_reports;
CREATE POLICY "Admins can manage all cash reports"
  ON cash_reports FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can insert own cash reports" ON cash_reports;
CREATE POLICY "Users can insert own cash reports"
  ON cash_reports FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Users can read own cash reports" ON cash_reports;
CREATE POLICY "Users can read own cash reports"
  ON cash_reports FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

DROP POLICY IF EXISTS "Users can update own cash reports" ON cash_reports;
CREATE POLICY "Users can update own cash reports"
  ON cash_reports FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_is_active(auth.uid()));

-- POLÍTICAS PARA PRODUCT_REPORTS
DROP POLICY IF EXISTS "Users can manage product reports for their cash reports" ON product_reports;
CREATE POLICY "Users can manage product reports for their cash reports"
  ON product_reports FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cash_reports 
      WHERE cash_reports.id = product_reports.cash_report_id 
      AND cash_reports.user_id = auth.uid()
    )
  );

-- POLÍTICAS PARA SUPPLY_REPORTS
DROP POLICY IF EXISTS "Users can manage supply reports for their cash reports" ON supply_reports;
CREATE POLICY "Users can manage supply reports for their cash reports"
  ON supply_reports FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cash_reports 
      WHERE cash_reports.id = supply_reports.cash_report_id 
      AND cash_reports.user_id = auth.uid()
    )
  );
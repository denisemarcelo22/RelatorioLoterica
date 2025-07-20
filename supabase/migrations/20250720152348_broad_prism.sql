/*
  # Atualizar estrutura das tabelas

  1. Alterações nas tabelas existentes
    - Atualizar tb_suprimento_cofre com colunas específicas de denominações
    - Atualizar tb_controle_jogos com colunas específicas de produtos
    - Ajustar campos de código operador para 7 caracteres

  2. Segurança
    - Manter RLS habilitado
    - Manter políticas existentes
*/

-- Primeiro, vamos fazer backup dos dados existentes se houver
-- e depois recriar as tabelas com a nova estrutura

-- Recriar tabela tb_suprimento_cofre
DROP TABLE IF EXISTS tb_suprimento_cofre CASCADE;

CREATE TABLE tb_suprimento_cofre (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fechamento_id uuid NOT NULL REFERENCES tb_fechamento_caixa(id) ON DELETE CASCADE,
  cod_operador text NOT NULL,
  "R$200" integer DEFAULT 0,
  "R$100" integer DEFAULT 0,
  "R$50" integer DEFAULT 0,
  "R$20" integer DEFAULT 0,
  "R$10" integer DEFAULT 0,
  "R$5" integer DEFAULT 0,
  "R$2" integer DEFAULT 0,
  "R$1" integer DEFAULT 0,
  "R$0,50" integer DEFAULT 0,
  "R$0,25" integer DEFAULT 0,
  "R$0,10" integer DEFAULT 0,
  "R$0,05" integer DEFAULT 0,
  qtd integer DEFAULT 0,
  vlr_total numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recriar tabela tb_controle_jogos
DROP TABLE IF EXISTS tb_controle_jogos CASCADE;

CREATE TABLE tb_controle_jogos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fechamento_id uuid NOT NULL REFERENCES tb_fechamento_caixa(id) ON DELETE CASCADE,
  cod_operador text NOT NULL,
  telesena_verde integer DEFAULT 0,
  rodada_da_sorte integer DEFAULT 0,
  federal_10 integer DEFAULT 0,
  telesena_lilas integer DEFAULT 0,
  trio integer DEFAULT 0,
  trevo_sorte integer DEFAULT 0,
  federal integer DEFAULT 0,
  telesena integer DEFAULT 0,
  caca_tesouro integer DEFAULT 0,
  so_ouro integer DEFAULT 0,
  telesena_rosa integer DEFAULT 0,
  telesena_amarela integer DEFAULT 0,
  telesena_vermelha integer DEFAULT 0,
  qtd_inicial integer DEFAULT 0,
  qtd_recebida integer DEFAULT 0,
  qtd_devolvida integer DEFAULT 0,
  qtd_final integer DEFAULT 0,
  vlr_vendido numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos ENABLE ROW LEVEL SECURITY;

-- Criar políticas para tb_suprimento_cofre
CREATE POLICY "Admins podem gerenciar todos os suprimentos"
  ON tb_suprimento_cofre
  FOR ALL
  TO authenticated
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));

CREATE POLICY "Usuários podem inserir apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR INSERT
  TO authenticated
  WITH CHECK ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem ver apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR SELECT
  TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem atualizar apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR UPDATE
  TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()))
  WITH CHECK ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem deletar apenas seus suprimentos"
  ON tb_suprimento_cofre
  FOR DELETE
  TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()));

-- Criar políticas para tb_controle_jogos
CREATE POLICY "Admins podem gerenciar todos os jogos"
  ON tb_controle_jogos
  FOR ALL
  TO authenticated
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));

CREATE POLICY "Usuários podem inserir apenas seus jogos"
  ON tb_controle_jogos
  FOR INSERT
  TO authenticated
  WITH CHECK ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem ver apenas seus jogos"
  ON tb_controle_jogos
  FOR SELECT
  TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem atualizar apenas seus jogos"
  ON tb_controle_jogos
  FOR UPDATE
  TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()))
  WITH CHECK ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem deletar apenas seus jogos"
  ON tb_controle_jogos
  FOR DELETE
  TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()));

-- Criar índices para performance
CREATE INDEX idx_tb_suprimento_cofre_user_id ON tb_suprimento_cofre(user_id);
CREATE INDEX idx_tb_suprimento_cofre_fechamento_id ON tb_suprimento_cofre(fechamento_id);
CREATE INDEX idx_tb_controle_jogos_user_id ON tb_controle_jogos(user_id);
CREATE INDEX idx_tb_controle_jogos_fechamento_id ON tb_controle_jogos(fechamento_id);

-- Criar triggers para updated_at
CREATE TRIGGER update_tb_suprimento_cofre_updated_at
  BEFORE UPDATE ON tb_suprimento_cofre
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tb_controle_jogos_updated_at
  BEFORE UPDATE ON tb_controle_jogos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
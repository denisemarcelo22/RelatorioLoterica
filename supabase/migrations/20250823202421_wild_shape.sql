/*
  # Atualizar estrutura das tabelas tb_suprimento_cofre e tb_controle_jogos

  1. Tabelas
    - Recriar `tb_suprimento_cofre` com nova estrutura
    - Recriar `tb_controle_jogos` com nova estrutura
  2. Segurança
    - Manter RLS habilitado
    - Recriar políticas de segurança
  3. Índices
    - Recriar índices necessários
*/

-- Drop existing tables
DROP TABLE IF EXISTS public.tb_suprimento_cofre CASCADE;
DROP TABLE IF EXISTS public.tb_controle_jogos CASCADE;

-- Create tb_suprimento_cofre with new structure
CREATE TABLE public.tb_suprimento_cofre (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fechamento_id uuid NOT NULL,
  cod_operador text NOT NULL,
  
  -- Denominações
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
  vlr_total numeric(15,2) DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT tb_suprimento_cofre_pkey PRIMARY KEY (id),
  CONSTRAINT tb_suprimento_cofre_user_id_auth_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT tb_suprimento_cofre_fechamento_id_fkey FOREIGN KEY (fechamento_id) REFERENCES cash_reports(id) ON DELETE CASCADE
);

-- Create tb_controle_jogos with new structure
CREATE TABLE public.tb_controle_jogos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fechamento_id uuid NOT NULL,
  cod_operador text NOT NULL,

  -- TELE SENA VERDE
  quantidade_tele_sena_verde integer DEFAULT 0,
  valor_tele_sena_verde numeric(10,2) DEFAULT 5.00,
  valor_vendido_tele_sena_verde numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_verde * valor_tele_sena_verde) STORED,

  -- RODA DA SORTE
  quantidade_roda_da_sorte integer DEFAULT 0,
  valor_roda_da_sorte numeric(10,2) DEFAULT 5.00,
  valor_vendido_roda_da_sorte numeric(10,2) GENERATED ALWAYS AS (quantidade_roda_da_sorte * valor_roda_da_sorte) STORED,

  -- FEDERAL R$10
  quantidade_federal_10 integer DEFAULT 0,
  valor_federal_10 numeric(10,2) DEFAULT 10.00,
  valor_vendido_federal_10 numeric(10,2) GENERATED ALWAYS AS (quantidade_federal_10 * valor_federal_10) STORED,

  -- TELE SENA LILÁS
  quantidade_tele_sena_lilas integer DEFAULT 0,
  valor_tele_sena_lilas numeric(10,2) DEFAULT 5.00,
  valor_vendido_tele_sena_lilas numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_lilas * valor_tele_sena_lilas) STORED,

  -- TRIO (VIP)
  quantidade_trio integer DEFAULT 0,
  valor_trio numeric(10,2) DEFAULT 20.00,
  valor_vendido_trio numeric(10,2) GENERATED ALWAYS AS (quantidade_trio * valor_trio) STORED,

  -- TREVO DA SORTE
  quantidade_trevo_da_sorte integer DEFAULT 0,
  valor_trevo_da_sorte numeric(10,2) DEFAULT 2.50,
  valor_vendido_trevo_da_sorte numeric(10,2) GENERATED ALWAYS AS (quantidade_trevo_da_sorte * valor_trevo_da_sorte) STORED,

  -- FEDERAL
  quantidade_federal integer DEFAULT 0,
  valor_federal numeric(10,2) DEFAULT 4.00,
  valor_vendido_federal numeric(10,2) GENERATED ALWAYS AS (quantidade_federal * valor_federal) STORED,

  -- TELE SENA
  quantidade_tele_sena integer DEFAULT 0,
  valor_tele_sena numeric(10,2) DEFAULT 15.00,
  valor_vendido_tele_sena numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena * valor_tele_sena) STORED,

  -- CAÇA AO TESOURO
  quantidade_caca_ao_tesouro integer DEFAULT 0,
  valor_caca_ao_tesouro numeric(10,2) DEFAULT 10.00,
  valor_vendido_caca_ao_tesouro numeric(10,2) GENERATED ALWAYS AS (quantidade_caca_ao_tesouro * valor_caca_ao_tesouro) STORED,

  -- SÓ O OURO
  quantidade_so_o_ouro integer DEFAULT 0,
  valor_so_o_ouro numeric(10,2) DEFAULT 2.50,
  valor_vendido_so_o_ouro numeric(10,2) GENERATED ALWAYS AS (quantidade_so_o_ouro * valor_so_o_ouro) STORED,

  -- TELE SENA ROSA
  quantidade_tele_sena_rosa integer DEFAULT 0,
  valor_tele_sena_rosa numeric(10,2) DEFAULT 5.00,
  valor_vendido_tele_sena_rosa numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_rosa * valor_tele_sena_rosa) STORED,

  -- TELE SENA AMARELA
  quantidade_tele_sena_amarela integer DEFAULT 0,
  valor_tele_sena_amarela numeric(10,2) DEFAULT 10.00,
  valor_vendido_tele_sena_amarela numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_amarela * valor_tele_sena_amarela) STORED,

  -- TELE SENA VERMELHA
  quantidade_tele_sena_vermelha integer DEFAULT 0,
  valor_tele_sena_vermelha numeric(10,2) DEFAULT 10.00,
  valor_vendido_tele_sena_vermelha numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_vermelha * valor_tele_sena_vermelha) STORED,

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT tb_controle_jogos_pkey PRIMARY KEY (id),
  CONSTRAINT tb_controle_jogos_user_id_auth_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT tb_controle_jogos_fechamento_id_fkey FOREIGN KEY (fechamento_id) REFERENCES cash_reports(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_tb_suprimento_cofre_user_id ON public.tb_suprimento_cofre USING btree (user_id);
CREATE INDEX idx_tb_suprimento_cofre_fechamento_id ON public.tb_suprimento_cofre USING btree (fechamento_id);
CREATE INDEX idx_tb_controle_jogos_user_id ON public.tb_controle_jogos USING btree (user_id);
CREATE INDEX idx_tb_controle_jogos_fechamento_id ON public.tb_controle_jogos USING btree (fechamento_id);

-- Enable RLS
ALTER TABLE public.tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_controle_jogos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tb_suprimento_cofre
CREATE POLICY "Admins podem gerenciar todos os suprimentos" ON public.tb_suprimento_cofre
  FOR ALL TO authenticated
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));

CREATE POLICY "Usuários podem inserir apenas seus suprimentos" ON public.tb_suprimento_cofre
  FOR INSERT TO authenticated
  WITH CHECK ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem ver apenas seus suprimentos" ON public.tb_suprimento_cofre
  FOR SELECT TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem atualizar apenas seus suprimentos" ON public.tb_suprimento_cofre
  FOR UPDATE TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()))
  WITH CHECK ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem deletar apenas seus suprimentos" ON public.tb_suprimento_cofre
  FOR DELETE TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()));

-- Create RLS policies for tb_controle_jogos
CREATE POLICY "Admins podem gerenciar todos os jogos" ON public.tb_controle_jogos
  FOR ALL TO authenticated
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));

CREATE POLICY "Usuários podem inserir apenas seus jogos" ON public.tb_controle_jogos
  FOR INSERT TO authenticated
  WITH CHECK ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem ver apenas seus jogos" ON public.tb_controle_jogos
  FOR SELECT TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem atualizar apenas seus jogos" ON public.tb_controle_jogos
  FOR UPDATE TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()))
  WITH CHECK ((user_id = uid()) AND user_is_active(uid()));

CREATE POLICY "Usuários podem deletar apenas seus jogos" ON public.tb_controle_jogos
  FOR DELETE TO authenticated
  USING ((user_id = uid()) AND user_is_active(uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_tb_suprimento_cofre_updated_at
  BEFORE UPDATE ON public.tb_suprimento_cofre
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tb_controle_jogos_updated_at
  BEFORE UPDATE ON public.tb_controle_jogos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
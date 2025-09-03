/*
  # Atualizar estrutura da tabela tb_controle_jogos

  1. Modificações na Tabela
    - Remove campo user_id (não mais necessário)
    - Atualiza estrutura de produtos com campos específicos para cada jogo
    - Adiciona colunas de valor e total calculado para cada produto
    - Renomeia campo trio para quantidade_trio (VIP)

  2. Novos Produtos
    - Tele Sena Verde (R$ 5,00)
    - Roda da Sorte (R$ 5,00)
    - Federal R$10 (R$ 10,00)
    - Tele Sena Lilás (R$ 5,00)
    - Trio/VIP (R$ 20,00)
    - Trevo da Sorte (R$ 2,50)
    - Federal (R$ 4,00)
    - Tele Sena (R$ 15,00)
    - Caça ao Tesouro (R$ 10,00)
    - Só o Ouro (R$ 2,50)
    - Tele Sena Rosa (R$ 5,00)
    - Tele Sena Amarela (R$ 10,00)
    - Tele Sena Vermelha (R$ 10,00)

  3. Colunas Calculadas
    - Cada produto tem valor_vendido calculado automaticamente
    - Colunas generated always as (quantidade * valor) stored
*/

-- Remove a coluna user_id se existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP COLUMN user_id;
  END IF;
END $$;

-- Remove colunas antigas se existirem
DO $$
BEGIN
  -- Remove colunas antigas de produtos genéricos
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'nome_produto'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP COLUMN nome_produto;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_unitario'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP COLUMN valor_unitario;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_inicial'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP COLUMN quantidade_inicial;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_recebida'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP COLUMN quantidade_recebida;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_devolvida'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP COLUMN quantidade_devolvida;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_final'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP COLUMN quantidade_final;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido'
  ) THEN
    ALTER TABLE tb_controle_jogos DROP COLUMN valor_vendido;
  END IF;
END $$;

-- Adiciona novas colunas para TELE SENA VERDE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_tele_sena_verde'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_tele_sena_verde integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_tele_sena_verde'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_tele_sena_verde numeric(10,2) DEFAULT 5.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_tele_sena_verde'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_tele_sena_verde numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_verde * valor_tele_sena_verde) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para RODA DA SORTE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_roda_da_sorte'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_roda_da_sorte integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_roda_da_sorte'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_roda_da_sorte numeric(10,2) DEFAULT 5.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_roda_da_sorte'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_roda_da_sorte numeric(10,2) GENERATED ALWAYS AS (quantidade_roda_da_sorte * valor_roda_da_sorte) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para FEDERAL R$10
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_federal_10'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_federal_10 integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_federal_10'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_federal_10 numeric(10,2) DEFAULT 10.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_federal_10'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_federal_10 numeric(10,2) GENERATED ALWAYS AS (quantidade_federal_10 * valor_federal_10) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para TELE SENA LILÁS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_tele_sena_lilas'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_tele_sena_lilas integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_tele_sena_lilas'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_tele_sena_lilas numeric(10,2) DEFAULT 5.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_tele_sena_lilas'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_tele_sena_lilas numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_lilas * valor_tele_sena_lilas) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para TRIO (VIP)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_trio'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_trio integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_trio'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_trio numeric(10,2) DEFAULT 20.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_trio'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_trio numeric(10,2) GENERATED ALWAYS AS (quantidade_trio * valor_trio) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para TREVO DA SORTE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_trevo_da_sorte'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_trevo_da_sorte integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_trevo_da_sorte'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_trevo_da_sorte numeric(10,2) DEFAULT 2.50;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_trevo_da_sorte'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_trevo_da_sorte numeric(10,2) GENERATED ALWAYS AS (quantidade_trevo_da_sorte * valor_trevo_da_sorte) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para FEDERAL
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_federal'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_federal integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_federal'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_federal numeric(10,2) DEFAULT 4.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_federal'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_federal numeric(10,2) GENERATED ALWAYS AS (quantidade_federal * valor_federal) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para TELE SENA
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_tele_sena'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_tele_sena integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_tele_sena'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_tele_sena numeric(10,2) DEFAULT 15.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_tele_sena'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_tele_sena numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena * valor_tele_sena) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para CAÇA AO TESOURO
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_caca_ao_tesouro'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_caca_ao_tesouro integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_caca_ao_tesouro'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_caca_ao_tesouro numeric(10,2) DEFAULT 10.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_caca_ao_tesouro'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_caca_ao_tesouro numeric(10,2) GENERATED ALWAYS AS (quantidade_caca_ao_tesouro * valor_caca_ao_tesouro) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para SÓ O OURO
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_so_o_ouro'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_so_o_ouro integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_so_o_ouro'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_so_o_ouro numeric(10,2) DEFAULT 2.50;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_so_o_ouro'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_so_o_ouro numeric(10,2) GENERATED ALWAYS AS (quantidade_so_o_ouro * valor_so_o_ouro) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para TELE SENA ROSA
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_tele_sena_rosa'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_tele_sena_rosa integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_tele_sena_rosa'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_tele_sena_rosa numeric(10,2) DEFAULT 5.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_tele_sena_rosa'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_tele_sena_rosa numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_rosa * valor_tele_sena_rosa) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para TELE SENA AMARELA
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_tele_sena_amarela'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_tele_sena_amarela integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_tele_sena_amarela'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_tele_sena_amarela numeric(10,2) DEFAULT 10.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_tele_sena_amarela'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_tele_sena_amarela numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_amarela * valor_tele_sena_amarela) STORED;
  END IF;
END $$;

-- Adiciona novas colunas para TELE SENA VERMELHA
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'quantidade_tele_sena_vermelha'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN quantidade_tele_sena_vermelha integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_tele_sena_vermelha'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_tele_sena_vermelha numeric(10,2) DEFAULT 10.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tb_controle_jogos' AND column_name = 'valor_vendido_tele_sena_vermelha'
  ) THEN
    ALTER TABLE tb_controle_jogos ADD COLUMN valor_vendido_tele_sena_vermelha numeric(10,2) GENERATED ALWAYS AS (quantidade_tele_sena_vermelha * valor_tele_sena_vermelha) STORED;
  END IF;
END $$;
/*
  # Remove duplicate tables and consolidate database structure

  1. Changes
    - Remove duplicate tables: cash_reports, product_reports, supply_reports
    - Keep only the main tables: tb_usuario, tb_fechamento_caixa, tb_controle_jogos, tb_suprimento_cofre
    - Update any remaining references

  2. Security
    - All RLS policies remain intact for main tables
    - Remove policies for deleted tables
*/

-- Remove tabelas duplicadas
DROP TABLE IF EXISTS product_reports CASCADE;
DROP TABLE IF EXISTS supply_reports CASCADE;
DROP TABLE IF EXISTS cash_reports CASCADE;

-- Remover políticas das tabelas que foram removidas (caso existam)
-- As políticas são automaticamente removidas quando as tabelas são removidas
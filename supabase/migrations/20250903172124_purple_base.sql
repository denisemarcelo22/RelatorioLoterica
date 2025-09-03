/*
  # Atualizar estrutura da tabela product_reports

  1. Modificações na Tabela
    - Remove campo user_id (não mais necessário)
    - Mantém cash_report_id como referência principal
*/

-- Remove a coluna user_id se existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_reports' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE product_reports DROP COLUMN user_id;
  END IF;
END $$;
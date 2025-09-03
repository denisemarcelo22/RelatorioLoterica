/*
  # Atualizar estrutura da tabela cash_reports

  1. Modificações na Tabela
    - Remove campo user_id (não mais necessário)
    - Mantém operator_code como identificador principal
    - Atualiza constraint unique para usar apenas operator_code e report_date

  2. Índices
    - Remove índices que referenciam user_id
    - Mantém índices baseados em operator_code
*/

-- Remove a coluna user_id se existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cash_reports' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE cash_reports DROP COLUMN user_id;
  END IF;
END $$;

-- Remove índices antigos que referenciam user_id se existirem
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'cash_reports' AND indexname = 'cash_reports_user_id_report_date_key'
  ) THEN
    DROP INDEX cash_reports_user_id_report_date_key;
  END IF;
END $$;
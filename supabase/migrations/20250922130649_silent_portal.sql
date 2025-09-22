/*
  # Final cleanup of users table references

  1. Ensure all foreign key constraints to users table are removed
  2. Update any remaining columns that might reference users
  3. Verify RLS policies are correctly set up
  4. Clean up any orphaned data or constraints
*/

-- Remove any remaining foreign key constraints that might reference users
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Find and drop any foreign key constraints that reference users table
    FOR constraint_record IN
        SELECT 
            tc.table_name,
            tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu 
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'users'
    LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', 
                      constraint_record.table_name, 
                      constraint_record.constraint_name);
    END LOOP;
END $$;

-- Ensure cash_reports table has correct structure
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cash_reports' AND column_name = 'operator_code'
    ) THEN
        ALTER TABLE cash_reports ADD COLUMN operator_code text NOT NULL DEFAULT '01';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cash_reports' AND column_name = 'report_date'
    ) THEN
        ALTER TABLE cash_reports ADD COLUMN report_date date DEFAULT CURRENT_DATE;
    END IF;
END $$;

-- Ensure product_reports table has correct structure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_reports' AND column_name = 'cash_report_id'
    ) THEN
        ALTER TABLE product_reports ADD COLUMN cash_report_id uuid;
    END IF;
END $$;

-- Ensure supply_reports table has correct structure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'supply_reports' AND column_name = 'cash_report_id'
    ) THEN
        ALTER TABLE supply_reports ADD COLUMN cash_report_id uuid;
    END IF;
END $$;

-- Update tb_controle_jogos to ensure it has fechamento_id referencing cash_reports
DO $$
BEGIN
    -- Drop existing foreign key if it exists
    ALTER TABLE tb_controle_jogos DROP CONSTRAINT IF EXISTS tb_controle_jogos_fechamento_id_fkey;
    
    -- Add new foreign key constraint to cash_reports
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cash_reports') THEN
        ALTER TABLE tb_controle_jogos 
        ADD CONSTRAINT tb_controle_jogos_fechamento_id_fkey 
        FOREIGN KEY (fechamento_id) REFERENCES cash_reports(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update tb_suprimento_cofre to ensure it has fechamento_id referencing cash_reports
DO $$
BEGIN
    -- Drop existing foreign key if it exists
    ALTER TABLE tb_suprimento_cofre DROP CONSTRAINT IF EXISTS tb_suprimento_cofre_fechamento_id_fkey;
    
    -- Add new foreign key constraint to cash_reports
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cash_reports') THEN
        ALTER TABLE tb_suprimento_cofre 
        ADD CONSTRAINT tb_suprimento_cofre_fechamento_id_fkey 
        FOREIGN KEY (fechamento_id) REFERENCES cash_reports(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Clean up any columns that might reference user_id
DO $$
DECLARE
    table_record RECORD;
    column_record RECORD;
BEGIN
    -- Find tables with user_id columns and drop them
    FOR table_record IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    LOOP
        FOR column_record IN
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = table_record.table_name
            AND column_name IN ('user_id', 'created_by', 'updated_by')
        LOOP
            EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS %I CASCADE', 
                          table_record.table_name, 
                          column_record.column_name);
        END LOOP;
    END LOOP;
END $$;

-- Ensure all main tables have proper indexes
CREATE INDEX IF NOT EXISTS idx_cash_reports_operator_date 
ON cash_reports(operator_code, report_date);

CREATE INDEX IF NOT EXISTS idx_tb_controle_jogos_fechamento 
ON tb_controle_jogos(fechamento_id);

CREATE INDEX IF NOT EXISTS idx_tb_suprimento_cofre_fechamento 
ON tb_suprimento_cofre(fechamento_id);

-- Final verification: ensure RLS is properly configured
ALTER TABLE cash_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_fechamento_caixa ENABLE ROW LEVEL SECURITY;
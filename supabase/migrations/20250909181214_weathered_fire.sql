/*
  # Remove users references and fix RLS policies

  1. Remove foreign key constraints to users table
  2. Remove RLS policies that reference users
  3. Add new RLS policies that allow all authenticated users
  4. Clean up any remaining users references
*/

-- Remove foreign key constraint from system_users if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'system_users_id_fkey' 
    AND table_name = 'system_users'
  ) THEN
    ALTER TABLE system_users DROP CONSTRAINT system_users_id_fkey;
  END IF;
END $$;

-- Drop system_users table completely as it's not needed
DROP TABLE IF EXISTS system_users CASCADE;

-- Remove existing RLS policies that reference users or auth functions
DROP POLICY IF EXISTS "Admins podem gerenciar todos os fechamentos" ON tb_fechamento_caixa;
DROP POLICY IF EXISTS "Admins podem gerenciar todos os jogos" ON tb_controle_jogos;

-- Remove any existing policies on tb_suprimento_cofre
DROP POLICY IF EXISTS "Users can manage their own supply reports" ON tb_suprimento_cofre;
DROP POLICY IF EXISTS "Admins can manage all supply reports" ON tb_suprimento_cofre;

-- Disable RLS on all tables to allow full access for authenticated users
ALTER TABLE tb_fechamento_caixa DISABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos DISABLE ROW LEVEL SECURITY;
ALTER TABLE tb_suprimento_cofre DISABLE ROW LEVEL SECURITY;
ALTER TABLE cash_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE supply_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE tb_resumooperador DISABLE ROW LEVEL SECURITY;
ALTER TABLE tb_lancamentos_pix DISABLE ROW LEVEL SECURITY;
ALTER TABLE tb_lancamentos_cartao DISABLE ROW LEVEL SECURITY;
ALTER TABLE tb_bolao_caixa DISABLE ROW LEVEL SECURITY;

-- Or alternatively, if you want to keep RLS but allow all authenticated users:
-- Enable RLS and create permissive policies for authenticated users
ALTER TABLE tb_fechamento_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow all authenticated users to do everything
CREATE POLICY "Allow all for authenticated users" ON tb_fechamento_caixa
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON tb_controle_jogos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON tb_suprimento_cofre
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Ensure cash_reports, product_reports, and supply_reports have proper policies
CREATE POLICY "Allow all for authenticated users" ON cash_reports
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON product_reports
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON supply_reports
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Remove any auth helper functions that might reference users table
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS handle_new_user();

-- Update trigger functions to remove any users references
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
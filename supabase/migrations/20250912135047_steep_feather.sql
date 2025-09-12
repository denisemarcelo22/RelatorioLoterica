/*
  # Remove users table dependencies and fix RLS policies

  1. Drop policies that reference non-existent users table
  2. Remove foreign key constraints to users table
  3. Create simple policies for authenticated users
  4. Fix RLS issues for all tables
*/

-- Drop policies that might reference users table (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Users can read own data" ON auth.users;
DROP POLICY IF EXISTS "Users can update own data" ON auth.users;
DROP POLICY IF EXISTS "Users can create their own profile" ON auth.users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON auth.users;
DROP POLICY IF EXISTS "Admins can read all users" ON auth.users;

-- Drop policies on cash_reports that reference users
DROP POLICY IF EXISTS "Admins can read all cash reports" ON cash_reports;
DROP POLICY IF EXISTS "Admins can read cash reports by operator" ON cash_reports;
DROP POLICY IF EXISTS "Users can read own cash reports" ON cash_reports;
DROP POLICY IF EXISTS "Users can insert own cash reports" ON cash_reports;
DROP POLICY IF EXISTS "Users can update own cash reports" ON cash_reports;

-- Drop policies on product_reports
DROP POLICY IF EXISTS "Admins can read all product reports" ON product_reports;
DROP POLICY IF EXISTS "Users can manage product reports for their cash reports" ON product_reports;

-- Drop policies on supply_reports
DROP POLICY IF EXISTS "Admins can read all supply reports" ON supply_reports;
DROP POLICY IF EXISTS "Users can manage supply reports for their cash reports" ON supply_reports;

-- Drop policies on tb_fechamento_caixa
DROP POLICY IF EXISTS "Admins podem gerenciar todos os fechamentos" ON tb_fechamento_caixa;

-- Drop policies on tb_controle_jogos
DROP POLICY IF EXISTS "Admins podem gerenciar todos os jogos" ON tb_controle_jogos;

-- Drop policies on tb_suprimento_cofre
DROP POLICY IF EXISTS "tb_suprimento_cofre_all" ON tb_suprimento_cofre;

-- Remove foreign key constraints to users table (if they exist)
ALTER TABLE IF EXISTS cash_reports DROP CONSTRAINT IF EXISTS cash_reports_user_id_fkey;
ALTER TABLE IF EXISTS product_reports DROP CONSTRAINT IF EXISTS product_reports_user_id_fkey;
ALTER TABLE IF EXISTS supply_reports DROP CONSTRAINT IF EXISTS supply_reports_user_id_fkey;

-- Make user_id columns nullable (if they exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cash_reports' AND column_name = 'user_id') THEN
    ALTER TABLE cash_reports ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- Create simple policies for authenticated users on cash_reports
CREATE POLICY "Allow all for authenticated users on cash_reports"
  ON cash_reports
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create simple policies for authenticated users on product_reports
CREATE POLICY "Allow all for authenticated users on product_reports"
  ON product_reports
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create simple policies for authenticated users on supply_reports
CREATE POLICY "Allow all for authenticated users on supply_reports"
  ON supply_reports
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create simple policies for authenticated users on tb_fechamento_caixa
CREATE POLICY "Allow all for authenticated users on tb_fechamento_caixa"
  ON tb_fechamento_caixa
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create simple policies for authenticated users on tb_controle_jogos
CREATE POLICY "Allow all for authenticated users on tb_controle_jogos"
  ON tb_controle_jogos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create simple policies for authenticated users on tb_suprimento_cofre
CREATE POLICY "Allow all for authenticated users on tb_suprimento_cofre"
  ON tb_suprimento_cofre
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE cash_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_fechamento_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_controle_jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_suprimento_cofre ENABLE ROW LEVEL SECURITY;
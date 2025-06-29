/*
  # Delete users table

  This migration removes the users table and all its dependencies:
  1. Drop all policies on the users table
  2. Drop foreign key constraints that reference users table
  3. Drop the users table itself
  4. Update cash_reports table to remove user_id foreign key
*/

-- Drop all policies on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Drop policies on other tables that reference users
DROP POLICY IF EXISTS "Admins can read all cash reports" ON cash_reports;
DROP POLICY IF EXISTS "Admins can read cash reports by operator" ON cash_reports;
DROP POLICY IF EXISTS "Admins can read all product reports" ON product_reports;
DROP POLICY IF EXISTS "Admins can read all supply reports" ON supply_reports;

-- Drop foreign key constraint from cash_reports to users
ALTER TABLE IF EXISTS cash_reports DROP CONSTRAINT IF EXISTS cash_reports_user_id_fkey;

-- Make user_id column nullable in cash_reports since we're removing the users table
ALTER TABLE IF EXISTS cash_reports ALTER COLUMN user_id DROP NOT NULL;

-- Drop the users table
DROP TABLE IF EXISTS users CASCADE;

-- Recreate policies for cash_reports without user dependencies
CREATE POLICY "Users can read own cash reports"
  ON cash_reports
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cash reports"
  ON cash_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cash reports"
  ON cash_reports
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Recreate policies for product_reports without admin dependencies
CREATE POLICY "Users can manage product reports for their cash reports"
  ON product_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cash_reports 
      WHERE id = product_reports.cash_report_id AND user_id = auth.uid()
    )
  );

-- Recreate policies for supply_reports without admin dependencies
CREATE POLICY "Users can manage supply reports for their cash reports"
  ON supply_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cash_reports 
      WHERE id = supply_reports.cash_report_id AND user_id = auth.uid()
    )
  );
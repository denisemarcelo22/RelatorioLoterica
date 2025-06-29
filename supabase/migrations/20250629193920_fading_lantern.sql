/*
  # Create Lottery System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `cpf` (text, unique)
      - `email` (text, unique)
      - `phone` (text)
      - `operator_code` (text, unique)
      - `password` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `cash_reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `operator_code` (text)
      - `report_date` (date)
      - `moeda_inicial` (decimal)
      - `bolao_inicial` (decimal)
      - `suprimento_inicial` (decimal)
      - `comissao_bolao` (decimal)
      - `venda_produtos` (decimal)
      - `total_caixa_1` (decimal)
      - `total_caixa_2` (decimal)
      - `premios_instantaneos` (decimal)
      - Various sangria fields (decimal)
      - Various pix_malote fields (decimal)
      - Various recebido_caixa fields (decimal)
      - Various vale_loteria fields (decimal)
      - Various repassado_valor fields (decimal)
      - `sangria_final` (decimal)
      - `moeda_final` (decimal)
      - `bolao_final` (decimal)
      - `resgates` (decimal)
      - `diferenca` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `product_reports`
      - `id` (uuid, primary key)
      - `cash_report_id` (uuid, foreign key)
      - `product_name` (text)
      - `unit_value` (decimal)
      - `inicial` (integer)
      - `recebi` (integer)
      - `devolvi` (integer)
      - `final` (integer)
      - `created_at` (timestamp)

    - `supply_reports`
      - `id` (uuid, primary key)
      - `cash_report_id` (uuid, foreign key)
      - `denomination` (text)
      - `quantity` (integer)
      - `unit_value` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add admin policies for viewing all data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cpf text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  operator_code text UNIQUE NOT NULL,
  password text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cash_reports table
CREATE TABLE IF NOT EXISTS cash_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  operator_code text NOT NULL,
  report_date date DEFAULT CURRENT_DATE,
  moeda_inicial decimal(10,2) DEFAULT 0.00,
  bolao_inicial decimal(10,2) DEFAULT 0.00,
  suprimento_inicial decimal(10,2) DEFAULT 0.00,
  comissao_bolao decimal(10,2) DEFAULT 0.00,
  venda_produtos decimal(10,2) DEFAULT 0.00,
  total_caixa_1 decimal(10,2) DEFAULT 0.00,
  total_caixa_2 decimal(10,2) DEFAULT 0.00,
  premios_instantaneos decimal(10,2) DEFAULT 0.00,
  sangria_corpvs_1 decimal(10,2) DEFAULT 0.00,
  sangria_corpvs_2 decimal(10,2) DEFAULT 0.00,
  sangria_corpvs_3 decimal(10,2) DEFAULT 0.00,
  sangria_corpvs_4 decimal(10,2) DEFAULT 0.00,
  sangria_corpvs_5 decimal(10,2) DEFAULT 0.00,
  sangria_cofre_1 decimal(10,2) DEFAULT 0.00,
  sangria_cofre_2 decimal(10,2) DEFAULT 0.00,
  sangria_cofre_3 decimal(10,2) DEFAULT 0.00,
  sangria_cofre_4 decimal(10,2) DEFAULT 0.00,
  sangria_cofre_5 decimal(10,2) DEFAULT 0.00,
  pix_malote_1 decimal(10,2) DEFAULT 0.00,
  pix_malote_2 decimal(10,2) DEFAULT 0.00,
  pix_malote_3 decimal(10,2) DEFAULT 0.00,
  pix_malote_4 decimal(10,2) DEFAULT 0.00,
  pix_malote_5 decimal(10,2) DEFAULT 0.00,
  recebido_caixa_1 decimal(10,2) DEFAULT 0.00,
  recebido_caixa_2 decimal(10,2) DEFAULT 0.00,
  recebido_caixa_3 decimal(10,2) DEFAULT 0.00,
  recebido_caixa_4 decimal(10,2) DEFAULT 0.00,
  recebido_caixa_5 decimal(10,2) DEFAULT 0.00,
  recebido_caixa_6 decimal(10,2) DEFAULT 0.00,
  vale_loteria_1 decimal(10,2) DEFAULT 0.00,
  vale_loteria_2 decimal(10,2) DEFAULT 0.00,
  vale_loteria_3 decimal(10,2) DEFAULT 0.00,
  vale_loteria_4 decimal(10,2) DEFAULT 0.00,
  vale_loteria_5 decimal(10,2) DEFAULT 0.00,
  repassado_valor_1 decimal(10,2) DEFAULT 0.00,
  repassado_valor_2 decimal(10,2) DEFAULT 0.00,
  repassado_valor_3 decimal(10,2) DEFAULT 0.00,
  repassado_valor_4 decimal(10,2) DEFAULT 0.00,
  repassado_valor_5 decimal(10,2) DEFAULT 0.00,
  sangria_final decimal(10,2) DEFAULT 0.00,
  moeda_final decimal(10,2) DEFAULT 0.00,
  bolao_final decimal(10,2) DEFAULT 0.00,
  resgates decimal(10,2) DEFAULT 0.00,
  diferenca decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(operator_code, report_date)
);

-- Create product_reports table
CREATE TABLE IF NOT EXISTS product_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_report_id uuid REFERENCES cash_reports(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  unit_value decimal(10,2) NOT NULL,
  inicial integer DEFAULT 0,
  recebi integer DEFAULT 0,
  devolvi integer DEFAULT 0,
  final integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create supply_reports table
CREATE TABLE IF NOT EXISTS supply_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_report_id uuid REFERENCES cash_reports(id) ON DELETE CASCADE,
  denomination text NOT NULL,
  quantity integer DEFAULT 0,
  unit_value decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create policies for cash_reports table
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

CREATE POLICY "Admins can read all cash reports"
  ON cash_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can read cash reports by operator"
  ON cash_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create policies for product_reports table
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

CREATE POLICY "Admins can read all product reports"
  ON product_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create policies for supply_reports table
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

CREATE POLICY "Admins can read all supply reports"
  ON supply_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cash_reports_user_id ON cash_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_reports_operator_code ON cash_reports(operator_code);
CREATE INDEX IF NOT EXISTS idx_cash_reports_date ON cash_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_product_reports_cash_report_id ON product_reports(cash_report_id);
CREATE INDEX IF NOT EXISTS idx_supply_reports_cash_report_id ON supply_reports(cash_report_id);

-- Insert default admin user
INSERT INTO users (name, cpf, email, phone, operator_code, password, is_admin)
VALUES (
  'Administrador',
  '000.000.000-00',
  'admin@loterica.com',
  '(11) 99999-9999',
  '01',
  'admin123',
  true
) ON CONFLICT (email) DO NOTHING;
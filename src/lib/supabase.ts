import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  user_id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cod_operador: string;
  tipo_usuario: 'admin' | 'operador';
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CashReport {
  id: string;
  user_id: string;
  operator_code: string;
  report_date: string;
  moeda_inicial: number;
  bolao_inicial: number;
  suprimento_inicial: number;
  comissao_bolao: number;
  venda_produtos: number;
  total_caixa_1: number;
  total_caixa_2: number;
  premios_instantaneos: number;
  sangria_corpvs_1: number;
  sangria_corpvs_2: number;
  sangria_corpvs_3: number;
  sangria_corpvs_4: number;
  sangria_corpvs_5: number;
  sangria_cofre_1: number;
  sangria_cofre_2: number;
  sangria_cofre_3: number;
  sangria_cofre_4: number;
  sangria_cofre_5: number;
  pix_malote_1: number;
  pix_malote_2: number;
  pix_malote_3: number;
  pix_malote_4: number;
  pix_malote_5: number;
  recebido_caixa_1: number;
  recebido_caixa_2: number;
  recebido_caixa_3: number;
  recebido_caixa_4: number;
  recebido_caixa_5: number;
  recebido_caixa_6: number;
  vale_loteria_1: number;
  vale_loteria_2: number;
  vale_loteria_3: number;
  vale_loteria_4: number;
  vale_loteria_5: number;
  repassado_valor_1: number;
  repassado_valor_2: number;
  repassado_valor_3: number;
  repassado_valor_4: number;
  repassado_valor_5: number;
  sangria_final: number;
  moeda_final: number;
  bolao_final: number;
  resgates: number;
  diferenca: number;
  created_at: string;
  updated_at: string;
}

export interface ProductReport {
  id: string;
  cash_report_id: string;
  product_name: string;
  unit_value: number;
  inicial: number;
  recebi: number;
  devolvi: number;
  final: number;
  created_at: string;
}

export interface SupplyReport {
  id: string;
  cash_report_id: string;
  denomination: string;
  quantity: number;
  unit_value: number;
  created_at: string;
}

// Auth functions
export const signUp = async (userData: {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  operator_code: string;
  password: string;
  is_admin?: boolean;
}) => {
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (authError) throw authError;

  // Then create the user profile in tb_usuario
  if (authData.user) {
    const { data, error } = await supabase
      .from('tb_usuario')
      .insert([{
        user_id: authData.user.id,
        nome: userData.name,
        cpf: userData.cpf,
        email: userData.email,
        telefone: userData.phone,
        cod_operador: userData.operator_code,
        tipo_usuario: userData.is_admin ? 'admin' : 'operador',
        ativo: true,
      }])
      .select()
      .single();

    if (error) throw error;
    return { user: data, authUser: authData.user };
  }

  throw new Error('Failed to create user');
};

export const signIn = async (email: string, password: string) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;

  // Get user profile from tb_usuario
  const { data: userData, error: userError } = await supabase
    .from('tb_usuario')
    .select('*')
    .eq('user_id', authData.user.id)
    .single();

  if (userError) throw userError;

  return { user: userData, authUser: authData.user };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Cash report functions
export const saveCashReport = async (reportData: Partial<CashReport>) => {
  const { data, error } = await supabase
    .from('cash_reports')
    .upsert(reportData, {
      onConflict: 'operator_code,report_date'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCashReport = async (operatorCode: string, date?: string) => {
  const reportDate = date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('cash_reports')
    .select('*')
    .eq('operator_code', operatorCode)
    .eq('report_date', reportDate)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Product report functions
export const saveProductReports = async (cashReportId: string, products: Partial<ProductReport>[]) => {
  // Delete existing products for this report
  await supabase
    .from('product_reports')
    .delete()
    .eq('cash_report_id', cashReportId);

  // Insert new products
  const { data, error } = await supabase
    .from('product_reports')
    .insert(products.map(product => ({
      ...product,
      cash_report_id: cashReportId
    })))
    .select();

  if (error) throw error;
  return data;
};

export const getProductReports = async (cashReportId: string) => {
  const { data, error } = await supabase
    .from('product_reports')
    .select('*')
    .eq('cash_report_id', cashReportId);

  if (error) throw error;
  return data;
};

// Supply report functions
export const saveSupplyReports = async (cashReportId: string, supplies: Partial<SupplyReport>[]) => {
  // Delete existing supplies for this report
  await supabase
    .from('supply_reports')
    .delete()
    .eq('cash_report_id', cashReportId);

  // Insert new supplies
  const { data, error } = await supabase
    .from('supply_reports')
    .insert(supplies.map(supply => ({
      ...supply,
      cash_report_id: cashReportId
    })))
    .select();

  if (error) throw error;
  return data;
};

export const getSupplyReports = async (cashReportId: string) => {
  const { data, error } = await supabase
    .from('supply_reports')
    .select('*')
    .eq('cash_report_id', cashReportId);

  if (error) throw error;
  return data;
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('tb_usuario')
    .select('*')
    .order('cod_operador');

  if (error) throw error;
  return data;
};
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on tb_usuario table structure
export interface User {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  cpf: string;
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
  cod_operador: string;
  data_fechamento: string;
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
  repassado_caixa_1: number;
  repassado_caixa_2: number;
  repassado_caixa_3: number;
  repassado_caixa_4: number;
  repassado_caixa_5: number;
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
  user_id: string;
  fechamento_id: string;
  cod_operador: string;
  nome_produto: string;
  valor_unitario: number;
  quantidade_inicial: number;
  quantidade_recebida: number;
  quantidade_devolvida: number;
  quantidade_final: number;
  valor_vendido: number;
  created_at: string;
  updated_at: string;
}

export interface SupplyReport {
  id: string;
  user_id: string;
  fechamento_id: string;
  cod_operador: string;
  denominacao: string;
  valor_unitario: number;
  quantidade: number;
  valor_total: number;
  created_at: string;
  updated_at: string;
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
  try {
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: undefined // Attempt to disable email confirmation
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user');
    }

    // Check if user is automatically signed in (session exists)
    if (authData.session) {
      // User is automatically signed in, create profile
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

      if (error) {
        console.error('Profile creation error:', error);
        // If profile creation fails, clean up the auth user
        await supabase.auth.signOut();
        throw error;
      }

      return { user: data, authUser: authData.user };
    } else {
      // User was created but not automatically signed in
      // This means email confirmation is required
      throw new Error('REGISTRATION_SUCCESS_EMAIL_CONFIRMATION_REQUIRED');
    }
  } catch (error: any) {
    console.error('SignUp error:', error);
    throw error;
  }
};

// Admin function to sign up operators
export const signUpOperator = async (userData: {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  operator_code: string;
  password: string;
  is_admin?: boolean;
}) => {
  try {
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: undefined // Attempt to disable email confirmation
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user');
    }

    // For admin-created operators, we'll create the profile regardless
    // since admins should be able to create accounts
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

    if (error) {
      console.error('Profile creation error:', error);
      throw error;
    }

    // Return success regardless of session status for admin-created accounts
    return { 
      user: data, 
      authUser: authData.user,
      requiresEmailConfirmation: !authData.session
    };
  } catch (error: any) {
    console.error('SignUpOperator error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth signin error:', authError);
      
      // Handle specific email confirmation error
      if (authError.message.includes('Email not confirmed') || authError.message.includes('email_not_confirmed')) {
        throw new Error('EMAIL_NOT_CONFIRMED');
      }
      
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user returned from authentication');
    }

    // Get user profile from tb_usuario
    const { data: userData, error: userError } = await supabase
      .from('tb_usuario')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (userError) {
      console.error('User profile fetch error:', userError);
      // If we can't find the user profile, sign them out
      await supabase.auth.signOut();
      throw new Error('User profile not found. Please contact administrator.');
    }

    return { user: userData, authUser: authData.user };
  } catch (error: any) {
    console.error('SignIn error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Cash report functions using tb_fechamento_caixa
export const saveCashReport = async (reportData: Partial<CashReport>) => {
  const { data, error } = await supabase
    .from('tb_fechamento_caixa')
    .upsert(reportData, {
      onConflict: 'user_id,data_fechamento'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCashReport = async (userId: string, date?: string) => {
  const reportDate = date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('tb_fechamento_caixa')
    .select('*')
    .eq('user_id', userId)
    .eq('data_fechamento', reportDate)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Get all cash reports (admin function)
export const getCashReports = async () => {
  const { data, error } = await supabase
    .from('tb_fechamento_caixa')
    .select('*')
    .order('data_fechamento', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Product report functions using tb_controle_jogos
export const saveProductReports = async (fechamentoId: string, products: Partial<ProductReport>[]) => {
  // Delete existing products for this report
  await supabase
    .from('tb_controle_jogos')
    .delete()
    .eq('fechamento_id', fechamentoId);

  // Insert new products
  const { data, error } = await supabase
    .from('tb_controle_jogos')
    .insert(products.map(product => ({
      ...product,
      fechamento_id: fechamentoId
    })))
    .select();

  if (error) throw error;
  return data;
};

export const getProductReports = async (fechamentoId: string) => {
  const { data, error } = await supabase
    .from('tb_controle_jogos')
    .select('*')
    .eq('fechamento_id', fechamentoId);

  if (error) throw error;
  return data;
};

// Supply report functions using tb_suprimento_cofre
export const saveSupplyReports = async (fechamentoId: string, supplies: Partial<SupplyReport>[]) => {
  // Delete existing supplies for this report
  await supabase
    .from('tb_suprimento_cofre')
    .delete()
    .eq('fechamento_id', fechamentoId);

  // Insert new supplies
  const { data, error } = await supabase
    .from('tb_suprimento_cofre')
    .insert(supplies.map(supply => ({
      ...supply,
      fechamento_id: fechamentoId
    })))
    .select();

  if (error) throw error;
  return data;
};

export const getSupplyReports = async (fechamentoId: string) => {
  const { data, error } = await supabase
    .from('tb_suprimento_cofre')
    .select('*')
    .eq('fechamento_id', fechamentoId);

  if (error) throw error;
  return data;
};

// Get all users (admin only) from tb_usuario
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('tb_usuario')
    .select('*')
    .order('cod_operador');

  if (error) throw error;
  return data;
};
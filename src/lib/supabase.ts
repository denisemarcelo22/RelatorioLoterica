import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simplified User interface using only auth.users data
export interface User {
  id: string;
  email: string;
  nome: string;
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

// Store for registered operators (in a real app, this would be in a database)
let registeredOperators: User[] = [];

// Helper function to create user profile from metadata
const createUserFromAuth = (authUser: any, metadata?: any): User => {
  const userMetadata = authUser.user_metadata || metadata || {};
  
  return {
    id: authUser.id,
    email: authUser.email,
    nome: userMetadata.nome || userMetadata.name || 'Usuário',
    cod_operador: userMetadata.cod_operador || userMetadata.operator_code || '01',
    tipo_usuario: userMetadata.tipo_usuario || userMetadata.user_type || (userMetadata.cod_operador === '01' || userMetadata.operator_code === '01' ? 'admin' : 'operador'),
    ativo: userMetadata.ativo !== false,
    created_at: authUser.created_at,
    updated_at: authUser.updated_at || authUser.created_at
  };
};

// Resend email confirmation function
export const resendEmailConfirmation = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      console.error('Resend confirmation error:', error);
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('ResendEmailConfirmation error:', error);
    throw error;
  }
};

// Auth functions using only Supabase Auth
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
    // Create the auth user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          nome: userData.name,
          cpf: userData.cpf,
          telefone: userData.phone,
          cod_operador: userData.operator_code,
          tipo_usuario: userData.is_admin ? 'admin' : 'operador',
          ativo: true
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user');
    }

    // Check if email confirmation is required
    const requiresEmailConfirmation = !authData.session;

    if (requiresEmailConfirmation) {
      // Throw a specific error that the AuthModal can catch
      throw new Error('REGISTRATION_SUCCESS_EMAIL_CONFIRMATION_REQUIRED');
    }

    // Create user object from auth data
    const user = createUserFromAuth(authData.user);

    // Add to registered operators list
    registeredOperators.push(user);

    return { user, authUser: authData.user };
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
    // Create the auth user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          nome: userData.name,
          cpf: userData.cpf,
          telefone: userData.phone,
          cod_operador: userData.operator_code,
          tipo_usuario: userData.is_admin ? 'admin' : 'operador',
          ativo: true
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create auth user');
    }

    // Create user object from auth data
    const user = createUserFromAuth(authData.user);

    // Add to registered operators list
    registeredOperators.push(user);

    return { 
      user, 
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

    // Create user object from auth data
    const user = createUserFromAuth(authData.user);

    // Add to registered operators list if not already there
    const existingOperator = registeredOperators.find(op => op.id === user.id);
    if (!existingOperator) {
      registeredOperators.push(user);
    }

    return { user, authUser: authData.user };
  } catch (error: any) {
    console.error('SignIn error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Delete user function (admin only)
export const deleteUser = async (userId: string) => {
  try {
    // Get current user to check if admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Check if current user is admin
    const currentUserProfile = createUserFromAuth(currentUser);
    if (currentUserProfile.tipo_usuario !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }

    // Remove from local registered operators list
    registeredOperators = registeredOperators.filter(op => op.id !== userId);

    return { success: true };
    
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
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
    .maybeSingle();

  if (error) throw error;
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

// Get all users from registered operators list (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    // Get current user to check if admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    // Check if current user is admin
    const currentUserProfile = createUserFromAuth(currentUser);
    if (currentUserProfile.tipo_usuario !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }

    // Ensure current user is in the list
    const existingCurrentUser = registeredOperators.find(op => op.id === currentUser.id);
    if (!existingCurrentUser) {
      registeredOperators.unshift(currentUserProfile);
    }

    // Return all registered operators
    return registeredOperators;
  } catch (error) {
    console.error('Error getting users:', error);
    
    // Fallback: return current user
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const currentUserProfile = createUserFromAuth(currentUser);
        return [currentUserProfile];
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }
    
    throw error;
  }
};
import React, { useState } from 'react';
import { X, User, Mail, Phone, Key, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { signIn, signUp, User as UserType } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    operatorCode: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const validateEmail = (email: string) => {
    // Enhanced email validation regex that matches common email standards
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Additional checks for common issues
    if (!email || email.trim() === '') return false;
    if (email.length > 254) return false; // RFC 5321 limit
    if (email.includes('..')) return false; // No consecutive dots
    if (email.startsWith('.') || email.endsWith('.')) return false; // No leading/trailing dots
    if (email.includes(' ')) return false; // No spaces
    
    return emailRegex.test(email.trim().toLowerCase());
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (activeTab === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
      if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (!formData.operatorCode.trim()) newErrors.operatorCode = 'Código Operador é obrigatório';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido. Verifique o formato do email.';
    }

    if (!formData.password.trim()) newErrors.password = 'Senha é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    setEmailConfirmationRequired(false);

    try {
      // Normalize email before sending to Supabase
      const normalizedEmail = formData.email.trim().toLowerCase();

      if (activeTab === 'login') {
        const { user } = await signIn(normalizedEmail, formData.password);
        onLogin(user);
        onClose();
        resetForm();
      } else {
        // Register
        try {
          const { user } = await signUp({
            name: formData.name,
            cpf: formData.cpf,
            email: normalizedEmail,
            phone: formData.phone,
            operator_code: formData.operatorCode,
            password: formData.password,
            is_admin: formData.operatorCode === '01'
          });

          onLogin(user);
          onClose();
          resetForm();
        } catch (registrationError: any) {
          // Handle the specific case where email confirmation is required
          if (registrationError.message === 'REGISTRATION_SUCCESS_EMAIL_CONFIRMATION_REQUIRED') {
            setEmailConfirmationRequired(true);
            setActiveTab('login');
            setSuccessMessage('Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta antes de fazer login.');
            // Clear password fields for security
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
          } else {
            throw registrationError;
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific error cases
      if (error.message === 'EMAIL_NOT_CONFIRMED') {
        setErrors({ 
          email: 'Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação antes de fazer login.' 
        });
        setEmailConfirmationRequired(true);
      } else if (error.message.includes('over_email_send_rate_limit') || error.message.includes('rate limit')) {
        setErrors({ 
          email: 'Muitas tentativas de cadastro. Aguarde alguns segundos antes de tentar novamente.' 
        });
      } else if (error.message.includes('duplicate key') || error.message.includes('already registered')) {
        setErrors({ email: 'Email ou CPF já cadastrado' });
      } else if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
        if (activeTab === 'login') {
          setErrors({ email: 'Email ou senha incorretos. Verifique suas credenciais.' });
        } else {
          setErrors({ email: 'Erro ao criar conta. Tente novamente.' });
        }
      } else if (error.message.includes('email_address_invalid') || (error.message.includes('Email address') && error.message.includes('invalid'))) {
        setErrors({ email: 'Formato de email inválido. Verifique se o email está correto.' });
      } else if (error.message.includes('Database error')) {
        setErrors({ email: 'Erro no banco de dados. Tente novamente.' });
      } else if (error.message.includes('User profile not found')) {
        setErrors({ email: 'Perfil de usuário não encontrado. Entre em contato com o administrador.' });
      } else if (error.message.includes('No user returned from authentication')) {
        setErrors({ email: 'Erro na autenticação. Tente novamente.' });
      } else if (error.message.includes('row-level security policy') || error.message.includes('RLS')) {
        setErrors({ email: 'Erro de permissão. Entre em contato com o administrador.' });
      } else {
        setErrors({ email: error.message || 'Erro ao processar solicitação' });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cpf: '',
      email: '',
      phone: '',
      operatorCode: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setSuccessMessage('');
    setEmailConfirmationRequired(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'email') {
      // Remove any leading/trailing whitespace from email
      formattedValue = value.trim();
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (successMessage) {
      setSuccessMessage('');
    }
    if (emailConfirmationRequired) {
      setEmailConfirmationRequired(false);
    }
  };

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setErrors({});
    setSuccessMessage('');
    setEmailConfirmationRequired(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {activeTab === 'login' ? 'Login' : 'Cadastro'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cadastro
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Email Confirmation Warning */}
          {emailConfirmationRequired && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-amber-700 text-sm">
                <p className="font-medium mb-1">Confirmação de email necessária</p>
                <p>Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nome completo"
                        disabled={loading}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cpf ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      disabled={loading}
                    />
                    {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                        disabled={loading}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código Operador *
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.operatorCode}
                        onChange={(e) => handleInputChange('operatorCode', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.operatorCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="01"
                        maxLength={2}
                        disabled={loading}
                      />
                    </div>
                    {errors.operatorCode && <p className="text-red-500 text-xs mt-1">{errors.operatorCode}</p>}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@exemplo.com"
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className={activeTab === 'register' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Senha"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirmar senha"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Processando...' : (activeTab === 'login' ? 'Entrar' : 'Cadastrar')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
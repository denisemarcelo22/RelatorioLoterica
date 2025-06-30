import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Calculator, 
  DollarSign, 
  Package, 
  Coins,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { 
  User as UserType, 
  saveCashReport, 
  saveProductReports, 
  saveSupplyReports,
  getCashReport,
  getProductReports,
  getSupplyReports
} from '../lib/supabase';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
}

interface CashData {
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
}

interface ProductData {
  nome_produto: string;
  valor_unitario: number;
  quantidade_inicial: number;
  quantidade_recebida: number;
  quantidade_devolvida: number;
  quantidade_final: number;
  valor_vendido: number;
}

interface SupplyData {
  denominacao: string;
  valor_unitario: number;
  quantidade: number;
  valor_total: number;
}

// Produtos predefinidos
const PREDEFINED_PRODUCTS = [
  { nome: 'TELE SENA', valor: 15.00 },
  { nome: 'TELE SENA AMARELA', valor: 10.00 },
  { nome: 'TELE SENA ROSA', valor: 5.00 },
  { nome: 'TELE SENA VERDE', valor: 5.00 },
  { nome: 'TELE SENA LILÁS', valor: 5.00 },
  { nome: 'TELE SENA VERMELHA', valor: 10.00 },
  { nome: 'FEDERAL', valor: 4.00 },
  { nome: 'FEDERAL', valor: 10.00 },
  { nome: 'TREVO DA SORTE', valor: 2.50 },
  { nome: 'SÓ O OURO', valor: 2.50 },
  { nome: 'RODA DA SORTE', valor: 5.00 },
  { nome: 'CAÇA AO TESOURO', valor: 10.00 },
  { nome: 'VIP', valor: 20.00 }
];

// Denominações predefinidas para suprimento
const PREDEFINED_DENOMINATIONS = [
  { nome: 'R$ 200,00', valor: 200.00 },
  { nome: 'R$ 100,00', valor: 100.00 },
  { nome: 'R$ 50,00', valor: 50.00 },
  { nome: 'R$ 20,00', valor: 20.00 },
  { nome: 'R$ 10,00', valor: 10.00 },
  { nome: 'R$ 5,00', valor: 5.00 },
  { nome: 'R$ 2,00', valor: 2.00 },
  { nome: 'R$ 1,00', valor: 1.00 },
  { nome: 'R$ 0,50', valor: 0.50 },
  { nome: 'R$ 0,25', valor: 0.25 },
  { nome: 'R$ 0,10', valor: 0.10 },
  { nome: 'R$ 0,05', valor: 0.05 }
];

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'cash' | 'products' | 'supplies'>('cash');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  const [cashData, setCashData] = useState<CashData>({
    moeda_inicial: 0,
    bolao_inicial: 0,
    suprimento_inicial: 0,
    comissao_bolao: 0,
    venda_produtos: 0,
    total_caixa_1: 0,
    total_caixa_2: 0,
    premios_instantaneos: 0,
    sangria_corpvs_1: 0,
    sangria_corpvs_2: 0,
    sangria_corpvs_3: 0,
    sangria_corpvs_4: 0,
    sangria_corpvs_5: 0,
    sangria_cofre_1: 0,
    sangria_cofre_2: 0,
    sangria_cofre_3: 0,
    sangria_cofre_4: 0,
    sangria_cofre_5: 0,
    pix_malote_1: 0,
    pix_malote_2: 0,
    pix_malote_3: 0,
    pix_malote_4: 0,
    pix_malote_5: 0,
    recebido_caixa_1: 0,
    recebido_caixa_2: 0,
    recebido_caixa_3: 0,
    recebido_caixa_4: 0,
    recebido_caixa_5: 0,
    recebido_caixa_6: 0,
    vale_loteria_1: 0,
    vale_loteria_2: 0,
    vale_loteria_3: 0,
    vale_loteria_4: 0,
    vale_loteria_5: 0,
    repassado_caixa_1: 0,
    repassado_caixa_2: 0,
    repassado_caixa_3: 0,
    repassado_caixa_4: 0,
    repassado_caixa_5: 0,
    sangria_final: 0,
    moeda_final: 0,
    bolao_final: 0,
    resgates: 0,
    diferenca: 0
  });

  const [products, setProducts] = useState<ProductData[]>([]);
  const [supplies, setSupplies] = useState<SupplyData[]>([]);

  // Atualizar data/hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadExistingData();
      initializePredefinedData();
    }
  }, [isOpen, user.id]);

  useEffect(() => {
    // Calcular diferença automaticamente
    const totalEntradas = cashData.moeda_inicial + cashData.bolao_inicial + cashData.suprimento_inicial + 
                          cashData.comissao_bolao + cashData.venda_produtos;
    
    const totalSaidas = cashData.premios_instantaneos + cashData.sangria_final + cashData.resgates;
    
    const totalFinal = cashData.moeda_final + cashData.bolao_final;
    
    const diferenca = totalEntradas - totalSaidas - totalFinal;
    
    setCashData(prev => ({ ...prev, diferenca }));
  }, [
    cashData.moeda_inicial, cashData.bolao_inicial, cashData.suprimento_inicial,
    cashData.comissao_bolao, cashData.venda_produtos, cashData.premios_instantaneos,
    cashData.sangria_final, cashData.moeda_final, cashData.bolao_final, cashData.resgates
  ]);

  const initializePredefinedData = () => {
    // Inicializar produtos predefinidos se não existirem
    if (products.length === 0) {
      const initialProducts = PREDEFINED_PRODUCTS.map(product => ({
        nome_produto: product.nome,
        valor_unitario: product.valor,
        quantidade_inicial: 0,
        quantidade_recebida: 0,
        quantidade_devolvida: 0,
        quantidade_final: 0,
        valor_vendido: 0
      }));
      setProducts(initialProducts);
    }

    // Inicializar denominações predefinidas se não existirem
    if (supplies.length === 0) {
      const initialSupplies = PREDEFINED_DENOMINATIONS.map(denom => ({
        denominacao: denom.nome,
        valor_unitario: denom.valor,
        quantidade: 0,
        valor_total: 0
      }));
      setSupplies(initialSupplies);
    }
  };

  const loadExistingData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Carregar dados de fechamento existentes
      const existingReport = await getCashReport(user.id, today);
      if (existingReport) {
        setCashData(existingReport);
        
        // Carregar produtos e suprimentos
        const [productsData, suppliesData] = await Promise.all([
          getProductReports(existingReport.id),
          getSupplyReports(existingReport.id)
        ]);
        
        if (productsData.length > 0) {
          setProducts(productsData);
        }
        if (suppliesData.length > 0) {
          setSupplies(suppliesData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar valor como moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para converter string de moeda para número
  const parseCurrency = (value: string): number => {
    return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  // Função para formatar input de moeda
  const formatCurrencyInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    const floatValue = parseFloat(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(floatValue || 0);
  };

  const handleCashDataChange = (field: keyof CashData, value: string) => {
    const numericValue = parseCurrency(value);
    setCashData(prev => ({ ...prev, [field]: numericValue }));
  };

  const updateProduct = (index: number, field: keyof ProductData, value: string | number) => {
    const newProducts = [...products];
    
    if (field === 'valor_unitario' && typeof value === 'string') {
      newProducts[index] = { ...newProducts[index], [field]: parseCurrency(value) };
    } else {
      newProducts[index] = { ...newProducts[index], [field]: value };
    }
    
    // Calcular valor vendido automaticamente
    const product = newProducts[index];
    const vendidos = product.quantidade_inicial + product.quantidade_recebida - product.quantidade_devolvida - product.quantidade_final;
    newProducts[index].valor_vendido = vendidos * product.valor_unitario;
    
    setProducts(newProducts);
  };

  const updateSupply = (index: number, field: keyof SupplyData, value: string | number) => {
    const newSupplies = [...supplies];
    
    if (field === 'valor_unitario' && typeof value === 'string') {
      newSupplies[index] = { ...newSupplies[index], [field]: parseCurrency(value) };
    } else {
      newSupplies[index] = { ...newSupplies[index], [field]: value };
    }
    
    // Calcular valor total automaticamente
    if (field === 'quantidade' || field === 'valor_unitario') {
      newSupplies[index].valor_total = newSupplies[index].quantidade * newSupplies[index].valor_unitario;
    }
    
    setSupplies(newSupplies);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const today = new Date().toISOString().split('T')[0];

      // Salvar dados de fechamento
      const reportData = {
        user_id: user.id,
        cod_operador: user.cod_operador,
        data_fechamento: today,
        ...cashData
      };

      const savedReport = await saveCashReport(reportData);

      // Salvar produtos se houver
      if (products.length > 0) {
        const productsToSave = products
          .filter(p => p.nome_produto.trim())
          .map(product => ({
            user_id: user.id,
            cod_operador: user.cod_operador,
            ...product
          }));
        
        if (productsToSave.length > 0) {
          await saveProductReports(savedReport.id, productsToSave);
        }
      }

      // Salvar suprimentos se houver
      if (supplies.length > 0) {
        const suppliesToSave = supplies
          .filter(s => s.denominacao.trim())
          .map(supply => ({
            user_id: user.id,
            cod_operador: user.cod_operador,
            ...supply
          }));
        
        if (suppliesToSave.length > 0) {
          await saveSupplyReports(savedReport.id, suppliesToSave);
        }
      }

      setMessage({ type: 'success', text: 'Relatório salvo com sucesso!' });
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      setMessage({ type: 'error', text: error.message || 'Erro ao salvar relatório' });
    } finally {
      setSaving(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Calcular totais
  const totalProdutos = products.reduce((sum, product) => sum + product.valor_vendido, 0);
  const totalSuprimentos = supplies.reduce((sum, supply) => sum + supply.valor_total, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center flex-1">Folhinha do Caixa</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Informações do usuário e data/hora */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Data/Hora</p>
                  <p className="text-gray-600 capitalize">{formatDateTime(currentDateTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Operador</p>
                  <p className="text-gray-600">{user.nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Código</p>
                  <p className="text-gray-600">{user.cod_operador}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 border-b ${
            message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b bg-white">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('cash')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'cash'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Folhinha do Caixa
              </div>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Controle de Produtos
              </div>
            </button>
            <button
              onClick={() => setActiveTab('supplies')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'supplies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Suprimento Cofre
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando dados...</span>
            </div>
          ) : (
            <>
              {activeTab === 'cash' && (
                <div className="space-y-6">
                  {/* Campos organizados em duas colunas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Moeda Inicial</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.moeda_inicial)}
                        onChange={(e) => handleCashDataChange('moeda_inicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Inicial</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.bolao_inicial)}
                        onChange={(e) => handleCashDataChange('bolao_inicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Suprimento Inicial</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.suprimento_inicial)}
                        onChange={(e) => handleCashDataChange('suprimento_inicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Bolão</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.comissao_bolao)}
                        onChange={(e) => handleCashDataChange('comissao_bolao', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venda Produtos</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.venda_produtos)}
                        onChange={(e) => handleCashDataChange('venda_produtos', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 1</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.total_caixa_1)}
                        onChange={(e) => handleCashDataChange('total_caixa_1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 2</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.total_caixa_2)}
                        onChange={(e) => handleCashDataChange('total_caixa_2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prêmios Instantâneos</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.premios_instantaneos)}
                        onChange={(e) => handleCashDataChange('premios_instantaneos', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>

                  {/* Sangrias CORPVS */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sangrias CORPVS</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 1</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_corpvs_1)}
                            onChange={(e) => handleCashDataChange('sangria_corpvs_1', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 2</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_corpvs_2)}
                            onChange={(e) => handleCashDataChange('sangria_corpvs_2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 3</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_corpvs_3)}
                            onChange={(e) => handleCashDataChange('sangria_corpvs_3', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 4</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_corpvs_4)}
                            onChange={(e) => handleCashDataChange('sangria_corpvs_4', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 5</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_corpvs_5)}
                            onChange={(e) => handleCashDataChange('sangria_corpvs_5', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 1</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_cofre_1)}
                            onChange={(e) => handleCashDataChange('sangria_cofre_1', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sangrias Cofre */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sangrias Cofre</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 2</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_cofre_2)}
                            onChange={(e) => handleCashDataChange('sangria_cofre_2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 3</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_cofre_3)}
                            onChange={(e) => handleCashDataChange('sangria_cofre_3', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 4</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_cofre_4)}
                            onChange={(e) => handleCashDataChange('sangria_cofre_4', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 5</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_cofre_5)}
                            onChange={(e) => handleCashDataChange('sangria_cofre_5', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pix Malote */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pix Malote</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 1</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.pix_malote_1)}
                            onChange={(e) => handleCashDataChange('pix_malote_1', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 2</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.pix_malote_2)}
                            onChange={(e) => handleCashDataChange('pix_malote_2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 3</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.pix_malote_3)}
                            onChange={(e) => handleCashDataChange('pix_malote_3', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 4</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.pix_malote_4)}
                            onChange={(e) => handleCashDataChange('pix_malote_4', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 5</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.pix_malote_5)}
                            onChange={(e) => handleCashDataChange('pix_malote_5', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 1</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.recebido_caixa_1)}
                            onChange={(e) => handleCashDataChange('recebido_caixa_1', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recebido do Caixa */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recebido do Caixa</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 2</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.recebido_caixa_2)}
                            onChange={(e) => handleCashDataChange('recebido_caixa_2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 3</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.recebido_caixa_3)}
                            onChange={(e) => handleCashDataChange('recebido_caixa_3', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 4</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.recebido_caixa_4)}
                            onChange={(e) => handleCashDataChange('recebido_caixa_4', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 5</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.recebido_caixa_5)}
                            onChange={(e) => handleCashDataChange('recebido_caixa_5', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 6</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.recebido_caixa_6)}
                            onChange={(e) => handleCashDataChange('recebido_caixa_6', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 1</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.vale_loteria_1)}
                            onChange={(e) => handleCashDataChange('vale_loteria_1', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vale Loteria */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vale Loteria</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 2</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.vale_loteria_2)}
                            onChange={(e) => handleCashDataChange('vale_loteria_2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 3</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.vale_loteria_3)}
                            onChange={(e) => handleCashDataChange('vale_loteria_3', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 4</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.vale_loteria_4)}
                            onChange={(e) => handleCashDataChange('vale_loteria_4', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 5</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.vale_loteria_5)}
                            onChange={(e) => handleCashDataChange('vale_loteria_5', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Repassado do Caixa */}
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Repassado do Caixa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor 1</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.repassado_caixa_1)}
                          onChange={(e) => handleCashDataChange('repassado_caixa_1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor 2</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.repassado_caixa_2)}
                          onChange={(e) => handleCashDataChange('repassado_caixa_2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor 3</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.repassado_caixa_3)}
                          onChange={(e) => handleCashDataChange('repassado_caixa_3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor 4</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.repassado_caixa_4)}
                          onChange={(e) => handleCashDataChange('repassado_caixa_4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor 5</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.repassado_caixa_5)}
                          onChange={(e) => handleCashDataChange('repassado_caixa_5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="R$ 0,00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Valores Finais */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores Finais</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Final</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.sangria_final)}
                            onChange={(e) => handleCashDataChange('sangria_final', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Moeda Final</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.moeda_final)}
                            onChange={(e) => handleCashDataChange('moeda_final', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Final</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.bolao_final)}
                            onChange={(e) => handleCashDataChange('bolao_final', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Resgates</label>
                          <input
                            type="text"
                            value={formatCurrency(cashData.resgates)}
                            onChange={(e) => handleCashDataChange('resgates', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diferença */}
                  <div className={`rounded-xl p-6 ${
                    cashData.diferenca >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Calculator className="w-6 h-6 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Diferença Calculada</h3>
                    </div>
                    <div className="mt-4">
                      <div className={`text-3xl font-bold ${
                        cashData.diferenca >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(cashData.diferenca)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {cashData.diferenca >= 0 ? 'Sobra' : 'Falta'} no caixa
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Controle de Produtos</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Unit.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicial</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recebi</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Devolvi</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Vendido</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.nome_produto}</td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={formatCurrency(product.valor_unitario)}
                                onChange={(e) => updateProduct(index, 'valor_unitario', e.target.value)}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={product.quantidade_inicial}
                                onChange={(e) => updateProduct(index, 'quantidade_inicial', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={product.quantidade_recebida}
                                onChange={(e) => updateProduct(index, 'quantidade_recebida', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={product.quantidade_devolvida}
                                onChange={(e) => updateProduct(index, 'quantidade_devolvida', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={product.quantidade_final}
                                onChange={(e) => updateProduct(index, 'quantidade_final', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-700">
                              {formatCurrency(product.valor_vendido)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-semibold">
                          <td colSpan={6} className="px-4 py-3 text-sm text-gray-900 text-right">Valor Total:</td>
                          <td className="px-4 py-3 text-sm font-bold text-blue-700">{formatCurrency(totalProdutos)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'supplies' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Suprimento Cofre</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Denominação</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor da Cédula/Moeda</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {supplies.map((supply, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{supply.denominacao}</td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={supply.quantidade}
                                onChange={(e) => updateSupply(index, 'quantidade', parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={formatCurrency(supply.valor_unitario)}
                                onChange={(e) => updateSupply(index, 'valor_unitario', e.target.value)}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                readOnly
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-700">
                              {formatCurrency(supply.valor_total)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-semibold">
                          <td colSpan={3} className="px-4 py-3 text-sm text-gray-900 text-right">Valor Total:</td>
                          <td className="px-4 py-3 text-sm font-bold text-blue-700">{formatCurrency(totalSuprimentos)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Relatório'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
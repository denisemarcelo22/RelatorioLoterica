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
  User,
  Key
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

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'cash' | 'products' | 'supplies'>('cash');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
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

  // Produtos predefinidos
  const [products, setProducts] = useState<ProductData[]>([
    { nome_produto: 'TELE SENA', valor_unitario: 15.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'TELE SENA AMARELA', valor_unitario: 10.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'TELE SENA ROSA', valor_unitario: 5.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'TELE SENA VERDE', valor_unitario: 5.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'TELE SENA LILÁS', valor_unitario: 5.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'TELE SENA VERMELHA', valor_unitario: 10.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'FEDERAL', valor_unitario: 4.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'FEDERAL R$10', valor_unitario: 10.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'TREVO DA SORTE', valor_unitario: 2.50, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'SÓ O OURO', valor_unitario: 2.50, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'RODA DA SORTE', valor_unitario: 5.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'CAÇA AO TESOURO', valor_unitario: 10.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 },
    { nome_produto: 'VIP', valor_unitario: 20.00, quantidade_inicial: 0, quantidade_recebida: 0, quantidade_devolvida: 0, quantidade_final: 0, valor_vendido: 0 }
  ]);

  // Suprimentos predefinidos
  const [supplies, setSupplies] = useState<SupplyData[]>([
    { denominacao: 'R$ 200,00', valor_unitario: 200.00, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 100,00', valor_unitario: 100.00, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 50,00', valor_unitario: 50.00, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 20,00', valor_unitario: 20.00, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 10,00', valor_unitario: 10.00, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 5,00', valor_unitario: 5.00, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 2,00', valor_unitario: 2.00, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 1,00', valor_unitario: 1.00, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 0,50', valor_unitario: 0.50, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 0,25', valor_unitario: 0.25, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 0,10', valor_unitario: 0.10, quantidade: 0, valor_total: 0 },
    { denominacao: 'R$ 0,05', valor_unitario: 0.05, quantidade: 0, valor_total: 0 }
  ]);

  // Atualizar horário a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadExistingData();
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

  // Recalcular valor vendido dos produtos
  useEffect(() => {
    setProducts(prev => prev.map(product => {
      const vendidos = product.quantidade_inicial + product.quantidade_recebida - product.quantidade_devolvida - product.quantidade_final;
      const valorVendido = vendidos * product.valor_unitario;
      return { ...product, valor_vendido: valorVendido };
    }));
  }, []);

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

  // Função para aplicar máscara de moeda durante a digitação
  const applyCurrencyMask = (value: string): string => {
    if (!value) return '';
    
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Converte para centavos
    const cents = parseInt(numbers);
    
    // Converte de volta para reais
    const reais = cents / 100;
    
    // Formata como moeda brasileira sem o símbolo R$
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(reais);
  };

  // Função para converter valor mascarado para número
  const parseMaskedValue = (value: string): number => {
    if (!value) return 0;
    
    // Remove pontos de milhares e substitui vírgula por ponto
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleanValue);
    
    return isNaN(parsed) ? 0 : parsed;
  };

  // Função para formatar valor de entrada com máscara
  const formatInputValue = (value: number): string => {
    if (value === 0) return '';
    return applyCurrencyMask((value * 100).toString());
  };

  const handleCashDataChange = (field: keyof CashData, value: string) => {
    const maskedValue = applyCurrencyMask(value);
    const numericValue = parseMaskedValue(maskedValue);
    setCashData(prev => ({ ...prev, [field]: numericValue }));
  };

  const updateProduct = (index: number, field: keyof ProductData, value: string | number) => {
    setProducts(prev => prev.map((product, i) => {
      if (i === index) {
        const updatedProduct = { ...product, [field]: value };
        
        // Recalcular valor vendido se mudou quantidade ou valor unitário
        if (field === 'quantidade_inicial' || field === 'quantidade_recebida' || 
            field === 'quantidade_devolvida' || field === 'quantidade_final' || field === 'valor_unitario') {
          const vendidos = updatedProduct.quantidade_inicial + updatedProduct.quantidade_recebida - 
                          updatedProduct.quantidade_devolvida - updatedProduct.quantidade_final;
          updatedProduct.valor_vendido = vendidos * updatedProduct.valor_unitario;
        }
        
        return updatedProduct;
      }
      return product;
    }));
  };

  const updateSupply = (index: number, field: keyof SupplyData, value: string | number) => {
    setSupplies(prev => prev.map((supply, i) => {
      if (i === index) {
        const updatedSupply = { ...supply, [field]: value };
        
        // Recalcular valor total
        if (field === 'quantidade' || field === 'valor_unitario') {
          updatedSupply.valor_total = updatedSupply.quantidade * updatedSupply.valor_unitario;
        }
        
        return updatedSupply;
      }
      return supply;
    }));
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calcular totais
  const totalProdutos = products.reduce((sum, product) => sum + product.valor_vendido, 0);
  const totalSuprimentos = supplies.reduce((sum, supply) => sum + supply.valor_total, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-6 flex-shrink-0">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Folhinha do Caixa</h2>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-mono font-bold text-gray-900">
                  {formatTime(currentTime)}
                </span>
              </div>
              <div className="text-sm text-gray-600 capitalize mb-3">
                {formatDate(currentTime)}
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">{user.nome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Código: {user.cod_operador}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 border-b flex-shrink-0 ${
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
        <div className="border-b bg-white flex-shrink-0">
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

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando dados...</span>
            </div>
          ) : (
            <>
              {activeTab === 'cash' && (
                <div className="space-y-6">
                  {/* Valores Iniciais */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores Iniciais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Moeda Inicial</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.moeda_inicial)}
                            onChange={(e) => handleCashDataChange('moeda_inicial', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Inicial</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.bolao_inicial)}
                            onChange={(e) => handleCashDataChange('bolao_inicial', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Suprimento Inicial</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.suprimento_inicial)}
                            onChange={(e) => handleCashDataChange('suprimento_inicial', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Bolão</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.comissao_bolao)}
                            onChange={(e) => handleCashDataChange('comissao_bolao', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vendas */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Venda Produtos</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.venda_produtos)}
                            onChange={(e) => handleCashDataChange('venda_produtos', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 1</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.total_caixa_1)}
                            onChange={(e) => handleCashDataChange('total_caixa_1', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 2</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.total_caixa_2)}
                            onChange={(e) => handleCashDataChange('total_caixa_2', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prêmios Instantâneos</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.premios_instantaneos)}
                            onChange={(e) => handleCashDataChange('premios_instantaneos', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sangrias CORPVS */}
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sangrias CORPVS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sangria Corpvs {num}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                            <input
                              type="text"
                              value={formatInputValue(cashData[`sangria_corpvs_${num}` as keyof CashData] as number)}
                              onChange={(e) => handleCashDataChange(`sangria_corpvs_${num}` as keyof CashData, e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sangrias Cofre */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sangrias Cofre</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sangria Cofre {num}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                            <input
                              type="text"
                              value={formatInputValue(cashData[`sangria_cofre_${num}` as keyof CashData] as number)}
                              onChange={(e) => handleCashDataChange(`sangria_cofre_${num}` as keyof CashData, e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PIX Malote */}
                  <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">PIX Malote</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            PIX Malote {num}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                            <input
                              type="text"
                              value={formatInputValue(cashData[`pix_malote_${num}` as keyof CashData] as number)}
                              onChange={(e) => handleCashDataChange(`pix_malote_${num}` as keyof CashData, e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recebido do Caixa */}
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recebido do Caixa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recebido do Caixa {num}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                            <input
                              type="text"
                              value={formatInputValue(cashData[`recebido_caixa_${num}` as keyof CashData] as number)}
                              onChange={(e) => handleCashDataChange(`recebido_caixa_${num}` as keyof CashData, e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vale Loteria */}
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vale Loteria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vale Loteria {num}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                            <input
                              type="text"
                              value={formatInputValue(cashData[`vale_loteria_${num}` as keyof CashData] as number)}
                              onChange={(e) => handleCashDataChange(`vale_loteria_${num}` as keyof CashData, e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Repassado do Caixa */}
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Repassado do Caixa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Repassado Valor {num}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                            <input
                              type="text"
                              value={formatInputValue(cashData[`repassado_caixa_${num}` as keyof CashData] as number)}
                              onChange={(e) => handleCashDataChange(`repassado_caixa_${num}` as keyof CashData, e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Valores Finais */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores Finais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Final</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.sangria_final)}
                            onChange={(e) => handleCashDataChange('sangria_final', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Moeda Final</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.moeda_final)}
                            onChange={(e) => handleCashDataChange('moeda_final', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Final</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.bolao_final)}
                            onChange={(e) => handleCashDataChange('bolao_final', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resgates</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                          <input
                            type="text"
                            value={formatInputValue(cashData.resgates)}
                            onChange={(e) => handleCashDataChange('resgates', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diferença */}
                  <div className={`rounded-xl p-6 border-2 ${
                    cashData.diferenca >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                  }`}>
                    <div className="flex items-center gap-3 justify-center">
                      <Calculator className="w-6 h-6 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Diferença</h3>
                    </div>
                    <div className="text-center mt-4">
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
                            <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(product.valor_unitario)}</td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={product.quantidade_inicial || ''}
                                onChange={(e) => updateProduct(index, 'quantidade_inicial', parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={product.quantidade_recebida || ''}
                                onChange={(e) => updateProduct(index, 'quantidade_recebida', parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={product.quantidade_devolvida || ''}
                                onChange={(e) => updateProduct(index, 'quantidade_devolvida', parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={product.quantidade_final || ''}
                                onChange={(e) => updateProduct(index, 'quantidade_final', parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-700">
                              {formatCurrency(product.valor_vendido)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-semibold">
                          <td colSpan={6} className="px-4 py-3 text-sm text-gray-900 text-right">Valor Total:</td>
                          <td className="px-4 py-3 text-sm font-bold text-blue-700">
                            {formatCurrency(totalProdutos)}
                          </td>
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
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Unitário</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {supplies.map((supply, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{supply.denominacao}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(supply.valor_unitario)}</td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={supply.quantidade || ''}
                                onChange={(e) => updateSupply(index, 'quantidade', parseInt(e.target.value) || 0)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-700">
                              {formatCurrency(supply.valor_total)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-semibold">
                          <td colSpan={3} className="px-4 py-3 text-sm text-gray-900 text-right">Valor Total:</td>
                          <td className="px-4 py-3 text-sm font-bold text-blue-700">
                            {formatCurrency(totalSuprimentos)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer com botões - Sempre visível */}
        <div className="border-t bg-gray-50 px-6 py-4 flex-shrink-0">
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
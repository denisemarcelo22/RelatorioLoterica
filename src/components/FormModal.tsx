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
  CheckCircle
} from 'lucide-react';
import { 
  User, 
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
  user: User;
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
        
        setProducts(productsData);
        setSupplies(suppliesData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCashDataChange = (field: keyof CashData, value: number) => {
    setCashData(prev => ({ ...prev, [field]: value }));
  };

  const addProduct = () => {
    setProducts(prev => [...prev, {
      nome_produto: '',
      valor_unitario: 0,
      quantidade_inicial: 0,
      quantidade_recebida: 0,
      quantidade_devolvida: 0,
      quantidade_final: 0,
      valor_vendido: 0
    }]);
  };

  const removeProduct = (index: number) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof ProductData, value: string | number) => {
    setProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const addSupply = () => {
    setSupplies(prev => [...prev, {
      denominacao: '',
      valor_unitario: 0,
      quantidade: 0,
      valor_total: 0
    }]);
  };

  const removeSupply = (index: number) => {
    setSupplies(prev => prev.filter((_, i) => i !== index));
  };

  const updateSupply = (index: number, field: keyof SupplyData, value: string | number) => {
    const newSupplies = [...supplies];
    newSupplies[index] = { ...newSupplies[index], [field]: value };
    
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Formulário de Fechamento de Caixa</h2>
            <p className="text-gray-600">Operador: {user.nome} - Código: {user.cod_operador}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
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
                Fechamento de Caixa
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
                Controle de Jogos ({products.length})
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
                Suprimento Cofre ({supplies.length})
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando dados...</span>
            </div>
          ) : (
            <>
              {activeTab === 'cash' && (
                <div className="space-y-8">
                  {/* Valores Iniciais */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores Iniciais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moeda Inicial
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.moeda_inicial}
                          onChange={(e) => handleCashDataChange('moeda_inicial', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bolão Inicial
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.bolao_inicial}
                          onChange={(e) => handleCashDataChange('bolao_inicial', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Suprimento Inicial
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.suprimento_inicial}
                          onChange={(e) => handleCashDataChange('suprimento_inicial', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vendas e Comissões */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas e Comissões</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comissão Bolão
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.comissao_bolao}
                          onChange={(e) => handleCashDataChange('comissao_bolao', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venda Produtos
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.venda_produtos}
                          onChange={(e) => handleCashDataChange('venda_produtos', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prêmios Instantâneos
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.premios_instantaneos}
                          onChange={(e) => handleCashDataChange('premios_instantaneos', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Caixa */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Caixa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Caixa 1
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.total_caixa_1}
                          onChange={(e) => handleCashDataChange('total_caixa_1', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Caixa 2
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.total_caixa_2}
                          onChange={(e) => handleCashDataChange('total_caixa_2', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sangrias CORPVS */}
                  <div className="bg-red-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sangrias CORPVS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sangria {num}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={cashData[`sangria_corpvs_${num}` as keyof CashData]}
                            onChange={(e) => handleCashDataChange(`sangria_corpvs_${num}` as keyof CashData, parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sangrias Cofre */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sangrias Cofre</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cofre {num}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={cashData[`sangria_cofre_${num}` as keyof CashData]}
                            onChange={(e) => handleCashDataChange(`sangria_cofre_${num}` as keyof CashData, parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Valores Finais */}
                  <div className="bg-yellow-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores Finais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sangria Final
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.sangria_final}
                          onChange={(e) => handleCashDataChange('sangria_final', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moeda Final
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.moeda_final}
                          onChange={(e) => handleCashDataChange('moeda_final', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bolão Final
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.bolao_final}
                          onChange={(e) => handleCashDataChange('bolao_final', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resgates
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={cashData.resgates}
                          onChange={(e) => handleCashDataChange('resgates', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Diferença */}
                  <div className={`rounded-xl p-6 ${
                    cashData.diferenca >= 0 ? 'bg-green-50' : 'bg-red-50'
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
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Controle de Jogos</h3>
                    <button
                      onClick={addProduct}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Produto
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum produto adicionado</p>
                      <button
                        onClick={addProduct}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Adicionar Primeiro Produto
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Produto {index + 1}</h4>
                            <button
                              onClick={() => removeProduct(index)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Produto
                              </label>
                              <input
                                type="text"
                                value={product.nome_produto}
                                onChange={(e) => updateProduct(index, 'nome_produto', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: Mega-Sena"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valor Unitário
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={product.valor_unitario}
                                onChange={(e) => updateProduct(index, 'valor_unitario', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade Inicial
                              </label>
                              <input
                                type="number"
                                value={product.quantidade_inicial}
                                onChange={(e) => updateProduct(index, 'quantidade_inicial', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade Recebida
                              </label>
                              <input
                                type="number"
                                value={product.quantidade_recebida}
                                onChange={(e) => updateProduct(index, 'quantidade_recebida', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade Devolvida
                              </label>
                              <input
                                type="number"
                                value={product.quantidade_devolvida}
                                onChange={(e) => updateProduct(index, 'quantidade_devolvida', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade Final
                              </label>
                              <input
                                type="number"
                                value={product.quantidade_final}
                                onChange={(e) => updateProduct(index, 'quantidade_final', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valor Vendido
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={product.valor_vendido}
                                onChange={(e) => updateProduct(index, 'valor_vendido', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendidos (Calculado)
                              </label>
                              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                                {product.quantidade_inicial + product.quantidade_recebida - product.quantidade_devolvida - product.quantidade_final}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'supplies' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Suprimento do Cofre</h3>
                    <button
                      onClick={addSupply}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Denominação
                    </button>
                  </div>

                  {supplies.length === 0 ? (
                    <div className="text-center py-12">
                      <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma denominação adicionada</p>
                      <button
                        onClick={addSupply}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Adicionar Primeira Denominação
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {supplies.map((supply, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Denominação {index + 1}</h4>
                            <button
                              onClick={() => removeSupply(index)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Denominação
                              </label>
                              <input
                                type="text"
                                value={supply.denominacao}
                                onChange={(e) => updateSupply(index, 'denominacao', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: R$ 50,00"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valor Unitário
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={supply.valor_unitario}
                                onChange={(e) => updateSupply(index, 'valor_unitario', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade
                              </label>
                              <input
                                type="number"
                                value={supply.quantidade}
                                onChange={(e) => updateSupply(index, 'quantidade', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valor Total
                              </label>
                              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                                {formatCurrency(supply.valor_total)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
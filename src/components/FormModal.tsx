import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, User, Calendar, Clock } from 'lucide-react';

interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  operatorCode: string;
  password: string;
  isAdmin: boolean;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

interface Product {
  name: string;
  unitValue?: number;
  inicial: number;
  recebi: number;
  devolvi: number;
  final: number;
  customValue?: number;
}

interface CashData {
  moedaInicial: string;
  bolaoInicial: string;
  suprimentoInicial: string;
  comissaoBolao: string;
  vendaProdutos: string;
  totalCaixa1: string;
  totalCaixa2: string;
  premiosInstantaneos: string;
  sangriaCorpvs1: string;
  sangriaCorpvs2: string;
  sangriaCorpvs3: string;
  sangriaCorpvs4: string;
  sangriaCorpvs5: string;
  sangriaCofre1: string;
  sangriaCofre2: string;
  sangriaCofre3: string;
  sangriaCofre4: string;
  sangriaCofre5: string;
  pixMalote1: string;
  pixMalote2: string;
  pixMalote3: string;
  pixMalote4: string;
  pixMalote5: string;
  recebidoCaixa1: string;
  recebidoCaixa2: string;
  recebidoCaixa3: string;
  recebidoCaixa4: string;
  recebidoCaixa5: string;
  recebidoCaixa6: string;
  valeLoteria1: string;
  valeLoteria2: string;
  valeLoteria3: string;
  valeLoteria4: string;
  valeLoteria5: string;
  repassadoValor1: string;
  repassadoValor2: string;
  repassadoValor3: string;
  repassadoValor4: string;
  repassadoValor5: string;
  sangriaFinal: string;
  moedaFinal: string;
  bolaoFinal: string;
  resgates: string;
  diferenca: string;
}

interface SupplyItem {
  denomination: string;
  quantity: number;
  value: number;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'cash' | 'products' | 'supply'>('cash');
  const [expandedSections, setExpandedSections] = useState({
    cash: true,
    products: false,
    supply: false
  });
  const [selectedOperator, setSelectedOperator] = useState(user.operatorCode);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [cashData, setCashData] = useState<CashData>({
    moedaInicial: '0,00',
    bolaoInicial: '0,00',
    suprimentoInicial: '0,00',
    comissaoBolao: '0,00',
    vendaProdutos: '0,00',
    totalCaixa1: '0,00',
    totalCaixa2: '0,00',
    premiosInstantaneos: '0,00',
    sangriaCorpvs1: '0,00',
    sangriaCorpvs2: '0,00',
    sangriaCorpvs3: '0,00',
    sangriaCorpvs4: '0,00',
    sangriaCorpvs5: '0,00',
    sangriaCofre1: '0,00',
    sangriaCofre2: '0,00',
    sangriaCofre3: '0,00',
    sangriaCofre4: '0,00',
    sangriaCofre5: '0,00',
    pixMalote1: '0,00',
    pixMalote2: '0,00',
    pixMalote3: '0,00',
    pixMalote4: '0,00',
    pixMalote5: '0,00',
    recebidoCaixa1: '0,00',
    recebidoCaixa2: '0,00',
    recebidoCaixa3: '0,00',
    recebidoCaixa4: '0,00',
    recebidoCaixa5: '0,00',
    recebidoCaixa6: '0,00',
    valeLoteria1: '0,00',
    valeLoteria2: '0,00',
    valeLoteria3: '0,00',
    valeLoteria4: '0,00',
    valeLoteria5: '0,00',
    repassadoValor1: '0,00',
    repassadoValor2: '0,00',
    repassadoValor3: '0,00',
    repassadoValor4: '0,00',
    repassadoValor5: '0,00',
    sangriaFinal: '0,00',
    moedaFinal: '0,00',
    bolaoFinal: '0,00',
    resgates: '0,00',
    diferenca: '0,00'
  });

  const [products, setProducts] = useState<Product[]>([
    { name: 'TELE SENA R$15,00', unitValue: 15.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA AMARELA R$10,00', unitValue: 10.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA ROSA R$5,00', unitValue: 5.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA VERDE R$5,00', unitValue: 5.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA LILÁS R$5,00', unitValue: 5.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA VERMELHA R$10,00', unitValue: 10.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'FEDERAL R$4,00', unitValue: 4.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'FEDERAL R$10,00', unitValue: 10.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TREVO DA SORTE R$2,50', unitValue: 2.50, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'SÓ O OURO R$2,50', unitValue: 2.50, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'RODA DA SORTE R$5,00', unitValue: 5.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'CAÇA AO TESOURO R$10,00', unitValue: 10.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'VIP R$20,00', unitValue: 20.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 }
  ]);

  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>([
    { denomination: 'R$200,00', quantity: 0, value: 200.00 },
    { denomination: 'R$100,00', quantity: 0, value: 100.00 },
    { denomination: 'R$50,00', quantity: 0, value: 50.00 },
    { denomination: 'R$20,00', quantity: 0, value: 20.00 },
    { denomination: 'R$10,00', quantity: 0, value: 10.00 },
    { denomination: 'R$5,00', quantity: 0, value: 5.00 },
    { denomination: 'R$2,00', quantity: 0, value: 2.00 },
    { denomination: 'R$1,00', quantity: 0, value: 1.00 },
    { denomination: 'R$0,50', quantity: 0, value: 0.50 },
    { denomination: 'R$0,25', quantity: 0, value: 0.25 },
    { denomination: 'R$0,10', quantity: 0, value: 0.10 },
    { denomination: 'R$0,05', quantity: 0, value: 0.05 }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Função para formatar valor para exibição
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar valor de string para exibição
  const formatCurrencyFromString = (value: string) => {
    const numericValue = parseFloat(value.replace(',', '.')) || 0;
    return formatCurrency(numericValue);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para aplicar máscara de moeda durante a digitação
  const applyCurrencyMask = (value: string) => {
    // Remove tudo que não é dígito
    let numericValue = value.replace(/\D/g, '');
    
    // Se não há dígitos, retorna 0,00
    if (!numericValue) return '0,00';
    
    // Converte para centavos
    const cents = parseInt(numericValue);
    
    // Converte de volta para reais
    const reais = cents / 100;
    
    // Formata com 2 casas decimais e vírgula
    return reais.toFixed(2).replace('.', ',');
  };

  // Função para converter string formatada para número
  const parseStringToNumber = (value: string) => {
    return parseFloat(value.replace(',', '.')) || 0;
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateProductValue = (product: Product) => {
    const sold = product.inicial + product.recebi - product.devolvi - product.final;
    const unitValue = product.unitValue || product.customValue || 0;
    return sold * unitValue;
  };

  const calculateTotalProducts = () => {
    return products.reduce((total, product) => total + calculateProductValue(product), 0);
  };

  const calculateSupplyTotal = () => {
    return supplyItems.reduce((total, item) => total + (item.quantity * item.value), 0);
  };

  const updateCashData = (field: keyof CashData, value: string) => {
    const maskedValue = applyCurrencyMask(value);
    setCashData(prev => ({ ...prev, [field]: maskedValue }));
  };

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    setProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: typeof value === 'string' ? parseInt(value) || 0 : value } : product
    ));
  };

  const updateSupplyItem = (index: number, field: 'quantity' | 'value', value: string) => {
    setSupplyItems(prev => prev.map((item, i) => 
      i === index ? { 
        ...item, 
        [field]: field === 'quantity' ? parseInt(value) || 0 : parseStringToNumber(value)
      } : item
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-center text-gray-900 flex-1">
              Folhinha do Caixa
            </h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDateTime(currentTime)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user.name} - Código: {selectedOperator}</span>
            </div>
          </div>

          {user.isAdmin && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <label className="text-sm font-medium text-gray-700">Operador:</label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="01">01 - Administrador</option>
                <option value="02">02 - Operador 2</option>
                <option value="03">03 - Operador 3</option>
              </select>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Expandable Sections */}
          <div className="space-y-4">
            {/* Folhinha do Caixa */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('cash')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">Folhinha do Caixa</h2>
                {expandedSections.cash ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {expandedSections.cash && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Moeda Inicial</label>
                      <input
                        type="text"
                        value={cashData.moedaInicial}
                        onChange={(e) => updateCashData('moedaInicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Inicial</label>
                      <input
                        type="text"
                        value={cashData.bolaoInicial}
                        onChange={(e) => updateCashData('bolaoInicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Suprimento Inicial</label>
                      <input
                        type="text"
                        value={cashData.suprimentoInicial}
                        onChange={(e) => updateCashData('suprimentoInicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Bolão</label>
                      <input
                        type="text"
                        value={cashData.comissaoBolao}
                        onChange={(e) => updateCashData('comissaoBolao', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venda Produtos</label>
                      <input
                        type="text"
                        value={cashData.vendaProdutos}
                        onChange={(e) => updateCashData('vendaProdutos', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 1</label>
                      <input
                        type="text"
                        value={cashData.totalCaixa1}
                        onChange={(e) => updateCashData('totalCaixa1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 2</label>
                      <input
                        type="text"
                        value={cashData.totalCaixa2}
                        onChange={(e) => updateCashData('totalCaixa2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prêmios Instantâneos</label>
                      <input
                        type="text"
                        value={cashData.premiosInstantaneos}
                        onChange={(e) => updateCashData('premiosInstantaneos', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  {/* Sangria fields */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-800 border-b pb-2">Sangrias</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 1</label>
                        <input
                          type="text"
                          value={cashData.sangriaCorpvs1}
                          onChange={(e) => updateCashData('sangriaCorpvs1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 2</label>
                        <input
                          type="text"
                          value={cashData.sangriaCorpvs2}
                          onChange={(e) => updateCashData('sangriaCorpvs2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 3</label>
                        <input
                          type="text"
                          value={cashData.sangriaCorpvs3}
                          onChange={(e) => updateCashData('sangriaCorpvs3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 4</label>
                        <input
                          type="text"
                          value={cashData.sangriaCorpvs4}
                          onChange={(e) => updateCashData('sangriaCorpvs4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 5</label>
                        <input
                          type="text"
                          value={cashData.sangriaCorpvs5}
                          onChange={(e) => updateCashData('sangriaCorpvs5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 1</label>
                        <input
                          type="text"
                          value={cashData.sangriaCofre1}
                          onChange={(e) => updateCashData('sangriaCofre1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 2</label>
                        <input
                          type="text"
                          value={cashData.sangriaCofre2}
                          onChange={(e) => updateCashData('sangriaCofre2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 3</label>
                        <input
                          type="text"
                          value={cashData.sangriaCofre3}
                          onChange={(e) => updateCashData('sangriaCofre3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 4</label>
                        <input
                          type="text"
                          value={cashData.sangriaCofre4}
                          onChange={(e) => updateCashData('sangriaCofre4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 5</label>
                        <input
                          type="text"
                          value={cashData.sangriaCofre5}
                          onChange={(e) => updateCashData('sangriaCofre5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 1</label>
                        <input
                          type="text"
                          value={cashData.pixMalote1}
                          onChange={(e) => updateCashData('pixMalote1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 2</label>
                        <input
                          type="text"
                          value={cashData.pixMalote2}
                          onChange={(e) => updateCashData('pixMalote2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 3</label>
                        <input
                          type="text"
                          value={cashData.pixMalote3}
                          onChange={(e) => updateCashData('pixMalote3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 4</label>
                        <input
                          type="text"
                          value={cashData.pixMalote4}
                          onChange={(e) => updateCashData('pixMalote4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 5</label>
                        <input
                          type="text"
                          value={cashData.pixMalote5}
                          onChange={(e) => updateCashData('pixMalote5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 1</label>
                        <input
                          type="text"
                          value={cashData.recebidoCaixa1}
                          onChange={(e) => updateCashData('recebidoCaixa1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 2</label>
                        <input
                          type="text"
                          value={cashData.recebidoCaixa2}
                          onChange={(e) => updateCashData('recebidoCaixa2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 3</label>
                        <input
                          type="text"
                          value={cashData.recebidoCaixa3}
                          onChange={(e) => updateCashData('recebidoCaixa3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 4</label>
                        <input
                          type="text"
                          value={cashData.recebidoCaixa4}
                          onChange={(e) => updateCashData('recebidoCaixa4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 5</label>
                        <input
                          type="text"
                          value={cashData.recebidoCaixa5}
                          onChange={(e) => updateCashData('recebidoCaixa5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 6</label>
                        <input
                          type="text"
                          value={cashData.recebidoCaixa6}
                          onChange={(e) => updateCashData('recebidoCaixa6', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 1</label>
                        <input
                          type="text"
                          value={cashData.valeLoteria1}
                          onChange={(e) => updateCashData('valeLoteria1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 2</label>
                        <input
                          type="text"
                          value={cashData.valeLoteria2}
                          onChange={(e) => updateCashData('valeLoteria2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 3</label>
                        <input
                          type="text"
                          value={cashData.valeLoteria3}
                          onChange={(e) => updateCashData('valeLoteria3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 4</label>
                        <input
                          type="text"
                          value={cashData.valeLoteria4}
                          onChange={(e) => updateCashData('valeLoteria4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 5</label>
                        <input
                          type="text"
                          value={cashData.valeLoteria5}
                          onChange={(e) => updateCashData('valeLoteria5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 1</label>
                        <input
                          type="text"
                          value={cashData.repassadoValor1}
                          onChange={(e) => updateCashData('repassadoValor1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 2</label>
                        <input
                          type="text"
                          value={cashData.repassadoValor2}
                          onChange={(e) => updateCashData('repassadoValor2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 3</label>
                        <input
                          type="text"
                          value={cashData.repassadoValor3}
                          onChange={(e) => updateCashData('repassadoValor3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 4</label>
                        <input
                          type="text"
                          value={cashData.repassadoValor4}
                          onChange={(e) => updateCashData('repassadoValor4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 5</label>
                        <input
                          type="text"
                          value={cashData.repassadoValor5}
                          onChange={(e) => updateCashData('repassadoValor5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Final</label>
                        <input
                          type="text"
                          value={cashData.sangriaFinal}
                          onChange={(e) => updateCashData('sangriaFinal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Moeda Final</label>
                        <input
                          type="text"
                          value={cashData.moedaFinal}
                          onChange={(e) => updateCashData('moedaFinal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Final</label>
                        <input
                          type="text"
                          value={cashData.bolaoFinal}
                          onChange={(e) => updateCashData('bolaoFinal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resgates</label>
                        <input
                          type="text"
                          value={cashData.resgates}
                          onChange={(e) => updateCashData('resgates', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diferença</label>
                        <input
                          type="text"
                          value={cashData.diferenca}
                          onChange={(e) => updateCashData('diferenca', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controle de Produtos */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('products')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">Controle de Produtos</h2>
                {expandedSections.products ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {expandedSections.products && (
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-2 text-left text-sm font-medium">Produto</th>
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Inicial</th>
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Recebi</th>
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Devolvi</th>
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Final</th>
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Valor Vendido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-2 text-sm font-medium">
                              {product.name}
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.inicial}
                                onChange={(e) => updateProduct(index, 'inicial', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.recebi}
                                onChange={(e) => updateProduct(index, 'recebi', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.devolvi}
                                onChange={(e) => updateProduct(index, 'devolvi', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.final}
                                onChange={(e) => updateProduct(index, 'final', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2 text-center text-sm font-semibold">
                              {formatCurrency(calculateProductValue(product))}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-bold">
                          <td colSpan={5} className="border border-gray-300 px-2 py-2 text-right text-sm font-bold">
                            Valor Total:
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center text-sm font-bold">
                            {formatCurrency(calculateTotalProducts())}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Suprimento Cofre */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('supply')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">Suprimento Cofre</h2>
                {expandedSections.supply ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {expandedSections.supply && (
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-2 py-2 text-left text-sm font-medium">Denominação</th>
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Quantidade</th>
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplyItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-2 text-sm font-medium">
                              {item.denomination}
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateSupplyItem(index, 'quantity', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2 text-center text-sm font-semibold">
                              {formatCurrency(item.quantity * item.value)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-bold">
                          <td colSpan={2} className="border border-gray-300 px-2 py-2 text-right text-sm font-bold">
                            Valor Total:
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center text-sm font-bold">
                            {formatCurrency(calculateSupplyTotal())}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Salvar Formulário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
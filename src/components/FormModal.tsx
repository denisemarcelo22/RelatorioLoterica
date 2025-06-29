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
  moedaInicial: number;
  bolaoInicial: number;
  suprimentoInicial: number;
  comissaoBolao: number;
  vendaProdutos: number;
  totalCaixa1: number;
  totalCaixa2: number;
  premiosInstantaneos: number;
  sangriaCorpvs1: number;
  sangriaCorpvs2: number;
  sangriaCorpvs3: number;
  sangriaCorpvs4: number;
  sangriaCorpvs5: number;
  sangriaCofre1: number;
  sangriaCofre2: number;
  sangriaCofre3: number;
  sangriaCofre4: number;
  sangriaCofre5: number;
  pixMalote1: number;
  pixMalote2: number;
  pixMalote3: number;
  pixMalote4: number;
  pixMalote5: number;
  recebidoCaixa1: number;
  recebidoCaixa2: number;
  recebidoCaixa3: number;
  recebidoCaixa4: number;
  recebidoCaixa5: number;
  recebidoCaixa6: number;
  valeLoteria1: number;
  valeLoteria2: number;
  valeLoteria3: number;
  valeLoteria4: number;
  valeLoteria5: number;
  repassadoValor1: number;
  repassadoValor2: number;
  repassadoValor3: number;
  repassadoValor4: number;
  repassadoValor5: number;
  sangriaFinal: number;
  moedaFinal: number;
  bolaoFinal: number;
  resgates: number;
  diferenca: number;
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
    moedaInicial: 0,
    bolaoInicial: 0,
    suprimentoInicial: 0,
    comissaoBolao: 0,
    vendaProdutos: 0,
    totalCaixa1: 0,
    totalCaixa2: 0,
    premiosInstantaneos: 0,
    sangriaCorpvs1: 0,
    sangriaCorpvs2: 0,
    sangriaCorpvs3: 0,
    sangriaCorpvs4: 0,
    sangriaCorpvs5: 0,
    sangriaCofre1: 0,
    sangriaCofre2: 0,
    sangriaCofre3: 0,
    sangriaCofre4: 0,
    sangriaCofre5: 0,
    pixMalote1: 0,
    pixMalote2: 0,
    pixMalote3: 0,
    pixMalote4: 0,
    pixMalote5: 0,
    recebidoCaixa1: 0,
    recebidoCaixa2: 0,
    recebidoCaixa3: 0,
    recebidoCaixa4: 0,
    recebidoCaixa5: 0,
    recebidoCaixa6: 0,
    valeLoteria1: 0,
    valeLoteria2: 0,
    valeLoteria3: 0,
    valeLoteria4: 0,
    valeLoteria5: 0,
    repassadoValor1: 0,
    repassadoValor2: 0,
    repassadoValor3: 0,
    repassadoValor4: 0,
    repassadoValor5: 0,
    sangriaFinal: 0,
    moedaFinal: 0,
    bolaoFinal: 0,
    resgates: 0,
    diferenca: 0
  });

  const [products, setProducts] = useState<Product[]>([
    { name: 'TELE SENA', unitValue: 15.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA AMARELA', inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA ROSA', inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA VERDE', inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA LILÁS', inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TELE SENA VERMELHA', inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'FEDERAL', unitValue: 4.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'FEDERAL', unitValue: 10.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'TREVO DA SORTE', unitValue: 2.50, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'SÓ O OURO', unitValue: 2.50, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'RODA DA SORTE', unitValue: 5.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'CAÇA AO TESOURO', unitValue: 10.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 },
    { name: 'VIP', unitValue: 20.00, inicial: 0, recebi: 0, devolvi: 0, final: 0 }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  const handleCurrencyInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (parseInt(numericValue) / 100).toFixed(2);
    return formattedValue.replace('.', ',');
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
    const numericValue = parseCurrency(value);
    setCashData(prev => ({ ...prev, [field]: numericValue }));
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
        [field]: field === 'quantity' ? parseInt(value) || 0 : parseCurrency(value)
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
                        value={formatCurrency(cashData.moedaInicial)}
                        onChange={(e) => updateCashData('moedaInicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Inicial</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.bolaoInicial)}
                        onChange={(e) => updateCashData('bolaoInicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Suprimento Inicial</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.suprimentoInicial)}
                        onChange={(e) => updateCashData('suprimentoInicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Bolão</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.comissaoBolao)}
                        onChange={(e) => updateCashData('comissaoBolao', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venda Produtos</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.vendaProdutos)}
                        onChange={(e) => updateCashData('vendaProdutos', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 1</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.totalCaixa1)}
                        onChange={(e) => updateCashData('totalCaixa1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Continue with more fields... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 2</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.totalCaixa2)}
                        onChange={(e) => updateCashData('totalCaixa2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prêmios Instantâneos</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.premiosInstantaneos)}
                        onChange={(e) => updateCashData('premiosInstantaneos', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          value={formatCurrency(cashData.sangriaCorpvs1)}
                          onChange={(e) => updateCashData('sangriaCorpvs1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 2</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.sangriaCorpvs2)}
                          onChange={(e) => updateCashData('sangriaCorpvs2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Final</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.sangriaFinal)}
                          onChange={(e) => updateCashData('sangriaFinal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Moeda Final</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.moedaFinal)}
                          onChange={(e) => updateCashData('moedaFinal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Final</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.bolaoFinal)}
                          onChange={(e) => updateCashData('bolaoFinal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resgates</label>
                        <input
                          type="text"
                          value={formatCurrency(cashData.resgates)}
                          onChange={(e) => updateCashData('resgates', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diferença</label>
                      <input
                        type="text"
                        value={formatCurrency(cashData.diferenca)}
                        onChange={(e) => updateCashData('diferenca', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
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
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Valor Unit.</th>
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
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.recebi}
                                onChange={(e) => updateProduct(index, 'recebi', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.devolvi}
                                onChange={(e) => updateProduct(index, 'devolvi', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.final}
                                onChange={(e) => updateProduct(index, 'final', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              {product.unitValue ? (
                                <span className="text-sm text-center block">{formatCurrency(product.unitValue)}</span>
                              ) : (
                                <input
                                  type="text"
                                  value={product.customValue ? formatCurrency(product.customValue) : ''}
                                  onChange={(e) => updateProduct(index, 'customValue', parseCurrency(e.target.value))}
                                  className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                  placeholder="R$ 0,00"
                                />
                              )}
                            </td>
                            <td className="border border-gray-300 px-2 py-2 text-center text-sm font-semibold">
                              {formatCurrency(calculateProductValue(product))}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-bold">
                          <td colSpan={6} className="border border-gray-300 px-2 py-2 text-right text-sm font-bold">
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
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Valor da Cédula/Moeda</th>
                          <th className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">Total</th>
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
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="text"
                                value={formatCurrency(item.value)}
                                onChange={(e) => updateSupplyItem(index, 'value', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2 text-center text-sm font-semibold">
                              {formatCurrency(item.quantity * item.value)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-bold">
                          <td colSpan={3} className="border border-gray-300 px-2 py-2 text-right text-sm font-bold">
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
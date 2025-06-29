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
  unitValue: number;
  inicial: number;
  recebi: number;
  devolvi: number;
  final: number;
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
  unitValue: number;
}

interface FormData {
  operatorCode: string;
  date: string;
  cashData: CashData;
  products: Product[];
  supplyItems: SupplyItem[];
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, user }) => {
  const [expandedSections, setExpandedSections] = useState({
    cash: true,
    products: false,
    supply: false
  });
  const [selectedOperator, setSelectedOperator] = useState(user.operatorCode);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulated storage for form data by operator and date
  const [formStorage, setFormStorage] = useState<Record<string, FormData>>({});

  const getStorageKey = (operatorCode: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return `${operatorCode}-${dateStr}`;
  };

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
    { denomination: 'R$200,00', quantity: 0, unitValue: 200.00 },
    { denomination: 'R$100,00', quantity: 0, unitValue: 100.00 },
    { denomination: 'R$50,00', quantity: 0, unitValue: 50.00 },
    { denomination: 'R$20,00', quantity: 0, unitValue: 20.00 },
    { denomination: 'R$10,00', quantity: 0, unitValue: 10.00 },
    { denomination: 'R$5,00', quantity: 0, unitValue: 5.00 },
    { denomination: 'R$2,00', quantity: 0, unitValue: 2.00 },
    { denomination: 'R$1,00', quantity: 0, unitValue: 1.00 },
    { denomination: 'R$0,50', quantity: 0, unitValue: 0.50 },
    { denomination: 'R$0,25', quantity: 0, unitValue: 0.25 },
    { denomination: 'R$0,10', quantity: 0, unitValue: 0.10 },
    { denomination: 'R$0,05', quantity: 0, unitValue: 0.05 }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data when operator changes
  useEffect(() => {
    const storageKey = getStorageKey(selectedOperator, currentTime);
    const savedData = formStorage[storageKey];
    
    if (savedData) {
      setCashData(savedData.cashData);
      setProducts(savedData.products);
      setSupplyItems(savedData.supplyItems);
    } else {
      // Reset to default values
      setCashData({
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
      
      setProducts([
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

      setSupplyItems([
        { denomination: 'R$200,00', quantity: 0, unitValue: 200.00 },
        { denomination: 'R$100,00', quantity: 0, unitValue: 100.00 },
        { denomination: 'R$50,00', quantity: 0, unitValue: 50.00 },
        { denomination: 'R$20,00', quantity: 0, unitValue: 20.00 },
        { denomination: 'R$10,00', quantity: 0, unitValue: 10.00 },
        { denomination: 'R$5,00', quantity: 0, unitValue: 5.00 },
        { denomination: 'R$2,00', quantity: 0, unitValue: 2.00 },
        { denomination: 'R$1,00', quantity: 0, unitValue: 1.00 },
        { denomination: 'R$0,50', quantity: 0, unitValue: 0.50 },
        { denomination: 'R$0,25', quantity: 0, unitValue: 0.25 },
        { denomination: 'R$0,10', quantity: 0, unitValue: 0.10 },
        { denomination: 'R$0,05', quantity: 0, unitValue: 0.05 }
      ]);
    }
  }, [selectedOperator, currentTime, formStorage]);

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

  const formatCurrencyInput = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Convert to number and divide by 100 to get decimal places
    const numberValue = parseInt(numericValue) / 100;
    
    // Format as currency and remove currency symbol
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseCurrencyInput = (value: string): number => {
    if (!value) return 0;
    // Remove dots and replace comma with dot, then parse
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  const handleCurrencyInputChange = (value: string, setter: (val: number) => void) => {
    const numericValue = parseCurrencyInput(value);
    setter(numericValue);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateProductValue = (product: Product) => {
    const sold = product.inicial + product.recebi - product.devolvi - product.final;
    return sold * product.unitValue;
  };

  const calculateTotalProducts = () => {
    return products.reduce((total, product) => total + calculateProductValue(product), 0);
  };

  const calculateSupplyTotal = () => {
    return supplyItems.reduce((total, item) => total + (item.quantity * item.unitValue), 0);
  };

  const updateCashData = (field: keyof CashData, value: string) => {
    const numericValue = parseCurrencyInput(value);
    setCashData(prev => ({ ...prev, [field]: numericValue }));
  };

  const updateProduct = (index: number, field: keyof Product, value: string) => {
    const numericValue = parseInt(value) || 0;
    setProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: numericValue } : product
    ));
  };

  const updateSupplyItem = (index: number, field: 'quantity', value: string) => {
    const numericValue = parseInt(value) || 0;
    setSupplyItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: numericValue } : item
    ));
  };

  const saveFormData = () => {
    const storageKey = getStorageKey(selectedOperator, currentTime);
    const formData: FormData = {
      operatorCode: selectedOperator,
      date: currentTime.toISOString().split('T')[0],
      cashData,
      products,
      supplyItems
    };
    
    setFormStorage(prev => ({
      ...prev,
      [storageKey]: formData
    }));
    
    alert('Formulário salvo com sucesso!');
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
              <label className="text-sm font-medium text-gray-700">Visualizar Operador:</label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="01">01 - Administrador</option>
                <option value="02">02 - Operador 2</option>
                <option value="03">03 - Operador 3</option>
                <option value="04">04 - Operador 4</option>
                <option value="05">05 - Operador 5</option>
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
                        value={formatCurrencyInput(cashData.moedaInicial.toString())}
                        onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, moedaInicial: val })))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Inicial</label>
                      <input
                        type="text"
                        value={formatCurrencyInput(cashData.bolaoInicial.toString())}
                        onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, bolaoInicial: val })))}
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
                        value={formatCurrencyInput(cashData.suprimentoInicial.toString())}
                        onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, suprimentoInicial: val })))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Bolão</label>
                      <input
                        type="text"
                        value={formatCurrencyInput(cashData.comissaoBolao.toString())}
                        onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, comissaoBolao: val })))}
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
                        value={formatCurrencyInput(cashData.vendaProdutos.toString())}
                        onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, vendaProdutos: val })))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 1</label>
                      <input
                        type="text"
                        value={formatCurrencyInput(cashData.totalCaixa1.toString())}
                        onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, totalCaixa1: val })))}
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
                        value={formatCurrencyInput(cashData.totalCaixa2.toString())}
                        onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, totalCaixa2: val })))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prêmios Instantâneos</label>
                      <input
                        type="text"
                        value={formatCurrencyInput(cashData.premiosInstantaneos.toString())}
                        onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, premiosInstantaneos: val })))}
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
                          value={formatCurrencyInput(cashData.sangriaCorpvs1.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCorpvs1: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 2</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCorpvs2.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCorpvs2: val })))}
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
                          value={formatCurrencyInput(cashData.sangriaCorpvs3.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCorpvs3: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 4</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCorpvs4.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCorpvs4: val })))}
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
                          value={formatCurrencyInput(cashData.sangriaCorpvs5.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCorpvs5: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 1</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCofre1.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCofre1: val })))}
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
                          value={formatCurrencyInput(cashData.sangriaCofre2.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCofre2: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 3</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCofre3.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCofre3: val })))}
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
                          value={formatCurrencyInput(cashData.sangriaCofre4.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCofre4: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 5</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCofre5.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaCofre5: val })))}
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
                          value={formatCurrencyInput(cashData.pixMalote1.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, pixMalote1: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 2</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.pixMalote2.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, pixMalote2: val })))}
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
                          value={formatCurrencyInput(cashData.pixMalote3.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, pixMalote3: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 4</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.pixMalote4.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, pixMalote4: val })))}
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
                          value={formatCurrencyInput(cashData.pixMalote5.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, pixMalote5: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 1</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.recebidoCaixa1.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, recebidoCaixa1: val })))}
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
                          value={formatCurrencyInput(cashData.recebidoCaixa2.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, recebidoCaixa2: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 3</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.recebidoCaixa3.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, recebidoCaixa3: val })))}
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
                          value={formatCurrencyInput(cashData.recebidoCaixa4.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, recebidoCaixa4: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 5</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.recebidoCaixa5.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, recebidoCaixa5: val })))}
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
                          value={formatCurrencyInput(cashData.recebidoCaixa6.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, recebidoCaixa6: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 1</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.valeLoteria1.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, valeLoteria1: val })))}
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
                          value={formatCurrencyInput(cashData.valeLoteria2.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, valeLoteria2: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 3</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.valeLoteria3.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, valeLoteria3: val })))}
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
                          value={formatCurrencyInput(cashData.valeLoteria4.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, valeLoteria4: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 5</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.valeLoteria5.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, valeLoteria5: val })))}
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
                          value={formatCurrencyInput(cashData.repassadoValor1.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, repassadoValor1: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 2</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.repassadoValor2.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, repassadoValor2: val })))}
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
                          value={formatCurrencyInput(cashData.repassadoValor3.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, repassadoValor3: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 4</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.repassadoValor4.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, repassadoValor4: val })))}
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
                          value={formatCurrencyInput(cashData.repassadoValor5.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, repassadoValor5: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Final</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaFinal.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, sangriaFinal: val })))}
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
                          value={formatCurrencyInput(cashData.moedaFinal.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, moedaFinal: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Final</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.bolaoFinal.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, bolaoFinal: val })))}
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
                          value={formatCurrencyInput(cashData.resgates.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, resgates: val })))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diferença</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.diferenca.toString())}
                          onChange={(e) => handleCurrencyInputChange(e.target.value, (val) => setCashData(prev => ({ ...prev, diferenca: val })))}
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
                              {formatCurrency(item.quantity * item.unitValue)}
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
            <button 
              onClick={saveFormData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Salvar Formulário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
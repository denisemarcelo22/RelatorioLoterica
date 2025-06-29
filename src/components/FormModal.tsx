import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, User, Calendar, Clock, Save } from 'lucide-react';
import { 
  User as UserType, 
  saveCashReport, 
  getCashReport, 
  saveProductReports, 
  getProductReports,
  saveSupplyReports,
  getSupplyReports,
  getAllUsers
} from '../lib/supabase';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
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
  const [expandedSections, setExpandedSections] = useState({
    cash: true,
    products: false,
    supply: false
  });
  const [selectedOperator, setSelectedOperator] = useState(user.operator_code);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setSaving] = useState(false);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

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

  useEffect(() => {
    if (user.is_admin) {
      loadAllUsers();
    }
  }, [user.is_admin]);

  useEffect(() => {
    if (isOpen) {
      loadExistingData();
    }
  }, [isOpen, selectedOperator]);

  const loadAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadExistingData = async () => {
    try {
      const report = await getCashReport(selectedOperator);
      if (report) {
        setCurrentReportId(report.id);
        
        // Load cash data
        setCashData({
          moedaInicial: report.moeda_inicial,
          bolaoInicial: report.bolao_inicial,
          suprimentoInicial: report.suprimento_inicial,
          comissaoBolao: report.comissao_bolao,
          vendaProdutos: report.venda_produtos,
          totalCaixa1: report.total_caixa_1,
          totalCaixa2: report.total_caixa_2,
          premiosInstantaneos: report.premios_instantaneos,
          sangriaCorpvs1: report.sangria_corpvs_1,
          sangriaCorpvs2: report.sangria_corpvs_2,
          sangriaCorpvs3: report.sangria_corpvs_3,
          sangriaCorpvs4: report.sangria_corpvs_4,
          sangriaCorpvs5: report.sangria_corpvs_5,
          sangriaCofre1: report.sangria_cofre_1,
          sangriaCofre2: report.sangria_cofre_2,
          sangriaCofre3: report.sangria_cofre_3,
          sangriaCofre4: report.sangria_cofre_4,
          sangriaCofre5: report.sangria_cofre_5,
          pixMalote1: report.pix_malote_1,
          pixMalote2: report.pix_malote_2,
          pixMalote3: report.pix_malote_3,
          pixMalote4: report.pix_malote_4,
          pixMalote5: report.pix_malote_5,
          recebidoCaixa1: report.recebido_caixa_1,
          recebidoCaixa2: report.recebido_caixa_2,
          recebidoCaixa3: report.recebido_caixa_3,
          recebidoCaixa4: report.recebido_caixa_4,
          recebidoCaixa5: report.recebido_caixa_5,
          recebidoCaixa6: report.recebido_caixa_6,
          valeLoteria1: report.vale_loteria_1,
          valeLoteria2: report.vale_loteria_2,
          valeLoteria3: report.vale_loteria_3,
          valeLoteria4: report.vale_loteria_4,
          valeLoteria5: report.vale_loteria_5,
          repassadoValor1: report.repassado_valor_1,
          repassadoValor2: report.repassado_valor_2,
          repassadoValor3: report.repassado_valor_3,
          repassadoValor4: report.repassado_valor_4,
          repassadoValor5: report.repassado_valor_5,
          sangriaFinal: report.sangria_final,
          moedaFinal: report.moeda_final,
          bolaoFinal: report.bolao_final,
          resgates: report.resgates,
          diferenca: report.diferenca
        });

        // Load product data
        const productReports = await getProductReports(report.id);
        if (productReports.length > 0) {
          setProducts(prev => prev.map(product => {
            const savedProduct = productReports.find(p => p.product_name === product.name);
            if (savedProduct) {
              return {
                ...product,
                inicial: savedProduct.inicial,
                recebi: savedProduct.recebi,
                devolvi: savedProduct.devolvi,
                final: savedProduct.final
              };
            }
            return product;
          }));
        }

        // Load supply data
        const supplyReports = await getSupplyReports(report.id);
        if (supplyReports.length > 0) {
          setSupplyItems(prev => prev.map(item => {
            const savedSupply = supplyReports.find(s => s.denomination === item.denomination);
            if (savedSupply) {
              return {
                ...item,
                quantity: savedSupply.quantity
              };
            }
            return item;
          }));
        }
      } else {
        // Reset to default values if no report exists
        resetFormData();
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
      resetFormData();
    }
  };

  const resetFormData = () => {
    setCurrentReportId(null);
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
    
    setProducts(prev => prev.map(product => ({
      ...product,
      inicial: 0,
      recebi: 0,
      devolvi: 0,
      final: 0
    })));

    setSupplyItems(prev => prev.map(item => ({
      ...item,
      quantity: 0
    })));
  };

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

  const handleCurrencyInput = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return 0;
    
    // Convert to number (cents to reais)
    return parseFloat(numericValue) / 100;
  };

  const formatCurrencyInput = (value: number) => {
    return value.toFixed(2).replace('.', ',');
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
    const numericValue = handleCurrencyInput(value);
    setCashData(prev => ({ ...prev, [field]: numericValue }));
  };

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    setProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: typeof value === 'string' ? parseInt(value) || 0 : value } : product
    ));
  };

  const updateSupplyItem = (index: number, field: 'quantity', value: string) => {
    setSupplyItems(prev => prev.map((item, i) => 
      i === index ? { 
        ...item, 
        [field]: parseInt(value) || 0
      } : item
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save cash report
      const reportData = {
        id: currentReportId,
        user_id: user.id,
        operator_code: selectedOperator,
        report_date: new Date().toISOString().split('T')[0],
        moeda_inicial: cashData.moedaInicial,
        bolao_inicial: cashData.bolaoInicial,
        suprimento_inicial: cashData.suprimentoInicial,
        comissao_bolao: cashData.comissaoBolao,
        venda_produtos: cashData.vendaProdutos,
        total_caixa_1: cashData.totalCaixa1,
        total_caixa_2: cashData.totalCaixa2,
        premios_instantaneos: cashData.premiosInstantaneos,
        sangria_corpvs_1: cashData.sangriaCorpvs1,
        sangria_corpvs_2: cashData.sangriaCorpvs2,
        sangria_corpvs_3: cashData.sangriaCorpvs3,
        sangria_corpvs_4: cashData.sangriaCorpvs4,
        sangria_corpvs_5: cashData.sangriaCorpvs5,
        sangria_cofre_1: cashData.sangriaCofre1,
        sangria_cofre_2: cashData.sangriaCofre2,
        sangria_cofre_3: cashData.sangriaCofre3,
        sangria_cofre_4: cashData.sangriaCofre4,
        sangria_cofre_5: cashData.sangriaCofre5,
        pix_malote_1: cashData.pixMalote1,
        pix_malote_2: cashData.pixMalote2,
        pix_malote_3: cashData.pixMalote3,
        pix_malote_4: cashData.pixMalote4,
        pix_malote_5: cashData.pixMalote5,
        recebido_caixa_1: cashData.recebidoCaixa1,
        recebido_caixa_2: cashData.recebidoCaixa2,
        recebido_caixa_3: cashData.recebidoCaixa3,
        recebido_caixa_4: cashData.recebidoCaixa4,
        recebido_caixa_5: cashData.recebidoCaixa5,
        recebido_caixa_6: cashData.recebidoCaixa6,
        vale_loteria_1: cashData.valeLoteria1,
        vale_loteria_2: cashData.valeLoteria2,
        vale_loteria_3: cashData.valeLoteria3,
        vale_loteria_4: cashData.valeLoteria4,
        vale_loteria_5: cashData.valeLoteria5,
        repassado_valor_1: cashData.repassadoValor1,
        repassado_valor_2: cashData.repassadoValor2,
        repassado_valor_3: cashData.repassadoValor3,
        repassado_valor_4: cashData.repassadoValor4,
        repassado_valor_5: cashData.repassadoValor5,
        sangria_final: cashData.sangriaFinal,
        moeda_final: cashData.moedaFinal,
        bolao_final: cashData.bolaoFinal,
        resgates: cashData.resgates,
        diferenca: cashData.diferenca
      };

      const savedReport = await saveCashReport(reportData);
      setCurrentReportId(savedReport.id);

      // Save product reports
      const productReports = products.map(product => ({
        product_name: product.name,
        unit_value: product.unitValue || 0,
        inicial: product.inicial,
        recebi: product.recebi,
        devolvi: product.devolvi,
        final: product.final
      }));

      await saveProductReports(savedReport.id, productReports);

      // Save supply reports
      const supplyReports = supplyItems.map(item => ({
        denomination: item.denomination,
        quantity: item.quantity,
        unit_value: item.value
      }));

      await saveSupplyReports(savedReport.id, supplyReports);

      alert('Formulário salvo com sucesso!');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Erro ao salvar formulário. Tente novamente.');
    } finally {
      setSaving(false);
    }
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

          {user.is_admin && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <label className="text-sm font-medium text-gray-700">Operador:</label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {allUsers.map(u => (
                  <option key={u.id} value={u.operator_code}>
                    {u.operator_code} - {u.name}
                  </option>
                ))}
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
                        value={formatCurrencyInput(cashData.moedaInicial)}
                        onChange={(e) => updateCashData('moedaInicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Inicial</label>
                      <input
                        type="text"
                        value={formatCurrencyInput(cashData.bolaoInicial)}
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
                        value={formatCurrencyInput(cashData.suprimentoInicial)}
                        onChange={(e) => updateCashData('suprimentoInicial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comissão Bolão</label>
                      <input
                        type="text"
                        value={formatCurrencyInput(cashData.comissaoBolao)}
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
                        value={formatCurrencyInput(cashData.vendaProdutos)}
                        onChange={(e) => updateCashData('vendaProdutos', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total em Caixa 1</label>
                      <input
                        type="text"
                        value={formatCurrencyInput(cashData.totalCaixa1)}
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
                        value={formatCurrencyInput(cashData.totalCaixa2)}
                        onChange={(e) => updateCashData('totalCaixa2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prêmios Instantâneos</label>
                      <input
                        type="text"
                        value={formatCurrencyInput(cashData.premiosInstantaneos)}
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
                          value={formatCurrencyInput(cashData.sangriaCorpvs1)}
                          onChange={(e) => updateCashData('sangriaCorpvs1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 2</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCorpvs2)}
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
                          value={formatCurrencyInput(cashData.sangriaCorpvs3)}
                          onChange={(e) => updateCashData('sangriaCorpvs3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Corpvs 4</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCorpvs4)}
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
                          value={formatCurrencyInput(cashData.sangriaCorpvs5)}
                          onChange={(e) => updateCashData('sangriaCorpvs5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 1</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCofre1)}
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
                          value={formatCurrencyInput(cashData.sangriaCofre2)}
                          onChange={(e) => updateCashData('sangriaCofre2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 3</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCofre3)}
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
                          value={formatCurrencyInput(cashData.sangriaCofre4)}
                          onChange={(e) => updateCashData('sangriaCofre4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Cofre 5</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaCofre5)}
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
                          value={formatCurrencyInput(cashData.pixMalote1)}
                          onChange={(e) => updateCashData('pixMalote1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 2</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.pixMalote2)}
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
                          value={formatCurrencyInput(cashData.pixMalote3)}
                          onChange={(e) => updateCashData('pixMalote3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pix Malote 4</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.pixMalote4)}
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
                          value={formatCurrencyInput(cashData.pixMalote5)}
                          onChange={(e) => updateCashData('pixMalote5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 1</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.recebidoCaixa1)}
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
                          value={formatCurrencyInput(cashData.recebidoCaixa2)}
                          onChange={(e) => updateCashData('recebidoCaixa2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 3</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.recebidoCaixa3)}
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
                          value={formatCurrencyInput(cashData.recebidoCaixa4)}
                          onChange={(e) => updateCashData('recebidoCaixa4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recebido do Caixa 5</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.recebidoCaixa5)}
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
                          value={formatCurrencyInput(cashData.recebidoCaixa6)}
                          onChange={(e) => updateCashData('recebidoCaixa6', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 1</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.valeLoteria1)}
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
                          value={formatCurrencyInput(cashData.valeLoteria2)}
                          onChange={(e) => updateCashData('valeLoteria2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 3</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.valeLoteria3)}
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
                          value={formatCurrencyInput(cashData.valeLoteria4)}
                          onChange={(e) => updateCashData('valeLoteria4', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vale Loteria 5</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.valeLoteria5)}
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
                          value={formatCurrencyInput(cashData.repassadoValor1)}
                          onChange={(e) => updateCashData('repassadoValor1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 2</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.repassadoValor2)}
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
                          value={formatCurrencyInput(cashData.repassadoValor3)}
                          onChange={(e) => updateCashData('repassadoValor3', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repassado Valor 4</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.repassadoValor4)}
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
                          value={formatCurrencyInput(cashData.repassadoValor5)}
                          onChange={(e) => updateCashData('repassadoValor5', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sangria Final</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.sangriaFinal)}
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
                          value={formatCurrencyInput(cashData.moedaFinal)}
                          onChange={(e) => updateCashData('moedaFinal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bolão Final</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.bolaoFinal)}
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
                          value={formatCurrencyInput(cashData.resgates)}
                          onChange={(e) => updateCashData('resgates', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diferença</label>
                        <input
                          type="text"
                          value={formatCurrencyInput(cashData.diferenca)}
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
                                value={product.inicial || ''}
                                onChange={(e) => updateProduct(index, 'inicial', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                                placeholder="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.recebi || ''}
                                onChange={(e) => updateProduct(index, 'recebi', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                                placeholder="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.devolvi || ''}
                                onChange={(e) => updateProduct(index, 'devolvi', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                                placeholder="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 py-2">
                              <input
                                type="number"
                                value={product.final || ''}
                                onChange={(e) => updateProduct(index, 'final', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                                placeholder="0"
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
                                value={item.quantity || ''}
                                onChange={(e) => updateSupplyItem(index, 'quantity', e.target.value)}
                                className="w-full px-2 py-1 text-center border-0 focus:ring-1 focus:ring-blue-500 text-sm"
                                min="0"
                                placeholder="0"
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
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Formulário'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
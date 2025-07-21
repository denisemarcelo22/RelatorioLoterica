import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, DollarSign, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../lib/supabase';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

interface FormData {
  // Valores iniciais
  moeda_inicial: string;
  bolao_inicial: string;
  suprimento_inicial: string;
  
  // Vendas e comissões
  comissao_bolao: string;
  venda_produtos: string;
  
  // Totais de caixa
  total_caixa_1: string;
  total_caixa_2: string;
  
  // Prêmios
  premios_instantaneos: string;
  
  // Sangrias CORPVS
  sangria_corpvs_1: string;
  sangria_corpvs_2: string;
  sangria_corpvs_3: string;
  sangria_corpvs_4: string;
  sangria_corpvs_5: string;
  
  // Sangrias Cofre
  sangria_cofre_1: string;
  sangria_cofre_2: string;
  sangria_cofre_3: string;
  sangria_cofre_4: string;
  sangria_cofre_5: string;
  
  // PIX Malote
  pix_malote_1: string;
  pix_malote_2: string;
  pix_malote_3: string;
  pix_malote_4: string;
  pix_malote_5: string;
  
  // Recebido Caixa
  recebido_caixa_1: string;
  recebido_caixa_2: string;
  recebido_caixa_3: string;
  recebido_caixa_4: string;
  recebido_caixa_5: string;
  recebido_caixa_6: string;
  
  // Vale Loteria
  vale_loteria_1: string;
  vale_loteria_2: string;
  vale_loteria_3: string;
  vale_loteria_4: string;
  vale_loteria_5: string;
  
  // Repassado Caixa
  repassado_caixa_1: string;
  repassado_caixa_2: string;
  repassado_caixa_3: string;
  repassado_caixa_4: string;
  repassado_caixa_5: string;
  
  // Valores finais
  sangria_final: string;
  moeda_final: string;
  bolao_final: string;
  resgates: string;
  diferenca: string;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'cash' | 'supply' | 'products'>('cash');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    moeda_inicial: '0',
    bolao_inicial: '0',
    suprimento_inicial: '0',
    comissao_bolao: '0',
    venda_produtos: '0',
    total_caixa_1: '0',
    total_caixa_2: '0',
    premios_instantaneos: '0',
    sangria_corpvs_1: '0',
    sangria_corpvs_2: '0',
    sangria_corpvs_3: '0',
    sangria_corpvs_4: '0',
    sangria_corpvs_5: '0',
    sangria_cofre_1: '0',
    sangria_cofre_2: '0',
    sangria_cofre_3: '0',
    sangria_cofre_4: '0',
    sangria_cofre_5: '0',
    pix_malote_1: '0',
    pix_malote_2: '0',
    pix_malote_3: '0',
    pix_malote_4: '0',
    pix_malote_5: '0',
    recebido_caixa_1: '0',
    recebido_caixa_2: '0',
    recebido_caixa_3: '0',
    recebido_caixa_4: '0',
    recebido_caixa_5: '0',
    recebido_caixa_6: '0',
    vale_loteria_1: '0',
    vale_loteria_2: '0',
    vale_loteria_3: '0',
    vale_loteria_4: '0',
    vale_loteria_5: '0',
    repassado_caixa_1: '0',
    repassado_caixa_2: '0',
    repassado_caixa_3: '0',
    repassado_caixa_4: '0',
    repassado_caixa_5: '0',
    sangria_final: '0',
    moeda_final: '0',
    bolao_final: '0',
    resgates: '0',
    diferenca: '0'
  });

  // Suprimento data
  const [supplyData, setSupplyData] = useState({
    'R$200': '0',
    'R$100': '0',
    'R$50': '0',
    'R$20': '0',
    'R$10': '0',
    'R$5': '0',
    'R$2': '0',
    'R$1': '0',
    'R$0,50': '0',
    'R$0,25': '0',
    'R$0,10': '0',
    'R$0,05': '0',
  });

  // Product data
  const [productData, setProductData] = useState({
    telesena_verde: '0',
    rodada_da_sorte: '0',
    federal_10: '0',
    telesena_lilas: '0',
    trio: '0',
    trevo_sorte: '0',
    federal: '0',
    telesena: '0',
    caca_tesouro: '0',
    so_ouro: '0',
    telesena_rosa: '0',
    telesena_amarela: '0',
    telesena_vermelha: '0',
    qtd_inicial: '0',
    qtd_recebida: '0',
    qtd_devolvida: '0',
    qtd_final: '0',
    vlr_vendido: '0'
  });

  useEffect(() => {
    if (isOpen) {
      loadExistingData();
    }
  }, [isOpen, user.id]);

  const loadExistingData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Load cash report
      const { data: cashReport } = await supabase
        .from('cash_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('report_date', today)
        .maybeSingle();

      if (cashReport) {
        const newFormData: FormData = {
          moeda_inicial: cashReport.moeda_inicial?.toString() || '0',
          bolao_inicial: cashReport.bolao_inicial?.toString() || '0',
          suprimento_inicial: cashReport.suprimento_inicial?.toString() || '0',
          comissao_bolao: cashReport.comissao_bolao?.toString() || '0',
          venda_produtos: cashReport.venda_produtos?.toString() || '0',
          total_caixa_1: cashReport.total_caixa_1?.toString() || '0',
          total_caixa_2: cashReport.total_caixa_2?.toString() || '0',
          premios_instantaneos: cashReport.premios_instantaneos?.toString() || '0',
          sangria_corpvs_1: cashReport.sangria_corpvs_1?.toString() || '0',
          sangria_corpvs_2: cashReport.sangria_corpvs_2?.toString() || '0',
          sangria_corpvs_3: cashReport.sangria_corpvs_3?.toString() || '0',
          sangria_corpvs_4: cashReport.sangria_corpvs_4?.toString() || '0',
          sangria_corpvs_5: cashReport.sangria_corpvs_5?.toString() || '0',
          sangria_cofre_1: cashReport.sangria_cofre_1?.toString() || '0',
          sangria_cofre_2: cashReport.sangria_cofre_2?.toString() || '0',
          sangria_cofre_3: cashReport.sangria_cofre_3?.toString() || '0',
          sangria_cofre_4: cashReport.sangria_cofre_4?.toString() || '0',
          sangria_cofre_5: cashReport.sangria_cofre_5?.toString() || '0',
          pix_malote_1: cashReport.pix_malote_1?.toString() || '0',
          pix_malote_2: cashReport.pix_malote_2?.toString() || '0',
          pix_malote_3: cashReport.pix_malote_3?.toString() || '0',
          pix_malote_4: cashReport.pix_malote_4?.toString() || '0',
          pix_malote_5: cashReport.pix_malote_5?.toString() || '0',
          recebido_caixa_1: cashReport.recebido_caixa_1?.toString() || '0',
          recebido_caixa_2: cashReport.recebido_caixa_2?.toString() || '0',
          recebido_caixa_3: cashReport.recebido_caixa_3?.toString() || '0',
          recebido_caixa_4: cashReport.recebido_caixa_4?.toString() || '0',
          recebido_caixa_5: cashReport.recebido_caixa_5?.toString() || '0',
          recebido_caixa_6: cashReport.recebido_caixa_6?.toString() || '0',
          vale_loteria_1: cashReport.vale_loteria_1?.toString() || '0',
          vale_loteria_2: cashReport.vale_loteria_2?.toString() || '0',
          vale_loteria_3: cashReport.vale_loteria_3?.toString() || '0',
          vale_loteria_4: cashReport.vale_loteria_4?.toString() || '0',
          vale_loteria_5: cashReport.vale_loteria_5?.toString() || '0',
          repassado_caixa_1: cashReport.repassado_valor_1?.toString() || '0',
          repassado_caixa_2: cashReport.repassado_valor_2?.toString() || '0',
          repassado_caixa_3: cashReport.repassado_valor_3?.toString() || '0',
          repassado_caixa_4: cashReport.repassado_valor_4?.toString() || '0',
          repassado_caixa_5: cashReport.repassado_valor_5?.toString() || '0',
          sangria_final: cashReport.sangria_final?.toString() || '0',
          moeda_final: cashReport.moeda_final?.toString() || '0',
          bolao_final: cashReport.bolao_final?.toString() || '0',
          resgates: cashReport.resgates?.toString() || '0',
          diferenca: cashReport.diferenca?.toString() || '0'
        };
        setFormData(newFormData);

        // Load supply data
        const { data: supplyReports } = await supabase
          .from('supply_reports')
          .select('*')
          .eq('cash_report_id', cashReport.id);

        if (supplyReports && supplyReports.length > 0) {
          const newSupplyData = { ...supplyData };
          supplyReports.forEach(supply => {
            if (supply.denomination in newSupplyData) {
              newSupplyData[supply.denomination as keyof typeof newSupplyData] = supply.quantity?.toString() || '0';
            }
          });
          setSupplyData(newSupplyData);
        }

        // Load product data
        const { data: productReports } = await supabase
          .from('product_reports')
          .select('*')
          .eq('cash_report_id', cashReport.id);

        if (productReports && productReports.length > 0) {
          const newProductData = { ...productData };
          productReports.forEach(product => {
            if (product.product_name in newProductData) {
              newProductData[product.product_name as keyof typeof newProductData] = product.inicial?.toString() || '0';
            }
          });
          // Set totals
          newProductData.qtd_inicial = productReports.reduce((sum, p) => sum + (p.inicial || 0), 0).toString();
          newProductData.qtd_recebida = productReports.reduce((sum, p) => sum + (p.recebi || 0), 0).toString();
          newProductData.qtd_devolvida = productReports.reduce((sum, p) => sum + (p.devolvi || 0), 0).toString();
          newProductData.qtd_final = productReports.reduce((sum, p) => sum + (p.final || 0), 0).toString();
          setProductData(newProductData);
        }
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseValue = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    // Replace comma with dot and parse
    const cleanValue = value.replace(',', '.');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSupplyChange = (denomination: string, value: string) => {
    setSupplyData(prev => ({
      ...prev,
      [denomination]: value
    }));
  };

  const handleProductChange = (product: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [product]: value
    }));
  };

  const calculateSupplyTotal = () => {
    const values = {
      'R$200': 200,
      'R$100': 100,
      'R$50': 50,
      'R$20': 20,
      'R$10': 10,
      'R$5': 5,
      'R$2': 2,
      'R$1': 1,
      'R$0,50': 0.5,
      'R$0,25': 0.25,
      'R$0,10': 0.1,
      'R$0,05': 0.05,
    };

    return Object.entries(supplyData).reduce((total, [denom, qty]) => {
      return total + (parseValue(qty) * values[denom as keyof typeof values]);
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return Object.values(supplyData).reduce((total, qty) => total + parseValue(qty), 0);
  };

  const calculateDifference = () => {
    const totalEntradas = parseValue(formData.moeda_inicial) + 
                         parseValue(formData.bolao_inicial) + 
                         parseValue(formData.suprimento_inicial) +
                         parseValue(formData.comissao_bolao) + 
                         parseValue(formData.venda_produtos);

    const totalSaidas = parseValue(formData.premios_instantaneos) +
                       parseValue(formData.sangria_corpvs_1) + parseValue(formData.sangria_corpvs_2) + 
                       parseValue(formData.sangria_corpvs_3) + parseValue(formData.sangria_corpvs_4) + 
                       parseValue(formData.sangria_corpvs_5) +
                       parseValue(formData.sangria_cofre_1) + parseValue(formData.sangria_cofre_2) + 
                       parseValue(formData.sangria_cofre_3) + parseValue(formData.sangria_cofre_4) + 
                       parseValue(formData.sangria_cofre_5) +
                       parseValue(formData.resgates);

    const totalFinal = parseValue(formData.moeda_final) + parseValue(formData.bolao_final);
    
    return totalEntradas - totalSaidas - totalFinal;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const today = new Date().toISOString().split('T')[0];

      // Calculate difference
      const diferenca = calculateDifference();

      // Prepare cash report data
      const cashReportData = {
        user_id: user.id,
        operator_code: user.cod_operador,
        report_date: today,
        moeda_inicial: parseValue(formData.moeda_inicial),
        bolao_inicial: parseValue(formData.bolao_inicial),
        suprimento_inicial: parseValue(formData.suprimento_inicial),
        comissao_bolao: parseValue(formData.comissao_bolao),
        venda_produtos: parseValue(formData.venda_produtos),
        total_caixa_1: parseValue(formData.total_caixa_1),
        total_caixa_2: parseValue(formData.total_caixa_2),
        premios_instantaneos: parseValue(formData.premios_instantaneos),
        sangria_corpvs_1: parseValue(formData.sangria_corpvs_1),
        sangria_corpvs_2: parseValue(formData.sangria_corpvs_2),
        sangria_corpvs_3: parseValue(formData.sangria_corpvs_3),
        sangria_corpvs_4: parseValue(formData.sangria_corpvs_4),
        sangria_corpvs_5: parseValue(formData.sangria_corpvs_5),
        sangria_cofre_1: parseValue(formData.sangria_cofre_1),
        sangria_cofre_2: parseValue(formData.sangria_cofre_2),
        sangria_cofre_3: parseValue(formData.sangria_cofre_3),
        sangria_cofre_4: parseValue(formData.sangria_cofre_4),
        sangria_cofre_5: parseValue(formData.sangria_cofre_5),
        pix_malote_1: parseValue(formData.pix_malote_1),
        pix_malote_2: parseValue(formData.pix_malote_2),
        pix_malote_3: parseValue(formData.pix_malote_3),
        pix_malote_4: parseValue(formData.pix_malote_4),
        pix_malote_5: parseValue(formData.pix_malote_5),
        recebido_caixa_1: parseValue(formData.recebido_caixa_1),
        recebido_caixa_2: parseValue(formData.recebido_caixa_2),
        recebido_caixa_3: parseValue(formData.recebido_caixa_3),
        recebido_caixa_4: parseValue(formData.recebido_caixa_4),
        recebido_caixa_5: parseValue(formData.recebido_caixa_5),
        recebido_caixa_6: parseValue(formData.recebido_caixa_6),
        vale_loteria_1: parseValue(formData.vale_loteria_1),
        vale_loteria_2: parseValue(formData.vale_loteria_2),
        vale_loteria_3: parseValue(formData.vale_loteria_3),
        vale_loteria_4: parseValue(formData.vale_loteria_4),
        vale_loteria_5: parseValue(formData.vale_loteria_5),
        repassado_valor_1: parseValue(formData.repassado_caixa_1),
        repassado_valor_2: parseValue(formData.repassado_caixa_2),
        repassado_valor_3: parseValue(formData.repassado_caixa_3),
        repassado_valor_4: parseValue(formData.repassado_caixa_4),
        repassado_valor_5: parseValue(formData.repassado_caixa_5),
        sangria_final: parseValue(formData.sangria_final),
        moeda_final: parseValue(formData.moeda_final),
        bolao_final: parseValue(formData.bolao_final),
        resgates: parseValue(formData.resgates),
        diferenca: diferenca
      };

      // Save cash report
      const { data: savedReport, error: cashError } = await supabase
        .from('cash_reports')
        .upsert(cashReportData, {
          onConflict: 'operator_code,report_date'
        })
        .select()
        .single();

      if (cashError) throw cashError;

      // Save supply data
      const supplyRecords = Object.entries(supplyData).map(([denomination, quantity]) => ({
        cash_report_id: savedReport.id,
        denomination,
        quantity: parseValue(quantity),
        unit_value: {
          'R$200': 200, 'R$100': 100, 'R$50': 50, 'R$20': 20, 'R$10': 10, 'R$5': 5,
          'R$2': 2, 'R$1': 1, 'R$0,50': 0.5, 'R$0,25': 0.25, 'R$0,10': 0.1, 'R$0,05': 0.05
        }[denomination] || 0
      }));

      // Delete existing supply records
      await supabase
        .from('supply_reports')
        .delete()
        .eq('cash_report_id', savedReport.id);

      // Insert new supply records
      if (supplyRecords.some(record => record.quantity > 0)) {
        const { error: supplyError } = await supabase
          .from('supply_reports')
          .insert(supplyRecords.filter(record => record.quantity > 0));

        if (supplyError) throw supplyError;
      }

      // Save product data
      const productRecords = Object.entries(productData).filter(([key]) => 
        !['qtd_inicial', 'qtd_recebida', 'qtd_devolvida', 'qtd_final', 'vlr_vendido'].includes(key)
      ).map(([productName, quantity]) => ({
        cash_report_id: savedReport.id,
        product_name: productName,
        unit_value: 5.00, // Default unit value
        inicial: parseValue(quantity),
        recebi: 0,
        devolvi: 0,
        final: parseValue(quantity)
      }));

      // Delete existing product records
      await supabase
        .from('product_reports')
        .delete()
        .eq('cash_report_id', savedReport.id);

      // Insert new product records
      if (productRecords.some(record => record.inicial > 0)) {
        const { error: productError } = await supabase
          .from('product_reports')
          .insert(productRecords.filter(record => record.inicial > 0));

        if (productError) throw productError;
      }

      alert('Relatório salvo com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('Error saving report:', error);
      alert('Erro ao salvar relatório: ' + (error.message || 'Erro desconhecido'));
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Formulário de Fechamento de Caixa
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('cash')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'cash'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Fechamento de Caixa
            </div>
          </button>
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'supply'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Suprimento Cofre
            </div>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Controle de Jogos
            </div>
          </button>
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
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Valores Iniciais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moeda Inicial
                        </label>
                        <input
                          type="text"
                          value={formData.moeda_inicial}
                          onChange={(e) => handleInputChange('moeda_inicial', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bolão Inicial
                        </label>
                        <input
                          type="text"
                          value={formData.bolao_inicial}
                          onChange={(e) => handleInputChange('bolao_inicial', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Suprimento Inicial
                        </label>
                        <input
                          type="text"
                          value={formData.suprimento_inicial}
                          onChange={(e) => handleInputChange('suprimento_inicial', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vendas e Comissões */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vendas e Comissões</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comissão Bolão
                        </label>
                        <input
                          type="text"
                          value={formData.comissao_bolao}
                          onChange={(e) => handleInputChange('comissao_bolao', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venda Produtos
                        </label>
                        <input
                          type="text"
                          value={formData.venda_produtos}
                          onChange={(e) => handleInputChange('venda_produtos', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Totais de Caixa */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Totais de Caixa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Caixa 1
                        </label>
                        <input
                          type="text"
                          value={formData.total_caixa_1}
                          onChange={(e) => handleInputChange('total_caixa_1', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Caixa 2
                        </label>
                        <input
                          type="text"
                          value={formData.total_caixa_2}
                          onChange={(e) => handleInputChange('total_caixa_2', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prêmios Instantâneos
                        </label>
                        <input
                          type="text"
                          value={formData.premios_instantaneos}
                          onChange={(e) => handleInputChange('premios_instantaneos', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sangrias CORPVS */}
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sangrias CORPVS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sangria CORPVS {num}
                          </label>
                          <input
                            type="text"
                            value={formData[`sangria_corpvs_${num}` as keyof FormData]}
                            onChange={(e) => handleInputChange(`sangria_corpvs_${num}` as keyof FormData, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0,00"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sangrias Cofre */}
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sangrias Cofre</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sangria Cofre {num}
                          </label>
                          <input
                            type="text"
                            value={formData[`sangria_cofre_${num}` as keyof FormData]}
                            onChange={(e) => handleInputChange(`sangria_cofre_${num}` as keyof FormData, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0,00"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Valores Finais */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Valores Finais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sangria Final
                        </label>
                        <input
                          type="text"
                          value={formData.sangria_final}
                          onChange={(e) => handleInputChange('sangria_final', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moeda Final
                        </label>
                        <input
                          type="text"
                          value={formData.moeda_final}
                          onChange={(e) => handleInputChange('moeda_final', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bolão Final
                        </label>
                        <input
                          type="text"
                          value={formData.bolao_final}
                          onChange={(e) => handleInputChange('bolao_final', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resgates
                        </label>
                        <input
                          type="text"
                          value={formData.resgates}
                          onChange={(e) => handleInputChange('resgates', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Diferença Calculada */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Diferença Calculada:</span>
                      <span className={`text-lg font-bold ${
                        calculateDifference() >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(calculateDifference())}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'supply' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Denominações do Cofre</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(supplyData).map(([denomination, quantity]) => (
                      <div key={denomination} className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {denomination}
                        </label>
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => handleSupplyChange(denomination, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Quantidade Total:</span>
                      <span className="text-lg font-bold text-blue-600">{calculateTotalQuantity()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-gray-900">Valor Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(calculateSupplyTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Produtos de Loteria</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(productData).filter(([key]) => 
                      !['qtd_inicial', 'qtd_recebida', 'qtd_devolvida', 'qtd_final', 'vlr_vendido'].includes(key)
                    ).map(([product, quantity]) => (
                      <div key={product} className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {product.replace(/_/g, ' ')}
                        </label>
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => handleProductChange(product, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <span className="block text-sm text-gray-600">Qtd. Inicial</span>
                        <span className="text-lg font-bold text-gray-900">
                          {Object.entries(productData).filter(([key]) => 
                            !['qtd_inicial', 'qtd_recebida', 'qtd_devolvida', 'qtd_final', 'vlr_vendido'].includes(key)
                          ).reduce((sum, [, qty]) => sum + parseValue(qty), 0)}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="block text-sm text-gray-600">Qtd. Recebida</span>
                        <span className="text-lg font-bold text-green-600">0</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-sm text-gray-600">Qtd. Devolvida</span>
                        <span className="text-lg font-bold text-red-600">0</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-sm text-gray-600">Qtd. Final</span>
                        <span className="text-lg font-bold text-blue-600">
                          {Object.entries(productData).filter(([key]) => 
                            !['qtd_inicial', 'qtd_recebida', 'qtd_devolvida', 'qtd_final', 'vlr_vendido'].includes(key)
                          ).reduce((sum, [, qty]) => sum + parseValue(qty), 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Relatório'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
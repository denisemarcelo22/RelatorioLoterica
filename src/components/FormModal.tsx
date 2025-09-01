import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, DollarSign, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../lib/supabase';

// Utility function to format currency input with mask
const formatCurrencyInput = (value: string): string => {
  // Remove all non-numeric characters
  const cleanValue = value.replace(/\D/g, '');
  
  if (!cleanValue) return '';
  
  // Convert to number and format
  const numericValue = parseInt(cleanValue) / 100;
  
  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Utility function to parse currency value
const parseCurrencyValue = (value: string): number => {
  if (!value || value.trim() === '') return 0;
  // Remove currency formatting and convert to number
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};

// Currency input component with mask
interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "0,00", 
  disabled = false,
  className = ""
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value);
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onChange(displayValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (isFocused) {
      // Apply currency mask while typing
      const formatted = formatCurrencyInput(inputValue);
      setDisplayValue(formatted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow manual input without mask when user types specific keys
    if (e.ctrlKey && e.key === 'a') {
      // Allow select all
      return;
    }
    
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' || e.key === 'Enter') {
      return;
    }
    
    // Allow numbers, comma, and dot
    if (!/[\d,.]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

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
    moeda_inicial: '0,00',
    bolao_inicial: '0,00',
    suprimento_inicial: '0,00',
    comissao_bolao: '0,00',
    venda_produtos: '0,00',
    total_caixa_1: '0,00',
    total_caixa_2: '0,00',
    premios_instantaneos: '0,00',
    sangria_corpvs_1: '0,00',
    sangria_corpvs_2: '0,00',
    sangria_corpvs_3: '0,00',
    sangria_corpvs_4: '0,00',
    sangria_corpvs_5: '0,00',
    sangria_cofre_1: '0,00',
    sangria_cofre_2: '0,00',
    sangria_cofre_3: '0,00',
    sangria_cofre_4: '0,00',
    sangria_cofre_5: '0,00',
    pix_malote_1: '0,00',
    pix_malote_2: '0,00',
    pix_malote_3: '0,00',
    pix_malote_4: '0,00',
    pix_malote_5: '0,00',
    recebido_caixa_1: '0,00',
    recebido_caixa_2: '0,00',
    recebido_caixa_3: '0,00',
    recebido_caixa_4: '0,00',
    recebido_caixa_5: '0,00',
    recebido_caixa_6: '0,00',
    vale_loteria_1: '0,00',
    vale_loteria_2: '0,00',
    vale_loteria_3: '0,00',
    vale_loteria_4: '0,00',
    vale_loteria_5: '0,00',
    repassado_caixa_1: '0,00',
    repassado_caixa_2: '0,00',
    repassado_caixa_3: '0,00',
    repassado_caixa_4: '0,00',
    repassado_caixa_5: '0,00',
    sangria_final: '0,00',
    moeda_final: '0,00',
    bolao_final: '0,00',
    resgates: '0,00',
    diferenca: '0,00'
  });

  // Suprimento data - Updated structure
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

  // Product data - Updated structure based on new schema
  const [productData, setProductData] = useState({
    quantidade_tele_sena_verde: '0',
    quantidade_roda_da_sorte: '0',
    quantidade_federal_10: '0',
    quantidade_tele_sena_lilas: '0',
    quantidade_trio: '0',
    quantidade_trevo_da_sorte: '0',
    quantidade_federal: '0',
    quantidade_tele_sena: '0',
    quantidade_caca_ao_tesouro: '0',
    quantidade_so_o_ouro: '0',
    quantidade_tele_sena_rosa: '0',
    quantidade_tele_sena_amarela: '0',
    quantidade_tele_sena_vermelha: '0'
  });

  // Product values (fixed values from schema)
  const productValues = {
    quantidade_tele_sena_verde: 5.00,
    quantidade_roda_da_sorte: 5.00,
    quantidade_federal_10: 10.00,
    quantidade_tele_sena_lilas: 5.00,
    quantidade_trio: 20.00,
    quantidade_trevo_da_sorte: 2.50,
    quantidade_federal: 4.00,
    quantidade_tele_sena: 15.00,
    quantidade_caca_ao_tesouro: 10.00,
    quantidade_so_o_ouro: 2.50,
    quantidade_tele_sena_rosa: 5.00,
    quantidade_tele_sena_amarela: 10.00,
    quantidade_tele_sena_vermelha: 10.00
  };

  // Supply values
  const supplyValues = {
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
        // .eq('user_id', user.id) //NÃO EXISTE MAIS A REFERÊNCIA NA TABELA
        .eq('operator_code', user.operator_code)
        .eq('report_date', today)
        .maybeSingle();

      if (cashReport) {
        const formatValue = (value: number | null) => {
          if (!value) return '0,00';
          return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        };

        const newFormData: FormData = {
          moeda_inicial: formatValue(cashReport.moeda_inicial),
          bolao_inicial: formatValue(cashReport.bolao_inicial),
          suprimento_inicial: formatValue(cashReport.suprimento_inicial),
          comissao_bolao: formatValue(cashReport.comissao_bolao),
          venda_produtos: formatValue(cashReport.venda_produtos),
          total_caixa_1: formatValue(cashReport.total_caixa_1),
          total_caixa_2: formatValue(cashReport.total_caixa_2),
          premios_instantaneos: formatValue(cashReport.premios_instantaneos),
          sangria_corpvs_1: formatValue(cashReport.sangria_corpvs_1),
          sangria_corpvs_2: formatValue(cashReport.sangria_corpvs_2),
          sangria_corpvs_3: formatValue(cashReport.sangria_corpvs_3),
          sangria_corpvs_4: formatValue(cashReport.sangria_corpvs_4),
          sangria_corpvs_5: formatValue(cashReport.sangria_corpvs_5),
          sangria_cofre_1: formatValue(cashReport.sangria_cofre_1),
          sangria_cofre_2: formatValue(cashReport.sangria_cofre_2),
          sangria_cofre_3: formatValue(cashReport.sangria_cofre_3),
          sangria_cofre_4: formatValue(cashReport.sangria_cofre_4),
          sangria_cofre_5: formatValue(cashReport.sangria_cofre_5),
          pix_malote_1: formatValue(cashReport.pix_malote_1),
          pix_malote_2: formatValue(cashReport.pix_malote_2),
          pix_malote_3: formatValue(cashReport.pix_malote_3),
          pix_malote_4: formatValue(cashReport.pix_malote_4),
          pix_malote_5: formatValue(cashReport.pix_malote_5),
          recebido_caixa_1: formatValue(cashReport.recebido_caixa_1),
          recebido_caixa_2: formatValue(cashReport.recebido_caixa_2),
          recebido_caixa_3: formatValue(cashReport.recebido_caixa_3),
          recebido_caixa_4: formatValue(cashReport.recebido_caixa_4),
          recebido_caixa_5: formatValue(cashReport.recebido_caixa_5),
          recebido_caixa_6: formatValue(cashReport.recebido_caixa_6),
          vale_loteria_1: formatValue(cashReport.vale_loteria_1),
          vale_loteria_2: formatValue(cashReport.vale_loteria_2),
          vale_loteria_3: formatValue(cashReport.vale_loteria_3),
          vale_loteria_4: formatValue(cashReport.vale_loteria_4),
          vale_loteria_5: formatValue(cashReport.vale_loteria_5),
          repassado_caixa_1: formatValue(cashReport.repassado_valor_1),
          repassado_caixa_2: formatValue(cashReport.repassado_valor_2),
          repassado_caixa_3: formatValue(cashReport.repassado_valor_3),
          repassado_caixa_4: formatValue(cashReport.repassado_valor_4),
          repassado_caixa_5: formatValue(cashReport.repassado_valor_5),
          sangria_final: formatValue(cashReport.sangria_final),
          moeda_final: formatValue(cashReport.moeda_final),
          bolao_final: formatValue(cashReport.bolao_final),
          resgates: formatValue(cashReport.resgates),
          diferenca: formatValue(cashReport.diferenca)
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

        // Load product data from tb_controle_jogos
        const { data: productReports } = await supabase
          .from('tb_controle_jogos')
          .select('*')
          .eq('fechamento_id', cashReport.id);

        if (productReports && productReports.length > 0) {
          const newProductData = { ...productData };
          productReports.forEach(product => {
            // Map database fields to our state
            Object.keys(newProductData).forEach(key => {
              if (product[key] !== undefined) {
                newProductData[key as keyof typeof newProductData] = product[key]?.toString() || '0';
              }
            });
          });
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
    // Handle both comma and dot as decimal separator
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  const parseIntValue = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    const parsed = parseInt(value);
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
    return Object.entries(supplyData).reduce((total, [denom, qty]) => {
      return total + (parseIntValue(qty) * supplyValues[denom as keyof typeof supplyValues]);
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return Object.values(supplyData).reduce((total, qty) => total + parseIntValue(qty), 0);
  };

  const calculateProductTotal = () => {
    return Object.entries(productData).reduce((total, [product, qty]) => {
      return total + (parseIntValue(qty) * productValues[product as keyof typeof productValues]);
    }, 0);
  };

  const calculateTotalProductQuantity = () => {
    return Object.values(productData).reduce((total, qty) => total + parseIntValue(qty), 0);
  };

  const calculateDifference = () => {
    const totalEntradas = parseCurrencyValue(formData.moeda_inicial) + 
                         parseCurrencyValue(formData.bolao_inicial) + 
                         parseCurrencyValue(formData.suprimento_inicial) +
                         parseCurrencyValue(formData.comissao_bolao) + 
                         parseCurrencyValue(formData.venda_produtos);

    const totalSaidas = parseCurrencyValue(formData.premios_instantaneos) +
                       parseCurrencyValue(formData.sangria_corpvs_1) + parseCurrencyValue(formData.sangria_corpvs_2) + 
                       parseCurrencyValue(formData.sangria_corpvs_3) + parseCurrencyValue(formData.sangria_corpvs_4) + 
                       parseCurrencyValue(formData.sangria_corpvs_5) +
                       parseCurrencyValue(formData.sangria_cofre_1) + parseCurrencyValue(formData.sangria_cofre_2) + 
                       parseCurrencyValue(formData.sangria_cofre_3) + parseCurrencyValue(formData.sangria_cofre_4) + 
                       parseCurrencyValue(formData.sangria_cofre_5) +
                       parseCurrencyValue(formData.resgates);

    const totalFinal = parseCurrencyValue(formData.moeda_final) + parseCurrencyValue(formData.bolao_final);
    
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
        moeda_inicial: parseCurrencyValue(formData.moeda_inicial),
        bolao_inicial: parseCurrencyValue(formData.bolao_inicial),
        suprimento_inicial: parseCurrencyValue(formData.suprimento_inicial),
        comissao_bolao: parseCurrencyValue(formData.comissao_bolao),
        venda_produtos: parseCurrencyValue(formData.venda_produtos),
        total_caixa_1: parseCurrencyValue(formData.total_caixa_1),
        total_caixa_2: parseCurrencyValue(formData.total_caixa_2),
        premios_instantaneos: parseCurrencyValue(formData.premios_instantaneos),
        sangria_corpvs_1: parseCurrencyValue(formData.sangria_corpvs_1),
        sangria_corpvs_2: parseCurrencyValue(formData.sangria_corpvs_2),
        sangria_corpvs_3: parseCurrencyValue(formData.sangria_corpvs_3),
        sangria_corpvs_4: parseCurrencyValue(formData.sangria_corpvs_4),
        sangria_corpvs_5: parseCurrencyValue(formData.sangria_corpvs_5),
        sangria_cofre_1: parseCurrencyValue(formData.sangria_cofre_1),
        sangria_cofre_2: parseCurrencyValue(formData.sangria_cofre_2),
        sangria_cofre_3: parseCurrencyValue(formData.sangria_cofre_3),
        sangria_cofre_4: parseCurrencyValue(formData.sangria_cofre_4),
        sangria_cofre_5: parseCurrencyValue(formData.sangria_cofre_5),
        pix_malote_1: parseCurrencyValue(formData.pix_malote_1),
        pix_malote_2: parseCurrencyValue(formData.pix_malote_2),
        pix_malote_3: parseCurrencyValue(formData.pix_malote_3),
        pix_malote_4: parseCurrencyValue(formData.pix_malote_4),
        pix_malote_5: parseCurrencyValue(formData.pix_malote_5),
        recebido_caixa_1: parseCurrencyValue(formData.recebido_caixa_1),
        recebido_caixa_2: parseCurrencyValue(formData.recebido_caixa_2),
        recebido_caixa_3: parseCurrencyValue(formData.recebido_caixa_3),
        recebido_caixa_4: parseCurrencyValue(formData.recebido_caixa_4),
        recebido_caixa_5: parseCurrencyValue(formData.recebido_caixa_5),
        recebido_caixa_6: parseCurrencyValue(formData.recebido_caixa_6),
        vale_loteria_1: parseCurrencyValue(formData.vale_loteria_1),
        vale_loteria_2: parseCurrencyValue(formData.vale_loteria_2),
        vale_loteria_3: parseCurrencyValue(formData.vale_loteria_3),
        vale_loteria_4: parseCurrencyValue(formData.vale_loteria_4),
        vale_loteria_5: parseCurrencyValue(formData.vale_loteria_5),
        repassado_valor_1: parseCurrencyValue(formData.repassado_caixa_1),
        repassado_valor_2: parseCurrencyValue(formData.repassado_caixa_2),
        repassado_valor_3: parseCurrencyValue(formData.repassado_caixa_3),
        repassado_valor_4: parseCurrencyValue(formData.repassado_caixa_4),
        repassado_valor_5: parseCurrencyValue(formData.repassado_caixa_5),
        sangria_final: parseCurrencyValue(formData.sangria_final),
        moeda_final: parseCurrencyValue(formData.moeda_final),
        bolao_final: parseCurrencyValue(formData.bolao_final),
        resgates: parseCurrencyValue(formData.resgates),
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

      // Save supply data to tb_suprimento_cofre
      const supplyRecords = Object.entries(supplyData)
        .filter(([, quantity]) => parseIntValue(quantity) > 0)
        .map(([denomination, quantity]) => ({
          user_id: user.id,
          fechamento_id: savedReport.id,
          cod_operador: user.cod_operador,
          denominacao: denomination,
          valor_unitario: supplyValues[denomination as keyof typeof supplyValues],
          quantidade: parseIntValue(quantity),
          valor_total: parseIntValue(quantity) * supplyValues[denomination as keyof typeof supplyValues]
        }));

      // Delete existing supply records
      await supabase
        .from('tb_suprimento_cofre')
        .delete()
        .eq('fechamento_id', savedReport.id);

      // Insert new supply records
      if (supplyRecords.length > 0) {
        const { error: supplyError } = await supabase
          .from('tb_suprimento_cofre')
          .insert(supplyRecords);

        if (supplyError) throw supplyError;
      }

      // Save product data to tb_controle_jogos
      const productRecord = {
        user_id: user.id,
        fechamento_id: savedReport.id,
        cod_operador: user.cod_operador,
        ...Object.fromEntries(
          Object.entries(productData).map(([key, value]) => [key, parseIntValue(value)])
        )
      };

      // Delete existing product records
      await supabase
        .from('tb_controle_jogos')
        .delete()
        .eq('fechamento_id', savedReport.id);

      // Insert new product record
      const { error: productError } = await supabase
        .from('tb_controle_jogos')
        .insert([productRecord]);

      if (productError) throw productError;

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
                        <CurrencyInput
                          value={formData.moeda_inicial}
                          onChange={(value) => handleInputChange('moeda_inicial', value)}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bolão Inicial
                        </label>
                        <CurrencyInput
                          value={formData.bolao_inicial}
                          onChange={(value) => handleInputChange('bolao_inicial', value)}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Suprimento Inicial
                        </label>
                        <CurrencyInput
                          value={formData.suprimento_inicial}
                          onChange={(value) => handleInputChange('suprimento_inicial', value)}
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
                        <CurrencyInput
                          value={formData.comissao_bolao}
                          onChange={(value) => handleInputChange('comissao_bolao', value)}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Venda Produtos
                        </label>
                        <CurrencyInput
                          value={formData.venda_produtos}
                          onChange={(value) => handleInputChange('venda_produtos', value)}
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
                        <CurrencyInput
                          value={formData.total_caixa_1}
                          onChange={(value) => handleInputChange('total_caixa_1', value)}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Caixa 2
                        </label>
                        <CurrencyInput
                          value={formData.total_caixa_2}
                          onChange={(value) => handleInputChange('total_caixa_2', value)}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prêmios Instantâneos
                        </label>
                        <CurrencyInput
                          value={formData.premios_instantaneos}
                          onChange={(value) => handleInputChange('premios_instantaneos', value)}
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
                          <CurrencyInput
                            value={formData[`sangria_corpvs_${num}` as keyof FormData]}
                            onChange={(value) => handleInputChange(`sangria_corpvs_${num}` as keyof FormData, value)}
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
                          <CurrencyInput
                            value={formData[`sangria_cofre_${num}` as keyof FormData]}
                            onChange={(value) => handleInputChange(`sangria_cofre_${num}` as keyof FormData, value)}
                            placeholder="0,00"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PIX Malote */}
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">PIX Malote</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            PIX Malote {num}
                          </label>
                          <CurrencyInput
                            value={formData[`pix_malote_${num}` as keyof FormData]}
                            onChange={(value) => handleInputChange(`pix_malote_${num}` as keyof FormData, value)}
                            placeholder="0,00"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recebido Caixa */}
                  <div className="bg-teal-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recebido Caixa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recebido Caixa {num}
                          </label>
                          <CurrencyInput
                            value={formData[`recebido_caixa_${num}` as keyof FormData]}
                            onChange={(value) => handleInputChange(`recebido_caixa_${num}` as keyof FormData, value)}
                            placeholder="0,00"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vale Loteria */}
                  <div className="bg-pink-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vale Loteria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vale Loteria {num}
                          </label>
                          <CurrencyInput
                            value={formData[`vale_loteria_${num}` as keyof FormData]}
                            onChange={(value) => handleInputChange(`vale_loteria_${num}` as keyof FormData, value)}
                            placeholder="0,00"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Repassado Caixa */}
                  <div className="bg-cyan-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Repassado Caixa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Repassado Caixa {num}
                          </label>
                          <CurrencyInput
                            value={formData[`repassado_caixa_${num}` as keyof FormData]}
                            onChange={(value) => handleInputChange(`repassado_caixa_${num}` as keyof FormData, value)}
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
                        <CurrencyInput
                          value={formData.sangria_final}
                          onChange={(value) => handleInputChange('sangria_final', value)}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moeda Final
                        </label>
                        <CurrencyInput
                          value={formData.moeda_final}
                          onChange={(value) => handleInputChange('moeda_final', value)}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bolão Final
                        </label>
                        <CurrencyInput
                          value={formData.bolao_final}
                          onChange={(value) => handleInputChange('bolao_final', value)}
                          placeholder="0,00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resgates
                        </label>
                        <CurrencyInput
                          value={formData.resgates}
                          onChange={(value) => handleInputChange('resgates', value)}
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
                          type="number"
                          value={quantity}
                          onChange={(e) => handleSupplyChange(denomination, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                          min="0"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {formatCurrency(parseIntValue(quantity) * supplyValues[denomination as keyof typeof supplyValues])}
                        </div>
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
                    {Object.entries(productData).map(([product, quantity]) => {
                      const productName = product.replace('quantidade_', '').replace(/_/g, ' ').toUpperCase();
                      const unitValue = productValues[product as keyof typeof productValues];
                      
                      return (
                        <div key={product} className="bg-gray-50 p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {productName}
                          </label>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleProductChange(product, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            min="0"
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            Valor Unit.: {formatCurrency(unitValue)}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Total: {formatCurrency(parseIntValue(quantity) * unitValue)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <span className="block text-sm text-gray-600">Quantidade Total</span>
                        <span className="text-lg font-bold text-gray-900">
                          {calculateTotalProductQuantity()}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="block text-sm text-gray-600">Valor Total</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(calculateProductTotal())}
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
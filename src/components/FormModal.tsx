import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  operatorCode: string;
  onSave: () => void;
}

export default function FormModal({ isOpen, onClose, reportId, operatorCode, onSave }: FormModalProps) {
  const [activeTab, setActiveTab] = useState<'supply' | 'products'>('supply');
  const [supplyData, setSupplyData] = useState({
    'R$200': 0,
    'R$100': 0,
    'R$50': 0,
    'R$20': 0,
    'R$10': 0,
    'R$5': 0,
    'R$2': 0,
    'R$1': 0,
    'R$0,50': 0,
    'R$0,25': 0,
    'R$0,10': 0,
    'R$0,05': 0,
  });

  const [productData, setProductData] = useState({
    telesena_verde: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    rodada_da_sorte: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    federal_10: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    telesena_lilas: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    trio: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    trevo_sorte: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    federal: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    telesena: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    caca_tesouro: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    so_ouro: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    telesena_rosa: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    telesena_amarela: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
    telesena_vermelha: { inicial: 0, recebida: 0, devolvida: 0, final: 0 },
  });

  const [loading, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && reportId) {
      loadExistingData();
    }
  }, [isOpen, reportId]);

  const loadExistingData = async () => {
    try {
      // Load supply data
      const { data: supplyRecords } = await supabase
        .from('tb_suprimento_cofre')
        .select('*')
        .eq('fechamento_id', reportId);

      if (supplyRecords && supplyRecords.length > 0) {
        const record = supplyRecords[0];
        setSupplyData({
          'R$200': record['R$200'] || 0,
          'R$100': record['R$100'] || 0,
          'R$50': record['R$50'] || 0,
          'R$20': record['R$20'] || 0,
          'R$10': record['R$10'] || 0,
          'R$5': record['R$5'] || 0,
          'R$2': record['R$2'] || 0,
          'R$1': record['R$1'] || 0,
          'R$0,50': record['R$0,50'] || 0,
          'R$0,25': record['R$0,25'] || 0,
          'R$0,10': record['R$0,10'] || 0,
          'R$0,05': record['R$0,05'] || 0,
        });
      }

      // Load product data
      const { data: productRecords } = await supabase
        .from('tb_controle_jogos')
        .select('*')
        .eq('fechamento_id', reportId);

      if (productRecords && productRecords.length > 0) {
        const record = productRecords[0];
        setProductData({
          telesena_verde: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          rodada_da_sorte: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          federal_10: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          telesena_lilas: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          trio: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          trevo_sorte: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          federal: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          telesena: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          caca_tesouro: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          so_ouro: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          telesena_rosa: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          telesena_amarela: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
          telesena_vermelha: {
            inicial: record.qtd_inicial || 0,
            recebida: record.qtd_recebida || 0,
            devolvida: record.qtd_devolvida || 0,
            final: record.qtd_final || 0
          },
        });
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const handleSupplyChange = (denomination: string, value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0;
    setSupplyData(prev => ({
      ...prev,
      [denomination]: numValue
    }));
  };

  const handleProductChange = (product: string, field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setProductData(prev => ({
      ...prev,
      [product]: {
        ...prev[product as keyof typeof prev],
        [field]: numValue
      }
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
      return total + (qty * values[denom as keyof typeof values]);
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return Object.values(supplyData).reduce((total, qty) => total + qty, 0);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Save supply data
      const supplyRecord = {
        user_id: user.id,
        fechamento_id: reportId,
        cod_operador: operatorCode,
        'R$200': supplyData['R$200'],
        'R$100': supplyData['R$100'],
        'R$50': supplyData['R$50'],
        'R$20': supplyData['R$20'],
        'R$10': supplyData['R$10'],
        'R$5': supplyData['R$5'],
        'R$2': supplyData['R$2'],
        'R$1': supplyData['R$1'],
        'R$0,50': supplyData['R$0,50'],
        'R$0,25': supplyData['R$0,25'],
        'R$0,10': supplyData['R$0,10'],
        'R$0,05': supplyData['R$0,05'],
        qtd: calculateTotalQuantity(),
        vlr_total: calculateSupplyTotal(),
      };

      await supabase
        .from('tb_suprimento_cofre')
        .upsert(supplyRecord, { onConflict: 'fechamento_id' });

      // Save product data
      const productRecord = {
        user_id: user.id,
        fechamento_id: reportId,
        cod_operador: operatorCode,
        telesena_verde: productData.telesena_verde.inicial,
        rodada_da_sorte: productData.rodada_da_sorte.inicial,
        federal_10: productData.federal_10.inicial,
        telesena_lilas: productData.telesena_lilas.inicial,
        trio: productData.trio.inicial,
        trevo_sorte: productData.trevo_sorte.inicial,
        federal: productData.federal.inicial,
        telesena: productData.telesena.inicial,
        caca_tesouro: productData.caca_tesouro.inicial,
        so_ouro: productData.so_ouro.inicial,
        telesena_rosa: productData.telesena_rosa.inicial,
        telesena_amarela: productData.telesena_amarela.inicial,
        telesena_vermelha: productData.telesena_vermelha.inicial,
        qtd_inicial: Object.values(productData).reduce((sum, p) => sum + p.inicial, 0),
        qtd_recebida: Object.values(productData).reduce((sum, p) => sum + p.recebida, 0),
        qtd_devolvida: Object.values(productData).reduce((sum, p) => sum + p.devolvida, 0),
        qtd_final: Object.values(productData).reduce((sum, p) => sum + p.final, 0),
        vlr_vendido: 0, // Calculate based on your business logic
      };

      await supabase
        .from('tb_controle_jogos')
        .upsert(productRecord, { onConflict: 'fechamento_id' });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Controle de Suprimentos e Jogos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'supply'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Suprimento Cofre
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Controle de Jogos
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'supply' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Denominações</h3>
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
                      min="0"
                      step="1"
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
                    R$ {calculateSupplyTotal().toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Produtos</h3>
              <div className="space-y-4">
                {Object.entries(productData).map(([product, quantities]) => (
                  <div key={product} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 capitalize">
                      {product.replace(/_/g, ' ')}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Inicial
                        </label>
                        <input
                          type="number"
                          value={quantities.inicial}
                          onChange={(e) => handleProductChange(product, 'inicial', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Recebida
                        </label>
                        <input
                          type="number"
                          value={quantities.recebida}
                          onChange={(e) => handleProductChange(product, 'recebida', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Devolvida
                        </label>
                        <input
                          type="number"
                          value={quantities.devolvida}
                          onChange={(e) => handleProductChange(product, 'devolvida', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Final
                        </label>
                        <input
                          type="number"
                          value={quantities.final}
                          onChange={(e) => handleProductChange(product, 'final', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
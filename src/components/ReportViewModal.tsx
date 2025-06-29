import React, { useState, useEffect } from 'react';
import { X, FileText, DollarSign, Package, Coins, Calendar, User, Eye } from 'lucide-react';
import { getProductReports, getSupplyReports, ProductReport, SupplyReport } from '../lib/supabase';

interface CashReportWithDetails {
  id: string;
  user_id: string;
  cod_operador: string;
  data_fechamento: string;
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
  created_at: string;
  updated_at: string;
  operator_name?: string;
}

interface ReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: CashReportWithDetails;
}

const ReportViewModal: React.FC<ReportViewModalProps> = ({ isOpen, onClose, report }) => {
  const [activeTab, setActiveTab] = useState<'cash' | 'products' | 'supplies'>('cash');
  const [products, setProducts] = useState<ProductReport[]>([]);
  const [supplies, setSupplies] = useState<SupplyReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && report) {
      loadReportDetails();
    }
  }, [isOpen, report]);

  const loadReportDetails = async () => {
    try {
      setLoading(true);
      
      const [productsData, suppliesData] = await Promise.all([
        getProductReports(report.id),
        getSupplyReports(report.id)
      ]);
      
      setProducts(productsData);
      setSupplies(suppliesData);
    } catch (error) {
      console.error('Erro ao carregar detalhes do relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Relatório de Fechamento</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {report.operator_name}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(report.data_fechamento)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Código: {report.cod_operador}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
              <span className="ml-3 text-gray-600">Carregando detalhes...</span>
            </div>
          ) : (
            <>
              {activeTab === 'cash' && (
                <div className="space-y-8">
                  {/* Resumo */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Fechamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Total Caixa</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(report.total_caixa_1 + report.total_caixa_2)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Sangria Final</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(report.sangria_final)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Diferença</p>
                        <p className={`text-xl font-bold ${
                          report.diferenca >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(report.diferenca)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600">Atualizado em</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateTime(report.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Valores Iniciais */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores Iniciais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Moeda Inicial</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(report.moeda_inicial)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Bolão Inicial</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(report.bolao_inicial)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Suprimento Inicial</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(report.suprimento_inicial)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vendas e Comissões */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas e Comissões</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Comissão Bolão</p>
                        <p className="text-lg font-semibold text-green-700">{formatCurrency(report.comissao_bolao)}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Venda Produtos</p>
                        <p className="text-lg font-semibold text-green-700">{formatCurrency(report.venda_produtos)}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Prêmios Instantâneos</p>
                        <p className="text-lg font-semibold text-orange-700">{formatCurrency(report.premios_instantaneos)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sangrias CORPVS */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sangrias CORPVS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num} className="bg-red-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Sangria {num}</p>
                          <p className="text-lg font-semibold text-red-700">
                            {formatCurrency(report[`sangria_corpvs_${num}` as keyof typeof report] as number)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sangrias Cofre */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sangrias Cofre</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => (
                        <div key={num} className="bg-purple-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Cofre {num}</p>
                          <p className="text-lg font-semibold text-purple-700">
                            {formatCurrency(report[`sangria_cofre_${num}` as keyof typeof report] as number)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Valores Finais */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Valores Finais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Moeda Final</p>
                        <p className="text-lg font-semibold text-blue-700">{formatCurrency(report.moeda_final)}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Bolão Final</p>
                        <p className="text-lg font-semibold text-blue-700">{formatCurrency(report.bolao_final)}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Resgates</p>
                        <p className="text-lg font-semibold text-yellow-700">{formatCurrency(report.resgates)}</p>
                      </div>
                      <div className={`rounded-lg p-4 ${
                        report.diferenca >= 0 ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <p className="text-sm text-gray-600">Diferença</p>
                        <p className={`text-lg font-semibold ${
                          report.diferenca >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {formatCurrency(report.diferenca)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Controle de Jogos</h3>
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum produto registrado</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Unit.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicial</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recebido</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Devolvido</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Vendido</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.nome_produto}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(product.valor_unitario)}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{product.quantidade_inicial}</td>
                              <td className="px-4 py-3 text-sm text-green-600">{product.quantidade_recebida}</td>
                              <td className="px-4 py-3 text-sm text-red-600">{product.quantidade_devolvida}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{product.quantidade_final}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-green-700">{formatCurrency(product.valor_vendido)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'supplies' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Suprimento do Cofre</h3>
                  {supplies.length === 0 ? (
                    <div className="text-center py-12">
                      <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum suprimento registrado</p>
                    </div>
                  ) : (
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
                          {supplies.map((supply) => (
                            <tr key={supply.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{supply.denominacao}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(supply.valor_unitario)}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{supply.quantidade}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-green-700">{formatCurrency(supply.valor_total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewModal;
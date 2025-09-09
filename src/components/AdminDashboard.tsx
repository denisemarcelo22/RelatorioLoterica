import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  FileText,
  User,
  Mail,
  Phone,
  Key,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Trash2,
  AlertTriangle,
  BarChart3,
  Activity,
  Target,
  Trophy,
  CreditCard,
  Settings,
  Shield
} from 'lucide-react';
import { User as UserType, getAllUsers, getCashReports, getProductReports, getSupplyReports, deleteUser } from '../lib/supabase';
import OperatorRegistrationModal from './OperatorRegistrationModal';
import ReportViewModal from './ReportViewModal';

interface AdminDashboardProps {
  currentUser: UserType;
  onLogout: () => void;
}

interface CashReportWithDetails {
  id: string;
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
  sangria_final: number;
  moeda_final: number;
  bolao_final: number;
  resgates: number;
  diferenca: number;
  created_at: string;
  updated_at: string;
  operator_name?: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  operatorName: string;
  loading: boolean;
}

interface TransactionData {
  totalRevenue: number;
  dailyTransactions: number;
  totalGames: number;
  averageTicket: number;
  topGames: Array<{
    name: string;
    sales: number;
    percentage: number;
  }>;
  cashierData: Array<{
    name: string;
    revenue: number;
    transactions: number;
  }>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  operatorName,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Confirmar Exclusão</h3>
              <p className="text-gray-600">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              Tem certeza que deseja deletar o operador <strong>{operatorName}</strong>?
            </p>
            <p className="text-red-700 text-sm mt-2">
              Todos os relatórios e dados associados a este operador serão permanentemente removidos.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deletando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'operators' | 'reports'>('dashboard');
  const [operators, setOperators] = useState<UserType[]>([]);
  const [reports, setReports] = useState<CashReportWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CashReportWithDetails | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    operator: UserType | null;
    loading: boolean;
  }>({
    isOpen: false,
    operator: null,
    loading: false
  });

  // Dashboard data
  const [data] = useState<TransactionData>({
    totalRevenue: 45750.80,
    dailyTransactions: 342,
    totalGames: 1250,
    averageTicket: 133.77,
    topGames: [
      { name: 'Mega-Sena', sales: 15420, percentage: 33.7 },
      { name: 'Lotofácil', sales: 12350, percentage: 27.0 },
      { name: 'Quina', sales: 8950, percentage: 19.6 },
      { name: 'Lotomania', sales: 5230, percentage: 11.4 },
      { name: 'Dupla Sena', sales: 3800, percentage: 8.3 }
    ],
    cashierData: [
      { name: 'Maria Silva', revenue: 18450.30, transactions: 125 },
      { name: 'João Santos', revenue: 15320.50, transactions: 108 },
      { name: 'Ana Costa', revenue: 11980.00, transactions: 109 }
    ]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load operators
      const operatorsData = await getAllUsers();
      setOperators(operatorsData);

      // Load reports
      const reportsData = await getCashReports();
      
      // Enrich reports with operator names
      const enrichedReports = reportsData.map(report => {
        const operator = operatorsData.find(op => op.cod_operador === report.cod_operador);
        return {
          ...report,
          operator_name: operator ? operator.nome : `Operador ${report.cod_operador}`
        };
      });
      
      setReports(enrichedReports);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOperator = async () => {
    if (!deleteModal.operator) return;

    try {
      setDeleteModal(prev => ({ ...prev, loading: true }));
      
      // Delete the operator
      await deleteUser(deleteModal.operator.id);
      
      // Update local state
      setOperators(prev => prev.filter(op => op.id !== deleteModal.operator?.id));
      
      // Also remove any reports from this operator
      setReports(prev => prev.filter(report => report.cod_operador !== deleteModal.operator?.cod_operador));
      
      // Close modal
      setDeleteModal({ isOpen: false, operator: null, loading: false });
      
      // Show success message
      alert(`Operador ${deleteModal.operator.nome} foi removido com sucesso.`);
      
    } catch (error: any) {
      console.error('Erro ao deletar operador:', error);
      alert('Erro ao deletar operador: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setDeleteModal(prev => ({ ...prev, loading: false }));
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

  const filteredOperators = operators.filter(operator =>
    operator.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.cod_operador.includes(searchTerm)
  );

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.operator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.cod_operador.includes(searchTerm);
    const matchesDate = !dateFilter || report.data_fechamento === dateFilter;
    return matchesSearch && matchesDate;
  });

  const handleViewReport = async (report: CashReportWithDetails) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handleOperatorRegistrationSuccess = () => {
    // Reload data to include the new operator
    loadData();
  };

  const totalOperators = operators.length;
  const activeOperators = operators.filter(op => op.ativo).length;
  const todayReports = reports.filter(report => 
    report.data_fechamento === new Date().toISOString().split('T')[0]
  ).length;
  const totalRevenue = reports.reduce((sum, report) => sum + (report.total_caixa_1 + report.total_caixa_2), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Bem-vindo, {currentUser.nome}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-blue-800 text-sm font-medium">Administrador</span>
              </div>
              <button
                onClick={onLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Operadores</p>
                <p className="text-2xl font-bold text-gray-900">{totalOperators}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Operadores Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeOperators}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Relatórios Hoje</p>
                <p className="text-2xl font-bold text-purple-600">{todayReports}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Faturamento Total</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => setActiveTab('operators')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'operators'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Gerenciar Operadores
                </div>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Relatórios dos Operadores
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Dashboard Header */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Dashboard Financeiro - Lotérica
                  </h2>
                  <p className="text-gray-600 capitalize">
                    {new Date().toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Main Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Faturamento Total</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatCurrency(data.totalRevenue)}
                        </p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+12.5%</span>
                      <span className="text-gray-500 ml-1">vs. ontem</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Transações do Dia</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {data.dailyTransactions}
                        </p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+8.2%</span>
                      <span className="text-gray-500 ml-1">vs. ontem</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Total de Jogos</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {data.totalGames}
                        </p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+5.7%</span>
                      <span className="text-gray-500 ml-1">vs. ontem</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Ticket Médio</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatCurrency(data.averageTicket)}
                        </p>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">+3.1%</span>
                      <span className="text-gray-500 ml-1">vs. ontem</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Games */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Jogos Mais Vendidos</h2>
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="space-y-4">
                      {data.topGames.map((game, index) => (
                        <div key={game.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                              <span className="text-sm font-bold text-blue-600">
                                {index + 1}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{game.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(game.sales)}
                            </p>
                            <p className="text-sm text-gray-500">{game.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cashier Performance */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Faturamento por Operador</h2>
                      <Users className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-4">
                      {data.cashierData.map((cashier, index) => (
                        <div key={cashier.name} className="border border-gray-100 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{cashier.name}</h3>
                            <div className="flex items-center gap-1">
                              <div className={`w-3 h-3 rounded-full ${
                                index === 0 ? 'bg-green-500' : 
                                index === 1 ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Faturamento</p>
                              <p className="font-bold text-gray-900">
                                {formatCurrency(cashier.revenue)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Transações</p>
                              <p className="font-bold text-gray-900">{cashier.transactions}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Meta do dia</span>
                              <span className="text-gray-900">
                                {Math.round((cashier.revenue / 20000) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((cashier.revenue / 20000) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Formas de Pagamento</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dinheiro</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cartão Débito</span>
                        <span className="font-semibold">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cartão Crédito</span>
                        <span className="font-semibold">20%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Horário de Pico</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">08:00 - 10:00</span>
                        <span className="font-semibold">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">14:00 - 16:00</span>
                        <span className="font-semibold">40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">18:00 - 20:00</span>
                        <span className="font-semibold">35%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Crescimento Semanal</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vendas</span>
                        <span className="font-semibold text-green-600">+18.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clientes</span>
                        <span className="font-semibold text-green-600">+12.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ticket Médio</span>
                        <span className="font-semibold text-green-600">+5.7%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'dashboard' && (
              <>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={activeTab === 'operators' ? 'Buscar operadores...' : 'Buscar relatórios...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {activeTab === 'operators' && (
                    <button
                      onClick={() => setIsRegistrationModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Novo Operador
                    </button>
                  )}

                  {activeTab === 'reports' && (
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                {activeTab === 'operators' ? (
                  <div className="space-y-4">
                    {filteredOperators.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhum operador encontrado</p>
                      </div>
                    ) : (
                      filteredOperators.map((operator) => (
                        <div key={operator.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-blue-100 p-3 rounded-full">
                                <User className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{operator.nome}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {operator.email}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Key className="w-4 h-4" />
                                    Código: {operator.cod_operador}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                operator.ativo 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {operator.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                operator.tipo_usuario === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {operator.tipo_usuario === 'admin' ? 'Admin' : 'Operador'}
                              </span>
                              
                              {operator.id !== currentUser.id && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setDeleteModal({ isOpen: true, operator, loading: false })}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                                    title="Deletar operador"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhum relatório encontrado</p>
                      </div>
                    ) : (
                      filteredReports.map((report) => (
                        <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-green-100 p-3 rounded-full">
                                <FileText className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{report.operator_name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(report.data_fechamento)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Key className="w-4 h-4" />
                                    Código: {report.cod_operador}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatDateTime(report.updated_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Total Caixa</p>
                                <p className="font-semibold text-green-600">
                                  {formatCurrency(report.total_caixa_1 + report.total_caixa_2)}
                                </p>
                              </div>
                              <button
                                onClick={() => handleViewReport(report)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalhes
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <OperatorRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSuccess={handleOperatorRegistrationSuccess}
      />

      {selectedReport && (
        <ReportViewModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedReport(null);
          }}
          report={selectedReport}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, operator: null, loading: false })}
        onConfirm={handleDeleteOperator}
        operatorName={deleteModal.operator?.nome || ''}
        loading={deleteModal.loading}
      />
    </div>
  );
};

export default AdminDashboard;
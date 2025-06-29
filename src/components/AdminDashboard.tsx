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
  TrendingUp
} from 'lucide-react';
import { User as UserType, getAllUsers, getCashReports, getProductReports, getSupplyReports } from '../lib/supabase';
import OperatorRegistrationModal from './OperatorRegistrationModal';
import ReportViewModal from './ReportViewModal';

interface AdminDashboardProps {
  currentUser: UserType;
  onLogout: () => void;
}

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
  sangria_final: number;
  moeda_final: number;
  bolao_final: number;
  resgates: number;
  diferenca: number;
  created_at: string;
  updated_at: string;
  operator_name?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'operators' | 'reports'>('operators');
  const [operators, setOperators] = useState<UserType[]>([]);
  const [reports, setReports] = useState<CashReportWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CashReportWithDetails | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar operadores
      const operatorsData = await getAllUsers();
      setOperators(operatorsData);

      // Carregar relatórios
      const reportsData = await getCashReports();
      
      // Enriquecer relatórios com nomes dos operadores
      const enrichedReports = reportsData.map(report => {
        const operator = operatorsData.find(op => op.user_id === report.user_id);
        return {
          ...report,
          operator_name: operator?.nome || 'Operador não encontrado'
        };
      });
      
      setReports(enrichedReports);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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
                                <Phone className="w-4 h-4" />
                                {operator.telefone}
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
          </div>
        </div>
      </div>

      {/* Modals */}
      <OperatorRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSuccess={loadData}
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
    </div>
  );
};

export default AdminDashboard;
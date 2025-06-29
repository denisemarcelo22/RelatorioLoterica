import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Trophy,
  CreditCard,
  Clock,
  Target,
  BarChart3,
  Activity,
  FileText
} from 'lucide-react';
import AuthModal from './AuthModal';
import AdminDashboard from './AdminDashboard';
import OperatorDashboard from './OperatorDashboard';
import { User, signOut } from '../lib/supabase';

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

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If user is logged in, show appropriate dashboard
  if (currentUser) {
    if (currentUser.tipo_usuario === 'admin') {
      return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
    } else {
      return <OperatorDashboard currentUser={currentUser} onLogout={handleLogout} />;
    }
  }

  // Show public dashboard with login option
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Financeiro - Lotérica
              </h1>
              <p className="text-gray-600 capitalize">
                {formatDate(currentTime)}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Current Time */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-mono font-semibold text-gray-900">
                  {formatTime(currentTime)}
                </span>
              </div>

              {/* Login Button */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <FileText className="w-5 h-5" />
                <span>Fazer Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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

        {/* Login CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Acesse o Sistema de Relatórios
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Faça login para acessar o sistema completo de relatórios financeiros, 
            controle de jogos e gerenciamento de operadores.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Fazer Login Agora
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Dashboard;
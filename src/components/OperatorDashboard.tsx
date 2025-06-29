import React, { useState } from 'react';
import { FileText, Clock, User, LogOut } from 'lucide-react';
import { User as UserType } from '../lib/supabase';
import FormModal from './FormModal';

interface OperatorDashboardProps {
  currentUser: UserType;
  onLogout: () => void;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ currentUser, onLogout }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel do Operador</h1>
                <p className="text-gray-600">Bem-vindo, {currentUser.nome}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-blue-800 text-sm font-medium">Código: {currentUser.cod_operador}</span>
              </div>
              <button
                onClick={onLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Relatórios</h2>
            <p className="text-gray-600 mb-6">
              Gerencie seus relatórios de fechamento de caixa de forma simples e eficiente
            </p>
            
            {/* Current Time Display */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Horário Atual</span>
              </div>
              <div className="text-3xl font-mono font-bold text-gray-900 mb-1">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {formatDate(currentTime)}
              </div>
            </div>

            <button
              onClick={() => setIsFormModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Abrir Formulário de Fechamento
              </div>
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fechamento de Caixa</h3>
            <p className="text-sm text-gray-600">
              Registre todos os valores de entrada e saída do seu caixa diário
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Controle de Jogos</h3>
            <p className="text-sm text-gray-600">
              Gerencie o estoque e vendas dos produtos de loteria
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Suprimento Cofre</h3>
            <p className="text-sm text-gray-600">
              Controle as denominações de moedas e cédulas do cofre
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-3">Instruções de Uso</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Clique no botão "Abrir Formulário de Fechamento" para iniciar um novo relatório</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Preencha todos os campos obrigatórios com os valores corretos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Os cálculos são feitos automaticamente conforme você preenche os dados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Salve o relatório ao final para registrar as informações no sistema</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Form Modal */}
      <FormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        user={currentUser}
      />
    </div>
  );
};

export default OperatorDashboard;
import React, { useState, useEffect } from 'react';
import { FileText, LogIn } from 'lucide-react';
import AuthModal from './AuthModal';
import AdminDashboard from './AdminDashboard';
import OperatorDashboard from './OperatorDashboard';
import { User, signOut } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true); // Always open initially

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setIsAuthModalOpen(true); // Reopen auth modal after logout
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

  // Show login page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header with Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/logoFNZ.png" 
              alt="FNZ Logo" 
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl font-bold text-gray-900">
              Relatório de Lotérica
            </h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sistema de Gestão
          </h2>
          <p className="text-gray-600 mb-8">
            Faça login para acessar o sistema de relatórios financeiros
          </p>
          
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <LogIn className="w-6 h-6" />
            Fazer Login
          </button>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Sistema de gestão financeira para lotéricas
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Fechamento de Caixa</h3>
            <p className="text-sm text-gray-600">
              Controle completo de entradas e saídas do caixa diário
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Gestão de Operadores</h3>
            <p className="text-sm text-gray-600">
              Administre usuários e visualize relatórios de todos os operadores
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Relatórios Detalhados</h3>
            <p className="text-sm text-gray-600">
              Acompanhe produtos, suprimentos e performance financeira
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          // Don't allow closing the modal if no user is logged in
          if (!currentUser) {
            return;
          }
          setIsAuthModalOpen(false);
        }}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Dashboard;
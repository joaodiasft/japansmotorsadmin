import React from 'react';
import { PlusCircle, FileText, History, Settings, Users, LayoutList, Car } from 'lucide-react';

const Home = ({ isSaleActive, isViewOnly, handleNewSale, setActiveTab, stats }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Painel Administrativo</h1>
        <p className="text-gray-500 mt-2">Bem-vindo(a) ao AutoGestor ERP. Gerencie suas vendas, contratos e estoque em um só lugar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Base de Clientes</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.customers || 0}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Users size={28} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Veículos Disponíveis</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.vehicles || 0}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-full text-green-600">
            <LayoutList size={28} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Vendas Realizadas</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.sales || 0}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-full text-purple-600">
            <History size={28} />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Acesso Rápido</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={handleNewSale}
          className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all transform hover:-translate-y-1 group"
        >
          <div className="p-4 bg-blue-50 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
            <PlusCircle size={32} />
          </div>
          <span className="font-bold text-gray-800 text-lg">Nova Venda</span>
          <span className="text-sm text-gray-500 mt-1">
            {isSaleActive && !isViewOnly ? 'Continuar Venda Atual' : 'Iniciar Contrato'}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('customers')}
          className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-300 transition-all transform hover:-translate-y-1 group"
        >
          <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-4">
            <Users size={32} />
          </div>
          <span className="font-bold text-gray-800 text-lg">Ver Clientes</span>
          <span className="text-sm text-gray-500 mt-1">Gerenciar Base</span>
        </button>

        <button 
          onClick={() => setActiveTab('vehicles')}
          className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-300 transition-all transform hover:-translate-y-1 group"
        >
          <div className="p-4 bg-green-50 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors mb-4">
            <Car size={32} />
          </div>
          <span className="font-bold text-gray-800 text-lg">Ver Estoque</span>
          <span className="text-sm text-gray-500 mt-1">Lista de Veículos</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-300 transition-all transform hover:-translate-y-1 group"
        >
          <div className="p-4 bg-purple-50 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors mb-4">
            <History size={32} />
          </div>
          <span className="font-bold text-gray-800 text-lg">Histórico</span>
          <span className="text-sm text-gray-500 mt-1">Consultar Arquivo</span>
        </button>
      </div>
    </div>
  );
};

export default Home;

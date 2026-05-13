import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import History from './components/History';
import CustomerManager from './components/CustomerManager';
import VehicleManager from './components/VehicleManager';
import SaleManager from './components/SaleManager';
import ContractManager from './components/ContractManager';
import PromissoryManager from './components/PromissoryManager';
import TemplateManager from './components/TemplateManager';
import { api } from './hooks/useApi';

const storeData = {
  name: 'JAPAN MOTORS',
  cnpj: '29421893000120',
  address: 'Av. Contorno, QD35 - LT 01 - Jardim Colorado',
  cityUf: 'Goiânia-GO',
  cep: '74474-048',
  phone: '(62) 99999-9999'
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Estado global carregado do banco
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [sales, setSales] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Venda ativa para contratos e promissórias
  const [currentSale, setCurrentSale] = useState(null);

  // ===================================================
  // Carregamento inicial de todos os dados
  // ===================================================
  const loadAll = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [c, v, s, t] = await Promise.all([
        api.get('/customers'),
        api.get('/vehicles'),
        api.get('/sales'),
        api.get('/templates'),
      ]);
      setCustomers(Array.isArray(c) ? c : []);
      setVehicles(Array.isArray(v) ? v : []);
      setSales(Array.isArray(s) ? s : []);
      setTemplates(Array.isArray(t) ? t : []);
    } catch (e) {
      setApiError(`Erro ao conectar com o servidor: ${e.message}. Verifique se o backend está rodando (npm run server).`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ===================================================
  // Handlers de Clientes
  // ===================================================
  const handleSaveCustomer = async (formData, id = null) => {
    try {
      if (id) {
        const updated = await api.put(`/customers/${id}`, formData);
        setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      } else {
        const created = await api.post('/customers', formData);
        setCustomers(prev => [created, ...prev]);
      }
      return true;
    } catch (e) {
      alert(`Erro ao salvar cliente: ${e.message}`);
      return false;
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert(`Erro ao excluir: ${e.message}`);
    }
  };

  // ===================================================
  // Handlers de Veículos
  // ===================================================
  const handleSaveVehicle = async (formData, id = null) => {
    try {
      if (id) {
        const updated = await api.put(`/vehicles/${id}`, formData);
        setVehicles(prev => prev.map(v => v.id === id ? updated : v));
      } else {
        const created = await api.post('/vehicles', formData);
        setVehicles(prev => [created, ...prev]);
      }
      return true;
    } catch (e) {
      alert(`Erro ao salvar veículo: ${e.message}`);
      return false;
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (e) {
      alert(`Erro ao excluir: ${e.message}`);
    }
  };

  // ===================================================
  // Handler de Vendas
  // ===================================================
  const handleCreateSale = async (saleFormData) => {
    try {
      const { customer, vehicle, sale, promissory } = saleFormData;
      const payload = {
        customerId: customer.id,
        vehicleId: vehicle.id,
        saleDate: sale.date,
        totalValue: sale.totalValue,
        cashValue: sale.cashValue,
        financedValue: sale.financedValue,
        financeHistory: sale.financeHistory,
        despachanteFee: sale.despachanteFee,
        tacFee: sale.tacFee,
        observations: sale.observations,
        templateId: sale.contractTemplate,
        installments: promissory.installments,
        installmentValue: promissory.installmentValue,
        applyInterest: promissory.applyInterest,
        interestRate: promissory.interestRate,
        firstDueDate: promissory.firstDueDate,
        payableAt: promissory.payableAt,
        valueWords: promissory.valueWords,
      };

      const created = await api.post('/sales', payload);

      // Formata para o contrato
      const fullSale = {
        ...created,
        store: storeData,
        promissory: {
          ...promissory,
          installments: promissory.installments,
        }
      };

      setSales(prev => [created, ...prev]);
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, status: 'sold' } : v));
      setCurrentSale(fullSale);
      alert('✅ Venda registrada com sucesso! Redirecionando para emissão do contrato.');
      setActiveTab('contract_editor');
    } catch (e) {
      alert(`Erro ao registrar venda: ${e.message}`);
    }
  };

  const handleLoadSale = (sale, targetTab = 'contract_editor') => {
    const fullSale = {
      ...sale,
      store: storeData,
      promissory: {
        installments: sale.installments,
        installmentValue: sale.installmentValue,
        applyInterest: sale.applyInterest,
        interestRate: sale.interestRate,
        firstDueDate: sale.firstDueDate,
        payableAt: sale.payableAt,
        valueWords: sale.valueWords,
        customDates: [],
      }
    };
    setCurrentSale(fullSale);
    setActiveTab(targetTab);

  };

  // ===================================================
  // Handlers de Templates
  // ===================================================
  const handleSaveTemplate = async (formData, id = null) => {
    try {
      if (id) {
        const updated = await api.put(`/templates/${id}`, formData);
        setTemplates(prev => prev.map(t => t.id === id ? updated : t));
      } else {
        const created = await api.post('/templates', formData);
        setTemplates(prev => [created, ...prev]);
      }
      return true;
    } catch (e) {
      alert(`Erro ao salvar modelo: ${e.message}`);
      return false;
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Excluir este modelo?')) return;
    try {
      await api.delete(`/templates/${id}`);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      alert(`Erro ao excluir: ${e.message}`);
    }
  };

  // ===================================================
  // Loading / Error global
  // ===================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold">Conectando ao banco de dados...</h2>
        <p className="text-gray-400 mt-2">Neon PostgreSQL via Prisma</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-8">
        <div className="bg-red-900/40 border border-red-500 rounded-xl p-8 max-w-xl text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Erro de Conexão</h2>
          <p className="text-gray-300 mb-6">{apiError}</p>
          <button 
            onClick={loadAll} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const stats = {
    customers: customers.length,
    vehicles: availableVehicles.length,
    sales: sales.length,
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            setActiveTab={setActiveTab}
            stats={stats}
            handleNewSale={() => setActiveTab('sale')}
            isSaleActive={!!currentSale}
            isViewOnly={false}
          />
        )}
        {activeTab === 'customers' && (
          <CustomerManager
            customers={customers}
            onSave={handleSaveCustomer}
            onDelete={handleDeleteCustomer}
          />
        )}
        {activeTab === 'vehicles' && (
          <VehicleManager
            vehicles={vehicles}
            onSave={handleSaveVehicle}
            onDelete={handleDeleteVehicle}
          />
        )}
        {activeTab === 'sale' && (
          <SaleManager
            customers={customers}
            vehicles={availableVehicles}
            onSaveSale={handleCreateSale}
          />
        )}
        {activeTab === 'contract_editor' && (
          <ContractManager
            transaction={currentSale}
            storeData={storeData}
          />
        )}
        {activeTab === 'promissory' && (
          <PromissoryManager
            transaction={currentSale}
            storeData={storeData}
          />
        )}
        {activeTab === 'templates' && (
          <TemplateManager
            templates={templates}
            onSave={handleSaveTemplate}
            onDelete={handleDeleteTemplate}
          />
        )}
        {activeTab === 'history' && (
          <History
            sales={sales}
            onLoadSale={handleLoadSale}
            setActiveTab={setActiveTab}
          />
        )}
      </main>
    </div>
  );
};

export default App;

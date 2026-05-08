import React, { useState } from 'react';
import { Menu, X, Home, Users, Car, ShoppingCart, FileText, Printer, History, FileSignature, Settings } from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Painel', icon: <Home size={18} /> },
    { id: 'customers', label: 'Clientes', icon: <Users size={18} /> },
    { id: 'vehicles', label: 'Veículos', icon: <Car size={18} /> },
    { id: 'sale', label: 'Realizar Venda', icon: <ShoppingCart size={18} /> },
    { id: 'contract_editor', label: 'Contratos', icon: <Printer size={18} /> },
    { id: 'promissory', label: 'Promissórias', icon: <FileSignature size={18} /> },
    { id: 'templates', label: 'Modelos', icon: <Settings size={18} /> },
    { id: 'history', label: 'Histórico', icon: <History size={18} /> },
  ];

  return (
    <header className="bg-blue-900 text-white shadow-md print:hidden sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer bg-white px-2 py-1 rounded shadow-sm" onClick={() => setActiveTab('home')}>
            <img src="https://i.im.ge/eJ704X/sss.png" alt="Japan Motors" className="h-8 object-contain mr-2" />
            <span className="font-bold text-lg text-blue-900 tracking-tight">Japan Motors</span>
          </div>

          <nav className="hidden md:flex space-x-1 items-center">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if(item.hidden) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-800 text-white shadow-inner' 
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 pb-3 pt-2 px-2 shadow-inner">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            
            if(item.hidden) return null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center px-3 py-3 rounded-md text-base font-medium mb-1 ${
                  isActive 
                    ? 'bg-blue-900 text-white' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;

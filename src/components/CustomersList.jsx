import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const CustomersList = ({ customers, setCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cpf?.includes(searchTerm)
  );

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja apagar este cliente?")) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Base de Clientes</h1>
          <p className="text-gray-500 text-sm">Gerencie o cadastro de todos os seus compradores</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Buscar por Nome ou CPF..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="p-4 font-semibold">Nome Completo</th>
                <th className="p-4 font-semibold">CPF</th>
                <th className="p-4 font-semibold">Telefone</th>
                <th className="p-4 font-semibold">Cidade</th>
                <th className="p-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer.id || index} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800 uppercase">{customer.name}</td>
                    <td className="p-4 text-gray-600">{customer.cpf}</td>
                    <td className="p-4 text-gray-600">{customer.phone}</td>
                    <td className="p-4 text-gray-600 uppercase">{customer.cityUf}</td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button 
                        onClick={() => handleDelete(customer.id)}
                        className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Nenhum cliente encontrado. Adicione clientes através da aba de Venda Nova.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersList;

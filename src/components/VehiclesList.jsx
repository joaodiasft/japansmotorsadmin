import React, { useState } from 'react';
import { Search, Trash2, Tag } from 'lucide-react';

const VehiclesList = ({ vehicles, setVehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, DISPONIVEL, VENDIDO

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.model?.toLowerCase().includes(searchTerm.toLowerCase()) || v.plate?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja apagar este veículo do estoque?")) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'VENDIDO' ? 'DISPONIVEL' : 'VENDIDO';
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Estoque de Veículos</h1>
          <p className="text-gray-500 text-sm">Controle sua frota disponível e vendida</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-wrap gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Buscar por Modelo ou Placa..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setStatusFilter('ALL')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${statusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setStatusFilter('DISPONIVEL')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${statusFilter === 'DISPONIVEL' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Disponíveis
            </button>
            <button 
              onClick={() => setStatusFilter('VENDIDO')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${statusFilter === 'VENDIDO' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Vendidos
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Veículo / Modelo</th>
                <th className="p-4 font-semibold">Placa</th>
                <th className="p-4 font-semibold">Ano</th>
                <th className="p-4 font-semibold">Cor</th>
                <th className="p-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, index) => (
                  <tr key={vehicle.id || index} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center w-max ${
                          vehicle.status === 'VENDIDO' 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                        title="Clique para alternar o status"
                      >
                        <Tag size={12} className="mr-1" />
                        {vehicle.status || 'DISPONIVEL'}
                      </button>
                    </td>
                    <td className="p-4 font-medium text-gray-800 uppercase">{vehicle.model}</td>
                    <td className="p-4 text-gray-600 uppercase font-mono bg-gray-50 rounded text-center border m-2 inline-block mt-3">{vehicle.plate}</td>
                    <td className="p-4 text-gray-600">{vehicle.year}</td>
                    <td className="p-4 text-gray-600 uppercase">{vehicle.color}</td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button 
                        onClick={() => handleDelete(vehicle.id)}
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
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Nenhum veículo encontrado. Adicione veículos através da aba de Venda Nova.
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

export default VehiclesList;

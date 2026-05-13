import React, { useState } from 'react';
import { History as HistoryIcon, Search, FileText, FileSignature, AlertCircle, Trash2 } from 'lucide-react';
import { api } from '../hooks/useApi';

const History = ({ sales, onLoadSale, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const list = sales ?? [];

  const filtered = list.filter(s =>
    s.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.saleDate?.includes(searchTerm)
  );

  const handleOpenContract = (sale) => {
    onLoadSale(sale, 'contract_editor');
  };

  const handleOpenPromissory = (sale) => {
    onLoadSale(sale, 'promissory');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HistoryIcon size={24} /> Histórico de Vendas
        </h2>
        <div className="relative w-full md:w-72">
          <input type="text" placeholder="Buscar por cliente, veículo ou data..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase">
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold">Comprador</th>
                <th className="p-4 font-semibold">Veículo</th>
                <th className="p-4 font-semibold">Valor Total</th>
                <th className="p-4 font-semibold text-right">Documentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum histórico encontrado.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600 text-sm">{s.saleDate}</td>
                    <td className="p-4 font-medium text-gray-800 uppercase">{s.customer?.name}</td>
                    <td className="p-4 text-gray-600 uppercase">
                      {s.vehicle?.brand} {s.vehicle?.model}
                      <span className="text-xs text-gray-400 ml-1">({s.vehicle?.plate})</span>
                    </td>
                    <td className="p-4 text-green-700 font-bold">R$ {s.totalValue}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenContract(s)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded flex items-center gap-1 border border-blue-200 text-sm">
                          <FileText size={15} /> Contrato
                        </button>
                        <button onClick={() => handleOpenPromissory(s)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded flex items-center gap-1 border border-indigo-200 text-sm">
                          <FileSignature size={15} /> Promissória
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-3 text-right">{filtered.length} venda(s) encontrada(s)</p>
    </div>
  );
};

export default History;

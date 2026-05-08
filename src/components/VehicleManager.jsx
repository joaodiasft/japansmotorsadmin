import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, Tag, Car } from 'lucide-react';
import { api } from '../hooks/useApi';

const STATUS_MAP = {
  available: { label: 'DISPONÍVEL', classes: 'bg-green-50 text-green-700 border-green-200' },
  sold: { label: 'VENDIDO', classes: 'bg-red-50 text-red-700 border-red-200' },
};

const VehicleManager = ({ vehicles, onSave, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    status: 'available', brand: '', model: '', plate: '', year: '', chassis: '',
    renavam: '', color: '', fuelType: '', transmission: '', mileage: '', price: '', notes: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredVehicles = vehicles.filter(v => {
    const label = `${v.brand} ${v.model}`.toLowerCase();
    const matchSearch = label.includes(searchTerm.toLowerCase()) || v.plate?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenForm = (vehicle = null) => {
    if (vehicle) {
      setFormData({ ...initialForm, ...vehicle });
      setEditingId(vehicle.id);
    } else {
      setFormData(initialForm);
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.model) return alert('O modelo é obrigatório!');
    setSaving(true);
    const ok = await onSave(formData, editingId);
    setSaving(false);
    if (ok) setIsFormOpen(false);
  };

  const handleToggleStatus = async (v) => {
    const newStatus = v.status === 'available' ? 'sold' : 'available';
    try {
      await api.put(`/vehicles/${v.id}`, { status: newStatus });
      onSave({ status: newStatus }, v.id); // Atualiza lista local via onSave
    } catch (e) {
      alert(`Erro ao atualizar status: ${e.message}`);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Car className="text-blue-600" />
            {editingId ? 'Editar Veículo' : 'Novo Veículo'}
          </h2>
          <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Marca</label>
            <input name="brand" value={formData.brand || ''} onChange={handleChange} className="w-full border p-2 rounded uppercase" placeholder="TOYOTA" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Modelo *</label>
            <input name="model" value={formData.model || ''} onChange={handleChange} className="w-full border p-2 rounded uppercase" placeholder="COROLLA XEI 2.0" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Placa</label>
            <input name="plate" value={formData.plate || ''} onChange={handleChange} className="w-full border p-2 rounded uppercase font-mono" placeholder="ABC-1234" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Ano Fab/Mod</label>
            <input name="year" value={formData.year || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="2020/2021" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Chassis</label>
            <input name="chassis" value={formData.chassis || ''} onChange={handleChange} className="w-full border p-2 rounded uppercase font-mono text-sm" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Renavam</label>
            <input name="renavam" value={formData.renavam || ''} onChange={handleChange} className="w-full border p-2 rounded font-mono" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cor</label>
            <input name="color" value={formData.color || ''} onChange={handleChange} className="w-full border p-2 rounded uppercase" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Combustível</label>
            <select name="fuelType" value={formData.fuelType || ''} onChange={handleChange} className="w-full border p-2 rounded bg-white">
              <option value="">-- Selecione --</option>
              <option>GASOLINA</option><option>ÁLCOOL</option><option>FLEX</option>
              <option>DIESEL</option><option>GNV</option><option>ELÉTRICO</option><option>HÍBRIDO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Câmbio</label>
            <select name="transmission" value={formData.transmission || ''} onChange={handleChange} className="w-full border p-2 rounded bg-white">
              <option value="">-- Selecione --</option>
              <option>MANUAL</option><option>AUTOMÁTICO</option><option>AUTOMATIZADO</option><option>CVT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Quilometragem</label>
            <input name="mileage" value={formData.mileage || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Ex: 45.000 km" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Preço de Venda (R$)</label>
            <input name="price" value={formData.price || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Ex: 45.000,00" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status || 'available'} onChange={handleChange} className="w-full border p-2 rounded bg-white">
              <option value="available">Disponível</option>
              <option value="sold">Vendido</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Observações</label>
            <textarea rows="2" name="notes" value={formData.notes || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? 'Salvando...' : 'Salvar Veículo'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Estoque de Veículos</h2>
        <div className="flex w-full md:w-auto gap-3 flex-wrap">
          <div className="relative flex-1 md:w-64">
            <input type="text" placeholder="Buscar modelo ou placa..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white">
            <option value="ALL">Todos</option>
            <option value="available">Disponíveis</option>
            <option value="sold">Vendidos</option>
          </select>
          <button onClick={() => handleOpenForm()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm">
            <Plus size={16} /> <span className="hidden sm:inline">Novo Veículo</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 uppercase">
              <th className="p-4 font-semibold">Veículo</th>
              <th className="p-4 font-semibold">Placa</th>
              <th className="p-4 font-semibold">Ano / Cor</th>
              <th className="p-4 font-semibold">KM / Preço</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredVehicles.length === 0 ? (
              <tr><td colSpan="6" className="p-10 text-center text-gray-400">
                {searchTerm ? 'Nenhum resultado para a busca.' : 'Nenhum veículo no estoque ainda.'}
              </td></tr>
            ) : (
              filteredVehicles.map((v) => {
                const st = STATUS_MAP[v.status] || STATUS_MAP.available;
                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800 uppercase">
                      <div>{v.brand} {v.model}</div>
                      <div className="text-xs text-gray-400 font-normal">{v.fuelType} · {v.transmission}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-gray-700 uppercase">{v.plate || '—'}</td>
                    <td className="p-4 text-gray-600">{v.year}<br /><span className="text-xs text-gray-400">{v.color}</span></td>
                    <td className="p-4 text-gray-600">
                      <div className="text-xs">{v.mileage || '—'}</div>
                      <div className="font-bold text-green-700">R$ {v.price || '—'}</div>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleToggleStatus(v)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1 mx-auto transition-colors ${st.classes}`}>
                        <Tag size={11} /> {st.label}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleOpenForm(v)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                        <button onClick={() => onDelete(v.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-400 mt-3 text-right">{filteredVehicles.length} veículo(s) encontrado(s)</p>
    </div>
  );
};

export default VehicleManager;

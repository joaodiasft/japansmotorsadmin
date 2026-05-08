import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, User } from 'lucide-react';

const CustomerManager = ({ customers, onSave, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: '', cpf: '', rg: '', orgaoEmissor: '', nacionalidade: 'Brasileiro(a)',
    estadoCivil: '', profissao: '', address: '', neighborhood: '',
    city: '', state: 'GO', cep: '', phone: '', email: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf?.includes(searchTerm)
  );

  const handleOpenForm = (customer = null) => {
    if (customer) {
      setFormData({ ...initialForm, ...customer });
      setEditingId(customer.id);
    } else {
      setFormData(initialForm);
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return alert('O nome é obrigatório!');
    if (!formData.cpf) return alert('O CPF/CNPJ é obrigatório!');
    setSaving(true);
    const ok = await onSave(formData, editingId);
    setSaving(false);
    if (ok) setIsFormOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-600" />
            {editingId ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo *</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">CPF / CNPJ *</label>
            <input name="cpf" value={formData.cpf} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" placeholder="000.000.000-00" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Identidade (RG)</label>
            <input name="rg" value={formData.rg || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Órgão Emissor / UF</label>
            <input name="orgaoEmissor" value={formData.orgaoEmissor || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="SSP/GO" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nacionalidade</label>
            <input name="nacionalidade" value={formData.nacionalidade || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Estado Civil</label>
            <select name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleChange} className="w-full border p-2 rounded bg-white">
              <option value="">-- Selecione --</option>
              <option>Solteiro(a)</option><option>Casado(a)</option>
              <option>Divorciado(a)</option><option>Viúvo(a)</option><option>União Estável</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Profissão</label>
            <input name="profissao" value={formData.profissao || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Endereço Completo</label>
            <input name="address" value={formData.address || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Rua, Número, Complemento" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Bairro</label>
            <input name="neighborhood" value={formData.neighborhood || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">CEP</label>
            <input name="cep" value={formData.cep || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="00000-000" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cidade</label>
            <input name="city" value={formData.city || ''} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Estado (UF)</label>
            <input name="state" value={formData.state || ''} onChange={handleChange} className="w-full border p-2 rounded" maxLength={2} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Telefone / WhatsApp</label>
            <input name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="(62) 99999-9999" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
            <input name="email" value={formData.email || ''} onChange={handleChange} className="w-full border p-2 rounded" type="email" />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Clientes</h2>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-72">
            <input
              type="text" placeholder="Buscar por nome ou CPF..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
            <Plus size={18} /> <span className="hidden sm:inline">Novo Cliente</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase">
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">CPF/CNPJ</th>
                <th className="p-4 font-semibold">Telefone</th>
                <th className="p-4 font-semibold">Cidade / UF</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">
                  {searchTerm ? 'Nenhum resultado para a busca.' : 'Nenhum cliente cadastrado ainda.'}
                </td></tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{c.name}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{c.cpf}</td>
                    <td className="p-4 text-gray-600">{c.phone}</td>
                    <td className="p-4 text-gray-600">{c.city}{c.state ? `/${c.state}` : ''}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenForm(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Editar"><Edit size={18} /></button>
                        <button onClick={() => onDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-3 text-right">{filteredCustomers.length} cliente(s) encontrado(s)</p>
    </div>
  );
};

export default CustomerManager;

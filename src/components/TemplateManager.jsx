import React, { useState } from 'react';
import { Settings, Save, FileText, Plus, Trash2, Edit, X } from 'lucide-react';

const TemplateManager = ({ templates, onSave, onDelete }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '', isDefault: false });

  const handleOpen = (template = null) => {
    if (template) {
      setFormData({ name: template.name, content: template.content, isDefault: template.isDefault });
      setEditingId(template.id);
    } else {
      setFormData({ name: '', content: '', isDefault: false });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return alert('Nome do modelo é obrigatório!');
    if (!formData.content) return alert('O conteúdo do modelo é obrigatório!');
    setSaving(true);
    const ok = await onSave(formData, editingId);
    setSaving(false);
    if (ok) setIsFormOpen(false);
  };

  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" />
            {editingId ? 'Editar Modelo' : 'Novo Modelo de Contrato'}
          </h2>
          <button onClick={() => setIsFormOpen(false)}><X size={24} className="text-gray-500 hover:text-red-500" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Modelo</label>
            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" placeholder="Ex: Modelo Padrão Japan Motors" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cláusulas e Conteúdo do Contrato</label>
            <textarea rows={12} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed font-mono"
              placeholder="Digite as cláusulas contratuais aqui..." />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isDefault" checked={formData.isDefault}
              onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4" />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">Definir como modelo padrão</label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? 'Salvando...' : 'Salvar Modelo'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Settings size={24} /> Modelos de Contrato</h2>
        <button onClick={() => handleOpen()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus size={18} /> Novo Modelo
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <b>ℹ️ Como funciona:</b> Crie modelos de contrato aqui. No momento da venda, o vendedor escolhe qual modelo usar e os dados do cliente/veículo são inseridos automaticamente.
      </p>

      {templates.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhum modelo cadastrado ainda.</p>
          <button onClick={() => handleOpen()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
            Criar Primeiro Modelo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map(t => (
            <div key={t.id} className="bg-white rounded-xl shadow border border-gray-200 p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{t.name}</h3>
                    {t.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">PADRÃO</span>}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{t.content?.substring(0, 180)}...</p>
                  <p className="text-xs text-gray-400 mt-2">Criado em: {new Date(t.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleOpen(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                  <button onClick={() => onDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;

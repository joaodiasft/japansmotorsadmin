import React, { useState, useEffect } from 'react';
import { Save, User, Car, DollarSign, CalendarClock } from 'lucide-react';
import { parseCurrencyBR, installmentWithInterestFormula, formatCurrencyBR } from '../utils/finance.js';

const calculateDueDate = (startDateStr, monthsToAdd) => {
  if (!startDateStr) return '';
  let date = new Date(startDateStr + 'T12:00:00');
  if (isNaN(date.getTime())) return '';
  const originalDay = date.getDate();
  date.setMonth(date.getMonth() + monthsToAdd);
  if (date.getDate() < originalDay) {
    date.setDate(0); 
  }
  return date.toISOString().split('T')[0];
};

const parseCurrency = (valStr) => {
  if (!valStr) return 0;
  return parseFloat(valStr.replace(/\./g, '').replace(',', '.')) || 0;
};

const SaleManager = ({ customers, vehicles, onSaveSale }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  
  const [saleData, setSaleData] = useState({
    date: new Date().toLocaleDateString('pt-BR'),
    cashValue: '',
    financedValue: '',
    totalValue: '',
    financeHistory: '',
    despachanteFee: '0,00',
    tacFee: '0,00',
    observations: '',
    contractTemplate: 'padrao'
  });

  const [promissoryData, setPromissoryData] = useState({
    installments: '1',
    firstDueDate: '',
    installmentValue: '',
    payableAt: 'Nesta Praça',
    valueWords: '',
    applyInterest: false,
    interestRate: '',
    customDates: []
  });

  // Cálculo Automático de Total
  useEffect(() => {
    const cash = parseCurrency(saleData.cashValue);
    const financed = parseCurrency(saleData.financedValue);
    if (cash > 0 || financed > 0) {
      setSaleData(prev => ({ ...prev, totalValue: (cash + financed).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }));
    }
  }, [saleData.cashValue, saleData.financedValue]);

  // Preenchimento Automático das Datas da Promissória
  useEffect(() => {
    const qtd = Number(promissoryData.installments);
    if (qtd > 0 && promissoryData.firstDueDate) {
      const dates = [];
      for (let i = 0; i < qtd; i++) {
        dates.push(calculateDueDate(promissoryData.firstDueDate, i));
      }
      setPromissoryData(prev => ({ ...prev, customDates: dates }));
    }
  }, [promissoryData.installments, promissoryData.firstDueDate]);

  const handleCustomDateChange = (index, value) => {
    const newDates = [...(promissoryData.customDates || [])];
    newDates[index] = value;
    setPromissoryData({ ...promissoryData, customDates: newDates });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedCustomer || !selectedVehicle) {
      return alert("Selecione um Cliente e um Veículo para a venda.");
    }
    
    const customerObj = (customers ?? []).find(c => c.id === selectedCustomer);
    const vehicleObj = (vehicles ?? []).find(v => v.id === selectedVehicle);

    if (!customerObj || !vehicleObj) {
      return alert('Cliente ou Veículo inválido. Recarregue a página e tente novamente.');
    }

    onSaveSale({
      customer: customerObj,
      vehicle: vehicleObj,
      sale: saleData,
      promissory: promissoryData
    });
  };

  // Pré-visualização da parcela com juros: valor × (% / 100) + (valor / parcelas)
  let finalInstallmentPreview = promissoryData.installmentValue;
  if (promissoryData.applyInterest && promissoryData.interestRate != null && String(promissoryData.interestRate) !== '') {
    const n = Math.max(1, parseInt(String(promissoryData.installments), 10) || 1);
    const f = parseCurrencyBR(saleData.financedValue);
    const valorBase = f > 0 ? f : parseCurrencyBR(promissoryData.installmentValue) * n;
    const rate = parseFloat(String(promissoryData.interestRate).replace(',', '.')) || 0;
    if (valorBase > 0 && rate >= 0) {
      finalInstallmentPreview = formatCurrencyBR(installmentWithInterestFormula(valorBase, rate, n));
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl shadow border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Realizar Nova Venda</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Vínculos */}
        <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4"><User className="mr-2" size={20}/> 1. Vincular Entidades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Selecione o Cliente</label>
              <select 
                required value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full border p-2 rounded bg-white"
              >
                <option value="">-- Escolha na lista --</option>
                {(customers ?? []).map((c) => <option key={c.id} value={c.id}>{c.name} - {c.cpf}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Selecione o Veículo</label>
              <select 
                required value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full border p-2 rounded bg-white"
              >
                <option value="">-- Escolha na lista --</option>
                {(vehicles ?? []).map((v) => (
                  <option key={v.id} value={v.id}>{v.brand} {v.model} - {v.plate}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">* Apenas veículos marcados como 'DISPONÍVEL'.</p>
            </div>
          </div>
        </section>

        {/* Step 2: Venda */}
        <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4"><DollarSign className="mr-2" size={20}/> 2. Dados Financeiros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 uppercase">Data da Venda</label>
            <input required value={saleData.date} onChange={e => setSaleData({...saleData, date: e.target.value})} className="w-full border p-2 rounded" /></div>
            
            <div className="md:col-span-2"><label className="block text-xs font-bold text-indigo-600 uppercase">Modelo do Contrato</label>
            <select value={saleData.contractTemplate} onChange={e => setSaleData({...saleData, contractTemplate: e.target.value})} className="w-full border border-indigo-300 bg-indigo-50 p-2 rounded font-semibold text-indigo-900">
              <option value="padrao">Modelo Padrão (Japan Motors)</option>
              <option value="simples">Modelo 2 (Simplificado)</option>
            </select></div>

            <div><label className="block text-xs font-bold text-gray-500 uppercase">Em Dinheiro (R$)</label>
            <input value={saleData.cashValue} onChange={e => setSaleData({...saleData, cashValue: e.target.value})} className="w-full border p-2 rounded" placeholder="Ex: 10.000,00" /></div>
            
            <div><label className="block text-xs font-bold text-gray-500 uppercase">Financiamento (R$)</label>
            <input value={saleData.financedValue} onChange={e => setSaleData({...saleData, financedValue: e.target.value})} className="w-full border p-2 rounded" placeholder="Ex: 25.000,00" /></div>
            
            <div><label className="block text-xs font-bold text-green-600 uppercase">Valor TOTAL Calculado (R$)</label>
            <input required readOnly value={saleData.totalValue} className="w-full border-green-300 bg-green-50 text-green-800 font-bold p-2 rounded" /></div>

            <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase">Histórico Financiamento</label>
            <input value={saleData.financeHistory} onChange={e => setSaleData({...saleData, financeHistory: e.target.value})} className="w-full border p-2 rounded uppercase" placeholder="BANCORBRAS 48X DE R$ 800" /></div>
            
            <div><label className="block text-xs font-bold text-gray-500 uppercase">Despachante (R$)</label>
            <input value={saleData.despachanteFee} onChange={e => setSaleData({...saleData, despachanteFee: e.target.value})} className="w-full border p-2 rounded" /></div>
            
            <div><label className="block text-xs font-bold text-gray-500 uppercase">TAC (R$)</label>
            <input value={saleData.tacFee} onChange={e => setSaleData({...saleData, tacFee: e.target.value})} className="w-full border p-2 rounded" /></div>

            <div className="md:col-span-3"><label className="block text-xs font-bold text-gray-500 uppercase">Observações do Contrato</label>
            <textarea value={saleData.observations} onChange={e => setSaleData({...saleData, observations: e.target.value})} className="w-full border p-2 rounded" rows="2" /></div>
          </div>
        </section>

        {/* Step 3: Promissória */}
        <section className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-semibold text-indigo-800 flex items-center mb-4"><CalendarClock className="mr-2" size={20}/> 3. Gerador de Promissórias</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div><label className="block text-xs font-bold text-indigo-700 uppercase">Qtd. Parcelas</label>
            <input type="number" min="1" max="120" value={promissoryData.installments} onChange={e => setPromissoryData({...promissoryData, installments: e.target.value})} className="w-full border p-2 rounded" /></div>
            
            <div><label className="block text-xs font-bold text-indigo-700 uppercase">Data 1º Vencimento</label>
            <input type="date" value={promissoryData.firstDueDate} onChange={e => setPromissoryData({...promissoryData, firstDueDate: e.target.value})} className="w-full border p-2 rounded" /></div>

            <div><label className="block text-xs font-bold text-indigo-700 uppercase">Valor Parcela (R$)</label>
            <input value={promissoryData.installmentValue} onChange={e => setPromissoryData({...promissoryData, installmentValue: e.target.value})} className="w-full border p-2 rounded" placeholder="Ex: 500,00" /></div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4 p-3 bg-indigo-100 rounded border border-indigo-200">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="applyInterest" checked={promissoryData.applyInterest} onChange={e => setPromissoryData({...promissoryData, applyInterest: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded" />
              <label htmlFor="applyInterest" className="text-sm font-bold text-indigo-800">Aplicar juros nas parcelas</label>
            </div>
            
            {promissoryData.applyInterest && (
              <div className="flex flex-col gap-2 w-full md:flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <input type="number" placeholder="Taxa %" value={promissoryData.interestRate} onChange={e => setPromissoryData({...promissoryData, interestRate: e.target.value})} className="border border-indigo-300 p-1.5 rounded w-24 text-sm font-bold" />
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                    Valor da parcela (com juros): R$ {finalInstallmentPreview}
                  </span>
                </div>
                <p className="text-xs text-indigo-700 max-w-xl leading-relaxed">
                  Cada parcela = (valor financiado × % de juros ÷ 100) + (valor financiado ÷ quantidade de parcelas). Se não houver valor financiado, usa-se o valor da parcela × quantidade como base.
                </p>
              </div>
            )}
          </div>

          {Number(promissoryData.installments) > 1 && (
            <div className="border border-indigo-200 rounded-lg overflow-hidden bg-white">
              <div className="bg-indigo-100 p-2 text-xs font-bold text-indigo-800 border-b border-indigo-200">Editor de Datas Específicas (Auto-Preenchido com a mesma data nos meses seguintes)</div>
              <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                {Array.from({length: Number(promissoryData.installments)}).map((_, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs font-bold text-gray-600 mb-1">Parc. {idx + 1}</span>
                    <input 
                      type="date" 
                      value={promissoryData.customDates[idx] || ''} 
                      onChange={(e) => handleCustomDateChange(idx, e.target.value)} 
                      className="text-sm p-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 text-lg">
            <Save size={24} /> Concluir e Gerar Documentos
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleManager;

import React, { useEffect } from 'react';
import { Settings, User, Car, DollarSign, FileSignature, CheckCircle, History, Save, Eye, CalendarClock } from 'lucide-react';

const FormWizard = ({
  formSection, setFormSection, data, setData, isViewOnly,
  savedCustomers, savedVehicles, savedSales, savedPromissories,
  selectedCustomerIndex, selectedVehicleIndex, selectedSaleIndex, selectedPromissoryIndex,
  handleLoadCustomer, handleLoadVehicle, handleLoadSale, handleLoadPromissory,
  handleSaveCustomer, handleSaveVehicle, handleSaveSale, handleSavePromissory,
  saveSuccess, saveVehicleSuccess, saveSaleSuccess, savePromissorySuccess,
  getInputProps, handleSaveFullTransaction, setActiveTab
}) => {

  const navItems = [
    { id: 'store', icon: Settings, label: 'Loja' },
    { id: 'customer', icon: User, label: 'Comprador' },
    { id: 'vehicle', icon: Car, label: 'Veículo' },
    { id: 'sale', icon: DollarSign, label: 'Venda' },
    { id: 'promissory', icon: FileSignature, label: 'Promissória' },
  ];

  const handleInterestToggle = () => {
    if (isViewOnly) return;
    setData(prev => ({
      ...prev,
      promissory: {
        ...prev.promissory,
        applyInterest: !prev.promissory.applyInterest
      }
    }));
  };

  const handleCustomDateChange = (index, newValue) => {
    if (isViewOnly) return;
    const newCustomDates = [...(data.promissory.customDates || [])];
    newCustomDates[index] = newValue;
    setData(prev => ({
      ...prev,
      promissory: {
        ...prev.promissory,
        customDates: newCustomDates
      }
    }));
  };

  const handleChange = (section, field, value) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100">
      {/* Sidebar form */}
      <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200 flex flex-col">
        <nav className="space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = formSection === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setFormSection(item.id)} 
                className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-bold shadow-sm' : 'hover:bg-gray-200 text-gray-600 font-medium'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} /> 
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}

          <div className="hidden md:block my-4 border-t border-gray-300 w-full"></div>
          
          {!isViewOnly ? (
            <button 
              onClick={handleSaveFullTransaction} 
              className="flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-md transform hover:-translate-y-0.5 mt-auto"
            >
              <CheckCircle className="w-5 h-5" /> <span className="hidden md:inline">Terminar Venda</span>
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('history')} 
              className="flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold transition-all shadow-md transform hover:-translate-y-0.5 mt-auto"
            >
              <History className="w-5 h-5" /> <span className="hidden md:inline">Voltar ao Histórico</span>
            </button>
          )}
        </nav>
      </div>
      
      {/* Form Fields Area */}
      <div className="flex-1 p-6 md:p-8 bg-white min-h-[500px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize flex items-center">
            {navItems.find(i => i.id === formSection)?.label || 'Dados'}
          </h2>
          
          {/* Ações Especiais do Form (Salvar/Carregar) */}
          {!isViewOnly && formSection !== 'store' && (
            <div className="flex items-center space-x-2 text-sm font-normal bg-gray-50 p-1.5 rounded-lg border border-gray-200">
              <select 
                value={
                  formSection === 'customer' ? selectedCustomerIndex :
                  formSection === 'vehicle' ? selectedVehicleIndex :
                  formSection === 'sale' ? selectedSaleIndex :
                  selectedPromissoryIndex
                } 
                onChange={(e) => {
                  const val = e.target.value;
                  if(formSection === 'customer') handleLoadCustomer(val);
                  else if(formSection === 'vehicle') handleLoadVehicle(val);
                  else if(formSection === 'sale') handleLoadSale(val);
                  else handleLoadPromissory(val);
                }} 
                className="border-none bg-transparent focus:ring-0 text-gray-700 font-medium max-w-[180px] truncate cursor-pointer"
              >
                <option value="">-- Novo / Limpar --</option>
                {formSection === 'customer' && savedCustomers.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
                {formSection === 'vehicle' && savedVehicles.map((v, i) => <option key={i} value={i}>{v.model || 'Veículo'} - {v.plate}</option>)}
                {formSection === 'sale' && savedSales.map((s, i) => <option key={i} value={i}>{s.date} - R$ {s.totalValue || '0,00'}</option>)}
                {formSection === 'promissory' && savedPromissories.map((p, i) => <option key={i} value={i}>{p.installments}x de R$ {p.installmentValue || '0,00'}</option>)}
              </select>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button 
                onClick={() => {
                  if(formSection === 'customer') handleSaveCustomer();
                  else if(formSection === 'vehicle') handleSaveVehicle();
                  else if(formSection === 'sale') handleSaveSale();
                  else handleSavePromissory();
                }} 
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-md flex items-center space-x-1 transition-colors font-semibold"
              >
                <Save className="w-4 h-4" /> <span>Salvar Memo</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        {((saveSuccess && formSection === 'customer') || 
          (saveVehicleSuccess && formSection === 'vehicle') || 
          (saveSaleSuccess && formSection === 'sale') || 
          (savePromissorySuccess && formSection === 'promissory')) && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-3 shadow-sm animate-fade-in-down">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-500" /> 
            <span className="font-medium">Dados memorizados com sucesso para uso futuro!</span>
          </div>
        )}

        {/* Aviso de Modo de Visualização */}
        {isViewOnly && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center space-x-3 shadow-sm">
            <Eye className="w-5 h-5 flex-shrink-0 text-yellow-600" /> 
            <span className="text-sm font-medium leading-relaxed">
              Modo de visualização. Os campos marcados com <strong className="bg-yellow-200 px-1 rounded">JapanMotors Editaar</strong> estão disponíveis para preenchimento. Os demais estão permanentemente bloqueados.
            </span>
          </div>
        )}
        
        {/* Formulário Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Store Fields */}
          {formSection === 'store' && Object.keys(data.store).map(key => (
            <div key={key} className={key === 'address' ? 'col-span-1 md:col-span-2' : ''}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{key === 'cityUf' ? 'Cidade - UF' : key}</label>
              <input type="text" {...getInputProps('store', key)} />
            </div>
          ))}

          {/* Customer Fields */}
          {formSection === 'customer' && (
            <>
              <div className="col-span-1 md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
              <input type="text" {...getInputProps('customer', 'name')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">CPF / CNPJ</label>
              <input type="text" {...getInputProps('customer', 'cpf')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Identidade (RG)</label>
              <input type="text" {...getInputProps('customer', 'rg')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Órgão Emissor / UF</label>
              <input type="text" {...getInputProps('customer', 'orgaoEmissor')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nacionalidade</label>
              <input type="text" {...getInputProps('customer', 'nacionalidade')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Estado Civil</label>
              <input type="text" {...getInputProps('customer', 'estadoCivil')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Profissão</label>
              <input type="text" {...getInputProps('customer', 'profissao')} /></div>

              <div className="col-span-1 md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Endereço Completo</label>
              <input type="text" {...getInputProps('customer', 'address')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bairro</label>
              <input type="text" {...getInputProps('customer', 'neighborhood')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cidade - UF</label>
              <input type="text" {...getInputProps('customer', 'cityUf')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">CEP</label>
              <input type="text" {...getInputProps('customer', 'cep')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Telefone</label>
              <input type="text" {...getInputProps('customer', 'phone')} /></div>

              <div className="col-span-1 md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">E-mail</label>
              <input type="email" {...getInputProps('customer', 'email', 'normal-case')} /></div>
            </>
          )}

          {/* Vehicle Fields */}
          {formSection === 'vehicle' && (
            <>
              <div className="col-span-1 md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Modelo do Veículo</label>
              <input type="text" {...getInputProps('vehicle', 'model')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Placa</label>
              <input type="text" {...getInputProps('vehicle', 'plate')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Ano Fab/Mod</label>
              <input type="text" {...getInputProps('vehicle', 'year')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Chassis</label>
              <input type="text" {...getInputProps('vehicle', 'chassis')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Renavam</label>
              <input type="text" {...getInputProps('vehicle', 'renavam')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cor</label>
              <input type="text" {...getInputProps('vehicle', 'color')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Combustível</label>
              <input type="text" {...getInputProps('vehicle', 'fuel')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Quilometragem</label>
              <input type="text" {...getInputProps('vehicle', 'mileage')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Categoria (Automóvel/Moto/etc)</label>
              <input type="text" {...getInputProps('vehicle', 'category')} /></div>

              <div className="col-span-1 md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Observações do Veículo</label>
              <textarea rows="2" {...getInputProps('vehicle', 'observations', 'normal-case')} /></div>
            </>
          )}

          {/* Sale Fields */}
          {formSection === 'sale' && (
            <>
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Data da Venda</label>
              <input type="text" {...getInputProps('sale', 'date')} /></div>
              
              <div><label className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5">Modelo do Contrato</label>
              <select disabled={isViewOnly} value={data.sale.contractTemplate || 'default'} onChange={(e) => handleChange('sale', 'contractTemplate', e.target.value)} className={`w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 ${isViewOnly ? 'opacity-70 bg-gray-100 cursor-not-allowed' : ''}`}>
                <option value="default">Padrão Atual (Japan Motors)</option>
                <option value="modelo2">Modelo 2 (Em breve)</option>
                <option value="modelo3">Modelo 3 (Em breve)</option>
              </select></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Valor em Dinheiro (R$)</label>
              <input type="text" placeholder="Ex: 40.000,00" {...getInputProps('sale', 'cashValue')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Valor Financiamento (R$)</label>
              <input type="text" placeholder="Ex: 22.900,00" {...getInputProps('sale', 'financedValue')} /></div>
              
              <div><label className="block text-xs font-bold text-green-600 uppercase tracking-wider mb-1.5">Valor TOTAL (R$)</label>
              <input type="text" placeholder="Ex: 62.900,00" {...getInputProps('sale', 'totalValue', 'font-bold text-green-700 bg-green-50 border-green-300')} /></div>
              
              <div className="col-span-1 md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Histórico/Detalhes Financiamento</label>
              <input type="text" {...getInputProps('sale', 'financeHistory')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Taxa Despachante (R$)</label>
              <input type="text" {...getInputProps('sale', 'despachanteFee')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Taxa TAC (R$)</label>
              <input type="text" {...getInputProps('sale', 'tacFee')} /></div>

              <div className="col-span-1 md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Observações Finais (OBS:)</label>
              <textarea rows="3" {...getInputProps('sale', 'observations', 'normal-case')} /></div>
            </>
          )}

          {/* Promissory Fields */}
          {formSection === 'promissory' && (
            <>
              <div className="col-span-1 md:col-span-2 bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-2">
                <p className="text-sm text-indigo-800 flex items-start gap-2">
                  <FileSignature className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70" />
                  <span>Preencha os dados abaixo para gerar suas Promissórias. Utilize o painel abaixo para editar as datas de vencimento caso não sigam o padrão de mês em mês, e ative os Juros se for necessário embutir alguma taxa.</span>
                </p>
              </div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Qtd. de Parcelas</label>
              <input type="number" min="1" max="120" {...getInputProps('promissory', 'installments', 'normal-case')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Data 1º Vencimento</label>
              <input type={isViewOnly && data.promissory.firstDueDate === 'JapanMotors Editaar' ? 'text' : 'date'} {...getInputProps('promissory', 'firstDueDate', 'normal-case')} /></div>

              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Valor Base da Parcela (R$)</label>
              <input type="text" placeholder="Ex: 500,00" {...getInputProps('promissory', 'installmentValue')} /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Praça de Pagamento</label>
              <input type="text" {...getInputProps('promissory', 'payableAt')} /></div>

              <div className="col-span-1 md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Valor por Extenso da Parcela</label>
              <input type="text" placeholder="Ex: Quinhentos Reais" {...getInputProps('promissory', 'valueWords')} /></div>

              {/* Juros Toggle */}
              <div className="col-span-1 md:col-span-2 flex items-center mt-4">
                <button 
                  onClick={handleInterestToggle}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center border ${data.promissory.applyInterest ? 'bg-green-500 border-green-600' : 'bg-gray-200 border-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow absolute transition-transform transform ${data.promissory.applyInterest ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
                <span className="ml-3 text-sm font-bold text-gray-700">Aplicar Juros nas Parcelas da Promissória?</span>
              </div>

              {data.promissory.applyInterest && (
                <div className="col-span-1 md:col-span-2 bg-green-50 p-4 border border-green-200 rounded-lg">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Taxa de Juros (%)</label>
                  <input type="text" placeholder="Ex: 2.5" {...getInputProps('promissory', 'interestRate')} className="w-1/3 border border-gray-300 rounded-md p-2 bg-white" />
                  <p className="text-xs text-green-700 mt-2">Os juros serão calculados no ato da impressão do documento sobre o valor base.</p>
                </div>
              )}

              {/* Editor Visual de Parcelas */}
              {Number(data.promissory.installments) > 1 && (
                <div className="col-span-1 md:col-span-2 mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-700 flex items-center gap-2"><CalendarClock size={16}/> Editor de Datas Personalizadas</span>
                  </div>
                  <div className="p-4 bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                    {Array.from({length: Number(data.promissory.installments)}).map((_, idx) => (
                      <div key={idx} className="flex flex-col bg-white p-2 rounded border border-gray-200 shadow-sm">
                        <span className="text-xs font-bold text-gray-500 mb-1">Parcela {idx + 1}</span>
                        <input 
                          type="date" 
                          disabled={isViewOnly}
                          value={data.promissory.customDates?.[idx] || ''}
                          onChange={(e) => handleCustomDateChange(idx, e.target.value)}
                          className="text-sm p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-white text-xs text-gray-500 border-t border-gray-200">
                    * Deixe a data em branco para que o sistema use o preenchimento automático (1 mês após a anterior).
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormWizard;

import React, { useState } from 'react';
import { Printer, CarFront, FileText, FileSignature, Settings, User, Car, DollarSign, Save, CheckCircle, Home, History, PlusCircle, Eye } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home'); // home, form, contract, promissory, history
  const [formSection, setFormSection] = useState('store');
  
  // Estado para controlar se existe uma venda em andamento (bloqueia as abas se for false)
  const [isSaleActive, setIsSaleActive] = useState(false);
  
  // NOVO: Estado para controlar se a venda atual é apenas para visualização (read-only)
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [currentTxId, setCurrentTxId] = useState(null);
  const [unlockedFields, setUnlockedFields] = useState([]);

  // Histórico Geral de Vendas Completas
  const [savedTransactions, setSavedTransactions] = useState([]);
  
  // Estado do Cliente (Esta era a variável que estava faltando)
  const [savedCustomers, setSavedCustomers] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Novos estados para salvar outras seções
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [saveVehicleSuccess, setSaveVehicleSuccess] = useState(false);
  
  const [savedSales, setSavedSales] = useState([]);
  const [saveSaleSuccess, setSaveSaleSuccess] = useState(false);
  
  const [savedPromissories, setSavedPromissories] = useState([]);
  const [savePromissorySuccess, setSavePromissorySuccess] = useState(false);

  // Estados para controlar os menus suspensos e garantir que limpem na "Nova Venda"
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState('');
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState('');
  const [selectedSaleIndex, setSelectedSaleIndex] = useState('');
  const [selectedPromissoryIndex, setSelectedPromissoryIndex] = useState('');

  const emptyCustomer = {
    name: '', phone: '', address: '', neighborhood: '', cityUf: '', cep: '', rg: '', cpf: ''
  };

  const emptyVehicle = {
    model: '', color: '', fuel: 'BI-COMBUSTIVEL', plate: '', chassis: '', year: '', mileage: ''
  };
  
  const emptySale = {
    date: new Date().toLocaleDateString('pt-BR'), cashValue: '', financedValue: '', totalValue: '',
    financeHistory: 'PROPOSTA Nº - BANCO - CDC APROVADO - PRAZO: 36 VLR PARCELA: R$ ',
    despachanteFee: '1.500,00', tacFee: '2.000,00',
    observations: ''
  };
  
  const emptyPromissory = {
    installments: 1, firstDueDate: '', installmentValue: '', valueWords: '', payableAt: 'Goiânia - GO'
  };

  // Estado unificado para todos os dados
  const [data, setData] = useState({
    store: {
      name: 'NOME DA SUA LOJA VEÍCULOS LTDA',
      cnpj: '00.000.000/0001-00',
      address: 'AV. PRINCIPAL Nº 1000, BAIRRO CENTRO',
      cityUf: 'GOIÂNIA-GO',
      cep: '74000-000',
      phone: '(62) 99999-9999'
    },
    customer: emptyCustomer,
    vehicle: {
      model: '', color: '', fuel: 'BI-COMBUSTIVEL', plate: '', chassis: '', year: '', mileage: ''
    },
    sale: {
      date: new Date().toLocaleDateString('pt-BR'), cashValue: '', financedValue: '', totalValue: '',
      financeHistory: 'PROPOSTA Nº - BANCO - CDC APROVADO - PRAZO: 36 VLR PARCELA: R$ ',
      despachanteFee: '1.500,00', tacFee: '2.000,00',
      observations: 'O cliente levou o carro em seu mecanico de confianca pra fazer revisao do ar condicionado e suspensao.'
    },
    promissory: {
      installments: 1, // Quantidade de parcelas
      firstDueDate: '', // Data do 1º Vencimento
      installmentValue: '', // Valor de cada parcela
      valueWords: '',
      payableAt: 'Goiânia - GO'
    }
  });

  const handleChange = (section, field, value) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Funções de Cliente
  const handleSaveCustomer = () => {
    if (data.customer.name.trim() !== '') {
      setSavedCustomers([...savedCustomers, data.customer]);
      setSaveSuccess(true);
      setSelectedCustomerIndex(savedCustomers.length); // Seleciona o recém salvo
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleLoadCustomer = (index) => {
    setSelectedCustomerIndex(index);
    if (index === '') {
      setData(prev => ({ ...prev, customer: emptyCustomer }));
    } else {
      setData(prev => ({ ...prev, customer: savedCustomers[index] }));
    }
  };

  // Funções de Veículo
  const handleSaveVehicle = () => {
    if (data.vehicle.model.trim() !== '') {
      setSavedVehicles([...savedVehicles, data.vehicle]);
      setSaveVehicleSuccess(true);
      setSelectedVehicleIndex(savedVehicles.length);
      setTimeout(() => setSaveVehicleSuccess(false), 3000);
    }
  };

  const handleLoadVehicle = (index) => {
    setSelectedVehicleIndex(index);
    setData(prev => ({ ...prev, vehicle: index === '' ? emptyVehicle : savedVehicles[index] }));
  };

  // Funções de Venda (Contrato)
  const handleSaveSale = () => {
    if (data.sale.totalValue.trim() !== '') {
      setSavedSales([...savedSales, data.sale]);
      setSaveSaleSuccess(true);
      setSelectedSaleIndex(savedSales.length);
      setTimeout(() => setSaveSaleSuccess(false), 3000);
    }
  };

  const handleLoadSale = (index) => {
    setSelectedSaleIndex(index);
    setData(prev => ({ ...prev, sale: index === '' ? emptySale : savedSales[index] }));
  };

  // Funções de Promissória
  const handleSavePromissory = () => {
    if (data.promissory.installmentValue.trim() !== '') {
      setSavedPromissories([...savedPromissories, data.promissory]);
      setSavePromissorySuccess(true);
      setSelectedPromissoryIndex(savedPromissories.length);
      setTimeout(() => setSavePromissorySuccess(false), 3000);
    }
  };

  const handleLoadPromissory = (index) => {
    setSelectedPromissoryIndex(index);
    setData(prev => ({ ...prev, promissory: index === '' ? emptyPromissory : savedPromissories[index] }));
  };

  // Funções de Venda Geral
  const handleNewSale = () => {
    // Só pede confirmação se houver uma venda ativa E não for apenas visualização
    if (isSaleActive && !isViewOnly) {
      const confirm = window.confirm("Já existe uma venda em andamento. Deseja descartar os dados actuais e começar do zero?");
      if (!confirm) return;
    }

    // Libera (limpa) todos os dados da tela e do contrato, mantendo só os da Loja
    setData({
      store: data.store,
      customer: emptyCustomer,
      vehicle: emptyVehicle,
      sale: { ...emptySale, date: new Date().toLocaleDateString('pt-BR') }, // Atualiza a data pro dia atual
      promissory: emptyPromissory
    });
    
    // Reseta os menus suspensos
    setSelectedCustomerIndex('');
    setSelectedVehicleIndex('');
    setSelectedSaleIndex('');
    setSelectedPromissoryIndex('');
    
    setCurrentTxId(null);
    setUnlockedFields([]);

    // Libera o acesso às abas e garante que NÃO é apenas visualização
    setIsSaleActive(true);
    setIsViewOnly(false);
    setFormSection('customer');
    setActiveTab('form');
  };

  const handleSaveFullTransaction = () => {
    // Função interna para substituir campos vazios antes de salvar
    const processEmptyFields = (currentData) => {
      // Faz uma cópia profunda dos dados para não alterar o formulário ativo imediatamente
      const dataCopy = JSON.parse(JSON.stringify(currentData));
      
      for (const section in dataCopy) {
        for (const key in dataCopy[section]) {
          // Se for string e estiver vazia (ou só com espaços), substitui pelo texto padrão
          if (typeof dataCopy[section][key] === 'string' && dataCopy[section][key].trim() === '') {
            dataCopy[section][key] = 'JapanMotors Editaar';
          }
        }
      }
      return dataCopy;
    };

    const finalData = processEmptyFields(data);

    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleString('pt-BR'),
      ...finalData
    };
    
    setSavedTransactions([newTransaction, ...savedTransactions]);
    
    // Trava as abas novamente após concluir a venda
    setIsSaleActive(false);
    
    alert('Venda finalizada com sucesso!');
    setActiveTab('home'); // Redireciona para a página inicial com os dois menus
  };

  const handleLoadTransaction = (transaction) => {
    setData({
      store: transaction.store,
      customer: transaction.customer,
      vehicle: transaction.vehicle,
      sale: transaction.sale,
      promissory: transaction.promissory
    });
    
    setCurrentTxId(transaction.id);

    // Vasculha todos os campos buscando "JapanMotors Editaar" para destravá-los
    const unlocked = [];
    ['store', 'customer', 'vehicle', 'sale', 'promissory'].forEach(section => {
      Object.keys(transaction[section]).forEach(key => {
        if (transaction[section][key] === 'JapanMotors Editaar') {
          unlocked.push(`${section}.${key}`);
        }
      });
    });
    setUnlockedFields(unlocked);

    // Libera as abas para visualizar/editar a venda do histórico
    setIsSaleActive(true);
    // Trava para ser apenas leitura (read-only)
    setIsViewOnly(true);
    setActiveTab('form');
  };

  const isFieldDisabled = (section, key) => {
    if (!isViewOnly) return false;
    return !unlockedFields.includes(`${section}.${key}`);
  };

  const handleFieldFocus = (section, key) => {
    // Ao clicar num campo de placeholder, limpa para poder digitar
    if (isViewOnly && data[section][key] === 'JapanMotors Editaar') {
      handleChange(section, key, '');
    }
  };

  const handleFieldBlur = (section, key) => {
    if (!isViewOnly) return;
    const fieldPath = `${section}.${key}`;
    
    if (unlockedFields.includes(fieldPath)) {
      const currentValue = String(data[section][key]).trim();
      
      if (currentValue !== '' && currentValue !== 'JapanMotors Editaar') {
        // Digitou um valor válido: Salva, trava o campo e atualiza o histórico
        setUnlockedFields(prev => prev.filter(f => f !== fieldPath));
        
        setSavedTransactions(prev => prev.map(tx => {
          if (tx.id === currentTxId) {
            return { ...tx, [section]: { ...tx[section], [key]: currentValue } };
          }
          return tx;
        }));
      } else if (currentValue === '') {
        // Se deixou em branco, volta para a frase original para continuar destravado
        handleChange(section, key, 'JapanMotors Editaar');
      }
    }
  };

  const getInputProps = (section, key, extraClass = '') => {
    const disabled = isFieldDisabled(section, key);
    const isEditablePlaceholder = isViewOnly && data[section][key] === 'JapanMotors Editaar';
    
    return {
      value: data[section][key],
      onChange: (e) => handleChange(section, key, e.target.value),
      onFocus: () => handleFieldFocus(section, key),
      onBlur: () => handleFieldBlur(section, key),
      disabled: disabled,
      className: `w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 uppercase ${extraClass} ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-70' : ''} ${isEditablePlaceholder ? 'bg-yellow-100 border-yellow-400 text-yellow-800 font-bold' : ''}`
    };
  };

  // Função auxiliar para calcular meses de vencimento
  const calculateDueDate = (firstDateStr, installmentIndex) => {
    if (!firstDateStr) return '';
    let day, month, year;
    
    if (firstDateStr.includes('-')) {
      // Formato prático do calendário nativo (YYYY-MM-DD)
      const parts = firstDateStr.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1 + installmentIndex;
      day = parseInt(parts[2], 10);
    } else if (firstDateStr.includes('/')) {
      // Formato antigo em texto ou importado (DD/MM/AAAA)
      const parts = firstDateStr.split('/');
      if (parts.length === 3) {
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1 + installmentIndex;
        year = parseInt(parts[2], 10);
      } else {
        return firstDateStr;
      }
    } else {
      // Caso seja texto provisório como "JapanMotors Editaar"
      return installmentIndex === 0 ? firstDateStr : `${firstDateStr} (+${installmentIndex}m)`;
    }
    
    year += Math.floor(month / 12);
    month = month % 12;
    
    const date = new Date(year, month, day);
    if (date.getMonth() !== month) {
      date.setDate(0); // Ajusta para o último dia do mês se ultrapassar
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Gera as promissórias e as divide em pares (2 por página)
  const getPromissoryChunks = () => {
    const notes = [];
    const count = parseInt(data.promissory.installments) || 1;
    for (let i = 0; i < count; i++) {
      notes.push({
        number: `${(i + 1).toString().padStart(2, '0')}/${count.toString().padStart(2, '0')}`,
        dueDate: calculateDueDate(data.promissory.firstDueDate, i),
        value: data.promissory.installmentValue,
        valueWords: data.promissory.valueWords,
        payableAt: data.promissory.payableAt
      });
    }
    
    const chunks = [];
    for (let i = 0; i < notes.length; i += 2) {
      chunks.push(notes.slice(i, i + 2));
    }
    return chunks;
  };

  const DottedLine = ({ label, value }) => (
    <div className="flex w-full mb-1 text-sm font-mono">
      <span className="whitespace-nowrap">{label}</span>
      <span className="flex-grow border-b-2 border-dotted border-gray-400 mx-2 mb-1"></span>
      <span className="whitespace-nowrap font-bold">{value || '_______________________'}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      
      {/* HEADER / NAVIGATION (Hidden on Print) */}
      <div className="bg-slate-900 text-white p-4 shadow-md print:hidden flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <CarFront className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold hidden md:block">AutoGestor Contratos</h1>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <button onClick={() => setActiveTab('home')} className={`px-3 md:px-4 py-2 rounded-md flex items-center space-x-2 transition whitespace-nowrap ${activeTab === 'home' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
            <Home className="w-4 h-4" /> <span className="hidden md:inline">Início</span>
          </button>
          
          {/* SÓ MOSTRA HISTÓRICO SE NÃO ESTIVER FAZENDO UMA NOVA VENDA */}
          {!(isSaleActive && !isViewOnly) && (
            <button onClick={() => setActiveTab('history')} className={`px-3 md:px-4 py-2 rounded-md flex items-center space-x-2 transition whitespace-nowrap ${activeTab === 'history' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
              <History className="w-4 h-4" /> <span className="hidden md:inline">Histórico</span>
            </button>
          )}

          {/* SÓ MOSTRA ESTES MENUS SE UMA VENDA ESTIVER ATIVA (INICIADA) */}
          {isSaleActive && (
            <>
              <button onClick={() => setActiveTab('form')} className={`px-3 md:px-4 py-2 rounded-md flex items-center space-x-2 transition whitespace-nowrap ${activeTab === 'form' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
                <Settings className="w-4 h-4" /> <span>Dados</span>
              </button>
              <button onClick={() => setActiveTab('contract')} className={`px-3 md:px-4 py-2 rounded-md flex items-center space-x-2 transition whitespace-nowrap ${activeTab === 'contract' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
                <FileText className="w-4 h-4" /> <span>Contrato</span>
              </button>
              <button onClick={() => setActiveTab('promissory')} className={`px-3 md:px-4 py-2 rounded-md flex items-center space-x-2 transition whitespace-nowrap ${activeTab === 'promissory' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
                <FileSignature className="w-4 h-4" /> <span>Promissória</span>
              </button>
              {activeTab === 'form' && !isViewOnly && (
                <button onClick={handleSaveFullTransaction} className="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md flex items-center space-x-2 ml-2 font-bold transition whitespace-nowrap shadow-md">
                  <CheckCircle className="w-4 h-4" /> <span className="hidden md:inline">Terminar Venda</span>
                </button>
              )}
              {(activeTab === 'contract' || activeTab === 'promissory') && (
                <button onClick={handlePrint} className="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md flex items-center space-x-2 ml-2 font-bold transition whitespace-nowrap">
                  <Printer className="w-4 h-4" /> <span>Imprimir</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-2 md:p-8 print:p-0">
        
        {/* ========================================== */}
        {/* TELA INICIAL (HOME)                        */}
        {/* ========================================== */}
        {activeTab === 'home' && (
          <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Bem-vindo ao AutoGestor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button 
                onClick={handleNewSale}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center border-2 border-transparent hover:border-blue-500 group"
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Nova Venda</h3>
                <p className="text-gray-500 text-center mt-2">
                  {(isSaleActive && !isViewOnly) ? 'Descartar andamento actual e iniciar do zero.' : 'Iniciar um novo preenchimento de contrato.'}
                </p>
              </button>

              {(isSaleActive && !isViewOnly) ? (
                <button 
                  onClick={() => setActiveTab('form')}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center border-2 border-transparent hover:border-indigo-500 group"
                >
                  <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Continuar Venda</h3>
                  <p className="text-gray-500 text-center mt-2">Retornar à venda que já está em andamento.</p>
                </button>
              ) : (
                <button 
                  onClick={() => setActiveTab('history')}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center border-2 border-transparent hover:border-green-500 group"
                >
                  <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <History className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Vendas Realizadas</h3>
                  <p className="text-gray-500 text-center mt-2">Aceder histórico de contratos já emitidos.</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* HISTÓRICO DE VENDAS                        */}
        {/* ========================================== */}
        {activeTab === 'history' && (
           <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6">
             <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <History className="w-6 h-6 text-blue-600" /> Histórico de Vendas
                </h2>
                <button onClick={handleNewSale} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition">
                  <PlusCircle className="w-4 h-4" /> <span>Nova Venda</span>
                </button>
             </div>
             
             {savedTransactions.length === 0 ? (
               <div className="text-center py-10 text-gray-500">
                 Nenhuma venda foi salva no histórico ainda. Preencha uma venda e clique em "Salvar Venda" no menu superior.
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-gray-100 text-gray-700">
                       <th className="p-3 border-b">Data/Hora Salva</th>
                       <th className="p-3 border-b">Cliente</th>
                       <th className="p-3 border-b">Veículo</th>
                       <th className="p-3 border-b">Valor Total</th>
                       <th className="p-3 border-b text-center">Ações</th>
                     </tr>
                   </thead>
                   <tbody>
                     {savedTransactions.map((tx) => (
                       <tr key={tx.id} className="border-b hover:bg-gray-50 transition">
                         <td className="p-3 text-sm text-gray-600">{tx.date}</td>
                         <td className="p-3 font-medium">{tx.customer.name}</td>
                         <td className="p-3">{tx.vehicle.model} - {tx.vehicle.plate}</td>
                         <td className="p-3 text-green-700 font-bold">R$ {tx.sale.totalValue}</td>
                         <td className="p-3 flex justify-center space-x-2">
                           <button onClick={() => handleLoadTransaction(tx)} className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md flex items-center transition space-x-1" title="Abrir Venda">
                             <Eye className="w-4 h-4" /> <span>Abrir</span>
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
           </div>
        )}

        {/* ========================================== */}
        {/* FORMULÁRIO DE ENTRADA DE DADOS */}
        {/* ========================================== */}
        {activeTab === 'form' && (
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* Sidebar form */}
            <div className="w-full md:w-64 bg-slate-50 p-4 border-r border-gray-200">
              <nav className="space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                <button onClick={() => setFormSection('store')} className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 ${formSection === 'store' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200 text-gray-600'}`}>
                  <Settings className="w-5 h-5" /> <span className="hidden md:inline">Loja</span>
                </button>
                <button onClick={() => setFormSection('customer')} className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 ${formSection === 'customer' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200 text-gray-600'}`}>
                  <User className="w-5 h-5" /> <span className="hidden md:inline">Comprador</span>
                </button>
                <button onClick={() => setFormSection('vehicle')} className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 ${formSection === 'vehicle' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200 text-gray-600'}`}>
                  <Car className="w-5 h-5" /> <span className="hidden md:inline">Veículo</span>
                </button>
                <button onClick={() => setFormSection('sale')} className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 ${formSection === 'sale' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200 text-gray-600'}`}>
                  <DollarSign className="w-5 h-5" /> <span className="hidden md:inline">Venda</span>
                </button>
                <button onClick={() => setFormSection('promissory')} className={`flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 ${formSection === 'promissory' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200 text-gray-600'}`}>
                  <FileSignature className="w-5 h-5" /> <span className="hidden md:inline">Promissória</span>
                </button>

                {!isViewOnly ? (
                  <>
                    <div className="hidden md:block my-2 border-t border-gray-300 w-full"></div>
                    <button onClick={handleSaveFullTransaction} className="flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow-md">
                      <CheckCircle className="w-5 h-5" /> <span className="hidden md:inline">Terminar Venda</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block my-2 border-t border-gray-300 w-full"></div>
                    <button onClick={() => setActiveTab('history')} className="flex-shrink-0 w-auto md:w-full text-left px-4 py-3 rounded-md flex items-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold transition shadow-md">
                      <History className="w-5 h-5" /> <span className="hidden md:inline">Voltar ao Histórico</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
            
            {/* Form Fields */}
            <div className="flex-1 p-4 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize border-b pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <span>{formSection === 'store' ? 'Dados da Loja' : formSection === 'customer' ? 'Dados do Cliente' : formSection === 'vehicle' ? 'Dados do Veículo' : formSection === 'sale' ? 'Condições da Venda' : 'Parcelamento (Promissórias)'}</span>
                
                {/* Ações Especiais do Form (Salvar/Carregar) - Esconde se for visualização */}
                {!isViewOnly && formSection === 'customer' && (
                  <div className="flex space-x-2 text-sm font-normal">
                     <select value={selectedCustomerIndex} onChange={(e) => handleLoadCustomer(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate">
                      <option value="">-- Novo / Limpar --</option>
                      {savedCustomers.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
                    </select>
                    <button onClick={handleSaveCustomer} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center space-x-1 transition">
                      <Save className="w-4 h-4" /> <span className="hidden md:inline">Salvar</span>
                    </button>
                  </div>
                )}
                {/* Ações Especiais do Form (Salvar/Carregar) - Esconde se for visualização */}
                {!isViewOnly && formSection === 'vehicle' && (
                  <div className="flex space-x-2 text-sm font-normal">
                     <select value={selectedVehicleIndex} onChange={(e) => handleLoadVehicle(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate">
                      <option value="">-- Novo / Limpar --</option>
                      {savedVehicles.map((v, i) => <option key={i} value={i}>{v.model || 'Veículo'} - {v.plate}</option>)}
                    </select>
                    <button onClick={handleSaveVehicle} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center space-x-1 transition">
                      <Save className="w-4 h-4" /> <span className="hidden md:inline">Salvar</span>
                    </button>
                  </div>
                )}
                {/* Ações Especiais do Form (Salvar/Carregar) - Esconde se for visualização */}
                {!isViewOnly && formSection === 'sale' && (
                  <div className="flex space-x-2 text-sm font-normal">
                     <select value={selectedSaleIndex} onChange={(e) => handleLoadSale(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate">
                      <option value="">-- Nova / Limpar --</option>
                      {savedSales.map((s, i) => <option key={i} value={i}>{s.date} - R$ {s.totalValue || '0,00'}</option>)}
                    </select>
                    <button onClick={handleSaveSale} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center space-x-1 transition">
                      <Save className="w-4 h-4" /> <span className="hidden md:inline">Salvar</span>
                    </button>
                  </div>
                )}
                {/* Ações Especiais do Form (Salvar/Carregar) - Esconde se for visualização */}
                {!isViewOnly && formSection === 'promissory' && (
                  <div className="flex space-x-2 text-sm font-normal">
                     <select value={selectedPromissoryIndex} onChange={(e) => handleLoadPromissory(e.target.value)} className="border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate">
                      <option value="">-- Nova / Limpar --</option>
                      {savedPromissories.map((p, i) => <option key={i} value={i}>{p.installments}x de R$ {p.installmentValue || '0,00'}</option>)}
                    </select>
                    <button onClick={handleSavePromissory} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center space-x-1 transition">
                      <Save className="w-4 h-4" /> <span className="hidden md:inline">Salvar</span>
                    </button>
                  </div>
                )}
              </h2>

              {/* Success Notifications */}
              {saveSuccess && formSection === 'customer' && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" /> <span>Cliente salvo na sessão com sucesso!</span>
                </div>
              )}
              {saveVehicleSuccess && formSection === 'vehicle' && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" /> <span>Veículo salvo na sessão com sucesso!</span>
                </div>
              )}
              {saveSaleSuccess && formSection === 'sale' && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" /> <span>Dados da venda salvos na sessão com sucesso!</span>
                </div>
              )}
              {savePromissorySuccess && formSection === 'promissory' && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" /> <span>Dados da promissória salvos na sessão com sucesso!</span>
                </div>
              )}

              {/* Aviso de Modo de Visualização */}
              {isViewOnly && (
                <div className="mb-6 bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md flex items-center space-x-2 shadow-sm">
                  <Eye className="w-5 h-5 flex-shrink-0" /> 
                  <span className="text-sm font-medium">Modo de visualização. Os campos marcados com "JapanMotors Editaar" estão disponíveis para preenchimento. Os demais estão permanentemente bloqueados.</span>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store Fields */}
                {formSection === 'store' && Object.keys(data.store).map(key => (
                  <div key={key} className={key === 'address' ? 'col-span-1 md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 uppercase mb-1">{key === 'cityUf' ? 'Cidade - UF' : key}</label>
                    <input type="text" {...getInputProps('store', key)} />
                  </div>
                ))}

                {/* Customer Fields */}
                {formSection === 'customer' && Object.keys(data.customer).map(key => (
                  <div key={key} className={key === 'name' || key === 'address' ? 'col-span-1 md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 uppercase mb-1">{key === 'cityUf' ? 'Cidade - UF' : key}</label>
                    <input type="text" {...getInputProps('customer', key)} />
                  </div>
                ))}

                {/* Vehicle Fields */}
                {formSection === 'vehicle' && Object.keys(data.vehicle).map(key => (
                  <div key={key} className={key === 'model' ? 'col-span-1 md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 uppercase mb-1">{key === 'mileage' ? 'Quilometragem' : key === 'year' ? 'Ano Fab/Mod' : key}</label>
                    <input type="text" {...getInputProps('vehicle', key)} />
                  </div>
                ))}

                {/* Sale Fields */}
                {formSection === 'sale' && (
                  <>
                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Data da Venda</label>
                    <input type="text" {...getInputProps('sale', 'date')} /></div>
                    
                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Valor em Dinheiro (R$)</label>
                    <input type="text" placeholder="Ex: 40.000,00" {...getInputProps('sale', 'cashValue')} /></div>
                    
                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Valor Financiamento (R$)</label>
                    <input type="text" placeholder="Ex: 22.900,00" {...getInputProps('sale', 'financedValue')} /></div>
                    
                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Valor TOTAL (R$)</label>
                    <input type="text" placeholder="Ex: 62.900,00" {...getInputProps('sale', 'totalValue', 'font-bold text-green-700')} /></div>
                    
                    <div className="col-span-1 md:col-span-2"><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Histórico/Detalhes Financiamento</label>
                    <input type="text" {...getInputProps('sale', 'financeHistory')} /></div>

                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Taxa Despachante (R$)</label>
                    <input type="text" {...getInputProps('sale', 'despachanteFee')} /></div>
                    
                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Taxa TAC (R$)</label>
                    <input type="text" {...getInputProps('sale', 'tacFee')} /></div>

                    <div className="col-span-1 md:col-span-2"><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Observações Finais (OBS:)</label>
                    <textarea rows="3" {...getInputProps('sale', 'observations', 'normal-case')} /></div>
                  </>
                )}

                {/* Promissory Fields (Multiple) */}
                {formSection === 'promissory' && (
                  <>
                    <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded border border-blue-100 mb-2">
                      <p className="text-sm text-blue-800">
                        Preencha os dados abaixo. O sistema gerará automaticamente <b>várias promissórias</b> baseadas no número de parcelas (acrescentando 1 mês para cada). Serão impressas 2 promissórias por folha A4.
                      </p>
                    </div>

                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Qtd. de Parcelas</label>
                    <input type="number" min="1" max="120" {...getInputProps('promissory', 'installments', 'normal-case')} /></div>
                    
                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Data 1º Vencimento</label>
                    <input type={isViewOnly && data.promissory.firstDueDate === 'JapanMotors Editaar' ? 'text' : 'date'} {...getInputProps('promissory', 'firstDueDate', 'normal-case')} /></div>

                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Valor da Parcela (R$)</label>
                    <input type="text" placeholder="Ex: 500,00" {...getInputProps('promissory', 'installmentValue')} /></div>
                    
                    <div><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Praça de Pagamento</label>
                    <input type="text" {...getInputProps('promissory', 'payableAt')} /></div>

                    <div className="col-span-1 md:col-span-2"><label className="block text-sm font-medium text-gray-700 uppercase mb-1">Valor por Extenso da Parcela</label>
                    <input type="text" placeholder="Ex: Quinhentos Reais" {...getInputProps('promissory', 'valueWords')} /></div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VISUALIZAÇÃO DO CONTRATO (A4 FORMAT)       */}
        {/* ========================================== */}
        {activeTab === 'contract' && (
          <div className="print-container">
            {/* INLINE CSS FOR PRINTING - STRICT A4 FORMAT */}
            <style dangerouslySetInnerHTML={{__html: `
              .print-container { display: flex; flex-direction: column; align-items: center; gap: 20px; background: #e5e7eb; padding-bottom: 40px; }
              .a4-page { width: 210mm; min-height: 297mm; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 15mm 15mm; font-family: 'Courier New', Courier, monospace, Arial; color: #000; position: relative; box-sizing: border-box; }
              .contract-text { font-size: 11px; line-height: 1.4; text-align: justify; }
              .header-logo { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; display: flex; align-items: center; }
              @media print {
                @page { size: A4; margin: 0; }
                body { background: white; margin: 0; padding: 0; }
                .print-container { gap: 0; background: white; padding: 0; display: block; }
                .a4-page { width: 210mm; height: 297mm; box-shadow: none; margin: 0; page-break-after: always; padding: 15mm; }
                .a4-page:last-child { page-break-after: auto; }
                .print\\:hidden { display: none !important; }
              }
            `}} />

            {/* Helper function to generate Header for each page */}
            {(() => {
              const Header = () => (
                <div className="header-logo">
                  <div className="w-24 h-16 mr-4 flex flex-col items-center justify-center border border-gray-400 rounded-md relative overflow-hidden">
                    <CarFront className="w-10 h-10 text-gray-800" />
                    <span className="text-[8px] font-bold mt-1 text-center leading-tight">LOGO AQUI</span>
                  </div>
                  <div className="flex-1 text-center flex flex-col justify-center text-sm font-bold">
                    <p>{data.store.address} - {data.store.cityUf} CEP: {data.store.cep}</p>
                    <p className="text-lg uppercase mt-1">{data.store.name}</p>
                    <p>CNPJ: {data.store.cnpj}</p>
                  </div>
                </div>
              );

              return (
                <>
                  {/* PAGE 1 */}
                  <div className="a4-page">
                    <Header />
                    
                    <h2 className="text-center font-bold text-sm mb-4">CONTRATO DE VENDA</h2>
                    
                    <p className="contract-text mb-4 indent-8">
                      Pelo presente instrumento particular de compra e venda de veículos, os abai_ 
                      xos qualificados como 'VENDEDORA' e 'COMPRADOR', na forma do direito, tem jus 
                      to e contratado a compra e venda do veículo adiante caracterizado, mediante 
                      os termos e condições das seguintes cláusulas:
                    </p>

                    <p className="contract-text mb-4">
                      <b>VENDEDORA: {data.store.name}</b> pessoa jurídica de direito privado inscri_ 
                      ta no CNPJ nº {data.store.cnpj}, com endereço na {data.store.address}, na cidade de {data.store.cityUf}, CEP: {data.store.cep}, com telefone 
                      para contato pelo nº {data.store.phone}.
                    </p>

                    <div className="mb-4">
                      <p className="font-bold text-sm mb-1">® - COMPRADOR</p>
                      <div className="pl-4">
                        <DottedLine label="Nome..........:" value={data.customer.name} />
                        <DottedLine label="Telefone(s)...:" value={data.customer.phone} />
                        <DottedLine label="Endereço......:" value={data.customer.address} />
                        <DottedLine label="Bairro........:" value={data.customer.neighborhood} />
                        <DottedLine label="Cidade - UF...:" value={data.customer.cityUf} />
                        <DottedLine label="CEP...........:" value={data.customer.cep} />
                        <DottedLine label="Identidade....:" value={data.customer.rg} />
                        <DottedLine label="CPF...........:" value={data.customer.cpf} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="font-bold text-sm mb-1">® - OBJETO DO CONTRATO:</p>
                      <div className="pl-4">
                        <DottedLine label="Veículo ......:" value={data.vehicle.model} />
                        <DottedLine label="Cor ..........:" value={data.vehicle.color} />
                        <DottedLine label="Combustível...:" value={data.vehicle.fuel} />
                        <DottedLine label="Placa ........:" value={data.vehicle.plate} />
                        <DottedLine label="Chassis.......:" value={data.vehicle.chassis} />
                        <DottedLine label="Ano Fab / Mod .:" value={data.vehicle.year} />
                        <DottedLine label="Quilometragem .:" value={data.vehicle.mileage} />
                        <DottedLine label="Data da Venda .:" value={data.sale.date} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="font-bold text-sm mb-1">® - PREÇO E CONDIÇÕES DE VENDA:</p>
                      <div className="pl-4">
                        <div className="flex w-full mb-1 text-sm font-mono font-bold">
                          <span className="w-32">Tipo Pagamento</span>
                          <span className="w-24 text-right">Valor R$</span>
                          <span className="ml-4">Histórico</span>
                        </div>
                        <div className="flex w-full mb-1 text-sm font-mono">
                          <span className="w-32">{`->`} DINHEIRO.......:</span>
                          <span className="w-24 text-right font-bold">{data.sale.cashValue || '0,00'}</span>
                          <span className="ml-4"></span>
                        </div>
                        <div className="flex w-full mb-1 text-sm font-mono">
                          <span className="w-32">{`->`} FINANCIAMENTO..:</span>
                          <span className="w-24 text-right font-bold">{data.sale.financedValue || '0,00'}</span>
                          <span className="ml-4 flex-1 break-words">{data.sale.financeHistory}</span>
                        </div>
                        <br/>
                        <div className="flex w-full mb-1 text-sm font-mono">
                          <span className="w-32">{`->`} TOTAL..........:</span>
                          <span className="w-24 text-right font-bold">{data.sale.totalValue || '0,00'}</span>
                          <span className="ml-4"></span>
                        </div>
                      </div>
                    </div>

                    <p className="contract-text mb-2">
                      ® - Ocorrendo o pagamento de parte do valor do bem ora adquirido, através de 
                      veículo de menor valor, responderá o COMPRADOR civil e criminalmente por sua 
                      procedência e/ou pendências por ventura existentes, pelas multas em aberto 
                      que incidirem sobre o aludido veículo até a data da sua efetiva entrega à 
                      VENDEDORA, e ainda evicção de direitos. Condições estas que serão igualmente 
                      impostas à VENDEDORA em relação ao seu produto.
                    </p>

                    <p className="contract-text mb-2">
                      ® - O COMPRADOR declara neste ato que examinou criteriosamente o veículo obje_
                      to deste em todos os seus itens e componentes, verificando o motor, lataria e 
                      o estado geral do mesmo, razão pela qual o adquire no estado em que se apre_
                      senta, não se responsabilizando a VENDEDORA por eventuais alterações no velo_
                      címetro realizadas pelos antigos proprietários, ficando facultado ao COMPRADO 
                      contratar empresa especializada para verificar tal hipótese antes de concre_
                      tizar o negócio, sob pena de perda do direito de reclamação em momento poste_
                      rior.
                    </p>

                    <p className="contract-text">
                      ® - O COMPRADOR declara estar ciente, que será cobrado o valor de <span className="border border-gray-400 px-1 rounded-full">R$ {data.sale.despachanteFee}</span> 
                      referente a taxa de transferência veicular mais 
                      serviços de despachante. Caso na negociação também envolva financiamento, se_
                      rá cobrado o valor de R$ {data.sale.tacFee} de TAC, tarifa de cadastro 
                      do serviço de financiamento.<br/>
                      <b>* DAS CONDIÇÕES DA GARANTIA</b>
                    </p>
                  </div>

                  {/* PAGE 2 */}
                  <div className="a4-page">
                    <Header />
                    
                    <p className="contract-text mb-2">
                      <b>GARANTIA</b> - O COMPRADOR(A) concorda e está ciente que a garantia do veículo é 
                      apenas de <b>MOTOR E CÂMBIO</b> com duração de <b>90 dias</b> ® - O presente contrato 
                      estabelece as condições necessárias e indispensáveis 
                      à concessão de garantia em veículos semi-novos da <b>{data.store.name}</b> e re_
                      gerá-se pelos seguintes termos:
                    </p>
                    
                    <p className="contract-text mb-2">
                      1. A garantia abrange somente o veículo especificado neste contrato. 
                      2. Por se tratar de veículo semi-novo, a garantia se estente exclusivamente a defei_
                      tos de motor e caixa de câmbio, ficando excluídos os defeitos decorrentes de 
                      desgaste natural das demais peças. 
                      3. Sendo veículo adquirido na <b>{data.store.name}</b> e estando enquadrado nas condições da cláusula anterior, ser lhe-
                      á prestado atendimento nas oficinas credenciadas a esta, mediante autorização 
                      expressa por orçamento. 
                      4. A garantia dos itens constantes prevista no termo 
                      2, atendidos os requisitos deste contrato contará a partir da efetiva data de 
                      entrega do veículo e vigorará por 90(noventa) dias, sem prejuízo das prescri_
                      ções contidas nos artigos 18/24 do Código de Defesa do Consumidor. 
                      5. Com re_
                      lação à quilometragem do veículo, fica o <b>COMPRADOR</b> autorizado a auferi-la e 
                      constatar se existe fraude ou não. No silêncio do mesmo fica a <b>{data.store.name}</b> isenta de futuras responsabilidades. 
                      6. As peças substituídas na vi_
                      gência da garantia, quando necessário, passarão a pertencer à <b>{data.store.name}</b>. 
                      7. A substituição do motor e/ou caixa de câmbio, somente será conside_
                      rada na impossibilidade total de seu conserto.
                    </p>

                    <p className="contract-text mb-2">
                      <b>® - São condições indispensáveis e obrigatórias para efetivação da garantia:</b><br/>
                      8.1. Que a reclamação seja feita diretamente na <b>{data.store.name}</b> com en_
                      dereço na <b>{data.store.address}, {data.store.cityUf}</b>.<br/>
                      8.2. Que os defeitos não sejam resultantes de desgastes natural de peças mes_
                      mo que anteriores à data da venda, pois no ato do recebimento do veículo, o 
                      cliente atesta que o mesmo se encontra em plenas condições de funcionamento.<br/>
                      8.3. Que os defeitos, não sejam resultantes ainda, de prolongado desuso, uti_
                      lização inadequada, acidentes de qualquer natureza e casos fortuitos ou de 
                      força maior.<br/>
                      8.4. Que sejam atendidas as orientações e recomendações sobre uso, proteção, 
                      manutenção e conservação do veículo, contidas no manual de instruções do fa_
                      bricante, o qual passa a fazer parte integrante deste.
                    </p>

                    <p className="contract-text mb-2">
                      <b>* DA NÃO COBERTURA DA GARANTIA</b><br/>
                      <b>G.1</b> - Após a retirada do veículo do pátio da <b>VENDEDORA</b>, o <b>COMPRADOR</b> fica res_
                      ponsável por todos efeitos civis ou criminais, assim como multas de trânsito, 
                      débitos fiscais e outros que forem constatados com relação ao veículo objeto 
                      deste contrato, ficando excluídos da garantia todos os itens e peças cujo pro
                      blema é considerado pelo fabricante, decorrente de desgaste natural e que de_
                      vem ser substituídos periodicamente: anéis sincronizadores, disco e pastilha 
                      de freios, velas, cabo de vela, bobina de ignição, vela aquecedora, kit em_
                      breagem (platô, disco, rolamento e atuadores da embreagem), volante do motor, 
                      injetor (bicos injetores), sensores em geral, retentores do motor, anéis de 
                      vedação, correia dentada, tensor da correia, correias de acessórios, rolamen_
                      tos de roda, bateria, alternador, motor de partida, injeção eletrônica, bomba 
                      injetora de bicos, maquina de vidro elétrica e manual, contrapinos, elementos 
                      filtrantes/filtros, velas de ignição, lonas de freios, ar condicionado, esca_
                      pamento, aditivo do líquido do radiador e fluidos e rolamentos do motor, anel 
                      de vedação do bujão de escoamento do óleo do motor, coletor de escape, catali
                      sador, coifas (guarda pó), molas, sistema elétrico, amortecedores, batentes, 
                      terminais de direção, pivô de suspensão, bieletas da barra estabilizadora, 
                      barra axial da direção, coxim motor/cambio, mangueiras em geral, corpo borbo
                      leta, válvula VVT, atuadores em geral, válvula EGR, carcaça e flange da vál
                      vula termostática, tampas de válvulas, pescador de óleo, chave seletora da 
                      marcha, trizetas, tulipa, retentores em geral (câmbio e motor), coluna de di_
                      reção, buchas em geral, estofamento e alinhamento de rodas. Fazem parte de 
                      exclusão todos os materiais de consumo, tais como: óleos lubrificantes, tra_
                      vas para filtro de combustível, líquidos de arrefecimento, filtros, bateria, 
                      guarnições, anéis, parafusos, lâmpadas, todos itens em plástico e borracha, 
                      alarme em geral, conversão para gás, airbag e sistema de navegador (GPS). Se_
                      rão ainda excluídos quaisquer tipos de perdas de líquidos (óleo, água entre 
                      outros), ruídos diversos e desgastes originários de peças de reposição.
                    </p>
                  </div>

                  {/* PAGE 3 */}
                  <div className="a4-page">
                    <Header />

                    <p className="contract-text mb-2">
                      <b>G.2</b> - A presente garantia se restringe ao veículo e suas peças de motor e cai
                      xa de câmbio, não cobrindo quaisquer outras repercussões, mesmo quando decor_
                      rentes de avaria ou defeitos no veiculo, tais como: 
                      1. Despesas de transpor_
                      tes. 2. Imobilização do veículo. 3. Hospedagem. 4. Socorro de Guincho. 5.
                      Pelo decurso de validade. 6. Quando forem executadas as alterações ou modifi_
                      cações no veículo ou qualquer de seus componentes, por oficina mecânica di_
                      versa da indicada pela <b>{data.store.name}</b>. 7. Quando ocorrer danos decor_
                      rentes de mau uso comprovado ou falta de manutenção adequada. 8. Não há garan_
                      tia de pintura. 9. Para fins de comprovação o cliente declara ter vistoriado 
                      a pintura do veiculo mencionado neste contrato, atestando que a mesma se en_
                      contra em boas condições, considerando-se a particularidade de não se tratar 
                      de veículo novo.
                    </p>

                    <p className="contract-text mb-2">
                      <b>H</b> - A titulo de penalidade contratual por arrependimento, fica pactuado uma 
                      multa de 10% (dez por cento), calculada sobre o valor do presente contrato, a 
                      qual será devida pela parte que der causa a sua rescisão, convertida em bene_
                      fício da parte inocente, adquirido esta, neste caso, eficácia de titulo exe_
                      cutivo.
                    </p>

                    <p className="contract-text mb-2">
                      <b>* DISPOSIÇÕES FINAIS</b><br/>
                      <b>®</b> - Na hipótese do <b>COMPRADOR</b> depositar ou transferir quantia a título de si_
                      nal de negócio, fica a <b>VENDEDORA</b> obrigada a reservar o veículo objeto da nego
                      ciação por apenas 48 (quarenta e oito) horas, ou pelo prazo combinado com o 
                      <b>VENDEDOR</b>, e, uma vez frustrado o negócio pelo <b>COMPRADOR</b> - <b>independente do mo_
                      tivo</b> - o valor correspondente a 100% (cem por cento) do sinal será retido pe_
                      la vendedora em caráter de compensação material.<br/>
                      
                      <b>®</b> - Tratando-se de venda com entrega futura, o prazo acima ajustado poderá 
                      ser automaticamente prorrogado por até mais 20 (vinte) dias úteis quando se 
                      verificar atraso por comprovada culpa dos fornecedores ou por motivos de for_
                      ça maior não provocados pela a <b>VENDEDORA</b> e ainda na ocorrência de casos for_
                      tuitos como: greves no setor correlato, fenômenos naturais que possam compro_
                      meter ou inviabilizar o regular transporte do produto até o local de entrega, 
                      ocorrência de sinistros em transportes e outros.<br/>
                      
                      <b>®</b> - Verificando-se atraso na entrega do bem por culpa exclusiva do <b>COMPRA_
                      DOR</b>, entendendo como tais motivos, mais não exclusivamente: a falta de pagamento 
                      do total do preço do bem, ou parcial quando financiado, conforme ajustado na 
                      cláusula 'D', falta de fornecimento de documentos a cargo do <b>COMPRADOR</b> sujei_
                      to à pena contratual neste pactuada.<br/>
                      
                      <b>®</b> - <b>Na hipótese da venda ser realizada com prestações futuras ou ainda fique 
                      algum compromisso financeiro residual a vencer, pelo valor total ou parcial 
                      da venda, representada por qualquer tipo de documento (boleto, cheque, nota 
                      promissória, termo de confissão de dívida, dentre outros), poderá a VENDEDORA 
                      independente de notificação prévia, e, ainda que já tenha sido realizada a 
                      transferência do veículo, REALIZAR COMUNICADO DE VENDA JUNTO AO DETRAN EM no_
                      me da VENDEDORA, persistindo todas suas conseqüências de estilo até que o pa_
                      gamento integral do débito seja realizado pelo COMPRADOR.</b><br/>
                      
                      <b>M.1</b> - Para demonstrar sua ciência e autorização inequívoca quanto ao comuni_
                      cado de venda contida no item ''M'', assim como pela condição de garantia do 
                      item 8.5, ''G'', quanto a exigência da troca do óleo do motor e filtro de ó_
                      leo antes de completar 500(quinhentos) quilometros rodados após a retirada do 
                      veículo do pátio para concessão de garantia, mediante a apresentação de nota 
                      fiscal do serviço, o COMPRADOR, assinará por extenso o campo abaixo, concor_
                      dando com todas as consequências de estilo que foram devidamente explicadas 
                      pela VENDEDORA no ato da compra, para que no futuro não possa ser alegado ig_
                      norância e/ou desconhecimento a respeito desta providência.<br/>
                      <span className="font-mono">Nome: _________________________________________________ / CPF: ______________-____</span>
                    </p>

                    <p className="contract-text mb-4">
                      <b>®</b> - As partes elegem o Foro da Comarca de GOIÂNIA - GO, para dirimir qualquer 
                      controvérsia sobre o presente contrato.<br/>
                      <b>OBS:</b> {data.sale.observations}
                    </p>

                    <p className="contract-text">
                      {data.store.cityUf.split('-')[0]}, {data.sale.date} às {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} horas.
                    </p>
                  </div>

                  {/* PAGE 4 - SIGNATURES */}
                  <div className="a4-page flex flex-col">
                    <Header />
                    
                    <div className="flex-1 mt-20">
                      <div className="grid grid-cols-2 gap-20 px-10">
                        {/* Assinatura Comprador */}
                        <div className="text-center">
                          <div className="border-b border-black mb-2 h-16 flex items-end justify-center font-[cursive] text-lg text-blue-800">
                            {/* Placeholder visual signature area */}
                          </div>
                          <p className="font-bold text-xs">{data.customer.name}</p>
                          <p className="text-[10px]">CPF/CNPJ: {data.customer.cpf}</p>
                        </div>
                        
                        {/* Assinatura Vendedor */}
                        <div className="text-center">
                          <div className="border-b border-black mb-2 h-16 flex items-end justify-center font-[cursive] text-lg text-blue-800">
                             {/* Placeholder visual signature area */}
                          </div>
                          <p className="font-bold text-xs">{data.store.name}</p>
                          <p className="text-[10px]">CNPJ: {data.store.cnpj}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ========================================== */}
        {/* VISUALIZAÇÃO DA NOTA PROMISSÓRIA (2 POR FOLHA)*/}
        {/* ========================================== */}
        {activeTab === 'promissory' && (
          <div className="print-container">
            <style dangerouslySetInnerHTML={{__html: `
              .print-container { display: flex; flex-direction: column; align-items: center; gap: 20px; background: #e5e7eb; padding-bottom: 40px; }
              .a4-page { width: 210mm; min-height: 297mm; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 10mm; display: flex; flex-direction: column; }
              .promissory-wrapper { flex: 1; display: flex; flex-direction: column; justify-content: center; }
              .cut-line { border-bottom: 1px dashed #9ca3af; margin: 10mm 0; position: relative; }
              .cut-line::after { content: '✂'; position: absolute; left: 50%; top: -10px; background: white; padding: 0 10px; color: #9ca3af; }
              .promissory-box { border: 2px solid #000; padding: 15px; background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, #e5e7eb 39px, #e5e7eb 40px); background-position: 0 45px; }
              @media print {
                @page { size: A4; margin: 0; }
                body { background: white; margin: 0; padding: 0; }
                .print-container { background: white; gap: 0; padding: 0; display: block; }
                .a4-page { width: 210mm; height: 297mm; box-shadow: none; margin: 0; padding: 10mm; page-break-after: always; }
                .a4-page:last-child { page-break-after: auto; }
                .print\\:hidden { display: none !important; }
              }
            `}} />
            
            {getPromissoryChunks().map((chunk, pageIndex) => (
              <div key={pageIndex} className="a4-page">
                {chunk.map((note, noteIndex) => (
                  <React.Fragment key={noteIndex}>
                    <div className="promissory-wrapper">
                      <div className="promissory-box relative">
                        <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-2 bg-white">
                          <div>
                            <h1 className="text-xl font-bold uppercase tracking-widest">NOTA PROMISSÓRIA</h1>
                            <p className="text-sm mt-1">Nº: <b>{note.number}</b></p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">VENCIMENTO</p>
                            <div className="border-2 border-black p-1 mt-1 min-w-[120px] text-center font-bold text-md bg-gray-100">
                              {note.dueDate || ' / / '}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">VALOR R$</p>
                            <div className="border-2 border-black p-1 mt-1 min-w-[160px] text-center font-bold text-md bg-gray-100">
                              R$ {note.value || '0,00'}
                            </div>
                          </div>
                        </div>

                        <div className="text-base leading-[40px] font-serif bg-transparent pt-1">
                          <p className="text-justify">
                            Ao vencimento, pagarei(emos) por esta única via de <b>NOTA PROMISSÓRIA</b>, 
                            na praça de <span className="font-bold border-b border-black inline-block min-w-[150px] text-center">{note.payableAt}</span> 
                            ou à sua ordem, a quantia de <span className="font-bold border-b border-black inline-block min-w-[300px] text-center">{note.valueWords || '_________________________________'}</span> 
                            em moeda corrente do país.
                          </p>
                        </div>

                        <div className="mt-8 bg-white pt-2">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="text-xs border border-gray-400 p-2 bg-gray-50 rounded-sm">
                              <p className="font-bold mb-1">DADOS DO EMITENTE (DEVEDOR):</p>
                              <p><b>Nome:</b> {data.customer.name}</p>
                              <p><b>CPF/CNPJ:</b> {data.customer.cpf}</p>
                              <p><b>Endereço:</b> {data.customer.address}, {data.customer.neighborhood}</p>
                              <p><b>Cidade/UF:</b> {data.customer.cityUf}</p>
                              <p><b>CEP:</b> {data.customer.cep}</p>
                            </div>
                            
                            <div className="flex flex-col justify-end items-center text-xs pb-2">
                              <div className="border-b-2 border-black w-full h-8 mb-1"></div>
                              <p className="font-bold">{data.customer.name}</p>
                              <p>Assinatura do Emitente</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-[10px] text-center text-gray-500 bg-white">
                          Emitido em {data.store.cityUf.split('-')[0]}, {data.sale.date}
                        </div>
                      </div>
                    </div>
                    {/* Renderiza a linha de corte apenas se for o primeiro item da página e houver um segundo item */}
                    {noteIndex === 0 && chunk.length === 2 && (
                      <div className="cut-line"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
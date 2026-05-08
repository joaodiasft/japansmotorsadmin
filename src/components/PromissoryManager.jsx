import React from 'react';
import { Printer, AlertCircle, ShieldCheck } from 'lucide-react';

const calculateDueDate = (startDateStr, monthsToAdd) => {
  if (!startDateStr) return '';
  let date;
  if (startDateStr.includes('/')) {
    const [day, month, year] = startDateStr.split('/');
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(startDateStr + 'T12:00:00');
  }

  if (isNaN(date.getTime())) return '';

  const originalDay = date.getDate();
  date.setMonth(date.getMonth() + monthsToAdd);

  if (date.getDate() < originalDay) {
    date.setDate(0); 
  }

  return date.toLocaleDateString('pt-BR');
};

const PromissoryManager = ({ transaction, storeData }) => {
  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto p-12 mt-6 bg-white rounded-xl shadow border border-gray-200 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Nenhuma Venda Ativa</h2>
        <p className="text-gray-500">Para gerar promissórias, realize uma Venda ou carregue pelo Histórico.</p>
      </div>
    );
  }

  const data = transaction;
  const installmentsCount = parseInt(data.promissory.installments) || 1;
  const promissories = Array.from({ length: installmentsCount });

  let finalInstallmentValue = data.promissory.installmentValue;
  if (data.promissory.applyInterest && data.promissory.interestRate) {
    const baseVal = parseFloat(data.promissory.installmentValue.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(baseVal)) {
      const interest = parseFloat(data.promissory.interestRate);
      const withInterest = baseVal + (baseVal * (interest / 100));
      finalInstallmentValue = withInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  // Divisão de páginas (2 promissórias por folha A4)
  const chunks = [];
  for (let i = 0; i < promissories.length; i += 2) {
    chunks.push(promissories.slice(i, i + 2));
  }

  return (
    <div className="max-w-6xl mx-auto p-4 mt-4">
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-md print:hidden border-l-4 border-indigo-600">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><ShieldCheck className="text-indigo-600"/> Emissão de Promissórias</h2>
          <p className="text-sm text-gray-500 mt-1">Design Premium de Autenticidade Financeira. Prontas para impressão e assinatura.</p>
        </div>
        <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
          <Printer size={22} /> Imprimir Documentos
        </button>
      </div>

      <div className="print-container">
        {chunks.map((chunk, pageIndex) => (
          <div key={pageIndex} className="a4-page bg-white flex flex-col justify-start relative pt-12">
            {chunk.map((_, chunkIdx) => {
              const currentInstallment = (pageIndex * 2) + chunkIdx + 1;
              
              let dueDate = '';
              if (data.promissory.customDates && data.promissory.customDates[currentInstallment - 1]) {
                const customDate = new Date(data.promissory.customDates[currentInstallment - 1] + 'T12:00:00');
                dueDate = customDate.toLocaleDateString('pt-BR');
              } else {
                dueDate = calculateDueDate(data.promissory.firstDueDate, currentInstallment - 1);
              }

              return (
                <div key={chunkIdx} className={`w-full ${chunkIdx === 0 ? 'mb-16' : ''} relative overflow-hidden bg-slate-50 border-4 border-double border-slate-800 p-8 rounded-lg shadow-sm`}>
                  
                  {/* Marca d'água de Fundo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <img src="https://i.im.ge/eJ704X/sss.png" alt="Watermark" className="w-[80%] object-contain grayscale" />
                  </div>

                  {/* Faixa lateral decorativa de "segurança" */}
                  <div className="absolute top-0 bottom-0 left-0 w-4 bg-indigo-900 flex flex-col justify-between py-2 items-center text-white/30 text-[8px] font-mono opacity-80" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    <span>DOCUMENTO LEGAL • VALOR FINANCEIRO • NÃO RASURAR</span>
                    <span>JAPAN MOTORS - {new Date().getFullYear()}</span>
                  </div>

                  <div className="pl-6 relative z-10">
                    <div className="flex justify-between items-start mb-8 border-b-2 border-slate-300 pb-6">
                      <div className="w-48 h-20 bg-white p-2 border border-slate-200 rounded flex items-center justify-center shadow-sm">
                        <img src="https://i.im.ge/eJ704X/sss.png" alt="Logo" className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="text-center flex-1 mx-4 pt-1">
                        <h2 className="text-3xl font-extrabold font-serif tracking-widest text-slate-800 uppercase">Nota Promissória</h2>
                        <div className="text-[11px] font-mono text-slate-500 tracking-widest mt-1">GARANTIA DE PAGAMENTO</div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-3">
                        <div className="flex items-center bg-indigo-900 text-white rounded-md overflow-hidden shadow-sm">
                          <span className="font-bold text-xs uppercase px-3 py-2 bg-indigo-950">Vencimento</span>
                          <div className="px-4 py-2 text-center font-bold text-lg font-mono tracking-wider min-w-[120px]">
                            {dueDate}
                          </div>
                        </div>
                        
                        <div className="flex items-center bg-white border border-slate-300 rounded-md overflow-hidden">
                          <span className="font-bold text-xs uppercase px-3 py-1 bg-slate-100 text-slate-600 border-r border-slate-300">Nº Parcela</span>
                          <div className="px-4 py-1 text-center font-bold font-mono text-slate-800">
                            {String(currentInstallment).padStart(2, '0')} / {String(installmentsCount).padStart(2, '0')}
                          </div>
                        </div>

                        <div className="flex items-center border-2 border-indigo-900 rounded-md overflow-hidden bg-white shadow-sm mt-1">
                          <span className="font-bold text-sm px-3 py-2 bg-indigo-100 text-indigo-900">R$</span>
                          <div className="w-32 text-center font-bold text-xl text-indigo-900 font-mono tracking-tight px-2">
                            {finalInstallmentValue}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 text-sm leading-loose text-justify mb-10 text-slate-700 font-serif">
                      <p>
                        Ao(s) <span className="font-bold font-sans bg-white px-3 py-1 border-b border-slate-400 text-slate-900">{dueDate}</span>, pagarei(emos) por esta única via de <span className="font-bold uppercase tracking-wide">Nota Promissória</span> a 
                        <span className="font-bold font-sans bg-white px-3 py-1 border-b border-slate-400 text-slate-900 uppercase ml-2 mr-1">{storeData.name}</span>
                        (CNPJ: <span className="font-bold font-sans">{storeData.cnpj}</span>) ou à sua ordem, a quantia expressa de:
                      </p>
                      
                      <div className="bg-slate-100 border border-slate-300 p-3 font-bold uppercase text-center min-h-[50px] flex items-center justify-center italic text-slate-800 rounded font-sans text-sm">
                        {data.promissory.valueWords || '____________________________________________________________________________________'}
                      </div>

                      <p>
                        Praça de Pagamento: <span className="font-bold font-sans uppercase bg-white px-3 py-1 border-b border-slate-400 text-slate-900">{data.promissory.payableAt}</span>
                      </p>

                      <div className="mt-8 relative">
                        <span className="absolute -top-3 left-4 bg-slate-50 px-2 text-xs font-bold text-slate-400 tracking-widest uppercase">Dados do Emitente</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 border border-slate-300 p-5 rounded-lg bg-white/50 font-sans text-xs">
                          <div className="md:col-span-2">
                            <span className="font-semibold text-slate-500 uppercase text-[10px]">Nome Completo</span>
                            <div className="font-bold text-sm uppercase text-slate-800 border-b border-slate-200 pb-1">{data.customer.name}</div>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-500 uppercase text-[10px]">CPF / CNPJ</span>
                            <div className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-1">{data.customer.cpf}</div>
                          </div>
                          <div className="md:col-span-3">
                            <span className="font-semibold text-slate-500 uppercase text-[10px]">Endereço Completo</span>
                            <div className="font-medium text-sm uppercase text-slate-800 border-b border-slate-200 pb-1">{data.customer.address}, {data.customer.neighborhood} - {data.customer.cityUf}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-16 mb-4">
                      <div className="w-1/2 text-center border-t-2 border-slate-800 pt-2 relative">
                        <span className="absolute -top-[30px] right-0 font-[cursive] text-2xl text-blue-900 opacity-20 pointer-events-none transform -rotate-6">Assinatura Reconhecida</span>
                        <p className="font-bold uppercase text-sm mt-2 text-slate-900">{data.customer.name}</p>
                        <p className="text-xs text-slate-500 font-mono tracking-wider mt-1">ASSINATURA DO EMITENTE / DEVEDOR</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detalhes de Segurança dos cantos */}
                  <div className="absolute top-2 left-6 w-4 h-4 border-t-2 border-l-2 border-slate-400"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-400"></div>
                  <div className="absolute bottom-2 left-6 w-4 h-4 border-b-2 border-l-2 border-slate-400"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-400"></div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromissoryManager;

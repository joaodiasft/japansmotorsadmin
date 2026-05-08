import React from 'react';

const calculateDueDate = (startDateStr, monthsToAdd) => {
  if (!startDateStr) return '';
  if (startDateStr === 'JapanMotors Editaar') return 'JapanMotors Editaar';
  
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

const PromissoryPrint = ({ data }) => {
  const installmentsCount = parseInt(data.promissory.installments) || 1;
  const promissories = Array.from({ length: installmentsCount });

  // Calculate Interest
  let finalInstallmentValue = data.promissory.installmentValue;
  if (data.promissory.applyInterest && data.promissory.interestRate) {
    const baseVal = parseFloat(data.promissory.installmentValue.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(baseVal)) {
      const interest = parseFloat(data.promissory.interestRate);
      const withInterest = baseVal + (baseVal * (interest / 100));
      finalInstallmentValue = withInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  // Chunk promissories into pairs for A4 printing (2 per page)
  const chunks = [];
  for (let i = 0; i < promissories.length; i += 2) {
    chunks.push(promissories.slice(i, i + 2));
  }

  return (
    <div className="print-container">
      {chunks.map((chunk, pageIndex) => (
        <div key={pageIndex} className="a4-page bg-white flex flex-col justify-start">
          {chunk.map((_, chunkIdx) => {
            const currentInstallment = (pageIndex * 2) + chunkIdx + 1;
            
            // Resolve due date
            let dueDate = '';
            if (data.promissory.customDates && data.promissory.customDates[currentInstallment - 1]) {
              const customDate = new Date(data.promissory.customDates[currentInstallment - 1] + 'T12:00:00');
              dueDate = customDate.toLocaleDateString('pt-BR');
            } else {
              dueDate = calculateDueDate(data.promissory.firstDueDate, currentInstallment - 1);
            }

            return (
              <div key={chunkIdx} className={`w-full ${chunkIdx === 0 ? 'mb-12' : ''} border-2 border-gray-800 p-6 relative bg-yellow-50/10`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-48 h-16 border border-gray-400 p-1 flex items-center justify-center bg-white">
                    <img src="https://i.im.ge/eJ704X/sss.png" alt="Japan Motors" className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="text-center flex-1 mx-4 pt-2">
                    <h2 className="text-2xl font-bold font-serif tracking-widest">NOTA PROMISSÓRIA</h2>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm">Vencimento:</span>
                      <div className="border-b border-black w-32 text-center font-bold text-lg">{dueDate}</div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm">Nº:</span>
                      <div className="border-b border-black w-32 text-center font-bold">
                        {String(currentInstallment).padStart(2, '0')}/{String(installmentsCount).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded border border-gray-300">
                      <span className="font-bold">R$</span>
                      <div className="w-28 text-right font-bold text-lg">{finalInstallmentValue}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-sm leading-relaxed text-justify mb-8">
                  <p>
                    Ao(s) <span className="font-bold px-2">{dueDate}</span>, pagarei(emos) por esta única via de <span className="font-bold font-serif">NOTA PROMISSÓRIA</span> a 
                    <span className="font-bold px-2 border-b border-black inline-block min-w-48">{data.store.name}</span>
                    CPF/CNPJ: <span className="font-bold px-2 border-b border-black inline-block min-w-48">{data.store.cnpj}</span> 
                    ou a sua ordem, a quantia de:
                  </p>
                  
                  <div className="bg-gray-100 border border-gray-300 p-2 font-bold uppercase text-center min-h-[40px]">
                    {data.promissory.valueWords || '____________________________________________________________________________________'}
                  </div>

                  <p>
                    Pagável em: <span className="font-bold px-2 border-b border-black inline-block min-w-48">{data.promissory.payableAt}</span>
                  </p>

                  <p>Emitente:</p>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-300 p-3 rounded">
                    <div>
                      <span className="font-semibold text-xs text-gray-500">Nome:</span>
                      <div className="font-bold uppercase">{data.customer.name}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-gray-500">CPF/CNPJ:</span>
                      <div className="font-bold">{data.customer.cpf}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold text-xs text-gray-500">Endereço:</span>
                      <div className="font-medium uppercase">{data.customer.address}, {data.customer.neighborhood} - {data.customer.cityUf}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-12 mb-4">
                  <div className="w-1/2 text-center border-t border-black pt-2">
                    <span className="font-[cursive] text-lg text-blue-800 opacity-0 block h-8">Assinatura</span>
                    <p className="font-bold uppercase text-sm mt-2">{data.customer.name}</p>
                    <p className="text-xs text-gray-600">Assinatura do Emitente</p>
                  </div>
                </div>
                
                {/* Decoration Lines */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gray-400"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gray-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gray-400"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gray-400"></div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default PromissoryPrint;

import React from 'react';
import { Printer, AlertCircle } from 'lucide-react';

const padLabel = (label, length) => {
  return (label + '....................').substring(0, length) + ':';
};

const MonoLine = ({ label, value, padLength = 15 }) => (
  <div className="font-mono text-[12px] leading-[1.3] flex w-full">
    <span className="whitespace-pre">{padLabel(label, padLength)} </span>
    <span className="uppercase font-bold">{value || ''}</span>
  </div>
);

const ContractManager = ({ transaction, storeData }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto p-12 mt-6 bg-white rounded-xl shadow border border-gray-200 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Nenhuma Venda Ativa</h2>
        <p className="text-gray-500">Para visualizar um contrato, vá na aba <b>Realizar Venda</b> e complete uma transação.</p>
      </div>
    );
  }

  const data = transaction;
  const t = data.sale;
  const c = data.customer;
  const v = data.vehicle;

  // Format numbers padStart for alignment
  const padVal = (val) => {
    if (!val) return '      0,00';
    return val.padStart(10, ' ');
  };

  const HeaderInfo = () => (
    <div className="border-b-2 border-black mb-4 flex items-center pb-2">
      <div className="w-40 h-20 mr-4 flex flex-col items-center justify-center relative overflow-hidden">
        <img src="https://i.im.ge/eJ704X/sss.png" alt="Logo" className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 text-center flex flex-col justify-center text-[12px] font-bold leading-tight font-sans">
        <p className="text-base uppercase">{storeData.name}</p>
        <p>{storeData.address} - {storeData.cityUf}</p>
        <p>CEP: {storeData.cep} - CNPJ: {storeData.cnpj}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 mt-4">
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow print:hidden border-l-4 border-blue-600">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Contrato de Compra e Venda</h2>
          <p className="text-sm text-gray-500">Visualização de Impressão Original. Clique em imprimir para gerar o PDF.</p>
        </div>
        <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md">
          <Printer size={20} /> Imprimir Contrato
        </button>
      </div>

      <div className="print-container font-mono text-[11px] text-black">
        
        {/* ================= PAGE 1 ================= */}
        <div className="a4-page bg-white flex flex-col">
          <HeaderInfo />
          
          <h2 className="text-center font-bold text-[13px] mb-3 uppercase mt-1">CONTRATO DE VENDA</h2>
          
          <p className="leading-[1.15] text-justify mb-3">
            Pelo presente instrumento particular de compra e venda de veiculos, os abaixos qualificados como 'VENDEDORA' e 'COMPRADOR', na forma do direito, tem justo e contratado a compra e venda do veiculo adiante caracterizado, mediante os termos e condições das seguintes cláusulas:
          </p>

          <p className="leading-[1.15] text-justify mb-3">
            <b>VENDEDORA: {storeData.name}</b> pessoa jurídica de direito privado inscrita no CNPJ n° {storeData.cnpj}, com endereço na {storeData.address}, na cidade de {storeData.cityUf}, CEP: {storeData.cep}, com telefone para contato pelo n° {storeData.phone}.
          </p>

          <div className="mb-4">
            <p className="font-bold mb-1">® - COMPRADOR</p>
            <div className="pl-4">
              <MonoLine label="Nome" value={c.name} />
              <MonoLine label="Telefone(s)" value={c.phone} />
              <MonoLine label="Endereço" value={c.address} />
              <MonoLine label="Bairro" value={c.neighborhood} />
              <MonoLine label="Cidade - UF" value={c.cityUf} />
              <MonoLine label="CEP" value={c.cep} />
              <MonoLine label="Identidade" value={`${c.rg} ${c.orgaoEmissor}`} />
              <MonoLine label="CPF" value={c.cpf} />
            </div>
          </div>

          <div className="mb-4">
            <p className="font-bold mb-1">® - OBJETO DO CONTRATO:</p>
            <div className="pl-4">
              <MonoLine padLength={16} label="Veiculo " value={`${v.model} ${v.category || ''}`} />
              <MonoLine padLength={16} label="Cor " value={v.color} />
              <MonoLine padLength={16} label="Combustivel" value={v.fuel} />
              <MonoLine padLength={16} label="Placa " value={v.plate} />
              <MonoLine padLength={16} label="Chassis" value={v.chassis} />
              <MonoLine padLength={16} label="Ano Fab / Mod " value={v.year} />
              <MonoLine padLength={16} label="Quilometragem " value={v.mileage} />
              <MonoLine padLength={16} label="Data da Venda " value={t.date} />
            </div>
          </div>

          <div className="mb-2">
            <p className="font-bold mb-1">® - PREÇO E CONDIÇÕES DE VENDA:</p>
            <div className="pl-4">
              <div className="flex w-full mb-[2px]">
                <span className="w-40 whitespace-pre">      Tipo Pagamento</span>
                <span className="w-28 text-right">Valor R$</span>
                <span className="ml-4">Histórico</span>
              </div>
              <div className="flex w-full mb-[2px]">
                <span className="w-40 whitespace-pre">{`-> DINHEIRO.......:`}</span>
                <span className="w-28 text-right font-bold">{padVal(t.cashValue)}</span>
                <span className="ml-4"></span>
              </div>
              <div className="flex w-full mb-2">
                <span className="w-40 whitespace-pre">{`-> FINANCIAMENTO..:`}</span>
                <span className="w-28 text-right font-bold">{padVal(t.financedValue)}</span>
                <span className="ml-4 flex-1 uppercase">{t.financeHistory}</span>
              </div>
              <div className="flex w-full mb-1">
                <span className="w-40 whitespace-pre">{`-> TOTAL..........:`}</span>
                <span className="w-28 text-right font-bold">{padVal(t.totalValue)}</span>
                <span className="ml-4"></span>
              </div>
            </div>
          </div>

          <p className="leading-[1.15] text-justify mb-2">
            ® - Ocorrendo o pagamento de parte do valor do bem ora adquirido, através de veiculo de menor valor, responderá o COMPRADOR civil e criminalmente por sua procedência e/ou pendências por ventura existentes, pelas multas em aberto que incidirem sobre o aludido veiculo até a data da sua efetiva entrega à VENDEDORA, e ainda evicção de direitos. Condições estas que serão igualmente impostas à VENDEDORA em relação ao seu produto.
          </p>

          <p className="leading-[1.15] text-justify mb-2">
            ® - O COMPRADOR declara neste ato que examinou criteriosamente o veiculo objeto deste em todos os seus itens e componentes, verificando o motor, lataria e o estado geral do mesmo, razão pela qual o adquire no estado em que se apresenta, não se responsabilizando a VENDEDORA por eventuais alterações no velocimetro realizadas pelos antigos proprietários, ficando facultado ao COMPRADO contratar empresa especializada para verificar tal hipótese antes de concretizar o negócio, sob pena de perda do direito de reclamação em momento posterior.
          </p>

          <p className="leading-[1.15] text-justify mb-2">
            ® - O COMPRADOR declara estar ciente, que será cobrado o valor de R$ {t.despachanteFee}, referente a taxa de transferência veicular mais serviços de despachante. Caso na negociação também envolva financiamento, será cobrado o valor de R$ {t.tacFee} de TAC, tarifa de cadastro do serviço de financiamento.
          </p>

          <p className="font-bold mt-1">
            * DAS CONDIÇÕES DA GARANTIA
          </p>
        </div>


        {/* ================= PAGE 2 ================= */}
        <div className="a4-page bg-white flex flex-col">
          <HeaderInfo />
          
          <p className="leading-[1.15] text-justify mb-2 mt-4">
            <b>GARANTIA</b> - O COMPRADOR(A) concorda e está ciente que a garantia do veículo é apenas de <b>MOTOR E CÂMBIO</b> com duração de <b>90 dias</b> ® - O presente contrato estabelece as condições necessárias e indispensáveis à concessão de garantia em veículos semi-novos da <b>{storeData.name}</b> e regerá-se pelos seguintes termos:<br/>
            1. A garantia abrange somente o veiculo especificado neste contrato. 2. Por se tratar de veiculo semi-novo, a garantia se estente exclusivamente a defeitos de motor e caixa de câmbio, ficando excluidos os defeitos decorrentes de desgaste natural das demais peças. 3. Sendo veiculo adquirido na <b>{storeData.name}</b> e estando enquadrado nas condições da cláusula anterior, ser lhe-á prestado atendimento nas oficinas credenciadas a esta, mediante autorização expressa por orçamento. 4. A garantia dos itens constantes prevista no termo 2, atendidos os requisitos deste contrato contará a partir da efetiva data de entrega do veiculo e vigorará por 90(noventa) dias, sem prejuizo das prescrições contidas nos artigos 18/24 do Código de Defesa do Consumidor. 5. Com relação à quilometragem do veiculo, fica o COMPRADOR autorizado a auferi-la e constatar se existe fraude ou não. No silêncio do mesmo fica a <b>{storeData.name}</b> isenta de futuras responsabilidades. 6.As peças substituídas na vigência da garantia, quando necessário, passarão a pertencer à <b>{storeData.name}</b>. 7. A substituição do motor e/ou caixa de câmbio, somente será considerada na impossibilidade total de seu conserto.
          </p>

          <p className="leading-[1.15] text-justify mb-2">
            <b>® - São condições indispensáveis e obrigatórias para efetivação da garantia:</b><br/>
            8.1. Que a reclamação seja feita diretamente na <b>{storeData.name}</b> com endereço na <b>{storeData.address}, {storeData.cityUf}</b>.<br/>
            8.2. Que os defeitos não sejam resultantes de desgastes natural de peças mesmo que anteriores à data da venda, pois no ato do recebimento do veiculo, o cliente atesta que o mesmo se encontra em plenas condições de funcionamento.<br/>
            8.3. Que os defeitos, não sejam resultantes ainda, de prolongado desuso, utilização inadequada, acidentes de qualquer natureza e casos fortuitos ou de força maior.<br/>
            8.4. Que sejam atendidas as orientações e recomendações sobre uso, proteção, manutenção e conservação do veiculo, contidas no manual de instruções do fabricante, o qual passa a fazer parte integrante deste.
          </p>

          <p className="font-bold mb-1">
            * DA NÃO COBERTURA DA GARANTIA
          </p>

          <p className="leading-[1.15] text-justify mb-2">
            <b>G.1</b> - Após a retirada do veículo do pátio da VENDEDORA, o COMPRADOR fica responsável por todos efeitos civis ou criminais, assim como multas de trânsito, débitos fiscais e outros que forem constatados com relação ao veiculo objeto deste contrato, ficando excluidos da garantia todos os itens e peças cujo problema é considerado pelo fabricante, decorrente de desgaste natural e que devem ser substituidos periodicamente: anéis sincronizadores, disco e pastilha de freios, velas, cabo de vela, bobina de ignição, vela aquecedora, kit embreagem (platô, disco, rolamento e atuadores da embreagem), volante do motor, injetor (bicos injetores), sensores em geral, retentores do motor, anéis de vedação, correia dentada, tensor da correia, correias de acessórios, rolamentos de roda, bateria, alternador, motor de partida, injeção eletrônica, bomba injetora de bicos, maquina de vidro elétrica e manual, contrapinos, elementos filtrantes/filtros, velas de ignição, lonas de freios, ar condicionado, escapamento, aditivo do liquido do radiador e fluidos e rolamentos do motor, anel de vedação do bujão de escoamento do óleo do motor, coletor de escape, catalisador, coifas (guarda pó), molas, sistema elétrico, amortecedores, batentes, terminais de direção, pivô de suspensão, bieletas da barra estabilizadora, barra axial da direção, coxim motor/cambio, mangueiras em geral, corpo borboleta, válvula VVT, atuadores em geral, válvula EGR, carcaça e flange da válvula termostática, tampas de válvulas, pescador de óleo, chave seletora da marcha, trizetas, tulipa, retentores em geral (câmbio e motor), coluna de direção, buchas em geral, estofamento e alinhamento de rodas. Fazem parte de exclusão todos os materiais de consumo, tais como: óleos lubrificantes, travas para filtro de combustivel, liquidos de arrefecimento, filtros, bateria, guarnições, anéis, parafusos, lâmpadas, todos itens em plástico e borracha, alarme em geral, conversão para gás, airbag e sistema de navegador (GPS). Serão ainda excluidos quaisquer tipos de perdas de liquidos (óleo, água entre outros), ruidos diversos e desgastes originários de peças de reposição.
          </p>
        </div>


        {/* ================= PAGE 3 ================= */}
        <div className="a4-page bg-white flex flex-col">
          <HeaderInfo />

          <p className="leading-[1.15] text-justify mb-2 mt-4">
            <b>G.2</b> - A presente garantia se restringe ao veiculo e suas peças de motor e caixa de câmbio, não cobrindo quaisquer outras repercussões, mesmo quando decorrentes de avaria ou defeitos no veiculo, tais como: 1. Despesas de transportes. 2. Imobilização do veiculo. 3. Hospedagem. 4. Socorro de Guincho. 5. Pelo decurso de validade. 6. Quando forem executadas as alterações ou modificações no veiculo ou qualquer de seus componentes, por oficina mecânica diversa da indicada pela <b>{storeData.name}</b>. 7. Quando ocorrer danos decorrentes de mau uso comprovado ou falta de manutenção adequada. 8. Não há garantia de pintura. 9. Para fins de comprovação o cliente declara ter vistoriado a pintura do veiculo mencionado neste contrato, atestando que a mesma se encontra em boas condições, considerando-se a particularidade de não se tratar de veiculo novo.
          </p>

          <p className="leading-[1.15] text-justify mb-2">
            <b>H</b> - A titulo de penalidade contratual por arrependimento, fica pactuado uma multa de 10% (dez por cento), calculada sobre o valor do presente contrato, a qual será devida pela parte que der causa a sua rescisão, convertida em benefício da parte inocente, adquirido esta, neste caso, eficácia de titulo executivo.
          </p>

          <p className="font-bold mb-1">
            * DISPOSIÇÕES FINAIS
          </p>

          <p className="leading-[1.15] text-justify mb-2">
            <b>®</b> - Na hipótese do COMPRADOR depositar ou transferir quantia a título de sinal de negócio, fica a VENDEDORA obrigada a reservar o veiculo objeto da negociação por apenas 48 (quarenta e oito) horas, ou pelo prazo combinado com o VENDEDOR, e, uma vez frustrado o negócio pelo COMPRADOR - independente do motivo - o valor correspondente a 100% (cem por cento) do sinal será retido pela vendedora em caráter de compensação material.<br/>
            
            <b>®</b> - Tratando-se de venda com entrega futura, o prazo acima ajustado poderá ser automaticamente prorrogado por até mais 20 (vinte) dias úteis quando se verificar atraso por comprovada culpa dos fornecedores ou por motivos de força maior não provocados pela a VENDEDORA e ainda na ocorrência de casos fortuitos como: greves no setor correlato, fenômenos naturais que possam comprometer ou inviabilizar o regular transporte do produto até o local de entrega, ocorrência de sinistros em transportes e outros.<br/>
            
            <b>®</b> - Verificando-se atraso na entrega do bem por culpa exclusiva do COMPRADOR, entendendo como tais motivos, mais não exclusivamente: a falta de pagamento do total do preço do bem, ou parcial quando financiado, conforme ajustado na cláusula 'D', falta de fornecimento de documentos a cargo do COMPRADOR sujeito à pena contratual neste pactuada.<br/>
            
            <b>® - Na hipótese da venda ser realizada com prestações futuras ou ainda fique algum compromisso financeiro residual a vencer, pelo valor total ou parcial da venda, representada por qualquer tipo de documento (boleto, cheque, nota promissória, termo de confissão de dívida, dentre outros), poderá a VENDEDORA independente de notificação prévia, e, ainda que já tenha sido realizada a transferência do veiculo, REALIZAR COMUNICADO DE VENDA JUNTO AO DETRAN EM nome da VENDEDORA, persistindo todas suas conseqüências de estilo até que o pagamento integral do débito seja realizado pelo COMPRADOR.</b><br/>
            
            <b>M.1</b> - Para demonstrar sua ciência e autorização inequívoca quanto ao comunicado de venda contida no item ''M'', assim como pela condição de garantia do item 8.5, ''G'', quanto a exigência da troca do óleo do motor e filtro de óleo antes de completar 500(quinhentos) quilometros rodados após a retirada do veículo do pátio para concessão de garantia, mediante a apresentação de nota fiscal do serviço, o COMPRADOR, assinará por extenso o campo abaixo, concordando com todas as consequências de estilo que foram devidamente explicadas pela VENDEDORA no ato da compra, para que no futuro não possa ser alegado ignorância e/ou desconhecimento a respeito desta providência.<br/>
            Nome: _______________________________________________________ / CPF: ____________________
          </p>

          <p className="leading-[1.15] text-justify mb-2">
            <b>®</b> - As partes elegem o Foro da Comarca de GOIÂNIA - GO, para dirimir qualquer controvérsia sobre o presente contrato.
          </p>

          {t.observations && (
            <p className="leading-[1.15] text-justify mb-2">
              OBS: <span className="uppercase">{t.observations}</span>
            </p>
          )}

          <p className="leading-[1.15] text-justify mt-4 uppercase">
            GOIÂNIA, {t.date} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })} horas.
          </p>
        </div>


        {/* ================= PAGE 4 - SIGNATURES ================= */}
        <div className="a4-page bg-white flex flex-col">
          <HeaderInfo />
          
          <div className="mt-8 px-8 flex justify-between items-start">
            <div className="w-[45%]">
              <div className="border-b border-black mb-1 h-20 flex items-end font-[cursive] text-lg text-blue-800"></div>
              <p className="font-bold uppercase text-[12px]">{c.name}</p>
              <p className="text-[12px]">CPF/CNPJ: {c.cpf}</p>
            </div>
            
            <div className="w-[45%]">
              <div className="border-b border-black mb-1 h-20 flex items-end font-[cursive] text-lg text-blue-800"></div>
              <p className="font-bold uppercase text-[12px]">{storeData.name}</p>
              <p className="text-[12px]">CNPJ: {storeData.cnpj}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContractManager;

import React from 'react';

const DottedLine = ({ label, value }) => (
  <div className="flex w-full mb-1 text-sm font-mono">
    <span className="whitespace-nowrap">{label}</span>
    <span className="flex-grow border-b-2 border-dotted border-gray-400 mx-2 mb-1"></span>
    <span className="whitespace-nowrap font-bold uppercase">{value || '_______________________'}</span>
  </div>
);

const ContractPrint = ({ data }) => {
  const Header = () => (
    <div className="border-b-2 border-black mb-4 flex items-center pb-2">
      <div className="w-40 h-20 mr-4 flex flex-col items-center justify-center relative overflow-hidden">
        <img src="https://i.im.ge/eJ704X/sss.png" alt="Japan Motors Logo" className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 text-center flex flex-col justify-center text-sm font-bold">
        <p className="text-lg uppercase">{data.store.name}</p>
        <p>{data.store.address} - {data.store.cityUf} CEP: {data.store.cep}</p>
        <p>CNPJ: {data.store.cnpj} - Fone: {data.store.phone}</p>
      </div>
    </div>
  );

  return (
    <div className="print-container">
      {/* PAGE 1 */}
      <div className="a4-page bg-white">
        <Header />
        
        <h2 className="text-center font-bold text-sm mb-4">CONTRATO DE COMPRA E VENDA DE VEÍCULOS</h2>
        
        <p className="text-[11px] leading-snug text-justify mb-3 indent-8">
          Pelo presente instrumento particular de compra e venda de veículos, os abaixo qualificados como 'VENDEDORA' e 'COMPRADOR', na forma do direito, tem justo e contratado a compra e venda do veículo adiante caracterizado, mediante os termos e condições das seguintes cláusulas:
        </p>

        <p className="text-[11px] leading-snug text-justify mb-3">
          <b>VENDEDORA: {data.store.name}</b> pessoa jurídica de direito privado inscrita no CNPJ nº {data.store.cnpj}, com endereço na {data.store.address}, na cidade de {data.store.cityUf}, CEP: {data.store.cep}, com telefone para contato pelo nº {data.store.phone}.
        </p>

        <div className="mb-4">
          <p className="font-bold text-sm mb-1">® - COMPRADOR</p>
          <div className="pl-4">
            <DottedLine label="Nome..........:" value={data.customer.name} />
            <DottedLine label="Nacionalidade.:" value={data.customer.nacionalidade} />
            <DottedLine label="Estado Civil..:" value={data.customer.estadoCivil} />
            <DottedLine label="Profissão.....:" value={data.customer.profissao} />
            <DottedLine label="Identidade/RG.:" value={`${data.customer.rg} - ${data.customer.orgaoEmissor}`} />
            <DottedLine label="CPF/CNPJ......:" value={data.customer.cpf} />
            <DottedLine label="Endereço......:" value={data.customer.address} />
            <DottedLine label="Bairro........:" value={data.customer.neighborhood} />
            <DottedLine label="Cidade - UF...:" value={data.customer.cityUf} />
            <DottedLine label="CEP...........:" value={data.customer.cep} />
            <DottedLine label="Telefone(s)...:" value={data.customer.phone} />
            <DottedLine label="E-mail........:" value={data.customer.email} />
          </div>
        </div>

        <div className="mb-4">
          <p className="font-bold text-sm mb-1">® - OBJETO DO CONTRATO:</p>
          <div className="pl-4">
            <DottedLine label="Veículo / Cat.:" value={`${data.vehicle.model} - ${data.vehicle.category}`} />
            <DottedLine label="Cor ..........:" value={data.vehicle.color} />
            <DottedLine label="Combustível...:" value={data.vehicle.fuel} />
            <DottedLine label="Placa ........:" value={data.vehicle.plate} />
            <DottedLine label="Chassis.......:" value={data.vehicle.chassis} />
            <DottedLine label="Renavam.......:" value={data.vehicle.renavam} />
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
              <span className="ml-4 flex-1 break-words uppercase">{data.sale.financeHistory}</span>
            </div>
            <br/>
            <div className="flex w-full mb-1 text-sm font-mono border-t border-black pt-1">
              <span className="w-32">{`->`} TOTAL..........:</span>
              <span className="w-24 text-right font-bold">{data.sale.totalValue || '0,00'}</span>
              <span className="ml-4"></span>
            </div>
          </div>
        </div>

        <p className="text-[11px] leading-snug text-justify mb-2">
          ® - Ocorrendo o pagamento de parte do valor do bem ora adquirido, através de veículo de menor valor, responderá o COMPRADOR civil e criminalmente por sua procedência e/ou pendências por ventura existentes, pelas multas em aberto que incidirem sobre o aludido veículo até a data da sua efetiva entrega à VENDEDORA, e ainda evicção de direitos. Condições estas que serão igualmente impostas à VENDEDORA em relação ao seu produto.
        </p>

        <p className="text-[11px] leading-snug text-justify mb-2">
          ® - O COMPRADOR declara neste ato que examinou criteriosamente o veículo objeto deste em todos os seus itens e componentes, verificando o motor, lataria e o estado geral do mesmo, razão pela qual o adquire no estado em que se apresenta, não se responsabilizando a VENDEDORA por eventuais alterações no velocímetro realizadas pelos antigos proprietários, ficando facultado ao COMPRADOR contratar empresa especializada para verificar tal hipótese antes de concretizar o negócio, sob pena de perda do direito de reclamação em momento posterior.
        </p>
      </div>

      {/* PAGE 2 */}
      <div className="a4-page bg-white">
        <Header />
        
        <p className="text-[11px] leading-snug text-justify">
          ® - O COMPRADOR declara estar ciente, que será cobrado o valor de <span className="border border-gray-400 px-1 rounded-full font-bold">R$ {data.sale.despachanteFee}</span> referente a taxa de transferência veicular mais serviços de despachante. Caso na negociação também envolva financiamento, será cobrado o valor de R$ {data.sale.tacFee} de TAC, tarifa de cadastro do serviço de financiamento.<br/>
          <b>* DAS CONDIÇÕES DA GARANTIA</b>
        </p>

        <p className="text-[11px] leading-snug text-justify mb-2">
          <b>GARANTIA</b> - O COMPRADOR(A) concorda e está ciente que a garantia do veículo é apenas de <b>MOTOR E CÂMBIO</b> com duração de <b>90 dias</b> ® - O presente contrato estabelece as condições necessárias e indispensáveis à concessão de garantia em veículos semi-novos da <b>{data.store.name}</b> e regerá-se pelos seguintes termos:
        </p>
        
        <p className="text-[11px] leading-snug text-justify mb-2">
          1. A garantia abrange somente o veículo especificado neste contrato. 2. Por se tratar de veículo semi-novo, a garantia se estende exclusivamente a defeitos de motor e caixa de câmbio, ficando excluídos os defeitos decorrentes de desgaste natural das demais peças. 3. Sendo veículo adquirido na <b>{data.store.name}</b> e estando enquadrado nas condições da cláusula anterior, ser lhe-á prestado atendimento nas oficinas credenciadas a esta, mediante autorização expressa por orçamento. 4. A garantia dos itens constantes prevista no termo 2, atendidos os requisitos deste contrato contará a partir da efetiva data de entrega do veículo e vigorará por 90(noventa) dias, sem prejuízo das prescrições contidas nos artigos 18/24 do Código de Defesa do Consumidor. 5. Com relação à quilometragem do veículo, fica o <b>COMPRADOR</b> autorizado a auferi-la e constatar se existe fraude ou não. No silêncio do mesmo fica a <b>{data.store.name}</b> isenta de futuras responsabilidades. 6. As peças substituídas na vigência da garantia, quando necessário, passarão a pertencer à <b>{data.store.name}</b>. 7. A substituição do motor e/ou caixa de câmbio, somente será considerada na impossibilidade total de seu conserto.
        </p>

        <p className="text-[11px] leading-snug text-justify mb-2">
          <b>® - São condições indispensáveis e obrigatórias para efetivação da garantia:</b><br/>
          8.1. Que a reclamação seja feita diretamente na <b>{data.store.name}</b> com endereço na <b>{data.store.address}, {data.store.cityUf}</b>.<br/>
          8.2. Que os defeitos não sejam resultantes de desgastes natural de peças mesmo que anteriores à data da venda, pois no ato do recebimento do veículo, o cliente atesta que o mesmo se encontra em plenas condições de funcionamento.<br/>
          8.3. Que os defeitos, não sejam resultantes ainda, de prolongado desuso, utilização inadequada, acidentes de qualquer natureza e casos fortuitos ou de força maior.<br/>
          8.4. Que sejam atendidas as orientações e recomendações sobre uso, proteção, manutenção e conservação do veículo, contidas no manual de instruções do fabricante, o qual passa a fazer parte integrante deste.
        </p>

        <p className="text-[11px] leading-snug text-justify mb-2">
          <b>* DA NÃO COBERTURA DA GARANTIA</b><br/>
          <b>G.1</b> - Após a retirada do veículo do pátio da <b>VENDEDORA</b>, o <b>COMPRADOR</b> fica responsável por todos efeitos civis ou criminais, assim como multas de trânsito, débitos fiscais e outros que forem constatados com relação ao veículo objeto deste contrato, ficando excluídos da garantia todos os itens e peças cujo problema é considerado pelo fabricante, decorrente de desgaste natural e que devem ser substituídos periodicamente: anéis sincronizadores, disco e pastilha de freios, velas, cabo de vela, bobina de ignição, vela aquecedora, kit embreagem (platô, disco, rolamento e atuadores da embreagem), volante do motor, injetor (bicos injetores), sensores em geral, retentores do motor, anéis de vedação, correia dentada, tensor da correia, correias de acessórios, rolamentos de roda, bateria, alternador, motor de partida, injeção eletrônica, bomba injetora de bicos, maquina de vidro elétrica e manual, contrapinos, elementos filtrantes/filtros, velas de ignição, lonas de freios, ar condicionado, escapamento, aditivo do líquido do radiador e fluidos e rolamentos do motor, anel de vedação do bujão de escoamento do óleo do motor, coletor de escape, catalisador, coifas (guarda pó), molas, sistema elétrico, amortecedores, batentes, terminais de direção, pivô de suspensão, bieletas da barra estabilizadora, barra axial da direção, coxim motor/cambio, mangueiras em geral, corpo borboleta, válvula VVT, atuadores em geral, válvula EGR, carcaça e flange da válvula termostática, tampas de válvulas, pescador de óleo, chave seletora da marcha, trizetas, tulipa, retentores em geral (câmbio e motor), coluna de direção, buchas em geral, estofamento e alinhamento de rodas. Fazem parte de exclusão todos os materiais de consumo, tais como: óleos lubrificantes, travas para filtro de combustível, líquidos de arrefecimento, filtros, bateria, guarnições, anéis, parafusos, lâmpadas, todos itens em plástico e borracha, alarme em geral, conversão para gás, airbag e sistema de navegador (GPS). Serão ainda excluídos quaisquer tipos de perdas de líquidos (óleo, água entre outros), ruídos diversos e desgastes originários de peças de reposição.
        </p>
      </div>

      {/* PAGE 3 */}
      <div className="a4-page bg-white">
        <Header />

        <p className="text-[11px] leading-snug text-justify mb-2">
          <b>G.2</b> - A presente garantia se restringe ao veículo e suas peças de motor e caixa de câmbio, não cobrindo quaisquer outras repercussões, mesmo quando decorrentes de avaria ou defeitos no veiculo, tais como: 1. Despesas de transportes. 2. Imobilização do veículo. 3. Hospedagem. 4. Socorro de Guincho. 5. Pelo decurso de validade. 6. Quando forem executadas as alterações ou modificações no veículo ou qualquer de seus componentes, por oficina mecânica diversa da indicada pela <b>{data.store.name}</b>. 7. Quando ocorrer danos decorrentes de mau uso comprovado ou falta de manutenção adequada. 8. Não há garantia de pintura. 9. Para fins de comprovação o cliente declara ter vistoriado a pintura do veiculo mencionado neste contrato, atestando que a mesma se encontra em boas condições, considerando-se a particularidade de não se tratar de veículo novo.
        </p>

        <p className="text-[11px] leading-snug text-justify mb-2">
          <b>H</b> - A titulo de penalidade contratual por arrependimento, fica pactuado uma multa de 10% (dez por cento), calculada sobre o valor do presente contrato, a qual será devida pela parte que der causa a sua rescisão, convertida em benefício da parte inocente, adquirido esta, neste caso, eficácia de titulo executivo.
        </p>

        <p className="text-[11px] leading-snug text-justify mb-2">
          <b>* DISPOSIÇÕES FINAIS</b><br/>
          <b>®</b> - Na hipótese do <b>COMPRADOR</b> depositar ou transferir quantia a título de sinal de negócio, fica a <b>VENDEDORA</b> obrigada a reservar o veículo objeto da negociação por apenas 48 (quarenta e oito) horas, ou pelo prazo combinado com o <b>VENDEDOR</b>, e, uma vez frustrado o negócio pelo <b>COMPRADOR</b> - <b>independente do motivo</b> - o valor correspondente a 100% (cem por cento) do sinal será retido pela vendedora em caráter de compensação material.<br/>
          
          <b>®</b> - Tratando-se de venda com entrega futura, o prazo acima ajustado poderá ser automaticamente prorrogado por até mais 20 (vinte) dias úteis quando se verificar atraso por comprovada culpa dos fornecedores ou por motivos de força maior não provocados pela a <b>VENDEDORA</b> e ainda na ocorrência de casos fortuitos como: greves no setor correlato, fenômenos naturais que possam comprometer ou inviabilizar o regular transporte do produto até o local de entrega, ocorrência de sinistros em transportes e outros.<br/>
          
          <b>®</b> - Verificando-se atraso na entrega do bem por culpa exclusiva do <b>COMPRADOR</b>, entendendo como tais motivos, mais não exclusivamente: a falta de pagamento do total do preço do bem, ou parcial quando financiado, conforme ajustado na cláusula 'D', falta de fornecimento de documentos a cargo do <b>COMPRADOR</b> sujeito à pena contratual neste pactuada.<br/>
          
          <b>®</b> - <b>Na hipótese da venda ser realizada com prestações futuras ou ainda fique algum compromisso financeiro residual a vencer, pelo valor total ou parcial da venda, representada por qualquer tipo de documento (boleto, cheque, nota promissória, termo de confissão de dívida, dentre outros), poderá a VENDEDORA independente de notificação prévia, e, ainda que já tenha sido realizada a transferência do veículo, REALIZAR COMUNICADO DE VENDA JUNTO AO DETRAN EM nome da VENDEDORA, persistindo todas suas conseqüências de estilo até que o pagamento integral do débito seja realizado pelo COMPRADOR.</b><br/>
          
          <b>M.1</b> - Para demonstrar sua ciência e autorização inequívoca quanto ao comunicado de venda contida no item ''M'', assim como pela condição de garantia do item 8.5, ''G'', quanto a exigência da troca do óleo do motor e filtro de óleo antes de completar 500(quinhentos) quilometros rodados após a retirada do veículo do pátio para concessão de garantia, mediante a apresentação de nota fiscal do serviço, o COMPRADOR, assinará por extenso o campo abaixo, concordando com todas as consequências de estilo que foram devidamente explicadas pela VENDEDORA no ato da compra, para que no futuro não possa ser alegado ignorância e/ou desconhecimento a respeito desta providência.<br/>
          <span className="font-mono mt-4 block">Nome: _________________________________________________ / CPF: ______________-____</span>
        </p>

        <p className="text-[11px] leading-snug text-justify mb-3 mt-6">
          <b>®</b> - As partes elegem o Foro da Comarca de GOIÂNIA - GO, para dirimir qualquer controvérsia sobre o presente contrato.<br/>
          <span className="mt-2 block"><b>OBS:</b> <span className="uppercase">{data.sale.observations}</span><br/><br/>
          {data.vehicle.observations && <span><b>OBS do Veículo:</b> <span className="uppercase">{data.vehicle.observations}</span></span>}
          </span>
        </p>

        <p className="text-[11px] leading-snug text-justify mt-6">
          {data.store.cityUf.split('-')[0]}, {data.sale.date}
        </p>
      </div>

      {/* PAGE 4 - SIGNATURES */}
      <div className="a4-page bg-white flex flex-col">
        <Header />
        
        <div className="flex-1 mt-24">
          <div className="grid grid-cols-2 gap-16 px-12">
            {/* Assinatura Comprador */}
            <div className="text-center">
              <div className="border-b border-black mb-3 h-20 flex items-end justify-center font-[cursive] text-lg text-blue-800"></div>
              <p className="font-bold text-sm uppercase">{data.customer.name}</p>
              <p className="text-xs mt-1">CPF/CNPJ: {data.customer.cpf}</p>
            </div>
            
            {/* Assinatura Vendedor */}
            <div className="text-center">
              <div className="border-b border-black mb-3 h-20 flex items-end justify-center font-[cursive] text-lg text-blue-800"></div>
              <p className="font-bold text-sm uppercase">{data.store.name}</p>
              <p className="text-xs mt-1">CNPJ: {data.store.cnpj}</p>
            </div>
          </div>
          
          <div className="mt-32 text-center text-sm text-gray-500 italic">
            Testemunhas:
          </div>
          <div className="grid grid-cols-2 gap-16 px-12 mt-8">
            <div className="text-center">
              <div className="border-b border-black mb-3 h-10"></div>
              <p className="text-xs">Nome:</p>
              <p className="text-xs">CPF:</p>
            </div>
            <div className="text-center">
              <div className="border-b border-black mb-3 h-10"></div>
              <p className="text-xs">Nome:</p>
              <p className="text-xs">CPF:</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPrint;

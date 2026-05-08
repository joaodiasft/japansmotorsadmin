import React from 'react';
import { Printer, AlertCircle } from 'lucide-react';

/* ─────────────────────────────────────────────
   Calcula data de vencimento dado mês de offset
───────────────────────────────────────────── */
const calcDue = (startStr, offset) => {
  if (!startStr) return '___/___/______';
  let d;
  if (startStr.includes('/')) {
    const [day, mon, yr] = startStr.split('/');
    d = new Date(yr, mon - 1, day);
  } else {
    d = new Date(startStr + 'T12:00:00');
  }
  if (isNaN(d.getTime())) return '___/___/______';
  const origDay = d.getDate();
  d.setMonth(d.getMonth() + offset);
  if (d.getDate() < origDay) d.setDate(0);
  return d.toLocaleDateString('pt-BR');
};

/* ─────────────────────────────────────────────
   Promissória individual — compacta para 4/A4
───────────────────────────────────────────── */
const PromissoryNote = ({ idx, total, dueDate, value, valueWords, payableAt, customer, storeData }) => {
  const customerCityUf = customer.cityUf || `${customer.city || ''}${customer.state ? '/' + customer.state : ''}`;

  return (
    <div className="prom-note">
      {/* Corte pontilhado (não imprime, mas orienta o corte) */}
      {idx < total - 1 && <div className="prom-cut" aria-hidden="true" />}

      <div className="prom-inner">

        {/* ── CABEÇALHO ── */}
        <div className="prom-header">
          <div className="prom-brand">
            <img src="https://i.im.ge/eJ704X/sss.png" alt="Japan Motors" className="prom-logo" />
            <div className="prom-brandtext">
              <span className="prom-name">{storeData.name}</span>
              <span className="prom-sub">CNPJ: {storeData.cnpj}</span>
            </div>
          </div>

          <div className="prom-title-wrap">
            <div className="prom-title">NOTA PROMISSÓRIA</div>
            <div className="prom-subtitle">GARANTIA DE PAGAMENTO</div>
          </div>

          <div className="prom-meta">
            <div className="prom-badge">
              <span className="prom-badge-label">VENCIMENTO</span>
              <span className="prom-badge-val">{dueDate}</span>
            </div>
            <div className="prom-parcel">
              <span className="prom-badge-label">PARCELA</span>
              <span className="prom-badge-val mono">
                {String(idx + 1).padStart(2,'0')}&thinsp;/&thinsp;{String(total).padStart(2,'0')}
              </span>
            </div>
            <div className="prom-valor">
              <span className="prom-badge-label">VALOR R$</span>
              <span className="prom-badge-val mono large">{value}</span>
            </div>
          </div>
        </div>

        {/* ── CORPO ── */}
        <div className="prom-body">
          <p className="prom-text">
            Ao(s) <b>{dueDate}</b>, pagarei(emos) por esta única via de Nota Promissória a&nbsp;
            <b>{storeData.name}</b>, ou à sua ordem, a quantia de:
          </p>
          <div className="prom-extenso">{valueWords || '________________________________________________________'}</div>

          <div className="prom-footer-row">
            <div className="prom-emitente">
              <span className="prom-field-label">EMITENTE</span>
              <span className="prom-field-val">{customer.name}</span>
              <span className="prom-field-label" style={{marginLeft:'12px'}}>CPF</span>
              <span className="prom-field-val">{customer.cpf}</span>
              <span className="prom-field-label" style={{marginLeft:'12px'}}>ENDEREÇO</span>
              <span className="prom-field-val">{customer.address}{customer.neighborhood ? `, ${customer.neighborhood}` : ''} — {customerCityUf}</span>
              <span className="prom-field-label" style={{marginLeft:'12px'}}>PRAÇA</span>
              <span className="prom-field-val">{payableAt}</span>
            </div>
            <div className="prom-assinatura">
              <div className="prom-assinatura-linha" />
              <span className="prom-assinatura-label">ASSINATURA DO EMITENTE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Componente principal
───────────────────────────────────────────── */
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

  // Suporte ao formato flat do banco e formato legado
  const promissory = data.promissory || {
    installments: data.installments || 1,
    installmentValue: data.installmentValue || '',
    applyInterest: data.applyInterest || false,
    interestRate: data.interestRate || '',
    firstDueDate: data.firstDueDate || '',
    payableAt: data.payableAt || '',
    valueWords: data.valueWords || '',
    customDates: [],
  };

  const customer = data.customer || {};
  const total = parseInt(promissory.installments) || 1;

  // Calcula valor com juros se necessário
  let finalValue = promissory.installmentValue || '0,00';
  if (promissory.applyInterest && promissory.interestRate && promissory.installmentValue) {
    const base = parseFloat((promissory.installmentValue || '').replace(/\./g, '').replace(',', '.'));
    if (!isNaN(base)) {
      const rate = parseFloat(promissory.interestRate);
      finalValue = (base + base * rate / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
  }

  // Monta array de parcelas
  const notes = Array.from({ length: total }, (_, i) => {
    let dueDate;
    if (promissory.customDates && promissory.customDates[i]) {
      dueDate = new Date(promissory.customDates[i] + 'T12:00:00').toLocaleDateString('pt-BR');
    } else {
      dueDate = calcDue(promissory.firstDueDate, i);
    }
    return { idx: i, dueDate };
  });

  // Agrupa 4 por página
  const pages = [];
  for (let i = 0; i < notes.length; i += 4) {
    pages.push(notes.slice(i, i + 4));
  }

  return (
    <>
      {/* ── CSS Inline para promissórias ── */}
      <style>{`
        /* ── WRAPPER DE TELA ── */
        .prom-screen-wrap {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }
        .prom-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-left: 4px solid #1e293b;
          border-radius: 10px;
          padding: 18px 24px;
          margin-bottom: 28px;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
        }
        .prom-toolbar h2 {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -.5px;
        }
        .prom-toolbar p { font-size: 13px; color: #6b7280; margin-top: 2px; }
        .prom-btn {
          display: flex; align-items: center; gap: 8px;
          background: #0f172a; color: #fff;
          border: none; cursor: pointer;
          padding: 12px 24px; border-radius: 8px;
          font-size: 14px; font-weight: 700; letter-spacing: .3px;
          transition: background .2s;
        }
        .prom-btn:hover { background: #334155; }

        /* ── PÁGINA A4 ── */
        .prom-a4 {
          width: 210mm;
          height: 297mm;
          background: #fff;
          box-shadow: 0 12px 30px rgba(0,0,0,.12);
          box-sizing: border-box;
          padding: 8mm 10mm;
          display: flex;
          flex-direction: column;
          gap: 3mm;
          margin: 0 auto 24px;
          position: relative;
          overflow: hidden;
        }

        /* ── NOTA INDIVIDUAL ── */
        .prom-note {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .prom-cut {
          position: absolute;
          bottom: 0;
          left: -10mm;
          right: -10mm;
          height: 0;
          border-bottom: 1.5px dashed #999;
          z-index: 10;
        }
        .prom-inner {
          flex: 1;
          border: 1.5px solid #000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── CABEÇALHO DA NOTA ── */
        .prom-header {
          display: flex;
          align-items: stretch;
          border-bottom: 1.5px solid #000;
          background: #f8f9fa;
        }
        .prom-brand {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-right: 1.5px solid #000;
          min-width: 48mm;
        }
        .prom-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
          filter: grayscale(100%);
        }
        .prom-brandtext {
          display: flex;
          flex-direction: column;
        }
        .prom-name {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .8px;
          text-transform: uppercase;
          color: #000;
          line-height: 1.1;
        }
        .prom-sub {
          font-size: 6px;
          color: #555;
          letter-spacing: .3px;
        }

        .prom-title-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          border-right: 1.5px solid #000;
        }
        .prom-title {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #000;
        }
        .prom-subtitle {
          font-size: 6px;
          letter-spacing: 2px;
          color: #666;
          text-transform: uppercase;
          margin-top: 1px;
        }

        .prom-meta {
          display: flex;
          align-items: stretch;
        }
        .prom-badge, .prom-parcel, .prom-valor {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2px 8px;
          border-left: 1.5px solid #000;
          min-width: 24mm;
        }
        .prom-valor { min-width: 30mm; background: #000; }
        .prom-badge-label {
          font-size: 5.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #555;
          font-weight: 700;
        }
        .prom-valor .prom-badge-label { color: #ccc; }
        .prom-badge-val {
          font-size: 9px;
          font-weight: 800;
          color: #000;
          margin-top: 1px;
          line-height: 1;
        }
        .prom-valor .prom-badge-val { color: #fff; }
        .mono { font-family: 'Courier New', monospace; }
        .large { font-size: 11px; }

        /* ── CORPO DA NOTA ── */
        .prom-body {
          flex: 1;
          padding: 5px 8px 4px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .prom-text {
          font-size: 7.5px;
          color: #000;
          line-height: 1.4;
          margin: 0;
        }
        .prom-extenso {
          margin-top: 3px;
          border: 1px solid #000;
          background: #f8f8f8;
          padding: 2px 6px;
          font-size: 7px;
          font-style: italic;
          color: #333;
          min-height: 14px;
          font-weight: 600;
        }
        .prom-footer-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin-top: 4px;
          border-top: 1px dashed #aaa;
          padding-top: 4px;
        }
        .prom-emitente {
          flex: 1;
          font-size: 6.5px;
          color: #000;
          display: flex;
          flex-wrap: wrap;
          gap: 2px 0;
          align-items: center;
          line-height: 1.5;
        }
        .prom-field-label {
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .5px;
          font-size: 6px;
          color: #000;
          margin-right: 3px;
        }
        .prom-field-val {
          font-size: 7px;
          color: #222;
          margin-right: 4px;
        }
        .prom-assinatura {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 45mm;
        }
        .prom-assinatura-linha {
          width: 100%;
          border-bottom: 1px solid #000;
          height: 16px;
          margin-bottom: 2px;
        }
        .prom-assinatura-label {
          font-size: 5.5px;
          letter-spacing: .8px;
          text-transform: uppercase;
          color: #555;
          font-weight: 700;
        }

        /* ── PRINT ── */
        @media print {
          .prom-toolbar { display: none !important; }
          .prom-screen-wrap { padding: 0; max-width: none; }
          .prom-a4 {
            width: 100%;
            height: 100vh;
            box-shadow: none;
            margin: 0;
            padding: 8mm 10mm;
            page-break-after: always;
            page-break-inside: avoid;
          }
          .prom-a4:last-child { page-break-after: avoid; }
          .prom-cut { border-bottom-color: #bbb; }
          /* Força P&B */
          * { color-adjust: exact; -webkit-print-color-adjust: exact; }
          .prom-valor { background: #000 !important; }
          .prom-valor .prom-badge-val { color: #fff !important; }
        }
      `}</style>

      {/* ── TELA ── */}
      <div className="prom-screen-wrap">
        {/* Toolbar */}
        <div className="prom-toolbar print:hidden">
          <div>
            <h2>Emissão de Promissórias</h2>
            <p>4 promissórias por folha A4 · Otimizado para impressão em preto e branco</p>
          </div>
          <button className="prom-btn" onClick={() => window.print()}>
            <Printer size={18} /> Imprimir ({total} parcela{total > 1 ? 's' : ''})
          </button>
        </div>

        {/* Páginas A4 */}
        {pages.map((page, pageIdx) => (
          <div key={pageIdx} className="prom-a4">
            {page.map((note) => (
              <PromissoryNote
                key={note.idx}
                idx={note.idx}
                total={total}
                dueDate={note.dueDate}
                value={finalValue}
                valueWords={promissory.valueWords}
                payableAt={promissory.payableAt}
                customer={customer}
                storeData={storeData}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default PromissoryManager;

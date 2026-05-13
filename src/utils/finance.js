/** Valores monetários no formato brasileiro (ex: 1.234,56) */
export function parseCurrencyBR(val) {
  if (val == null || val === '') return 0;
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  return parseFloat(String(val).replace(/\./g, '').replace(',', '.')) || 0;
}

/**
 * Parcela com juros: valor × (% juros / 100) + (valor / quantidade de parcelas)
 * @param {number|string} valorTotal - valor base (ex.: financiado)
 * @param {number|string} interestRatePct - percentual de juros
 * @param {number|string} numParcelas
 */
export function installmentWithInterestFormula(valorTotal, interestRatePct, numParcelas) {
  const v = parseCurrencyBR(valorTotal);
  const n = Math.max(1, parseInt(String(numParcelas), 10) || 1);
  const p = parseFloat(String(interestRatePct).replace(',', '.')) || 0;
  if (v <= 0) return 0;
  return v * (p / 100) + v / n;
}

export function formatCurrencyBR(num) {
  return Number(num).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Mensagem padrão ao abrir o WhatsApp a partir do cadastro de clientes */
export const WHATSAPP_JAPAN_MOTORS_MESSAGE = 'Olá !! Aqui e da Japan Motors.';

function digitsOnly(str) {
  return String(str ?? '').replace(/\D/g, '');
}

/**
 * Converte telefone exibido (ex.: (62) 99999-9999) para formato internacional usado pelo wa.me.
 * Assume Brasil (55) quando houver 10 ou 11 dígitos sem DDI.
 */
export function toWhatsAppE164Digits(phone) {
  let d = digitsOnly(phone);
  if (!d) return null;
  if (d.startsWith('55') && d.length >= 12) return d;
  if (d.length >= 10 && d.length <= 11) return `55${d}`;
  if (d.length >= 12) return d;
  return d.length >= 8 ? `55${d}` : null;
}

export function buildWhatsAppChatUrl(phone, message = WHATSAPP_JAPAN_MOTORS_MESSAGE) {
  const num = toWhatsAppE164Digits(phone);
  if (!num) return null;
  const q = encodeURIComponent(message);
  return `https://wa.me/${num}?text=${q}`;
}

// src/hooks/useApi.js
// Hook para chamadas à API com gerenciamento de loading/error

export const api = {
  async get(endpoint) {
    const res = await fetch(`/api${endpoint}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  async post(endpoint, body) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  async put(endpoint, body) {
    const res = await fetch(`/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  async delete(endpoint) {
    const res = await fetch(`/api${endpoint}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  }
};

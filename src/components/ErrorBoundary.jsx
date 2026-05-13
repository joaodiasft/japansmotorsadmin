import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || 'Erro desconhecido';
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
          <AlertTriangle className="w-14 h-14 text-amber-400 mb-4" aria-hidden />
          <h1 className="text-xl font-bold mb-2">Ocorreu um erro na interface</h1>
          <p className="text-slate-300 text-sm max-w-lg text-center mb-6">
            Em vez de uma tela em branco, você pode recarregar a página. Se o problema continuar, anote a mensagem abaixo.
          </p>
          <pre className="bg-black/40 rounded-lg p-4 text-xs text-amber-100 max-w-full overflow-auto mb-6 whitespace-pre-wrap">
            {msg}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-lg font-semibold"
          >
            Recarregar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-red-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Waduh, Terjadi Kesalahan!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Aplikasi mengalami kendala teknis. Silakan coba muat ulang halaman atau hubungi tim IT.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary w-full py-4 text-lg"
            >
              <RefreshCw className="w-5 h-5" /> Muat Ulang Halaman
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-slate-900 text-red-400 text-left text-xs rounded-xl overflow-auto max-h-40">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Inheriting from Component with explicit generics to ensure 'props' and 'state' are correctly recognized by the TypeScript compiler.
// Fix: Explicitly importing and extending Component from React to ensure members like 'props' and 'state' are correctly typed and accessible on 'this'.
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  // Static method to update state when an error is caught in the component tree.
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">System Protocol Error</h2>
            <p className="text-gray-400 text-sm mb-6">
              An unexpected critical failure has occurred in the application pipeline.
            </p>
            <div className="bg-black/40 p-4 rounded-lg border border-white/5 mb-6 text-left">
               <code className="text-xs text-red-400 font-mono block break-words">
                 {this.state.error?.message}
               </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCcw size={16} />
              Reinitialize System
            </button>
          </div>
        </div>
      );
    }

    // Return children from this.props which is correctly inherited from React.Component.
    return this.props.children;
  }
}
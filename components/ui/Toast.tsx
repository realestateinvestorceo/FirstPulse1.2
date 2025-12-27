
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border ${
        type === 'success' 
          ? 'bg-[#111111] border-emerald-500/50 text-white' 
          : 'bg-[#111111] border-red-500/50 text-white'
      }`}>
        <div className={`p-1 rounded-full ${
          type === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
        }`}>
          {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        </div>
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 text-gray-500 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

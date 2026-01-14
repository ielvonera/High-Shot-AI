
import React from 'react';

interface AlertProps {
  title: string;
  message: string;
  onClear?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export const Alert: React.FC<AlertProps> = ({ title, message, onClear, variant = 'error' }) => {
  const styles = {
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-900',
      icon: 'fa-triangle-exclamation',
      accent: 'bg-rose-600'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      icon: 'fa-circle-exclamation',
      accent: 'bg-amber-500'
    },
    info: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-900',
      icon: 'fa-circle-info',
      accent: 'bg-indigo-600'
    }
  };

  const current = styles[variant];

  return (
    <div className={`p-8 rounded-[2.5rem] border ${current.bg} ${current.border} shadow-xl shadow-rose-900/5 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 relative overflow-hidden group`}>
      <div className={`absolute top-0 left-0 w-1.5 h-full ${current.accent}`}></div>
      <div className="flex gap-6 items-start">
        <div className={`w-14 h-14 ${current.accent} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}>
          <i className={`fas ${current.icon} text-xl`}></i>
        </div>
        <div className="flex-grow space-y-1">
          <h4 className={`text-lg font-bold ${current.text}`}>{title}</h4>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg font-medium">
            {message}
          </p>
          {onClear && (
            <div className="pt-4">
              <button 
                onClick={onClear}
                className="text-xs font-black uppercase tracking-widest text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-rotate-left"></i> Dismiss & Reset Studio
              </button>
            </div>
          )}
        </div>
        {onClear && (
          <button 
            onClick={onClear}
            className="text-slate-300 hover:text-slate-900 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

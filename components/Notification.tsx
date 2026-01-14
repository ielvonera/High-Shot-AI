
import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    error: 'bg-rose-50 border-rose-100 text-rose-800',
    info: 'bg-indigo-50 border-indigo-100 text-indigo-800',
  };

  const icons = {
    success: 'fa-circle-check text-emerald-500',
    error: 'fa-circle-exclamation text-rose-500',
    info: 'fa-circle-info text-indigo-500',
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-8 duration-300 ${bgColors[type]}`}>
      <i className={`fas ${icons[type]} text-xl`}></i>
      <div className="flex flex-col">
        <span className="text-xs font-black uppercase tracking-widest opacity-60">{type}</span>
        <span className="font-bold text-sm">{message}</span>
      </div>
      <button onClick={onClose} className="ml-4 opacity-40 hover:opacity-100 transition-opacity">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

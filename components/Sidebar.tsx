
import React from 'react';
import { ViewType } from '../types';
import { User } from 'firebase/auth';
import { signOut } from '../lib/auth';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  credits: number;
  profile: any;
  user: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, credits, profile, user }) => {
  const menuItems = [
    { id: 'generator', label: 'Studio', icon: 'fa-wand-magic-sparkles' },
    { id: 'enhancer', label: 'Enhancer', icon: 'fa-wand-magic' },
    { id: 'gallery', label: 'Gallery', icon: 'fa-images' },
    { id: 'profile', label: 'Account', icon: 'fa-user-gear' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      onViewChange('landing');
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const getMaxCredits = () => {
    switch (profile?.plan) {
      case 'agency': return 600;
      case 'pro': return 150;
      default: return 10;
    }
  };

  const maxCredits = getMaxCredits();
  const percentage = Math.min(100, (credits / maxCredits) * 100);
  const isLowCredits = credits < 5;

  return (
    <div className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col h-screen fixed left-0 top-0 z-50 shadow-sm">
      <div className="p-8 flex items-center gap-4 cursor-pointer group" onClick={() => onViewChange('landing')}>
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-transform duration-500">
          <i className="fas fa-camera-retro text-white text-xl"></i>
        </div>
        <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">High Shot AI</span>
      </div>

      <nav className="flex-grow px-4 space-y-1.5 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.01]' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1'
            }`}
          >
            <i className={`fas ${item.icon} text-lg w-6`}></i>
            <span className="font-bold text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={`p-6 mx-4 mb-4 rounded-[2rem] border space-y-4 transition-all ${isLowCredits ? 'bg-amber-50 border-amber-100 animate-pulse' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex justify-between items-center">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isLowCredits ? 'text-amber-600' : 'text-indigo-600'}`}>
            Power Balance
          </span>
          <span className="text-xs font-black text-slate-900">{credits} / {maxCredits}</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isLowCredits ? 'bg-amber-500' : 'bg-indigo-600'}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <button 
          onClick={() => onViewChange('profile')}
          className="w-full py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
        >
          Refill Units
        </button>
      </div>

      <div className="p-6 border-t border-slate-50 mt-auto">
        <div className="flex items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
          <div 
            onClick={() => onViewChange('profile')}
            className="flex items-center gap-3 flex-1 overflow-hidden cursor-pointer hover:bg-white rounded-xl p-1 transition-all"
          >
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
              {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full rounded-lg object-cover" />
              ) : (
                  <i className="fas fa-user text-indigo-600 text-sm"></i>
              )}
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold text-slate-900 truncate">{user?.displayName || "Designer"}</div>
              <div className={`text-[8px] font-black uppercase tracking-widest ${profile?.plan === 'free' ? 'text-slate-400' : 'text-emerald-500'}`}>
                {profile?.plan || 'Free'} Tier
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-9 h-9 rounded-lg text-rose-500 hover:bg-rose-50 transition-all shrink-0 flex items-center justify-center border border-transparent hover:border-rose-100"
            title="Sign Out"
          >
            <i className="fas fa-power-off text-base"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

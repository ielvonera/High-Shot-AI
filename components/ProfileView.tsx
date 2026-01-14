
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { upgradeUserPlan } from '../lib/auth';

interface ProfileViewProps {
  user: User;
  profile: any;
  credits: number;
  onUpdateName: (name: string) => Promise<void>;
  onResetPassword: () => Promise<void>;
  onLogout: () => void;
  onClearCache: () => void;
  notify: (msg: string, type?: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  profile, 
  credits,
  onUpdateName, 
  onResetPassword, 
  onLogout,
  onClearCache,
  notify
}) => {
  const [name, setName] = useState(profile?.name || user.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await onUpdateName(name);
    setIsUpdating(false);
  };

  const getMaxCredits = () => {
    switch (profile?.plan) {
      case 'agency': return 600;
      case 'pro': return 150;
      default: return 10;
    }
  };

  const handleUpgrade = async (plan: 'pro' | 'agency') => {
    setIsUpgrading(plan);
    try {
      await upgradeUserPlan(user.uid, plan);
      notify(`Successfully upgraded to ${plan.toUpperCase()} plan!`, 'success');
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsUpgrading(null);
    }
  };

  const maxCredits = getMaxCredits();
  const creditsLeft = credits;
  const percentage = Math.min(100, (creditsLeft / maxCredits) * 100);
  const isLowCredits = creditsLeft < 5;

  const getTierBenefits = () => {
    const tier = profile?.plan || 'free';
    if (tier === 'free') return ["10 Credits Total", "Standard Res", "Community Support"];
    if (tier === 'pro') return ["150 Credits / mo", "HD 4K Resolution", "Priority Rendering", "Premium Support"];
    return ["600 Credits / mo", "Enterprise API", "Custom AI Training", "24/7 Priority Support"];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
               <i className="fas fa-id-badge text-white text-xs"></i>
             </div>
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Studio Profile</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Account & Billing</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your professional AI studio profile and subscriptions</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-3 border border-rose-200 text-rose-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2"
        >
          <i className="fas fa-sign-out-alt"></i> Sign Out
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4 group">
           <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center border border-indigo-100 overflow-hidden group-hover:scale-105 transition-transform">
              {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <i className="fas fa-user text-4xl text-indigo-200"></i>}
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-900">{profile?.name || 'Designer'}</h2>
             <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-2 shadow-lg shadow-indigo-100">
               <i className="fas fa-award"></i> {profile?.plan || 'Free'} Tier
             </div>
           </div>
        </div>

        <div className={`p-10 rounded-[3rem] text-white space-y-8 md:col-span-2 flex flex-col justify-center transition-all relative overflow-hidden ${isLowCredits ? 'bg-gradient-to-br from-amber-600 to-amber-700 shadow-2xl shadow-amber-200' : 'bg-slate-900 shadow-2xl shadow-slate-200'}`}>
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-2">
              <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isLowCredits ? 'text-amber-200' : 'text-slate-400'}`}>Current Batch Power</span>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-serif font-bold tracking-tighter">{creditsLeft}</span>
                <span className={`text-2xl font-medium ${isLowCredits ? 'text-amber-100' : 'text-slate-500'}`}>/ {maxCredits} Units</span>
              </div>
            </div>
            <div className={`hidden lg:flex items-center gap-4 text-xs font-bold p-4 rounded-3xl border ${isLowCredits ? 'bg-amber-500/20 border-white/20 text-amber-100' : 'bg-white/5 border-white/5 text-slate-400'}`}>
              <i className={`fas ${isLowCredits ? 'fa-bolt-lightning text-xl' : 'fa-circle-info text-lg'}`}></i>
              <div className="max-w-[180px] leading-tight">
                <p className="font-black uppercase text-[8px] mb-1">Cycle Reset</p>
                <p className="text-[10px]">Your power balance resets in approx. 22 days.</p>
              </div>
            </div>
          </div>
          <div className={`w-full h-4 rounded-full overflow-hidden p-1 relative z-10 ${isLowCredits ? 'bg-amber-800' : 'bg-slate-800'}`}>
             <div 
               className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.8)] ${isLowCredits ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-gradient-to-r from-indigo-500 to-indigo-300'}`} 
               style={{ width: `${percentage}%` }}
             ></div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Active Tier Benefits</h3>
            <div className="grid grid-cols-2 gap-4">
              {getTierBenefits().map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <i className="fas fa-check-circle text-indigo-600"></i>
                  <span className="text-sm font-bold text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-10 space-y-8">
            <h3 className="text-2xl font-bold text-slate-900">Personal Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Creator Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-3 opacity-60">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1">Email Connection</label>
                <input type="email" disabled value={user.email || ''} className="w-full px-6 py-5 bg-slate-100 border border-slate-200 rounded-[1.5rem] text-sm font-bold cursor-not-allowed" />
              </div>
            </div>
            <button onClick={handleUpdate} disabled={isUpdating} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-300 h-16">
              {isUpdating ? <i className="fas fa-circle-notch fa-spin"></i> : 'Apply Changes'}
            </button>
          </div>

          <div className="bg-rose-50 rounded-[3rem] border border-rose-100 p-10 space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center">
                 <i className="fas fa-microchip"></i>
               </div>
               <div>
                 <h3 className="text-xl font-bold text-rose-900">System Utility</h3>
                 <p className="text-rose-700 text-sm font-medium">Reset local workspace data</p>
               </div>
            </div>
            <p className="text-rose-800/70 text-sm leading-relaxed">If you experience errors during image generation or storage, clearing your local session cache can resolve most quota issues. This does not affect your account credits.</p>
            <button 
              onClick={onClearCache}
              className="px-8 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-rose-600 hover:text-white transition-all shadow-sm"
            >
              Clear Session Cache
            </button>
          </div>
        </div>

        <div id="plans-section" className="lg:col-span-5 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                <i className="fas fa-credit-card text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Upgrade Studio</h3>
            </div>

            <div className="space-y-6">
              <div className={`p-8 rounded-[2.5rem] border-2 transition-all relative ${profile?.plan === 'pro' ? 'border-indigo-600 bg-indigo-50/20 shadow-2xl shadow-indigo-100' : 'border-slate-100 bg-slate-50'}`}>
                {profile?.plan === 'pro' && <div className="absolute top-6 right-6 bg-indigo-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md">ACTIVE</div>}
                <h4 className="text-xl font-black tracking-tight">Studio Pro</h4>
                <div className="text-3xl font-serif font-bold tracking-tighter text-slate-900 mt-2 mb-6">$19<span className="text-sm text-slate-400 font-sans">/mo</span></div>
                <button onClick={() => handleUpgrade('pro')} disabled={profile?.plan === 'pro' || isUpgrading === 'pro'} className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all h-14 ${profile?.plan === 'pro' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>
                  {isUpgrading === 'pro' ? <i className="fas fa-circle-notch fa-spin"></i> : profile?.plan === 'pro' ? 'Current Plan' : 'Select Pro'}
                </button>
              </div>

              <div className={`p-8 rounded-[2.5rem] border-2 transition-all relative ${profile?.plan === 'agency' ? 'border-indigo-600 bg-indigo-50/20 shadow-2xl shadow-indigo-100' : 'border-slate-100 bg-slate-50'}`}>
                {profile?.plan === 'agency' && <div className="absolute top-6 right-6 bg-indigo-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md">ACTIVE</div>}
                <h4 className="text-xl font-black tracking-tight">Enterprise Agency</h4>
                <div className="text-3xl font-serif font-bold tracking-tighter text-slate-900 mt-2 mb-6">$29<span className="text-sm text-slate-400 font-sans">/mo</span></div>
                <button onClick={() => handleUpgrade('agency')} disabled={profile?.plan === 'agency' || isUpgrading === 'agency'} className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all h-14 ${profile?.plan === 'agency' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>
                  {isUpgrading === 'agency' ? <i className="fas fa-circle-notch fa-spin"></i> : profile?.plan === 'agency' ? 'Current Plan' : 'Select Agency'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

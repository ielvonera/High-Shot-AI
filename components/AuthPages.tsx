
import React, { useState } from 'react';
import { login, loginWithGoogle, signUp } from '../lib/auth';

interface AuthPageProps {
  onSuccess: () => void;
  onSwitch: () => void;
}

export const LoginPage: React.FC<AuthPageProps> = ({ onSuccess, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1539109132384-3615557de104?auto=format&fit=crop&q=80" 
          alt="Background" 
          className="w-full h-full object-cover opacity-10 blur-xl"
        />
      </div>
      <div className="w-full max-w-md space-y-10 bg-white p-10 md:p-14 rounded-[3.5rem] shadow-3xl border border-slate-100 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-200 mx-auto mb-8">
            <i className="fas fa-camera-retro text-white text-2xl"></i>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Studio Access</h1>
          <p className="text-slate-500 font-medium text-sm">Enter the workspace for commercial excellence.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 text-[10px] rounded-2xl border border-rose-100 font-black uppercase tracking-widest animate-shake">
            <i className="fas fa-circle-exclamation mr-2"></i> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commercial Email</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300"
              placeholder="vogue@brand.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Key</label>
              <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">Recover</button>
            </div>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all disabled:bg-slate-200 text-xs h-16"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "Enter Studio"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]"><span className="px-6 bg-white text-slate-300">Auth Tier Sync</span></div>
        </div>

        <button 
          onClick={handleGoogle}
          className="w-full py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-50 active:scale-95 transition-all h-16"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
          Continue with Google
        </button>

        <div className="text-center pt-4">
          <p className="text-sm font-medium text-slate-500">
            Need a studio? <button onClick={onSwitch} className="text-indigo-600 font-black uppercase tracking-widest text-xs ml-2 hover:underline">Create Account</button>
          </p>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] pt-4">Secured by High Shot AI Encryption</p>
      </div>
    </div>
  );
};

export const SignupPage: React.FC<AuthPageProps> = ({ onSuccess, onSwitch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await signUp(email, password, name);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80" 
          alt="Background" 
          className="w-full h-full object-cover opacity-10 blur-xl"
        />
      </div>
      <div className="w-full max-w-md space-y-10 bg-white p-10 md:p-14 rounded-[3.5rem] shadow-3xl border border-slate-100 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Open Your Studio</h1>
          <p className="text-slate-500 font-medium text-sm">Join the next generation of fashion marketers.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 text-[10px] rounded-2xl border border-rose-100 font-black uppercase tracking-widest animate-shake">
            <i className="fas fa-circle-exclamation mr-2"></i> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Creator Name</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              placeholder="Alexander McQueen"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commercial Email</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all disabled:bg-slate-200 text-xs h-16 mt-4"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : "Initialize Account"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]"><span className="px-6 bg-white text-slate-300">Federated ID</span></div>
        </div>

        <button 
          onClick={handleGoogle}
          className="w-full py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-50 active:scale-95 transition-all h-16"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 grayscale" alt="Google" />
          Join with Google
        </button>

        <div className="text-center pt-4">
          <p className="text-sm font-medium text-slate-500">
            Already a member? <button onClick={onSwitch} className="text-indigo-600 font-black uppercase tracking-widest text-xs ml-2 hover:underline">Log In</button>
          </p>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">No commitment. Start for free.</p>
      </div>
    </div>
  );
};

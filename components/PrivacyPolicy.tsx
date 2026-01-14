
import React from 'react';
import { ViewType } from '../types';

export const PrivacyPolicy: React.FC<{ onViewChange: (view: ViewType) => void }> = ({ onViewChange }) => {
  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-indigo-100">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-3xl border-b border-slate-100 h-24 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewChange('landing')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-camera-retro text-white"></i>
          </div>
          <span className="text-2xl font-serif font-bold text-slate-900">High Shot AI</span>
        </div>
        <button onClick={() => onViewChange('landing')} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600">Back to Home</button>
      </nav>

      <div className="max-w-3xl mx-auto pt-48 pb-32 px-6">
        <h1 className="text-5xl font-serif font-bold mb-12 tracking-tight">Privacy Policy</h1>
        <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">1. Data Collection</h2>
            <p>At High Shot AI, we prioritize the protection of your creative assets and personal information. We collect data necessary to provide our AI generation services, including uploaded images, email addresses for account management, and usage patterns to optimize our models.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">2. Image Processing</h2>
            <p>Images uploaded for generation are processed securely. We do not use your proprietary product images or model photos to train our public base models without explicit consent. Your assets remain your intellectual property.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">3. Third-Party Services</h2>
            <p>We utilize industry-standard cloud providers and AI infrastructures (including Google Gemini API) to perform rendering tasks. These providers adhere to strict data security protocols.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">4. Your Rights</h2>
            <p>You have the right to access, export, or delete your data at any time through your Account settings. For Enterprise clients, we offer enhanced data residency options.</p>
          </section>
          
          <p className="pt-12 text-[10px] uppercase font-black tracking-widest text-slate-400 border-t border-slate-100">Last updated: May 20, 2025</p>
        </div>
      </div>
    </div>
  );
};

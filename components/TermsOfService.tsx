
import React from 'react';
import { ViewType } from '../types';

export const TermsOfService: React.FC<{ onViewChange: (view: ViewType) => void }> = ({ onViewChange }) => {
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
        <h1 className="text-5xl font-serif font-bold mb-12 tracking-tight">Terms of Service</h1>
        <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>By accessing the High Shot AI Studio, you agree to be bound by these terms. Our service provides AI-powered fashion photography generation tools for commercial and professional use.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">2. Usage Rights</h2>
            <p>Users are granted a non-exclusive license to use the platform. You are responsible for all content uploaded to the service and must ensure you have the necessary rights for any images (models, products) you upload.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">3. Credits and Billing</h2>
            <p>High Shot AI operates on a credit-based system ("Batch Power"). Credits are consumed upon generation. Unused credits may expire based on your plan tier. All payments are processed through secure third-party gateways.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">4. Prohibited Use</h2>
            <p>Generating offensive, illegal, or infringing content is strictly prohibited. We reserve the right to terminate accounts that violate our safety guidelines or engage in automated scraping of the platform.</p>
          </section>
          
          <p className="pt-12 text-[10px] uppercase font-black tracking-widest text-slate-400 border-t border-slate-100">Last updated: May 20, 2025</p>
        </div>
      </div>
    </div>
  );
};

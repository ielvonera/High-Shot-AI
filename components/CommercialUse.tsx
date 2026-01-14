
import React from 'react';
import { ViewType } from '../types';

export const CommercialUse: React.FC<{ onViewChange: (view: ViewType) => void }> = ({ onViewChange }) => {
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
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-emerald-100">
          <i className="fas fa-shield-check"></i> Enterprise Grade Licensing
        </div>
        <h1 className="text-5xl font-serif font-bold mb-12 tracking-tight">Commercial Use Rights</h1>
        <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900 text-indigo-600">Full Ownership</h2>
            <p>When you generate a fashion asset using High Shot AI, you own the resulting output for commercial use. This includes the right to use the images in advertisements, website banners, social media campaigns, and printed materials.</p>
          </section>

          <section className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Key Permissions:</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Paid Social Ads</li>
              <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> E-commerce Listings</li>
              <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Global Distribution</li>
              <li className="flex gap-3"><i className="fas fa-check text-emerald-500 mt-1"></i> Sub-licensing to Clients</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Ethical AI Responsibility</h2>
            <p>While High Shot AI grants full commercial rights, users are responsible for ensuring that the images they upload (products, model bases) do not infringe on existing trademarks or copyright. High Shot AI provides the synthesis technology; you provide the creative authority.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Legal Guarantee</h2>
            <p>Our Pro and Agency plans include limited indemnification for content generated using our proprietary studio environments. We stand by the commercial viability of our outputs.</p>
          </section>
          
          <p className="pt-12 text-[10px] uppercase font-black tracking-widest text-slate-400 border-t border-slate-100">Last updated: May 20, 2025</p>
        </div>
      </div>
    </div>
  );
};

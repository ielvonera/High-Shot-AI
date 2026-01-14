
import React, { useState } from 'react';
import { Campaign } from '../types';

interface CampaignsViewProps {
  campaigns: Campaign[];
  onAddCampaign: (name: string, description: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ campaigns, onAddCampaign }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddCampaign(name, desc);
      setName('');
      setDesc('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Campaign Projects</h1>
          <p className="text-slate-500 mt-1">Structure your marketing drops and shoots</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <i className="fas fa-plus"></i>
          New Campaign
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-indigo-100 animate-in zoom-in-95 duration-300">
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Create New Campaign</h3>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Campaign Identity</label>
              <input 
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Winter 2025 Lookbook"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description & Strategy</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What's the vibe for this campaign? Urban, minimalist, etc..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all h-32 resize-none"
              />
            </div>
            <div className="flex gap-4 pt-2">
              <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all">Start Project</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors">Discard</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-indigo-500 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden">
            {/* Visual accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 opacity-40 transition-all group-hover:bg-indigo-600 group-hover:opacity-10"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <i className="fas fa-folder-open text-2xl"></i>
              </div>
              <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full tracking-wider uppercase">
                {c.imageCount} ASSETS
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">{c.description || 'General uncategorized shoot assets for quick campaigns.'}</p>
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Launch: {new Date(c.createdAt).toLocaleDateString()}</span>
              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                <i className="fas fa-arrow-right text-xs"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

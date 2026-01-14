
import React from 'react';
import { GenerationSettings, BrandStyle, TargetPlatform, BackgroundPreference, ImageResolution, ImageFormat } from '../types';

interface SettingsFormProps {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onChange }) => {
  const styles: BrandStyle[] = ['Minimal', 'Luxury', 'Streetwear', 'Corporate', 'Youth', 'Bold'];
  const platforms: TargetPlatform[] = ['Instagram Post', 'Facebook Ad', 'Website Product Page', 'Banner', 'Story'];
  const backgrounds: BackgroundPreference[] = ['Studio', 'Lifestyle Urban', 'Lifestyle Outdoor', 'Lifestyle Office', 'Branded AI'];
  const resolutions: ImageResolution[] = ['Standard', 'HD'];
  const formats: ImageFormat[] = ['JPG', 'PNG', 'WebP'];
  const batchSizes = [1, 2, 4, 8];

  return (
    <div className="space-y-6 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Strategy & Styling</h3>
        <i className="fas fa-sliders text-indigo-600"></i>
      </div>
      
      {/* Brand Style */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aesthetic Direction</label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map(style => (
            <button
              key={style}
              onClick={() => onChange({ ...settings, brandStyle: style })}
              className={`px-3 py-3 text-xs font-bold rounded-xl border transition-all duration-300 ${
                settings.brandStyle === style 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Target Platform & Background */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Output Format</label>
          <div className="relative group">
            <select 
              value={settings.platform}
              onChange={(e) => onChange({ ...settings, platform: e.target.value as TargetPlatform })}
              className="w-full appearance-none px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all cursor-pointer"
            >
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors"></i>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Environment</label>
          <div className="relative group">
            <select 
              value={settings.background}
              onChange={(e) => onChange({ ...settings, background: e.target.value as BackgroundPreference })}
              className="w-full appearance-none px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all cursor-pointer"
            >
              {backgrounds.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <i className="fas fa-location-dot absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors"></i>
          </div>
        </div>
      </div>

      {/* Brand Accent Fixed */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Brand Accent Color</label>
        <div className="flex items-center gap-3">
          <div className="relative h-14 flex-grow">
            <input 
              type="color" 
              value={settings.brandColor}
              onChange={(e) => onChange({ ...settings, brandColor: e.target.value })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="flex items-center gap-3 h-full px-4 rounded-2xl border-2 transition-all"
              style={{ 
                borderColor: settings.brandColor + '40',
                backgroundColor: settings.brandColor + '10' 
              }}
            >
              <div 
                className="w-8 h-8 rounded-xl shadow-lg shrink-0 border border-white" 
                style={{ backgroundColor: settings.brandColor }}
              ></div>
              <span className="text-[11px] font-mono font-black uppercase text-slate-700 tracking-wider">
                {settings.brandColor}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onChange({...settings, brandColor: '#4f46e5'})}
            className="h-14 w-14 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all"
            title="Reset to Indigo"
          >
            <i className="fas fa-rotate-left text-sm"></i>
          </button>
        </div>
      </div>

      {/* Batch Size Fixed */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Batch Quantity</label>
        <div className="grid grid-cols-4 gap-2">
          {batchSizes.map(size => (
            <button
              key={size}
              onClick={() => onChange({ ...settings, quantity: size })}
              className={`py-3 rounded-xl font-black text-sm border transition-all ${
                settings.quantity === size 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">Batch cost: {settings.quantity} units</p>
      </div>

      {/* Resolution & Format */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resolution</label>
          <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
            {resolutions.map(r => (
              <button
                key={r}
                onClick={() => onChange({ ...settings, resolution: r })}
                className={`py-2 text-[9px] font-black rounded-lg transition-all ${
                  settings.resolution === r 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Format</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
            {formats.map(f => (
              <button
                key={f}
                onClick={() => onChange({ ...settings, format: f })}
                className={`py-2 text-[9px] font-black rounded-lg transition-all ${
                  settings.format === f 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

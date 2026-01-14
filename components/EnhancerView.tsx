
import React, { useState } from 'react';
import { FileUploader } from './FileUploader';
import { Alert } from './Alert';

interface EnhancerViewProps {
  onEnhance: (base64: string) => Promise<void>;
  credits: number;
  isProcessing: boolean;
}

export const EnhancerView: React.FC<EnhancerViewProps> = ({ onEnhance, credits, isProcessing }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const cost = 2;
  const insufficient = credits < cost;

  const handleEnhanceClick = async () => {
    if (sourceImage) {
      await onEnhance(sourceImage);
      setSourceImage(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-16 pb-24 md:pb-0">
      <header className="text-center space-y-2 md:space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full text-indigo-600">
          <i className="fas fa-wand-magic-sparkles text-xs"></i>
          <span className="text-[9px] font-black uppercase tracking-widest">Retouch Engine</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Image Enhancer</h1>
        <p className="text-slate-500 text-xs md:text-base max-w-xl mx-auto font-medium">Professional 4K upscaling and skin retouching.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 space-y-8">
          <FileUploader label="Source" description="Drop image here" icon="fa-upload" onUpload={setSourceImage} preview={sourceImage} />
          
          <div className="p-5 bg-slate-50 rounded-2xl space-y-2">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Processing Stack</h4>
            <ul className="text-[10px] font-bold text-slate-600 space-y-1.5">
              <li><i className="fas fa-check text-indigo-500 mr-2"></i> Skin Smoothing</li>
              <li><i className="fas fa-check text-indigo-500 mr-2"></i> Color Grading</li>
              <li><i className="fas fa-bolt text-amber-500 mr-2"></i> Cost: {cost} Units</li>
            </ul>
          </div>

          <button 
            onClick={handleEnhanceClick}
            disabled={!sourceImage || isProcessing || insufficient}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs h-16 transition-all ${
              !sourceImage || insufficient ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white shadow-xl'
            }`}
          >
            {isProcessing ? <i className="fas fa-circle-notch fa-spin"></i> : insufficient ? 'Refill Credits' : 'Enhance to 4K'}
          </button>
        </div>

        <div className="bg-slate-900 p-6 md:p-10 rounded-[2.5rem] text-white space-y-6 flex flex-col justify-center">
           <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Quality Preview" />
           </div>
           <div>
             <h3 className="text-xl font-bold">Studio Standard</h3>
             <p className="text-slate-400 text-xs md:text-sm mt-2 leading-relaxed">Specialized fashion AI trained for 4K publication quality.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

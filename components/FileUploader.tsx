
import React, { useRef } from 'react';

interface FileUploaderProps {
  label: string;
  description: string;
  icon: string;
  onUpload: (base64: string) => void;
  preview: string | null;
  multiple?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  label, description, icon, onUpload, preview, multiple = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-[1.5rem] transition-all duration-300 flex flex-col items-center justify-center p-8 ${
          preview 
            ? 'border-indigo-600 bg-indigo-50/30' 
            : 'border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100'
        }`}
        style={{ minHeight: '180px' }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
        
        {preview ? (
          <div className="absolute inset-0 p-3">
            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-2xl shadow-sm bg-white" />
            <div className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-indigo-600 border border-slate-100">
              <i className="fas fa-sync text-xs"></i>
            </div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-400">
              <i className={`fas ${icon} text-xl`}></i>
            </div>
            <span className="text-sm text-slate-900 font-bold">{description}</span>
            <span className="text-[10px] text-slate-400 mt-1 font-medium">JPG, PNG (max 10MB)</span>
          </>
        )}
      </div>
    </div>
  );
};

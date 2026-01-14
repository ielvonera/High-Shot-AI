
import React, { useState, useMemo } from 'react';
import { GeneratedImage } from '../types';

interface GalleryViewProps {
  images: GeneratedImage[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (url: string, id: string, format: string, quality: string) => void;
  onEnhance: (id: string) => Promise<void>;
}

interface DownloadModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onConfirm: (format: string, quality: string) => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ image, onClose, onConfirm }) => {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState('hd');

  const formats = [
    { id: 'png', label: 'PNG', desc: 'Best for editing' },
    { id: 'jpg', label: 'JPG', desc: 'Web ready' },
    { id: 'webp', label: 'WebP', desc: 'Ultra fast' },
  ];

  const qualities = [
    { id: 'standard', label: 'Standard', desc: 'Social feeds' },
    { id: 'hd', label: 'Ultra HD (4K)', desc: 'Max quality' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-3xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-serif font-bold text-slate-900">Export Asset</h3>
          <button onClick={onClose} className="text-slate-400 p-2 hover:text-slate-900"><i className="fas fa-times"></i></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Format Selection</label>
            <div className="grid grid-cols-1 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    format === f.id ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900">{f.label}</div>
                    <div className="text-[10px] text-slate-500">{f.desc}</div>
                  </div>
                  {format === f.id && <i className="fas fa-check-circle text-indigo-600"></i>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Resolution</label>
            <div className="grid grid-cols-1 gap-2">
              {qualities.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuality(q.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    quality === q.id ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900">{q.label}</div>
                    <div className="text-[10px] text-slate-500">{q.desc}</div>
                  </div>
                  {quality === q.id && <i className="fas fa-check-circle text-indigo-600"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button onClick={() => onConfirm(format, quality)} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
            Process Download
          </button>
        </div>
      </div>
    </div>
  );
};

const GalleryItem: React.FC<{
  img: GeneratedImage;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (img: GeneratedImage) => void;
  onEnhance: (id: string) => void;
}> = ({ img, onToggleFavorite, onDelete, onDownload, onEnhance }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="aspect-[3/4] overflow-hidden relative bg-slate-100">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 animate-pulse">
            <i className="fas fa-image text-slate-200 text-3xl"></i>
          </div>
        )}
        <img 
          src={img.url} 
          alt="Fashion shot" 
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Asset+Expired';
          }}
        />
        
        {img.resolution === 'HD' && (
          <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">4K ULTRA HD</div>
        )}
        
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-5">
          <div className="flex justify-end gap-2">
            <button onClick={() => onToggleFavorite(img.id)} className={`w-9 h-9 rounded-xl flex items-center justify-center border backdrop-blur-md transition-all ${img.isFavorite ? 'bg-yellow-400 border-yellow-300 text-white scale-110' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
              <i className="fas fa-star text-sm"></i>
            </button>
            <button onClick={() => onDelete(img.id)} className="w-9 h-9 bg-rose-500/80 border border-rose-400 text-white rounded-xl flex items-center justify-center backdrop-blur-md hover:bg-rose-600 transition-all">
              <i className="fas fa-trash-alt text-sm"></i>
            </button>
          </div>
          <div className="flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {img.resolution !== 'HD' && (
              <button onClick={() => onEnhance(img.id)} className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                <i className="fas fa-wand-magic-sparkles mr-2"></i> Retouch 4K
              </button>
            )}
            <button onClick={() => onDownload(img)} className="w-full py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
              <i className="fas fa-download mr-2"></i> Export
            </button>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[11px] text-slate-800 font-bold truncate leading-tight">"{img.prompt}"</p>
        <div className="mt-3 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-50 pt-3">
          <span className="flex items-center gap-1.5"><i className="fas fa-layer-group text-indigo-400"></i> {img.platform}</span>
          <span>{new Date(img.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export const GalleryView: React.FC<GalleryViewProps> = ({ images, onToggleFavorite, onDelete, onDownload, onEnhance }) => {
  const [filter, setFilter] = useState('all');
  const [downloadTarget, setDownloadTarget] = useState<GeneratedImage | null>(null);

  const filteredImages = useMemo(() => {
    if (!images) return [];
    return images.filter(img => filter === 'all' || (filter === 'favorites' && img.isFavorite));
  }, [images, filter]);

  return (
    <div className="space-y-6 md:space-y-12 pb-24 md:pb-0 animate-in fade-in duration-700">
      {downloadTarget && <DownloadModal image={downloadTarget} onClose={() => setDownloadTarget(null)} onConfirm={(f, q) => { onDownload(downloadTarget.url, downloadTarget.id, f, q); setDownloadTarget(null); }} />}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
             <i className="fas fa-images text-2xl"></i>
           </div>
           <div>
             <h1 className="text-3xl font-serif font-bold text-slate-900">Media Library</h1>
             <p className="text-slate-400 text-sm font-medium mt-1">Total Assets: {images.length}</p>
           </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-full sm:w-auto">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'all' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('favorites')} 
            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'favorites' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Favorites
          </button>
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-camera-rotate text-4xl opacity-20"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-600">No assets in this view</h3>
          <p className="text-sm font-medium mt-2 max-w-xs text-center">Run a production batch in the studio to see your visuals here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
          {filteredImages.map((img) => (
            // Fixed reference to deleteImage by using the onDelete prop
            <GalleryItem key={img.id} img={img} onToggleFavorite={onToggleFavorite} onDelete={onDelete} onDownload={setDownloadTarget} onEnhance={onEnhance} />
          ))}
        </div>
      )}
    </div>
  );
};
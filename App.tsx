
import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User, updateProfile, sendPasswordResetEmail, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { Sidebar } from './components/Sidebar';
import { GalleryView } from './components/GalleryView';
import { FileUploader } from './components/FileUploader';
import { SettingsForm } from './components/SettingsForm';
import { LandingPage } from './components/LandingPage';
import { LoginPage, SignupPage } from './components/AuthPages';
import { Notification, NotificationType } from './components/Notification';
import { ProfileView } from './components/ProfileView';
import { EnhancerView } from './components/EnhancerView';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { CommercialUse } from './components/CommercialUse';
import { Alert } from './components/Alert';
import { AppState, GeneratedImage, GenerationSettings, ViewType } from './types';
import { geminiService } from './services/gemini';
import { storage } from './services/storage';

const INITIAL_SETTINGS: GenerationSettings = {
  brandStyle: 'Luxury',
  brandColor: '#4f46e5',
  useLogo: false,
  platform: 'Instagram Post',
  background: 'Studio',
  quantity: 4,
  resolution: 'Standard',
  format: 'PNG'
};

const BottomNav: React.FC<{ currentView: ViewType; onViewChange: (view: ViewType) => void }> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'generator', icon: 'fa-wand-magic-sparkles', label: 'Studio' },
    { id: 'enhancer', icon: 'fa-wand-magic', label: 'Retouch' },
    { id: 'gallery', icon: 'fa-images', label: 'Gallery' },
    { id: 'profile', icon: 'fa-user-gear', label: 'Account' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white/90 backdrop-blur-2xl border-t border-slate-100 flex items-center justify-around px-2 z-50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id as ViewType)}
          className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 h-full ${
            currentView === item.id ? 'text-indigo-600 scale-110' : 'text-slate-400'
          }`}
        >
          <i className={`fas ${item.icon} text-lg`}></i>
          <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          {currentView === item.id && <div className="w-1 h-1 bg-indigo-600 rounded-full mt-0.5"></div>}
        </button>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: NotificationType} | null>(null);
  const [activeBatchResults, setActiveBatchResults] = useState<GeneratedImage[]>([]);
  const [state, setState] = useState<AppState>(() => {
    try {
      return {
        currentView: 'landing',
        modelImage: null,
        productImages: [],
        settings: INITIAL_SETTINGS,
        results: storage.getImages() || [],
        isGenerating: false,
        error: null,
        credits: storage.getCredits() ?? 10,
      };
    } catch (e) {
      return {
        currentView: 'landing',
        modelImage: null,
        productImages: [],
        settings: INITIAL_SETTINGS,
        results: [],
        isGenerating: false,
        error: "Sync error - Cache cleared.",
        credits: 10,
      };
    }
  });

  const setView = useCallback((view: ViewType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const notify = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
  };

  const clearError = () => setState(prev => ({ ...prev, error: null }));

  const getMaxCredits = () => {
    switch (profile?.plan) {
      case 'agency': return 600;
      case 'pro': return 150;
      default: return 10;
    }
  };

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              name: currentUser.displayName || 'Designer',
              email: currentUser.email,
              plan: "free",
              credits: 10,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            }, { merge: true });
          }

          unsubProfile = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setProfile(data);
              setState(prev => ({ ...prev, credits: data.credits }));
              storage.saveCredits(data.credits);
            }
          }, (error) => {
            console.warn("Firestore sync issue: ", error);
          });
          
          if (['landing', 'login', 'signup'].includes(state.currentView)) {
            setView('generator');
            notify(`Welcome back! Studio ready.`, 'success');
          }
        } catch (e) {
          console.error("Auth init error", e);
        }
      } else {
        setProfile(null);
        if (unsubProfile) unsubProfile();
      }
      setAuthLoading(false);
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, [state.currentView, setView]);

  useEffect(() => {
    if (state.results) {
      storage.saveImages(state.results);
    }
  }, [state.results]);

  const handleLogout = async () => {
    await firebaseSignOut(auth);
    setView('landing');
    notify('Signed out successfully.', 'info');
  };

  const handleUpdateName = async (newName: string) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: newName });
      await setDoc(doc(db, "users", user.uid), { name: newName }, { merge: true });
      notify("Profile updated successfully", "success");
    } catch (err: any) {
      notify(err.message, "error");
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      notify("Password reset link sent to your email", "success");
    } catch (err: any) {
      notify(err.message, "error");
    }
  };

  const handleEnhance = async (id: string) => {
    if (!user) return;
    const cost = 2;
    if (state.credits < cost) {
      notify("Insufficient credits for enhancement.", 'error');
      return;
    }

    const targetImg = state.results.find(img => img.id === id);
    if (!targetImg) return;

    notify("Enhancing image to 4K quality...", "info");
    
    try {
      const enhancedUrl = await geminiService.enhanceImage(targetImg.url);
      
      await setDoc(doc(db, "users", user.uid), {
        credits: increment(-cost)
      }, { merge: true });

      setState(prev => ({
        ...prev,
        results: prev.results.map(img => img.id === id ? { ...img, url: enhancedUrl, resolution: 'HD' } : img),
        credits: prev.credits - cost
      }));
      storage.saveCredits(state.credits - cost);
      notify("Image enhanced successfully!", "success");
    } catch (err) {
      notify("Enhancement failed.", "error");
    }
  };

  const handleStandaloneEnhance = async (base64: string) => {
    if (!user) return;
    const cost = 2;
    if (state.credits < cost) {
      notify("Insufficient credits.", 'error');
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true }));
    notify("Direct Retouching active...", "info");

    try {
      const enhancedUrl = await geminiService.enhanceImage(base64);
      const id = Math.random().toString(36).substr(2, 9);
      
      const newImage: GeneratedImage = {
        id,
        url: enhancedUrl,
        prompt: "Standalone AI Retouching",
        timestamp: Date.now(),
        platform: 'Website Product Page',
        style: 'Luxury',
        resolution: 'HD',
        format: 'PNG',
        isFavorite: false
      };

      await setDoc(doc(db, "users", user.uid), {
        credits: increment(-cost)
      }, { merge: true });

      setState(prev => ({
        ...prev,
        results: [newImage, ...prev.results].slice(0, 10),
        credits: prev.credits - cost,
        isGenerating: false
      }));
      storage.saveCredits(state.credits - cost);
      notify("Enhancement complete. Saved to Gallery.", "success");
      setView('gallery');
    } catch (err) {
      setState(prev => ({ ...prev, isGenerating: false }));
      notify("Enhancement failed.", "error");
    }
  };

  const handleGenerate = async () => {
    if (!user) {
        setView('login');
        return;
    }

    const cost = state.settings.quantity;
    if (state.credits < cost) {
      notify("Insufficient credits. Please upgrade your plan.", 'error');
      setView('profile');
      return;
    }

    if (!state.modelImage || state.productImages.length === 0) {
      notify("Please upload assets first.", 'error');
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    setActiveBatchResults([]);
    notify(`Rendering photoshoot...`, 'info');

    try {
      const productToUse = state.productImages[0];
      const newlyGeneratedImages: GeneratedImage[] = [];

      for (let i = 0; i < cost; i++) {
        try {
          const imageUrl = await geminiService.generateFashionImage(
            state.modelImage,
            productToUse,
            state.settings
          );
          
          const id = Math.random().toString(36).substr(2, 9);
          const newImg: GeneratedImage = {
            id,
            url: imageUrl,
            prompt: `${state.settings.brandStyle} campaign on ${state.settings.background}`,
            timestamp: Date.now(),
            platform: state.settings.platform,
            style: state.settings.brandStyle,
            resolution: state.settings.resolution,
            format: state.settings.format,
            isFavorite: false
          };

          newlyGeneratedImages.push(newImg);
          setActiveBatchResults(prev => [...prev, newImg]);
          
          setState(prev => ({
            ...prev,
            results: [newImg, ...prev.results].slice(0, 15)
          }));

          await setDoc(doc(db, "users", user.uid), {
            credits: increment(-1)
          }, { merge: true });

        } catch (innerErr: any) {
          console.error("Batch item failure:", innerErr);
          notify(`Render failed: ${innerErr.message || 'Error'}`, 'error');
        }
      }

      const totalSuccess = newlyGeneratedImages.length;
      if (totalSuccess > 0) {
        setState(prev => ({ ...prev, isGenerating: false }));
        notify(`${totalSuccess} visuals saved to gallery!`, 'success');
      } else {
        setState(prev => ({ ...prev, isGenerating: false, error: "Batch rendering failed." }));
      }

    } catch (err: any) {
      console.error(err);
      let errorMessage = "AI engine issue. Try again.";
      if (err.message?.includes('SAFETY')) {
        errorMessage = "Generation blocked by safety filters.";
      }
      setState(prev => ({ ...prev, isGenerating: false, error: errorMessage }));
      notify('Shoot failed.', 'error');
    }
  };

  const handleDownload = async (url: string, id: string, format: string, quality: string) => {
    try {
      notify('Processing export...', 'info');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas failure");

      let scale = quality === 'Standard' || quality === 'standard' ? 0.7 : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const mimeType = format === 'jpg' || format === 'JPG' ? 'image/jpeg' : format === 'webp' || format === 'WebP' ? 'image/webp' : `image/png`;
      const dataUrl = canvas.toDataURL(mimeType, 0.92);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `highshot-${id}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify('Exported!', 'success');
    } catch (err) {
      notify('Export failed.', 'error');
    }
  };

  const toggleFavorite = (id: string) => {
    setState(prev => ({
      ...prev,
      results: prev.results.map(img => img.id === id ? { ...img, isFavorite: !img.isFavorite } : img)
    }));
  };

  const deleteImage = (id: string) => {
    setState(prev => ({
      ...prev,
      results: prev.results.filter(img => img.id !== id)
    }));
    notify('Deleted.', 'info');
  };

  const handleClearCache = () => {
    storage.clearAll();
    setState(prev => ({ ...prev, results: [] }));
    notify('Session cache cleared successfully.', 'success');
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><i className="fas fa-circle-notch fa-spin text-4xl text-indigo-600"></i></div>;

  const publicViews: ViewType[] = ['landing', 'about', 'contact', 'how-it-works', 'features', 'use-cases', 'privacy-policy', 'terms-of-service', 'commercial-use'];
  const isPublicView = publicViews.includes(state.currentView);

  if (state.currentView === 'login') return <LoginPage onSuccess={() => setView('generator')} onSwitch={() => setView('signup')} />;
  if (state.currentView === 'signup') return <SignupPage onSuccess={() => setView('generator')} onSwitch={() => setView('login')} />;

  if (isPublicView) {
    if (state.currentView === 'privacy-policy') return <PrivacyPolicy onViewChange={setView} />;
    if (state.currentView === 'terms-of-service') return <TermsOfService onViewChange={setView} />;
    if (state.currentView === 'commercial-use') return <CommercialUse onViewChange={setView} />;

    return (
      <>
        <LandingPage 
          onStart={() => user ? setView('generator') : setView('signup')} 
          onViewChange={setView} 
          currentView={state.currentView} 
        />
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </>
    );
  }

  const renderDashboardView = () => {
    if (!user) { setView('login'); return null; }

    switch (state.currentView) {
      case 'profile':
        return (
          <ProfileView 
            user={user} 
            profile={profile} 
            credits={state.credits}
            onUpdateName={handleUpdateName} 
            onResetPassword={handleResetPassword} 
            onLogout={handleLogout}
            onClearCache={handleClearCache}
            notify={notify}
          />
        );
      case 'enhancer':
        return (
          <EnhancerView 
            onEnhance={handleStandaloneEnhance} 
            credits={state.credits} 
            isProcessing={state.isGenerating} 
          />
        );
      case 'generator':
        const batchCost = state.settings.quantity;
        const insufficient = state.credits < batchCost;
        const missingAssets = !state.modelImage || state.productImages.length === 0;
        const hasSomeAssets = state.modelImage || state.productImages.length > 0;
        
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-0">
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Assets</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <FileUploader label="1. Model" description="Base photo" icon="fa-user-tie" onUpload={(b) => setState(p => ({...p, modelImage: b}))} preview={state.modelImage} />
                  <FileUploader label="2. Product" description="The Item" icon="fa-shirt" onUpload={(b) => setState(p => ({...p, productImages: [b]}))} preview={state.productImages[0] || null} />
                </div>
              </div>
              <SettingsForm settings={state.settings} onChange={(settings) => setState(p => ({ ...p, settings }))} />
              <div className="space-y-4">
                {insufficient && (
                  <div className="p-5 bg-rose-50 rounded-[1.5rem] border border-rose-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shrink-0">
                      <i className="fas fa-battery-empty"></i>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Low Credits</h4>
                      <p className="text-[10px] text-rose-700 font-bold mt-1">Refill needed for {batchCost} generation units.</p>
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleGenerate} 
                  disabled={state.isGenerating || missingAssets || insufficient} 
                  className={`w-full py-5 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all h-16 ${insufficient || missingAssets ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98]'}`}
                >
                  {state.isGenerating ? <i className="fas fa-circle-notch fa-spin"></i> : (
                    <>
                      <i className="fas fa-wand-sparkles mr-2"></i> 
                      {missingAssets ? 'Ready Asset Pair First' : (insufficient ? 'Refill Credits' : `Run Batch (${batchCost})`)}
                    </>
                  )}
                </button>
              </div>
            </aside>
            <section className="lg:col-span-8 space-y-6">
               <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
                  <div><h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900">Render Preview</h2></div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full tracking-widest">
                    <i className="fas fa-circle text-[8px] animate-pulse"></i> ENGINE ACTIVE
                  </div>
               </div>

               {state.error && <Alert title="Engine Alert" message={state.error} onClear={clearError} />}

               {state.isGenerating ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {[...Array(state.settings.quantity)].map((_, i) => (
                      <div key={i} className="aspect-[3/4] bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-200 animate-pulse">
                        {activeBatchResults[i] ? (
                          <img src={activeBatchResults[i].url} className="w-full h-full object-cover rounded-[1.8rem]" alt="Rendered" />
                        ) : (
                          <>
                            <i className="fas fa-camera text-3xl mb-4"></i>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Processing...</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
               ) : !state.error && state.results.length === 0 ? (
                 hasSomeAssets ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-2">Source: Model Identity</span>
                        <div className="aspect-[3/4] bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm flex items-center justify-center relative group">
                          {state.modelImage ? (
                            <img src={state.modelImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Source Model" />
                          ) : (
                            <div className="text-slate-200 flex flex-col items-center">
                              <i className="fas fa-user-tie text-5xl mb-3 opacity-30"></i>
                              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Awaiting Model</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-2">Source: Product Asset</span>
                        <div className="aspect-[3/4] bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm flex items-center justify-center relative group">
                          {state.productImages[0] ? (
                            <img src={state.productImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Source Product" />
                          ) : (
                            <div className="text-slate-200 flex flex-col items-center">
                              <i className="fas fa-shirt text-5xl mb-3 opacity-30"></i>
                              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Awaiting Product</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                 ) : (
                  <div className="relative aspect-square md:aspect-video bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl mb-6">
                      <i className="fas fa-camera-retro text-2xl md:text-3xl"></i>
                    </div>
                    <h3 className="text-xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight">Studio Ready for Production</h3>
                    <p className="text-slate-500 mt-2 text-xs md:text-sm max-w-xs font-medium leading-relaxed">Pair your assets to generate photorealistic commercial assets.</p>
                  </div>
                 )
               ) : !state.error && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {state.results.slice(0, Math.max(state.settings.quantity, activeBatchResults.length)).map(img => (
                      <div key={img.id} className="group relative aspect-[3/4] bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm transition-all">
                        <img 
                          src={img.url} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
                          alt="Result" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Generation+Error';
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all p-6 flex flex-col justify-end">
                             <button onClick={() => handleDownload(img.url, img.id, img.format, img.resolution)} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                              <i className="fas fa-download mr-2"></i> Export {img.resolution}
                             </button>
                        </div>
                      </div>
                    ))}
                  </div>
               )}
            </section>
          </div>
        );
      case 'gallery':
        return <GalleryView images={state.results} onToggleFavorite={toggleFavorite} onDelete={deleteImage} onDownload={handleDownload} onEnhance={handleEnhance} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row text-slate-900">
      <Sidebar currentView={state.currentView} onViewChange={setView} credits={state.credits} profile={profile} user={user} />
      
      {!isPublicView && (
        <div className="md:hidden fixed top-0 w-full h-16 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-4 flex items-center justify-between z-[45]">
          <div className="flex items-center gap-2" onClick={() => setView('landing')}>
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <i className="fas fa-camera-retro text-white text-xs"></i>
             </div>
             <span className="font-serif font-bold text-lg">High Shot AI</span>
          </div>
          <div className="flex items-center gap-2">
             <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${state.credits < 5 ? 'bg-amber-600' : 'bg-slate-900'} text-white text-[10px] font-black uppercase tracking-widest`} onClick={() => setView('profile')}>
                <i className="fas fa-bolt-lightning text-[8px]"></i> {state.credits}
             </div>
          </div>
        </div>
      )}

      <main className={`${isPublicView ? 'w-full' : 'md:ml-64 w-full'} flex-grow relative mt-16 md:mt-0 pb-16 md:pb-0`}>
        {!isPublicView && (
          <header className="hidden md:flex sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 px-12 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace</span>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-bold text-slate-900 capitalize">{state.currentView.replace('-', ' ')}</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 px-5 py-2.5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">Power Balance</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-slate-900">{state.credits}</span>
                    <span className="text-[10px] text-slate-400 font-bold">/ {getMaxCredits()}</span>
                  </div>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${state.credits < 5 ? 'bg-amber-600' : 'bg-indigo-600'} text-white shadow-md`}>
                  <i className="fas fa-bolt text-xs"></i>
                </div>
              </div>
              <div className="bg-slate-900 text-white px-5 py-2.5 rounded-[1.5rem] border border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{profile?.plan || 'Free'}</span>
              </div>
            </div>
          </header>
        )}
        
        <div className={`p-4 md:p-12 ${isPublicView ? 'pt-0' : ''}`}>
          {renderDashboardView()}
        </div>

        {!isPublicView && <BottomNav currentView={state.currentView} onViewChange={setView} />}
      </main>
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default App;

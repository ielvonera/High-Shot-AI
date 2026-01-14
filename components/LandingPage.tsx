
import React, { useState, useEffect, useRef } from 'react';
import { ViewType } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onViewChange: (view: ViewType) => void;
  currentView: ViewType;
}

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('.pricing-card') ||
        target.closest('.nav-link') ||
        target.closest('select') ||
        target.closest('input')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return <div ref={cursorRef} className={`custom-cursor hidden lg:block ${isHovering ? 'hovering' : ''}`} />;
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onViewChange, currentView }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progress = document.getElementById('scroll-progress');
      if (progress) progress.style.width = scrolled + '%';

      if (window.scrollY > lastScrollY && window.scrollY > 80) { 
        setHeaderVisible(false); 
      } else { 
        setHeaderVisible(true); 
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const brands = ["VOGUE", "HARPER'S", "ELLE", "GQ", "LUXE", "MODE", "VALENTINO", "PRADA"];

  const features = [
    { 
      title: "Batch Generation", 
      desc: "Produce dozens of variations for your entire collection in seconds.", 
      icon: "fa-bolt-lightning",
      color: "bg-amber-50 text-amber-600"
    },
    { 
      title: "Photorealistic 3D", 
      desc: "Our AI understands lighting and depth for natural product placement.", 
      icon: "fa-cube",
      color: "bg-indigo-50 text-indigo-600"
    },
    { 
      title: "Social-Ready", 
      desc: "Optimized aspect ratios for Instagram, TikTok, and E-commerce.", 
      icon: "fa-mobile-screen",
      color: "bg-emerald-50 text-emerald-600"
    },
    { 
      title: "Brand-Ready Visuals", 
      desc: "Maintain visual consistency with built-in styling and logo tools.", 
      icon: "fa-palette",
      color: "bg-rose-50 text-rose-600"
    }
  ];

  const pricing = [
    {
      name: "Starter",
      monthlyPrice: 0,
      yearlyPrice: 0,
      credits: 10,
      desc: "Perfect for testing the engine.",
      benefits: [
        "10 Free AI Shots",
        "Standard Resolution",
        "Basic Studio Contexts",
        "Community Support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Studio Pro",
      monthlyPrice: 19,
      yearlyPrice: 15,
      credits: 150,
      bonus: "🎁 +50 Bonus Units",
      desc: "For growing brands & agencies.",
      benefits: [
        "150 AI Shots / month",
        "Ultra-HD 4K Exports",
        "All Lifestyle Backgrounds",
        "Priority Rendering"
      ],
      cta: "Enter Studio Pro",
      popular: true
    },
    {
      name: "Agency",
      monthlyPrice: 29,
      yearlyPrice: 24,
      credits: 600,
      desc: "Built for high-volume studios.",
      benefits: [
        "600 AI Shots / month",
        "Custom Brand Style AI",
        "API Access (Early)",
        "Dedicated Account Manager"
      ],
      cta: "Go Enterprise",
      popular: false
    }
  ];

  const steps = [
    { number: "01", title: "Upload Assets", desc: "Upload your product PNG and model photo." },
    { number: "02", title: "AI Generation", desc: "AI fuses them with cinematic lighting." },
    { number: "03", title: "Publish & Sell", desc: "Download 4K images and boost sales." }
  ];

  return (
    <div className="bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative">
      <CustomCursor />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-500 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 cursor-pointer group" onClick={() => onViewChange('landing')}>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-indigo-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-all duration-500">
              <i className="fas fa-camera-retro text-white text-sm md:text-xl"></i>
            </div>
            <span className="text-xl md:text-3xl font-serif font-bold tracking-tight text-slate-900">High Shot AI</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <button onClick={() => onViewChange('features')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Features</button>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Pricing</button>
            <button onClick={() => onViewChange('contact')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Contact</button>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button onClick={() => onViewChange('login')} className="text-slate-500 font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:text-indigo-600 transition-colors px-2 md:px-0">Log In</button>
            <button onClick={onStart} className="bg-indigo-600 text-white px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.03] active:scale-95 transition-all text-[9px] md:text-[11px] uppercase tracking-widest">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile-First Hero Section */}
      <section className="pt-24 md:pt-48 pb-12 md:pb-20 relative overflow-hidden px-4 md:px-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center text-center lg:text-left">
          <div className="space-y-6 md:space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 md:gap-3 bg-indigo-50 border border-indigo-100 px-3 md:px-5 py-1.5 md:py-2 rounded-full shadow-sm mx-auto lg:mx-0">
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-indigo-600">v3 Engine Now Live</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-bold leading-[1.1] md:leading-[0.9] tracking-tighter text-slate-900">
              AI-Generated Product Images <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600 bg-clip-text text-transparent italic tracking-tighter">That Sell</span>.
            </h1>
            
            <p className="text-base md:text-2xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Upload product and model photos. Get ad-ready, commercial-grade images instantly. Perfect for E-commerce & Social Media.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-4">
              <button onClick={onStart} className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-slate-900 text-white rounded-xl md:rounded-[2rem] font-black text-sm md:text-lg shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-4">
                Start Free Trial <i className="fas fa-sparkles text-sm"></i>
              </button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 text-slate-500 font-black uppercase tracking-widest text-[10px] md:text-xs hover:text-indigo-600 transition-colors">
                View Pricing
              </button>
            </div>
          </div>

          {/* Hero Image Container */}
          <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 mt-8 lg:mt-0">
             <div className="relative z-10 w-full aspect-[4/5] max-w-[280px] sm:max-w-[320px] md:max-w-lg mx-auto">
                <div className="absolute inset-0 bg-indigo-600/10 blur-[40px] md:blur-[120px] rounded-full"></div>
                <div className="relative w-full h-full bg-white rounded-[2rem] md:rounded-[4rem] border border-slate-100 shadow-2xl p-2 md:p-5 tilt-card overflow-hidden">
                  <div className="w-full h-full rounded-[1.8rem] md:rounded-[3rem] overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4000ms]" alt="High Shot AI Model" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-4 md:p-10 text-white">
                      <div className="text-[7px] md:text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur w-fit px-2 md:px-3 py-1 rounded-lg mb-2 border border-white/20">AI Generated Asset</div>
                      <h4 className="text-lg md:text-3xl font-serif font-bold italic tracking-tight">Milan Collection 2025</h4>
                    </div>
                  </div>
                </div>
                {/* Floating Elements - Hidden on very small mobile */}
                <div className="absolute -top-4 -left-4 md:-top-10 md:-left-10 w-20 h-28 md:w-40 md:h-52 rounded-xl md:rounded-[2rem] border border-slate-100 bg-white/80 backdrop-blur shadow-2xl p-1 md:p-2 animate-float overflow-hidden hidden sm:block">
                   <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover rounded-lg md:rounded-[1.5rem]" alt="Campaign" />
                </div>
                <div className="absolute -bottom-4 -right-4 md:-bottom-10 md:-right-10 w-28 h-20 md:w-48 md:h-32 rounded-xl md:rounded-[2rem] border border-slate-100 bg-white/80 backdrop-blur shadow-2xl p-2 md:p-4 animate-float-delayed hidden sm:flex items-center gap-2 md:gap-4">
                   <div className="w-7 h-7 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                     <i className="fas fa-camera text-white text-[10px] md:text-sm"></i>
                   </div>
                   <div>
                     <div className="text-[6px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Resolution</div>
                     <div className="text-[8px] md:text-xs font-black text-slate-900">4K Ultra HD</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-8 md:py-20 bg-slate-50 border-y border-slate-100 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          {brands.concat(brands).map((brand, i) => (
            <span key={i} className="text-3xl md:text-8xl font-serif font-black text-slate-200 mx-6 md:mx-20 tracking-tighter opacity-50 select-none">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Features Grid - Vertical on Mobile */}
      <section className="py-16 md:py-40 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-indigo-600 text-[10px] md:text-xs font-black uppercase tracking-widest">Premium Features</span>
          <h2 className="text-3xl md:text-6xl font-serif font-bold text-slate-900 mt-4">Powerful Tools for Brands</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-2xl transition-all group active:scale-95 sm:active:scale-100">
              <div className={`w-10 h-10 md:w-14 md:h-14 ${f.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                <i className={`fas ${f.icon} text-base md:text-xl`}></i>
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - Step-by-Step Flow */}
      <section className="py-16 md:py-32 bg-slate-50 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2 space-y-6 md:space-y-10">
              <span className="text-indigo-600 text-[10px] md:text-xs font-black uppercase tracking-widest">The Workflow</span>
              <h2 className="text-3xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">From Product to Ad in Seconds</h2>
              <div className="space-y-8 md:space-y-12 mt-8 md:mt-16">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4 md:gap-8 group">
                    <div className="text-2xl md:text-4xl font-serif font-black text-indigo-100 group-hover:text-indigo-600 transition-colors">{step.number}</div>
                    <div className="space-y-1 md:space-y-2">
                      <h4 className="text-lg md:text-2xl font-bold text-slate-900">{step.title}</h4>
                      <p className="text-slate-500 text-xs md:text-base font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-4xl border border-white">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="How High Shot Works" />
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/90 rounded-full flex items-center justify-center text-indigo-600 shadow-2xl animate-pulse">
                      <i className="fas fa-play text-xl md:text-3xl translate-x-1"></i>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Realism Section - Fixed Comparison Layout */}
      <section className="py-16 md:py-40 bg-slate-900 rounded-[2rem] md:rounded-[5rem] mx-2 md:mx-12 overflow-hidden text-center lg:text-left">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="space-y-6 md:space-y-8">
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Commercial Realism</span>
            <h2 className="text-3xl md:text-7xl font-serif font-bold text-white leading-tight tracking-tighter">Place any product <br className="hidden md:block" />on any model.</h2>
            <p className="text-slate-400 text-sm md:text-xl font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Upload your product PNG and a model photo. Our AI handles the fit, fabric physics, shadows, and color grading perfectly.
            </p>
            <button onClick={onStart} className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest text-[9px] md:text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
              Open the Studio
            </button>
          </div>
          <div className="relative aspect-square sm:aspect-video rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 group shadow-4xl bg-slate-800">
             <div className="absolute inset-0 flex flex-col sm:flex-row">
                {/* Left: Input Assets */}
                <div className="h-1/2 sm:h-full sm:w-1/2 overflow-hidden border-b sm:border-b-0 sm:border-r border-white/20 relative">
                  <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-50 transition-all group-hover:scale-105" alt="Raw Input Asset" />
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[8px] font-black uppercase text-white tracking-widest border border-white/20">Raw Input</div>
                </div>
                {/* Right: AI Rendered */}
                <div className="h-1/2 sm:h-full sm:w-1/2 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1539109132384-3615557de104?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-all group-hover:scale-105" alt="AI Processed Output" />
                  <div className="absolute top-4 right-4 bg-indigo-600 px-3 py-1.5 rounded-full text-[8px] font-black uppercase text-white tracking-widest shadow-lg">AI Rendered</div>
                </div>
             </div>
             <div className="absolute inset-0 pointer-events-none border-[6px] md:border-[12px] border-slate-900/50"></div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Mobile Optimized Cards */}
      <section id="pricing" className="py-16 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="text-center space-y-4 md:space-y-8 mb-12 md:mb-32">
             <span className="text-indigo-600 text-[10px] md:text-xs font-black uppercase tracking-widest">Pricing & Plans</span>
             <h2 className="text-3xl md:text-8xl font-serif font-bold tracking-tight text-slate-900 leading-[1.1]">Usage-Based Pricing</h2>
             
             <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-12">
               <span className={`text-[10px] md:text-sm font-black uppercase tracking-widest transition-colors ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
               <button onClick={() => setIsYearly(!isYearly)} className="w-12 md:w-16 h-6 md:h-8 bg-slate-100 rounded-full p-1 relative border border-slate-200">
                  <div className={`w-4 h-4 md:w-6 md:h-6 bg-indigo-600 rounded-full transition-all duration-300 transform ${isYearly ? 'translate-x-6 md:translate-x-8' : 'translate-x-0'}`}></div>
               </button>
               <span className={`text-[10px] md:text-sm font-black uppercase tracking-widest transition-colors ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="ml-1 text-[7px] md:text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 md:py-1 rounded-full border border-emerald-200 uppercase">Save 20%</span></span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            {pricing.map((plan, i) => (
              <div key={i} className={`pricing-card group p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border transition-all duration-700 flex flex-col h-full relative ${plan.popular ? 'border-indigo-600 bg-white ring-2 md:ring-4 ring-indigo-50 shadow-4xl scale-100 lg:scale-105 z-10' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                 {plan.popular && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 md:px-8 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap">Most Popular</span>}
                 
                 <div className="mb-6 md:mb-10">
                   <h3 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-4">{plan.name}</h3>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl md:text-6xl font-serif font-bold tracking-tighter text-slate-900">${isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                     <span className="text-slate-500 font-bold uppercase text-[10px] md:text-xs">/mo</span>
                   </div>
                 </div>

                 <div className="space-y-2 md:space-y-4 mb-6 md:mb-10">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-lg md:text-2xl">
                      <i className="fas fa-bolt-lightning text-indigo-600"></i> {plan.credits} Units
                    </div>
                    {plan.bonus && <div className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest">{plan.bonus}</div>}
                    <p className="text-slate-500 text-[11px] md:text-sm leading-relaxed font-medium">{plan.desc}</p>
                 </div>
                 
                 <div className="space-y-3 md:space-y-5 mb-8 md:mb-14 flex-grow border-t border-slate-100 pt-6 md:pt-8">
                    {plan.benefits.map((benefit, j) => (
                      <div key={j} className="flex gap-3 md:gap-4 items-center text-slate-600 text-[11px] md:text-sm font-bold">
                        <i className="fas fa-check text-indigo-600 text-[9px] md:text-xs shrink-0"></i> 
                        <span>{benefit}</span>
                      </div>
                    ))}
                 </div>

                 <button onClick={onStart} className={`w-full py-4 md:py-6 rounded-xl md:rounded-[2rem] font-black text-sm md:text-lg uppercase tracking-widest transition-all h-12 md:h-18 flex items-center justify-center ${plan.popular ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>
                   {plan.cta}
                 </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Stacked on Mobile */}
      <footer className="pt-16 md:pt-48 pb-10 md:pb-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-24 mb-12 md:mb-32 text-center md:text-left">
             <div className="col-span-1 lg:col-span-2 space-y-6 md:space-y-10">
               <div className="flex items-center justify-center md:justify-start gap-3">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl">
                   <i className="fas fa-camera-retro text-white text-lg md:text-2xl"></i>
                 </div>
                 <span className="text-2xl md:text-4xl font-serif font-bold tracking-tight text-slate-900">High Shot AI</span>
               </div>
               <p className="text-sm md:text-xl text-slate-500 max-w-md mx-auto md:mx-0 font-medium leading-relaxed">The future of commercial fashion imagery through generative intelligence.</p>
               <div className="flex justify-center md:justify-start gap-4">
                 {[ 'instagram', 'twitter', 'linkedin-in' ].map(icon => (
                   <button key={icon} className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                     <i className={`fab fa-${icon} text-sm md:text-base`}></i>
                   </button>
                 ))}
               </div>
             </div>
             
             <div className="space-y-4 md:space-y-8">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-[8px] md:text-[10px] border-b border-slate-100 pb-2 md:pb-4">Product</h4>
                <ul className="text-slate-500 space-y-3 md:space-y-5 text-[10px] md:text-sm font-bold tracking-wide uppercase">
                  <li><button onClick={() => onViewChange('features')} className="hover:text-indigo-600">Features</button></li>
                  <li><button onClick={onStart} className="hover:text-indigo-600">Studio</button></li>
                  <li><button onClick={() => onViewChange('enhancer')} className="hover:text-indigo-600">Enhancer</button></li>
                  <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-indigo-600">Pricing</button></li>
                </ul>
             </div>

             <div className="space-y-4 md:space-y-8">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-[8px] md:text-[10px] border-b border-slate-100 pb-2 md:pb-4">Legal</h4>
                <ul className="text-slate-500 space-y-3 md:space-y-5 text-[10px] md:text-sm font-bold tracking-wide uppercase">
                  <li><button onClick={() => onViewChange('privacy-policy')} className="hover:text-indigo-600">Privacy Policy</button></li>
                  <li><button onClick={() => onViewChange('terms-of-service')} className="hover:text-indigo-600">Terms of Service</button></li>
                  <li><button onClick={() => onViewChange('commercial-use')} className="hover:text-indigo-600">Commercial Use</button></li>
                </ul>
             </div>
          </div>
          <div className="pt-8 md:pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 text-center">© 2025 High Shot AI Studio • Pro SaaS UI</span>
            <div className="flex items-center gap-2 text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span> All Systems Operational
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 z-[60] pointer-events-none">
        <button 
          onClick={onStart} 
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-2xl pointer-events-auto active:scale-95 transition-transform"
        >
          Start Free Trial
        </button>
      </div>
    </div>
  );
};

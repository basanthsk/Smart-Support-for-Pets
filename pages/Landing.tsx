
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Users, 
  Heart, 
  ChevronDown, 
  Moon, 
  Search,
  Zap,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768234409/SS_Paw_Pal_Logo_aceyn8.png";
  const HERO_IMAGE = "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=1200"; // High-quality pet group image

  return (
    <div className="min-h-screen bg-[#111315] text-white font-inter selection:bg-[#ff8c52] selection:text-white">
      {/* Header Navigation */}
      <header className="fixed top-0 inset-x-0 h-24 z-[100] backdrop-blur-md border-b border-white/5 bg-[#111315]/80 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-full p-2 flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 shadow-lg">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black tracking-tighter whitespace-nowrap">
              Pawsitive <span className="text-[#ff8c52]">Community</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <LayoutDashboard size={16} /> Home
            </Link>
            <Link to="/terms" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">About Us</Link>
            <Link to="/privacy" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Contact</Link>
            <div className="relative group cursor-pointer">
              <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors flex items-center gap-2">
                Explore <ChevronDown size={14} />
              </span>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-full border border-white/5">
             <div className="p-1.5 bg-[#ff8c52] rounded-full">
               <Moon size={12} className="text-white fill-white" />
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <Users size={14} className="text-[#5ed5a8]" />
               <span className="text-white">2 online</span>
             </div>
          </div>

          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
          >
            Sign In
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="hidden sm:flex px-8 py-3 bg-[#ff8c52] hover:bg-[#ff7a36] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-[#ff8c52]/20 transition-all active:scale-95"
          >
            Join the Pack
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#ff8c52]/10 border border-[#ff8c52]/20 rounded-full">
              <Sparkles size={16} className="text-[#ff8c52]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff8c52]">The Connected Pet Ecosystem</span>
              <Zap size={14} className="text-[#ff8c52]" />
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]">
              Your Digital<br />
              <span className="text-[#ff8c52]">Town Square</span><br />
              for Pet Parents
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
              Connect, share, and support fellow pet lovers in a unified community. Get <span className="text-[#ff8c52] border-b-2 border-[#ff8c52]/30">AI-powered advice</span>, discover local events, and celebrate your furry friends together.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-10 h-20 bg-gradient-to-r from-[#ff8c52] to-[#5ed5a8] text-white rounded-full font-black text-lg tracking-tight hover:opacity-90 transition-all shadow-2xl shadow-[#ff8c52]/30 active:scale-95 flex items-center justify-center gap-4"
              >
                Join the Community
                <ArrowRight size={20} />
              </button>
              
              <button className="w-full sm:w-auto px-10 h-20 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-black text-lg tracking-tight transition-all active:scale-95 flex items-center justify-center gap-4">
                <div className="p-2 bg-white/5 rounded-full">
                   <Play size={16} fill="currentColor" />
                </div>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Column - Visuals */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
             {/* Hero Image Container */}
             <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
               <img src={HERO_IMAGE} alt="Community" className="w-full h-[600px] object-cover transition-transform duration-[20s] linear infinite group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-transparent to-transparent opacity-60" />
               
               {/* "Live Community" Tag */}
               <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Live Community</span>
               </div>

               {/* Center Badge Overlay */}
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <h3 className="text-4xl font-black text-white drop-shadow-2xl">Pet Community</h3>
                  <div className="flex gap-1 mt-2 opacity-60">
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>
               </div>
             </div>

             {/* Floating UI Card 1: AI Advice */}
             <div className="absolute -top-10 -right-6 md:-right-10 p-6 bg-[#1c1f23]/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl max-w-[240px] animate-bounce-slow">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-emerald-400 rounded-2xl shadow-lg shadow-emerald-400/20">
                      <Sparkles size={24} className="text-[#111315]" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black leading-tight tracking-tight">AI-Powered</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Smart pet advice</p>
                   </div>
                </div>
             </div>

             {/* Floating UI Card 2: Stats */}
             <div className="absolute -bottom-10 -left-6 md:-left-10 p-8 bg-[#1c1f23]/95 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl min-w-[280px] animate-float">
                <div className="flex items-center gap-6">
                   <div className="p-5 bg-[#ff8c52] rounded-[1.5rem] shadow-lg shadow-[#ff8c52]/20">
                      <Heart size={32} className="text-white fill-white" />
                   </div>
                   <div>
                      <h4 className="text-2xl font-black leading-tight tracking-tight">Active Community</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Join 50K+ members</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Features / Social Proof Section */}
        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 pt-20 border-t border-white/5">
           <div className="space-y-2">
             <h5 className="text-4xl font-black tracking-tight">24/7</h5>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Expert AI Support</p>
           </div>
           <div className="space-y-2">
             <h5 className="text-4xl font-black tracking-tight">100%</h5>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Privacy</p>
           </div>
           <div className="space-y-2">
             <h5 className="text-4xl font-black tracking-tight">50k+</h5>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Happy Parents</p>
           </div>
           <div className="space-y-2">
             <h5 className="text-4xl font-black tracking-tight">Free</h5>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">To Begin Journey</p>
           </div>
        </div>
      </main>

      {/* Floating Action Button (Chat placeholder) */}
      <div className="fixed bottom-10 right-10 z-[110]">
        <button className="w-16 h-16 bg-[#ff8c52] rounded-full flex items-center justify-center shadow-2xl shadow-[#ff8c52]/40 hover:scale-110 transition-transform active:scale-95 group">
           <div className="relative">
             <Users size={24} className="text-white" />
             <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#ff8c52]" />
           </div>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;

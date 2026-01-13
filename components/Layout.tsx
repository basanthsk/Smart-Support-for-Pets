
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User as UserIcon, Trash2, CheckCircle2, AlertTriangle, Info, X, Search, Settings as SettingsIcon, Dog, Sparkles } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNotifications, AppNotification } from '../context/NotificationContext';
import { Link, useLocation } from "react-router-dom";
import { AppRoutes } from '../types';

interface NotificationItemProps { 
  notif: AppNotification; 
  onMarkRead: (id: string) => void; 
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notif, onMarkRead }) => {
  const Icon = notif.type === 'warning' ? AlertTriangle : notif.type === 'success' ? CheckCircle2 : Info;
  const colorClass = notif.type === 'warning' ? 'text-amber-500 bg-amber-50' : notif.type === 'success' ? 'text-emerald-500 bg-emerald-50' : 'text-indigo-500 bg-indigo-50';

  return (
    <div 
      className={`p-4 hover:bg-slate-50 transition-colors border-b border-black/5 flex gap-4 items-start ${!notif.read ? 'bg-indigo-50/20' : ''}`}
      onClick={() => onMarkRead(notif.id)}
    >
      <div className={`p-2 rounded-xl shrink-0 border-2 border-black ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 space-y-0.5">
        <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight">{notif.title}</h5>
        <p className="text-xs text-slate-500 font-bold leading-relaxed">{notif.message}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const notifRef = useRef<HTMLDivElement>(null);

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768234409/SS_Paw_Pal_Logo_aceyn8.png";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === AppRoutes.HOME) return "🏠 Home Base";
    if (path === AppRoutes.AI_ASSISTANT) return "🤖 Magic AI";
    if (path === AppRoutes.PET_CARE) return "✨ Daily Fun";
    if (path === AppRoutes.CREATE_POST) return "📸 Pet Pics";
    if (path === AppRoutes.CHAT) return "💬 Chat Box";
    if (path === AppRoutes.PET_PROFILE) return "🐕 My Pet";
    if (path === AppRoutes.SETTINGS) return "⚙️ Settings";
    if (path === AppRoutes.HEALTH_CHECKUP) return "🏥 Vet Help"; // Add this line
    return "SS Paw Pal";
  };

  return (
    /* OUTER WRAPPER: Dotted Notebook Background */
    <div className="min-h-screen w-full bg-[#fef9c3] flex flex-col items-center">
      
      {/* 
          MAIN APP CONTAINER: 
          - 100% width on Mobile 
          - 80% width on Desktop (md:w-[80%])
          - Centered with mx-auto
          - Thick borders and hard shadow 
      */}
      <div className="w-full md:w-[80%] mx-auto h-screen flex overflow-hidden border-x-4 border-black bg-white shadow-[20px_0_60px_-15px_rgba(0,0,0,0.1)] relative">
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <header className="h-24 bg-white border-b-4 border-black flex items-center justify-between px-6 md:px-10 z-40">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="md:hidden p-3 border-2 border-black rounded-xl hover:bg-yellow-100 transition-all active:scale-90"
              >
                <Menu size={24} />
              </button>
              
              <div className="hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5">Where am I? / {getPageTitle()}</p>
                <h2 className="text-3xl font-black text-black tracking-tighter">{getPageTitle()}</h2>
              </div>

              <Link to={AppRoutes.HOME} className="flex items-center gap-3 md:hidden active:scale-95 transition-transform">
                <div className="w-10 h-10 bg-white border-2 border-black rounded-full p-1 shadow-[2px_2px_0px_0px_#000]">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center relative group">
                <Search size={18} className="absolute left-4 text-black group-focus-within:text-purple-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find something cool..." 
                  className="bg-slate-50 border-2 border-black rounded-full py-2.5 pl-11 pr-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all w-48 xl:w-64"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)} 
                    className={`p-3 border-2 border-black rounded-xl transition-all relative ${isNotifOpen ? 'bg-purple-500 text-white shadow-none translate-x-0.5 translate-y-0.5' : 'bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:bg-purple-50'}`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-black text-[10px] font-black text-white flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-6 w-80 md:w-96 bg-white border-4 border-black rounded-[2rem] shadow-[10px_10px_0px_0px_#000] overflow-hidden z-[100] animate-in zoom-in-95 origin-top-right">
                      <div className="p-6 bg-yellow-100 border-b-4 border-black flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-black text-black">What's New! 📬</h4>
                          <p className="text-[10px] text-black/60 font-black uppercase">Unread Messages: {unreadCount}</p>
                        </div>
                        <button 
                          onClick={clearAll} 
                          className="p-2 border-2 border-black rounded-xl bg-white hover:bg-red-50 text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="max-h-[350px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-16 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 border-2 border-black border-dashed rounded-full flex items-center justify-center mx-auto">
                              <Bell className="text-slate-200" size={32} />
                            </div>
                            <p className="text-slate-400 font-black text-sm italic">Nothing yet! Go explore! 🐾</p>
                          </div>
                        ) : (
                          notifications.map(notif => <NotificationItem key={notif.id} notif={notif} onMarkRead={markAsRead} />)
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="h-10 w-1 bg-black hidden md:block rounded-full"></div>
              
              <Link 
                to={AppRoutes.SETTINGS}
                className="flex items-center gap-3 p-1 pr-4 bg-white border-2 border-black rounded-full hover:bg-slate-50 transition-all shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-black bg-white">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon size={20} className="m-2 text-slate-300" />
                  )}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-sm font-black text-black leading-none truncate max-w-[100px]">{user?.displayName || 'Pet Parent'}</p>
                  <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mt-0.5">Cool Parent 😎</p>
                </div>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth custom-scrollbar">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
            
            <footer className="mt-20 py-10 border-t-4 border-black text-center bg-slate-50/50 rounded-t-[3rem]">
               <div className="flex items-center justify-center gap-3 text-black font-black text-sm uppercase tracking-widest">
                 <Dog size={16} /> SS PAW PAL IS THE BEST! <Sparkles size={16} />
               </div>
               <p className="text-slate-400 font-bold text-[10px] mt-4 uppercase tracking-widest">MY COOL PROJECT © 2025</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

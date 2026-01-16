
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User as UserIcon, Trash2, CheckCircle2, AlertTriangle, Info, Search } from 'lucide-react';
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
      className={`p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 flex gap-4 items-start cursor-pointer ${!notif.read ? 'bg-indigo-50/10' : ''}`}
      onClick={() => onMarkRead(notif.id)}
    >
      <div className={`p-2.5 rounded-xl shrink-0 ${colorClass} shadow-sm`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 space-y-1">
        <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{notif.title}</h5>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{notif.message}</p>
        <p className="text-[9px] text-slate-300 font-bold uppercase mt-2">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
    if (path === AppRoutes.HOME) return "Overview";
    if (path === AppRoutes.AI_ASSISTANT) return "AI Assistant";
    if (path === AppRoutes.PET_CARE) return "Care & Wellness";
    if (path === AppRoutes.CREATE_POST) return "Community Feed";
    if (path === AppRoutes.CHAT) return "Direct Messages";
    if (path === AppRoutes.PET_PROFILE) return "Companion Registry";
    if (path === AppRoutes.SETTINGS) return "Profile Settings";
    return "SS Paw Pal";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 z-40 shrink-0 sticky top-0">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-900 tracking-tighter md:block hidden">{getPageTitle()}</h2>
              <div className="flex items-center gap-2 md:hidden">
                 <div className="w-8 h-8 rounded-lg bg-theme flex items-center justify-center p-1.5 shadow-sm">
                    <img src="https://res.cloudinary.com/dazlddxht/image/upload/v1768234409/SS_Paw_Pal_Logo_aceyn8.png" className="w-full h-full object-contain invert" />
                 </div>
                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{getPageTitle()}</h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)} 
                className={`p-3 rounded-2xl transition-all relative ${isNotifOpen ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
              >
                <Bell size={18} strokeWidth={2.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="p-5 bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Notification Center</h4>
                    <button onClick={clearAll} className="p-2 text-slate-400 hover:text-rose-500 transition-all rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-20 text-center flex flex-col items-center gap-4">
                         <div className="p-4 bg-slate-50 rounded-full text-slate-200">
                            <Bell size={32} />
                         </div>
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">All Caught Up!</p>
                      </div>
                    ) : (
                      notifications.map(notif => <NotificationItem key={notif.id} notif={notif} onMarkRead={markAsRead} />)
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-100 mx-1"></div>

            <Link 
              to={AppRoutes.SETTINGS}
              className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm transition-all group-hover:border-theme">
                {user?.photoURL ? (
                  <img src={user.photoURL} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <UserIcon size={16} />
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest hidden md:block">
                  {user?.displayName?.split(' ')[0] || 'Parent'}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto min-h-full flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <footer className="mt-24 py-10 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white border border-slate-100 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-theme animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
                  SS Paw Pal v1.0 • Engine Secure
                </span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

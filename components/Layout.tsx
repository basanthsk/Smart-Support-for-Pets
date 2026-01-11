
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User as UserIcon, Trash2, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNotifications, AppNotification } from '../context/NotificationContext';
/* Fix: Standardized named imports from react-router-dom */
import { Link } from "react-router-dom";
import { AppRoutes } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const NotificationItem: React.FC<{ 
  notif: AppNotification, 
  onMarkRead: (id: string) => void 
}> = ({ notif, onMarkRead }) => {
  const Icon = notif.type === 'warning' ? AlertTriangle : notif.type === 'success' ? CheckCircle2 : Info;
  const colorClass = notif.type === 'warning' ? 'text-amber-500 bg-amber-50' : notif.type === 'success' ? 'text-emerald-500 bg-emerald-50' : 'text-indigo-500 bg-indigo-50';

  return (
    <div 
      className={`p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 flex gap-4 items-start ${!notif.read ? 'bg-indigo-50/20' : ''}`}
      onClick={() => onMarkRead(notif.id)}
    >
      <div className={`p-2 rounded-xl shrink-0 ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 space-y-0.5">
        <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight">{notif.title}</h5>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{notif.message}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const notifRef = useRef<HTMLDivElement>(null);

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768111415/Smart_Support_for_Pets_tpteed.png";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-90"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            
            <Link to={AppRoutes.HOME} className="flex items-center gap-3 md:hidden active:scale-95 transition-transform group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl p-1 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <h1 className="text-sm font-black text-slate-800 tracking-tight leading-none">Smart Support for Pets</h1>
            </Link>

            <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Platform</span>
                  <span className="text-slate-200">/</span>
                  <span className="text-sm text-slate-500 font-bold">Dashboard Overview</span>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-3 rounded-2xl transition-all relative group ${isNotifOpen ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
              >
                <Bell size={20} className={!isNotifOpen ? "group-hover:rotate-12 transition-transform" : ""} />
                {unreadCount > 0 && (
                  <span className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-black text-white ${isNotifOpen ? 'bg-rose-500 border-indigo-600' : 'bg-rose-500'}`}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-4 duration-300">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-800 tracking-tight">Notification Center</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Recent Activity</p>
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAll}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Clear all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-16 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <Bell size={28} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 italic">No alerts right now.</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <NotificationItem 
                          key={notif.id} 
                          notif={notif} 
                          onMarkRead={markAsRead} 
                        />
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                      <button 
                        onClick={() => setIsNotifOpen(false)}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all"
                      >
                        Dismiss Center
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="h-10 w-px bg-slate-100 mx-1 hidden md:block"></div>
            
            <button className="flex items-center gap-3 p-1.5 pr-4 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100">
              <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <UserIcon size={20} />
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Account</p>
                <p className="text-sm font-black text-slate-700 mt-0.5">
                  {user?.displayName || 'User'}
                </p>
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-slate-50/30">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
          border: 2px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Layout;


import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  MessageSquare, 
  PlusSquare, 
  Dog, 
  LogOut, 
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Sparkles,
  Send,
  User as UserIcon,
  LayoutGrid,
  Bell
} from 'lucide-react';
import { AppRoutes } from '../types';
import { logout } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuGroups = [
    {
      title: "Explore",
      items: [
        { label: 'Dashboard', path: AppRoutes.HOME, icon: Home },
        { label: 'AI Assistant', path: AppRoutes.AI_ASSISTANT, icon: MessageSquare },
        { label: 'Daily Care', path: AppRoutes.PET_CARE, icon: Sparkles },
      ]
    },
    {
      title: "Connect",
      items: [
        { label: 'Community', path: AppRoutes.CREATE_POST, icon: PlusSquare },
        { label: 'Messages', path: AppRoutes.CHAT, icon: Send },
      ]
    },
    {
      title: "Family",
      items: [
        { label: 'Health Hub', path: AppRoutes.HEALTH_CHECKUP, icon: Stethoscope },
        { label: 'Pet Profiles', path: AppRoutes.PET_PROFILE, icon: Dog },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Sidebar logout error:", error);
    }
  };

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768111415/Smart_Support_for_Pets_tpteed.png";

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-500 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Main Sliding Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] bg-white/90 backdrop-blur-3xl border-r border-slate-200/60
        transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'md:w-20' : 'lg:w-[10vw] md:w-64'}
        flex flex-col shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)]
      `}>
        
        {/* Logo/Brand Area */}
        <div className="h-24 flex items-center px-6 shrink-0">
          <Link 
            to={AppRoutes.HOME}
            className={`flex items-center gap-3 transition-all duration-500 ${isCollapsed && !isOpen ? 'justify-center w-full' : ''}`}
          >
            <div className="w-10 h-10 bg-theme rounded-xl p-2 shadow-lg shadow-theme/30 flex-shrink-0 flex items-center justify-center transition-transform hover:rotate-6 active:scale-90">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            {(!isCollapsed || isOpen) && (
              <div className="overflow-hidden animate-in fade-in slide-in-from-left-2">
                <span className="font-black text-slate-900 whitespace-nowrap tracking-tighter text-base leading-tight block">Smart Support</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-theme">for pets</span>
              </div>
            )}
          </Link>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute top-7 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar pt-4">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              {(!isCollapsed || isOpen) && (
                <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 animate-in fade-in duration-700">
                  {group.title}
                </h3>
              )}
              
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                        ${isActive 
                          ? 'bg-theme text-white shadow-xl shadow-theme/30' 
                          : 'text-slate-500 hover:bg-theme/5 hover:text-theme'}
                        ${isCollapsed && !isOpen ? 'md:justify-center' : ''}
                      `}
                    >
                      <item.icon size={18} className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      
                      {(!isCollapsed || isOpen) ? (
                        <span className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                      ) : (
                        /* Modern Tooltip for Collapsed View */
                        <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-[100] translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl shadow-black/20">
                          {item.label}
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                        </div>
                      )}
                      
                      {isActive && isCollapsed && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Profile / Bottom Action Section */}
        <div className="p-4 space-y-4">
          <div className="h-px bg-slate-100 mx-2 opacity-50" />
          
          <div className={`p-2 rounded-[2rem] bg-slate-50/50 border border-slate-200/40 flex flex-col gap-1 transition-all duration-300`}>
            <Link 
              to={AppRoutes.SETTINGS}
              className={`flex items-center gap-3 p-2 rounded-2xl transition-all hover:bg-white hover:shadow-md group
                ${isCollapsed && !isOpen ? 'justify-center' : ''}
              `}
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><UserIcon size={16} /></div>
                )}
              </div>
              {(!isCollapsed || isOpen) && (
                <div className="min-w-0 overflow-hidden">
                  <p className="text-xs font-black text-slate-800 truncate leading-none">{user?.displayName?.split(' ')[0] || 'Parent'}</p>
                  <p className="text-[8px] font-bold text-slate-400 truncate uppercase mt-1">Profile</p>
                </div>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 group
                ${isCollapsed && !isOpen ? 'justify-center' : ''}
              `}
            >
              <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
              {(!isCollapsed || isOpen) && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>}
            </button>
          </div>
        </div>

        {/* Floating Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            hidden md:flex absolute -right-4 top-12 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)]
            items-center justify-center text-slate-400 hover:text-theme transition-all z-[80] 
            hover:scale-110 active:scale-90
          `}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;

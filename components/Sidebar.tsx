
// Fix: Added React import to resolve "Cannot find namespace 'React'" errors.
import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
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
  UserSearch,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Zap
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
      title: "Core",
      items: [
        { label: 'Dashboard', path: AppRoutes.HOME, icon: LayoutDashboard },
        { label: 'AI Assistant', path: AppRoutes.AI_ASSISTANT, icon: Sparkles },
        { label: 'Wellness', path: AppRoutes.PET_CARE, icon: Stethoscope },
      ]
    },
    {
      title: "Social",
      items: [
        { label: 'Moments', path: AppRoutes.CREATE_POST, icon: PlusSquare },
        { label: 'Messages', path: AppRoutes.CHAT, icon: Send },
        { label: 'Discovery', path: AppRoutes.FIND_FRIENDS, icon: UserSearch },
      ]
    },
    {
      title: "Configuration",
      items: [
        { label: 'Companions', path: AppRoutes.PET_PROFILE, icon: Dog },
        { label: 'Settings', path: AppRoutes.SETTINGS, icon: Settings },
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

  const LOGO_URL = "https://res.cloudinary.com/dazlddxht/image/upload/v1768234409/SS_Paw_Pal_Logo_aceyn8.png";

  const allItems = useMemo(() => menuGroups.flatMap(g => g.items), [menuGroups]);
  const activeIndex = allItems.findIndex(item => item.path === location.pathname);

  const calculateIndicatorStyle = () => {
    if (activeIndex === -1) return { display: 'none' };
    
    let offset = 24; // Initial padding-top of the nav container
    let found = false;
    let count = 0;

    for (const group of menuGroups) {
      if (!isCollapsed) offset += 32; // Header + margin
      
      for (const item of group.items) {
        if (count === activeIndex) {
          found = true;
          break;
        }
        offset += 52; // Item height + gap
        count++;
      }
      if (found) break;
      offset += 32; // Extra gap between groups
    }

    return {
      transform: `translateY(${offset}px)`,
      width: isCollapsed ? '52px' : 'calc(100% - 24px)',
      left: isCollapsed ? '18px' : '12px',
      height: '48px',
      display: 'block'
    };
  };

  return (
    <>
      {/* Mobile Backdrop - Enhanced Blur */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-500 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Modern Slide Navigation Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] 
        bg-white border-r border-slate-100/80
        sidebar-transition
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-[88px]' : 'lg:w-[280px] md:w-[240px]'}
        flex flex-col shadow-2xl md:shadow-none overflow-hidden
      `}>
        
        {/* Top Branding Section */}
        <div className="h-24 flex items-center px-6 shrink-0 border-b border-slate-50/60 relative z-10">
          <Link to={AppRoutes.HOME} className="flex items-center gap-4 group">
            <div className="w-11 h-11 bg-white border border-slate-100 rounded-2xl p-2 flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg] group-hover:border-theme/30">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                <span className="font-black text-slate-900 tracking-tighter text-xl leading-none">
                  SS Paw Pal
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    AI Online
                  </span>
                </div>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden ml-auto p-2 text-slate-400 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Section with Bouncy Sliding Indicator */}
        <nav className="flex-1 px-3 py-6 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Dynamic Active Indicator Pill */}
          <div className="nav-indicator" style={calculateIndicatorStyle()} />

          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="mb-8 last:mb-0">
              {!isCollapsed && (
                <h3 className="px-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 animate-in fade-in slide-in-from-bottom-1">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1 relative z-10">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        group relative flex items-center gap-4 px-4 h-[48px] rounded-2xl transition-all duration-300
                        ${isActive 
                          ? 'text-white' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'}
                        ${isCollapsed ? 'justify-center px-0' : ''}
                      `}
                    >
                      <item.icon 
                        size={20} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`shrink-0 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110 group-hover:text-slate-900'}`} 
                      />
                      
                      {!isCollapsed && (
                        <span className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.label}
                        </span>
                      )}

                      {/* Floating Tooltips (Collapsed State) */}
                      {isCollapsed && (
                        <div className="absolute left-[calc(100%+16px)] px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-[100] whitespace-nowrap shadow-2xl tooltip-pop">
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 rounded-sm" />
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card & Logout - Reimagined */}
        <div className="p-4 relative z-10 bg-white">
          <div className="bg-slate-50/50 border border-slate-100/50 rounded-[2rem] p-3 space-y-2 group/card transition-all hover:bg-slate-50 hover:shadow-sm">
            {!isCollapsed ? (
              <Link to={AppRoutes.SETTINGS} className="flex items-center gap-3 p-2 hover:bg-white rounded-2xl transition-all group/user">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-sm transition-all group-hover/user:border-theme group-hover/user:shadow-md">
                  {user?.photoURL ? (
                    <img src={user.photoURL} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                       <UserIcon size={20} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate tracking-tight">{user?.displayName || 'Pet Parent'}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">Manage Profile</p>
                </div>
              </Link>
            ) : (
              <Link to={AppRoutes.SETTINGS} className="flex justify-center p-1">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover/card:border-theme transition-all">
                   {user?.photoURL ? (
                    <img src={user.photoURL} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={18} className="text-slate-300" />
                  )}
                </div>
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 h-12 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest
                text-slate-400 hover:text-rose-500 hover:bg-rose-50/80 
                ${isCollapsed ? 'justify-center' : 'px-4'}
              `}
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>

        {/* Desktop Collapse Controller - Styled Pill */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-24 w-8 h-8 bg-white border border-slate-100 rounded-full items-center justify-center text-slate-400 hover:text-theme shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all z-50 hover:scale-110 active:scale-90 group"
        >
          {isCollapsed ? <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
